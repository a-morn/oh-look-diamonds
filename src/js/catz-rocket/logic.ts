import * as R from 'ramda'
import debugOptions from '../debug-options'
import { DiamondEnum } from '../types'
import { CatzStateEnum, hasFrenzy } from './utils'

const LIMIT_VELOCITY = 30
const MAX_DIAMOND_FUEL = 10

type UpdateResult = {
  newState?: CatzStateEnum
  newRotation?: number
  newPosition?: {
    x: number
    y: number
  }
}

const fuelConsumption = {
  [CatzStateEnum.Normal]: 0,
  [CatzStateEnum.Uploop]: 2,
  [CatzStateEnum.Downloop]: 0.7,
  [CatzStateEnum.SecondUploop]: 3,
  [CatzStateEnum.SecondDownloop]: 0.8,
  [CatzStateEnum.Slingshot]: 1,
  [CatzStateEnum.TerminalVelocity]: 0,
  [CatzStateEnum.EmergencyBoost]: 3.5,
  [CatzStateEnum.SlammerReady]: 0.7,
  [CatzStateEnum.Slammer]: 0.7,
  [CatzStateEnum.Frenzy]: 0,
  [CatzStateEnum.FrenzyUploop]: 0,
  [CatzStateEnum.FellOffRocket]: 0,
  [CatzStateEnum.OutOfFuel]: 0,
  [CatzStateEnum.OutOfFuelUpsideDown]: 0,
}

export const state = {
  invincibilityCounter: 0,
  diamondFuel: 5,
  catzState: CatzStateEnum.Normal,
  catzPreviousState: CatzStateEnum.Normal,
  catzVelocity: -20,
  isHit: false,
  isWounded: false,
  frenzyTimer: 0,
  frenzyCount: 0,
  heightOffset: 0,
  isCrashed: false,
  frenzyReady: false,
}

const crashBorder = {
  top: -1000,
  bottom: 450,
}

export function setCrashBorders(top: number, bottom: number): void {
  crashBorder.top = top
  crashBorder.bottom = bottom
}

function debugHandler(): void {
  if (debugOptions.infiniteFuel && state.diamondFuel < 1) {
    state.diamondFuel = 1
  }
}

function invincibilityCountDown(minusTime: number): void {
  if (state.invincibilityCounter > 0) {
    state.invincibilityCounter -= minusTime
  }
}

function diamondFuelLossPerTime(time: number): void {
  if (state.diamondFuel > 5) {
    state.diamondFuel -= time / 1000
  }

  if (state.diamondFuel > 10) {
    state.diamondFuel -= time / 20
  }
}

function updateBase(
  gravWindSum: number,
  delta: number,
  canChangeToTerminal: boolean,
  fellOff: boolean,
  rotate: boolean,
  rocketInAnimation: boolean,
  rocketRotation: number
): UpdateResult {
  state.catzVelocity += (gravWindSum * delta) / 1000
  state.heightOffset += (20 * state.catzVelocity * delta) / 1000
  let newState: CatzStateEnum | undefined
  let newRotation: number | undefined
  if (state.catzVelocity >= LIMIT_VELOCITY) {
    state.catzVelocity = LIMIT_VELOCITY
    if (canChangeToTerminal) {
      newState = CatzStateEnum.TerminalVelocity
    }
  }

  if (rotate && !rocketInAnimation) {
    if (!fellOff || rocketRotation <= -270 || rocketRotation > -90) {
      newRotation = (Math.atan(state.catzVelocity / 40) * 360) / 3.14
    }
    if (rocketRotation <= -180 && rocketRotation > -270) {
      newRotation = (-Math.atan(state.catzVelocity / 40) * 360) / 3.14
    }
  }

  return { newState, newRotation }
}

function checkFuel(
  mightBeUpsideDown: boolean,
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  if (state.diamondFuel === 0) {
    // glass.gotoAndPlay('outOfFuel');

    removeAnimationOnRocket()
    if (mightBeUpsideDown) {
      if (rocketRotation <= -90 && rocketRotation >= -270) {
        state.isHit = true
        return {
          newState: CatzStateEnum.OutOfFuelUpsideDown,
        }
      }
      return { newState: CatzStateEnum.OutOfFuel }
    }
    return { newState: CatzStateEnum.OutOfFuel }
  }

  return {}
}

function updateNormal(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  return {
    ...updateBase(
      grav + wind,
      delta,
      true,
      false,
      true,
      rocketInAnimation,
      rocketRotation
    ),
    ...checkFuel(false, removeAnimationOnRocket, rocketRotation),
  }
}

