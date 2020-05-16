import * as catzRocket from './catz-rocket'
import { Cloud, ICloud } from './cloud'
import { ThunderCloud, IThunderCloud } from './thunder-cloud'
import { attackBirdFactory, AttackBirdProps, IAttackBird } from './attack-birds'
import * as helpers from './helpers'
import * as spriteSheetData from './sprite-sheet-data'
import debugOptions from './debug-options'
import { ACTION_TYPES, store } from './store'
import { events, trigger } from './event-bus'
import { trackParts, TrackPart } from './track-parts'
import tracks from './tracks'
import { diamondEnum } from './initialize-stage'

let gameListener: Function
let gameView: createjs.Container
let squawkSound: createjs.AbstractSoundInstance
let leaves: createjs.Sprite
let exitSmoke: createjs.Sprite
const clipBoard: createjs.Sprite[] = []
let clipOffset = 0
const levelLength = 13000
let cloudSpeed = 0
let diSpeed = 0
let fgSpeed = 0
let mousedown = false
let parallaxSpeed = 0
let track
const currentDisplacement = 0
let currentLevel = 0
let currentTrack = 0
const grav = 12
const lastResolveNorm = [1, 0]
let onTrack = false
let debugText: createjs.Text
let smoke: createjs.Sprite
let diamondCounterText: createjs.Text
const flameVertices = [
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
]
const flameBounds = {
  height: 25,
  width: 50,
  length: 0,
}
flameBounds.length = Math.sqrt(
  flameBounds.height / 2 ** 2 + flameBounds.width ** 2
)
const flameNorm = [
  { x: 1, y: 1, vert1: 0, vert2: 2 },
  { x: 1, y: 1, vert1: 0, vert2: 1 },
  { x: 1, y: 1, vert1: 0, vert2: 1 },
]
const polygonVertices = [
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
]
const newBounds = {
  height: 25,
  width: 60,
  nose: 35,
  noseLen: 37.17,
}
const norm = [
  { x: 1, y: 1, vert1: 0, vert2: 3 },
  { x: 1, y: 1, vert1: 0, vert2: 1 },
  { x: 1, y: 1, vert1: 0, vert2: 3 },
  { x: 1, y: 1, vert1: 1, vert2: 3 },
]
const catzVertices = [
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
]
const catzNorm = [
  { x: 1, y: 1, vert1: 0, vert2: 1 },
  { x: 1, y: 1, vert1: 0, vert2: 2 },
]
const polygonLine = new createjs.Shape()
let bg: createjs.Bitmap
let stage: createjs.Stage
let cloudImg: { [key: string]: string }
let queue: createjs.LoadQueue

const selectBox = {
  rect: new createjs.Rectangle(0, 0, 0, 0),
  graphic: new createjs.Shape(),
}
const lightningColor = '#99ccff'
export const selectPosOnStartDrag = {
  x: 0,
  y: 0,
}

let trackTimer = 0
let wind = 0
let zoomOut = false
let fuelBlinkTimer = 0
let rocketSong: createjs.AbstractSoundInstance

const attackBirdContainer = new createjs.Container()
const cloudContainer = new createjs.Container()
const collisionCheckDebugContainer = new createjs.Container()
const diamondContainer = new createjs.Container()
const fgContainer = new createjs.Container()
const fgTopContainer = new createjs.Container()
const lightningContainer = new createjs.Container()
const onlookerContainer = new createjs.Container()
const parallaxContainer = new createjs.Container()
const starsContainer = new createjs.Container()
const selectContainer = new createjs.Container()
const thunderContainer = new createjs.Container()
const windContainer = new createjs.Container()

const containerDict = {
  diamond: diamondContainer,
  greatDiamond: diamondContainer,
  attackBird: attackBirdContainer,
  thunderCloud: thunderContainer,
} as const
let levelViewScale = 1
const levelDesignConts = [
  diamondContainer,
  thunderContainer,
  attackBirdContainer,
]

function getObjType(currentAnimation: string): keyof typeof containerDict {
  switch (currentAnimation) {
    case 'cycle': {
      return 'diamond'
    }
    case 'greatCycle': {
      return 'greatDiamond'
    }
    case undefined: {
      return 'thunderCloud'
    }
    default: {
      return 'attackBird'
    }
  }
}

function changeBirdType(evt: createjs.MouseEvent): boolean {
  const types: (keyof typeof AttackBirdProps)[] = [
    'seagull',
    'duck',
    'crow',
    'bat',
    'falcon',
    'glasses',
  ]
  const currentIndex = types.indexOf(evt.currentTarget.currentAnimation)
  const newIndex = (currentIndex + 1) % types.length
  const newType = types[newIndex]
  evt.currentTarget.gotoAndPlay(newType)
  evt.currentTarget.acceleration = AttackBirdProps[newType].acceleration // eslint-disable-line no-param-reassign
  evt.currentTarget.topSpeed2 = AttackBirdProps[newType].topSpeed2 // eslint-disable-line no-param-reassign
  evt.currentTarget.weight = AttackBirdProps[newType].weight // eslint-disable-line no-param-reassign
  evt.currentTarget.scale = AttackBirdProps[newType].scale // eslint-disable-line no-param-reassign
  evt.currentTarget.scaleX = AttackBirdProps[newType].scale // eslint-disable-line no-param-reassign
  evt.currentTarget.scaleY = AttackBirdProps[newType].scale // eslint-disable-line no-param-reassign
  evt.currentTarget.rad = AttackBirdProps[newType].scale * 50 // eslint-disable-line no-param-reassign
  stage.update()
  return false
}

function moveChildrenFromSelectedToObjCont(): void {
  for (let i = selectContainer.numChildren - 1; i >= 0; i -= 1) {
    const kid = selectContainer.getChildAt(i)
    kid.x += selectContainer.x
    kid.y += selectContainer.y
    kid.alpha = 1
    const objCont =
      containerDict[getObjType((kid as createjs.Sprite).currentAnimation)]
    objCont.addChild(kid)
  }
  selectContainer.x = 0
  selectContainer.y = 0
}

export function startPressMove(evt: createjs.MouseEvent): void {
  selectPosOnStartDrag.x = evt.stageX / levelViewScale - selectContainer.x
  selectPosOnStartDrag.y = evt.stageY / levelViewScale - selectContainer.y
}

function selectItem(evt: createjs.MouseEvent): boolean {
  if (evt.currentTarget.parent !== selectContainer) {
    moveChildrenFromSelectedToObjCont()
    selectContainer.addChild(evt.currentTarget)
    startPressMove(evt)
  }
  return false
}

function setupObjEvents(kid: createjs.Sprite | createjs.Bitmap): void {
  // eslint-disable-next-line
  kid.on('mousedown', selectItem as (evt: Object) => boolean)
  if (getObjType((kid as createjs.Sprite).currentAnimation) === 'attackBird') {
    // eslint-disable-next-line
    kid.on('dblclick', changeBirdType as (evt: Object) => boolean)
  }
}

function createClone(object: createjs.Sprite): createjs.Sprite {
  const clone = object.clone()
  setupObjEvents(clone)
  return clone
}

