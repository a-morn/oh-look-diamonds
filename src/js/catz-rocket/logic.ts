import debugOptions from '../debug-options'
import { DiamondEnum } from '../initialize-stage'

const LIMIT_VELOCITY = 30
const MAX_DIAMOND_FUEL = 10

export enum CatzStateEnum {
  Normal,
  Uploop,
  Downloop,
  SecondUploop,
  SecondDownloop,
  Slingshot,
  TerminalVelocity,
  EmergencyBoost,
  SlammerReady,
  Slammer,
  Frenzy,
  FrenzyUploop,
  FellOffRocket,
  OutOfFuel,
  OutOfFuelUpsideDown,
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
  catzVelocity: -20,
  rocketRotation: 0,
  isHit: false,
  isWounded: false,
  frenzyTimer: 0,
  frenzyCount: 0,
  heightOffset: 0,
  isCrashed: false,
  frenzyReady: false,
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
  rocketInAnimation: boolean
): CatzStateEnum | null {
  state.catzVelocity += (gravWindSum * delta) / 1000
  state.heightOffset += (20 * state.catzVelocity * delta) / 1000
  if (state.catzVelocity >= LIMIT_VELOCITY) {
    state.catzVelocity = LIMIT_VELOCITY
    if (canChangeToTerminal) {
      return CatzStateEnum.TerminalVelocity
    }
  }
  if (rotate && !rocketInAnimation) {
    if (
      !fellOff ||
      state.rocketRotation <= -270 ||
      state.rocketRotation > -90
    ) {
      state.rocketRotation = (Math.atan(state.catzVelocity / 40) * 360) / 3.14
    } else if (state.rocketRotation <= -180 && state.rocketRotation > -270) {
      state.rocketRotation = (-Math.atan(state.catzVelocity / 40) * 360) / 3.14
    }
  }

  return null
}

function checkFuel(
  mightBeUpsideDown: boolean,
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  if (state.diamondFuel === 0) {
    // glass.gotoAndPlay('outOfFuel');

    removeAnimationOnRocket()
    if (mightBeUpsideDown) {
      if (state.rocketRotation <= -90 && state.rocketRotation >= -270) {
        state.isHit = true
        return CatzStateEnum.OutOfFuelUpsideDown
      }
      return CatzStateEnum.OutOfFuel
    }
    return CatzStateEnum.OutOfFuel
  }

  return null
}

function updateNormal(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  return (
    updateBase(grav + wind, delta, true, false, true, rocketInAnimation) ||
    checkFuel(false, removeAnimationOnRocket)
  )
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
  rocketInAnimation: boolean
): CatzStateEnum | null {
  const newStateEndLoop = catzEndLoop()
  if (newStateEndLoop) {
    return newStateEndLoop
  }
  return updateBase(grav + wind, delta, false, false, true, rocketInAnimation)
}

function updateOutOfFuel(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean
): CatzStateEnum | null {
  const newStateUpdateBase = updateBase(
    grav + wind,
    delta,
    false,
    true,
    true,
    rocketInAnimation
  )
  if (newStateUpdateBase) {
    return newStateUpdateBase
  }

  if (state.diamondFuel > 0) {
    return CatzStateEnum.Normal
  }

  return null
}

function updateOutOfFuelUpsideDown(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean
): CatzStateEnum | null {
  return updateBase(grav + wind, delta, false, true, false, rocketInAnimation)
}

function updateFrenzy2(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean
): CatzStateEnum | null {
  return updateBase(
    0.5 * (grav + wind),
    delta,
    false,
    false,
    true,
    rocketInAnimation
  )
}

function updateFrenzyUploop(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean
): CatzStateEnum | null {
  return updateBase(
    -0.5 * (2.3 * grav - wind),
    delta,
    false,
    false,
    true,
    rocketInAnimation
  )
}

function updateTerminal(
  delta: number,
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  state.heightOffset += (20 * state.catzVelocity * delta) / 1000
  state.rocketRotation = -280
  return checkFuel(false, removeAnimationOnRocket)
}

