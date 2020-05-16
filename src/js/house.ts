// import * as Cookie from './cookie'
import {
  gameProgression,
  conditionType,
  operatatorTypeEnum,
  state,
} from './game-progression'
import * as helpers from './helpers'
import * as spriteSheetData from './sprite-sheet-data'
import diamondConstellation from './diamond-constellation'
import { dialog, catDialog, stat } from './dialog'
import debugOptions from './debug-options'
import {
  ACTION_TYPES,
  HOUSE_NAMES,
  CAT_NAMES,
  CAT_NAMES_INCLUDEING_CATZ,
  HouseState,
  store,
} from './store'
import { trigger, events } from './event-bus'

export const diamondHouseArray: {
  [key in typeof HOUSE_NAMES[keyof typeof HOUSE_NAMES]]: createjs.Sprite | null
} = {
  hoboCatHouse: null,
  orphanage: null,
  rehab: null,
  university: null,
} as const

let wick: createjs.Sprite
let houseView: createjs.Container
let cricketSound: createjs.AbstractSoundInstance
let houseListener: Function

let diCont
let house: createjs.Bitmap
let bgHill = null
let crashRocket: createjs.Bitmap
let hobo: createjs.Sprite
let timmy: createjs.Sprite
let priest: createjs.Sprite
let currentCharacter: keyof typeof CAT_NAMES = 'hoboCat'
const mouseChar = {
  [CAT_NAMES_INCLUDEING_CATZ.hoboCat]: null as createjs.Bitmap | null,
  [CAT_NAMES_INCLUDEING_CATZ.timmy]: null as createjs.Bitmap | null,
  [CAT_NAMES_INCLUDEING_CATZ.priest]: null as createjs.Bitmap | null,
  [CAT_NAMES_INCLUDEING_CATZ.catz]: null as createjs.Bitmap | null,
}
let mouseRocket: createjs.Bitmap
let catz: createjs.Sprite
let oh: createjs.Bitmap
let look: createjs.Bitmap
let diamonds: createjs.Bitmap
let hoboCatHouse: createjs.Sprite
let rehab: createjs.Sprite
let orphanage: createjs.Sprite
let university: createjs.Sprite
let diamondHouseCont: createjs.Container
const characterActive = {
  [CAT_NAMES_INCLUDEING_CATZ.hoboCat]: false,
  [CAT_NAMES_INCLUDEING_CATZ.timmy]: false,
  [CAT_NAMES_INCLUDEING_CATZ.priest]: false,
  [CAT_NAMES_INCLUDEING_CATZ.catz]: false,
}
let wickActive = false
let bg: createjs.Bitmap
const choiceIds: number[] = []

let goneDown = false
let diamondsShown = false
let lookShown = false
let ohShown = false

const wickLight = new createjs.Shape()
wickLight.graphics.beginFill('#ffcc00').dc(0, 0, 1.5)
wickLight.x = 174
wickLight.y = 319
wickLight.alpha = 0

const starsContainer = new createjs.Container()

const wickClickBox = helpers.createRectangle(85, 85, 'white', {
  x: 155,
  y: 300,
  alpha: 0.01,
})

const characterSpeach = helpers.createText('', '16px Fauna One', '#ffffcc', {
  x: 10,
  y: 230,
  alpha: 0,
})

const characterExclamation = helpers.createText(
  '!',
  '64px Fauna One',
  '#ffcc00',
  {
    x: 110,
    y: 245,
    alpha: 0,
  }
)

const catzSpeach = helpers.createText('', '12px Fauna One', '#ffffcc', {
  x: 350,
  y: 180,
  alpha: 0,
})

const choice1 = helpers.createText('', '20px Fauna One', '#ffcc00', {
  x: 350,
  y: 150,
  alpha: 0,
})

choice1.hitArea = helpers.createRectangle(150, 30, 'white', { x: -50, y: 0 })

const choice2 = helpers.createText('', '20px Fauna One', '#ffcc00', {
  x: 350,
  y: 120,
  alpha: 0,
})

choice2.hitArea = helpers.createRectangle(150, 30, 'white', { x: -50, y: 0 })

const choice3 = helpers.createText('', '20px Fauna One', '#ffcc00', {
  x: 350,
  y: 180,
  alpha: 0,
})

choice3.hitArea = helpers.createRectangle(150, 30, 'white', { x: -50, y: 0 })

const choices = [choice1, choice2, choice3]

function buildAnimationFinished(): void {
  createjs.Tween.removeTweens(houseView)
  houseView.x = 0
  houseView.y = 0
}

