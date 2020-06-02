import { DiamondEnum } from 'js/types'
import * as assets from './assets'
import * as state from './state'

export const { container, sharedAssets } = assets
export const { sharedState } = state

export function init(queue: createjs.LoadQueue): void {
  assets.init(queue)
}

export function start(): void {
  state.start()
  assets.start()
}

export function update(
  grav: number,
  wind: number,
  event: createjs.Event
): void {
  const newState = state.update(grav, wind, event)

  assets.update(
    state.sharedState.catzPreviousState,
    state.sharedState.catzState,
    newState.positionX,
    newState.positionY,
    newState.rotation,
    state.sharedState.isWounded,
    state.sharedState.frenzyReady,
    state.sharedState.heightOffset,
    state.loopDone
  )
}

export function reset(): void {
  state.reset()
  assets.reset()
}

export { CatzStateEnum, hasFrenzy } from './types'

export function catzUp(): void {
  state.catzUp()
}

export function catzEndLoop(): void {
  state.catzEndLoop()
}

export function canCollide(): boolean {
  return state.canCollide()
}

export function pickupDiamond(size: DiamondEnum): void {
  return state.pickupDiamond(size)
}
