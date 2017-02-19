import * as House from './house.js';
import * as CatzRocket from './catz-rocket.js';
import { Cloud, ThunderCloud } from './clouds.js';
import { AttackBird, AttackBirdProps } from './attack-birds.js';
import * as  Helpers from './helpers.js';
import Containers from './containers.js';
import { dispatch, events } from './event-bus.js';
import * as SpriteSheetData from './sprite-sheet-data.js';
import DebugOptions from './debug-options.js';

export let gameListener;
export let gameView;

let squawkSound;
let diamondEnum;
let exitSmoke;
let diamondShardCounter;
let gameStats;
let gameLogic = {};
let	clipBoard;
let clipOffset = 0;
let levelLength = 13000;
let cloudSpeed;
let diSpeed;
let fgSpeed;
let jump;
let mousedown;
let parallaxSpeed;
let track;
let tracks;
let trackParts;
let cloudIsIn = new Array();
let currentDisplacement = 0;
let currentLevel = 0;
let currentTrack = 0;
let directorTimer = 0;
let grav = 12;
let lastResolveNorm = [1, 0];
let onTrack = false;
let debugText;
let smoke;
let diamondCounterText;
let leaves;
let flameVertices;
let flameBounds;
let flameNorm;
let polygonVertices;
let newBounds;
let norm;
let catzVertices;
let catzNorm;
let polygonLine;
let bg;
let stage;
let cloudImg;
let queue;
let dataDict;

const selectBox = {
	rect: null,
	graphic: null
};


const scrollBar = {
	bar: null,
	slider: null,
	cont: new createjs.Container()
}
const selectPosOnStartDrag = {
	x: null,
	y: null
}
let trackTimer = 0;
let wind = 0;
let zoomOut = false;
let zooming = false;
let fuelBlinkTimer = 0;
let rocketSong;

const containerDict = {
	"diamond": Containers.diamond,
	"greatDiamond": Containers.diamond,
	"attackBird": Containers.attackBird,
	"thunderCloud": Containers.thunder
};
let levelViewScale = 1;
const directorStateEnum = {
	Normal: 0,
	Birds: 1,
	Wind: 2,
	Thunder: 3
};
const levelDesignConts = [Containers.diamond,
	Containers.thunder,
	Containers.attackBird
];

export function init(data) {
	tracks = data.tracks;
	trackParts = data.trackParts;
	debugText = data.debugText;
	gameStats = data.gameStats;
	bg = data.bg;
	stage = data.stage;
	queue = data.queue;
	diamondEnum = data.diamondEnum;

	dataDict = {
		"diamond" : SpriteSheetData.diamond,						
		"greatDiamond" : SpriteSheetData.greatDiamond,
		"seagull" : SpriteSheetData.seagullSheet,
		"goose" : SpriteSheetData.seagullSheet,
		"hawk" : SpriteSheetData.enemybirds
	};
	var cloudtype = "cloud" + Math.floor(Math.random() * 5 + 1).toString();
	cloudImg = Array
		.from(Array(5), (x,i) => i + 1)
		.map(i => i.toString())
		.map(i => 'cloud' + i)
		.reduce((acc, c) => {
			acc[c] = queue.getResult(c);
			return acc;
		}, {});

	rocketSong = createjs.Sound.play("palladiumAlloySong");
	rocketSong.stop();		
	var bgParallax = Helpers.createBitmap(queue.getResult("bgParallax 0"), {x:0, y: -200});								 
	var bgParallax2 = Helpers.createBitmap(queue.getResult("bgParallax 0"), {x:2460, y: -200});											
	Containers.parallax.addChild(bgParallax,bgParallax2);
	var fgGround1 = Helpers.createBitmap(queue.getResult("fgGround"), {x:0, y: 300});								
	var fgGround2 = Helpers.createBitmap(queue.getResult("fgGround"), {x:2000, y: 300});								
	var fgGround3 = Helpers.createBitmap(queue.getResult("fgGround"), {x:4000, y: 300});								
	var fgGroundTop1 = Helpers.createBitmap(queue.getResult("fgGroundTop"), {y: -830});							
	var fgGroundTop2 = Helpers.createBitmap(queue.getResult("fgGroundTop"), {x:2000, y: -830});					
	var fgGroundTop3 = Helpers.createBitmap(queue.getResult("fgGroundTop"), {x:4000, y: -830});					
	Containers.fg.addChild(fgGround1, fgGround2, fgGround3);	
	Containers.fgTop.addChild(fgGroundTop1,fgGroundTop2, fgGroundTop3);										
	diamondShardCounter = Helpers.createBitmap(queue.getResult("diamondShardCounter"), 
{scaleX:0.8, scaleY:0.8, y: -830});				
	diamondCounterText = Helpers.createText("", "22px Courier New", "#fff",  {x:608+118, y:52});
								
	smoke = Helpers.createSprite(SpriteSheetData.smoke, "jump", 
		{regX:150, regY:350, alpha:0});											
	exitSmoke = Helpers.createSprite(SpriteSheetData.smoke, "right", 
		{regX:150, regY:200, alpha:0});																			
						
	leaves = Helpers.createSprite(SpriteSheetData.leaves, "cycle", 
		{alpha:0});															
												
	Containers.onlooker = new createjs.Container();
						
						
	flameVertices  = [
			{x:1,y:1},
			{x:1,y:1},
			{x:1,y:1}
	];
	flameBounds = {
			height: 25,
			width : 50,
			length: 0
			
	};
	flameBounds.length =
		Math.sqrt(Math.pow(flameBounds.height/2,2)+Math.pow(flameBounds.width,2)); 
	flameNorm = [
			{x:1,y:1, vert1: 0, vert2: 2},
			{x:1,y:1, vert1: 0, vert2: 1},
			{x:1,y:1, vert1: 0, vert2: 1}
	];
	polygonVertices = [
			{x:1,y:1},
			{x:1,y:1},
			{x:1,y:1},
			{x:1,y:1},
			{x:1,y:1}
	];
	newBounds = {
			height: 25,
			width: 60,
			nose: 35,
			noseLen: 37.17
	};
	norm = [
			{x:1,y:1, vert1: 0, vert2: 3},
			{x:1,y:1, vert1: 0, vert2: 1},
			{x:1,y:1, vert1: 0, vert2: 3},
			{x:1,y:1, vert1: 1, vert2: 3}
	];
	catzVertices = [
			{x:1,y:1},
			{x:1,y:1},
			{x:1,y:1},
			{x:1,y:1}
	];
	catzNorm = [
			{x:1,y:1, vert1: 0, vert2: 1},
			{x:1,y:1, vert1: 0, vert2: 2}
	];
	polygonLine = new createjs.Shape();
	Containers.collisionCheckDebug.addChild(polygonLine);
	
	{
		const	diamondSound = createjs.Sound.play("diamondSound");
		diamondSound.volume = 0.2;
		diamondSound.stop();
	}
	
	{
		squawkSound = createjs.Sound.play(name);
		squawkSound.volume=0.15;
		squawkSound.stop();
  }
	gameView = new createjs.Container();

	gameView.addChild(Containers.parallax,
		Containers.onlooker,
		CatzRocket.rocketSnake,
		CatzRocket.snakeLine,
		Containers.attackBird,
		Containers.diamond,
		exitSmoke,smoke,
		CatzRocket.rocketFlame,
		CatzRocket.catzRocketContainer,
		Containers.cloud,
		Containers.lightning,
		Containers.thunder,
		Containers.fg,
		Containers.fgTop,
		leaves,
		Containers.collisionCheckDebug,
		Containers.select);
}