function removeCharacterEvents(): void {
  hobo.removeAllEventListeners()
  timmy.removeAllEventListeners()
  priest.removeAllEventListeners()
  catz.removeAllEventListeners()
  characterExclamation.alpha = 0
}

function buildingAnimation(houseGraphic: createjs.Sprite): void {
  const oldx = houseGraphic.x
  const oldy = houseGraphic.y
  createjs.Tween.get(houseGraphic)
    .to({ x: oldx - 20, y: oldy + 50 })
    .to({ alpha: 1 })
    .to({ x: oldx, y: oldy }, 2000)
    .call(buildAnimationFinished)
  createjs.Tween.get(houseView, { loop: 1 })
    .to({ x: -5, y: 5 }, 50)
    .to({ x: 5, y: -5 }, 50)
}

function lightFuse(): void {
  if (wickActive) {
    createjs.Sound.play('wickSound')
    mouseRocket.alpha = 0
    wickLight.alpha = 0
    wick.gotoAndPlay('cycle')
    wickClickBox.removeAllEventListeners()
    house.removeAllEventListeners()
    wick.addEventListener('animationend', () => {
      const el = document.querySelector('#game-canvas')
      if (el) {
        el.classList.remove('match-cursor')
      }
    })
    wick.addEventListener('animationend', () => trigger(events.ROCKET_FIRED))
    catzSpeach.text = ''
    characterSpeach.text = ''
  }
}

function highlightRocket(): void {
  if (wickActive) {
    mouseRocket.alpha = 1
    wickLight.alpha = 0.7
  }
}

function downlightRocket(): void {
  mouseRocket.alpha = 0
  wickLight.alpha = 0
}

export function activateWick(): void {
  wickClickBox.addEventListener('click', lightFuse)
  wickClickBox.addEventListener('mouseover', highlightRocket)
  wickClickBox.addEventListener('mouseout', downlightRocket)
  house.addEventListener('click', lightFuse)
  house.addEventListener('mouseover', highlightRocket)
  house.addEventListener('mouseout', downlightRocket)
}

function showRocket(): void {
  characterActive[currentCharacter] = false
  characterExclamation.alpha = 0
  wickActive = true

  createjs.Tween.removeTweens(wick)
  createjs.Tween.get(wick).to({ x: -210 }, 400).call(activateWick)
}

function highlightCharacter(): void {
  const el = document.querySelector('#game-canvas')
  if (el) {
    el.classList.add('talk-cursor')
  }

  const mc = mouseChar[currentCharacter]
  if (mc) {
    mc.alpha = 1
  }
  if (characterActive[currentCharacter]) {
    characterExclamation.alpha = 1
  }
}

