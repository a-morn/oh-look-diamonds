import TrackParts from './track-parts.js';
import GameLogic from './game-logic.js';
import CatzRocket from './catz-rocket.js';
import LevelManifest from './level-manifest.js';
import SpriteSheetData from './sprite-sheet-data.js';
import Helpers from './helpers.js';

let progressBar;
let stage;
let queue;
let canvas;
let inGameMode = false;
let isSpriteMode = true;
let levels;
let ctrlPressed = false;
let grav = 12;
let dbText;
const selectBox = {
	rect: null,
	graphic: null
};

const bgCoordinates = {
	width: 800,
	height: 1800,
	offset: -520
};

const fgCoordinates = {
	height: 150,
	width: 2000
};

const catzStartPos = {
	x: 260,
	y: 1030
};

let catzRocketXpos = 0;
const YOriginPosInGame = 830;
const levelLength = 13500;
const levelViewScale = 0.5;
const beginningZoneLength = 1000;
const bgCont = new createjs.Container(); // eslint-disable-line no-undef
const objCont = new createjs.Container(); // eslint-disable-line no-undef
const levelView = new createjs.Container(); // eslint-disable-line no-undef
let gameClickScreen;
let clipBoard;
let clipOffset = 0;

export function StartEditor () {
	canvas = $('#levelEditCanvas')[0]; // eslint-disable-line no-undef
	stage = new createjs.Stage(canvas); // eslint-disable-line no-undef
	stage.mouseMoveOutside = true;
	progressBar = new createjs.Shape(); // eslint-disable-line no-undef
	progressBar.graphics.beginFill('#907a91').drawRect(0, 0, 100, 20);
	progressBar.x = canvas.width / 2 - 50;
	progressBar.y = canvas.height / 2 - 10;
	stage.addChild(progressBar);
	queue = new createjs.LoadQueue(true); // eslint-disable-line no-undef
	queue.on('progress', handleProgress);
	queue.on('complete', handleComplete);
	queue.loadManifest(LevelManifest);
}

function handleProgress(event) {
	progressBar.graphics.beginFill('#330033').drawRect(0, 0, 100 * event.progress, 20);
	stage.update();
}

function handleComplete() {
	SpriteSheetData.setValues(queue);
	populateDDL();
	createLevelView();
	initSelectBox();
	setEventListeners();
	//	createToolView();
	dbText = Helpers.createText('hej', '16px Fauna One', '#ffffcc', {
		x: 30,
		y: 38
	});
	stage.addChild(levelView, dbText, gameClickScreen);
	stage.removeChild(progressBar);
	createjs.Ticker.on('tick', onTick); // eslint-disable-line no-undef
	createjs.Ticker.setFPS(30); // eslint-disable-line no-undef
	stage.update();
}

function createLevelView() {
	createBG();
	createCatz();


	levelView.addChild(bgCont, objCont, CatzRocket.catzRocketContainer);
	levelView.scaleX = levelViewScale;
	levelView.scaleY = levelViewScale;
	const canvasHeight = (bgCoordinates.height + bgCoordinates.offset) * levelViewScale;
	const canvasWidth = levelLength * levelViewScale;
	document.getElementById('levelEditCanvas').height = canvasHeight;
	document.getElementById('levelEditCanvas').width = canvasWidth;
	createGameClickScreen(canvasWidth, canvasHeight);
}

function createGameClickScreen(w, h) {
	gameClickScreen = Helpers.createRectangle(w, h, 'ffffff', {
		alpha: 0
	});
}

function createBG() {
	for (let i = 0, len = 2 + levelLength / bgCoordinates.width; i < len; i++) {
		const bgClone = new createjs.Bitmap(queue.getResult('bg')); // eslint-disable-line no-undef
		bgClone.x = i * bgCoordinates.width;
		bgClone.y = bgCoordinates.offset;
		if (i % 2 === 0) {
			bgClone.scaleX = -1;
			bgClone.x -= bgCoordinates.width;
		}
		bgCont.addChild(bgClone);
	}
	for (let i = 0, len = levelLength / fgCoordinates.width; i < len; i++) {
		const fgClone = new createjs.Bitmap(queue.getResult('fgGround')); // eslint-disable-line no-undef
		fgClone.x = fgCoordinates.width * i;
		fgClone.y = 300 + YOriginPosInGame;
		const topClone = new createjs.Bitmap(queue.getResult('fgGroundTop')); // eslint-disable-line no-undef
		topClone.x = fgCoordinates.width * i;
		topClone.y = 0;
		bgCont.addChild(fgClone, topClone);
	}
	const startLine=Helpers.createRectangle(10,bgCoordinates.height-bgCoordinates.offset, 'red', {x:beginningZoneLength});
	bgCont.addChild(startLine);
}