export function timeAdjust(event) {
		if (event.delta > 0.05) {
				event.delta = 0.05;
		}
}

export function update(event) {
		if (!event.paused) {
				var mult = 1;
				if (CatzRocket.hasFrenzy())
						mult = 2;
				diSpeed = (0.3 + 0.3 * Math.cos((CatzRocket.catzRocketContainer.rotation) / 360 * 2 * Math.PI)) * mult;
				cloudSpeed = (12.5 + 12.5 * Math.cos((CatzRocket.catzRocketContainer.rotation) / 360 * 2 * Math.PI)) * mult;
				fgSpeed = (7 + 7 * Math.cos((CatzRocket.catzRocketContainer.rotation) / 360 * 2 * Math.PI)) * mult;
				parallaxSpeed = (0.3 + 0.3 * Math.cos((CatzRocket.catzRocketContainer.rotation) / 360 * 2 * Math.PI)) * mult;

				$('.odometer').html(gameStats.score);

				if (!gameStats.hasBeenFirst.frenzy && CatzRocket.hasFrenzy()) {
						gameStats.hasBeenFirst.frenzy = true;
				}
				CatzRocket.update(grav, wind, event);
				updateVertices();
				updateDirector(event);
				updateOnlookers(event);
				updateFg(event);
				updateFgTop(event);
				updateParallax(event);
				updateDiamonds(event);
				//updateScatterDiamonds(event);
				updatePointer(event);
				updateClouds(event);
				updateWorldContainer();
				updateThunderClouds();
				updateAttackBird(event);
				drawCollisionModels();
				if (CatzRocket.isCrashed)
						crash();
				debugText.text =
						"rotation " + CatzRocket.catzRocketContainer.rotation + "\n\nvelocity " + CatzRocket.catzVelocity + "\nfuel  " + CatzRocket.diamondFuel + "\nfrenzyReady: " + CatzRocket.frenzyReady + "\nHoboDialogNo: " + House.hoboDialogNumber + "\n\ncurrentDisplacement: " + currentDisplacement + "\n\currentLevel" + currentLevel + "\n\mousedown: " + mousedown + "\nstate: " + CatzRocket.catzState;


				stage.update(event);
		}
}

export function SetObjectEventListeners(turnOn) {
		if (!turnOn) {
				moveChildrenFromSelectedToObjCont();
		}
		for (var i = levelDesignConts.length - 1; i >= 0; i--) {
				var container = levelDesignConts[i];
				for (var j = container.children.length - 1; j >= 0; j--) {
						kid = container.getChildAt(j);
						if (turnOn) {
								setupObjEvents(kid);
						} else {
								kid.off("mousedown", selectItem);
								if (getObjType(kid) === "attackBird") {
										kid.removeAllEventListeners();
								}
						}
				};
		};
}

export function DeleteSelected() {
		Containers.select.removeAllChildren();
		stage.update();
}

export function CutCopy(isCopy) {
		clipBoard = [];
		clipOffset = 0;
		var clipLeftMost = levelLength;
		var clipRightMost = 0;
		for (var i = Containers.select.children.length - 1; i >= 0; i--) {
				kid = Containers.select.children[i];
				kid.x -= Containers.select.x;
				kid.y -= Containers.select.y;
				clipBoard.push(createClone(kid));
				clipRightMost = Math.max(Containers.select.children[i].x, clipRightMost);
				clipLeftMost = Math.min(Containers.select.children[i].x, clipLeftMost);
		};
		if (isCopy) {
				clipOffset = clipRightMost - clipLeftMost + 50;
		} else {
				DeleteSelected();
		}
		stage.update();
}

export function Paste() {
		moveChildrenFromSelectedToObjCont();
		for (var i = clipBoard.length - 1; i >= 0; i--) {
				clipBoard[i].x += clipOffset;
				var clone = createClone(clipBoard[i]);
				clone.alpha = 0.5;
				Containers.select.addChild(clone);
		};
		stage.update();
}

export function StartPressMove(evt) {
		selectPosOnStartDrag.x = evt.stageX / levelViewScale - Containers.select.x;
		selectPosOnStartDrag.y = evt.stageY / levelViewScale - Containers.select.y;
}

export function PressMove(evt) {
		evt.currentTarget.x = evt.stageX / levelViewScale - selectPosOnStartDrag.x;
		evt.currentTarget.y = evt.stageY / levelViewScale - selectPosOnStartDrag.y;
		stage.update();
}

export function CreateSelectBox(evt) {
		levelViewScale = gameView.scaleX;
		moveChildrenFromSelectedToObjCont();
		selectBox.rect.setValues(evt.stageX / levelViewScale, (evt.stageY - gameView.y) / levelViewScale, 1, 1);
		selectBox.graphic.graphics.clear();
		selectBox.graphic.graphics.setStrokeStyle(1);
		gameView.addChild(selectBox.graphic);
		drawSelectBox();
}

export function DragBox(evt) {
		selectBox.graphic.graphics.clear();
		selectBox.rect.width = evt.stageX / levelViewScale - selectBox.rect.x;
		selectBox.rect.height = (evt.stageY - gameView.y) / levelViewScale - selectBox.rect.y;
		drawSelectBox();
}

export function SelectWithBox(evt) {
		//remove selected items not in the box
		moveChildrenFromSelectedToObjCont();
		//add items in the box
		for (var i = levelDesignConts.length - 1; i >= 0; i--) {
				var container = levelDesignConts[i];
				for (var j = container.children.length - 1; j >= 0; j--) {
						kid = container.getChildAt(j);
						kid.on("mousedown", selectItem);
						if (Helpers.isInRectangle(kid.x, kid.y, selectBox.rect)) {
								Containers.select.addChild(kid);
						}
				};
		};
		if (Containers.select.numChildren === 0) {

				selectBox.graphic.graphics.clear();
		} else {
				selectBox.graphic.graphics.clear();
				Containers.select.alpha = 0.5;
		}
		stage.update();
}

export function CreateThunderCloud() {
		var kid = spawnThunderCloud(800, CatzRocket.catzRocketContainer.y);
		if (createjs.Ticker.paused) {
				setupObjEvents(kid);
		}
		stage.update();
}

export function CreateSeagull() {
		var kid = spawnAttackBird("seagull", 800, CatzRocket.catzRocketContainer.y);
		if (createjs.Ticker.paused) {
				setupObjEvents(kid)
		}
		stage.update();
}