export function characterDialog(): void {
  function addClickHandler(i: number): void {
    choices[i].addEventListener('click', function onClick() {
      store.dispatch({
        type: ACTION_TYPES.SET_DIALOG_INDEX,
        payload: {
          cat: currentCharacter,
          newdialogIndexes: choiceIds[i],
        },
      })
      choice1.alpha = 0
      choice2.alpha = 0
      choice3.alpha = 0
      choices[0].removeAllEventListeners()
      choices[1].removeAllEventListeners()
      characterDialog()
    })

    choices[i].addEventListener('mouseover', function onMouseOver() {
      choices[i].alpha = 1
    })
    choices[i].addEventListener('mouseout', function onMouseLeave() {
      choices[i].alpha = 0.7
    })
  }

  const {
    dialogIndexes,
    conversationIds,
    hasHappend,
    currentRound,
  } = store.getState()

  let currentDialog
  // This switch is just to narrow the type for currentCharacter
  switch (currentCharacter) {
    case CAT_NAMES.hoboCat: {
      const conversationId = conversationIds[currentCharacter]
      if (!conversationId) {
        throw new Error(
          `No conversationId for current character ${currentCharacter}`
        )
      }
      currentDialog = dialog[currentCharacter][conversationId]
      break
    }
    case CAT_NAMES.timmy: {
      const conversationId = conversationIds[currentCharacter]
      if (!conversationId) {
        throw new Error(
          `No conversationId for current character ${currentCharacter}`
        )
      }
      currentDialog = dialog[currentCharacter][conversationId]
      break
    }
    case CAT_NAMES.priest: {
      const conversationId = conversationIds[currentCharacter]
      if (!conversationId) {
        throw new Error(
          `No conversationId for current character ${currentCharacter}`
        )
      }
      currentDialog = dialog[currentCharacter][conversationId]
      break
    }
    default: {
      throw new Error('Invalid character')
    }
  }

  const line = currentDialog.dialog[dialogIndexes[currentCharacter]]
  if (line) {
    if (line.triggers) {
      for (const trg of line.triggers) {
        switch (trg.stat) {
          case stat.score: {
            store.dispatch({
              type: ACTION_TYPES.INCREMENT_SCORE,
              payload: { incrementBy: trg.value },
            })
            break
          }
          /* case 'kills': {
            dispatch({
              type: ACTION_TYPES.INCREMENT_KILLS,
              payload: { incrementBy: value },
            })
            break
          } */
          case stat.built: {
            if (
              !hasHappend.firstHouseWithSlots &&
              (trg.value === 'rehab' || trg.value === 'orphanage')
            ) {
              store.dispatch({
                type: ACTION_TYPES.HAS_HAPPEND,
                payload: { firstHouseWithSlots: true },
              })
            }
            store.dispatch({
              type: ACTION_TYPES.BUILING_BUILT,
              payload: {
                buildingKey: trg.value,
                builtOnRound: currentRound,
              },
            })
            const animation: createjs.Sprite | null =
              diamondHouseArray[trg.value]
            if (animation) {
              buildingAnimation(animation)
            }
            break
          }
          case stat.addOn:
            {
              const diamondHouse = diamondHouseArray[trg.building]
              if (diamondHouse) {
                diamondHouse.gotoAndPlay(trg.value)
                // switch just to narrow type
                switch (trg.building) {
                  case HOUSE_NAMES.orphanage: {
                    store.dispatch({
                      type: ACTION_TYPES.ADDON_BUILT,
                      payload: {
                        addOnKey: trg.value,
                        buildingKey: trg.building,
                        builtOnRound: currentRound,
                      },
                    })
                    break
                  }
                  case HOUSE_NAMES.rehab: {
                    store.dispatch({
                      type: ACTION_TYPES.ADDON_BUILT,
                      payload: {
                        addOnKey: trg.value,
                        buildingKey: trg.building,
                        builtOnRound: currentRound,
                      },
                    })
                    break
                  }
                  case HOUSE_NAMES.university: {
                    store.dispatch({
                      type: ACTION_TYPES.ADDON_BUILT,
                      payload: {
                        addOnKey: trg.value,
                        buildingKey: trg.building,
                        builtOnRound: currentRound,
                      },
                    })
                    break
                  }
                  default: {
                    throw new Error("This can't happen")
                  }
                }
              }
            }
            break
          case stat.villagersApprovalRating: {
            store.dispatch({
              type: ACTION_TYPES.INCREMENT_VILLAGERS_APPROVAL_RATING,
              payload: { incrementBy: trg.value },
            })
            break
          }
          case stat.catPartyApprovalRating: {
            store.dispatch({
              type: ACTION_TYPES.INCREMENT_CAT_PARTY_APPROVAL_RATING,
              payload: { incrementBy: trg.value },
            })
            break
          }
          case stat.kittensApprovalRating: {
            store.dispatch({
              type: ACTION_TYPES.INCREMENT_KITTENS_APPROVAL_RATING,
              payload: { incrementBy: trg.value },
            })
            break
          }
          default: {
            throw new Error(`Can't happen`)
          }
        }
      }
    }

    if (line.who === 'catz') {
      catzSpeach.text = line.what
      catzSpeach.alpha = 1
    } else if (line.who === CAT_NAMES.hoboCat) {
      characterSpeach.text = line.what
      characterSpeach.alpha = 1
    } else if (line.who === 'timmy') {
      characterSpeach.text = line.what
      characterSpeach.alpha = 1
      // Should be timmy sound
    } else if (line.who === 'priest') {
      characterSpeach.text = line.what
      characterSpeach.alpha = 1
      // Should be priest sound
    }

    if (line.choice) {
      for (const i of line.choices.keys()) {
        choices[i].text = line.choices[i].text
        choices[i].alpha = 0.7
        choiceIds[i] = line.choices[i].choiceId
        addClickHandler(i)
      }
    } else if (!line.end) {
      store.dispatch({
        type: ACTION_TYPES.SET_DIALOG_INDEX,
        payload: {
          cat: currentCharacter,
          newdialogIndexes: line.nextId,
        },
      })
    } else {
      // END DIALOG
      setTimeout(function addClass() {
        const el = document.querySelector('#game-canvas')
        if (el) {
          el.classList.add('match-cursor')
        }
      }, 500)
      showRocket()
      // To shift to idle speach. Should be implemented smarter.
      dialogIndexes[currentCharacter] += 100
      // Cookie.save(getState())
    }
  } else {
    characterSpeach.text = currentDialog.idle.what
    characterSpeach.alpha = 1
    showRocket()
  }
}

