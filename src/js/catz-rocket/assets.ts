import { hasFrenzy } from './logic'
import * as helpers from '../helpers'
import * as spriteSheetData from '../sprite-sheet-data'
import * as logic from './logic'

export const catzRocketContainer = new createjs.Container()
catzRocketContainer.x = 260
catzRocketContainer.y = 200
catzRocketContainer.regY = 100
catzRocketContainer.regX = 150

const rocketSounds = {
  [logic.CatzStateEnum.Normal]: null,
  [logic.CatzStateEnum.Uploop]: 'uploop-sound',
  [logic.CatzStateEnum.Downloop]: 'downloop-sound',
  [logic.CatzStateEnum.SecondUploop]: 'second-uploop-sound',
  [logic.CatzStateEnum.SecondDownloop]: 'second-downloop-sound',
  [logic.CatzStateEnum.Slingshot]: 'slingshot-sound',
  [logic.CatzStateEnum.TerminalVelocity]: 'wind',
  [logic.CatzStateEnum.EmergencyBoost]: 'emergency-boost-sound',
  [logic.CatzStateEnum.SlammerReady]: null,
  [logic.CatzStateEnum.Slammer]: 'misc-sound',
  [logic.CatzStateEnum.Frenzy]: 'frenzy-sound',
  [logic.CatzStateEnum.FrenzyUploop]: null,
  [logic.CatzStateEnum.FellOffRocket]: 'catzScream3',
  [logic.CatzStateEnum.OutOfFuel]: null,
  [logic.CatzStateEnum.OutOfFuelUpsideDown]: null,
} as const

const crashBorder = {
  top: -1000,
  bottom: 450,
}

let rocketFlame: createjs.Sprite

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

export const sharedAssets = {
  catzRocketContainer,
  rocketSnake,
  snakeLine,
  rocketFlameContainer,
  rocket: null as null | createjs.Bitmap,
  rocketSound: null as null | createjs.AbstractSoundInstance,
  catzBounds: null as null | createjs.Rectangle,
  catz: null as null | createjs.Sprite,
}

let previousState: logic.CatzStateEnum

export const container = new createjs.Container()

container.addChild(
  rocketSnake,
  snakeLine,
  rocketFlameContainer,
  catzRocketContainer
)

