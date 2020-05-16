import init from './js/initialize-stage'
// import * as Cookie from './js/cookie'
// import * as LevelEditor from './js/level-editor'
// import './css/odometer-theme-car.css'
import './css/style.css'
import 'odometer'

const muteElement = document.querySelector('.mute')
const startButtonContainerElement = document.querySelector(
  '.start-button-container'
)
const startButtonElement = document.querySelector('.start-button')
const gameElement = document.querySelector('.game')
const aboutElement = document.querySelector('.about')
const aboutButtonElement = document.querySelector('.about-button')
const aboutInnerElement = document.querySelector('.about-inner')
const hsCanvasElementContext = (document.querySelector(
  '.highscore-canvas'
) as HTMLCanvasElement).getContext('2d')
const gameCanvasElement = document.querySelector(
  '#game-canvas'
) as HTMLCanvasElement
const portraitWarningElement = document.querySelector('.portrait-warning')
const statsElement = document.querySelector('.stats')

if (
  !muteElement ||
  !(muteElement instanceof HTMLElement) ||
  !startButtonElement ||
  !(startButtonElement instanceof HTMLElement) ||
  !gameElement ||
  !(gameElement instanceof HTMLElement) ||
  !aboutElement ||
  !(aboutElement instanceof HTMLElement) ||
  !startButtonContainerElement ||
  !(startButtonContainerElement instanceof HTMLElement) ||
  !aboutButtonElement ||
  !(aboutButtonElement instanceof HTMLElement) ||
  !aboutInnerElement ||
  !(aboutInnerElement instanceof HTMLElement) ||
  !portraitWarningElement ||
  !(portraitWarningElement instanceof HTMLElement) ||
  !statsElement ||
  !(statsElement instanceof HTMLElement) ||
  !hsCanvasElementContext ||
  !(hsCanvasElementContext instanceof CanvasRenderingContext2D)
) {
  throw new Error('Element not found')
}

const switchMute = (): void => {
  if (createjs.Sound.muted) {
    createjs.Sound.muted = false
    muteElement.classList.remove('mute-is-muted')
  } else {
    createjs.Sound.muted = true
    muteElement.classList.add('mute-is-muted')
  }
}

muteElement.onclick = switchMute

const onClickAboutButton = (): void => {
  aboutInnerElement.style.display =
    aboutInnerElement.style.visibility === 'none' ? 'flex' : 'none'
}

aboutButtonElement.onclick = onClickAboutButton

/* const paint = (hs: string): void => {
  const dashLen = 220
  let dashOffset = dashLen
  const speed = 5
  const txt = `${hs}`
  let x = 0
  let i = 0
  hsCanvasElementContext.clearRect(0, 0, 200, 57)
  hsCanvasElementContext.font = '20px Sans Serif, cursive'
  hsCanvasElementContext.lineWidth = 1
  hsCanvasElementContext.lineJoin = 'round'
  hsCanvasElementContext.globalAlpha = 1
  hsCanvasElementContext.strokeStyle = '#ffffcc'
  hsCanvasElementContext.fillStyle = '#ffffcc'
  hsCanvasElementContext.fillText('Highscore', 0, 20)
  hsCanvasElementContext.font = '40px Just Another Hand, cursive'
  const loop = (): void => {
    hsCanvasElementContext.clearRect(x, 30, 60, 40)
    hsCanvasElementContext.setLineDash([
      dashLen - dashOffset,
      dashOffset - speed,
    ]) // create a long dash mask
    dashOffset -= speed // reduce dash length
    hsCanvasElementContext.strokeText(txt[i], x, 55) // stroke letter

    if (dashOffset > 0) {
      requestAnimationFrame(loop) // animate
    } else {
      hsCanvasElementContext.fillText(txt[i], x, 55) // fill final letter
      dashOffset = dashLen // prep next char
      i += 1
      x +=
        hsCanvasElementContext.measureText(txt[i]).width +
        hsCanvasElementContext.lineWidth * Math.random() +
        5
      if (i < txt.length) {
        requestAnimationFrame(loop)
      }
    }
  }
  loop()
}
*/
startButtonElement.onclick = function startGame(): void {
  gameElement.style.display = 'flex'
  aboutElement.style.display = 'flex'
  startButtonContainerElement.style.display = 'none'
  statsElement.style.width = `${gameCanvasElement.offsetWidth}px`

  init('game-canvas', gameCanvasElement)
  // Cookie.saveAndSetHS(0, paint)
}

/* window.StartEditor = LevelEditor.StartEditor

window.startGameFromLevelEditor = function startGameFromLevelEditor() {
  // const tracks = [[[{ difficulty: 'easy', name: 'levelName' }]]];
  // const trackParts = LevelEditor.getTestLevelTrackParts();
  // InitializeStage.createViewsAndStartCustomLevel(tracks, trackParts);
}
*/
const onResize = (): void => {
  statsElement.style.width = `${gameCanvasElement.offsetWidth}px`
  if (window.innerHeight > window.innerWidth) {
    portraitWarningElement.style.display = 'flex'
  } else {
    portraitWarningElement.style.display = 'none'
  }
}

onResize()

window.addEventListener('resize', onResize)