function drawSelectBox(): void {
  selectBox.graphic.graphics
    .beginStroke('#ffffff')
    .drawRect(
      selectBox.rect.x,
      selectBox.rect.y,
      selectBox.rect.width,
      selectBox.rect.height
    )
  stage.update()
}

function spawnAttackBird(
  type: keyof typeof AttackBirdProps,
  x: number,
  y: number
): createjs.Sprite {
  const spriteSheet = new createjs.SpriteSheet(
    spriteSheetData.spriteSheets.enemybirds
  )
  const attackBird = attackBirdFactory(spriteSheet, type)
  attackBird.x = x
  attackBird.y = y
  if (type === 'duck') {
    attackBird.scaleX = -attackBird.scaleX
  }
  attackBirdContainer.addChild(attackBird)
  collisionCheckDebugContainer.addChild(attackBird.shape)
  return attackBird
}

function spawnThunderCloud(xPos: number, yPos: number): createjs.Bitmap {
  createjs.Sound.play('thunder')
  const cloudtype = `cloud-${Math.floor(Math.random() * 5 + 1).toString()}`
  const scale = Math.random() * 0.3 + 0.3
  const cloud = new ThunderCloud(cloudImg[cloudtype]) as IThunderCloud
  cloud.scaleX = scale
  cloud.scaleY = scale
  cloud.x = 2200
  cloud.x = xPos
  cloud.y = yPos
  cloud.filters = [new createjs.ColorFilter(0.3, 0.3, 0.3, 1, 0, 0, 55, 0)]
  const rect: createjs.Rectangle = cloud.getBounds()
  cloud.width = rect.width
  cloud.height = rect.height
  cloud.cache(rect.x, rect.y, rect.width, rect.height)
  thunderContainer.addChild(cloud)
  collisionCheckDebugContainer.addChild(cloud.shape)
  return cloud
}

export function init(data: {
  debugText: createjs.Text
  bg: createjs.Bitmap
  stage: createjs.Stage
  queue: createjs.LoadQueue
}): void {
  rocketSong = createjs.Sound.play('lullaby-for-rocketeers') // eslint-disable-line no-undef
  rocketSong.stop()

  debugText = data.debugText
  bg = data.bg
  stage = data.stage
  queue = data.queue

  squawkSound = createjs.Sound.play('squawk-1')
  squawkSound.volume = 0.15
  squawkSound.stop()

  cloudImg = Array.from(Array(5), (x, i) => i + 1)
    .map((i) => i.toString())
    .map((i) => `cloud-${i}`)
    .reduce((acc: Record<string, string>, c) => {
      acc[c] = data.queue.getResult(c) as string
      return acc
    }, {})

  const bgParallax = helpers.createBitmap(queue.getResult('bgParallax 0'), {
    x: 0,
    y: -200,
  })
  const bgParallax2 = helpers.createBitmap(queue.getResult('bgParallax 0'), {
    x: 2460,
    y: -200,
  })
  parallaxContainer.addChild(bgParallax, bgParallax2)
  const fgGround1 = helpers.createBitmap(queue.getResult('fgGround'), {
    x: 0,
    y: 300,
  })
  const fgGround2 = helpers.createBitmap(queue.getResult('fgGround'), {
    x: 2000,
    y: 300,
  })
  const fgGround3 = helpers.createBitmap(queue.getResult('fgGround'), {
    x: 4000,
    y: 300,
  })
  const fgGroundTop1 = helpers.createBitmap(queue.getResult('fgGroundTop'), {
    y: -830,
  })
  const fgGroundTop2 = helpers.createBitmap(queue.getResult('fgGroundTop'), {
    x: 2000,
    y: -830,
  })
  const fgGroundTop3 = helpers.createBitmap(queue.getResult('fgGroundTop'), {
    x: 4000,
    y: -830,
  })
  fgContainer.addChild(fgGround1, fgGround2, fgGround3)
  fgTopContainer.addChild(fgGroundTop1, fgGroundTop2, fgGroundTop3)
  diamondCounterText = helpers.createText('', '22px Courier New', '#fff', {
    x: 608 + 118,
    y: 52,
  })

  smoke = helpers.createSprite(spriteSheetData.spriteSheets.smoke, 'jump', {
    regX: 150,
    regY: 350,
    alpha: 0,
  })
  exitSmoke = helpers.createSprite(
    spriteSheetData.spriteSheets.smoke,
    'right',
    {
      regX: 150,
      regY: 200,
      alpha: 0,
    }
  )

  leaves = helpers.createSprite(spriteSheetData.spriteSheets.leaves, 'cycle', {
    alpha: 0,
  })

  collisionCheckDebugContainer.addChild(polygonLine)

  {
    const diamondSound = createjs.Sound.play('diamondSound')
    diamondSound.volume = 0.2
    diamondSound.stop()
  }

  gameView = new createjs.Container()

  gameView.addChild(
    parallaxContainer,
    onlookerContainer,
    catzRocket.catzRocket.rocketSnake,
    catzRocket.catzRocket.snakeLine,
    attackBirdContainer,
    diamondContainer,
    exitSmoke,
    smoke,
    catzRocket.catzRocket.rocketFlameContainer,
    catzRocket.catzRocket.catzRocketContainer,
    cloudContainer,
    lightningContainer,
    thunderContainer,
    fgContainer,
    fgTopContainer,
    leaves,
    collisionCheckDebugContainer,
    selectContainer
  )
}

function hideLeaves(): void {
  leaves.alpha = 0
}

function hideSmoke(): void {
  smoke.alpha = 0
}

function hideExitSmoke(): void {
  exitSmoke.alpha = 0
}

function sign(x: number | string): number {
  const num = +x
  if (num === 0 || Number.isNaN(num)) {
    return num
  }
  return num > 0 ? 1 : -1
}

function collisionResolve(
  bird: IAttackBird,
  normX: number,
  normY: number,
  normDist: number,
  isGround: boolean
): void {
  if (isGround || catzRocket.canCollide()) {
    bird.x += normX * normDist * 2 // eslint-disable-line no-param-reassign
    bird.y += normY * normDist * 2 // eslint-disable-line no-param-reassign
    normX *= sign(normDist) // eslint-disable-line no-param-reassign
    normY *= sign(normDist) // eslint-disable-line no-param-reassign
    lastResolveNorm[0] = normX
    lastResolveNorm[1] = normY
    const reflect = -2.5 * (normX * bird.velocityX + normY * bird.velocityY)
    bird.velocityX += reflect * normX // eslint-disable-line no-param-reassign
    bird.velocityY += reflect * normY // eslint-disable-line no-param-reassign
    catzRocket.catzRocket.catzVelocity -= (bird.weight * reflect * normY) / 150
    catzRocket.catzRocket.catzRocketContainer.y -=
      (bird.weight * reflect * normY) / 400
    let rand = Math.floor(4 * Math.random() + 1)
    let name = `klonk-${rand}`
    const instance = createjs.Sound.play(name)
    instance.volume = 0.5
    if (squawkSound.playState !== createjs.Sound.PLAY_SUCCEEDED) {
      rand = Math.floor(3 * Math.random() + 1)
      name = `squawk-${rand}`
      squawkSound = createjs.Sound.play(name)
      squawkSound.volume = 0.15
    }
  } else if (catzRocket.hasFrenzy()) {
    bird.setGrilled()
    store.dispatch({
      type: ACTION_TYPES.INCREMENT_KILLS,
    })
  }
}