export function CreateGreatDiamond() {
		var kid = Helpers.createSprite(dataDict["greatDiamond"], "greatCycle", {
				x: 800,
				y: CatzRocket.catzRocketContainer.y
		});
		Containers.diamond.addChild(kid);
		if (createjs.Ticker.paused) {
				setupObjEvents(kid);
		}
		stage.update();;
}

export function CreateDiamond() {
		var kid = Helpers.createSprite(dataDict["diamond"], "cycle", {
				x: 800,
				y: CatzRocket.catzRocketContainer.y
		});
		Containers.diamond.addChild(kid);
		if (createjs.Ticker.paused) {
				setupObjEvents(kid);
		}
		stage.update();
}

export function gotoGameView(stage) {
	if (rocketSong.getPosition() < 100)
		rocketSong.play({
			loop: -1
		});
	initScrollBar();
	initSelectBox();
	gameStats.score = 0;
	gameStats.currentRound += 1;
	zoomOut = false

	//if song hasn't started yet            
	if (!DebugOptions.debugMode) {
			Containers.collisionCheckDebug.alpha = 0;
			debugText.alpha = 0;
	}
	stage.addChild(gameView, Containers.wind,
		diamondCounterText, debugText, scrollBar.cont);
	gameListener = createjs.Ticker.on("tick", update,
		this);
	createjs.Ticker.setFPS(30);
	CatzRocket.start(-20);

	stage.addEventListener("stagemousedown", function() {
			mousedown = true;
			CatzRocket.catzUp();
	});
	stage.addEventListener("stagemouseup", function() {
			mousedown = false;
			CatzRocket.catzEndLoop();
	});
	jump = false;

	if (!gameStats.hasBeenFirst.round) {
			gameStats.hasBeenFirst.round = true;
	}
	stage.update();
}
	
function updateWorldContainer(event) {
		var zoomDuration = 1000;
		var zoomOutLimit = 0.37;

		if ((!createjs.Tween.hasActiveTweens(gameView) && !createjs.Tween.hasActiveTweens(bg) && !createjs.Tween.hasActiveTweens(Containers.star)) && !CatzRocket.isCrashed) {
				if (!zoomOut && CatzRocket.catzRocketContainer.y < 0 && CatzRocket.catzState === CatzRocket.catzStateEnum.Normal) {
						zooming = true;
						createjs.Tween.get(gameView)
								.to({
										scaleX: zoomOutLimit,
										scaleY: zoomOutLimit
								}, zoomDuration, createjs.Ease.linear)
								.call(function() {
										zoomOut = true;
										zooming = false;
								});

						createjs.Tween.get(bg)
								.to({
										scaleX: 1,
										scaleY: zoomOutLimit
								}, zoomDuration, createjs.Ease.linear);

						createjs.Tween.get(Containers.star)
								.to({
										scaleX: zoomOutLimit,
										scaleY: zoomOutLimit
								}, zoomDuration, createjs.Ease.linear);
				} else if (zoomOut && CatzRocket.catzRocketContainer.y > 300 && CatzRocket.catzState === CatzRocket.catzStateEnum.Normal) {
						zooming = true;
						createjs.Tween.get(gameView)
								.to({
										scaleX: 1,
										scaleY: 1
								}, zoomDuration, createjs.Ease.linear)
								.call(function() {
										zoomOut = false;
										zooming = false;
								});

						createjs.Tween.get(bg)
								.to({
										scaleX: 1,
										scaleY: 1
								}, zoomDuration, createjs.Ease.linear);

						createjs.Tween.get(Containers.star)
								.to({
										scaleX: 1,
										scaleY: 1
								}, zoomDuration, createjs.Ease.linear);
				}
		}

		var catzCameraPos = Math.min(CatzRocket.catzRocketContainer.y, 200);
		var zoomPercent = (gameView.scaleY - zoomOutLimit) / (1 - zoomOutLimit);
		bg.y = (-1100 - catzCameraPos / 3) * zoomPercent - 200 * (1 - zoomPercent);
		Containers.star.y = (100 - catzCameraPos / 3) * zoomPercent - 270 * (1 - zoomPercent);
		gameView.y = (200 - catzCameraPos) * zoomPercent + 300 * (1 - zoomPercent);
}

function updateParallax(event) {
		for (var i = 0, arrayLength = Containers.parallax.children.length; i < arrayLength; i++) {
				var kid = Containers.parallax.children[i];
				if (kid.x <= -2460)
						kid.x = 2460;
				kid.x = kid.x - parallaxSpeed * event.delta / 10;
		}
}

function updateFg(event) {
		if (Math.random() > 0.98) {
				var tree = Helpers.createBitmap(queue.getResult("fgTree1"), {
						x: 2200,
						y: 290
				});
				Containers.fg.addChild(tree);
		}
		for (var i = 0, arrayLength = Containers.fg.children.length; i < arrayLength; i++) {
				var kid = Containers.fg.children[i];
				if (kid.x <= -3200)
						kid.x += 6000;
				kid.x = kid.x - fgSpeed * event.delta / 10;
				if ((CatzRocket.catzRocketContainer.x - CatzRocket.catzBounds.width) < (kid.x) && CatzRocket.catzRocketContainer.x >
						kid.x && (CatzRocket.catzRocketContainer.y - CatzRocket.catzBounds.height) < kid.y && CatzRocket.catzRocketContainer.y > kid.y) {
						leaves.alpha = 1;
						leaves.rotation = 0;
						leaves.x = kid.x + 50;
						leaves.y = kid.y;
						leaves.gotoAndPlay("cycle");
						leaves.addEventListener("animationend", function() {
								hideLeaves();
						});
				}
		}
		if (arrayLength > 3) {
				if (Containers.fg.children[3].x < -100)
						Containers.fg.removeChildAt(3);
		}

		if (leaves.alpha === 1)
				leaves.x -= fgSpeed * event.delta / 20;
}

function updateFgTop(event) {
		for (var i = 0, arrayLength = Containers.fgTop.children.length; i < arrayLength; i++) {
				var kid = Containers.fgTop.children[i];
				if (kid.x <= -3200)
						kid.x += 6000;
				kid.x -= fgSpeed * event.delta / 10;
		}
}

function hideLeaves() {
		leaves.alpha = 0;
}

function spawnCloud() {
		var cloudtype = "cloud" + Math.floor(Math.random() * 5 + 1).toString();
		var scale = Math.random() * 0.3 + 0.3;
		var cloud = new Cloud(cloudImg[cloudtype]);
		cloud.scaleX = scale;
		cloud.scaleY = scale;
		cloud.x = 2200;
		cloud.y = Math.floor(Math.random() * 1000 - 1000);
		cloud.catzIsInside = false;
		Containers.cloud.addChild(cloud);
}

