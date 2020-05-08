type Options = {
  x?: number
  y?: number
  scaleX?: number
  scaleY?: number
  regX?: number
  regY?: number
  alpha?: number
  sourceRect?: createjs.Rectangle
  rotation?: number
  currentAnimationFrame?: number
}

export function createBitmap(
  // eslint-disable-next-line
  queRes: Object,
  opts: Options
): createjs.Bitmap {
  const bm = new createjs.Bitmap(queRes)
  const options = opts || {}
  bm.x = options.x || 0
  bm.y = options.y || 0
  bm.scaleX = options.scaleX || 1
  bm.scaleY = options.scaleY || 1
  bm.regX = options.regX || 0
  bm.regY = options.regY || 0
  if (options.alpha !== undefined) {
    bm.alpha = options.alpha
  }
  if (options.sourceRect !== undefined) {
    bm.sourceRect = options.sourceRect
  }

  return bm
}

export function createSprite(
  data: object, // eslint-disable-line
  anim: string,
  opts: Options
): createjs.Sprite {
  const sData = new createjs.SpriteSheet(data)
  const spr = new createjs.Sprite(sData, anim)
  const options = opts || {}
  spr.x = options.x || 0
  spr.y = options.y || 0
  spr.scaleX = options.scaleX || 1
  spr.scaleY = options.scaleY || 1
  spr.regX = options.regX || spr.regX
  spr.regY = options.regY || spr.regY
  spr.rotation = options.rotation || 0
  spr.currentAnimationFrame = options.currentAnimationFrame || 0
  if (typeof options.alpha !== 'undefined') {
    spr.alpha = options.alpha
  }
  return spr
}

export function createCircle(
  r: number,
  color: string,
  opts: Options
): createjs.Shape {
  const circle = new createjs.Shape()
  const options = opts || {}
  const x = options.x || 0
  const y = options.y || 0
  circle.graphics.beginFill(color).drawCircle(x, y, r)
  circle.scaleX = options.scaleX || 1
  circle.scaleY = options.scaleY || 1
  circle.regX = options.regX || circle.regX
  circle.regY = options.regY || circle.regY
  if (typeof options.alpha !== 'undefined') circle.alpha = options.alpha
  return circle
}

export function createRectangle(
  w: number,
  h: number,
  color: string,
  opts: Options
): createjs.Shape {
  const rect = new createjs.Shape()
  const options = opts || {}
  const x = options.x || 0
  const y = options.y || 0
  rect.graphics.beginFill(color).drawRect(x, y, w, h)
  rect.scaleX = options.scaleX || 1
  rect.scaleY = options.scaleY || 1
  rect.regX = options.regX || 0
  rect.regY = options.regY || 0
  rect.rotation = options.rotation || 0
  if (typeof options.alpha !== 'undefined') {
    rect.alpha = options.alpha
  }
  return rect
}

export function createSquare(
  w: number,
  color: string,
  options: Options
): createjs.Shape {
  return createRectangle(w, w, color, options)
}

export function createText(
  msg: string,
  font: string,
  color: string,
  opts: Options
): createjs.Text {
  const text = new createjs.Text(msg, font, color)
  const options = opts || {}
  text.x = options.x || 0
  text.y = options.y || 0
  if (typeof options.alpha !== 'undefined') text.alpha = options.alpha
  return text
}

// determines if number is in range without knowing which is greater
export function between(number: number, first: number, last: number): boolean {
  return first < last
    ? number >= first && number <= last
    : number >= last && number <= first
}

export function isInRectangle(
  x: number,
  y: number,
  rect: createjs.Rectangle
): boolean {
  return (
    between(x, rect.x, rect.x + rect.width) &&
    between(y, rect.y, rect.y + rect.height)
  )
}
