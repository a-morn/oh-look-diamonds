/*


import TrackParts from './track-parts'
import * as gameLogic from './game-logic'
import * as CatzRocket from './catz-rocket'
import LevelManifest from './level-manifest'
import * as spriteSheetData from './sprite-sheet-data'
import {
  createRectangle,
  createBitmap,
  createSprite,
  createText,
  isInRectangle,
} from './helpers'

let progressBar
let stage
let queue
let inGameMode = false
const isSpriteMode = true
let levels
let ctrlPressed = false
const grav = 12
let dbText
const selectBox = {
  rect: null,
  graphic: null,
}

const bgCoordinates = {
  width: 800,
  height: 1800,
  offset: -520,
}

const fgCoordinates = {
  height: 150,
  width: 2000,
}

const catzStartPos = {
  x: 260,
  y: 1030,
}

let catzRocketXpos = 0
const YOriginPosInGame = 830
const levelLength = 13500
const levelViewScale = 0.5
const beginningZoneLength = 1000
const bgCont = new createjs.Container()
const objCont = new createjs.Container()
const levelView = new createjs.Container()
let gameClickScreen
let clipBoard
let clipOffset = 0

function handleProgress(event) {
  progressBar.graphics
    .beginFill('#330033')
    .drawRect(0, 0, 100 * event.progress, 20)
  stage.update()
}

function populateDDL() {
  const ddl = document.querySelector('.importSelect')
  levels = Object.keys(TrackParts.easy)
  for (const level of levels) {
    const option = document.createElement('option')
    option.text = level
    ddl.add(option)
  }
}

function createBG() {
  for (
    let i = 0, len = 2 + levelLength / bgCoordinates.width;
    i < len;
    i += 1
  ) {
    const bgClone = new createjs.Bitmap(queue.getResult('bg'))
    bgClone.x = i * bgCoordinates.width
    bgClone.y = bgCoordinates.offset
    if (i % 2 === 0) {
      bgClone.scaleX = -1
      bgClone.x -= bgCoordinates.width
    }
    bgCont.addChild(bgClone)
  }
  for (let i = 0, len = levelLength / fgCoordinates.width; i < len; i += 1) {
    const fgClone = new createjs.Bitmap(queue.getResult('fgGround'))
    fgClone.x = fgCoordinates.width * i
    fgClone.y = 300 + YOriginPosInGame
    const topClone = new createjs.Bitmap(queue.getResult('fgGroundTop'))
    topClone.x = fgCoordinates.width * i
    topClone.y = 0
    bgCont.addChild(fgClone, topClone)
  }
  const startLine = createRectangle(
    10,
    bgCoordinates.height - bgCoordinates.offset,
    'red',
    { x: beginningZoneLength }
  )
  bgCont.addChild(startLine)
}

function pressMoveCatz(evt) {
  evt.currentTarget.x = evt.stageX / levelViewScale // eslint-disable-line no-param-reassign
  evt.currentTarget.y = evt.stageY / levelViewScale // eslint-disable-line no-param-reassign
  stage.update()
}

function createCatz() {
  CatzRocket.init()
  CatzRocket.catzRocket.catz = createSprite(
    spriteSheetData.spriteSheets.rocket,
    'no shake',
    {
      y: 5,
    }
  )
  CatzRocket.catzRocket.catzRocketContainer.regY = 100
  CatzRocket.catzRocket.catzRocketContainer.regX = 150
  CatzRocket.catzRocket.catz.currentFrame = 0
  CatzRocket.catzRocket.rocketFlame = createSprite(
    spriteSheetData.spriteSheets.flame,
    'cycle',
    {
      x: 190,
      y: 200,
      regX: 40,
      regY: -37,
      alpha: 0,
    }
  )
  CatzRocket.catzRocket.SnakeLine = new createjs.Shape()
  CatzRocket.catzRocket.rocket = createBitmap(queue.getResult('rocket'), {
    scaleX: 0.25,
    scaleY: 0.25,
    regX: -430,
    regY: -320,
  })
  CatzRocket.catzRocket.rocketSound = createjs.Sound.play('rocketSound')
  CatzRocket.catzRocket.rocketSound.volume = 0.1
  CatzRocket.catzRocket.rocketSound.stop()
  for (let i = 0, snakeAmt = 11; i < snakeAmt; i += 1) {
    const shape = new createjs.Shape()
    const x = 260 - i * 5
    const r = 9
    shape.graphics.f('fffff').dc(x, 200, r)
    shape.regY = 5
    shape.regX = 5
    CatzRocket.catzRocket.rocketSnake.addChild(shape)
  }
  CatzRocket.setCrashBorders(0, YOriginPosInGame + 450)
  CatzRocket.catzRocket.catzRocketContainer.addChild(
    CatzRocket.catzRocket.rocket,
    CatzRocket.catzRocket.catz
  )
  CatzRocket.catzRocket.catzRocketContainer.on('pressmove', pressMoveCatz)
}

function createGameClickScreen(w, h) {
  gameClickScreen = createRectangle(w, h, 'ffffff', {
    alpha: 0,
  })
}

function createLevelView() {
  createBG()
  createCatz()

  levelView.addChild(bgCont, objCont, CatzRocket.catzRocket.catzRocketContainer)
  levelView.scaleX = levelViewScale
  levelView.scaleY = levelViewScale
  const canvasHeight =
    (bgCoordinates.height + bgCoordinates.offset) * levelViewScale
  const canvasWidth = levelLength * levelViewScale
  document.querySelector('.levelEditCanvas').height = canvasHeight
  document.querySelector('.levelEditCanvas').width = canvasWidth
  createGameClickScreen(canvasWidth, canvasHeight)
}

function initSelectBox() {
  selectBox.rect = new createjs.Rectangle(0, 0, 0, 0)
  selectBox.graphic = new createjs.Shape()
}

function moveChildrenFromSelectedToObjCont() {
  for (let i = gameLogic.SelectedCont.numChildren - 1; i >= 0; i -= 1) {
    const kid = gameLogic.SelectedCont.getChildAt(i)
    kid.x += gameLogic.SelectedCont.x
    kid.y += gameLogic.SelectedCont.y
    kid.alpha = 1
    objCont.addChild(kid)
  }
  gameLogic.SelectedCont.x = 0
  gameLogic.SelectedCont.y = 0
}

function drawSelectBox() {
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

function createSelectBox(evt) {
  moveChildrenFromSelectedToObjCont()
  selectBox.rect.setValues(
    evt.stageX / levelViewScale,
    evt.stageY / levelViewScale,
    1,
    1
  )
  selectBox.graphic.graphics.clear()
  selectBox.graphic.graphics.setStrokeStyle(1)
  levelView.addChild(selectBox.graphic)
  drawSelectBox()
}

function dragBox(evt) {
  selectBox.graphic.graphics.clear()
  selectBox.rect.width = evt.stageX / levelViewScale - selectBox.rect.x
  selectBox.rect.height = evt.stageY / levelViewScale - selectBox.rect.y
  drawSelectBox()
}

function selectWithBox() {
  // remove selected items not in the box
  moveChildrenFromSelectedToObjCont()
  // add items in the box
  for (let i = objCont.numChildren - 1; i >= 0; i -= 1) {
    const kid = objCont.getChildAt(i)
    if (isInRectangle(kid.x, kid.y, selectBox.rect)) {
      gameLogic.SelectedCont.addChild(kid)
    }
  }
  if (gameLogic.SelectedCont.numChildren === 0) {
    selectBox.graphic.graphics.clear()
  } else {
    selectBox.graphic.graphics.clear()
    gameLogic.SelectedCont.alpha = 0.5
  }
}

function startPressMove(evt) {
  gameLogic.selectPosOnStartDrag.x =
    evt.stageX / levelViewScale - gameLogic.SelectedCont.x
  gameLogic.selectPosOnStartDrag.y =
    evt.stageY / levelViewScale - gameLogic.SelectedCont.y
}

function selectItem(evt) {
  if (evt.currentTarget.parent === objCont) {
    moveChildrenFromSelectedToObjCont()
    gameLogic.SelectedCont.addChild(evt.currentTarget)
    startPressMove(evt)
  }
}

function createClone(object) {
  const clone = object.clone(true)
  clone.on('mousedown', selectItem)
  return clone
}

function handleKeyPress(evt) {
  if (evt.ctrlKey) {
    ctrlPressed = true
  }
  if ((evt.keyCode === 67 || evt.keyCode === 88) && ctrlPressed) {
    clipBoard = []
    clipOffset = 0
    let clipLeftMost = levelLength
    let clipRightMost = 0
    for (let i = gameLogic.SelectedCont.children.length - 1; i >= 0; i -= 1) {
      const kid = gameLogic.SelectedCont.children[i]
      kid.x -= gameLogic.SelectedCont.x
      kid.y -= gameLogic.SelectedCont.y
      clipBoard.push(createClone(kid))
      clipRightMost = Math.max(
        gameLogic.SelectedCont.children[i].x,
        clipRightMost
      )
      clipLeftMost = Math.min(
        gameLogic.SelectedCont.children[i].x,
        clipLeftMost
      )
    }
    if (evt.keyCode === 67) {
      clipOffset = clipRightMost - clipLeftMost + 50
    }
  }
  if (evt.keyCode === 86 && ctrlPressed) {
    moveChildrenFromSelectedToObjCont()
    for (let i = clipBoard.length - 1; i >= 0; i -= 1) {
      clipBoard[i].x += clipOffset
      const clone = createClone(clipBoard[i])
      clone.alpha = 0.5
      gameLogic.SelectedCont.addChild(clone)
    }
  }
  if (evt.keyCode === 88 || evt.keyCode === 46) {
    gameLogic.SelectedCont.removeAllChildren()
  }
}

function handleKeyUp(evt) {
  if (evt.ctrlKey) {
    ctrlPressed = false
  }
}

function pressMove(evt) {
  evt.currentTarget.x = // eslint-disable-line no-param-reassign
    evt.stageX / levelViewScale - gameLogic.selectPosOnStartDrag.x
  evt.currentTarget.y = // eslint-disable-line no-param-reassign
    evt.stageY / levelViewScale - gameLogic.selectPosOnStartDrag.y
  stage.update()
}

function gameMouseDown() {
  CatzRocket.catzUp()
}

function gameMouseUp() {
  CatzRocket.catzEndLoop()
}

function setEventListeners() {
  bgCont.on('mousedown', createSelectBox)
  bgCont.on('pressmove', dragBox)
  bgCont.on('pressup', selectWithBox)
  document.addEventListener('keydown', handleKeyPress)
  document.addEventListener('keyup', handleKeyUp)
  gameLogic.SelectedCont.on('mousedown', startPressMove)
  gameLogic.SelectedCont.on('pressmove', pressMove)
  gameClickScreen.on('mousedown', gameMouseDown)
  gameClickScreen.on('click', gameMouseUp)
}

function currentCenterX() {
  return window.scrollX / levelViewScale + 200
}

function exitGameMode() {
  CatzRocket.reset()
  CatzRocket.catzRocket.catzRocketContainer.y = catzStartPos.y
  CatzRocket.catzRocket.catzRocketContainer.x = currentCenterX()
  gameClickScreen.alpha = 0
  inGameMode = false
}

function gameUpdate(evt) {
  CatzRocket.catzRocket.diamondFuel = 10
  CatzRocket.update(grav, 0, evt)
  let mult = 1
  if (CatzRocket.hasFrenzy()) {
    mult = 2
  }
  catzRocketXpos +=
    evt.delta *
    (0.3 +
      0.3 *
        Math.cos(
          (CatzRocket.catzRocket.catzRocketContainer.rotation / 360) *
            2 *
            Math.PI
        )) *
    mult
  CatzRocket.catzRocket.catzRocketContainer.x += catzRocketXpos
  const x = catzRocketXpos * levelViewScale - 200
  window.scrollTo(x, 0)
  if (CatzRocket.catzRocket.isCrashed) {
    exitGameMode()
  }
}

function onTick(evt) {
  if (inGameMode === true) {
    gameUpdate(evt)
  }
  stage.update()
}

function handleComplete() {
  spriteSheetData.setValues(queue)
  populateDDL()
  createLevelView()
  initSelectBox()
  setEventListeners()
  //	createToolView();
  dbText = createText('hej', '16px Fauna One', '#ffffcc', {
    x: 30,
    y: 38,
  })
  stage.addChild(levelView, dbText, gameClickScreen)
  stage.removeChild(progressBar)
  createjs.Ticker.on('tick', onTick)
  createjs.Ticker.framrate = 30
  stage.update()
}
export function StartEditor() {
  const [canvas] = document.querySelector('.levelEditCanvas')
  stage = new createjs.Stage(canvas)
  stage.mouseMoveOutside = true
  progressBar = new createjs.Shape()
  progressBar.graphics.beginFill('#907a91').drawRect(0, 0, 100, 20)
  progressBar.x = canvas.width / 2 - 50
  progressBar.y = canvas.height / 2 - 10
  stage.addChild(progressBar)
  queue = new createjs.LoadQueue(true)
  queue.on('progress', handleProgress)
  queue.on('complete', handleComplete)
  queue.loadManifest(LevelManifest)
}

function changeBirdType(evt) {
  const types = ['seagull', 'duck', 'crow', 'bat', 'falcon', 'glasses']
  for (const i of types.keys()) {
    if (evt.currentTarget.currentAnimation === types[i]) {
      evt.currentTarget.gotoAndStop(types[(i + 1) % types.length])
      return
    }
  }
}

function createDisplaySprite(x, y, sprite, currentAnimation) {
  const obj = createSprite(
    spriteSheetData.spriteSheets[sprite],
    currentAnimation,
    {
      x,
      y,
    }
  )

  obj.stop()
  if (sprite === 'enemybirds') {
    obj.on('dblclick', changeBirdType)
    obj.scaleX = 0.5
    obj.scaleY = 0.5
  }
  return obj
}

function createDisplayShape() {
  throw new Error('Not implemented')
}

function createDisplayObject(x, y, sprite, currentAnimation) {
  let obj
  if (isSpriteMode) {
    obj = createDisplaySprite(x, y, sprite, currentAnimation)
  } else {
    obj = createDisplayShape(x, y, sprite, currentAnimation)
  }
  objCont.addChild(obj)
  obj.on('mousedown', selectItem)
}

export function enterGameMode() {
  catzRocketXpos = CatzRocket.catzRocket.catzRocketContainer.x - 200
  CatzRocket.catzRocket.heightOffset =
    CatzRocket.catzRocket.catzRocketContainer.y - 400
  CatzRocket.start(CatzRocket.catzRocket.catzVelocity)
  gameClickScreen.alpha = 0.05
  inGameMode = true
}

function getObjType(kid) {
  let type
  if (kid.currentAnimation === 'cycle') {
    type = 'diamond'
  } else if (kid.currentAnimation === 'greatCycle') {
    type = 'greatDiamond'
  } else {
    type = 'attackBird'
  }
  return type
}

function getObjGraphicType(objType) {
  return {
    diamond: 'sprite',
    greatDiamond: 'sprite',
    attackBird: 'attackBird',
    thunderCloud: 'thunderCloud',
  }[objType]
}

function sortDisplayObjectArray() {
  objCont.children.sort(function sort(a, b) {
    return a.x >= b.x ? 1 : -1
  })
}

function YEditorToGame(y) {
  return y - YOriginPosInGame
}

function displayObjectToString(kid) {
  const x = kid.x - beginningZoneLength
  const objType = getObjType(kid)
  return `{'x':${x}, 'y'${YEditorToGame(
    kid.y
  )},type:'${objType}','animation':'${
    kid.currentAnimation
  }' ,'graphicType':'${getObjGraphicType(objType)}'},\n`
}

function getLevelToString() {
  const stringBuilder = ['levelName:[\n']
  moveChildrenFromSelectedToObjCont()
  sortDisplayObjectArray()
  for (let j = 0, len = objCont.numChildren; j < len; j += 1) {
    const kid = objCont.getChildAt(j)
    stringBuilder.push(displayObjectToString(kid))
  }
  let levelString = stringBuilder.join('')
  levelString = levelString.substring(0, levelString.length - 2) // slice off the last comma
  levelString += '\n]'
  return levelString
}

function displayObjectToJson(kid) {
  const x = kid.x - beginningZoneLength
  return {
    x,
    y: YEditorToGame(kid.y),
    type: getObjType(kid),
    animation: kid.currentAnimation,
    graphicType: getObjGraphicType(getObjType(kid)),
  }
}

function getLevelToJson() {
  const levelArray = []
  moveChildrenFromSelectedToObjCont()
  sortDisplayObjectArray()
  for (let j = 0, len = objCont.numChildren; j < len; j += 1) {
    const kid = objCont.getChildAt(j)
    levelArray.push(displayObjectToJson(kid))
  }
  return levelArray
}

export function getTestLevelTrackParts() {
  return {
    easy: {
      levelName: getLevelToJson(),
    },
  }
}

export function saveLevel() {
  document.getElementsByClassName('odometer')[0].innerHTML = ''
  const levelString = getLevelToString()
  document.getElementsByClassName('odometer')[0].innerHTML = levelString
}

function YGameToEditor(y) {
  return y + YOriginPosInGame
}

function loadLevel(offsetX) {
  const ddl = document.querySelector('.importSelect')
  const levelName = levels[ddl.selectedIndex]
  if (TrackParts.easy[levelName]) {
    for (const part of TrackParts.easy[levelName]) {
      createDisplayObject(
        part.x + offsetX + beginningZoneLength,
        YGameToEditor(part.y),
        part.type,
        part.currentAnimation
      )
    }
  } else {
    alert("Doesn't seem to exist")
  }
}

export function addToImport() {
  loadLevel(currentCenterX())
}
*/