function updateClouds(event) {
		if (Math.random() > 0.97) {
				spawnCloud()
		}
		for (var i = 0, arrayLength = Containers.cloud.children.length; i < arrayLength; i++) {
				var kid = Containers.cloud.children[i];
				kid.x -= cloudSpeed;
				if (kid.x <= -500) {
						Containers.cloud.removeChildAt(i);
						arrayLength -= 1;
						i -= 1;
				}
				var rect = kid.getBounds();
				if (CatzRocket.catzRocketContainer.x < (kid.x + rect.width * kid.scaleX) && CatzRocket.catzRocketContainer.x >
						kid.x && CatzRocket.catzRocketContainer.y < (kid.y + rect.height * kid.scaleY) && CatzRocket.catzRocketContainer.y > kid.y && kid.catzIsInside === false) {
						kid.catzIsInside = true;
						smoke.alpha = 1;
						smoke.rotation = CatzRocket.catzRocketContainer.rotation + 270;
						smoke.x = CatzRocket.catzRocketContainer.x;
						smoke.y = CatzRocket.catzRocketContainer.y;
						smoke.gotoAndPlay("jump");
						smoke.addEventListener("animationend", function() {
								hideSmoke();
						});
				} else if (kid.catzIsInside === true &&
						((CatzRocket.catzRocketContainer.x - CatzRocket.catzBounds.width / 2) > (kid.x + rect.width * kid.scaleX) || CatzRocket.catzRocketContainer.y - CatzRocket.catzBounds.height / 2 > (kid.y + rect.height * kid.scaleY) || (CatzRocket.catzRocketContainer.y + CatzRocket.catzBounds.height < kid.y))) {
						kid.catzIsInside = false;
						exitSmoke.alpha = 1;
						exitSmoke.rotation = CatzRocket.catzRocketContainer.rotation;
						exitSmoke.x = CatzRocket.catzRocketContainer.x;
						exitSmoke.y = CatzRocket.catzRocketContainer.y;
						exitSmoke.gotoAndPlay("right");
						exitSmoke.addEventListener("animationend", function() {
								hideExitSmoke();
						});
				}
		}
		if (smoke.alpha === 1)
				smoke.x -= cloudSpeed;
		if (exitSmoke.alpha === 1)
				exitSmoke.x -= cloudSpeed;
}

function spawnThunderCloud(xPos, yPos, type) {
		createjs.Sound.play("thunder");
		var cloudtype = Math.floor(Math.random() * 5 + 1);
		cloudtype = "cloud" + cloudtype.toString();
		var scale = Math.random() * 0.3 + 0.3;
		var cloud = new ThunderCloud(cloudImg[cloudtype]);
		cloud.scaleX = scale;
		cloud.scaleY = scale;
		cloud.x = xPos;
		cloud.y = yPos;
		cloud.filters = [new createjs.ColorFilter(0.3, 0.3, 0.3, 1, 0, 0, 55, 0)];
		var rect = cloud.getBounds();
		cloud.cache(rect.x, rect.y, rect.width, rect.height);
		Containers.thunder.addChild(cloud);
		return cloud;
}

function updateThunderClouds(event) {
		for (var i = 0, arrayLength = Containers.thunder.children.length; i < arrayLength; i++) {
				var kid = Containers.thunder.children[i];
				kid.x -= cloudSpeed;
				if (kid.x <= -500) {
						Containers.thunder.removeChildAt(i);
						arrayLength -= 1;
						i -= 1;
				}
				var rect = kid.getBounds();
				if (!kid.hasFired && !CatzRocket.isHit && CatzRocket.catzRocketContainer.x < (kid.x + rect.width * kid.scaleX) && CatzRocket.catzRocketContainer.x >
						kid.x && CatzRocket.catzRocketContainer.y < (kid.y + rect.height * kid.scaleY + 200) && CatzRocket.catzRocketContainer.y > kid.y + 50) {
						kid.hasFired = true;
						var birdHit = false;
						var spotX = 0;
						var spotY = 0;
						for (var i = 0, max = Containers.attackBird.children.length; i < max; i++) {
								var bird = Containers.attackBird.children[i];
								if (bird.x < (kid.x + rect.width * kid.scaleX + 50) && bird.x > kid.x - 100 && bird.y < CatzRocket.catzRocketContainer.y && bird.y > kid.y + 50) {
										birdHit = true;
										bird.setGrilled();
										break;
										spotX = bird.x;
										spotY = bird.y;
								}
						}
						if (!birdHit) {
								if (!DebugOptions.godMode) {
										if (CatzRocket.getHit(true)) {
												catzFellOfRocket();
										}
								}
								spotX = CatzRocket.catzRocketContainer.x;
								spotY = CatzRocket.catzRocketContainer.y;
						}
						var lightning = new createjs.Shape();
						lightning.graphics.setStrokeStyle(3, 1);
						lightning.graphics.beginStroke(lightningColor);
						lightning.graphics.moveTo(kid.x, kid.y);
						lightning.graphics.lineTo(kid.x + (spotX - kid.x) / 3 + 50, kid.y + (spotY - kid.y) / 3);
						lightning.graphics.lineTo(kid.x + (spotX - kid.x) * 2 / 3 - 50, kid.y + (spotY - kid.y) * 2 / 3);
						lightning.graphics.lineTo(spotX, spotY);
						lightning.graphics.endStroke();
						Containers.lightning.addChild(lightning);
						createjs.Tween.get(lightning).to({
								alpha: 0
						}, 300);
						createjs.Sound.play("lightningBolt");
						createjs.Tween.get(gameView)
								.to({
										x: -50,
										y: 20
								}, 50)
								.to({
										x: 50,
										y: -40
								}, 50)
								.to({
										x: -50,
										y: 50
								}, 50)
								.to({
										x: 20,
										y: -20
								}, 50)
								.to({
										x: -10,
										y: 10
								}, 50)
								.to({
										x: 10,
										y: -10
								}, 50)
								.to({
										x: 0,
										y: 0
								}, 50);
				}
		}
}

function setParallax(int) {
		createjs.Tween.get(gameView)
				.to({
						alpha: 0
				}, 800)
				.call(function() {
						changeParallax(int)
				})
				.to({
						alpha: 1
				}, 800)
}

function changeParallax(int) {
		Containers.parallax.removeAllChildren();
		var name = "bgParallax " + int;
		var bgParallax = Helpers.createBitmap(queue.getResult(name), {
				y: -200
		});
		var bgParallax2 = Helpers.createBitmap(queue.getResult(name), {
				x: 2460,
				y: -200
		});

		if (currentLevel === 1) {
				bgParallax.y = 100;
				bgParallax2.y = 100;
		}
		Containers.parallax.addChild(bgParallax, bgParallax2);
}

function generateTrack() {
		var result = [];
		var displacementX = 2200;
		if (gameStats.Difficulty >= 0) {
				for (let j = 0,
						max1 = tracks[currentLevel][currentTrack].length; j < max1; j++) {
						var element = $.extend(true, [], trackParts[tracks[currentLevel][currentTrack][j].difficulty][tracks[currentLevel][currentTrack][j].name]);
						for (let i = 0,
								max2 = element.length; i < max2; i++) {
								element[i].x += displacementX;
								element[i].y;
								if (i === element.length - 1 && element[i].graphicType !== "attackBird")
										displacementX = element[i].x;
						}
						result = result.concat(element);
				}
				currentTrack += 1;
				return result;
		}
}