export function init(queue: createjs.LoadQueue): void {
  sharedAssets.rocket = helpers.createBitmap(queue.getResult('rocket'), {
    scaleX: 0.25,
    scaleY: 0.25,
    regX: -430,
    regY: -320,
  })

  sharedAssets.rocketSound = createjs.Sound.play('uploop-sound')
  sharedAssets.rocketSound.volume = 0.1
  sharedAssets.rocketSound.stop()

  sharedAssets.catz = helpers.createSprite(
    spriteSheetData.spriteSheets.rocket,
    'no shake',
    {
      y: 5,
    }
  )
  sharedAssets.catz.currentFrame = 0
  sharedAssets.catzRocketContainer.addChild(
    sharedAssets.rocket,
    sharedAssets.catz
  )
  sharedAssets.catzBounds = catzRocketContainer.getTransformedBounds()

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

export function hideSnake(): void {
  sharedAssets.rocketSnake.alpha = 0
  sharedAssets.snakeLine.alpha = 0
  rocketFlameContainer.alpha = 0
}

function showSnake(): void {
  sharedAssets.rocketSnake.children[0].x =
    -60 +
    Math.cos(
      ((sharedAssets.catzRocketContainer.rotation + 101) / 360) * 2 * Math.PI
    ) *
      176
  sharedAssets.rocketSnake.children[0].y =
    Math.sin(
      ((sharedAssets.catzRocketContainer.rotation + 100) / 360) * 2 * Math.PI
    ) *
      232 +
    logic.state.heightOffset
  rocketFlameContainer.x = sharedAssets.rocketSnake.children[0].x
  rocketFlameContainer.y = sharedAssets.rocketSnake.children[0].y
  rocketFlameContainer.rotation = sharedAssets.catzRocketContainer.rotation
  if (rocketFlame) {
    rocketFlame.gotoAndPlay('ignite')
  }
  rocketFlameContainer.alpha = 1
  sharedAssets.snakeLine.alpha = 1
}

export function catzRelease(): void {
  if (sharedAssets.catz) {
    sharedAssets.catz.x = 0
  }
  logic.catzRelease()
}

function playSecondDownloopSound(): void {
  if (sharedAssets.rocketSound) {
    sharedAssets.rocketSound.stop()
    sharedAssets.rocketSound = createjs.Sound.play(
      rocketSounds[logic.CatzStateEnum.SecondDownloop]
    )
  }
}

export function onChangeState(state: logic.CatzStateEnum): void {
  if (
    previousState === logic.CatzStateEnum.Uploop &&
    state === logic.CatzStateEnum.Downloop
  ) {
    createjs.Tween.hasActiveTweens(sharedAssets.catzRocketContainer)
    createjs.Tween.get(sharedAssets.catzRocketContainer)
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
  } else if (
    previousState === logic.CatzStateEnum.SecondUploop &&
    state === logic.CatzStateEnum.SecondDownloop
  ) {
    createjs.Tween.hasActiveTweens(sharedAssets.catzRocketContainer)
    createjs.Tween.get(sharedAssets.catzRocketContainer, {
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
  } else if (
    previousState === logic.CatzStateEnum.Frenzy &&
    state === logic.CatzStateEnum.Normal
  ) {
    if (sharedAssets.catz) {
      sharedAssets.catz.gotoAndPlay('no shake')
    }
    // glass.gotoAndPlay('still');
    if (sharedAssets.rocket) {
      sharedAssets.rocket.alpha = 1
    }
  } else if (!hasFrenzy(previousState) && hasFrenzy(state)) {
    /* todo: catz.gotoAndPlay('frenzy ready')
      if (catzRocket.rocket) {
        catzRocket.rocket.alpha = 0
      } */
  }

  if (
    state !== logic.CatzStateEnum.SlammerReady &&
    state !== logic.CatzStateEnum.FrenzyUploop
  ) {
    if (sharedAssets.rocketSound) {
      sharedAssets.rocketSound.stop()
    }
    const sound = rocketSounds[state]
    if (sound !== null) {
      sharedAssets.rocketSound = createjs.Sound.play(sound)
      sharedAssets.rocketSound.volume = 0.5
    }
  }
  if (
    state === logic.CatzStateEnum.Normal ||
    state === logic.CatzStateEnum.TerminalVelocity ||
    state === logic.CatzStateEnum.OutOfFuel ||
    state === logic.CatzStateEnum.OutOfFuelUpsideDown
  ) {
    hideSnake()
    if (
      logic.state.frenzyReady ||
      state === logic.CatzStateEnum.TerminalVelocity
    ) {
      if (sharedAssets.catz) {
        sharedAssets.catz.gotoAndPlay('shake')
      }
    } else if (sharedAssets.catz) {
      sharedAssets.catz.gotoAndPlay('no shake')
    }
  } else if (
    state !== logic.CatzStateEnum.FellOffRocket &&
    !logic.hasFrenzy(state)
  ) {
    if (sharedAssets.snakeLine.alpha === 0) {
      showSnake()
    }
    if (!logic.state.frenzyReady) {
      if (sharedAssets.catz) {
        sharedAssets.catz.gotoAndPlay('shake')
      }
    }
  } else if (state !== logic.CatzStateEnum.FellOffRocket) {
    hideSnake()
    if (sharedAssets.catz) {
      sharedAssets.catz.gotoAndPlay('frenzy')
    }
  } else {
    hideSnake()
    if (sharedAssets.catz) {
      sharedAssets.catz.gotoAndPlay('flying')
    }
  }

  previousState = state
}

export function reset(): void {
  createjs.Tween.removeTweens(sharedAssets.catzRocketContainer)
  if (sharedAssets.rocket) {
    sharedAssets.rocket.x = 0
    sharedAssets.rocket.alpha = 1
  }
  if (sharedAssets.catz) {
    sharedAssets.catz.alpha = 1
    sharedAssets.catzRocketContainer.x = 300
    sharedAssets.catzRocketContainer.y = 200
    sharedAssets.catz.gotoAndPlay('no shake')
  }
  onChangeState(logic.CatzStateEnum.Normal)
}

export function start(): void {
  hideSnake()
}