function updateEmergency(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  const newStateUpdateBase = updateBase(
    -10 * grav - 3.7 * wind,
    delta,
    false,
    false,
    true,
    rocketInAnimation
  )
  if (newStateUpdateBase) {
    return newStateUpdateBase
  }

  if (state.rocketRotation < 0) {
    return CatzStateEnum.Uploop
  }
  return checkFuel(false, removeAnimationOnRocket)
}

function updateDownloop(
  grav: number,
  wind: number,
  delta: number,
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  state.catzVelocity +=
    (((2 - 8 * Math.sin(state.rocketRotation)) * grav + 6 * wind) * delta) /
      1000 +
    0.4
  return checkFuel(true, removeAnimationOnRocket)
}

function updateSlammer(
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  if (state.rocketRotation < -250) {
    removeAnimationOnRocket()
    state.catzVelocity = LIMIT_VELOCITY
    return CatzStateEnum.TerminalVelocity
  }
  return checkFuel(true, removeAnimationOnRocket)
}

function updateUploop(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  const newState = updateBase(
    -(3.2 * grav - wind),
    delta,
    false,
    false,
    true,
    rocketInAnimation
  )
  if (newState) {
    return newState
  }
  if (state.rocketRotation < -60) {
    return CatzStateEnum.Downloop
  }
  return checkFuel(false, removeAnimationOnRocket)
}

function updateSecondUploop(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  updateBase(
    -(5.5 * grav - 2 * wind),
    delta,
    false,
    false,
    true,
    rocketInAnimation
  )
  if (!rocketInAnimation) {
    state.rocketRotation = (Math.atan(state.catzVelocity / 40) * 360) / 3.14
  }
  if (state.rocketRotation < -60) {
    state.heightOffset +=
      110 * Math.sin(((state.rocketRotation + 110) / 360) * 2 * Math.PI)

    return CatzStateEnum.SecondDownloop
  }
  return checkFuel(false, removeAnimationOnRocket)
}

function updateSecondDownloop(
  grav: number,
  wind: number,
  delta: number,
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  if (wind >= 0) {
    state.heightOffset += ((150 + 12 * wind) * delta) / 1000
  } else {
    state.heightOffset += ((150 + 40 * wind) * delta) / 1000
  }

  return checkFuel(true, removeAnimationOnRocket)
}

function updateSlingshot(
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  if (state.rocketRotation < -400) {
    removeAnimationOnRocket()
    state.heightOffset -=
      110 * Math.sin(((state.rocketRotation + 110) / 360) * 2 * Math.PI)
    state.catzVelocity = -20
    return CatzStateEnum.Normal
  }
  return checkFuel(true, removeAnimationOnRocket)
}

export function hasFrenzy(currentState: CatzStateEnum): boolean {
  return (
    currentState === CatzStateEnum.FrenzyUploop ||
    currentState === CatzStateEnum.Frenzy
  )
}

function updateFrenzy(delta: number): CatzStateEnum | null {
  state.frenzyReady =
    !hasFrenzy(state.catzState) &&
    state.frenzyCount > 0 &&
    state.diamondFuel >= MAX_DIAMOND_FUEL

  if (state.catzState === CatzStateEnum.Frenzy) {
    state.frenzyTimer += delta
    if (state.frenzyTimer > 1500) {
      state.frenzyCount = 0
      state.frenzyTimer = 0
      return CatzStateEnum.Normal
    }
  } else if (state.frenzyReady) {
    if (state.frenzyTimer > 500) {
      if (state.catzState === CatzStateEnum.SecondDownloop) {
        return CatzStateEnum.Slingshot
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
          return CatzStateEnum.FrenzyUploop
        }
        return CatzStateEnum.Frenzy
      }
    }

    state.frenzyTimer += delta
  }
  return null
}

