export interface IThunderCloud extends createjs.Bitmap {
  update: () => void
  lastFired: Date | null
  temperature: number
  shape: createjs.Shape
  height: number
  width: number
}

export class ThunderCloud extends createjs.Bitmap {
  lastFired: Date | null

  temperature: number

  shape = new createjs.Shape()

  constructor(img: string) {
    super(img)
    this.lastFired = null
    this.temperature = 0
    this.shape.graphics.beginFill('rgba(255,0,0,0.5)').dc(0, 0, 50)
  }

  update(): void {
    this.shape.x = this.x
    this.shape.y = this.y
  }
}