function updateDirector(event) {
		directorTimer += event.delta;
		if (onTrack) {
				if (Containers.diamond.getNumChildren() === 0) {
						onTrack = false;
						if (tracks[currentLevel].length === currentTrack) {
								currentTrack = 0;
								currentLevel++;
								if (tracks.length === currentLevel)
										currentLevel = 0;
								setParallax(currentLevel);
						}
				}
		} else {
				trackTimer += event.delta;
				if (trackTimer > 1000) {
						trackTimer = 0;
						onTrack = true;
						gameStats.Difficulty++;
						track = generateTrack();
						for (let i = 0,
								max = track.length; i < max; i++) {
								if (track[i].graphicType === "thunderCloud") {
										spawnThunderCloud(track[i].x, track[i].y - 200);
								} else if (track[i].graphicType === "sprite") {
										var sprite = Helpers.createSprite(dataDict[track[i].type], track[i].animation, {
												x: track[i].x,
												y: track[i].y
										});
										containerDict[track[i].type].addChild(sprite);
								} else if (track[i].graphicType === "attackBird") {
										spawnAttackBird(track[i].animation, track[i].x, track[i].y + CatzRocket.catzRocketContainer.y);
								}
						}
				}
		}
}

function updateOnlookers(event) {
		var arrayLength = Containers.onlooker.children.length;
		if (arrayLength < 3) {
				var xOffset = 0;

				function addOnlooker(onlooker) {
						var oCont = new createjs.Container();
						oCont.x = 2000 + xOffset;
						xOffset += 300;
						oCont.y = 180;
						onlooker.x = 180;
						onlooker.y = 0;
						var variant = "mobHill" + Math.floor(Math.random() * 2 + 1);
						var hill = Helpers.createBitmap(queue.getResult(variant), {
								y: 95
						});
						oCont.addChild(onlooker, hill);
						Containers.onlooker.addChild(oCont);
				}

				var onlooker;
				if (Math.random() > 1 - gameStats.kittensApprovalRating) {
						onlooker = Helpers.createSprite(SpriteSheetData.onlookers, "orphans", {});
						addOnlooker(onlooker);
				}
				if (Math.random() < -gameStats.catPartyApprovalRating) {
						onlooker = Helpers.createSprite(SpriteSheetData.onlookers, "cat party", {});
						addOnlooker(onlooker);
				}
				if (Math.random() < -gameStats.villagersApprovalRating) {
						onlooker = Helpers.createSprite(SpriteSheetData.onlookers, "angry mob", {});
						addOnlooker(onlooker);
				}
				if (Math.random() > 1 - gameStats.villagersApprovalRating) {
						onlooker = Helpers.createSprite(SpriteSheetData.onlookers, "loving mob", {});
						addOnlooker(onlooker);
				}
		}

		for (var i = 0; i < arrayLength; i++) {
				var oC = Containers.onlooker.children[i];
				oC.x -= diSpeed / 2 * event.delta;
				if (oC.x <= -400) {
						Containers.onlooker.removeChildAt(i);
						arrayLength = arrayLength - 1;
						i = i - 1;
				}
		}
}

function updatePointer() {
		$('.progress-bar').css('width', CatzRocket.diamondFuel * 10 + '%');
		if (CatzRocket.diamondFuel < 2) {
				if (fuelBlinkTimer > 10) {
						$('.progress-bar').toggleClass("background-red");
						fuelBlinkTimer = 0;
				}
				fuelBlinkTimer++;
		}
		if (CatzRocket.diamondFuel >= 2)
				$('.progress-bar').removeClass("background-red");
		//hudPointer.rotation = Math.min(-30 + CatzRocket.diamondFuel*135/10,105);                
}

function updateDiamonds(event) {
		for (var i = 0, arrayLength = Containers.diamond.children.length; i < arrayLength; i++) {
				var kid = Containers.diamond.children[i];
				kid.x -= diSpeed * event.delta;
				if (kid.x <= -100) {
						Containers.diamond.removeChildAt(i);
						arrayLength -= 1;
						i -= 1;
				} else {
						if (overlapCheckCircle(kid.x, kid.y, 40)) {
								if (kid.currentAnimation === "cycle") {
										gameStats.score += 1;
										CatzRocket.pickupDiamond(diamondEnum.shard);
								} else if (kid.currentAnimation === "greatCycle") {
										gameStats.score += 10;
										CatzRocket.pickupDiamond(diamondEnum.great);
								}
								Containers.diamond.removeChildAt(i);
								arrayLength -= 1;
								i -= 1;
								var instance = createjs.Sound.play("diamondSound");
								instance.volume = 0.15;
						}
				}
		}
}

function upWind() {
		wind = -0.73 * grav;
		Containers.wind.removeAllChildren();
		var windSprite1 = Helpers.createSprite(SpriteSheetData.wind, "cycle", {
				x: 50,
				y: 50,
				scaleX: -1,
				scaleY: -1,
				rotation: 10
		});
		var windSprite2 = Helpers.createSprite(SpriteSheetData.wind, "cycle", {
				x: 200,
				y: 300,
				scaleX: -1,
				scaleY: -1,
				rotation: 10
		});
		var windSprite3 = Helpers.createSprite(SpriteSheetData.wind, "cycle", {
				x: 500,
				y: 300,
				scaleX: -1,
				scaleY: -1,
				rotation: 10
		});
		Containers.wind.addChild(windSprite1, windSprite2, windSprite3);
}

function downWind() {
		wind = 2 * grav;
		Containers.wind.removeAllChildren();
		var windSprite1 = Helpers.createSprite(SpriteSheetData.wind, "cycle", {
				x: 50,
				y: 50,
				rotation: 10
		});
		var windSprite2 = Helpers.createSprite(SpriteSheetData.wind, "cycle", {
				x: 270,
				y: 170,
				rotation: 10
		});
		var windSprite3 = Helpers.createSprite(SpriteSheetData.wind, "cycle", {
				x: 700,
				y: 400,
				rotation: 10
		});

		Containers.wind.addChild(windSprite1, windSprite2, windSprite3);
}

function noWind() {
		wind = 0;
		Containers.wind.removeAllChildren();
}

function spawnAttackBird(type, x, y) {
		var attackBird = new AttackBird(new createjs.SpriteSheet(SpriteSheetData.enemybirds), type);
		attackBird.x = x;
		attackBird.y = y;
		if (type === "duck") {
				attackBird.scaleX = -attackBird.scaleX;
		}
		Containers.attackBird.addChild(attackBird);
		Containers.collisionCheckDebug.addChild(attackBird.shape);
		return attackBird;
}