function updateRocketSnake(): void {
  /* todo:
  const [, ...rocketSnakeKeys] = [...catzRocket.rocketSnake.children.keys()]
  for (const i of rocketSnakeKeys) {
    const kid = catzRocket.rocketSnake.children[i]
    kid.x =
      catzRocket.rocketSnake.children[i - 1].x -
      2 * Math.cos((6.28 * catzRocket.catzRocketContainer.rotation) / 360)
    kid.y = catzRocket.rocketSnake.children[i - 1].y
  } 
  if (
    state.catzState !== CatzStateEnum.SecondDownloop &&
    state.catzState !== CatzStateEnum.Slingshot
  ) {
    state.rocketSnake.children[0].x =
      -60 +
      Math.cos(
        ((catzRocket.catzRocketContainer.rotation + 101) / 360) * 2 * Math.PI
      ) *
        176
    catzRocket.rocketSnake.children[0].y =
      Math.sin(
        ((catzRocket.catzRocketContainer.rotation + 100) / 360) * 2 * Math.PI
      ) *
        232 +
      state.heightOffset
    rocketFlameContainer.x = catzRocket.catzRocketContainer.x
    rocketFlameContainer.y = catzRocket.catzRocketContainer.y
  } else {
    catzRocket.rocketSnake.children[0].x =
      -5 +
      Math.cos(
        ((catzRocket.catzRocketContainer.rotation + 110) / 360) * 2 * Math.PI
      ) *
        100
    catzRocket.rocketSnake.children[0].y =
      Math.sin(
        ((catzRocket.catzRocketContainer.rotation + 110) / 360) * 2 * Math.PI
      ) *
        120 +
      heightOffset
    rocketFlameContainer.x = catzRocket.catzRocketContainer.x
    rocketFlameContainer.y = catzRocket.catzRocketContainer.y
  }
  catzRocket.snakeLine.graphics = new createjs.Graphics()
  catzRocket.snakeLine.x = 260
  catzRocket.snakeLine.y = 200
  for (const i of rocketSnakeKeys) {
    const kid = catzRocket.rocketSnake.children[i]
    catzRocket.snakeLine.graphics.setStrokeStyle(
      catzRocket.rocketSnake.children.length * 2 - i * 2,
      1
    )
    catzRocket.snakeLine.graphics.beginStroke(flameColor)
    catzRocket.snakeLine.graphics.moveTo(kid.x - i * 5, kid.y)
    catzRocket.snakeLine.graphics.lineTo(
      catzRocket.rocketSnake.children[i - 1].x - (i - 1) * 5,
      catzRocket.rocketSnake.children[i - 1].y
    )
    catzRocket.snakeLine.graphics.endStroke()
  }
  rocketFlameContainer.rotation = catzRocket.catzRocketContainer.rotation
  */
}

function updateDependingOnState(
  grav: number,
  wind: number,
  delta: number,
  rocketInAnimation: boolean,
  removeAnimationOnRocket: () => void
): CatzStateEnum | null {
  switch (state.catzState) {
    case CatzStateEnum.Normal:
      return updateNormal(
        grav,
        wind,
        delta,
        rocketInAnimation,
        removeAnimationOnRocket
      )
    case CatzStateEnum.FellOffRocket:
      return updateFellOff(grav, wind, delta, rocketInAnimation)
    case CatzStateEnum.OutOfFuel:
      return updateOutOfFuel(grav, wind, delta, rocketInAnimation)
    case CatzStateEnum.OutOfFuelUpsideDown:
      return updateOutOfFuelUpsideDown(grav, wind, delta, rocketInAnimation)
    case CatzStateEnum.Frenzy:
      return updateFrenzy2(grav, wind, delta, rocketInAnimation)
    case CatzStateEnum.FrenzyUploop:
      return updateFrenzyUploop(grav, wind, delta, rocketInAnimation)
    case CatzStateEnum.TerminalVelocity:
      return updateTerminal(delta, removeAnimationOnRocket)
    case CatzStateEnum.EmergencyBoost:
      return updateEmergency(
        grav,
        wind,
        delta,
        rocketInAnimation,
        removeAnimationOnRocket
      )
    case CatzStateEnum.Uploop:
      return updateUploop(
        grav,
        wind,
        delta,
        rocketInAnimation,
        removeAnimationOnRocket
      )
    case CatzStateEnum.Downloop:
    case CatzStateEnum.SlammerReady:
      return updateDownloop(grav, wind, delta, removeAnimationOnRocket)
    case CatzStateEnum.Slammer:
      return updateSlammer(removeAnimationOnRocket)
    case CatzStateEnum.SecondUploop:
      return updateSecondUploop(
        grav,
        wind,
        delta,
        rocketInAnimation,
        removeAnimationOnRocket
      )
    case CatzStateEnum.SecondDownloop:
      return updateSecondDownloop(grav, wind, delta, removeAnimationOnRocket)
    case CatzStateEnum.Slingshot:
      return updateSlingshot(removeAnimationOnRocket)
    default:
      throw new Error('Unhandled case')
  }
}