function createCatz() {
	CatzRocket.Init();
	CatzRocket.catz = Helpers.createSprite(SpriteSheetData.rocket, 'no shake', {
		y: 5
	});
	CatzRocket.catzRocketContainer.regY = 100;
	CatzRocket.catzRocketContainer.regX = 150;
	CatzRocket.catz.currentFrame = 0;
	CatzRocket.rocketFlame = Helpers.createSprite(SpriteSheetData.flame, 'cycle', {
		x: 190,
		y: 200,
		regX: 40,
		regY: -37,
		alpha: 0
	});
	CatzRocket.SnakeLine = new createjs.Shape(); // eslint-disable-line no-undef
	CatzRocket.rocket = Helpers.createBitmap(queue.getResult('rocket'), {
		scaleX: 0.25,
		scaleY: 0.25,
		regX: -430,
		regY: -320
	});
	CatzRocket.rocketSound = createjs.Sound.play('rocketSound'); // eslint-disable-line no-undef
	CatzRocket.rocketSound.volume = 0.1;
	CatzRocket.rocketSound.stop();
	for (let i = 0, snakeAmt = 11; i < snakeAmt; i++) {
		const shape = new createjs.Shape(); // eslint-disable-line no-undef
		const x = 260 - i * 5;
		const r = 9;
		shape.graphics.f('fffff').dc(x, 200, r);
		shape.regY = 5;
		shape.regX = 5;
		CatzRocket.rocketSnake.addChild(shape);
	}
	CatzRocket.setCrashBorders(0, YOriginPosInGame + 450);
	CatzRocket.catzRocketContainer.addChild(CatzRocket.rocket, CatzRocket.catz);
	CatzRocket.catzRocketContainer.on('pressmove', pressMoveCatz);
}

function populateDDL() {
	const ddl = document.getElementById('importSelect');
	levels = Object.keys(TrackParts.easy);
	for (let i = 0, len = levels.length; i < len; i++) {
		const option = document.createElement('option');
		option.text = levels[i];
		ddl.add(option);
	}
}

function setEventListeners() {
	bgCont.on('mousedown', createSelectBox);
	bgCont.on('pressmove', dragBox);
	bgCont.on('pressup', selectWithBox);
	$(window).keydown(handleKeyPress); // eslint-disable-line no-undef
	$(window).keyup(handleKeyUp); // eslint-disable-line no-undef
	GameLogic.SelectedCont.on('mousedown', startPressMove);
	GameLogic.SelectedCont.on('pressmove', pressMove);
	gameClickScreen.on('mousedown', gameMouseDown);
	gameClickScreen.on('click', gameMouseUp);
}

function handleKeyPress(evt){
	if (evt.ctrlKey){
		ctrlPressed = true;
	}
	if((evt.keyCode===67 ||evt.keyCode===88) && ctrlPressed){
		clipBoard = [];
		clipOffset = 0;
		let clipLeftMost = levelLength;
		let clipRightMost = 0;
		for (let i = GameLogic.SelectedCont.children.length - 1; i >= 0; i--) {
			const kid = GameLogic.SelectedCont.children[i];
			kid.x-=GameLogic.SelectedCont.x;
			kid.y-=GameLogic.SelectedCont.y;
			clipBoard.push(createClone(kid));
			clipRightMost = Math.max(GameLogic.SelectedCont.children[i].x, clipRightMost);
			clipLeftMost = Math.min(GameLogic.SelectedCont.children[i].x, clipLeftMost);
		}
		if(evt.keyCode===67) {
			clipOffset = clipRightMost-clipLeftMost+50;
		}
	}
	if(evt.keyCode===86 && ctrlPressed) {
		moveChildrenFromSelectedToObjCont();
		for (let i = clipBoard.length - 1; i >= 0; i--) {
			clipBoard[i].x+=clipOffset;
			const clone = createClone(clipBoard[i]);
			clone.alpha = 0.5;
			GameLogic.SelectedCont.addChild(clone);
		}
	}
	if(evt.keyCode===88 || evt.keyCode=== 46) {
		GameLogic.SelectedCont.removeAllChildren();
	}
}

function handleKeyUp(evt){
	if (evt.ctrlKey){
		ctrlPressed = false;
	}
}

function startPressMove(evt) {
	GameLogic.selectPosOnStartDrag.x = evt.stageX / levelViewScale - GameLogic.SelectedCont.x;
	GameLogic.selectPosOnStartDrag.y = evt.stageY / levelViewScale - GameLogic.SelectedCont.y;
}

