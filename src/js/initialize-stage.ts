import * as catzRocket from './catz-rocket'
import * as house from './house'
import * as gameLogic from './game-logic'
import * as spriteSheetData from './sprite-sheet-data'
import * as helpers from './helpers'
import { on, events } from './event-bus'
import debugOptions from './debug-options'
import assetManifest from './asset-manifest'
import { store } from './store'

function initBase(queue: createjs.LoadQueue, stage: createjs.Stage): void {
  spriteSheetData.setValues(queue)
  const bg = helpers.createBitmap(queue.getResult('bg'), { y: -1200 })
  stage.addChild(bg)
  stage.enableMouseOver()

  catzRocket.init(queue)
  const debugText = helpers.createText('', '12px Courier New', '#ffffcc', {
    x: 500,
    y: 0,
  })
  gameLogic.init({
    bg,
    stage,
    queue,
    debugText,
  })
  house.init({
    queue,
    bg,
  })
}

export default function init(
  canvasId: string,
  canvas: HTMLCanvasElement
): void {
  // Incorret type definition
  const stage = new createjs.Stage(canvasId) as any // eslint-disable-line
  stage.mouseEventsEnabled = true

  if ('ontouchstart' in document.documentElement) {
    createjs.Touch.enable(stage)
  }

  const progressBar = new createjs.Shape()
  progressBar.graphics.beginFill('#907a91').drawRect(0, 0, 100, 20)
  progressBar.x = canvas.width / 2 - 50
  progressBar.y = canvas.height / 2 - 10
  stage.addChild(progressBar)
  const queue = new createjs.LoadQueue()
  queue.installPlugin(createjs.Sound)
  function handleProgress(event: createjs.Event): void {
    progressBar.graphics
      .beginFill('#330033')
      .drawRect(0, 0, 100 * event.progress, 20)
    stage.update() // eslint-disable-line
  }
  function handleComplete(): void {
    stage.removeChild(progressBar)

    initBase(queue, stage)

    if (debugOptions.noHouseView) {
      gameLogic.gotoGameView()
    } else {
      house.gotoHouseViewFirstTime(stage)
    }
  }

  queue.on('progress', handleProgress as (event: Object) => void) // eslint-disable-line
  queue.on('complete', handleComplete)

  queue.loadManifest(assetManifest)

  const onCrash = (): void => {
    if (debugOptions.noHouseView) {
      gameLogic.gotoGameView()
    } else {
      house.updateAndStartHouseView(
        stage,
        catzRocket.sharedState.isHit,
        catzRocket.sharedAssets.catzRocketContainer.rotation,
        catzRocket.CatzStateEnum.OutOfFuelUpsideDown ===
          catzRocket.sharedState.catzState
      )
    }
  }

  const onRocketFired = (): void => {
    if (!debugOptions.noHouseView) {
      house.leave(stage)
    }

    gameLogic.gotoGameView()
  }
  on(events.CRASH, onCrash)
  on(events.ROCKET_FIRED, onRocketFired)

  store.subscribe(() => {
    const { score } = store.getState()

    const el = document.querySelector('.odometer')
    if (el) {
      el.innerHTML = score.toString()
    }
  })
}
