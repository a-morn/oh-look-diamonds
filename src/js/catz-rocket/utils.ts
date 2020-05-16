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
