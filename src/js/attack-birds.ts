import * as spriteSheetData from './sprite-sheet-data'

export type Birds =
  | 'seagull'
  | 'falcon'
  | 'duck'
  | 'bat'
  | 'glasses'
  | 'crow'
  | 'chicken'
type BirdState = 'attacking' | 'normal' | 'grilled' | 'soaring'

export const AttackBirdProps = {
  chicken: {
    acceleration: 0,
    topSpeed2: 100000,
    weight: 0.2,
    scale: 0.5,
  },
  falcon: {
    acceleration: 8,
    topSpeed2: 100000,
    weight: 0.6,
    scale: 0.8,
  },
  crow: {
    acceleration: 5,
    topSpeed2: 100000,
    weight: 0.5,
    scale: 0.7,
  },
  bat: {
    acceleration: 7,
    topSpeed2: 100000,
    weight: 0.2,
    scale: 0.4,
  },
  duck: {
    acceleration: 5,
    topSpeed2: 100000,
    weight: 0.3,
    scale: 0.5,
  },
  seagull: {
    acceleration: 3,
    topSpeed2: 100000,
    weight: 0.2,
    scale: 0.5,
  },
  glasses: {
    acceleration: 11,
    topSpeed2: 100000,
    weight: 1,
    scale: 1,
  },
} as const

export interface IAttackBird extends createjs.Sprite {
  setGrilled: () => void
  updateCircle: () => void
  update: (rocketX: number, rocketY: number, event: createjs.Event) => void
  currentAnimation: Birds
  state: BirdState
  x: number
  y: number
  weight: number
  acceleration: number
  falconTimer: number
  target: number
  shape: createjs.Shape
  rad: number
  scaleX: number
  scaleY: number
  velocityX: number
  velocityY: number
  temperature: number
  topSpeed2: number
}

class AttackBird extends createjs.Sprite {
  topSpeed2: number

  weight: number

  acceleration: number

  falconTimer: number

  target: number

  shape = new createjs.Shape()

  rad: number

  state: BirdState

  velocityX: number

  velocityY: number

  temperature: number

  constructor(sheet: createjs.SpriteSheet, current: Birds) {
    super(sheet, current)
    const prop = AttackBirdProps[current]
    this.topSpeed2 = prop.topSpeed2
    this.weight = prop.weight
    this.acceleration = prop.acceleration
    this.falconTimer = 0
    this.target = 0

    this.rad = prop.scale * 50
    this.shape.graphics.beginFill('red').dc(0, 0, this.rad)
    this.scaleX = prop.scale
    this.scaleY = prop.scale
    this.state = 'normal'
    this.velocityX = 0
    this.velocityY = 0
    this.temperature = 0
  }

  cloneBird(): IAttackBird {
    const newClone = new AttackBird(
      new createjs.SpriteSheet(spriteSheetData.spriteSheets.enemybirds),
      this.currentAnimation as Birds
    )
    newClone.state = this.state
    newClone.x = this.x
    newClone.y = this.y
    return newClone as IAttackBird
  }

  update(rocketX: number, rocketY: number, event: createjs.Event): void {
    if (this.currentAnimation === 'falcon') {
      this.updateFalcon(rocketX, rocketY, event)
    } else if (this.currentAnimation === 'duck') {
      this.updateDuck(rocketX, rocketY, event)
    } else {
      this.updateSeagull(rocketX, rocketY, event)
    }
    this.updateCircle()
  }