function pressMove(evt) {
	evt.currentTarget.x = evt.stageX / levelViewScale - GameLogic.selectPosOnStartDrag.x;
	evt.currentTarget.y = evt.stageY / levelViewScale - GameLogic.selectPosOnStartDrag.y;
	stage.update();
}

function pressMoveCatz(evt) {
	evt.currentTarget.x = evt.stageX / levelViewScale;
	evt.currentTarget.y = evt.stageY / levelViewScale;
	stage.update();
}

function changeBirdType(evt) {
	const types = ['seagull',
		'duck',
		'crow',
		'bat',
		'falcon',
		'glasses'
	];
	for (let i = types.length - 1; i >= 0; i--) {
		if (evt.currentTarget.currentAnimation === types[i]) {
			evt.currentTarget.gotoAndStop(types[i + 1]);
			return;
		}
	}
}

function initSelectBox() {
	selectBox.rect = new createjs.Rectangle(0, 0, 0, 0); // eslint-disable-line no-undef
	selectBox.graphic = new createjs.Shape(); // eslint-disable-line no-undef

}

function createSelectBox(evt) {
	moveChildrenFromSelectedToObjCont();
	selectBox.rect.setValues(evt.stageX / levelViewScale, evt.stageY / levelViewScale, 1, 1);
	selectBox.graphic.graphics.clear();
	selectBox.graphic.graphics.setStrokeStyle(1);
	levelView.addChild(selectBox.graphic);
	drawSelectBox();
}

function dragBox(evt) {
	selectBox.graphic.graphics.clear();
	selectBox.rect.width = evt.stageX / levelViewScale - selectBox.rect.x;
	selectBox.rect.height = evt.stageY / levelViewScale - selectBox.rect.y;
	drawSelectBox();
}

function drawSelectBox() {
	selectBox.graphic.graphics.beginStroke('#ffffff').drawRect(
		selectBox.rect.x, selectBox.rect.y, selectBox.rect.width, selectBox.rect.height);
	stage.update();
}

function selectWithBox() {
	//remove selected items not in the box
	moveChildrenFromSelectedToObjCont();
	//add items in the box
	for (let i = objCont.numChildren - 1; i >= 0; i--) {
		const kid = objCont.getChildAt(i);
		if (Helpers.isInRectangle(kid.x, kid.y, selectBox.rect)) {
			GameLogic.SelectedCont.addChild(kid);
		}
	}
	if (GameLogic.SelectedCont.numChildren === 0) {
		selectBox.graphic.graphics.clear();
	} else {
		selectBox.graphic.graphics.clear();
		GameLogic.SelectedCont.alpha = 0.5;
	}
}

function selectItem(evt) {
	if (evt.currentTarget.parent === objCont) {
		moveChildrenFromSelectedToObjCont();
		GameLogic.SelectedCont.addChild(evt.currentTarget);
		startPressMove(evt);
	}
}


function moveChildrenFromSelectedToObjCont() {
	for (let i = GameLogic.SelectedCont.numChildren - 1; i >= 0; i--) {
		const kid = GameLogic.SelectedCont.getChildAt(i);
		kid.x += GameLogic.SelectedCont.x;
		kid.y += GameLogic.SelectedCont.y;
		kid.alpha = 1;
		objCont.addChild(kid);
	}
	GameLogic.SelectedCont.x = 0;
	GameLogic.SelectedCont.y = 0;
}

function createClone(object){
	const clone = object.clone(true);
	clone.on('mousedown',selectItem);
	return clone;
}

function createDisplayObject(x, y, sprite, currentAnimation) {
	let obj;
	if (isSpriteMode) {
		obj = createDisplaySprite(x, y, sprite, currentAnimation);
	} else {
		obj = createDisplayShape(x, y, sprite, currentAnimation);
	}
	objCont.addChild(obj);
	obj.on('mousedown', selectItem);
}

function createDisplaySprite(x, y, sprite, currentAnimation) {
	const obj = Helpers.createSprite(SpriteSheetData[sprite], currentAnimation, {
		x: x,
		y: y
	});

	obj.stop();
	if (sprite === 'enemybirds') {
		obj.on('dblclick', changeBirdType);
		obj.scaleX = 0.5;
		obj.scaleY = 0.5;
	}
	return obj;
}

function createDisplayShape() {}

function onTick(evt) {

	if (inGameMode === true) {
		gameUpdate(evt);
	}
	stage.update();
}