function collisionCheck(bird: IAttackBird): boolean {
  const groundLevel = 430
  let projC
  if (
    Math.abs(bird.x - catzRocket.catzRocket.catzRocketContainer.x) < 200 &&
    Math.abs(bird.y - catzRocket.catzRocket.catzRocketContainer.y) < 150
  ) {
    let minOverlapNormIndex = 0
    let minOverlapDist = Infinity
    for (const n of norm) {
      const proj1 =
        n.x * polygonVertices[n.vert1].x + n.y * polygonVertices[n.vert1].y
      const proj2 =
        n.x * polygonVertices[n.vert2].x + n.y * polygonVertices[n.vert2].y
      projC = n.x * bird.x + n.y * bird.y
      if (
        projC - Math.max(proj1, proj2) > bird.rad ||
        Math.min(proj1, proj2) - projC > bird.rad
      ) {
        if (bird.y < groundLevel) return false
        collisionResolve(bird, 0, -1, bird.y - groundLevel, true)
      }
      if (
        bird.rad - projC + Math.max(proj1, proj2) <
        Math.abs(minOverlapDist)
      ) {
        minOverlapDist = bird.rad - projC + Math.max(proj1, proj2)
        minOverlapNormIndex = norm.indexOf(n)
      }
      if (
        bird.rad - Math.min(proj1, proj2) + projC <
        Math.abs(minOverlapDist)
      ) {
        minOverlapDist = -bird.rad + Math.min(proj1, proj2) - projC
        minOverlapNormIndex = norm.indexOf(n)
      }
    }
    let closestVertexIndex = 0
    let minDist = Infinity
    for (const polygonVertice of polygonVertices) {
      const dist =
        polygonVertice.x - bird.x ** 2 + polygonVertice.y - bird.y ** 2
      if (dist < minDist) {
        closestVertexIndex = polygonVertices.indexOf(polygonVertice)
        minDist = dist
      }
    }
    const x = bird.x - polygonVertices[closestVertexIndex].x
    const y = bird.y - polygonVertices[closestVertexIndex].y
    const normX = x / Math.sqrt(y * y + x * x)
    const normY = y / Math.sqrt(y * y + x * x)
    let projMin = Infinity
    let projMax = -Infinity
    for (const polygonVertice of polygonVertices) {
      const proj = normX * polygonVertice.x + normY * polygonVertice.y
      if (proj < projMin) projMin = proj
      if (proj > projMax) projMax = proj
    }
    projC = normX * bird.x + normY * bird.y
    if (projC - projMax > bird.rad || projMin - projC > bird.rad) {
      if (bird.y < groundLevel) return false
      collisionResolve(bird, 0, -1, bird.y - groundLevel, true)
    } else if (bird.rad - projC + projMax < Math.abs(minOverlapDist)) {
      minOverlapDist = bird.rad - projC + projMax
      collisionResolve(bird, normX, normY, minOverlapDist, false)
    } else if (bird.rad - projMin + projC < Math.abs(minOverlapDist)) {
      minOverlapDist = -bird.rad + projMin - projC
      collisionResolve(bird, normX, normY, minOverlapDist, false)
    } else {
      collisionResolve(
        bird,
        norm[minOverlapNormIndex].x,
        norm[minOverlapNormIndex].y,
        minOverlapDist,
        false
      )
    }
    return true
  }
  return false
}

function catzFellOfRocket(): void {
  stage.removeAllEventListeners()
  createjs.Tween.removeTweens(catzRocket.catzRocket.rocket)
  createjs.Tween.get(catzRocket.catzRocket.rocket).to(
    {
      x: 800,
    },
    800
  )
}

function catzCollisionCheck(bird: IAttackBird): boolean {
  for (const catzN of catzNorm) {
    const proj1 =
      catzN.x * catzVertices[catzN.vert1].x +
      catzN.y * catzVertices[catzN.vert1].y
    const proj2 =
      catzN.x * catzVertices[catzN.vert2].x +
      catzN.y * catzVertices[catzN.vert2].y
    const projC = catzN.x * bird.x + catzN.y * bird.y
    if (
      projC - Math.max(proj1, proj2) > bird.rad ||
      Math.min(proj1, proj2) - projC > bird.rad
    ) {
      return false
    }
  }
  if (!debugOptions.godMode && catzRocket.getHit(false)) catzFellOfRocket()
  return true
}

function moveAndCollisionCheck(
  bird: IAttackBird,
  event: createjs.Event
): boolean {
  let isCollide = collisionCheck(bird)
  let dispX = (bird.velocityX * event.delta) / 1000
  let dispY = (bird.velocityY * event.delta) / 1000
  if (dispX > bird.rad / 2 || dispY > bird.rad / 2) {
    const noSteps = Math.floor(
      Math.min((2 * Math.max(dispX, dispY)) / bird.rad, 4)
    )
    Array(noSteps)
      .fill(null)
      .forEach(() => {
        bird.x += dispX / noSteps // eslint-disable-line no-param-reassign
        bird.y += dispY / noSteps // eslint-disable-line no-param-reassign
        isCollide = collisionCheck(bird)
        if (isCollide) {
          dispX = (bird.velocityX * event.delta) / 1000
          dispY = (bird.velocityY * event.delta) / 1000
        }
      })
  } else {
    bird.x += dispX // eslint-disable-line no-param-reassign
    bird.y += dispY // eslint-disable-line no-param-reassign
    isCollide = collisionCheck(bird)
  }
  return isCollide
}

function changeParallax(int: number): void {
  parallaxContainer.removeAllChildren()
  const name = `bgParallax ${int}`
  const bgParallax = helpers.createBitmap(queue.getResult(name), {
    y: -200,
  })
  const bgParallax2 = helpers.createBitmap(queue.getResult(name), {
    x: 2460,
    y: -200,
  })

  if (currentLevel === 1) {
    bgParallax.y = 100
    bgParallax2.y = 100
  }
  parallaxContainer.addChild(bgParallax, bgParallax2)
}

// simple and quicker collision handling to be used for picking up diamonds
function overlapCheckCircle(x: number, y: number, r: number): boolean {
  for (const n of norm) {
    const proj1 =
      n.x * polygonVertices[n.vert1].x + n.y * polygonVertices[n.vert1].y
    const proj2 =
      n.x * polygonVertices[n.vert2].x + n.y * polygonVertices[n.vert2].y
    const projC = n.x * x + n.y * y
    if (
      projC - Math.max(proj1, proj2) > r ||
      Math.min(proj1, proj2) - projC > r
    ) {
      return false
    }
  }
  return true
}

