import * as helpers from '../helpers'
import * as spriteSheetData from '../sprite-sheet-data'
import { CatzStateEnum, hasFrenzy } from './utils'

const FLAME_COLOR = '#99ccff' as const

export const catzRocketContainer = new createjs.Container()
catzRocketContainer.x = 260
catzRocketContainer.y = 200
catzRocketContainer.regY = 100
catzRocketContainer.regX = 150

const rocketSounds = {
  [CatzStateEnum.Normal]: null,
  [CatzStateEnum.Uploop]: 'uploop-sound',
  [CatzStateEnum.Downloop]: 'downloop-sound',
  [CatzStateEnum.SecondUploop]: 'second-uploop-sound',
  [CatzStateEnum.SecondDownloop]: 'second-downloop-sound',
  [CatzStateEnum.Slingshot]: 'slingshot-sound',
  [CatzStateEnum.TerminalVelocity]: 'wind',
  [CatzStateEnum.EmergencyBoost]: 'emergency-boost-sound',
  [CatzStateEnum.SlammerReady]: null,
  [CatzStateEnum.Slammer]: 'misc-sound',
  [CatzStateEnum.Frenzy]: 'frenzy-sound',
  [CatzStateEnum.FrenzyUploop]: null,
  [CatzStateEnum.FellOffRocket]: 'catzScream3',
  [CatzStateEnum.OutOfFuel]: null,
  [CatzStateEnum.OutOfFuelUpsideDown]: null,
} as const

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

export function hideSnake(): void {
  sharedAssets.rocketSnake.alpha = 0
  sharedAssets.snakeLine.alpha = 0
  rocketFlameContainer.alpha = 0
}

function showSnake(heightOffset: number): void {
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
    heightOffset
  rocketFlameContainer.x = sharedAssets.rocketSnake.children[0].x
  rocketFlameContainer.y = sharedAssets.rocketSnake.children[0].y
  rocketFlameContainer.rotation = sharedAssets.catzRocketContainer.rotation
  if (rocketFlame) {
    rocketFlame.gotoAndPlay('ignite')
  }
  rocketFlameContainer.alpha = 1
  sharedAssets.snakeLine.alpha = 1
}

function loopDone(): void {
  if (sharedAssets.catz) {
    sharedAssets.catz.x = 0
  }
}

function playSecondDownloopSound(): void {
  if (sharedAssets.rocketSound) {
    sharedAssets.rocketSound.stop()
    sharedAssets.rocketSound = createjs.Sound.play(
      rocketSounds[CatzStateEnum.SecondDownloop]
    )
  }
}

