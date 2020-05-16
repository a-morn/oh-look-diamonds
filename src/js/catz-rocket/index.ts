import * as logic from './logic'
import * as assets from './assets'

export function start(startVelocity: number): void {
  logic.start(startVelocity)
  assets.start()
}

export function update(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  logic.update(
    grav,
    wind,
    event.delta,
    createjs.Tween.hasActiveTweens(assets.sharedAssets.catz),
    createjs.Tween.hasActiveTweens(assets.catzRocketContainer),
    assets.onChangeState,
    () => createjs.Tween.removeTweens(assets.catzRocketContainer)
  )
}

export function reset(): void {
  logic.reset()
  assets.reset()
}

export const {
  state,
  canCollide,
  CatzStateEnum,
  hasFrenzy,
  pickupDiamond,
  catzUp,
  catzEndLoop,
} = logic
export const { init, container, sharedAssets } = assets