function updateAttackBird(event) {
		for (var i = 0, arrayLength = Containers.attackBird.children.length; i < arrayLength; i++) {
				var kid = Containers.attackBird.children[i];
				kid.update(CatzRocket.catzRocketContainer.x, CatzRocket.catzRocketContainer.y, event);
				moveAndCollisionCheck(kid, event);
				kid.updateCircle();
				catzCollisionCheck(kid);
				if (flameCollisionCheck(kid)) {
						kid.temperature += event.delta;
						if (kid.temperature > 200 && kid.state !== "grilled") {
								kid.setGrilled();
								gameStats.kills += 1;
						}
				} else if (kid.temperature >= 0) {
						kid.temperature -= event.delta;
						if (kid.temperature < 0) {
								kid.temperature = 0;
						}
				}
		}
}

function hideSmoke() {
		smoke.alpha = 0;
}

function hideExitSmoke() {
		exitSmoke.alpha = 0;
}

//hittar de globala x-y koordinaterna till hörnen på raketen, samt normalvektorer
function updateVertices() {
		var s = Math.sin(CatzRocket.catzRocketContainer.rotation * Math.PI / 180);
		var c = Math.cos(CatzRocket.catzRocketContainer.rotation * Math.PI / 180);
		if (CatzRocket.hasFrenzy()) {
				var x = CatzRocket.catzRocketContainer.x + 70 * c - 13 * s;
				var y = CatzRocket.catzRocketContainer.y + 13 * c + 70 * s;
				var h = (newBounds.height / 2) + 5;
				var w = (newBounds.width / 2) + 10;
		} else {
				var x = CatzRocket.catzRocketContainer.x - 10 * c - 13 * s;
				var y = CatzRocket.catzRocketContainer.y + 13 * c - 10 * s;
				var h = (newBounds.height / 2);
				var w = (newBounds.width / 2);
		}

		polygonVertices[0].x = x - w * c - h * s;
		polygonVertices[0].y = y + h * c - w * s;
		polygonVertices[1].x = x - w * c + h * s;
		polygonVertices[1].y = y - h * c - w * s;
		polygonVertices[2].x = x + w * c + h * s;
		polygonVertices[2].y = y - h * c + w * s;
		polygonVertices[3].x = x + (w + newBounds.nose) * c;
		polygonVertices[3].y = y + (w + newBounds.nose) * s;
		polygonVertices[4].x = x + w * c - h * s;
		polygonVertices[4].y = y + h * c + w * s;

		norm[0].x = -(polygonVertices[0].y - polygonVertices[1].y) / newBounds.height;
		norm[0].y = -(polygonVertices[1].x - polygonVertices[0].x) / newBounds.height;
		norm[1].x = -(polygonVertices[1].y - polygonVertices[2].y) / newBounds.width;
		norm[1].y = -(polygonVertices[2].x - polygonVertices[1].x) / newBounds.width;
		norm[2].x = -(polygonVertices[2].y - polygonVertices[3].y) / newBounds.noseLen;
		norm[2].y = -(polygonVertices[3].x - polygonVertices[2].x) / newBounds.noseLen;
		norm[3].x = -(polygonVertices[3].y - polygonVertices[4].y) / newBounds.noseLen;
		norm[3].y = -(polygonVertices[4].x - polygonVertices[3].x) / newBounds.noseLen;

		if (CatzRocket.isWounded) {
				var x = CatzRocket.catzRocketContainer.x - 55 * c + 3 * s;
				var y = CatzRocket.catzRocketContainer.y - 3 * c - 55 * s;
		} else {
				var x = CatzRocket.catzRocketContainer.x - 5 * c + 3 * s;
				var y = CatzRocket.catzRocketContainer.y - 3 * c - 5 * s;
		}
		var h = (CatzRocket.catzBounds.height / 2);
		var w = (CatzRocket.catzBounds.width / 2);
		catzVertices[0].x = x - w * c - h * s;
		catzVertices[0].y = y + h * c - w * s;
		catzVertices[1].x = x - w * c + h * s;
		catzVertices[1].y = y - h * c - w * s;
		catzVertices[2].x = x + w * c + h * s;
		catzVertices[2].y = y - h * c + w * s;
		catzVertices[3].x = x + w * c - h * s;
		catzVertices[3].y = y + h * c + w * s;

		catzNorm[0].x = (catzVertices[0].y - catzVertices[1].y) / CatzRocket.catzBounds.height;
		catzNorm[0].y = (catzVertices[1].x - catzVertices[0].x) / CatzRocket.catzBounds.height;
		catzNorm[1].x = (catzVertices[1].y - catzVertices[2].y) / CatzRocket.catzBounds.width;
		catzNorm[1].y = (catzVertices[2].x - catzVertices[1].x) / CatzRocket.catzBounds.width;

		if (CatzRocket.hasFrenzy()) {
				var x = CatzRocket.catzRocketContainer.x + 55 * c - 13 * s;
				var y = CatzRocket.catzRocketContainer.y + 13 * c + 55 * s;
		} else {
				var x = CatzRocket.catzRocketContainer.x - 40 * c - 13 * s;
				var y = CatzRocket.catzRocketContainer.y + 13 * c - 40 * s;
		}
		var h = (flameBounds.height / 2);
		var w = (flameBounds.width);
		flameVertices[0].x = x - h * s;
		flameVertices[0].y = y + h * c;
		flameVertices[1].x = x + h * s;
		flameVertices[1].y = y - h * c;
		flameVertices[2].x = x - w * c;
		flameVertices[2].y = y - w * s;
		flameNorm[0].x = (flameVertices[0].y - flameVertices[1].y) / flameBounds.height;
		flameNorm[0].y = (flameVertices[1].x - flameVertices[0].x) / flameBounds.height;
		flameNorm[1].x = -(flameVertices[0].y - flameVertices[2].y) / flameBounds.length;
		flameNorm[1].y = -(flameVertices[2].x - flameVertices[0].x) / flameBounds.length;
		flameNorm[2].x = (flameVertices[1].y - flameVertices[2].y) / flameBounds.length;
		flameNorm[2].y = (flameVertices[2].x - flameVertices[1].x) / flameBounds.length;
}

function moveAndCollisionCheck(bird, event) {
		var isCollide = collisionCheck(bird);
		var dispX = bird.velocityX * event.delta / 1000;
		var dispY = bird.velocityY * event.delta / 1000;
		if (dispX > bird.rad / 2 || dispY > bird.rad / 2) {
				var noSteps = Math.min(2 * Math.max(dispX, dispY) / bird.rad, 4);
				for (var i = 0; i < noSteps; i++) {
						bird.x += dispX / noSteps;
						bird.y += dispY / noSteps;
						isCollide = collisionCheck(bird);
						if (isCollide) {
								dispX = bird.velocityX * event.delta / 1000;
								dispY = bird.velocityY * event.delta / 1000;
						}
				}
		} else {
				bird.x += dispX;
				bird.y += dispY;
				isCollide = collisionCheck(bird);
		}
		return isCollide;
}