function downlightCharacter(): void {
  const el = document.querySelector('#game-canvas')
  if (el) {
    el.classList.remove('talk-cursor')
  }
  const char = mouseChar[currentCharacter]
  if (char) {
    char.alpha = 0
  }

  if (characterActive[currentCharacter]) {
    characterExclamation.alpha = 0.5
  } else {
    characterExclamation.alpha = 0
  }
}

function meow(): void {
  createjs.Sound.play('catzScream2')
}

function highlightCatz(): void {
  if (!createjs.Tween.hasActiveTweens(catz)) {
    if (mouseChar.catz) {
      mouseChar.catz.alpha = 1
    }
    catz.x = 360
    catz.y = 270
    catz.rotation = 0
  }
}

function downlightCatz(): void {
  if (mouseChar.catz) {
    mouseChar.catz.alpha = 0
  }
}

export function addCharacterEvents(): void {
  hobo.addEventListener('click', characterDialog)

  hobo.addEventListener('mouseover', highlightCharacter)
  hobo.addEventListener('mouseout', downlightCharacter)

  timmy.addEventListener('click', characterDialog)
  timmy.addEventListener('mouseover', highlightCharacter)
  timmy.addEventListener('mouseout', downlightCharacter)

  priest.addEventListener('click', characterDialog)
  priest.addEventListener('mouseover', highlightCharacter)
  priest.addEventListener('mouseout', downlightCharacter)

  catz.addEventListener('click', meow)
  catz.addEventListener('mouseover', highlightCatz)
  catz.addEventListener('mouseout', downlightCatz)
}

function hoboWalk(): void {
  const stepDelay = 200
  createjs.Tween.get(hobo)
    .to({ x: -270, y: 270, rotation: 0 }, stepDelay)
    .to({ x: -260, y: 270, rotation: -5 }, stepDelay)
    .to({ x: -230, y: 270, rotation: 0 }, stepDelay)
    .to({ x: -200, y: 270, rotation: -5 }, stepDelay)
    .to({ x: -170, y: 270, rotation: 0 }, stepDelay)
    .to({ x: -160, y: 270, rotation: -5 }, stepDelay)
    .to({ x: -130, y: 260, rotation: 0 }, stepDelay)
    .to({ x: -140, y: 260, rotation: -5 }, stepDelay)
    .to({ x: -110, y: 225, rotation: 0 }, stepDelay)
    .to({ x: -110, y: 225, rotation: 0 }, stepDelay)
    .call(addCharacterEvents)
    .call(function lightExclamation() {
      characterExclamation.alpha = 0.5
    })
}

function buildHouses(): void {
  const { buildings } = store.getState()
  for (const [buildingName, building] of Object.entries(buildings) as [
    keyof typeof HOUSE_NAMES,
    HouseState
  ][]) {
    if (building.built) {
      const animation = diamondHouseArray[buildingName]
      if (animation) {
        buildingAnimation(animation)
      }
    }
  }
}

function tick(stage: createjs.Stage): void {
  if (characterSpeach.alpha > 0) {
    characterSpeach.alpha -= 0.015
  }

  if (catzSpeach.alpha > 0) {
    catzSpeach.alpha -= 0.015
  }

  stage.update()
}

function goDown(): void {
  if (!goneDown) {
    goneDown = true
    bg.removeAllEventListeners()
    createjs.Tween.get(houseView)
      .to({ y: 0 }, 1000, createjs.Ease.quadInOut)
      .call(buildHouses)
      .call(hoboWalk)
    createjs.Tween.get(bg).to({ y: -1200 }, 1000, createjs.Ease.quadInOut)
    createjs.Tween.get(starsContainer).to(
      { y: 0 },
      1000,
      createjs.Ease.quadInOut
    )
  }
}

function showDiamonds(): void {
  if (!diamondsShown) {
    diamondsShown = true
    bg.removeAllEventListeners()
    bg.addEventListener('click', goDown)
    setTimeout(goDown, 1000)
    createjs.Tween.get(diamonds).to({ alpha: 1 }, 500)
  }
}

function showLook(): void {
  if (!lookShown) {
    lookShown = true
    bg.removeAllEventListeners()
    bg.addEventListener('click', showDiamonds)
    setTimeout(showDiamonds, 1000)
    createjs.Tween.get(look).to({ alpha: 1 }, 500)
  }
}

