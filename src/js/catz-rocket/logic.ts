/*
 * Only pure functions
 */

import debugOptions from '../debug-options'
import { DiamondEnum } from '../types'
import { CatzStateEnum, State, hasFrenzy, UpdateResult } from './types'

const LIMIT_VELOCITY = 30
const MAX_DIAMOND_FUEL = 10
const LOOP_VELOCITY = 2

type UpdateInput = {
  grav: number
  wind: number
  delta: number
  rocketInAnimation: boolean
  removeAnimationOnRocket: () => void
  catzRocketContainerY: number
  rocketRotation: number
  diamondFuel: number
  invincibilityCounter: number
  catzVelocity: number
  heightOffset: number
  catzState: CatzStateEnum
  frenzyCount: number
  frenzyTimer: number
  frenzyReady: boolean
  isWounded: boolean
}

const fuelConsumption = {
  [CatzStateEnum.Normal]: 0.25,
  [CatzStateEnum.Uploop]: 2,
  [CatzStateEnum.Downloop]: 0.25,
  [CatzStateEnum.SecondUploop]: 3,
  [CatzStateEnum.SecondDownloop]: 0.25,
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

const crashBorder = {
  top: -1000,
  bottom: 450,
}

export function setCrashBorders(top: number, bottom: number): void {
  crashBorder.top = top
  crashBorder.bottom = bottom
}

function infiniteFuel({ diamondFuel }: UpdateInput): UpdateResult {
  const result: UpdateResult = {}
  if (debugOptions.infiniteFuel && diamondFuel < 1) {
    result.diamondFuel = 1
  }
  return result
}

function invincibilityCountDown({
  delta,
  invincibilityCounter,
}: UpdateInput): UpdateResult {
  return { invincibilityCounter: Math.max(0, invincibilityCounter - delta) }
}

function updateBase(
  {
    grav,
    wind,
    delta,
    rocketInAnimation,
    rocketRotation,
    catzVelocity,
    heightOffset,
  }: UpdateInput,
  canChangeToTerminal = true,
  isFalling = false,
  canRotate = true,
  gravMultiplier = 1,
  windMultiplier = 1
): UpdateResult {
  const result: UpdateResult = {}
  result.catzVelocity = Math.min(
    catzVelocity +
      ((gravMultiplier * grav + windMultiplier * wind) * delta) / 1000,
    LIMIT_VELOCITY
  )
  result.heightOffset = heightOffset + (20 * catzVelocity * delta) / 1000
  if (result.catzVelocity === LIMIT_VELOCITY) {
    if (canChangeToTerminal) {
      result.catzState = CatzStateEnum.TerminalVelocity
    }
  }

  if (canRotate && !rocketInAnimation) {
    if (!isFalling || rocketRotation <= -270 || rocketRotation > -90) {
      result.newRotation = (Math.atan(catzVelocity / 40) * 360) / 3.14
    }
    if (rocketRotation <= -180 && rocketRotation > -270) {
      result.newRotation = (-Math.atan(result.catzVelocity / 40) * 360) / 3.14
    }
  }

  return result
}

function checkFuel({
  removeAnimationOnRocket,
  rocketRotation,
  diamondFuel,
}: UpdateInput): UpdateResult {
  const result: UpdateResult = {}
  if (diamondFuel === 0) {
    // glass.gotoAndPlay('outOfFuel');
    removeAnimationOnRocket()
    if (rocketRotation <= -90 && rocketRotation >= -270) {
      result.isHit = true
      result.catzState = CatzStateEnum.OutOfFuelUpsideDown
    } else {
      result.catzState = CatzStateEnum.OutOfFuel
    }
  }

  return result
}

function updateNormal(input: UpdateInput): UpdateResult {
  return {
    ...updateBase(input),
    ...checkFuel(input),
  }
}

export function catzEndLoop(catzState: CatzStateEnum): UpdateResult {
  const result: UpdateResult = {}
  switch (catzState) {
    case CatzStateEnum.Uploop:
    case CatzStateEnum.SecondUploop:
    case CatzStateEnum.TerminalVelocity:
    case CatzStateEnum.EmergencyBoost: {
      result.catzState = CatzStateEnum.Normal
      break
    }
    case CatzStateEnum.SecondDownloop: {
      result.catzState = CatzStateEnum.Slingshot
      break
    }
    case CatzStateEnum.Downloop: {
      result.catzState = CatzStateEnum.SlammerReady
      break
    }
    case CatzStateEnum.FrenzyUploop: {
      result.catzState = CatzStateEnum.Frenzy
      break
    }
    default:
      result.catzState = CatzStateEnum.Normal
      break
  }
  return result
}

function updateFellOff(input: UpdateInput): UpdateResult {
  const newStateEndLoop = catzEndLoop(input.catzState)
  return { ...updateBase(input, false, true), ...newStateEndLoop }
}

function updateOutOfFuel(input: UpdateInput): UpdateResult {
  const newStateUpdateBase = updateBase(input, false, true, false)

  if (input.diamondFuel > 0) {
    return {
      ...newStateUpdateBase,
      catzState: CatzStateEnum.Normal,
    }
  }

  return {
    ...newStateUpdateBase,
  }
}

function updateOutOfFuelUpsideDown(input: UpdateInput): UpdateResult {
  return updateBase(input, false, true, false)
}

function updateFrenzy2(input: UpdateInput): UpdateResult {
  return updateBase(input, false, false, true, 0.5, 0.5)
}

function updateFrenzyUploop(input: UpdateInput): UpdateResult {
  return updateBase(input, false, false, true, -1.1, 1.1)
}

function updateTerminal(input: UpdateInput): UpdateResult {
  const result: UpdateResult = {}
  result.heightOffset =
    input.heightOffset + (20 * input.catzVelocity * input.delta) / 1000
  result.newRotation = -280
  return {
    ...checkFuel(input),
    ...result,
  }
}

function updateEmergency(input: UpdateInput): UpdateResult {
  const newStateUpdateBase = updateBase(input, false, false, true, -10, 3.7)
  const result: UpdateResult = {}

  if (input.rocketRotation < 0) {
    result.catzState = CatzStateEnum.Uploop
  }
  return { ...checkFuel(input), ...newStateUpdateBase, ...result }
}

function updateDownloop(input: UpdateInput): UpdateResult {
  const result: UpdateResult = {}
  result.catzVelocity =
    input.catzVelocity +
    (((LOOP_VELOCITY - 8 * Math.sin(input.rocketRotation)) * input.grav +
      6 * input.wind) *
      input.delta) /
      1000 +
    0.4
  return { ...checkFuel(input), ...result }
}

function updateSlammer(input: UpdateInput): UpdateResult {
  if (input.rocketRotation < -250) {
    input.removeAnimationOnRocket()
    const catzVelocity = LIMIT_VELOCITY
    return {
      ...checkFuel(input),
      catzState: CatzStateEnum.TerminalVelocity,
      catzVelocity,
    }
  }
  return checkFuel(input)
}

function updateUploop(input: UpdateInput): UpdateResult {
  const updateBaseResult = updateBase(input, false, false, true, -3.2, -3.2)
  const result: UpdateResult = {}

  if (input.rocketRotation < -60) {
    result.catzState = CatzStateEnum.Downloop
  }

  return {
    ...updateBaseResult,
    ...checkFuel(input),
    ...result,
  }
}

function updateSecondUploop(input: UpdateInput): UpdateResult {
  const updateBaesResult = updateBase(input, false, false, true, -5.5, -2)

  const result: UpdateResult = {}
  if (!input.rocketInAnimation) {
    result.newRotation = (Math.atan(input.catzVelocity / 40) * 360) / 3.14
  }
  if (result.newRotation || input.rocketRotation < -60) {
    result.heightOffset =
      input.heightOffset +
      110 *
        Math.sin(
          (((result.newRotation || input.rocketRotation) + 110) / 360) *
            2 *
            Math.PI
        )
    result.catzState = CatzStateEnum.SecondDownloop
  }
  return {
    ...updateBaesResult,
    ...checkFuel(input),
    ...result,
  }
}

function updateSecondDownloop(input: UpdateInput): UpdateResult {
  const result: UpdateResult = {}
  if (input.wind >= 0) {
    result.heightOffset =
      input.heightOffset + ((150 + 12 * input.wind) * input.delta) / 1000
  } else {
    result.heightOffset =
      input.heightOffset + ((150 + 40 * input.wind) * input.delta) / 1000
  }

  return checkFuel(input)
}

function updateSlingshot(input: UpdateInput): UpdateResult {
  const result: UpdateResult = {}
  if (input.rocketRotation < -400) {
    input.removeAnimationOnRocket()
    result.heightOffset =
      input.heightOffset -
      110 * Math.sin(((input.rocketRotation + 110) / 360) * 2 * Math.PI)
    result.catzVelocity = -20
    result.catzState = CatzStateEnum.Normal
  }
  return {
    ...checkFuel(input),
    ...result,
  }
}

function updateFrenzy(input: UpdateInput): UpdateResult {
  const result: UpdateResult = {}
  result.frenzyReady =
    !hasFrenzy(input.catzState) &&
    input.frenzyCount > 0 &&
    input.diamondFuel >= MAX_DIAMOND_FUEL

  let newState: CatzStateEnum | undefined

  if (input.catzState === CatzStateEnum.Frenzy) {
    result.frenzyTimer = input.frenzyTimer + input.delta
    if (input.frenzyTimer > 1500) {
      result.frenzyCount = 0
      result.frenzyTimer = 0
      result.catzState = CatzStateEnum.Normal
    }
  } else if (input.frenzyReady) {
    if (input.frenzyTimer > 500) {
      if (input.catzState === CatzStateEnum.SecondDownloop) {
        result.catzState = CatzStateEnum.Slingshot
      }
      if (
        input.catzState !== CatzStateEnum.Downloop &&
        input.catzState !== CatzStateEnum.SlammerReady &&
        input.catzState !== CatzStateEnum.Slammer &&
        input.catzState !== CatzStateEnum.Slingshot
      ) {
        // glass.gotoAndPlay('frenzy');
        result.diamondFuel = MAX_DIAMOND_FUEL / 2
        result.isWounded = false
        result.frenzyTimer = 0
        if (
          input.catzState === CatzStateEnum.Uploop ||
          input.catzState === CatzStateEnum.SecondUploop
        ) {
          newState = CatzStateEnum.FrenzyUploop
        }
        newState = CatzStateEnum.Frenzy
      }
    }

    result.frenzyTimer = input.frenzyTimer + input.delta
  }
  return result
}

function updateDependingOnState(input: UpdateInput): UpdateResult {
  let method: (input: UpdateInput) => UpdateResult
  switch (input.catzState) {
    case CatzStateEnum.Normal: {
      method = updateNormal
      break
    }
    case CatzStateEnum.FellOffRocket:
      method = updateFellOff
      break
    case CatzStateEnum.OutOfFuel:
      method = updateOutOfFuel
      break
    case CatzStateEnum.OutOfFuelUpsideDown:
      method = updateOutOfFuelUpsideDown
      break
    case CatzStateEnum.Frenzy:
      method = updateFrenzy2
      break
    case CatzStateEnum.FrenzyUploop:
      method = updateFrenzyUploop
      break
    case CatzStateEnum.TerminalVelocity:
      method = updateTerminal
      break
    case CatzStateEnum.EmergencyBoost:
      method = updateEmergency
      break
    case CatzStateEnum.Uploop:
      method = updateUploop
      break
    case CatzStateEnum.Downloop:
    case CatzStateEnum.SlammerReady:
      method = updateDownloop
      break
    case CatzStateEnum.Slammer:
      method = updateSlammer
      break
    case CatzStateEnum.SecondUploop:
      method = updateSecondUploop
      break
    case CatzStateEnum.SecondDownloop:
      method = updateSecondDownloop
      break
    case CatzStateEnum.Slingshot:
      method = updateSlingshot
      break
    default:
      throw new Error(`Unhandled case: ${input.catzState}`)
  }

  return method(input)
}

export function update(input: UpdateInput): UpdateResult {
  const infiniteFuelResult = infiniteFuel(input)
  invincibilityCountDown(input)
  const updateResult = {
    ...updateFrenzy(input),
    ...updateDependingOnState(input),
  }
  const result: UpdateResult = {}
  if (input.catzState !== CatzStateEnum.OutOfFuelUpsideDown) {
    if (
      input.catzState !== CatzStateEnum.SecondDownloop &&
      input.catzState !== CatzStateEnum.Slingshot
    ) {
      result.newPosition = {
        x:
          200 +
          Math.cos(((input.rocketRotation + 90) / 360) * 2 * Math.PI) * 160,
        y:
          200 +
          Math.sin(((input.rocketRotation + 90) / 360) * 2 * Math.PI) * 210 +
          input.heightOffset,
      }
    } else {
      result.newPosition = {
        x:
          255 +
          Math.cos(((input.rocketRotation + 90) / 360) * 2 * Math.PI) * 80,
        y:
          200 +
          Math.sin(((input.rocketRotation + 90) / 360) * 2 * Math.PI) * 100 +
          input.heightOffset,
      }
    }
  }

  if (
    input.catzRocketContainerY > crashBorder.bottom ||
    input.catzRocketContainerY < crashBorder.top
  ) {
    result.isCrashed = true
  }
  result.diamondFuel = Math.max(
    input.diamondFuel - (fuelConsumption[input.catzState] * input.delta) / 1000,
    0
  )

  return {
    ...updateResult,
    ...result,
    ...infiniteFuelResult,
  }
}

export function pickupDiamond(input: State, size: DiamondEnum): UpdateResult {
  const result: UpdateResult = {}

  if (input.diamondFuel < 10 && input.catzState !== CatzStateEnum.Frenzy) {
    switch (size) {
      case DiamondEnum.shard:
        result.diamondFuel = input.diamondFuel + 0.2
        result.frenzyCount = input.frenzyCount + 0.1
        break
      case DiamondEnum.great:
        result.diamondFuel = input.diamondFuel + 2
        result.frenzyCount = input.frenzyCount + 5
        break
      default:
        throw new Error(`Unhandled case: ${size}`)
    }
  }
  return result
}

export function loopDone(
  isWounded: boolean,
  catzState: CatzStateEnum,
  rocketRotation: number
): UpdateResult {
  const result: UpdateResult = {}
  if (isWounded) {
    result.isWounded = false
  }

  if (catzState === CatzStateEnum.SlammerReady) {
    result.catzState = CatzStateEnum.Normal
    result.catzVelocity = Math.tan((rocketRotation * 3.14) / 360) * 40
  } else {
    result.catzState = CatzStateEnum.SecondUploop
    result.catzVelocity = Math.tan((rocketRotation * 3.14) / 360) * 40
  }

  return result
}

export function canCollide(catzState: CatzStateEnum): boolean {
  return catzState !== CatzStateEnum.FellOffRocket && !hasFrenzy(catzState)
}

export function catzUp(
  { diamondFuel, catzState, catzVelocity }: State,
  rocketRotation: number
): UpdateResult {
  const result: UpdateResult = {}
  if (diamondFuel > 0 && catzState !== CatzStateEnum.FellOffRocket) {
    if (
      catzState === CatzStateEnum.Normal ||
      catzState === CatzStateEnum.Frenzy
    ) {
      result.catzVelocity = catzVelocity - LOOP_VELOCITY
      if (catzState === CatzStateEnum.Normal) {
        result.catzState = CatzStateEnum.Uploop
      }
      if (catzState === CatzStateEnum.Frenzy) {
        result.catzState = CatzStateEnum.FrenzyUploop
      }
    }
    if (catzState === CatzStateEnum.TerminalVelocity) {
      result.catzState = CatzStateEnum.EmergencyBoost
    }
    if (catzState === CatzStateEnum.SlammerReady && rocketRotation > -250) {
      result.catzState = CatzStateEnum.Slammer
    }
  }

  // glass.gotoAndPlay('outOfFuel');
  return result
}