function flameCollisionCheck(bird: IAttackBird): boolean {
  if (catzRocket.catzRocket.rocketFlameContainer.alpha === 1) {
    for (const flameN of flameNorm) {
      const proj1 =
        flameN.x * flameVertices[flameN.vert1].x +
        flameN.y * flameVertices[flameN.vert1].y
      const proj2 =
        flameN.x * flameVertices[flameN.vert2].x +
        flameN.y * flameVertices[flameN.vert2].y
      const projC = flameN.x * bird.x + flameN.y * bird.y
      if (
        projC - Math.max(proj1, proj2) > bird.rad ||
        Math.min(proj1, proj2) - projC > bird.rad
      ) {
        return false
      }
    }
    return true
  }
  return false
}

export function DeleteSelected(): void {
  selectContainer.removeAllChildren()
  stage.update()
}

export function cutCopy(isCopy: boolean): void {
  clipBoard.length = 0
  clipOffset = 0
  let clipLeftMost = levelLength
  let clipRightMost = 0
  for (let i = selectContainer.children.length - 1; i >= 0; i -= 1) {
    const kid = selectContainer.children[i]
    kid.x -= selectContainer.x
    kid.y -= selectContainer.y
    clipBoard.push(createClone(kid as createjs.Sprite))
    clipRightMost = Math.max(selectContainer.children[i].x, clipRightMost)
    clipLeftMost = Math.min(selectContainer.children[i].x, clipLeftMost)
  }
  if (isCopy) {
    clipOffset = clipRightMost - clipLeftMost + 50
  } else {
    DeleteSelected()
  }
  stage.update()
}

export function Paste(): void {
  moveChildrenFromSelectedToObjCont()
  for (let i = clipBoard.length - 1; i >= 0; i -= 1) {
    clipBoard[i].x += clipOffset
    const clone = createClone(clipBoard[i])
    clone.alpha = 0.5
    selectContainer.addChild(clone)
  }
  stage.update()
}

export function PressMove(evt: createjs.MouseEvent): void {
  evt.currentTarget.x = evt.stageX / levelViewScale - selectPosOnStartDrag.x // eslint-disable-line no-param-reassign
  evt.currentTarget.y = evt.stageY / levelViewScale - selectPosOnStartDrag.y // eslint-disable-line no-param-reassign
  stage.update()
}

export function CreateSelectBox(evt: createjs.MouseEvent): void {
  levelViewScale = gameView.scaleX
  moveChildrenFromSelectedToObjCont()
  selectBox.rect.setValues(
    evt.stageX / levelViewScale,
    (evt.stageY - gameView.y) / levelViewScale,
    1,
    1
  )
  selectBox.graphic.graphics.clear()
  selectBox.graphic.graphics.setStrokeStyle(1)
  gameView.addChild(selectBox.graphic)
  drawSelectBox()
}

export function DragBox(evt: createjs.MouseEvent): void {
  selectBox.graphic.graphics.clear()
  selectBox.rect.width = evt.stageX / levelViewScale - selectBox.rect.x
  selectBox.rect.height =
    (evt.stageY - gameView.y) / levelViewScale - selectBox.rect.y
  drawSelectBox()
}

export function SelectWithBox(): void {
  // remove selected items not in the box
  moveChildrenFromSelectedToObjCont()
  // add items in the box
  levelDesignConts.map(({ children, getChildAt }) =>
    children
      .map((_, i) => getChildAt(i))
      .forEach((kid) => {
        // eslint-disable-next-line
        kid.on('mousedown', selectItem as (evt: Object) => boolean)
        if (helpers.isInRectangle(kid.x, kid.y, selectBox.rect)) {
          selectContainer.addChild(kid)
        }
      })
  )

  if (selectContainer.numChildren === 0) {
    selectBox.graphic.graphics.clear()
  } else {
    selectBox.graphic.graphics.clear()
    selectContainer.alpha = 0.5
  }
  stage.update()
}

export function createThunderCloud(): void {
  const kid = spawnThunderCloud(
    800,
    catzRocket.catzRocket.catzRocketContainer.y
  )
  if (createjs.Ticker.paused) {
    setupObjEvents(kid)
  }
  stage.update()
}

export function CreateSeagull(): void {
  const kid = spawnAttackBird(
    'seagull',
    800,
    catzRocket.catzRocket.catzRocketContainer.y
  )
  if (createjs.Ticker.paused) {
    setupObjEvents(kid)
  }
  stage.update()
}

export function CreateGreatDiamond(): void {
  const kid = helpers.createSprite(
    spriteSheetData.spriteSheets.greatDiamond,
    'greatCycle',
    {
      x: 800,
      y: catzRocket.catzRocket.catzRocketContainer.y,
    }
  )
  diamondContainer.addChild(kid)
  if (createjs.Ticker.paused) {
    setupObjEvents(kid)
  }
  stage.update()
}

function updateWorldContainer(): void {
  const zoomDuration = 1000
  const zoomOutLimit = 0.37

  if (
    !createjs.Tween.hasActiveTweens(gameView) &&
    !createjs.Tween.hasActiveTweens(bg) &&
    !createjs.Tween.hasActiveTweens(starsContainer) &&
    !catzRocket.catzRocket.isCrashed
  ) {
    if (
      !zoomOut &&
      catzRocket.catzRocket.catzRocketContainer.y < 0 &&
      catzRocket.catzRocket.catzState === catzRocket.catzStateEnum.Normal
    ) {
      createjs.Tween.get(gameView)
        .to(
          {
            scaleX: zoomOutLimit,
            scaleY: zoomOutLimit,
          },
          zoomDuration,
          createjs.Ease.linear
        )
        .call(function zoomOutCallback() {
          zoomOut = true
        })

      createjs.Tween.get(bg).to(
        {
          scaleX: 1,
          scaleY: zoomOutLimit,
        },
        zoomDuration,
        createjs.Ease.linear
      )

      createjs.Tween.get(starsContainer).to(
        {
          scaleX: zoomOutLimit,
          scaleY: zoomOutLimit,
        },
        zoomDuration,
        createjs.Ease.linear
      )
    } else if (
      zoomOut &&
      catzRocket.catzRocket.catzRocketContainer.y > 300 &&
      catzRocket.catzRocket.catzState === catzRocket.catzStateEnum.Normal
    ) {
      createjs.Tween.get(gameView)
        .to(
          {
            scaleX: 1,
            scaleY: 1,
          },
          zoomDuration,
          createjs.Ease.linear
        )
        .call(function zoomOutCallback() {
          zoomOut = false
        })

      createjs.Tween.get(bg).to(
        {
          scaleX: 1,
          scaleY: 1,
        },
        zoomDuration,
        createjs.Ease.linear
      )

      createjs.Tween.get(starsContainer).to(
        {
          scaleX: 1,
          scaleY: 1,
        },
        zoomDuration,
        createjs.Ease.linear
      )
    }
  }

  const catzCameraPos = Math.min(
    catzRocket.catzRocket.catzRocketContainer.y,
    200
  )
  const zoomPercent = (gameView.scaleY - zoomOutLimit) / (1 - zoomOutLimit)
  bg.y = (-1100 - catzCameraPos / 3) * zoomPercent - 200 * (1 - zoomPercent)
  starsContainer.y =
    (100 - catzCameraPos / 3) * zoomPercent - 270 * (1 - zoomPercent)
  gameView.y = (200 - catzCameraPos) * zoomPercent + 300 * (1 - zoomPercent)
}