function showOh(): void {
  if (!ohShown) {
    ohShown = true
    bg.removeAllEventListeners()
    bg.addEventListener('click', showLook)
    setTimeout(showLook, 1000)
    createjs.Tween.get(oh).to({ alpha: 1 }, 500)
  }
}

export function init(data: {
  queue: createjs.LoadQueue
  bg: createjs.Bitmap
}): void {
  cricketSound = createjs.Sound.play('crickets', { loop: -1 })
  bg = data.bg
  houseView = new createjs.Container()

  house = helpers.createBitmap(data.queue.getResult('house'), {
    scaleX: 0.8,
    scaleY: 0.8,
    y: -20,
  })

  bgHill = helpers.createBitmap(data.queue.getResult('far right hill'), {
    scaleX: 0.8,
    scaleY: 0.8,
    y: -20,
  })
  hobo = helpers.createSprite(spriteSheetData.spriteSheets.hobo, 'cycle', {
    x: -210,
    y: 225,
    regX: -210,
    regY: -180,
  })

  timmy = helpers.createSprite(
    spriteSheetData.spriteSheets.supportingCharacter,
    'timmy',
    {
      x: 83,
      y: 362,
      scaleX: 0.8,
      scaleY: 0.8,
      alpha: 0,
    }
  )

  priest = helpers.createSprite(
    spriteSheetData.spriteSheets.supportingCharacter,
    'priest',
    {
      x: 52,
      y: 330,
      scaleX: 0.8,
      scaleY: 0.8,
      alpha: 0,
    }
  )

  oh = helpers.createBitmap(data.queue.getResult('oh-look-diamonds'), {
    x: 90,
    y: -1460,
    alpha: 0,
    sourceRect: new createjs.Rectangle(0, 0, 227, 190),
  })
  look = helpers.createBitmap(data.queue.getResult('oh-look-diamonds'), {
    x: 340,
    y: -1460,
    alpha: 0,
    sourceRect: new createjs.Rectangle(227, 0, 400, 160),
  })
  diamonds = helpers.createBitmap(data.queue.getResult('oh-look-diamonds'), {
    x: 90,
    y: -1283,
    alpha: 0,
    sourceRect: new createjs.Rectangle(0, 176, 620, 160),
  })

  const eigthy = [...Array(80)]
  eigthy.forEach(() => {
    const star = helpers.createBitmap(data.queue.getResult('star'), {
      x: Math.random() * 2200,
      y: Math.random() * 1450 - 1000,
    })
    const delay = Math.random() * 2000
    createjs.Tween.get(star, { loop: 1 })
      .wait(delay)
      .to({ alpha: 0 }, 1000)
      .to({ alpha: 1 }, 1000)

    starsContainer.addChild(star)
  })

  diCont = new createjs.Container()

  for (const position of diamondConstellation) {
    const diamond = helpers.createSprite(
      spriteSheetData.spriteSheets.diamond,
      'cycle',
      {
        x: position.x,
        y: position.y - 1500,
        scaleX: position.scale,
        scaleY: position.scale,
        currentAnimationFrame: position.frame,
      }
    )
    diCont.addChild(diamond)
  }

  crashRocket = helpers.createBitmap(data.queue.getResult('rocket-silouette'), {
    x: 220,
    y: 320,
    alpha: 0,
    regX: 180,
    regY: 83,
    scaleX: 0.5,
    scaleY: 0.5,
  })

  diamondHouseCont = new createjs.Container()
  hoboCatHouse = helpers.createSprite(
    spriteSheetData.spriteSheets.dHouse,
    'hoboHouse',
    {
      x: 430,
      y: 378,
      scaleX: 1,
      scaleY: 1,
      alpha: 0,
      rotation: -8,
    }
  )

  diamondHouseCont.addChild(hoboCatHouse)
  diamondHouseArray.hoboCatHouse = hoboCatHouse

  rehab = helpers.createSprite(
    spriteSheetData.spriteSheets.dHouse,
    'catnip treatment facility',
    { x: 583, y: 355, scaleX: 1.5, scaleY: 1.5, alpha: 0 }
  )

  diamondHouseCont.addChild(rehab)
  diamondHouseArray.rehab = rehab

  orphanage = helpers.createSprite(
    spriteSheetData.spriteSheets.dHouse,
    'orphanage',
    {
      x: 500,
      y: 381,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
    }
  )
  diamondHouseCont.addChild(orphanage)
  diamondHouseArray.orphanage = orphanage

  university = helpers.createSprite(
    spriteSheetData.spriteSheets.dHouse,
    'university',
    {
      x: 700,
      y: 305,
      rotation: 5,
      alpha: 0,
    }
  )

  diamondHouseCont.addChild(university)
  diamondHouseArray.university = university

  mouseChar.hoboCat = helpers.createBitmap(
    data.queue.getResult('mouseover-hobo'),
    {
      x: 110,
      y: 316,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
    }
  )

  mouseChar.timmy = helpers.createBitmap(
    data.queue.getResult('mouseover-timmy'),
    {
      x: 85,
      y: 360,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
    }
  )

  mouseChar.priest = helpers.createBitmap(
    data.queue.getResult('mouseover-priest'),
    {
      x: 53,
      y: 330,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
    }
  )

  mouseRocket = helpers.createBitmap(data.queue.getResult('mouseover-rocket'), {
    x: 211,
    y: 338,
    alpha: 0,
  })

  mouseChar.catz = helpers.createBitmap(
    data.queue.getResult('mouseover-catz'),
    {
      x: 116,
      y: 56,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
    }
  )

  catz = helpers.createSprite(spriteSheetData.spriteSheets.cat, 'cycle', {
    x: 360,
    y: 270,
    scaleX: 0.8,
    scaleY: 0.8,
  })

  wick = helpers.createSprite(spriteSheetData.spriteSheets.wick, 'still', {
    x: -210,
    y: 50,
    scaleX: 1.5,
    scaleY: 1.5,
  })
  // subtractedDiamond = helpers.createBitmap(queue.getResult('diamondShardCounter'), {x:750, y:420, scaleX:0.4, scaleY:0.4});

  houseView.y = 1500
  bg.y = 0
  starsContainer.y = 1000
  if (!debugOptions.noHouseView) {
    bg.addEventListener('click', showOh)
    setTimeout(showOh, 500)
  }

  houseView.addChild(
    look,
    diamonds,
    diCont,
    oh,
    starsContainer,
    university,
    rehab,
    bgHill,
    orphanage,
    hoboCatHouse,
    crashRocket,
    catz,
    wick,
    house,
    hobo,
    timmy,
    priest,
    characterExclamation,
    catzSpeach,
    characterSpeach,
    choice1,
    choice2,
    choice3,
    mouseChar.catz,
    mouseChar.hoboCat,
    mouseChar.timmy,
    mouseChar.priest,
    mouseRocket,
    wickLight,
    wickClickBox
  )
}