function collisionCheck(bird) {
		var groundLevel = 430;
		if (Math.abs(bird.x - CatzRocket.catzRocketContainer.x) < 200 && Math.abs(bird.y - CatzRocket.catzRocketContainer.y) < 150) {
				var minOverlapNorm = 0;
				var minOverlapDist = Infinity;
				for (var i = 0, max = norm.length; i < max; i++) {
						var proj1 = norm[i].x * polygonVertices[norm[i].vert1].x +
								norm[i].y * polygonVertices[norm[i].vert1].y;
						var proj2 = norm[i].x * polygonVertices[norm[i].vert2].x +
								norm[i].y * polygonVertices[norm[i].vert2].y;
						var projC = norm[i].x * bird.x + norm[i].y * bird.y;
						if (projC - Math.max(proj1, proj2) > bird.rad || Math.min(proj1, proj2) - projC > bird.rad) {
								if (bird.y < groundLevel)
										return false;
								else
										collisionResolve(bird, 0, -1, bird.y - groundLevel, true);
						}
						if (bird.rad - projC + Math.max(proj1, proj2) < Math.abs(minOverlapDist)) {
								minOverlapDist = bird.rad - projC + Math.max(proj1, proj2);
								minOverlapNorm = i;
						}
						if (bird.rad - Math.min(proj1, proj2) + projC < Math.abs(minOverlapDist)) {
								minOverlapDist = -bird.rad + Math.min(proj1, proj2) - projC;
								minOverlapNorm = i;
						}
				}
				var closestVertex = 0;
				var minDist = Infinity;
				for (var i = 0, max = polygonVertices.length; i < max; i++) {
						var dist = Math.pow((polygonVertices[i].x - bird.x), 2) + Math.pow((polygonVertices[i].y - bird.y), 2);
						if (dist < minDist) {
								closestVertex = i;
								minDist = dist;
						}
				}
				var x = bird.x - polygonVertices[closestVertex].x;
				var y = bird.y - polygonVertices[closestVertex].y;
				var normX = x / Math.sqrt(y * y + x * x);
				var normY = y / Math.sqrt(y * y + x * x);
				var projMin = Infinity;
				var projMax = -Infinity;
				for (var i = 0, max = polygonVertices.length; i < max; i++) {
						var proj = normX * polygonVertices[i].x + normY * polygonVertices[i].y;
						if (proj < projMin)
								projMin = proj;
						if (proj > projMax)
								projMax = proj;
				}
				projC = normX * bird.x + normY * bird.y;
				if (projC - projMax > bird.rad || projMin - projC > bird.rad) {
						if (bird.y < groundLevel)
								return false;
						else
								collisionResolve(bird, 0, -1, bird.y - groundLevel, true);
				} else if (bird.rad - projC + projMax < Math.abs(minOverlapDist)) {
						minOverlapDist = bird.rad - projC + projMax;
						collisionResolve(bird, normX, normY, minOverlapDist, false);
				} else if (bird.rad - projMin + projC < Math.abs(minOverlapDist)) {
						minOverlapDist = -bird.rad + projMin - projC;
						collisionResolve(bird, normX, normY, minOverlapDist, false);
				} else {
						collisionResolve(bird, norm[minOverlapNorm].x, norm[minOverlapNorm].y, minOverlapDist, false);
				}
				return true;
		} else
				return false;
}

//enklare, snabbare variant av kollisionhanteringen som kan användas vid tex diamanplockning
function overlapCheckCircle(x, y, r) {
		for (var i = 0, max = norm.length; i < max; i++) {
				var proj1 = norm[i].x * polygonVertices[norm[i].vert1].x +
						norm[i].y * polygonVertices[norm[i].vert1].y;
				var proj2 = norm[i].x * polygonVertices[norm[i].vert2].x +
						norm[i].y * polygonVertices[norm[i].vert2].y;
				var projC = norm[i].x * x + norm[i].y * y;
				if (projC - Math.max(proj1, proj2) > r || Math.min(proj1, proj2) - projC > r)
						return false;
		}
		return true;
}

function catzCollisionCheck(bird) {
		for (var i = 0, max = catzNorm.length; i < max; i++) {
				var proj1 = catzNorm[i].x * catzVertices[catzNorm[i].vert1].x +
						catzNorm[i].y * catzVertices[catzNorm[i].vert1].y;
				var proj2 = catzNorm[i].x * catzVertices[catzNorm[i].vert2].x +
						catzNorm[i].y * catzVertices[catzNorm[i].vert2].y;
				var projC = catzNorm[i].x * bird.x + catzNorm[i].y * bird.y;
				if (projC - Math.max(proj1, proj2) > bird.rad || Math.min(proj1, proj2) - projC > bird.rad)
						return false;
		}
		if (!DebugOptions.godMode && CatzRocket.getHit(false))
				catzFellOfRocket();
		return true;
}

function flameCollisionCheck(bird) {
		if (1 === CatzRocket.rocketFlame.alpha) {
				for (var i = 0, max = flameNorm.length; i < max; i++) {
						var proj1 = flameNorm[i].x * flameVertices[flameNorm[i].vert1].x +
								flameNorm[i].y * flameVertices[flameNorm[i].vert1].y;
						var proj2 = flameNorm[i].x * flameVertices[flameNorm[i].vert2].x +
								flameNorm[i].y * flameVertices[flameNorm[i].vert2].y;
						var projC = flameNorm[i].x * bird.x + flameNorm[i].y * bird.y;
						if (projC - Math.max(proj1, proj2) > bird.rad || Math.min(proj1, proj2) - projC > bird.rad)
								return false;
				}
				return true;
		} else
				return false;
}

function sign(x) {
		x = +x;
		// convert to a number
		if (x === 0 || isNaN(x))
				return x;
		return x > 0 ? 1 : -1;
}

function collisionResolve(bird, normX, normY, normDist, isGround) {
		if (isGround || CatzRocket.canCollide()) {
				bird.x += normX * normDist * 2;
				bird.y += normY * normDist * 2;
				normX = normX * sign(normDist);
				normY = normY * sign(normDist);
				lastResolveNorm[0] = normX;
				lastResolveNorm[1] = normY;
				var reflect = -2.5 * (normX * bird.velocityX + normY * bird.velocityY);
				bird.velocityX += reflect * normX;
				bird.velocityY += reflect * normY;
				CatzRocket.catzVelocity -= bird.weight * reflect * normY / 150;
				CatzRocket.catzRocketContainer.y -= bird.weight * reflect * normY / 400;
				var rand = Math.floor(2 * Math.random() + 3);
				var name = "klonk" + rand;
				var instance = createjs.Sound.play(name);
				instance.volume = 0.15;
				if (squawkSound.playState !== createjs.Sound.PLAY_SUCCEEDED) {
						rand = Math.floor(3 * Math.random() + 1);
						name = "squawk" + rand;
						squawkSound = createjs.Sound.play(name);
						squawkSound.volume = 0.15;
				}
		} else if (CatzRocket.hasFrenzy()) {
				bird.setGrilled();
				gameStats.kills += 1;
		}
}