function updateParallax(event: createjs.Event): void {
  for (const kid of parallaxContainer.children) {
    if (kid.x <= -2460) kid.x = 2460
    kid.x -= (parallaxSpeed * event.delta) / 10
  }
}

function updateFg(event: createjs.Event): void {
  if (Math.random() > 0.98) {
    const tree = helpers.createBitmap(queue.getResult('fgTree1'), {
      x: 2200,
      y: 290,
    })
    fgContainer.addChild(tree)
  }
  for (const kid of fgContainer.children) {
    if (kid.x <= -3200) kid.x += 6000
    kid.x -= (fgSpeed * event.delta) / 10
    if (
      catzRocket.catzRocket.catzBounds &&
      catzRocket.catzRocket.catzRocketContainer.x -
        catzRocket.catzRocket.catzBounds.width <
        kid.x &&
      catzRocket.catzRocket.catzRocketContainer.x > kid.x &&
      catzRocket.catzRocket.catzRocketContainer.y -
        catzRocket.catzRocket.catzBounds.height <
        kid.y &&
      catzRocket.catzRocket.catzRocketContainer.y > kid.y
    ) {
      leaves.alpha = 1
      leaves.rotation = 0
      leaves.x = kid.x + 50
      leaves.y = kid.y
      leaves.gotoAndPlay('cycle')
      leaves.addEventListener('animationend', hideLeaves)
    }
  }
  if (fgContainer.children.length > 3) {
    if (fgContainer.children[3].x < -100) fgContainer.removeChildAt(3)
  }

  if (leaves.alpha === 1) {
    leaves.x -= (fgSpeed * event.delta) / 20
  }
}

function updateFgTop(event: createjs.Event): void {
  for (const kid of fgTopContainer.children) {
    if (kid.x <= -3200) {
      kid.x += 6000
    }
    kid.x -= (fgSpeed * event.delta) / 10
  }
}

function spawnCloud(): void {
  const cloudtype = `cloud-${Math.floor(Math.random() * 5 + 1).toString()}`
  const scale = Math.random() * 0.3 + 0.3
  const cloud = new Cloud(cloudImg[cloudtype])
  cloud.scaleX = scale
  cloud.scaleY = scale
  cloud.x = 2200
  cloud.y = Math.floor(Math.random() * 1000 - 1000)
  cloud.catzIsInside = false
  // cloudContainer.addChild(cloud)
}

function updateClouds(): void {
  if (Math.random() > 0.97) {
    spawnCloud()
  }
  for (const [i, kid] of cloudContainer.children.entries() as IterableIterator<
    [number, ICloud]
  >) {
    kid.x -= cloudSpeed
    if (kid.x <= -500) {
      cloudContainer.removeChildAt(i)
    } else {
      const rect = kid.getBounds()
      if (
        rect &&
        catzRocket.catzRocket.catzRocketContainer.x <
          kid.x + rect.width * kid.scaleX &&
        catzRocket.catzRocket.catzRocketContainer.x > kid.x &&
        catzRocket.catzRocket.catzRocketContainer.y <
          kid.y + rect.height * kid.scaleY &&
        catzRocket.catzRocket.catzRocketContainer.y > kid.y &&
        kid.catzIsInside === false
      ) {
        kid.catzIsInside = true
        smoke.alpha = 1
        smoke.rotation =
          catzRocket.catzRocket.catzRocketContainer.rotation + 270
        smoke.x = catzRocket.catzRocket.catzRocketContainer.x
        smoke.y = catzRocket.catzRocket.catzRocketContainer.y
        smoke.gotoAndPlay('jump')
        smoke.addEventListener('animationend', hideSmoke)
      } else if (
        kid.catzIsInside === true &&
        ((catzRocket.catzRocket.catzBounds &&
          catzRocket.catzRocket.catzRocketContainer.x -
            catzRocket.catzRocket.catzBounds.width / 2 >
            kid.x + rect.width * kid.scaleX) ||
          (catzRocket.catzRocket.catzBounds &&
            catzRocket.catzRocket.catzRocketContainer.y -
              catzRocket.catzRocket.catzBounds.height / 2 >
              kid.y + rect.height * kid.scaleY) ||
          (catzRocket.catzRocket.catzBounds &&
            catzRocket.catzRocket.catzRocketContainer.y +
              catzRocket.catzRocket.catzBounds.height <
              kid.y))
      ) {
        kid.catzIsInside = false
        exitSmoke.alpha = 1
        exitSmoke.rotation = catzRocket.catzRocket.catzRocketContainer.rotation
        exitSmoke.x = catzRocket.catzRocket.catzRocketContainer.x
        exitSmoke.y = catzRocket.catzRocket.catzRocketContainer.y
        exitSmoke.gotoAndPlay('right')
        exitSmoke.addEventListener('animationend', hideExitSmoke)
      }
    }
  }
  if (smoke.alpha === 1) {
    smoke.x -= cloudSpeed
  }
  if (exitSmoke.alpha === 1) {
    exitSmoke.x -= cloudSpeed
  }
}

function updateThunderClouds(): void {
  for (const [
    i,
    kid,
  ] of thunderContainer.children.entries() as IterableIterator<
    [number, IThunderCloud]
  >) {
    kid.update()
    kid.x -= cloudSpeed
    if (kid.x <= -500) {
      thunderContainer.removeChildAt(i)
    } else if (
      (!kid.lastFired ||
        new Date().valueOf() - kid.lastFired.valueOf() > 300) &&
      !catzRocket.catzRocket.isHit &&
      catzRocket.catzRocket.catzRocketContainer.x <
        kid.x + kid.width * kid.scaleX &&
      catzRocket.catzRocket.catzRocketContainer.x > kid.x &&
      catzRocket.catzRocket.catzRocketContainer.y <
        kid.y + kid.height * kid.scaleY + 400 &&
      catzRocket.catzRocket.catzRocketContainer.y > kid.y + 50
    ) {
      kid.lastFired = new Date()
      let birdHit = false
      let spotX = 0
      let spotY = 0
      for (const bird of attackBirdContainer.children as IAttackBird[]) {
        if (
          bird.x < kid.x + kid.width * kid.scaleX + 100 &&
          bird.x > kid.x - 150 &&
          bird.y < catzRocket.catzRocket.catzRocketContainer.y &&
          bird.y > kid.y + 50
        ) {
          birdHit = true
          bird.setGrilled()
          break
        }
      }
      if (kid.lastFired !== null && !birdHit) {
        break
      }
      if (!birdHit) {
        if (!debugOptions.godMode) {
          if (catzRocket.getHit(true)) {
            catzFellOfRocket()
          }
        }
        spotX = catzRocket.catzRocket.catzRocketContainer.x
        spotY = catzRocket.catzRocket.catzRocketContainer.y
      }
      const lightning = new createjs.Shape()
      lightning.graphics.setStrokeStyle(3, 1)
      lightning.graphics.beginStroke(lightningColor)
      lightning.graphics.moveTo(kid.x, kid.y)
      lightning.graphics.lineTo(
        kid.x + (spotX - kid.x) / 3 + 50,
        kid.y + (spotY - kid.y) / 3
      )
      lightning.graphics.lineTo(
        kid.x + ((spotX - kid.x) * 2) / 3 - 50,
        kid.y + ((spotY - kid.y) * 2) / 3
      )
      lightning.graphics.lineTo(spotX, spotY)
      lightning.graphics.endStroke()
      lightningContainer.addChild(lightning)
      createjs.Tween.get(lightning).to(
        {
          alpha: 0,
        },
        300
      )
      createjs.Sound.play('lightningBolt')
      createjs.Tween.get(gameView)
        .to(
          {
            x: -50,
            y: 20,
          },
          50
        )
        .to(
          {
            x: 50,
            y: -40,
          },
          50
        )
        .to(
          {
            x: -50,
            y: 50,
          },
          50
        )
        .to(
          {
            x: 20,
            y: -20,
          },
          50
        )
        .to(
          {
            x: -10,
            y: 10,
          },
          50
        )
        .to(
          {
            x: 10,
            y: -10,
          },
          50
        )
        .to(
          {
            x: 0,
            y: 0,
          },
          50
        )
    }
  }
}

