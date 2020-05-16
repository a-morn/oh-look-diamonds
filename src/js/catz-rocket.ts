import * as helpers from './helpers'
import * as spriteSheetData from './sprite-sheet-data'
import debugOptions from './debug-options'
import { diamondEnum } from './initialize-stage'

const catzRocketContainer = new createjs.Container()

catzRocketContainer.x = 260
catzRocketContainer.y = 200
catzRocketContainer.regY = 100
catzRocketContainer.regX = 150

let catz: createjs.Sprite

const rocketSnake = new createjs.Container()
rocketSnake.x = 0
rocketSnake.y = 0
const lightningColor = '#99ccff'
for (let i = 0, snakeAmt = 11; i < snakeAmt; i += 1) {
  const shape = new createjs.Shape()
  const x = 260 - i * 5
  const r = 9
  shape.graphics.f(lightningColor).dc(x, 200, r)
  shape.regY = 5
  shape.regX = 5
  rocketSnake.addChild(shape)
}
const snakeLine = new createjs.Shape()

const rocketFlameContainer = new createjs.Container()

export const catzRocket = {
  rocketSnake,
  snakeLine,
  catzRocketContainer,
  catzBounds: null as createjs.Rectangle | null,
  rocketFlameContainer,
  catzVelocity: -20,
  diamondFuel: 0,
  frenzyReady: false,
  catzState: 0,
  isCrashed: false,
  rocket: null as createjs.Bitmap | null,
  isHit: false,
  isWounded: false,
}