export function update(
  grav: number,
  wind: number,
  delta: number,
  catzInAnimation: boolean,
  rocketInAnimation: boolean,
  onStateChange: (newStaet: CatzStateEnum) => void,
  removeAnimationOnRocket: () => void
): void {
  debugHandler()
  invincibilityCountDown(delta)
  diamondFuelLossPerTime(delta)
  const newState =
    updateFrenzy(delta) ||
    updateDependingOnState(
      grav,
      wind,
      delta,
      rocketInAnimation,
      removeAnimationOnRocket
    )
  if (newState) {
    onStateChange(newState)
  }
  // move to index?
  /*
  if (
    state.catzState !== CatzStateEnum.SecondDownloop &&
    state.catzState !== CatzStateEnum.Slingshot &&
    state.catzState !== CatzStateEnum.OutOfFuelUpsideDown
  ) {
    xScreenPosition =
      200 +
      Math.cos(
        ((state.rocketRotation + 90) / 360) * 2 * Math.PI
      ) *
        160
    yScreenPosition =
      200 +
      Math.sin(
        ((state.rocketRotation + 90) / 360) * 2 * Math.PI
      ) *
        210
  } else if (catzRocket.catzState !== CatzStateEnum.OutOfFuelUpsideDown) {
    xScreenPosition =
      255 +
      Math.cos(
        ((state.rocketRotation + 90) / 360) * 2 * Math.PI
      ) *
        80
    yScreenPosition =
      200 +
      Math.sin(
        ((state.rocketRotation + 90) / 360) * 2 * Math.PI
      ) *
        100
  } */

  /* todo
  if (state.isWounded && !catzInAnimation) {
    catz.x = -50
  } else if (!catzRocket.isWounded && !catzInAnimation) {
    catz.x = 0
  }

  if (
    catzRocket.catzRocketContainer.y > crashBorder.bottom ||
    catzRocket.catzRocketContainer.y < crashBorder.top
  ) {
    catzRocket.isCrashed = true
  }
  catzRocket.catzRocketContainer.x = xScreenPosition
  catzRocket.catzRocketContainer.y = yScreenPosition + heightOffset
  catzRocket.diamondFuel -=
    (fuelConsumption[catzRocket.catzState] * delta) / 1000
  catzRocket.diamondFuel = Math.max(catzRocket.diamondFuel, 0) */
  updateRocketSnake()
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
        throw new Error('Unhandled case')
    }
  }
}

export function catzRelease(): CatzStateEnum {
  if (state.isWounded) {
    state.isWounded = false
  }

  if (state.catzState !== CatzStateEnum.SlammerReady) {
    state.catzVelocity = Math.tan((state.rocketRotation * 3.14) / 360) * 40
    state.catzState = CatzStateEnum.SecondUploop
  } else {
    state.catzState = CatzStateEnum.Normal
    state.catzVelocity = Math.tan((state.rocketRotation * 3.14) / 360) * 40
  }

  return state.catzState
}

export function canCollide(): boolean {
  return (
    state.catzState !== CatzStateEnum.FellOffRocket &&
    !hasFrenzy(state.catzState)
  )
}

export function catzUp(): CatzStateEnum | null {
  if (
    state.diamondFuel > 0 &&
    state.catzState !== CatzStateEnum.FellOffRocket
  ) {
    if (state.catzState === CatzStateEnum.Normal) {
      state.diamondFuel -= 0.25
      state.catzVelocity -= 2
      return CatzStateEnum.Uploop
    }
    if (state.catzState === CatzStateEnum.Frenzy) {
      state.catzVelocity -= 2
      return CatzStateEnum.FrenzyUploop
    }
    if (state.catzState === CatzStateEnum.TerminalVelocity) {
      return CatzStateEnum.EmergencyBoost
    }
    if (
      state.catzState === CatzStateEnum.SlammerReady &&
      state.rocketRotation > -250
    ) {
      return CatzStateEnum.Slammer
    }
  }

  // glass.gotoAndPlay('outOfFuel');
  return null
}
