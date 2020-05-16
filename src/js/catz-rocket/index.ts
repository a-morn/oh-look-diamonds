import * as logic from './logic'
import * as assets from './assets'
import * as utils from './utils'

export const { state, canCollide, pickupDiamond } = logic
export const { init, container, sharedAssets } = assets

function updateCatzState(
  newState: utils.CatzStateEnum | null | undefined
): void {
  if (newState) {
    logic.state.catzPreviousState = logic.state.catzState
    logic.state.catzState = newState
  }
}
function loopDone(): void {
  const newState = logic.loopDone(sharedAssets.catzRocketContainer.rotation)
  updateCatzState(newState)
}

export function start(startVelocity: number): void {
  logic.start(startVelocity)
  assets.start()
}

export function update(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  const updateResult = logic.update(
    grav,
    wind,
    event.delta,
    createjs.Tween.hasActiveTweens(assets.catzRocketContainer),
    () => createjs.Tween.removeTweens(assets.catzRocketContainer),
    sharedAssets.catzRocketContainer.y,
    sharedAssets.catzRocketContainer.rotation
  )

  updateCatzState(updateResult.newState)

  // updateResult.newState
  assets.update(
    logic.state.catzPreviousState,
    logic.state.catzState,
    updateResult.newPosition?.x,
    updateResult.newPosition?.y,
    updateResult.newRotation,
    logic.state.isWounded,
    logic.state.frenzyReady,
    logic.state.heightOffset,
    loopDone
  )
}

export function reset(): void {
  logic.reset()
  assets.reset()
}

export { CatzStateEnum, hasFrenzy } from './utils'

export function catzUp(): void {
  const newState = logic.catzUp(sharedAssets.catzRocketContainer.rotation)
  updateCatzState(newState)
}

export function catzEndLoop(): void {
  const newState = logic.catzEndLoop()
  updateCatzState(newState)
}