export enum catzStateEnum {
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

const MAX_DIAMOND_FUEL = 10
const flameColor = '#99ccff'
let heightOffset = 0
let frenzyCount = 0
let frenzyTimer = 0
let rocketSound: createjs.AbstractSoundInstance | null = null
let xScreenPosition = 0
let yScreenPosition = 0
let rocketFlame: createjs.Sprite

const limitVelocity = 30
const rocketSounds = {
  [catzStateEnum.Normal]: null,
  [catzStateEnum.Uploop]: 'uploop-sound',
  [catzStateEnum.Downloop]: 'downloop-sound',
  [catzStateEnum.SecondUploop]: 'second-uploop-sound',
  [catzStateEnum.SecondDownloop]: 'second-downloop-sound',
  [catzStateEnum.Slingshot]: 'slingshot-sound',
  [catzStateEnum.TerminalVelocity]: 'wind',
  [catzStateEnum.EmergencyBoost]: 'emergency-boost-sound',
  [catzStateEnum.SlammerReady]: null,
  [catzStateEnum.Slammer]: 'misc-sound',
  [catzStateEnum.Frenzy]: 'frenzy-sound',
  [catzStateEnum.FrenzyUploop]: null,
  [catzStateEnum.FellOffRocket]: 'catzScream3',
  [catzStateEnum.OutOfFuel]: null,
  [catzStateEnum.OutOfFuelUpsideDown]: null,
} as const

const fuelConsumption = {
  [catzStateEnum.Normal]: 0,
  [catzStateEnum.Uploop]: 2,
  [catzStateEnum.Downloop]: 0.7,
  [catzStateEnum.SecondUploop]: 3,
  [catzStateEnum.SecondDownloop]: 0.8,
  [catzStateEnum.Slingshot]: 1,
  [catzStateEnum.TerminalVelocity]: 0,
  [catzStateEnum.EmergencyBoost]: 3.5,
  [catzStateEnum.SlammerReady]: 0.7,
  [catzStateEnum.Slammer]: 0.7,
  [catzStateEnum.Frenzy]: 0,
  [catzStateEnum.FrenzyUploop]: 0,
  [catzStateEnum.FellOffRocket]: 0,
  [catzStateEnum.OutOfFuel]: 0,
  [catzStateEnum.OutOfFuelUpsideDown]: 0,
}

const crashBorder = {
  top: -1000,
  bottom: 450,
}

let invincibilityCounter = 0

export function init(queue: createjs.LoadQueue): void {
  catzRocket.rocket = helpers.createBitmap(queue.getResult('rocket'), {
    scaleX: 0.25,
    scaleY: 0.25,
    regX: -430,
    regY: -320,
  })

  rocketSound = createjs.Sound.play('uploop-sound')
  rocketSound.volume = 0.1
  rocketSound.stop()

  catz = helpers.createSprite(spriteSheetData.spriteSheets.rocket, 'no shake', {
    y: 5,
  })
  catz.currentFrame = 0
  catzRocket.catzRocketContainer.addChild(catzRocket.rocket, catz)
  catzRocket.catzBounds = catzRocketContainer.getTransformedBounds()

  rocketFlameContainer.addChild(
    helpers.createSprite(spriteSheetData.spriteSheets.flame, 'cycle', {
      x: 190,
      y: 200,
      regX: 40,
      regY: -37,
      alpha: 0,
    })
  )
}

export function setCrashBorders(top: number, bottom: number): void {
  crashBorder.top = top
  crashBorder.bottom = bottom
}

function invincibilityCountDown(minusTime: number): void {
  if (invincibilityCounter > 0) {
    invincibilityCounter -= minusTime
  }
}

function diamondFuelLossPerTime(time: number): void {
  if (catzRocket.diamondFuel > 5) {
    catzRocket.diamondFuel -= time / 1000
  }

  if (catzRocket.diamondFuel > 10) {
    catzRocket.diamondFuel -= time / 20
  }
}

export function hideSnake(): void {
  catzRocket.rocketSnake.alpha = 0
  catzRocket.snakeLine.alpha = 0
  catzRocket.rocketFlameContainer.alpha = 0
}

export function hasFrenzy(): boolean {
  if (
    catzRocket.catzState === catzStateEnum.FrenzyUploop ||
    catzRocket.catzState === catzStateEnum.Frenzy
  ) {
    return true
  }
  return false
}

function showSnake(): void {
  catzRocket.rocketSnake.children[0].x =
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
    heightOffset
  rocketFlameContainer.x = catzRocket.rocketSnake.children[0].x
  rocketFlameContainer.y = catzRocket.rocketSnake.children[0].y
  rocketFlameContainer.rotation = catzRocket.catzRocketContainer.rotation
  if (rocketFlame) {
    rocketFlame.gotoAndPlay('ignite')
  }
  rocketFlameContainer.alpha = 1
  catzRocket.snakeLine.alpha = 1
}

function changeState(state: catzStateEnum): void {
  catzRocket.catzState = state
  if (
    state !== catzStateEnum.SlammerReady &&
    state !== catzStateEnum.FrenzyUploop
  ) {
    if (rocketSound) {
      rocketSound.stop()
    }
    const sound = rocketSounds[state]
    if (sound !== null) {
      rocketSound = createjs.Sound.play(sound)
      rocketSound.volume = 0.5
    }
  }
  if (
    state === catzStateEnum.Normal ||
    state === catzStateEnum.TerminalVelocity ||
    state === catzStateEnum.OutOfFuel ||
    state === catzStateEnum.OutOfFuelUpsideDown
  ) {
    hideSnake()
    if (catzRocket.frenzyReady || state === catzStateEnum.TerminalVelocity) {
      catz.gotoAndPlay('shake')
    } else {
      catz.gotoAndPlay('no shake')
    }
  } else if (state !== catzStateEnum.FellOffRocket && !hasFrenzy()) {
    if (catzRocket.snakeLine.alpha === 0) {
      showSnake()
    }
    if (!catzRocket.frenzyReady) {
      catz.gotoAndPlay('shake')
    }
  } else if (state !== catzStateEnum.FellOffRocket) {
    hideSnake()
    catz.gotoAndPlay('frenzy')
  } else {
    hideSnake()
    catz.gotoAndPlay('flying')
  }
}

function updateBase(
  gravWindSum: number,
  event: createjs.Event,
  canChangeToTerminal: boolean,
  fellOff: boolean,
  rotate: boolean
): void {
  catzRocket.catzVelocity += (gravWindSum * event.delta) / 1000
  heightOffset += (20 * catzRocket.catzVelocity * event.delta) / 1000
  if (catzRocket.catzVelocity >= limitVelocity) {
    catzRocket.catzVelocity = limitVelocity
    if (canChangeToTerminal) {
      changeState(catzStateEnum.TerminalVelocity)
    }
  }
  if (
    rotate &&
    !createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer)
  ) {
    if (
      !fellOff ||
      catzRocket.catzRocketContainer.rotation <= -270 ||
      catzRocket.catzRocketContainer.rotation > -90
    ) {
      catzRocket.catzRocketContainer.rotation =
        (Math.atan(catzRocket.catzVelocity / 40) * 360) / 3.14
    } else if (
      catzRocket.catzRocketContainer.rotation <= -180 &&
      catzRocket.catzRocketContainer.rotation > -270
    ) {
      catzRocket.catzRocketContainer.rotation =
        (-Math.atan(catzRocket.catzVelocity / 40) * 360) / 3.14
    }
  }
}