export function catzEndLoop(): CatzStateEnum {
  switch (state.catzState) {
    case CatzStateEnum.Uploop:
    case CatzStateEnum.SecondUploop:
    case CatzStateEnum.TerminalVelocity:
    case CatzStateEnum.EmergencyBoost: {
      return CatzStateEnum.Normal
    }
    case CatzStateEnum.SecondDownloop: {
      return CatzStateEnum.Slingshot
    }
    case CatzStateEnum.Downloop: {
      return CatzStateEnum.SlammerReady
    }
    case CatzStateEnum.FrenzyUploop: {
      return CatzStateEnum.Frenzy
    }
    default:
      return CatzStateEnum.Normal
  }
}

function updateFellOff(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  rocketRotation: number
): UpdateResult {
  const newStateEndLoop = catzEndLoop()
  if (newStateEndLoop) {
    return { newState: newStateEndLoop }
  }
  return updateBase(
    grav + wind,
    delta,
    false,
    false,
    true,
    rocketInAnimation,
    rocketRotation
  )
}

function updateOutOfFuel(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  rocketRotation: number
): UpdateResult {
  const newStateUpdateBase = updateBase(
    grav + wind,
    delta,
    false,
    true,
    true,
    rocketInAnimation,
    rocketRotation
  )

  if (state.diamondFuel > 0) {
    return {
      ...newStateUpdateBase,
      newState: CatzStateEnum.Normal,
    }
  }

  return {
    ...newStateUpdateBase,
  }
}

function updateOutOfFuelUpsideDown(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  rocketRotation: number
): UpdateResult {
  return updateBase(
    grav + wind,
    delta,
    false,
    true,
    false,
    rocketInAnimation,
    rocketRotation
  )
}

function updateFrenzy2(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  rocketRotation: number
): UpdateResult {
  return updateBase(
    0.5 * (grav + wind),
    delta,
    false,
    false,
    true,
    rocketInAnimation,
    rocketRotation
  )
}

function updateFrenzyUploop(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  rocketRotation: number
): UpdateResult {
  return updateBase(
    -0.5 * (2.3 * grav - wind),
    delta,
    false,
    false,
    true,
    rocketInAnimation,
    rocketRotation
  )
}

function updateTerminal(
  delta: number,
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  state.heightOffset += (20 * state.catzVelocity * delta) / 1000
  return {
    ...checkFuel(false, removeAnimationOnRocket, rocketRotation),
    newRotation: -280,
  }
}

function updateEmergency(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  const newStateUpdateBase = updateBase(
    -10 * grav - 3.7 * wind,
    delta,
    false,
    false,
    true,
    rocketInAnimation,
    rocketRotation
  )
  if (newStateUpdateBase) {
    return newStateUpdateBase
  }

  if (rocketRotation < 0) {
    return {
      ...checkFuel(false, removeAnimationOnRocket, rocketRotation),
      newState: CatzStateEnum.Uploop,
    }
  }
  return checkFuel(false, removeAnimationOnRocket, rocketRotation)
}

function updateDownloop(
  grav: number,
  wind: number,
  delta: number,
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  state.catzVelocity +=
    (((2 - 8 * Math.sin(rocketRotation)) * grav + 6 * wind) * delta) / 1000 +
    0.4
  return checkFuel(true, removeAnimationOnRocket, rocketRotation)
}

function updateSlammer(
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  if (rocketRotation < -250) {
    removeAnimationOnRocket()
    state.catzVelocity = LIMIT_VELOCITY
    return {
      ...checkFuel(true, removeAnimationOnRocket, rocketRotation),
      newState: CatzStateEnum.TerminalVelocity,
    }
  }
  return checkFuel(true, removeAnimationOnRocket, rocketRotation)
}

function updateUploop(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  const updateBaseResult = updateBase(
    -(3.2 * grav - wind),
    delta,
    false,
    false,
    true,
    rocketInAnimation,
    rocketRotation
  )

  const downloop =
    rocketRotation < -60 ? { newState: CatzStateEnum.Downloop } : {}

  return {
    ...updateBaseResult,
    ...downloop,
    ...checkFuel(false, removeAnimationOnRocket, rocketRotation),
  }
}

function updateSecondUploop(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  const updateBaesResult = updateBase(
    -(5.5 * grav - 2 * wind),
    delta,
    false,
    false,
    true,
    rocketInAnimation,
    rocketRotation
  )

  const newRotation = !rocketRotation
    ? (Math.atan(state.catzVelocity / 40) * 360) / 3.14
    : undefined
  if (rocketRotation < -60) {
    state.heightOffset +=
      110 * Math.sin(((rocketRotation + 110) / 360) * 2 * Math.PI)
  }
  // return CatzStateEnum.SecondDownloop
  return {
    ...updateBaesResult,
    ...checkFuel(false, removeAnimationOnRocket, rocketRotation),
    newRotation,
  }
}

