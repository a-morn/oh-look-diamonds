export enum CatzStateEnum {
  Normal = 'Normal',
  Uploop = 'Uploop',
  Downloop = 'Downloop',
  SecondUploop = 'SecondUploop',
  SecondDownloop = 'SecondDownloop',
  Slingshot = 'Slingshot',
  TerminalVelocity = 'TerminalVelocity',
  EmergencyBoost = 'EmergencyBoost',
  SlammerReady = 'SlammerReady',
  Slammer = 'Slammer',
  Frenzy = 'Frenzy',
  FrenzyUploop = 'FrenzyUploop',
  FellOffRocket = 'FellOffRocket',
  OutOfFuel = 'OutOfFuel',
  OutOfFuelUpsideDown = 'OutOfFuelUpsideDown',
}

export function hasFrenzy(currentState: CatzStateEnum): boolean {
  return (
    currentState === CatzStateEnum.FrenzyUploop ||
    currentState === CatzStateEnum.Frenzy
  )
}

export type State = {
  invincibilityCounter: number
  diamondFuel: number
  catzState: CatzStateEnum
  catzPreviousState: CatzStateEnum
  catzVelocity: number
  isHit: boolean
  isWounded: boolean
  frenzyTimer: number
  frenzyCount: number
  heightOffset: number
  isCrashed: boolean
  frenzyReady: boolean
  positionX: number
  positionY: number
}

export type UpdateResult = Partial<State> & {
  newRotation?: number
  newPosition?: {
    x: number
    y: number
  }
}