export function onChangeState(
  previousState: CatzStateEnum,
  currentState: CatzStateEnum,
  wentIntoFrenzy: boolean,
  frenzyReady: boolean,
  heightOffest: number,
  onLoopDone: () => void
): void {
  if (
    previousState === CatzStateEnum.Uploop &&
    currentState === CatzStateEnum.Downloop
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
      .call(() => {
        onLoopDone()
        loopDone()
      })
  } else if (
    previousState === CatzStateEnum.SecondUploop &&
    currentState === CatzStateEnum.SecondDownloop
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
    previousState === CatzStateEnum.Frenzy &&
    currentState === CatzStateEnum.Normal
  ) {
    if (sharedAssets.catz) {
      sharedAssets.catz.gotoAndPlay('no shake')
    }
    // glass.gotoAndPlay('still');
    if (sharedAssets.rocket) {
      sharedAssets.rocket.alpha = 1
    }
  } else if (wentIntoFrenzy) {
    if (sharedAssets.catz) {
      sharedAssets.catz.gotoAndPlay('frenzy ready')
    }
    if (sharedAssets.rocket) {
      sharedAssets.rocket.alpha = 0
    }
  }

  if (
    currentState !== CatzStateEnum.SlammerReady &&
    currentState !== CatzStateEnum.FrenzyUploop
  ) {
    if (sharedAssets.rocketSound) {
      sharedAssets.rocketSound.stop()
    }
    const sound = rocketSounds[currentState]
    if (sound) {
      sharedAssets.rocketSound = createjs.Sound.play(sound)
      sharedAssets.rocketSound.volume = 0.5
    }
  }
  if (
    currentState === CatzStateEnum.Normal ||
    currentState === CatzStateEnum.TerminalVelocity ||
    currentState === CatzStateEnum.OutOfFuel ||
    currentState === CatzStateEnum.OutOfFuelUpsideDown
  ) {
    hideSnake()
    if (frenzyReady || currentState === CatzStateEnum.TerminalVelocity) {
      if (sharedAssets.catz) {
        sharedAssets.catz.gotoAndPlay('shake')
      }
    } else if (sharedAssets.catz) {
      sharedAssets.catz.gotoAndPlay('no shake')
    }
  } else if (
    currentState !== CatzStateEnum.FellOffRocket &&
    !hasFrenzy(currentState)
  ) {
    if (sharedAssets.snakeLine.alpha === 0) {
      showSnake(heightOffest)
    }
    if (!frenzyReady) {
      if (sharedAssets.catz) {
        sharedAssets.catz.gotoAndPlay('shake')
      }
    }
  } else if (currentState !== CatzStateEnum.FellOffRocket) {
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
  onChangeState(
    CatzStateEnum.Normal,
    CatzStateEnum.Normal,
    false,
    false,
    0,
    () => undefined
  )
}

export function start(): void {
  hideSnake()
}

export function updateRocketSnake(foo: boolean, heightOffset: number): void {
  const [, ...rocketSnakeKeys] = [...sharedAssets.rocketSnake.children.keys()]
  for (const i of rocketSnakeKeys) {
    const kid = sharedAssets.rocketSnake.children[i]
    kid.x =
      sharedAssets.rocketSnake.children[i - 1].x -
      2 * Math.cos((6.28 * sharedAssets.catzRocketContainer.rotation) / 360)
    kid.y = sharedAssets.rocketSnake.children[i - 1].y
  }

  if (foo) {
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
      heightOffset
    rocketFlameContainer.x = sharedAssets.catzRocketContainer.x
    rocketFlameContainer.y = sharedAssets.catzRocketContainer.y
  } else {
    sharedAssets.rocketSnake.children[0].x =
      -5 +
      Math.cos(
        ((sharedAssets.catzRocketContainer.rotation + 110) / 360) * 2 * Math.PI
      ) *
        100
    sharedAssets.rocketSnake.children[0].y =
      Math.sin(
        ((sharedAssets.catzRocketContainer.rotation + 110) / 360) * 2 * Math.PI
      ) *
        120 +
      heightOffset
    rocketFlameContainer.x = sharedAssets.catzRocketContainer.x
    rocketFlameContainer.y = sharedAssets.catzRocketContainer.y
  }
  sharedAssets.snakeLine.graphics = new createjs.Graphics()
  sharedAssets.snakeLine.x = 260
  sharedAssets.snakeLine.y = 200
  for (const i of rocketSnakeKeys) {
    const kid = sharedAssets.rocketSnake.children[i]
    sharedAssets.snakeLine.graphics.setStrokeStyle(
      sharedAssets.rocketSnake.children.length * 2 - i * 2,
      1
    )
    sharedAssets.snakeLine.graphics.beginStroke(FLAME_COLOR)
    sharedAssets.snakeLine.graphics.moveTo(kid.x - i * 5, kid.y)
    sharedAssets.snakeLine.graphics.lineTo(
      sharedAssets.rocketSnake.children[i - 1].x - (i - 1) * 5,
      sharedAssets.rocketSnake.children[i - 1].y
    )
    sharedAssets.snakeLine.graphics.endStroke()
  }
  rocketFlameContainer.rotation = sharedAssets.catzRocketContainer.rotation
}

export function update(
  previouseState: CatzStateEnum,
  currentState: CatzStateEnum | undefined,
  newXPosition: number | undefined,
  newYPosition: number | undefined,
  newRotation: number | undefined,
  catzWounded: boolean,
  frenzyReady: boolean,
  heightOffset: number,
  onLoopDone: () => void
): void {
  updateRocketSnake(true, heightOffset) // state !== CatzStateEnum.SecondDownloop && state !== CatzStateEnum.Slingshot
  if (currentState) {
    onChangeState(
      previouseState,
      currentState,
      !hasFrenzy(previouseState) && hasFrenzy(currentState),
      frenzyReady,
      heightOffset,
      onLoopDone
    )
  }

  sharedAssets.catzRocketContainer.x =
    newXPosition === undefined
      ? sharedAssets.catzRocketContainer.x
      : newXPosition
  sharedAssets.catzRocketContainer.y =
    newYPosition === undefined
      ? sharedAssets.catzRocketContainer.y
      : newYPosition
  sharedAssets.catzRocketContainer.rotation =
    newRotation === undefined
      ? sharedAssets.catzRocketContainer.rotation
      : newRotation

  const catzInAnimation = createjs.Tween.hasActiveTweens(sharedAssets.catz)
  if (catzWounded && !catzInAnimation && sharedAssets.catz) {
    sharedAssets.catz.x = -50
  } else if (catzWounded && !catzInAnimation && sharedAssets.catz) {
    sharedAssets.catz.x = 0
  }
}