function updateSecondDownloop(
  grav: number,
  wind: number,
  delta: number,
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  if (wind >= 0) {
    state.heightOffset += ((150 + 12 * wind) * delta) / 1000
  } else {
    state.heightOffset += ((150 + 40 * wind) * delta) / 1000
  }

  return checkFuel(true, removeAnimationOnRocket, rocketRotation)
}

function updateSlingshot(
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  if (rocketRotation < -400) {
    removeAnimationOnRocket()
    state.heightOffset -=
      110 * Math.sin(((rocketRotation + 110) / 360) * 2 * Math.PI)
    state.catzVelocity = -20

    return {
      ...checkFuel(true, removeAnimationOnRocket, rocketRotation),
      newState: CatzStateEnum.Normal,
    }
  }
  return {
    ...checkFuel(true, removeAnimationOnRocket, rocketRotation),
  }
}

function updateFrenzy(delta: number): UpdateResult {
  state.frenzyReady =
    !hasFrenzy(state.catzState) &&
    state.frenzyCount > 0 &&
    state.diamondFuel >= MAX_DIAMOND_FUEL

  let newState: CatzStateEnum | undefined

  if (state.catzState === CatzStateEnum.Frenzy) {
    state.frenzyTimer += delta
    if (state.frenzyTimer > 1500) {
      state.frenzyCount = 0
      state.frenzyTimer = 0
      newState = CatzStateEnum.Normal
    }
  } else if (state.frenzyReady) {
    if (state.frenzyTimer > 500) {
      if (state.catzState === CatzStateEnum.SecondDownloop) {
        newState = CatzStateEnum.Slingshot
      }
      if (
        state.catzState !== CatzStateEnum.Downloop &&
        state.catzState !== CatzStateEnum.SlammerReady &&
        state.catzState !== CatzStateEnum.Slammer &&
        state.catzState !== CatzStateEnum.Slingshot
      ) {
        // glass.gotoAndPlay('frenzy');
        state.diamondFuel = MAX_DIAMOND_FUEL / 2
        state.isWounded = false
        state.frenzyTimer = 0
        if (
          state.catzState === CatzStateEnum.Uploop ||
          state.catzState === CatzStateEnum.SecondUploop
        ) {
          newState = CatzStateEnum.FrenzyUploop
        }
        newState = CatzStateEnum.Frenzy
      }
    }

    state.frenzyTimer += delta
  }
  return { newState }
}

function updateDependingOnState(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void,
  rocketRotation: number
): UpdateResult {
  switch (state.catzState) {
    case CatzStateEnum.Normal: {
      const foo = updateNormal(
        grav,
        wind,
        delta,
        rocketInAnimation,
        removeAnimationOnRocket,
        rocketRotation
      )
      return foo
    }
    case CatzStateEnum.FellOffRocket:
      return updateFellOff(grav, wind, delta, rocketInAnimation, rocketRotation)
    case CatzStateEnum.OutOfFuel:
      return updateOutOfFuel(
        grav,
        wind,
        delta,
        rocketInAnimation,
        rocketRotation
      )
    case CatzStateEnum.OutOfFuelUpsideDown:
      return updateOutOfFuelUpsideDown(
        grav,
        wind,
        delta,
        rocketInAnimation,
        rocketRotation
      )
    case CatzStateEnum.Frenzy:
      return updateFrenzy2(grav, wind, delta, rocketInAnimation, rocketRotation)
    case CatzStateEnum.FrenzyUploop:
      return updateFrenzyUploop(
        grav,
        wind,
        delta,
        rocketInAnimation,
        rocketRotation
      )
    case CatzStateEnum.TerminalVelocity:
      return updateTerminal(delta, removeAnimationOnRocket, rocketRotation)
    case CatzStateEnum.EmergencyBoost:
      return updateEmergency(
        grav,
        wind,
        delta,
        rocketInAnimation,
        removeAnimationOnRocket,
        rocketRotation
      )
    case CatzStateEnum.Uploop:
      return updateUploop(
        grav,
        wind,
        delta,
        rocketInAnimation,
        removeAnimationOnRocket,
        rocketRotation
      )
    case CatzStateEnum.Downloop:
    case CatzStateEnum.SlammerReady:
      return updateDownloop(
        grav,
        wind,
        delta,
        removeAnimationOnRocket,
        rocketRotation
      )
    case CatzStateEnum.Slammer:
      return updateSlammer(removeAnimationOnRocket, rocketRotation)
    case CatzStateEnum.SecondUploop:
      return updateSecondUploop(
        grav,
        wind,
        delta,
        rocketInAnimation,
        removeAnimationOnRocket,
        rocketRotation
      )
    case CatzStateEnum.SecondDownloop:
      return updateSecondDownloop(
        grav,
        wind,
        delta,
        removeAnimationOnRocket,
        rocketRotation
      )
    case CatzStateEnum.Slingshot:
      return updateSlingshot(removeAnimationOnRocket, rocketRotation)
    default:
      throw new Error(`Unhandled case: ${state.catzState}`)
  }
}

