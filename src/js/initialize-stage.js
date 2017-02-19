import * as CatzRocket from './catz-rocket.js';
import * as House from './house.js';
import * as GameLogic from './game-logic.js';
import * as SpriteSheetData from './sprite-sheet-data.js';
import * as Helpers from './helpers.js';
import DiamondConstellation from './diamond-constellation.js';
import TrackParts from './track-parts.js';
import Tracks from './tracks.js';
import LevelManifest from './level-manifest.js';
import Containers from './containers.js';
import GameProgressionJSON from './game-progression.js';
import * as Cookie from './cookie.js';
import { on, events } from './event-bus.js';
import DebugOptions from './debug-options.js';

const lightningColor = "#99ccff";	
const diamondEnum = {
        shard : 0,        
        great : 2,        
};

let gameStats = {
        score : 0,
        kills : 0,
        bust : 0,
        currentRound: 0,        
		buildings: {
			hoboCatHouse : {
				built : false, 
				builtOnRound : null
			},
			orphanage : {
				built : false, 
				builtOnRound : null, 
				youthCenter : false, 
				summerCamp : false, 
				slots : 0
			},
			rehab: {
				built : false, 
				isBuilding : false, 
				builtOnRound : null, 
				hospital : false, 
				phychiatricWing : false, 
				monastery : false, 
				slots : 0
			},
			university: {
				built : false, 
				builtOnRound : null, 
				rocketUniversity:null, 
				slots : 0
			}
		},
		dialogNumber: {
			"priest" : 0,
			"timmy" : 0,
			"hoboCat" : 0,
		},
		dialogID: {
			"priest" : 0,
			"timmy" : 0,
			"hoboCat" : 0,
		},
		HasHappend: {
			"priest" : [], 
			"timmy" : [], 
			"hoboCat" : []
		},
        villagersApprovalRating : 0,
        kittensApprovalRating : 0,
        catPartyApprovalRating : 0,
        Difficulty : 0,
        hasBeenFirst: {
            round : false,
            frenzy : false,            
            houseWithSlots : false,
            bouncedCheck : false
        }
};

let manifest;
let progressBar;
let stage;
let queue;
let bg;
let debugText;
let houseListener;

export function init (){			
let canvas = $("#mahCanvas")[0]		
	stage = new createjs.Stage(canvas);	
	stage.mouseEventsEnabled = true;

	if ('ontouchstart' in document.documentElement)
		createjs.Touch.enable(stage);                   
	
	progressBar = new createjs.Shape();                 
	progressBar.graphics.beginFill("#907a91").drawRect(0,0,100,20);         
	progressBar.x = canvas.width/2-50;        
	progressBar.y = canvas.height/2-10;                               
	stage.addChild(progressBar);
	queue = new createjs.LoadQueue(true);
	queue.installPlugin(createjs.Sound);
	queue.on("progress", handleProgress);            
	queue.on("complete", handleComplete);
	queue.loadManifest(LevelManifest);

	const onCrash = () => {
		if (DebugOptions.noHouseView) {
			GameLogic.gotoGameView(stage);
		} else {
			updateAndStartHouseView();
		}
	};

	const onRocketFired = () => {
		if (!DebugOptions.noHouseView) {
			House.cricketsSound.stop();
			stage.removeChild(House.houseView);
			createjs.Ticker.off("tick", houseListener);
		}

		GameLogic.gotoGameView(stage);
	};
	on(events.CRASH, onCrash);
	on(events.ROCKET_FIRED, onRocketFired);
}

    function handleProgress(event){                
        progressBar.graphics.beginFill("#330033").drawRect(0,0,100*event.progress,20);                
        stage.update();
    }

    function handleComplete(){           
        stage.removeChild(progressBar);   
        initBase();      			
        GameLogic.tracks = Tracks;
        GameLogic.trackParts = TrackParts;
        if(DebugOptions.noHouseView)
            GameLogic.gotoGameView(stage);
        else
            initHouseViewAndStart();
    }

function initBase() {
	debugText = Helpers.createText("", "12px Courier New", "#ffffcc",  {x:500, y:0});						
	SpriteSheetData.setValues(queue);
	createBG();
	createGameView();
	stage.addChild(bg, Containers.star);
	stage.enableMouseOver();	 
	CatzRocket.init({
		lightningColor: lightningColor,
		diamondEnum: diamondEnum
	}, queue);
	GameLogic.init({
		tracks: Tracks,
		trackParts: TrackParts,
		debugText: debugText,
		lightningColor: lightningColor,
		gameStats: gameStats,
		bg: bg,
		stage: stage,
		queue: queue,
		diamondEnum: diamondEnum
	});
	House.init({
		queue: queue,
		bg: bg,
		gameStats: gameStats,
		debugText: debugText
	});
}

function initHouseViewAndStart() {
	for (let key in gameStats.HasHappend) {
		if (gameStats.HasHappend.hasOwnProperty(key)) {							
			for(var i=0, max1 = GameProgressionJSON[key].length;i<max1;i++) {
				gameStats.HasHappend[key][i] = false;	
			}
		}
	}												
	House.gotoHouseViewFirstTime(stage, GameLogic.gameView, GameLogic.gameListener);		
	houseListener = createjs.Ticker.on("tick", houseTick,this);
}

function updateAndStartHouseView(isCrashed) {
	stage.addChild(House.houseView);
	House.subtractedDiamondCont.removeAllChildren();
	House.removeCharacterEvents();

	houseListener = createjs.Ticker.on("tick", houseTick, this);
	House.deactivateWick();
	createjs.Tween.removeTweens(House.houseView);
	if (DebugOptions.trustFund && gameStats.score < 20000)
			gameStats.score = 20000;

	createjs.Tween.get(House.houseView)
			.wait(200)
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
			}, 50)
			.wait(800);
	createjs.Tween.get(House.wick)
			.wait(2000)
			.to({
					x: -210
			}, 1500, createjs.Ease.quadInOut)
			.call((function() {
					House.activateWick(() => gameLogic.gotoGameView(stage));
			}))
			.call(House.addCharacterEvents);

	if (CatzRocket.isHit)
		House.gotoHouseViewWithoutRocket(CatzRocket.catzRocketContainer.rotation);
	else {
		House.gotoHouseViewWithRocket(CatzRocket.catzState ===
			CatzRocket.catzStateEnum.OutOfFuelUpsideDown,
			CatzRocket.catzRocketContainer.rotation);
	}
}

function createBG() {
	bg = Helpers.createBitmap(queue.getResult("bg"),{y: -1200});
	setStars();
 }														

function createGameView() {
}

function setStars(){
	for(let i=0;i<80;i++){
		var star = Helpers.createBitmap(queue.getResult("star"), 
	{x:Math.random()*2200, y:Math.random()*1450-1000});											
		var delay = Math.random()*2000;												 
		createjs.Tween.get(star,{loop:true})
			.wait(delay)
			.to({alpha:0},1000)
			.to({alpha:1},1000);
		Containers.star.addChild(star);
	}
}
	
function houseTick(event) {
	House.tick();
	stage.update();
}