export function getConversationId(
  cat: 'hoboCat'
): keyof typeof catDialog['hoboCat'] | null
export function getConversationId(
  cat: 'timmy'
): keyof typeof catDialog['timmy'] | null
export function getConversationId(
  cat: 'priest'
): keyof typeof catDialog['priest'] | null
export function getConversationId(
  cat: keyof typeof CAT_NAMES
):
  | keyof typeof catDialog['hoboCat']
  | keyof typeof catDialog['timmy']
  | keyof typeof catDialog['priest']
  | null {
  const catProgression = gameProgression[cat]
  const { hasHappend, score, buildings, currentRound } = store.getState()
  for (const i of catProgression.keys()) {
    // eslint-disable-next-line no-restricted-syntax, no-labels
    conditionLoop: if (
      !hasHappend[cat][i] ||
      (catProgression[i].shouldReoccur &&
        catProgression[i].chance > Math.random())
    ) {
      for (const j of catProgression[i].conditions.keys()) {
        const condition = catProgression[i].conditions[j]
        switch (condition.conditionType) {
          case conditionType.score: {
            if (
              condition.operatorType === operatatorTypeEnum.largerThan &&
              score <= condition.score
            ) {
              break conditionLoop // eslint-disable-line no-labels
            } /* else if (
              condition.operatorType === 'less-than' &&
              score >= condition.score
            ) {
              break conditionLoop // eslint-disable-line no-labels
            } */
            break
          }
          case conditionType.buildingState: {
            if (
              condition.state === state.builtOnRound &&
              (buildings[condition.building]?.builtOnRound || -Infinity) +
                condition.on >=
                currentRound
            ) {
              break conditionLoop // eslint-disable-line no-labels
            } else if (
              condition.state === state.built &&
              buildings[condition.building] &&
              buildings[condition.building].built !== condition.on
            ) {
              break conditionLoop // eslint-disable-line no-labels
            }
            break
          }
          case conditionType.addonState: {
            const addon =
              condition.building === 'orphanage' // eslint-disable-line
                ? buildings.orphanage[condition.addon]
                : condition.building === 'rehab' // eslint-disable-line
                ? buildings.rehab[condition.addon]
                : condition.building === 'university' // eslint-disable-line
                ? buildings.university[condition.addon]
                : null
            if (
              addon &&
              condition.state === state.built &&
              addon.built !== condition.on
            ) {
              break conditionLoop // eslint-disable-line no-labels
            }
            break
          }
          /* case 'state': {
            const { [condition.state]: state } = getState()
            if (state !== condition.on) {
              break conditionLoop // eslint-disable-line no-labels
            }
            break
          } */
          default: {
            throw new Error(`This can't happen`)
          }
        }

        // If all conditions have been passed
        if (j === catProgression[i].conditions.length - 1) {
          currentCharacter = cat
          characterActive[currentCharacter] = true
          wickActive = false
          store.dispatch({
            type: ACTION_TYPES.HAS_HAPPEND,
            payload: {
              [cat]: { [i]: true },
            },
          })
          return catProgression[i].conversationId
        }
      }
    }
  }
  return null
}