function setParallax(int: number): void {
  createjs.Tween.get(gameView)
    .to(
      {
        alpha: 0,
      },
      800
    )
    .call(function changeParallaxCallback() {
      changeParallax(int)
    })
    .to(
      {
        alpha: 1,
      },
      800
    )
}

function generateTrack(): TrackPart[] {
  const result = []
  let displacementX = 2000
  const { difficulty } = store.getState()
  if (difficulty >= 0) {
    for (const trk of tracks[currentLevel][currentTrack]) {
      const trkParts = JSON.parse(
        JSON.stringify(trackParts[trk.difficulty][trk.name])
      ) // deep copy

      for (const [i, element] of trkParts.entries()) {
        element.x += displacementX
        if (i === trkParts.length - 1 && element.graphicType !== 'attackBird') {
          displacementX = element.x
        }
      }
      result.push(...trkParts)
    }
    currentTrack += 1
  }
  return result
}

function updateDirector(event: createjs.Event): void {
  if (onTrack) {
    if (diamondContainer.numChildren === 0) {
      onTrack = false
      if (tracks[currentLevel].length === currentTrack) {
        currentTrack = 0
        currentLevel += 1
        if (tracks.length === currentLevel) {
          currentLevel = 0
        }
        setParallax(currentLevel)
      }
    }
  } else {
    trackTimer += event.delta
    if (trackTimer > 1000) {
      trackTimer = 0
      onTrack = true
      store.dispatch({ type: ACTION_TYPES.INCREMENT_DIFFICULTY })
      track = generateTrack()
      for (let i = 0, max = track.length; i < max; i += 1) {
        const tp: TrackPart = track[i]
        if (tp.type === 'thunderCloud') {
          spawnThunderCloud(tp.x, tp.y - 200)
        } else if (tp.graphicType === 'sprite') {
          const sprite = helpers.createSprite(
            spriteSheetData.spriteSheets[tp.type],
            tp.animation,
            {
              x: tp.x,
              y: tp.y,
            }
          )
          containerDict[tp.type].addChild(sprite)
        } else if (tp.graphicType === 'attackBird') {
          spawnAttackBird(
            tp.animation,
            tp.x,
            tp.y + catzRocket.catzRocket.catzRocketContainer.y
          )
        }
      }
    }
  }
}

function updateOnlookers(event: createjs.Event): void {
  let xOffset = 0
  function addOnlooker(onlooker: createjs.Sprite): void {
    const oCont = new createjs.Container()
    oCont.x = 2000 + xOffset
    xOffset += 300
    oCont.y = 180
    onlooker.x = 180 // eslint-disable-line no-param-reassign
    onlooker.y = 0 // eslint-disable-line no-param-reassign
    const variant = `mobHill${Math.floor(Math.random() * 2 + 1)}`
    const hill = helpers.createBitmap(queue.getResult(variant), {
      y: 95,
    })
    oCont.addChild(onlooker, hill)
    onlookerContainer.addChild(oCont)
  }
  if (onlookerContainer.children.length < 3) {
    let onlooker
    const {
      kittensApprovalRating,
      catPartyApprovalRating,
      villagersApprovalRating,
    } = store.getState()
    if (Math.random() > 1 - kittensApprovalRating) {
      onlooker = helpers.createSprite(
        spriteSheetData.spriteSheets.onlookers,
        'orphans',
        {}
      )
      addOnlooker(onlooker)
    }
    if (Math.random() < -catPartyApprovalRating) {
      onlooker = helpers.createSprite(
        spriteSheetData.spriteSheets.onlookers,
        'cat party',
        {}
      )
      addOnlooker(onlooker)
    }
    if (Math.random() < -villagersApprovalRating) {
      onlooker = helpers.createSprite(
        spriteSheetData.spriteSheets.onlookers,
        'angry mob',
        {}
      )
      addOnlooker(onlooker)
    }
    if (Math.random() > 1 - villagersApprovalRating) {
      onlooker = helpers.createSprite(
        spriteSheetData.spriteSheets.onlookers,
        'loving mob',
        {}
      )
      addOnlooker(onlooker)
    }
  }

  for (const [i, oC] of onlookerContainer.children.entries()) {
    oC.x -= (diSpeed / 2) * event.delta
    if (oC.x <= -400) {
      onlookerContainer.removeChildAt(i)
    }
  }
}

function updatePointer(): void {
  const progressBar = document.querySelector('.progress-bar')
  if (progressBar instanceof HTMLElement) {
    progressBar.style.width = `${catzRocket.catzRocket.diamondFuel * 10}%`
    if (catzRocket.catzRocket.diamondFuel < 2) {
      if (fuelBlinkTimer > 10) {
        progressBar.classList.toggle('background-red')
        fuelBlinkTimer = 0
      }
      fuelBlinkTimer += 1
    }
    if (catzRocket.catzRocket.diamondFuel >= 2) {
      progressBar.classList.remove('background-red')
    }
    // hudPointer.rotation = Math.min(-30 + catzRocket.catzRocket.diamondFuel*135/10,105);
  }
}

function updateDiamonds(event: createjs.Event): void {
  for (const [
    i,
    kid,
  ] of diamondContainer.children.entries() as IterableIterator<
    [number, createjs.Sprite]
  >) {
    kid.x -= diSpeed * event.delta
    if (kid.x <= -100) {
      diamondContainer.removeChildAt(i)
    } else if (overlapCheckCircle(kid.x, kid.y, 40)) {
      if (kid.currentAnimation === 'cycle') {
        store.dispatch({ type: ACTION_TYPES.INCREMENT_SCORE })
        catzRocket.pickupDiamond(diamondEnum.shard)
      } else if (kid.currentAnimation === 'greatCycle') {
        store.dispatch({
          type: ACTION_TYPES.INCREMENT_SCORE,
          payload: { incrementBy: 10 },
        })
        catzRocket.pickupDiamond(diamondEnum.great)
      }
      diamondContainer.removeChildAt(i)
      const instance = createjs.Sound.play('diamondSound')
      instance.volume = 0.15
    }
  }
}

