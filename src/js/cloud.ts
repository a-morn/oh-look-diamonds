export interface ICloud extends createjs.Bitmap {
  catzIsInside: boolean
}

export class Cloud extends createjs.Bitmap {
  catzIsInside: boolean

  constructor(img: string) {
    super(img)
    this.catzIsInside = false
  }
}