function gameUpdate(evt) {
	CatzRocket.diamondFuel = 10;
	CatzRocket.update(grav, 0, evt);
	let mult = 1;
	if (CatzRocket.hasFrenzy()) {
		mult = 2;
	}
	catzRocketXpos += evt.delta * (0.3 + 0.3 * Math.cos((CatzRocket.catzRocketContainer.rotation) / 360 * 2 * Math.PI)) * mult;
	CatzRocket.catzRocketContainer.x += catzRocketXpos;
	const x = catzRocketXpos * levelViewScale - 200;
	window.scrollTo(x, 0);
	if (CatzRocket.isCrashed) {
		exitGameMode();
	}
}

export function enterGameMode() {
	catzRocketXpos = CatzRocket.catzRocketContainer.x - 200;
	CatzRocket.heightOffset =
		CatzRocket.catzRocketContainer.y - 400;
	CatzRocket.start(CatzRocket.catzVelocity);
	gameClickScreen.alpha = 0.05;
	inGameMode = true;
}


function exitGameMode() {
	CatzRocket.reset();
	CatzRocket.catzRocketContainer.y = catzStartPos.y;
	CatzRocket.catzRocketContainer.x = currentCenterX();
	gameClickScreen.alpha = 0;
	inGameMode = false;
}

function gameMouseDown() {
	CatzRocket.catzUp();
}

function gameMouseUp() {
	console.log('up');
	CatzRocket.catzEndLoop();
}

function getObjType(kid) {
	let type;
	if (kid.currentAnimation === 'cycle') {
		type = 'diamond';
	} 
	else if (kid.currentAnimation === 'greatCycle') {
		type = 'greatDiamond';
	} else {
		type = 'attackBird';
	}
	return type;
}

function getObjGraphicType(objType){
	return {
		diamond: 'sprite',
		greatDiamond: 'sprite',
		attackBird: 'attackBird',
		thunderCloud :'thunderCloud'
	}[objType];
}

function getLevelToString(){
	const stringBuilder = ['levelName:[\n'];
	moveChildrenFromSelectedToObjCont();
	sortDisplayObjectArray();
	for (let j = 0, len = objCont.numChildren; j < len; j++) {
		const kid = objCont.getChildAt(j);
		stringBuilder.push(displayObjectToString(kid));
	}
	let levelString = stringBuilder.join('');
	levelString = levelString.substring(0, levelString.length - 2); //slice off the last comma
	levelString += '\n]';
	return levelString;
}

function getLevelToJson(){
	const levelArray = [];
	moveChildrenFromSelectedToObjCont();
	sortDisplayObjectArray();
	for (let j = 0, len = objCont.numChildren; j < len; j++) {
		let kid = objCont.getChildAt(j);
		levelArray.push(displayObjectToJson(kid));
	}
	return levelArray;
}

export function getTestLevelTrackParts() {
	return  {
		'easy': { 
			levelName: getLevelToJson()
		}
	};
}

export function saveLevel() {
	document.getElementById('levelText').innerHTML = '';
	let levelString = getLevelToString();
	document.getElementById('levelText').innerHTML = levelString;
}

function sortDisplayObjectArray() {
	objCont.children.sort(function(a, b) {
		return (a.x >= b.x) ? 1 : -1;
	});
}

function displayObjectToString(kid) {
	const x = kid.x - beginningZoneLength;
	const objType = getObjType(kid);
	return '{\'x\':' +
		x+
		', \'y\'' +
		YEditorToGame(kid.y) +
		',type:\'' +
		objType +
		'\',\'animation\':\'' +
		kid.currentAnimation +
		'\' ,\'graphicType\':\''+
		getObjGraphicType(objType)+'\'},\n';
}

function displayObjectToJson(kid){
	const x = kid.x -beginningZoneLength;
	return { 
		x: x,
		y: YEditorToGame(kid.y),
		type: getObjType(kid),
		animation: kid.currentAnimation,
		graphicType: getObjGraphicType(getObjType(kid))
	};
}

function loadLevel(offsetX) {
	const ddl = document.getElementById('importSelect');
	const levelName = levels[ddl.selectedIndex];
	if (TrackParts.easy.hasOwnProperty(levelName)) {
		for (let i = TrackParts.easy[levelName].length - 1; i >= 0; i--) {
			const kid = TrackParts.easy[levelName][i];
			createDisplayObject(kid.x + offsetX+beginningZoneLength, YGameToEditor(kid.y), kid.type, kid.currentAnimation);
		}
	} else {
		alert('Doesn\'t seem to exist');
	}
}

export function addToImport() {
	loadLevel(currentCenterX());
}

function YEditorToGame(y) {
	return y - YOriginPosInGame;
}

function YGameToEditor(y) {
	return y + YOriginPosInGame;
}

function currentCenterX() {
	return window.scrollX / levelViewScale + 200;
}