function noWind(): void {
  wind = 0
  windContainer.removeAllChildren()
}

function updateAttackBird(event: createjs.Event): void {
  for (const kid of attackBirdContainer.children as IAttackBird[]) {
    kid.update(
      catzRocket.catzRocket.catzRocketContainer.x,
      catzRocket.catzRocket.catzRocketContainer.y,
      event
    )
    moveAndCollisionCheck(kid, event)
    catzCollisionCheck(kid)
    if (flameCollisionCheck(kid)) {
      kid.temperature += event.delta
      if (kid.temperature > 10 && kid.state !== 'grilled') {
        kid.setGrilled()
        store.dispatch({ type: ACTION_TYPES.INCREMENT_KILLS })
      }
    } else if (kid.temperature >= 0) {
      kid.temperature -= event.delta
      if (kid.temperature < 0) {
        kid.temperature = 0
      }
    }
  }
}

// hittar de globala x-y koordinaterna till hörnen på raketen, samt normalvektorer
function updateVertices(): void {
  const s = Math.sin(
    (catzRocket.catzRocket.catzRocketContainer.rotation * Math.PI) / 180
  )
  const c = Math.cos(
    (catzRocket.catzRocket.catzRocketContainer.rotation * Math.PI) / 180
  )
  let x
  let y
  let h
  let w

  if (catzRocket.hasFrenzy()) {
    x = catzRocket.catzRocket.catzRocketContainer.x + 70 * c - 13 * s
    y = catzRocket.catzRocket.catzRocketContainer.y + 13 * c + 70 * s
    h = newBounds.height / 2 + 5
    w = newBounds.width / 2 + 10
  } else {
    x = catzRocket.catzRocket.catzRocketContainer.x - 10 * c - 13 * s
    y = catzRocket.catzRocket.catzRocketContainer.y + 13 * c - 10 * s
    h = newBounds.height / 2
    w = newBounds.width / 2
  }

  polygonVertices[0].x = x - w * c - h * s
  polygonVertices[0].y = y + h * c - w * s
  polygonVertices[1].x = x - w * c + h * s
  polygonVertices[1].y = y - h * c - w * s
  polygonVertices[2].x = x + w * c + h * s
  polygonVertices[2].y = y - h * c + w * s
  polygonVertices[3].x = x + (w + newBounds.nose) * c
  polygonVertices[3].y = y + (w + newBounds.nose) * s
  polygonVertices[4].x = x + w * c - h * s
  polygonVertices[4].y = y + h * c + w * s

  norm[0].x = -(polygonVertices[0].y - polygonVertices[1].y) / newBounds.height
  norm[0].y = -(polygonVertices[1].x - polygonVertices[0].x) / newBounds.height
  norm[1].x = -(polygonVertices[1].y - polygonVertices[2].y) / newBounds.width
  norm[1].y = -(polygonVertices[2].x - polygonVertices[1].x) / newBounds.width
  norm[2].x = -(polygonVertices[2].y - polygonVertices[3].y) / newBounds.noseLen
  norm[2].y = -(polygonVertices[3].x - polygonVertices[2].x) / newBounds.noseLen
  norm[3].x = -(polygonVertices[3].y - polygonVertices[4].y) / newBounds.noseLen
  norm[3].y = -(polygonVertices[4].x - polygonVertices[3].x) / newBounds.noseLen

  if (catzRocket.catzRocket.isWounded) {
    x = catzRocket.catzRocket.catzRocketContainer.x - 55 * c + 3 * s
    y = catzRocket.catzRocket.catzRocketContainer.y - 3 * c - 55 * s
  } else {
    x = catzRocket.catzRocket.catzRocketContainer.x - 5 * c + 3 * s
    y = catzRocket.catzRocket.catzRocketContainer.y - 3 * c - 5 * s
  }

  if (!catzRocket.catzRocket.catzBounds) {
    throw new Error('catzBounds not set')
  }

  h = catzRocket.catzRocket.catzBounds.height / 2
  w = catzRocket.catzRocket.catzBounds.width / 2
  catzVertices[0].x = x - w * c - h * s
  catzVertices[0].y = y + h * c - w * s
  catzVertices[1].x = x - w * c + h * s
  catzVertices[1].y = y - h * c - w * s
  catzVertices[2].x = x + w * c + h * s
  catzVertices[2].y = y - h * c + w * s
  catzVertices[3].x = x + w * c - h * s
  catzVertices[3].y = y + h * c + w * s

  catzNorm[0].x =
    (catzVertices[0].y - catzVertices[1].y) /
    catzRocket.catzRocket.catzBounds.height
  catzNorm[0].y =
    (catzVertices[1].x - catzVertices[0].x) /
    catzRocket.catzRocket.catzBounds.height
  catzNorm[1].x =
    (catzVertices[1].y - catzVertices[2].y) /
    catzRocket.catzRocket.catzBounds.width
  catzNorm[1].y =
    (catzVertices[2].x - catzVertices[1].x) /
    catzRocket.catzRocket.catzBounds.width

  if (catzRocket.hasFrenzy()) {
    x = catzRocket.catzRocket.catzRocketContainer.x + 55 * c - 13 * s
    y = catzRocket.catzRocket.catzRocketContainer.y + 13 * c + 55 * s
  } else {
    x = catzRocket.catzRocket.catzRocketContainer.x - 40 * c - 13 * s
    y = catzRocket.catzRocket.catzRocketContainer.y + 13 * c - 40 * s
  }
  h = flameBounds.height / 2
  w = flameBounds.width
  flameVertices[0].x = x - h * s
  flameVertices[0].y = y + h * c
  flameVertices[1].x = x + h * s
  flameVertices[1].y = y - h * c
  flameVertices[2].x = x - w * c
  flameVertices[2].y = y - w * s
  flameNorm[0].x =
    (flameVertices[0].y - flameVertices[1].y) / flameBounds.height
  flameNorm[0].y =
    (flameVertices[1].x - flameVertices[0].x) / flameBounds.height
  flameNorm[1].x =
    -(flameVertices[0].y - flameVertices[2].y) / flameBounds.length
  flameNorm[1].y =
    -(flameVertices[2].x - flameVertices[0].x) / flameBounds.length
  flameNorm[2].x =
    (flameVertices[1].y - flameVertices[2].y) / flameBounds.length
  flameNorm[2].y =
    (flameVertices[2].x - flameVertices[1].x) / flameBounds.length
}