function checkFuel(mightBeUpsideDown: boolean): void {
  if (catzRocket.diamondFuel === 0) {
    // glass.gotoAndPlay('outOfFuel');
    createjs.Tween.removeTweens(catzRocket.catzRocketContainer)
    if (mightBeUpsideDown) {
      if (
        catzRocket.catzRocketContainer.rotation <= -90 &&
        catzRocket.catzRocketContainer.rotation >= -270
      ) {
        changeState(catzStateEnum.OutOfFuelUpsideDown)
        catzRocket.isHit = true
      } else {
        changeState(catzStateEnum.OutOfFuel)
      }
    } else {
      changeState(catzStateEnum.OutOfFuel)
    }
  }
}

function updateNormal(grav: number, wind: number, event: createjs.Event): void {
  updateBase(grav + wind, event, true, false, true)
  checkFuel(false)
}

export function catzEndLoop(): void {
  if (
    catzRocket.catzState === catzStateEnum.Uploop ||
    catzRocket.catzState === catzStateEnum.SecondUploop ||
    catzRocket.catzState === catzStateEnum.TerminalVelocity ||
    catzRocket.catzState === catzStateEnum.EmergencyBoost
  ) {
    changeState(catzStateEnum.Normal)
  } else if (catzRocket.catzState === catzStateEnum.SecondDownloop) {
    changeState(catzStateEnum.Slingshot)
  } else if (catzRocket.catzState === catzStateEnum.Downloop) {
    changeState(catzStateEnum.SlammerReady)
  } else if (catzRocket.catzState === catzStateEnum.FrenzyUploop) {
    changeState(catzStateEnum.Frenzy)
  }
}

function updateFellOff(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  catzEndLoop()
  updateBase(grav + wind, event, false, false, true)
}

function updateOutOfFuel(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  updateBase(grav + wind, event, false, true, true)
  if (catzRocket.diamondFuel > 0) {
    changeState(catzStateEnum.Normal)
  }
}

function updateOutOfFuelUpsideDown(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  updateBase(grav + wind, event, false, true, false)
}

function updateFrenzy2(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  updateBase(0.5 * (grav + wind), event, false, false, true)
}

function updateFrenzyUploop(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  updateBase(-0.5 * (2.3 * grav - wind), event, false, false, true)
}

function updateTerminal(event: createjs.Event): void {
  heightOffset += (20 * catzRocket.catzVelocity * event.delta) / 1000
  catzRocket.catzRocketContainer.rotation = -280
  checkFuel(false)
}

function updateEmergency(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  updateBase(-10 * grav - 3.7 * wind, event, false, false, true)
  if (catzRocket.catzRocketContainer.rotation < 0) {
    changeState(catzStateEnum.Uploop)
  }
  checkFuel(false)
}

function updateDownloop(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  catzRocket.catzVelocity +=
    (((2 - 8 * Math.sin(catzRocket.catzRocketContainer.rotation)) * grav +
      6 * wind) *
      event.delta) /
      1000 +
    0.4
  checkFuel(true)
}

function updateSlammer(): void {
  if (catzRocket.catzRocketContainer.rotation < -250) {
    createjs.Tween.removeTweens(catzRocket.catzRocketContainer)
    catzRocket.catzVelocity = limitVelocity
    changeState(catzStateEnum.TerminalVelocity)
  }
  checkFuel(true)
}

function playSecondDownloopSound(): void {
  if (rocketSound) {
    rocketSound.stop()
    rocketSound = createjs.Sound.play(
      rocketSounds[catzStateEnum.SecondDownloop]
    )
  }
}