export function gotoHouseView(): void {
  const { score } = store.getState()
  const hsc = document.querySelector('.highscore-canvas') as HTMLElement
  if (hsc && hsc.getAttribute('aria-valuenow') === '' && score) {
    hsc.setAttribute('aria-valuenow', score.toString())
  }

  hobo.alpha = 0
  timmy.alpha = 0
  priest.alpha = 0

  cricketSound.volume = 0.1
  const hobConversationId = getConversationId('hoboCat')
  if (hobConversationId !== null) {
    currentCharacter = 'hoboCat'
    hobo.alpha = 1
    store.dispatch({
      type: ACTION_TYPES.SET_CONVERSATION_ID,
      payload: {
        cat: 'hoboCat',
        newConversationId: hobConversationId,
      },
    })
    characterActive.hoboCat = true
    if (hobConversationId !== 'intro') {
      characterExclamation.alpha = 0.5
    }
    store.dispatch({
      type: ACTION_TYPES.SET_DIALOG_INDEX,
      payload: {
        cat: 'hoboCat',
        newdialogIndexes: 0,
      },
    })
  }
  // If no hobo dialog, check for timmy dialog
  else {
    const timmyConversationId = getConversationId('timmy')
    if (timmyConversationId !== null) {
      currentCharacter = 'timmy'
      timmy.alpha = 1
      store.dispatch({
        type: ACTION_TYPES.SET_CONVERSATION_ID,
        payload: {
          cat: 'timmy',
          newConversationId: timmyConversationId,
        },
      })
      characterActive.timmy = true
      store.dispatch({
        type: ACTION_TYPES.SET_DIALOG_INDEX,
        payload: {
          cat: 'timmy',
          newdialogIndexes: 0,
        },
      })
      characterExclamation.alpha = 0.5
    } // If no timmy dialog, cehck for priest dialog
    else {
      const priestConversationId = getConversationId('priest')
      if (priestConversationId !== null) {
        currentCharacter = 'priest'
        priest.alpha = 1
        characterActive.priest = true
        store.dispatch({
          type: ACTION_TYPES.SET_CONVERSATION_ID,
          payload: {
            cat: 'priest',
            newConversationId: priestConversationId,
          },
        })
        store.dispatch({
          type: ACTION_TYPES.SET_DIALOG_INDEX,
          payload: {
            cat: 'priest',
            newdialogIndexes: 0,
          },
        })
        characterExclamation.alpha = 0.5
      } else {
        hobo.alpha = 1
        currentCharacter = 'hoboCat'
        const el = document.querySelector('#game-canvas')
        if (el) {
          el.classList.add('match-cursor')
        }
      }
    }
  }
}

export function update(): void {
  if (characterSpeach.alpha > 0) {
    if (characterSpeach.alpha > 0.5) {
      characterSpeach.alpha -= 0.002
    } else {
      characterSpeach.alpha -= 0.03
    }
  }

  if (catzSpeach.alpha > 0) {
    if (catzSpeach.alpha > 0.5) {
      catzSpeach.alpha -= 0.002
    } else {
      catzSpeach.alpha -= 0.03
    }
  }

  if (characterActive[currentCharacter]) {
    characterExclamation.alpha = 0
  }
}