function drawCollisionModels(): void {
  polygonLine.graphics = new createjs.Graphics()
  polygonLine.x = 0
  polygonLine.y = 0
  for (const i of polygonVertices.keys()) {
    polygonLine.graphics.setStrokeStyle(2, 1)
    polygonLine.graphics.beginStroke('black')
    polygonLine.graphics.moveTo(polygonVertices[i].x, polygonVertices[i].y)
    if (i === polygonVertices.length - 1) {
      polygonLine.graphics.lineTo(polygonVertices[0].x, polygonVertices[0].y)
    } else {
      polygonLine.graphics.lineTo(
        polygonVertices[i + 1].x,
        polygonVertices[i + 1].y
      )
    }
    polygonLine.graphics.endStroke()
  }
  for (const i of catzVertices.keys()) {
    polygonLine.graphics.setStrokeStyle(2, 1)
    polygonLine.graphics.beginStroke('red')
    polygonLine.graphics.moveTo(catzVertices[i].x, catzVertices[i].y)
    if (i === catzVertices.length - 1) {
      polygonLine.graphics.lineTo(catzVertices[0].x, catzVertices[0].y)
    } else {
      polygonLine.graphics.lineTo(catzVertices[i + 1].x, catzVertices[i + 1].y)
    }
    polygonLine.graphics.endStroke()
  }

  for (const i of flameVertices.keys()) {
    polygonLine.graphics.setStrokeStyle(2, 1)
    polygonLine.graphics.beginStroke('green')
    polygonLine.graphics.moveTo(flameVertices[i].x, flameVertices[i].y)
    if (i === flameVertices.length - 1) {
      polygonLine.graphics.lineTo(flameVertices[0].x, flameVertices[0].y)
    } else {
      polygonLine.graphics.lineTo(
        flameVertices[i + 1].x,
        flameVertices[i + 1].y
      )
    }
    polygonLine.graphics.endStroke()
  }
  polygonLine.graphics.setStrokeStyle(2, 2)
  polygonLine.graphics.beginStroke('pink')
  polygonLine.graphics.moveTo(
    catzRocket.catzRocket.catzRocketContainer.x,
    catzRocket.catzRocket.catzRocketContainer.y
  )
  polygonLine.graphics.lineTo(
    catzRocket.catzRocket.catzRocketContainer.x + lastResolveNorm[0] * 100,
    catzRocket.catzRocket.catzRocketContainer.y + lastResolveNorm[1] * 100
  )
  polygonLine.graphics.endStroke()
}

function resetGameView(): void {
  currentTrack = 0
  currentLevel = 0
  lightningContainer.removeAllChildren()
  attackBirdContainer.removeAllChildren()
  collisionCheckDebugContainer.removeAllChildren()
  diamondContainer.removeAllChildren()
  onlookerContainer.removeAllChildren()
  thunderContainer.removeAllChildren()
  setParallax(currentLevel)
  noWind()
  updatePointer()
  bg.y = -1200
  bg.scaleX = 1
  bg.scaleY = 1
  starsContainer.y = 0
  starsContainer.scaleX = 1
  starsContainer.scaleY = 1
  gameView.y = 0
  gameView.scaleX = 1
  gameView.scaleY = 1
  stage.removeAllEventListeners()
  stage.removeChild(gameView)
  stage.update()
  createjs.Ticker.framerate = 20
  createjs.Ticker.off('tick', gameListener)
  onTrack = false
}

function crash(): void {
  const instance = createjs.Sound.play('catzRocketCrash')
  instance.volume = 0.5

  resetGameView()
  catzRocket.reset()
  updatePointer()
  stage.update()
  trigger(events.CRASH)
}

export function update(event: createjs.Event): boolean {
  if (!event.paused) {
    let mult = 1
    if (catzRocket.hasFrenzy()) mult = 2
    diSpeed =
      (0.3 +
        0.3 *
          Math.cos(
            (catzRocket.catzRocket.catzRocketContainer.rotation / 360) *
              2 *
              Math.PI
          )) *
      mult
    cloudSpeed =
      (12.5 +
        12.5 *
          Math.cos(
            (catzRocket.catzRocket.catzRocketContainer.rotation / 360) *
              2 *
              Math.PI
          )) *
      mult
    fgSpeed =
      (7 +
        7 *
          Math.cos(
            (catzRocket.catzRocket.catzRocketContainer.rotation / 360) *
              2 *
              Math.PI
          )) *
      mult
    parallaxSpeed =
      (0.3 +
        0.3 *
          Math.cos(
            (catzRocket.catzRocket.catzRocketContainer.rotation / 360) *
              2 *
              Math.PI
          )) *
      mult

    const { hasHappend } = store.getState()

    if (!hasHappend.firstFrenzy && catzRocket.hasFrenzy()) {
      store.dispatch({
        type: ACTION_TYPES.HAS_HAPPEND,
        payload: { firstFrenzy: true },
      })
    }
    catzRocket.update(grav, wind, event)
    updateVertices()
    updateDirector(event)
    updateOnlookers(event)
    updateFg(event)
    updateFgTop(event)
    updateParallax(event)
    updateDiamonds(event)
    updatePointer()
    updateClouds()
    updateWorldContainer()
    updateThunderClouds()
    updateAttackBird(event)
    drawCollisionModels()
    if (catzRocket.catzRocket.isCrashed) {
      crash()
    }
    debugText.text = `rotation ${catzRocket.catzRocket.catzRocketContainer.rotation}
    velocity ${catzRocket.catzRocket.catzVelocity}
    fuel  ${catzRocket.catzRocket.diamondFuel}
    frenzyReady: ${catzRocket.catzRocket.frenzyReady}
    currentDisplacement: ${currentDisplacement}
    currentLevel: ${currentLevel}
    mousedown: ${mousedown}
    state: ${catzRocket.catzRocket.catzState}
    diamondContainer: ${diamondContainer.x}`

    stage.update(event)
  }
  return false
}

export function SetObjectEventListeners(turnOn: boolean): void {
  if (!turnOn) {
    moveChildrenFromSelectedToObjCont()
  }
  for (const container of levelDesignConts) {
    for (const kid of container.children as createjs.Sprite[]) {
      if (turnOn) {
        setupObjEvents(kid)
      } else {
        kid.off('mousedown', selectItem)
        if (getObjType(kid.currentAnimation) === 'attackBird') {
          kid.removeAllEventListeners()
        }
      }
    }
  }
}

export function gotoGameView(): void {
  if (rocketSong.getPosition() < 100) {
    rocketSong.play({
      loop: -1,
    })
  }
  store.dispatch({ type: ACTION_TYPES.INCREMENT_ROUND })
  zoomOut = false

  if (!debugOptions.debugMode) {
    collisionCheckDebugContainer.alpha = 0
    debugText.alpha = 0
  }
  stage.addChild(gameView, windContainer, diamondCounterText, debugText)
  // eslint-disable-next-line
  gameListener = createjs.Ticker.on('tick', update as (evt: Object) => boolean)
  createjs.Ticker.framerate = 30
  catzRocket.start(-20)

  stage.addEventListener('stagemousedown', function onMouseDown() {
    mousedown = true
    catzRocket.catzUp()
  })
  stage.addEventListener('stagemouseup', function onMouseUp() {
    mousedown = false
    catzRocket.catzEndLoop()
  })

  const { hasHappend } = store.getState()
  if (!hasHappend.firstRound) {
    store.dispatch({
      type: ACTION_TYPES.HAS_HAPPEND,
      payload: { firstRound: true },
    })
  }
  stage.update()
}