function updateSecondUploop(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  updateBase(-(5.5 * grav - 2 * wind), event, false, false, true)
  if (!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer)) {
    catzRocket.catzRocketContainer.rotation =
      (Math.atan(catzRocket.catzVelocity / 40) * 360) / 3.14
  }
  if (catzRocket.catzRocketContainer.rotation < -60) {
    heightOffset +=
      110 *
      Math.sin(
        ((catzRocket.catzRocketContainer.rotation + 110) / 360) * 2 * Math.PI
      )
    changeState(catzStateEnum.SecondDownloop)
    createjs.Tween.removeTweens(catzRocket.catzRocketContainer)
    createjs.Tween.get(catzRocket.catzRocketContainer, {
      loop: 1,
    })
      .to(
        {
          rotation: -270,
        },
        500
      )
      .to(
        {
          rotation: -420,
        },
        500
      )
      .call(playSecondDownloopSound)
  }
  checkFuel(false)
}

function updateSlingshot(): void {
  if (catzRocket.catzRocketContainer.rotation < -400) {
    createjs.Tween.removeTweens(catzRocket.catzRocketContainer)
    changeState(catzStateEnum.Normal)
    heightOffset -=
      110 *
      Math.sin(
        ((catzRocket.catzRocketContainer.rotation + 110) / 360) * 2 * Math.PI
      )
    catzRocket.catzVelocity = -20
  }
  checkFuel(true)
}

function updateSecondDownloop(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  if (wind >= 0) {
    heightOffset += ((150 + 12 * wind) * event.delta) / 1000
  } else {
    heightOffset += ((150 + 40 * wind) * event.delta) / 1000
  }

  checkFuel(true)
}

export function catzRelease(): void {
  if (catzRocket.isWounded) {
    catzRocket.isWounded = false
    catz.x = 0
  }
  if (catzRocket.catzState !== catzStateEnum.SlammerReady) {
    catzRocket.catzVelocity =
      Math.tan((catzRocket.catzRocketContainer.rotation * 3.14) / 360) * 40
    changeState(catzStateEnum.SecondUploop)
  } else {
    changeState(catzStateEnum.Normal)
    catzRocket.catzVelocity =
      Math.tan((catzRocket.catzRocketContainer.rotation * 3.14) / 360) * 40
  }
}

function updateUploop(grav: number, wind: number, event: createjs.Event): void {
  updateBase(-(3.2 * grav - wind), event, false, false, true)
  if (catzRocket.catzRocketContainer.rotation < -60) {
    /* eslint-disable no-undef */
    createjs.Tween.removeTweens(catzRocket.catzRocketContainer)
    createjs.Tween.get(catzRocket.catzRocketContainer)
      .to(
        {
          rotation: -270,
        },
        1000
      )
      .to(
        {
          rotation: -330,
        },
        350
      )
      .call(catzRelease)
    /* eslint-enable no-undef */
    changeState(catzStateEnum.Downloop)
  }
  checkFuel(false)
}

function updateFrenzy(event: createjs.Event): void {
  if (catzRocket.catzState === catzStateEnum.Frenzy) {
    frenzyTimer += event.delta
    if (frenzyTimer > 1500) {
      changeState(catzStateEnum.Normal)
      catz.gotoAndPlay('no shake')
      // glass.gotoAndPlay('still');
      if (catzRocket.rocket) {
        catzRocket.rocket.alpha = 1
      }
      frenzyCount = 0
      frenzyTimer = 0
    }
    catzRocket.frenzyReady = false
  } else if (catzRocket.frenzyReady === true) {
    frenzyTimer += event.delta
    if (frenzyTimer > 500) {
      if (catzRocket.catzState === catzStateEnum.SecondDownloop) {
        changeState(catzStateEnum.Slingshot)
      } else if (
        catzRocket.catzState !== catzStateEnum.Downloop &&
        catzRocket.catzState !== catzStateEnum.SlammerReady &&
        catzRocket.catzState !== catzStateEnum.Slammer &&
        catzRocket.catzState !== catzStateEnum.Slingshot
      ) {
        if (
          catzRocket.catzState === catzStateEnum.Uploop ||
          catzRocket.catzState === catzStateEnum.SecondUploop
        ) {
          changeState(catzStateEnum.FrenzyUploop)
        } else {
          changeState(catzStateEnum.Frenzy)
        }
        // glass.gotoAndPlay('frenzy');
        catzRocket.isWounded = false
        frenzyTimer = 0
        catzRocket.frenzyReady = false
      }
    }
  } else if (!hasFrenzy() && frenzyCount > 0) {
    if (catzRocket.diamondFuel >= MAX_DIAMOND_FUEL) {
      catzRocket.diamondFuel = MAX_DIAMOND_FUEL / 2
      catz.gotoAndPlay('frenzy ready')
      if (catzRocket.rocket) {
        catzRocket.rocket.alpha = 0
      }
      catzRocket.frenzyReady = true
      catzRocket.isWounded = false
      frenzyTimer = 0
    }
  }
}