export function gotoHouseViewWithoutRocket(catzRocketRotation: number): void {
  catz.x = 300 - 400 * Math.cos((catzRocketRotation * 6.28) / 360)
  catz.y = 370 - 400 * Math.sin((catzRocketRotation * 6.28) / 360)
  catz.gotoAndPlay('flying')
  catz.rotation = catzRocketRotation + 90
  createjs.Tween.get(catz)
    .to({ x: 300, y: 370 }, 200)
    .call(catz.gotoAndPlay, ['cycle'])
    .wait(800)
    .to({ x: 390, y: 350, rotation: 10 }, 250)
    .to({ x: 330, y: 330, rotation: -10 }, 250)
    .to({ x: 390, y: 310, rotation: 10 }, 250)
    .to({ x: 330, y: 290, rotation: -10 }, 250)
    .to({ x: 360, y: 270, rotation: 0 }, 250)
  crashRocket.alpha = 1
  crashRocket.x = 315
  crashRocket.y = 910
  crashRocket.rotation = -90
  createjs.Tween.get(crashRocket)
    .wait(1200)
    .to({ x: 315, y: 310 }, 500)
    .to({ x: 315, y: 310, rotation: -30 }, 800, createjs.Ease.quadIn)
  gotoHouseView()
}

export function gotoHouseViewWithRocket(
  upSideDown: boolean,
  catzRocketRotation: number
): void {
  if (upSideDown) {
    crashRocket.x = 315
    crashRocket.y = -90
  } else {
    crashRocket.x = 315 - 400 * Math.cos((catzRocketRotation * 6.28) / 360)
    crashRocket.y = 310 - 400 * Math.sin((catzRocketRotation * 6.28) / 360)
  }

  crashRocket.alpha = 1
  crashRocket.rotation = catzRocketRotation

  createjs.Tween.get(crashRocket)
    .to({ x: 315, y: 310 }, 200)
    .wait(1500)
    .to({ x: 315, y: 310, rotation: -30 }, 800, createjs.Ease.quadIn)

  catz.x = 360
  catz.y = 370

  createjs.Tween.get(catz)
    .wait(800)
    .to({ x: 390, y: 350, rotation: 10 }, 250)
    .to({ x: 330, y: 330, rotation: -10 }, 250)
    .to({ x: 390, y: 310, rotation: 10 }, 250)
    .to({ x: 330, y: 290, rotation: -10 }, 250)
    .to({ x: 360, y: 270, rotation: 0 }, 250)
  gotoHouseView()
}

export function gotoHouseViewFirstTime(stage: createjs.Stage): void {
  characterExclamation.alpha = 0
  gotoHouseView()
  const el = document.querySelector('#game-canvas')
  if (el) {
    el.classList.remove('match-cursor')
  }
  wick.x = -120
  wickClickBox.removeAllEventListeners()
  house.removeAllEventListeners()
  wick.gotoAndPlay('still')
  stage.removeAllEventListeners()
  if (wickActive) {
    activateWick()
  }
  hobo.x = -300
  hobo.y = 270
  stage.addChild(houseView)
  stage.update()
  houseListener = createjs.Ticker.on('tick', () => tick(stage))
  cricketSound.play()
}

export function deactivateWick(): void {
  wick.x = -100
  mouseRocket.alpha = 0
  wickLight.alpha = 0
  wick.gotoAndPlay('still')
  wickClickBox.removeAllEventListeners()
  wick.removeAllEventListeners()
  house.removeAllEventListeners()
}

export function updateAndStartHouseView(
  stage: createjs.Stage,
  withoutRocket: boolean,
  rocketRotation = 0,
  upsideDown = false
): void {
  stage.addChild(houseView)
  createjs.Tween.removeTweens(houseView)
  removeCharacterEvents()
  houseListener = createjs.Ticker.on('tick', () => tick(stage))
  cricketSound.play()
  deactivateWick()
  const { score } = store.getState()
  if (debugOptions.trustFund && score < 20000) {
    store.dispatch({
      type: ACTION_TYPES.INCREMENT_SCORE,
      payload: { incrementBy: 20000 },
    })
  }

  createjs.Tween.get(houseView)
    .wait(200)
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
    .wait(800)

  createjs.Tween.get(wick)
    .wait(2000)
    .to(
      {
        x: -210,
      },
      1500,
      createjs.Ease.quadInOut
    )
    .call(activateWick)
    .call(addCharacterEvents)

  if (withoutRocket) {
    gotoHouseViewWithoutRocket(rocketRotation)
  } else {
    gotoHouseViewWithRocket(upsideDown, rocketRotation)
  }
}

export function leave(stage: createjs.Stage): void {
  stage.removeChild(houseView)
  cricketSound.stop()
  createjs.Ticker.off('tick', houseListener)
}