function drawCollisionModels() {
		polygonLine.graphics = new createjs.Graphics();
		polygonLine.x = 0;
		polygonLine.y = 0;
		for (var i = 0, max = polygonVertices.length; i < max; i++) {
				polygonLine.graphics.setStrokeStyle(2, 1);
				polygonLine.graphics.beginStroke("black");
				polygonLine.graphics.moveTo(polygonVertices[i].x, polygonVertices[i].y);
				if (i === polygonVertices.length - 1)
						polygonLine.graphics.lineTo(polygonVertices[0].x, polygonVertices[0].y);
				else
						polygonLine.graphics.lineTo(polygonVertices[i + 1].x, polygonVertices[i + 1].y);
				polygonLine.graphics.endStroke();
		}
		for (var i = 0, max = catzVertices.length; i < max; i++) {
				polygonLine.graphics.setStrokeStyle(2, 1);
				polygonLine.graphics.beginStroke("red");
				polygonLine.graphics.moveTo(catzVertices[i].x, catzVertices[i].y);
				if (i === catzVertices.length - 1)
						polygonLine.graphics.lineTo(catzVertices[0].x, catzVertices[0].y);
				else
						polygonLine.graphics.lineTo(catzVertices[i + 1].x, catzVertices[i + 1].y);
				polygonLine.graphics.endStroke();
		}

		for (var i = 0, max = flameVertices.length; i < max; i++) {
				polygonLine.graphics.setStrokeStyle(2, 1);
				polygonLine.graphics.beginStroke("green");
				polygonLine.graphics.moveTo(flameVertices[i].x, flameVertices[i].y);
				if (i === flameVertices.length - 1)
						polygonLine.graphics.lineTo(flameVertices[0].x, flameVertices[0].y);
				else
						polygonLine.graphics.lineTo(flameVertices[i + 1].x, flameVertices[i + 1].y);
				polygonLine.graphics.endStroke();
		}
		polygonLine.graphics.setStrokeStyle(2, 2);
		polygonLine.graphics.beginStroke("pink");
		polygonLine.graphics.moveTo(
				CatzRocket.catzRocketContainer.x,
				CatzRocket.catzRocketContainer.y);
		polygonLine.graphics.lineTo(
				CatzRocket.catzRocketContainer.x + lastResolveNorm[0] * 100,
				CatzRocket.catzRocketContainer.y + lastResolveNorm[1] * 100);
		polygonLine.graphics.endStroke();
}

function catzFellOfRocket() {
		stage.removeAllEventListeners();
		createjs.Tween.removeTweens(CatzRocket.rocket);
		createjs.Tween.get(CatzRocket.rocket).to({
				x: 800
		}, 800);
}

function resetGameView() {
		currentTrack = 0;
		currentLevel = 0;
		Containers.lightning.removeAllChildren();
		Containers.attackBird.removeAllChildren();
		Containers.diamond.removeAllChildren();
		Containers.onlooker.removeAllChildren();
		setParallax(currentLevel);
		noWind();
		updatePointer();
		bg.y = -1200;
		bg.scaleX = 1;
		bg.scaleY = 1;
		Containers.star.y = 0;
		Containers.star.scaleX = 1;
		Containers.star.scaleY = 1;
		gameView.y = 0;
		gameView.scaleX = 1;
		gameView.scaleY = 1;
		stage.removeAllEventListeners();
		stage.removeChild(gameView);
		stage.update();
		createjs.Ticker.setFPS(20);
		createjs.Ticker.off("tick", gameListener);
		onTrack = false;
}

function crash() {
	var instance = createjs.Sound.play("catzRocketCrash");
	instance.volume = 0.5;

	resetGameView();
	CatzRocket.reset();
	updatePointer();
	stage.update();
	dispatch(events.CRASH);
}


function createClone(object) {
	var clone = object.clone(true);
	setupObjEvents(clone);
	return clone;
}

function selectItem(evt) {
	if (evt.currentTarget.parent !== Containers.select) {
		moveChildrenFromSelectedToObjCont();
		Containers.select.addChild(evt.currentTarget);
		StartPressMove(evt);
	}
}

function changeBirdType(evt) {
		types = ["seagull",
				"duck",
				"crow",
				"bat",
				"falcon",
				"glasses"
		];
		for (let i = types.length - 1; i >= 0; i--) {
				if (evt.currentTarget.currentAnimation === types[i]) {
						var newType = types[(i + 1) % (types.length)];
						evt.currentTarget.gotoAndPlay(newType);
						evt.currentTarget.acceleration = AttackBirdProps[newType].acceleration;
						evt.currentTarget.topSpeed2 = AttackBirdProps[newType].topSpeed2;
						evt.currentTarget.weight = AttackBirdProps[newType].weight;
						evt.currentTarget.scale = AttackBirdProps[newType].scale;
						evt.currentTarget.scaleX = AttackBirdProps[newType].scale;
						evt.currentTarget.scaleY = AttackBirdProps[newType].scale;
						evt.currentTarget.rad = AttackBirdProps[newType].scale * 50;
						i = -1;
				}
		}
		stage.update();
}

function initScrollBar() {
		var height = 10;
		scrollBar.bar = Helpers.createRectangle(800, height, "#ffffcc", {
				y: 450 - height
		});
		var sliderWidth = 800/(levelLength);
		scrollBar.slider = Helpers.createRectangle(sliderWidth, height, "#1f1f1f", {
				y: 450 - height
		});
		scrollBar.cont.addChild(scrollBar.bar, scrollBar.slider);
}

function initSelectBox() {
		selectBox.rect = new createjs.Rectangle(0, 0, 0, 0);
		selectBox.graphic = new createjs.Shape();

}

function drawSelectBox() {
		selectBox.graphic.graphics.beginStroke("#ffffff").drawRect(
				selectBox.rect.x, selectBox.rect.y, selectBox.rect.width, selectBox.rect.height);
		stage.update();
}

function moveChildrenFromSelectedToObjCont() {
		for (var i = Containers.select.numChildren - 1; i >= 0; i--) {
				var kid = Containers.select.getChildAt(i);
				kid.x += Containers.select.x;
				kid.y += Containers.select.y;
				kid.alpha = 1;
				var objCont = containerDict[getObjType(kid)];
				objCont.addChild(kid);
		};
		Containers.select.x = 0;
		Containers.select.y = 0;
}

function getObjType(kid) {
		var type;
		if (kid.hasOwnProperty("currentAnimation")) {
				if (kid.currentAnimation === "cycle") {
						type = "diamond";
				} else if (kid.currentAnimation === "greatCycle") {
						type = "greatDiamond";
				} else {
						type = "attackBird";
				}
		} else {
				type = "thunderCloud";
		}
		return type;
}

function setupObjEvents(kid) {
		kid.on("mousedown", selectItem);
		if (getObjType(kid) === "attackBird") {
				kid.on("dblclick", changeBirdType);
		}
}