function updateRocketSnake(): void {
  const [, ...rocketSnakeKeys] = [...catzRocket.rocketSnake.children.keys()]
  for (const i of rocketSnakeKeys) {
    const kid = catzRocket.rocketSnake.children[i]
    kid.x =
      catzRocket.rocketSnake.children[i - 1].x -
      2 * Math.cos((6.28 * catzRocket.catzRocketContainer.rotation) / 360)
    kid.y = catzRocket.rocketSnake.children[i - 1].y
  }
  if (
    catzRocket.catzState !== catzStateEnum.SecondDownloop &&
    catzRocket.catzState !== catzStateEnum.Slingshot
  ) {
    catzRocket.rocketSnake.children[0].x =
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
      heightOffset
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
}

export function update(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  invincibilityCountDown(event.delta)
  diamondFuelLossPerTime(event.delta)
  if (debugOptions.infiniteFuel && catzRocket.diamondFuel < 1) {
    catzRocket.diamondFuel = 1
  }
  switch (catzRocket.catzState) {
    case catzStateEnum.Normal:
      updateNormal(grav, wind, event)
      break
    case catzStateEnum.FellOffRocket:
      updateFellOff(grav, wind, event)
      break
    case catzStateEnum.OutOfFuel:
      updateOutOfFuel(grav, wind, event)
      break
    case catzStateEnum.OutOfFuelUpsideDown:
      updateOutOfFuelUpsideDown(grav, wind, event)
      break
    case catzStateEnum.Frenzy:
      updateFrenzy2(grav, wind, event)
      break
    case catzStateEnum.FrenzyUploop:
      updateFrenzyUploop(grav, wind, event)
      break
    case catzStateEnum.TerminalVelocity:
      updateTerminal(event)
      break
    case catzStateEnum.EmergencyBoost:
      updateEmergency(grav, wind, event)
      break
    case catzStateEnum.Uploop:
      updateUploop(grav, wind, event)
      break
    case catzStateEnum.Downloop:
    case catzStateEnum.SlammerReady:
      updateDownloop(grav, wind, event)
      break
    case catzStateEnum.Slammer:
      updateSlammer()
      break
    case catzStateEnum.SecondUploop:
      updateSecondUploop(grav, wind, event)
      break
    case catzStateEnum.SecondDownloop:
      updateSecondDownloop(grav, wind, event)
      break
    case catzStateEnum.Slingshot:
      updateSlingshot()
      break
    default:
      throw new Error('Unhandled case')
  }

  if (
    catzRocket.catzState !== catzStateEnum.SecondDownloop &&
    catzRocket.catzState !== catzStateEnum.Slingshot &&
    catzRocket.catzState !== catzStateEnum.OutOfFuelUpsideDown
  ) {
    xScreenPosition =
      200 +
      Math.cos(
        ((catzRocket.catzRocketContainer.rotation + 90) / 360) * 2 * Math.PI
      ) *
        160
    yScreenPosition =
      200 +
      Math.sin(
        ((catzRocket.catzRocketContainer.rotation + 90) / 360) * 2 * Math.PI
      ) *
        210
  } else if (catzRocket.catzState !== catzStateEnum.OutOfFuelUpsideDown) {
    xScreenPosition =
      255 +
      Math.cos(
        ((catzRocket.catzRocketContainer.rotation + 90) / 360) * 2 * Math.PI
      ) *
        80
    yScreenPosition =
      200 +
      Math.sin(
        ((catzRocket.catzRocketContainer.rotation + 90) / 360) * 2 * Math.PI
      ) *
        100
  }

  if (catzRocket.isWounded && !createjs.Tween.hasActiveTweens(catz)) {
    catz.x = -50
  } else if (!catzRocket.isWounded && !createjs.Tween.hasActiveTweens(catz)) {
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
    (fuelConsumption[catzRocket.catzState] * event.delta) / 1000
  catzRocket.diamondFuel = Math.max(catzRocket.diamondFuel, 0)
  updateFrenzy(event)
  updateRocketSnake()
}

export function getHit(isInstaGib: boolean): boolean {
  if (
    (invincibilityCounter <= 0 || isInstaGib) &&
    !hasFrenzy() &&
    !catzRocket.isHit
  ) {
    const instance = createjs.Sound.play('catz-scream-2')
    instance.volume = 0.5

    if (!catzRocket.isWounded && !isInstaGib) {
      catzRocket.isWounded = true
      catz.gotoAndPlay('slipping')
      createjs.Tween.get(catz)
        .to(
          {
            y: 10,
            x: -25,
          },
          100
        )
        .to(
          {
            x: -50,
            y: 5,
          },
          150
        )
        .call(catz.gotoAndPlay, ['no shake'])
      invincibilityCounter = 1000
      return false
    }
    catzRocket.isHit = true
    changeState(catzStateEnum.FellOffRocket)
    return true
  }
  return false
}

export function catzUp(): void {
  if (
    catzRocket.diamondFuel > 0 &&
    catzRocket.catzState !== catzStateEnum.FellOffRocket
  ) {
    if (catzRocket.catzState === catzStateEnum.Normal) {
      catzRocket.diamondFuel -= 0.25
      catzRocket.catzVelocity -= 2
      changeState(catzStateEnum.Uploop)
    } else if (catzRocket.catzState === catzStateEnum.Frenzy) {
      catzRocket.catzVelocity -= 2
      changeState(catzStateEnum.FrenzyUploop)
    } else if (catzRocket.catzState === catzStateEnum.TerminalVelocity) {
      changeState(catzStateEnum.EmergencyBoost)
    } else if (
      catzRocket.catzState === catzStateEnum.SlammerReady &&
      catzRocket.catzRocketContainer.rotation > -250
    ) {
      changeState(catzStateEnum.Slammer)
    }
  } else {
    // glass.gotoAndPlay('outOfFuel');
  }
}

export function canCollide(): boolean {
  return catzRocket.catzState !== catzStateEnum.FellOffRocket && !hasFrenzy()
}

export function reset(): void {
  createjs.Tween.removeTweens(catzRocket.catzRocketContainer)
  catzRocket.frenzyReady = false
  frenzyTimer = 0
  frenzyCount = 0
  changeState(catzStateEnum.Normal)
  catzRocket.diamondFuel = 0
  if (catzRocket.rocket) {
    catzRocket.rocket.x = 0
    catzRocket.rocket.alpha = 1
  }
  catz.alpha = 1
  catzRocket.catzRocketContainer.x = 300
  catzRocket.catzRocketContainer.y = 200
  heightOffset = 0
  catz.gotoAndPlay('no shake')
  catzRocket.catzVelocity = -20
}

export function start(velocity: number): void {
  catzRocket.isWounded = false
  catzRocket.isHit = false
  catzRocket.isCrashed = false
  hideSnake()
  catzRocket.catzVelocity = velocity
  catzRocket.diamondFuel = 4
}

export function pickupDiamond(size: diamondEnum): void {
  if (
    catzRocket.diamondFuel < 10 &&
    catzRocket.catzState !== catzStateEnum.Frenzy
  ) {
    switch (size) {
      case diamondEnum.shard:
        catzRocket.diamondFuel += 0.2
        frenzyCount += 0.1
        break
      case diamondEnum.great:
        catzRocket.diamondFuel += 2
        frenzyCount += 5
        break
      default:
        throw new Error('Unhandled case')
    }
  }
}
