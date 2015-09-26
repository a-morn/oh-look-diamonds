var bg;
var canvas;
var catzBounds;
var catzNorm;
var catzVertices;
var ctx;
var dataDict;
var diamondShardCounter;
var diamondSound;
var debugText;

var debugOptions = {
	noHouseView: false, 
	debugMode: false, 
	trustFund : false, 
	infiniteFuel : false, 
	godMode : false
};

var diamondEnum = {
        shard : 0,        
        great : 2,        
};

var diamondCounterText;
var exitSmoke;
var flameBounds;
var flameNorm;
var flameVertices;
var gameView;
var gameListener;
var houseListener;
var leaves;
var lightningColor = "#99ccff";	
var newBounds;
var norm;
var polygonLine;
var polygonVertices;
var rocketSong;
var smoke;
var squawkSound;
var stage;
var queue;
var cont = {
	attackBird : new createjs.Container(), 
	cloud : new createjs.Container(),
	collisionCheckDebug : new createjs.Container(), 
	diamond : new createjs.Container(),	
	fg : new createjs.Container(), 
	fgTop : new createjs.Container(),
	lightning : new createjs.Container(),
	onlooker : new createjs.Container(),
	parallax : new createjs.Container(),
	star : new createjs.Container(),	
	select : new createjs.Container(),
	thunder : new createjs.Container(),
	wind : new createjs.Container()
};

var gameStats = {
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

function StartGame(){
	$("#mute").click(switchMute);
	ctx = document.querySelector("#hs").getContext("2d"),
	InitializeStage.init(canvas, stage);
	Cookie.saveAndSetHS(0);
}

function StartGameFromLevelEditor(){
	$("#mute").click(switchMute);
	debugOptions.noHouseView = true;
	var tracks = [[[{"difficulty":"easy", "name": "levelName"}]]];
	var trackParts = getTestLevelTrackParts();
	ctx = document.querySelector("#hs").getContext("2d"),
	InitializeStage.CreateViewsAndStartCustomLevel(tracks, trackParts);    	
}

function switchMute(){
	if(createjs.Sound.getMute()){
		createjs.Sound.setMute(false);
		$("#mute").toggleClass("mute-is-muted",false);
	}
	else{
		createjs.Sound.setMute(true);
		$("#mute").toggleClass("mute-is-muted",true);
	}
}

function paint(hs){
var dashLen = 220, dashOffset = dashLen, speed = 5,
    txt = hs+"", x = 0, i = 0;
ctx.clearRect(0, 0, 200, 57);
ctx.font = "20px Sans Serif, cursive";
ctx.lineWidth = 1; ctx.lineJoin = "round";
ctx.globalAlpha = 1;
ctx.strokeStyle = "#ffffcc";
ctx.fillStyle =	"#ffffcc";
ctx.fillText('Highscore', 0, 20);
ctx.font = "40px Just Another Hand, cursive";
(function loop() {
  ctx.clearRect(x, 30, 60, 40);
  ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
  dashOffset -= speed;                                         // reduce dash length
  ctx.strokeText(txt[i], x, 55);                              // stroke letter

  if (dashOffset > 0)
    requestAnimationFrame(loop);             // animate
  else {
    ctx.fillText(txt[i], x, 55);                              // fill final letter
    dashOffset = dashLen;                                      // prep next char
    x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random() + 5;
    if (i < txt.length) requestAnimationFrame(loop);
  }
})();
}
