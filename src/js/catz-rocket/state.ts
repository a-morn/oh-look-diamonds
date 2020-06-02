/*
 * All rocket related state goes here
 */

import { DiamondEnum } from 'js/types'
import * as logic from './logic'
import * as assets from './assets'
import { CatzStateEnum, State, UpdateResult } from './types'

const DEFAULT_STATE: State = {
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
  positionX: 0,
  positionY: 0,
} as const

export const sharedState: State = { ...DEFAULT_STATE }

function updateCatzState(newState: UpdateResult): void {
  sharedState.catzPreviousState =
    sharedState.catzState || sharedState.catzPreviousState
  sharedState.catzState = newState.catzState || sharedState.catzState
  sharedState.catzVelocity = newState.catzVelocity || sharedState.catzVelocity
  sharedState.diamondFuel = newState.diamondFuel || sharedState.diamondFuel
  sharedState.frenzyCount = newState.frenzyCount || sharedState.frenzyCount
  sharedState.frenzyReady = newState.frenzyReady || sharedState.frenzyReady
  sharedState.frenzyTimer = newState.frenzyTimer || sharedState.frenzyTimer
  sharedState.heightOffset = newState.heightOffset || sharedState.heightOffset
  sharedState.invincibilityCounter =
    newState.invincibilityCounter || sharedState.invincibilityCounter
  sharedState.isCrashed = newState.isCrashed || sharedState.isCrashed
  sharedState.isHit = newState.isHit || sharedState.isHit
  sharedState.isWounded = newState.isWounded || sharedState.isWounded
}

export function loopDone(): void {
  const newState = logic.loopDone(
    sharedState.isWounded,
    sharedState.catzState,
    assets.sharedAssets.catzRocketContainer.rotation
  )
  updateCatzState(newState)
}

export function start(): void {
  updateCatzState(DEFAULT_STATE)
}

export function update(
  grav: number,
  wind: number,
  event: createjs.Event
): {
  positionX?: number
  positionY?: number
  rotation?: number
} {
  const newState = logic.update({
    ...sharedState,
    grav,
    wind,
    delta: event.delta,
    rocketInAnimation: createjs.Tween.hasActiveTweens(
      assets.catzRocketContainer
    ),
    removeAnimationOnRocket: () =>
      createjs.Tween.removeTweens(assets.catzRocketContainer),
    catzRocketContainerY: assets.sharedAssets.catzRocketContainer.y,
    rocketRotation: assets.sharedAssets.catzRocketContainer.rotation,
  })

  updateCatzState(newState)

  return {
    positionX: newState.newPosition?.x,
    positionY: newState.newPosition?.y,
    rotation: newState.newRotation,
  }
}

export function reset(): void {
  sharedState.frenzyCount = 0
  sharedState.diamondFuel = 0
  sharedState.heightOffset = 0
  sharedState.catzVelocity = -20
  updateCatzState(DEFAULT_STATE)
}

export { CatzStateEnum, hasFrenzy } from './types'

export function catzUp(): void {
  const newState = logic.catzUp(
    sharedState,
    assets.sharedAssets.catzRocketContainer.rotation
  )
  updateCatzState(newState)
}

export function catzEndLoop(): void {
  const newState = logic.catzEndLoop(sharedState.catzState)
  updateCatzState(newState)
}

export function canCollide(): boolean {
  return logic.canCollide(sharedState.catzState)
}

export function pickupDiamond(size: DiamondEnum): void {
  logic.pickupDiamond(sharedState, size)
}