export function update(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void,
  catzRocketContainerY: number,
  rocketRotation: number
): UpdateResult {
  console.log(state.catzVelocity)
  debugHandler()
  invincibilityCountDown(delta)
  diamondFuelLossPerTime(delta)
  const updateResult = {
    ...updateFrenzy(delta),
    ...updateDependingOnState(
      grav,
      wind,
      delta,
      rocketInAnimation,
      removeAnimationOnRocket,
      rocketRotation
    ),
  }
  const newPosition = {
    x: 0,
    y: 0,
  }
  if (state.catzState !== CatzStateEnum.OutOfFuelUpsideDown) {
    if (
      state.catzState !== CatzStateEnum.SecondDownloop &&
      state.catzState !== CatzStateEnum.Slingshot
    ) {
      newPosition.x =
        200 + Math.cos(((rocketRotation + 90) / 360) * 2 * Math.PI) * 160
      newPosition.y =
        200 +
        Math.sin(((rocketRotation + 90) / 360) * 2 * Math.PI) * 210 +
        state.heightOffset
    } else {
      newPosition.x =
        255 + Math.cos(((rocketRotation + 90) / 360) * 2 * Math.PI) * 80
      newPosition.y =
        200 +
        Math.sin(((rocketRotation + 90) / 360) * 2 * Math.PI) * 100 +
        state.heightOffset
    }
  }

  if (
    catzRocketContainerY > crashBorder.bottom ||
    catzRocketContainerY < crashBorder.top
  ) {
    state.isCrashed = true
  }
  state.diamondFuel -= (fuelConsumption[state.catzState] * delta) / 1000
  state.diamondFuel = Math.max(state.diamondFuel, 0)

  return { ...updateResult, newPosition }
}

export function reset(): void {
  state.frenzyCount = 0
  state.diamondFuel = 0
  state.heightOffset = 0
  state.catzVelocity = -20
}

export function start(velocity: number): void {
  state.isWounded = false
  state.isHit = false
  state.isCrashed = false
  state.catzVelocity = velocity
  state.diamondFuel = 4
}

export function pickupDiamond(size: DiamondEnum): void {
  if (state.diamondFuel < 10 && state.catzState !== CatzStateEnum.Frenzy) {
    switch (size) {
      case DiamondEnum.shard:
        state.diamondFuel += 0.2
        state.frenzyCount += 0.1
        break
      case DiamondEnum.great:
        state.diamondFuel += 2
        state.frenzyCount += 5
        break
      default:
        throw new Error(`Unhandled case: ${state.catzState}`)
    }
  }
}

export function loopDone(rocketRotation: number): CatzStateEnum {
  if (state.isWounded) {
    state.isWounded = false
  }

  let newState: CatzStateEnum | undefined

  if (state.catzState === CatzStateEnum.SlammerReady) {
    newState = CatzStateEnum.Normal
    state.catzVelocity = Math.tan((rocketRotation * 3.14) / 360) * 40
  } else {
    state.catzVelocity = Math.tan((rocketRotation * 3.14) / 360) * 40
    newState = CatzStateEnum.SecondUploop
  }

  return newState
}

export function canCollide(): boolean {
  return (
    state.catzState !== CatzStateEnum.FellOffRocket &&
    !hasFrenzy(state.catzState)
  )
}

export function catzUp(rocketRotation: number): CatzStateEnum | null {
  let newState: CatzStateEnum | null = null
  if (
    state.diamondFuel > 0 &&
    state.catzState !== CatzStateEnum.FellOffRocket
  ) {
    if (state.catzState === CatzStateEnum.Normal) {
      state.diamondFuel -= 0.25
      state.catzVelocity -= 2
      newState = CatzStateEnum.Uploop
    }
    if (state.catzState === CatzStateEnum.Frenzy) {
      state.catzVelocity -= 2
      newState = CatzStateEnum.FrenzyUploop
    }
    if (state.catzState === CatzStateEnum.TerminalVelocity) {
      newState = CatzStateEnum.EmergencyBoost
    }
    if (
      state.catzState === CatzStateEnum.SlammerReady &&
      rocketRotation > -250
    ) {
      newState = CatzStateEnum.Slammer
    }
  }

  // glass.gotoAndPlay('outOfFuel');
  return newState
}