  updateDuck(_: number, rocketY: number, event: createjs.Event): void {
    let aY = 0
    if (this.state === 'normal') {
      this.velocityX = -300
      if (this.x < 650) {
        this.state = 'attacking'
        this.target = rocketY
      }
    } else if (this.state === 'attacking') {
      this.velocityX = -250
      aY = (this.acceleration * event.delta * (rocketY - this.y)) / 1000
    } else if (this.state === 'grilled') {
      aY = (200 * this.acceleration * event.delta) / 1000
      this.rotation = (Math.atan(this.velocityY / 600) * 360) / 3.14
    }
    this.velocityY += aY
    // this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    const speed2 =
      this.velocityX * this.velocityX + this.velocityY * this.velocityY
    if (speed2 > this.topSpeed2) {
      this.velocityX = (this.velocityX * this.topSpeed2) / speed2
      this.velocityY = (this.velocityY * this.topSpeed2) / speed2
    }
  }

  updateFalcon(rocketX: number, rocketY: number, event: createjs.Event): void {
    let aX
    let aY
    if (this.state === 'normal') {
      aX = (this.acceleration * event.delta * (rocketX - this.x)) / 1000
      aY = (this.acceleration * event.delta * (rocketY - 350 - this.y)) / 1000
      if (rocketY - 250 - this.y > 0) {
        this.rotation = -20
        this.state = 'soaring'
        this.falconTimer = 3000
        aX = 0
        aY = 0
      }
    } else if (this.state === 'attacking') {
      aX = (this.acceleration * event.delta * (rocketX - this.x)) / 1000
      aY = (this.acceleration * event.delta * (rocketY - this.y)) / 1000
      this.rotation = (Math.atan(aY / 60) * 270) / 3.14
      if (this.y - rocketY > 0) {
        this.rotation = -30
        this.state = 'normal'
      }
    } else if (this.state === 'soaring') {
      aX = (this.acceleration * event.delta * (rocketX - this.x)) / 1000
      aY = (this.acceleration * event.delta * (rocketY - 250 - this.y)) / 1000
      this.falconTimer -= event.delta
      if (this.falconTimer < 0) {
        this.state = 'attacking'
        this.rotation = 45
        this.velocityX =
          (this.acceleration * event.delta * (rocketX - this.x)) / 1000
        this.velocityY =
          (this.acceleration * event.delta * (rocketY - this.y)) / 1000
      }
    } else if (this.state === 'grilled') {
      aX = 0
      aY = (200 * this.acceleration * event.delta) / 1000
      this.rotation = (Math.atan(this.velocityY / 600) * 360) / 3.14
    }
    this.velocityX += aX || 0
    this.velocityY += aY || 0
    // this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    const speed2 =
      this.velocityX * this.velocityX + this.velocityY * this.velocityY
    if (speed2 > this.topSpeed2) {
      this.velocityX = (this.velocityX * this.topSpeed2) / speed2
      this.velocityY = (this.velocityY * this.topSpeed2) / speed2
    }
  }

  updateSeagull(rocketX: number, rocketY: number, event: createjs.Event): void {
    const speed2 =
      this.velocityX * this.velocityX + this.velocityY * this.velocityY
    let aX
    let aY
    if (this.state !== 'grilled') {
      aX = (this.acceleration * event.delta * (rocketX - this.x)) / 1000
      aY = (this.acceleration * event.delta * (rocketY - this.y)) / 1000
    } else {
      aX = 0
      aY = (200 * this.acceleration * event.delta) / 1000
      this.rotation = (Math.atan(this.velocityY / 600) * 360) / 3.14
    }
    this.velocityX += aX
    this.velocityY += aY
    // this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    if (speed2 > this.topSpeed2) {
      this.velocityX = (this.velocityX * this.topSpeed2) / speed2
      this.velocityY = (this.velocityY * this.topSpeed2) / speed2
    }
  }

  updateCircle(): void {
    this.shape.x = this.x
    this.shape.y = this.y
  }

  setGrilled(): void {
    this.velocityX = -10
    this.gotoAndPlay('chicken')
    this.state = 'grilled'
    const instance = createjs.Sound.play('grilled')
    instance.volume = 1
  }
}

export function attackBirdFactory(
  sheet: createjs.SpriteSheet,
  current: Birds
): IAttackBird {
  return new AttackBird(sheet, current) as IAttackBird
}
