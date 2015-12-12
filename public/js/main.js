angular
  .module('ohld', ['ui.router']);

angular
  .module('ohld')
  .config(Conf);

Conf.$inject = ['$stateProvider', '$urlRouterProvider'];

function Conf($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('game', {
      url: '/',
      templateUrl: 'game.html',
      onEnter: function() {
        setTimeout(StartGame,2500); //FIX THIS
        setTimeout(function() {
          $("#aboutInner").hide();
          $("#hideshow").click(function(){
            $("#aboutInner").toggle();
          });
        }, 500);
      },
  })
  .state('lvleditor', {
    url: '/lvleditor',
    templateUrl: 'leveleditor.html',
    onEnter: function() {
      setTimeout(levelEditor.Init, 2500);
      setTimeout(function() {
        $(window).scroll(function() {
          $('#belowLevelEditor').css({
            'left': $(this).scrollLeft() + 15
          });
        });
      }, 2500);
    }
  })
  .state('wizard', {
    url: '/wizard',
    templateUrl: 'wizard.html',
    onEnter: function() {
      console.log('wiz');
      setTimeout(WizardVersion.Init, 2500);
      setTimeout(function() {
        $(window).scroll(function() {
          $('#belowLevelEditor').css({
            'left': $(this).scrollLeft() + 15
          });
        });  
      });
    },
    controller: 'MainController'
  });
}


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

 function AttackBird(sheet, current) {
    this.Sprite_constructor(sheet, current);
    this.setup(current);
}

var AttackBirdProps = {
        chicken: {
            acceleration: 0,
            topSpeed2: 100000,
            weight: 0.2,
            scale: 0.5
        },
        falcon: {
            acceleration: 8,
            topSpeed2: 100000,
            weight: 0.6,
            scale: 0.8
        },
        crow: {
            acceleration: 5,
            topSpeed2: 100000,
            weight: 0.5,
            scale: 0.7
        },
        bat: {
            acceleration: 7,
            topSpeed2: 100000,
            weight: 0.2,
            scale: 0.4
        },
        duck: {
            acceleration: 5,
            topSpeed2: 100000,
            weight: 0.3,
            scale: 0.5
        },
        seagull: {
            acceleration: 3,
            topSpeed2: 100000,
            weight: 0.2,
            scale: 0.5
        },
        glasses: {
            acceleration: 11,
            topSpeed2: 100000,
            weight: 1,
            scale: 1
        }
    }

var p = createjs.extend(AttackBird, createjs.Sprite);

//constructor
p.setup = function(current) {
    var prop = AttackBirdProps[current];

    this.topSpeed2 = prop.topSpeed2;
    this.weight = prop.weight;
    this.acceleration = prop.acceleration;
    this.falconTimer = 0;
    this.target = 0;
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill("red").dc(0, 0, this.rad);
    this.scaleX = prop.scale;
    this.scaleY = prop.scale;
    this.state = "normal";
    this.velocityX = 0;
    this.velocityY = 0;
    this.rad = prop.scale*50;
    this.temperature = 0;
};

AttackBird.prototype.clone = function() {
    var clone = new AttackBird(new createjs.SpriteSheet(SpriteSheetData.enemybirds), this.currentAnimation);
    clone.state = this.state;
    clone.x = this.x;
    clone.y = this.y;
    return clone;
};

AttackBird.prototype.update = function(rocketX, rocketY, event) {
    if (this.currentAnimation === "falcon") {
        this.updateFalcon(rocketX, rocketY, event);
    } else if (this.currentAnimation === "duck") {
        this.updateDuck(rocketX, rocketY, event);
    } else {
        this.updateSeagull(rocketX, rocketY, event);
    }
};

AttackBird.prototype.updateDuck = function(rocketX, rocketY, event) {
    if (this.state === "normal") {
        this.velocityX = -300;
        var aY = 0;
        if (this.x < 650) {
            this.state = "attacking";
            this.target = rocketY;
        }
    } else if (this.state === "attacking") {
        this.velocityX = -250;
        aY = this.acceleration * event.delta * (rocketY - this.y) / (1000);
    } else if (this.state === "grilled") {
        aY = 200 * this.acceleration * event.delta / 1000;
        this.rotation = Math.atan(this.velocityY / 600) * 360 / 3.14;
    }
    this.velocityY += aY;
    //this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    var speed2 = this.velocityX * this.velocityX + this.velocityY * this.velocityY;
    if (speed2 > this.topSpeed2) {
        this.velocityX = this.velocityX * this.topSpeed2 / speed2;
        this.velocityY = this.velocityY * this.topSpeed2 / speed2;
    }
};

AttackBird.prototype.updateFalcon = function(rocketX, rocketY, event) {
    if (this.state === "normal") {
        var aX = this.acceleration * event.delta * (rocketX - this.x) / (1000);
        var aY = this.acceleration * event.delta * (rocketY - 350 - this.y) / (1000);
        if (rocketY - 250 - this.y > 0) {
            this.rotation = -20;
            this.state = "soaring";
            this.falconTimer = 3000;
            aX = 0;
            aY = 0;
        }
    } else if (this.state === "attacking") {
        aX = this.acceleration * event.delta * (rocketX - this.x) / (1000);
        aY = this.acceleration * event.delta * (rocketY - this.y) / (1000);
        this.rotation = Math.atan(aY / 60) * 270 / 3.14;
        if (this.y - (rocketY) > 0) {
            this.rotation = -30;
            this.state = "normal";
        }

    } else if (this.state === "soaring") {
        aX = this.acceleration * event.delta * (rocketX - this.x) / (1000);
        aY = this.acceleration * event.delta * (rocketY - 250 - this.y) / (1000);
        this.falconTimer -= event.delta;
        if (this.falconTimer < 0) {
            this.state = "attacking";
            this.rotation = 45;
            this.velocityX = this.acceleration * event.delta * (rocketX - this.x) / (1000);
            this.velocityY = this.acceleration * event.delta * (rocketY - this.y) / (1000);
        }
    } else if (this.state === "grilled") {
        aX = 0;
        aY = 200 * this.acceleration * event.delta / 1000;
        this.rotation = Math.atan(this.velocityY / 600) * 360 / 3.14;
    }
    this.velocityX += aX;
    this.velocityY += aY;
    //this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    var speed2 = this.velocityX * this.velocityX + this.velocityY * this.velocityY;
    if (speed2 > this.topSpeed2) {
        this.velocityX = this.velocityX * this.topSpeed2 / speed2;
        this.velocityY = this.velocityY * this.topSpeed2 / speed2;
    }
};

AttackBird.prototype.updateSeagull = function(rocketX, rocketY, event) {
    var maxSpeed2 = 100000;
    var speed2 = this.velocityX * this.velocityX + this.velocityY * this.velocityY;
    if (this.state !== "grilled") {
        var aX = this.acceleration * event.delta * (rocketX - this.x) / (1000);
        var aY = this.acceleration * event.delta * (rocketY - this.y) / (1000);
    } else {
        aX = 0;
        aY = 200 * this.acceleration * event.delta / 1000;
        this.rotation = Math.atan(this.velocityY / 600) * 360 / 3.14;
    }
    this.velocityX += aX;
    this.velocityY += aY;
    //this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    if (speed2 > this.topSpeed2) {
        this.velocityX = this.velocityX * this.topSpeed2 / speed2;
        this.velocityY = this.velocityY * this.topSpeed2 / speed2;
    }
};

AttackBird.prototype.updateCircle = function() {
    this.shape.x = this.x;
    this.shape.y = this.y;
};

AttackBird.prototype.setGrilled = function() {
    this.velocityX = -10;
    this.gotoAndPlay("chicken");
    this.state = "grilled";
    var instance = createjs.Sound.play("grilled");
    instance.volume = 1;
};

createjs.promote(AttackBird, "Sprite");
var CatzRocket = (function() {
    var catzRocket = {
        catzRocketContainer: null,
        silouette: null,
        diamondFuel: 2,
        maxDiamondFuel: 10,
        isWounded: false,
        isHit: false,
        isCrashed: false,
        flameColor: "#99ccff",
        //glass: null,
        heightOffset: 0,
        frenzyCount: 0,
        frenzyTimer: 0,
        frenzyReady: false,
        rocketSound: null,
        xScreenPosition: 0,
        yScreenPosition: 0,
        catz: null,
        rocket: null,
        rocketFlame: null,
        rocketSnake: new createjs.Container(),
        SnakeLine: null,
        catzVelocity: -2,
        limitVelocity: 30,
        rocketSounds: [
            null,
            "uploopSound",
            "downloopSound",
            "secondUploopSound",
            "secondDownloopSound",
            "slingshotSound",
            "wind",
            "emeregencyBoostSound",
            null,
            "miscSound",
            "frenzySound",
            null,
            "catzScream3",
            null,
            null
        ],
        fuelConsumption: [
            0,
            2,
            0.7,
            3,
            0.8,
            1,
            0,
            3.5,
            0.7,
            0.7,
            0,
            0,
            0,
            0,
            0
        ],
        catzState: 0,
        catzStateEnum: {
            Normal: 0,
            Uploop: 1,
            Downloop: 2,
            SecondUploop: 3,
            SecondDownloop: 4,
            Slingshot: 5,
            TerminalVelocity: 6,
            EmergencyBoost: 7,
            SlammerReady: 8,
            Slammer: 9,
            Frenzy: 10,
            FrenzyUploop: 11,
            FellOffRocket: 12,
            OutOfFuel: 13,
            OutOfFuelUpsideDown: 14
        },
        crashBorder : {
            top: -1000,
            bottom: 450
        }
    };

    var invincibilityCounter = 0;

    catzRocket.Init = function() {
        catzRocket.catzRocketContainer = new createjs.Container();
    };

    catzRocket.setCrashBorders = function(top, bottom) {
        catzRocket.crashBorder.top = top;
        catzRocket.crashBorder.bottom = bottom;
    }

    catzRocket.update = function(grav, wind, event) {
        invincibilityCountDown(event.delta);
        diamondFuelLossPerTime(event.delta);
        switch (catzRocket.catzState) {
            case catzRocket.catzStateEnum.Normal:
                {
                    updateNormal(grav, wind, event);
                    break;
                }
            case catzRocket.catzStateEnum.FellOffRocket:
                {
                    updateFellOff(grav, wind, event);
                    break;
                }
            case catzRocket.catzStateEnum.OutOfFuel:
                {
                    updateOutOfFuel(grav, wind, event);
                    break;
                }
            case catzRocket.catzStateEnum.OutOfFuelUpsideDown:
                updateOutOfFuelUpsideDown(grav, wind, event);
                break;
            case catzRocket.catzStateEnum.Frenzy:
                updateFrenzy2(grav, wind, event);
                break;
            case catzRocket.catzStateEnum.FrenzyUploop:
                updateFrenzyUploop(grav, wind, event)
                break;
            case catzRocket.catzStateEnum.TerminalVelocity:
                updateTerminal(event);
                break;
            case catzRocket.catzStateEnum.EmergencyBoost:
                updateEmergency(grav, wind, event);
                break;
            case catzRocket.catzStateEnum.Uploop:
                updateUploop(grav, wind, event);
                break;
            case catzRocket.catzStateEnum.Downloop:
            case catzRocket.catzStateEnum.SlammerReady:
                updateDownloop(grav, wind, event);
                break;
            case catzRocket.catzStateEnum.Slammer:
                updateSlammer();
                break;
            case catzRocket.catzStateEnum.SecondUploop:
                updateSecondUploop(grav, wind, event);
                break;
            case catzRocket.catzStateEnum.SecondDownloop:
                updateSecondDownloop(grav, wind, event);
                break;
            case catzRocket.catzStateEnum.Slingshot:
                updateSlingshot();
        }

        if (catzRocket.catzState !== catzRocket.catzStateEnum.SecondDownloop && catzRocket.catzState !== catzRocket.catzStateEnum.Slingshot && catzRocket.catzState !== catzRocket.catzStateEnum.OutOfFuelUpsideDown) {
            catzRocket.xScreenPosition = 200 +
                Math.cos((catzRocket.catzRocketContainer.rotation + 90) / 360 * 2 * Math.PI) * 160;
            catzRocket.yScreenPosition = 200 +
                Math.sin((catzRocket.catzRocketContainer.rotation + 90) / 360 * 2 * Math.PI) * 210;
        } else if (catzRocket.catzState !== catzRocket.catzStateEnum.OutOfFuelUpsideDown) {
            catzRocket.xScreenPosition = 255 +
                Math.cos((catzRocket.catzRocketContainer.rotation + 90) / 360 * 2 * Math.PI) * 80;
            catzRocket.yScreenPosition = 200 +
                Math.sin((catzRocket.catzRocketContainer.rotation + 90) / 360 * 2 * Math.PI) * 100;
        }

        if (catzRocket.isWounded && !createjs.Tween.hasActiveTweens(catzRocket.catz))
            catzRocket.catz.x = -50;
        else if (!catzRocket.isWounded &&
            !createjs.Tween.hasActiveTweens(catzRocket.catz))
            catzRocket.catz.x = 0;
        if (catzRocket.catzRocketContainer.y > catzRocket.crashBorder.bottom || catzRocket.catzRocketContainer.y < catzRocket.crashBorder.top)
            catzRocket.isCrashed = true;
        catzRocket.catzRocketContainer.x = catzRocket.xScreenPosition;
        catzRocket.catzRocketContainer.y = catzRocket.yScreenPosition + catzRocket.heightOffset;
        catzRocket.diamondFuel -= catzRocket.fuelConsumption[catzRocket.catzState] * event.delta / 1000;
        catzRocket.diamondFuel = Math.max(catzRocket.diamondFuel, 0);
        updateFrenzy(event);
        updateRocketSnake();
    };

    function updateBase(gravWindSum, event, canChangeToTerminal, fellOff, rotate) {
        catzRocket.catzVelocity += (gravWindSum) * event.delta / 1000;
        catzRocket.heightOffset += 20 * catzRocket.catzVelocity * event.delta / 1000;
        if (catzRocket.catzVelocity >= catzRocket.limitVelocity) {
            catzRocket.catzVelocity = catzRocket.limitVelocity;
            if (canChangeToTerminal)
                changeState(catzRocket.catzStateEnum.TerminalVelocity);
        }
        if (rotate && !createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer)) {
            if (!fellOff || catzRocket.catzRocketContainer.rotation <= -270 || catzRocket.catzRocketContainer.rotation > -90)
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity / 40) * 360 / 3.14;
            else if (catzRocket.catzRocketContainer.rotation <= -180 && catzRocket.catzRocketContainer.rotation > -270)
                catzRocket.catzRocketContainer.rotation = -Math.atan(catzRocket.catzVelocity / 40) * 360 / 3.14;
        }
    }

    function checkFuel(mightBeUpsideDown) {
        if (catzRocket.diamondFuel === 0) {
//            catzRocket.glass.gotoAndPlay("outOfFuel");
            createjs.Tween.removeTweens(catzRocket.catzRocketContainer);
            if (mightBeUpsideDown) {
                if (catzRocket.catzRocketContainer.rotation <= -90 && catzRocket.catzRocketContainer.rotation >= -270) {
                    changeState(catzRocket.catzStateEnum.OutOfFuelUpsideDown);
                    isHit = true;
                } else
                    changeState(catzRocket.catzStateEnum.OutOfFuel);

            } else
                changeState(catzRocket.catzStateEnum.OutOfFuel);
        }
    }

    function updateNormal(grav, wind, event) {
        updateBase(grav + wind, event, true, false,true);
        checkFuel(false);
    }

    function updateFellOff(grav, wind, event) {
        updateBase(grav + wind, event, false, false,true);
    }

    function updateOutOfFuel(grav, wind, event) {
        updateBase(grav + wind, event, false, true,true);
        if (catzRocket.diamondFuel > 0)
            changeState(catzRocket.catzStateEnum.Normal);
    }

    function updateOutOfFuelUpsideDown(grav, wind, event) {
        updateBase(grav + wind, event, false, true, false);
    }

    function updateFrenzy2(grav, wind, event) {
        updateBase(0.5 * (grav + wind), event, false, false,true);
    }

    function updateFrenzyUploop(grav, wind, event) {
        updateBase(-0.5 * (2.3 * grav - wind), event, false, false,true);
    }

    function updateTerminal(event) {
        catzRocket.heightOffset += 20 * catzRocket.catzVelocity * event.delta / 1000;
        catzRocket.catzRocketContainer.rotation = -280;
        checkFuel(false);
    }

    function updateEmergency(grav, wind, event) {
        updateBase(-10 * grav - 3.7 * wind, event, false, false,true);
        if (catzRocket.catzRocketContainer.rotation < 0)
            changeState(catzRocket.catzStateEnum.Uploop);
        checkFuel(false);
    }

    function updateDownloop(grav, wind, event) {
        catzRocket.catzVelocity += ((2 - 8 * Math.sin(catzRocket.catzRocketContainer.rotation)) *
            grav + 6 * wind) * event.delta / 1000 + 0.4;
        checkFuel(true);
    }

    function updateSlammer() {
        if (catzRocket.catzRocketContainer.rotation < -250) {
            createjs.Tween.removeTweens(catzRocket.catzRocketContainer);
            catzRocket.catzVelocity = catzRocket.limitVelocity;
            changeState(catzRocket.catzStateEnum.TerminalVelocity);
        }
        checkFuel(true);
    }

    function updateUploop(grav, wind, event) {
        updateBase(-(3.2 * grav - wind), event, false, false,true);
        if (catzRocket.catzRocketContainer.rotation < -60) {
            createjs.Tween.removeTweens(catzRocket.catzRocketContainer);
            tween = createjs.Tween.get(catzRocket.catzRocketContainer)
                .to({
                    rotation: -270
                }, 1000)
                .to({
                    rotation: -330
                }, 350)
                .call(catzRocket.catzRelease);
            changeState(catzRocket.catzStateEnum.Downloop);
        }
        checkFuel(false);
    }

    function updateSecondUploop(grav, wind, event) {
        updateBase(-(5.5 * grav - 2 * wind), event, false, false,true);
        if (!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity / 40) * 360 / 3.14;
        if (catzRocket.catzRocketContainer.rotation < -60) {
            catzRocket.heightOffset += 110 * Math.sin((catzRocket.catzRocketContainer.rotation + 110) / 360 * 2 * Math.PI);
            changeState(catzRocket.catzStateEnum.SecondDownloop);
            createjs.Tween.removeTweens(catzRocket.catzRocketContainer);
            tween = createjs.Tween.get(catzRocket.catzRocketContainer, {
                    loop: true
                })
                .to({
                    rotation: -270
                }, 500)
                .to({
                    rotation: -420
                }, 500)
                .call(catzRocket.playSecondDownloopSound);
        }
        checkFuel(false);
    }

    function updateSecondDownloop(grav, wind, event) {
        if (wind >= 0)
            catzRocket.heightOffset += (150 + 12 * wind) * event.delta / 1000;
        else
            catzRocket.heightOffset += (150 + 40 * wind) * event.delta / 1000;
        checkFuel(true);
    }

    function updateSlingshot() {
        if (catzRocket.catzRocketContainer.rotation < -400) {
            createjs.Tween.removeTweens(catzRocket.catzRocketContainer);
            changeState(catzRocket.catzStateEnum.Normal);
            catzRocket.heightOffset -= 110 * Math.sin((catzRocket.catzRocketContainer.rotation + 110) / 360 * 2 * Math.PI);
            catzRocket.catzVelocity = -20;
        }
        checkFuel(true);
    }

    catzRocket.pickupDiamond = function(size) {
        if (catzRocket.diamondFuel < 10 && catzRocket.catzState != catzRocket.catzStateEnum.Frenzy)
            switch (size) {
                case diamondEnum.shard:
                    CatzRocket.diamondFuel += 0.09;
                    CatzRocket.frenzyCount += 0.1;
                    break;                
                case diamondEnum.great:
                    CatzRocket.diamondFuel += 1.5;
                    CatzRocket.frenzyCount += 5;
                    break;
            }
    }

    function updateFrenzy(event) {
        if (catzRocket.catzState === catzRocket.catzStateEnum.Frenzy) {
            catzRocket.frenzyTimer += event.delta;
            if (catzRocket.frenzyTimer > 1500) {
                changeState(catzRocket.catzStateEnum.Normal);
                catzRocket.catz.gotoAndPlay("no shake");
                //catzRocket.glass.gotoAndPlay("still");
                catzRocket.rocket.alpha = 1;
                catzRocket.frenzyCount = 0;
                catzRocket.frenzyTimer = 0;
            }
            catzRocket.frenzyReady = false;
        } else if (catzRocket.frenzyReady === true) {
            catzRocket.frenzyTimer += event.delta;
            if (catzRocket.frenzyTimer > 500) {
                if (catzRocket.catzState === catzRocket.catzStateEnum.SecondDownloop) {
                    changeState(catzRocket.catzStateEnum.Slingshot);
                } else if (catzRocket.catzState !== catzRocket.catzStateEnum.Downloop &&
                    catzRocket.catzState !== catzRocket.catzStateEnum.SlammerReady &&
                    catzRocket.catzState !== catzRocket.catzStateEnum.Slammer &&
                    catzRocket.catzState !== catzRocket.catzStateEnum.Slingshot) {
                    if (catzRocket.catzState === catzRocket.catzStateEnum.Uploop || catzRocket.catzState === catzRocket.catzStateEnum.SecondUploop) {
                        changeState(catzRocket.catzStateEnum.FrenzyUploop);
                    } else {
                        changeState(catzRocket.catzStateEnum.Frenzy);
                    }
                    //catzRocket.glass.gotoAndPlay("frenzy");
                    catzRocket.isWounded = false;
                    catzRocket.frenzyTimer = 0;
                    catzRocket.frenzyReady = false;
                }
            }
        } else if (!catzRocket.hasFrenzy() && catzRocket.frenzyCount > 0) {
            if (catzRocket.diamondFuel >= catzRocket.maxDiamondFuel) {
                catzRocket.diamondFuel = catzRocket.maxDiamondFuel / 2;
                catzRocket.catz.gotoAndPlay("frenzy ready");
                catzRocket.rocket.alpha = 0;
                catzRocket.frenzyReady = true;
                catzRocket.isWounded = false;
                catzRocket.frenzyTimer = 0;
            }
        }
    };

    function updateRocketSnake() {
        var arrayLength = catzRocket.rocketSnake.children.length;
        for (var i = arrayLength - 1; i > 0; i--) {
            var kid = catzRocket.rocketSnake.children[i];
            kid.x = catzRocket.rocketSnake.children[i - 1].x - 2 * Math.cos(6.28 * catzRocket.catzRocketContainer.rotation / 360);
            kid.y = catzRocket.rocketSnake.children[i - 1].y;
        }
        if (catzRocket.catzState !== catzRocket.catzStateEnum.SecondDownloop && catzRocket.catzState !== catzRocket.catzStateEnum.Slingshot) {
            catzRocket.rocketSnake.children[0].x = -60 +
                Math.cos((catzRocket.catzRocketContainer.rotation + 101) / 360 * 2 * Math.PI) * 176;
            catzRocket.rocketSnake.children[0].y =
                Math.sin((catzRocket.catzRocketContainer.rotation + 100) / 360 * 2 * Math.PI) * 232 + catzRocket.heightOffset;
            catzRocket.rocketFlame.x = catzRocket.catzRocketContainer.x;
            catzRocket.rocketFlame.y = catzRocket.catzRocketContainer.y;
        } else {
            catzRocket.rocketSnake.children[0].x = -5 +
                Math.cos((catzRocket.catzRocketContainer.rotation + 110) / 360 * 2 * Math.PI) * 100;
            catzRocket.rocketSnake.children[0].y =
                Math.sin((catzRocket.catzRocketContainer.rotation + 110) / 360 * 2 * Math.PI) * 120 + catzRocket.heightOffset;
            catzRocket.rocketFlame.x = catzRocket.catzRocketContainer.x;
            catzRocket.rocketFlame.y = catzRocket.catzRocketContainer.y;
        }
        catzRocket.SnakeLine.graphics = new createjs.Graphics();
        catzRocket.SnakeLine.x = 260;
        catzRocket.SnakeLine.y = 200;
        for (var i = arrayLength - 1; i > 0; i--) {
            var kid = catzRocket.rocketSnake.children[i];
            catzRocket.SnakeLine.graphics.setStrokeStyle(arrayLength * 2 - i * 2, 1);
            catzRocket.SnakeLine.graphics.beginStroke(catzRocket.flameColor);
            catzRocket.SnakeLine.graphics.moveTo(kid.x - i * 5, kid.y);
            catzRocket.SnakeLine.graphics.lineTo(catzRocket.rocketSnake.children[i - 1].x - (i - 1) * 5, catzRocket.rocketSnake.children[i - 1].y);
            catzRocket.SnakeLine.graphics.endStroke();
        }
        catzRocket.rocketFlame.rotation = catzRocket.catzRocketContainer.rotation;

    };

    function showSnake() {
        catzRocket.rocketSnake.children[0].x = -60 +
            Math.cos((catzRocket.catzRocketContainer.rotation + 101) / 360 * 2 * Math.PI) * 176;
        catzRocket.rocketSnake.children[0].y =
            Math.sin((catzRocket.catzRocketContainer.rotation + 100) / 360 * 2 * Math.PI) * 232 + catzRocket.heightOffset;
        catzRocket.rocketFlame.x = catzRocket.rocketSnake.children[0].x;
        catzRocket.rocketFlame.y = catzRocket.rocketSnake.children[0].y;
        catzRocket.rocketFlame.rotation = catzRocket.catzRocketContainer.rotation;

        catzRocket.SnakeLine.alpha = 1;
        catzRocket.rocketFlame.alpha = 1;
        catzRocket.rocketFlame.gotoAndPlay("ignite");
    };

    catzRocket.hideSnake = function() {
        catzRocket.rocketSnake.alpha = 0;
        catzRocket.SnakeLine.alpha = 0;
        catzRocket.rocketFlame.alpha = 0;
    };

    catzRocket.playSecondDownloopSound = function() {
        catzRocket.rocketSound.stop();
        catzRocket.rocketSound = createjs.Sound.play(catzRocket.rocketSounds[
            catzRocket.catzStateEnum.SecondDownloop]);
    };

    catzRocket.catzRelease = function() {
        if (catzRocket.isWounded) {
            catzRocket.isWounded = false;
            catzRocket.catz.x = 0;
        }
        if (catzRocket.catzState !== catzRocket.catzStateEnum.SlammerReady) {
            catzRocket.catzVelocity = Math.tan(catzRocket.catzRocketContainer.rotation * 3.14 / 360) * 40;
            changeState(catzRocket.catzStateEnum.SecondUploop);
        } else {
            changeState(catzRocket.catzStateEnum.Normal);
            catzRocket.catzVelocity = Math.tan(catzRocket.catzRocketContainer.rotation * 3.14 / 360) * 40;
        }
    };

    catzRocket.getHit = function(isInstaGib) {
        if ((invincibilityCounter <= 0 || isInstaGib) && !catzRocket.hasFrenzy() && !catzRocket.isHit) {
            var instance = createjs.Sound.play("catzScream2");
            instance.volume = 0.5;

            if (!catzRocket.isWounded && !isInstaGib) {
                catzRocket.isWounded = true;
                catzRocket.catz.gotoAndPlay("slipping");
                createjs.Tween.get(catzRocket.catz)
                    .to({
                        y: 10,
                        x: -25
                    }, 100)
                    .to({
                        x: -50,
                        y: 5
                    }, 150)
                    .call(catzRocket.catz.gotoAndPlay, ["no shake"]);
                invincibilityCounter = 1000;
                return false;
            } else {
                catzRocket.isHit = true;
                changeState(catzRocket.catzStateEnum.FellOffRocket);
                return true;
            }
        } else {
            return false;
        }
    };

    catzRocket.catzUp = function() {
        if (catzRocket.diamondFuel > 0) {
            if (catzRocket.catzState === catzRocket.catzStateEnum.Normal) {
                catzRocket.diamondFuel -= 0.25;
                catzRocket.catzVelocity -= 2;
                changeState(catzRocket.catzStateEnum.Uploop);
            } else if (catzRocket.catzState === catzRocket.catzStateEnum.Frenzy) {
                catzRocket.catzVelocity -= 2;
                changeState(catzRocket.catzStateEnum.FrenzyUploop);
            } else if (catzRocket.catzState === catzRocket.catzStateEnum.TerminalVelocity) {
                changeState(catzRocket.catzStateEnum.EmergencyBoost);
            } else if (catzRocket.catzState === catzRocket.catzStateEnum.SlammerReady && catzRocket.catzRocketContainer.rotation > -250) {
                changeState(catzRocket.catzStateEnum.Slammer);
            }
        } else {
            //catzRocket.glass.gotoAndPlay("outOfFuel");
        }
    };

    function changeState(state) {
        catzRocket.catzState = state;
        if (state !== catzRocket.catzStateEnum.SlammerReady &&
            state !== catzRocket.catzStateEnum.FrenzyUploop) {
            catzRocket.rocketSound.stop();
            if (catzRocket.rocketSounds[state] !== null) {
                catzRocket.rocketSound = createjs.Sound.play(catzRocket.rocketSounds[state]);
                catzRocket.rocketSound.volume = 0.5;
            }
        }
        if (state === catzRocket.catzStateEnum.Normal || state === catzRocket.catzStateEnum.TerminalVelocity || state === catzRocket.catzStateEnum.OutOfFuel || state === catzRocket.catzStateEnum.OutOfFuelUpsideDown) {
            catzRocket.hideSnake();
            if (catzRocket.frenzyReady || state === catzRocket.catzStateEnum.TerminalVelocity)
                catzRocket.catz.gotoAndPlay("shake");
            else
                catzRocket.catz.gotoAndPlay("no shake");
        } else if (state !== catzRocket.catzStateEnum.FellOffRocket && !catzRocket.hasFrenzy()) {
            if (catzRocket.SnakeLine.alpha === 0)
                showSnake();
            if (!catzRocket.frenzyReady)
                catzRocket.catz.gotoAndPlay("shake");
        } else if (state !== catzRocket.catzStateEnum.FellOffRocket) {
            catzRocket.hideSnake();
            catzRocket.catz.gotoAndPlay("frenzy");
        } else {
            catzRocket.hideSnake();
            catzRocket.catz.gotoAndPlay("flying");
        }
    };

    catzRocket.hasFrenzy = function() {
        if (catzRocket.catzState === catzRocket.catzStateEnum.FrenzyUploop || catzRocket.catzState === catzRocket.catzStateEnum.Frenzy) {
            return true;
        } else {
            return false;
        }
    };

    catzRocket.canCollide = function() {
        return (catzRocket.catzState !== catzRocket.catzStateEnum.FellOffRocket && !catzRocket.hasFrenzy());
    };

    catzRocket.reset = function() {
        createjs.Tween.removeTweens(CatzRocket.catzRocketContainer);
        catzRocket.frenzyReady = false;
        catzRocket.frenzyTimer = 0;
        catzRocket.frenzyCount = 0;
        changeState(catzRocket.catzStateEnum.Normal);
		catzRocket.diamondFuel = 0;        
		catzRocket.rocket.x=0;
        catzRocket.rocket.alpha=1;
		catzRocket.catz.alpha = 1;
//		catzRocket.glass.gotoAndPlay("still");	
		catzRocket.catzRocketContainer.x = 300;
        catzRocket.catzRocketContainer.y = 200;
        catzRocket.heightOffset = 0;
        catzRocket.catzRocketContainer.rotation = 0;
        catzRocket.catz.gotoAndPlay("no shake");
        catzRocket.catzVelocity = -20;
    };

    catzRocket.start = function(velocity) {
        catzRocket.isWounded = false;
        catzRocket.isHit = false;
        catzRocket.isCrashed = false;
        catzRocket.hideSnake();
        CatzRocket.catzVelocity = velocity;	
		catzRocket.diamondFuel = 2;        
	}
     
     catzRocket.catzEndLoop = function() {
        if (catzRocket.catzState === catzRocket.catzStateEnum.Uploop
            || catzRocket.catzState === catzRocket.catzStateEnum.SecondUploop
            || catzRocket.catzState === catzRocket.catzStateEnum.TerminalVelocity 
            || catzRocket.catzState === catzRocket.catzStateEnum.EmergencyBoost)
            changeState(catzRocket.catzStateEnum.Normal);
        else if (catzRocket.catzState === catzRocket.catzStateEnum.SecondDownloop)
            changeState(catzRocket.catzStateEnum.Slingshot);
        else if (catzRocket.catzState === catzRocket.catzStateEnum.Downloop)
            changeState(catzRocket.catzStateEnum.SlammerReady);
        else if (catzRocket.catzState === catzRocket.catzStateEnum.FrenzyUploop)
            changeState(catzRocket.catzStateEnum.Frenzy);
    };
    
    function invincibilityCountDown(minusTime){
        if(invincibilityCounter>0)        
            invincibilityCounter-=minusTime;        
    }

    function invincibilityCountDown(minusTime) {
        if (invincibilityCounter > 0)
            invincibilityCounter -= minusTime;
    }

    function diamondFuelLossPerTime(time) {
        if (catzRocket.diamondFuel > 5)
            catzRocket.diamondFuel -= time / 1000;

        if (catzRocket.diamondFuel > 10)
            catzRocket.diamondFuel -= time / 20;
    };

    return catzRocket;
}());

var Cookie = (function (){
	var co ={},
	hsCookieName = "ohld-highscore",
	sgCookieName = "ohld-save-game";
	function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}
	
	co.saveAndSetHS = function (score){
		var hs = readCookie(hsCookieName);				
		var hsc = $('#hs');				
		if(hsc.attr("aria-valuenow")==-1 && hs){			
			hsc.attr("aria-valuenow", hs);								
			paint(hs);			
		}			
			
		if(!hs || hs < score){		
			hsc.attr("aria-valuenow", hs);						
			paint(score);
			createCookie(hsCookieName, score);			
		}							
	};
	co.load = function(){		
		return JSON.parse(readCookie(sgCookieName));
	}
	
	co.save = function(gs){		
		createCookie(sgCookieName, JSON.stringify(gs));
	}
	return co;
}());
var dialogJSON = {"hoboCat": 
{   
"goodEvening":
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "Good evening", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "Whatcha lookin' at\n\
there, kitten?", "Sound": "hoboCatSound2", "Choice" :false, "NextID":3, "End":false},
        {"Who":"Catz", "What": "diamonds!", "Sound":"catzSound1", "Choice" :false, "NextID":4, "End":false},
        {"Who": "Hobo-Cat", "What": "Heh, kitten what you got\n\
up there is none but \n\
big blobs of gas and fire", "Sound": "hoboCatSound1", "Choice" :false, "NextID":5, "End":true}            
            ], "idle":{"what":"*cough*"}},
"aDiamond":
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "Well I be damned - a diamond!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "For me? \n\
Much obliged, kitten!\n\
Hey, with  20 of these I could\n\
 build myself a house", "Sound": "HoboCatSound1", "Choice" :false, "NextID":3, "End":true, "Triggers": [{Stat:"score", Value: -1}]}                
    ], "idle":{"what":"*cough* better times ahead"}},

"20Diamonds":
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "Well I be damned - look at all those diamonds!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "For me? \n\
Much obliged, kitten!\n\
With these I can\n\
 build myself a house", "Sound": "HoboCatSound1", "Choice" :false, "NextID":3, "End":true, "Triggers": [{Stat:"built", 
Value: "hoboCatHouse"}, {Stat:"score", Value: -21}]}                
    ], "idle":{"what":"homeowners association \n\
here I come!"}},

"hoboCatHouseBuilt":
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "All done!", "Sound": "HoboCatSound1", 
            "Choice" :false, "NextID":1, "Triggers":[{Stat:"built", 
                    Value: "hoboCatHouse"}, {Stat:"score", Value: -20}], "End":true}                
    ], "idle":{"what":"homeowners association \n\
here I come!"}},
        
"orphanage":
{"dialog":[
        {"Who": "Hobo-Cat", "What": "Say there's plenty of\n\
stray kitties in Katholm.\n\
Why don't we build 'em a home?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"no", "ChoiceID":1},{"text":"yes", "ChoiceID":3}]},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "Guess those kittes \n\
gotta fend for themselves", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":4, "Triggers":[{Stat:"built", Value: "orphanage"}, {Stat:"score", Value: -20}, {Stat:"kittensApprovalRating", Value: 0.001}, {Stat:"catPartyApprovalRating", Value: -0.0001}], "End":false},
        {"Who": "Hobo-Cat", "What": "We can start\n\
housing kittens straight away", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5,"End":true},
                {"Who": "Hobo-Cat", "What": "Add as many\n\
bunks as you see fit.\n\
Be aware though,\n\
we gotta afford to pay\n\
the bills", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6,"End":true}
    ], "idle":{"what":"♫ ain't no love \n\
in the heart of the city ♫"}},
        
"rehab":
{"dialog":[
        {"Who": "Hobo-Cat", "What": "There's some old friends\n\
of mine back in Katholm.", "Sound": "HoboCatSound1", "Choice" :false, "NextID": 1, "End":false},
        {"Who": "Hobo-Cat", "What": "They're still\n\
stuck in the hole I've dug myself out of.\n\
Why don't we build a place\n\
for them out here?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"no", "ChoiceID":2},{"text":"yes", "ChoiceID":4}], "End":false},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":3, "End":false},
        {"Who": "Hobo-Cat", "What": "They're on their \n\
own then", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":5, "Triggers":[{Stat:"built", Value: "rehab"}, {Stat:"score", Value: -20}, {Stat:"villagersApprovalRating", Value: -0.001}, {Stat:"catPartyApprovalRating", Value: -0.0002}], "End":false},
        {"Who": "Hobo-Cat", "What": "Add some beds\n\
and I'll lead them through\n\
all twelve steps to\n\
a better life", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true}
    ], "idle":{"what":"♫ I've seen the catnip\n\
and the damage done ♫"}},


"school":
{"dialog":[
        {"Who": "Hobo-Cat", "What": "Kittens need schoolin'\n\
but tuition fees at \n\
Cat King Collage\n\
are too high for most.", "Sound": "HoboCatSound1", "Choice" :false, "NextID": 1, "End":false},
        {"Who": "Hobo-Cat", "What": "Why don't we \n\
found a university. \n\
funny hats and \n\
titles for all!", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"no", "ChoiceID":2},{"text":"yes", "ChoiceID":4}], "End":false},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":3, "End":false},
        {"Who": "Hobo-Cat", "What": "How they gonna get\n\
schooled now?", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":5, "Triggers":[{Stat:"built", Value: "university"}, {Stat:"score", Value: -20}, {Stat:"catPartyApprovalRating", Value: -0.0005}], "End":false},
        {"Who": "Hobo-Cat", "What": "You got some time to\n\
teach in between those\n\
rocket rides, right kitten?", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true}        
    ], "idle":{"what":"vetenskap och konst"}},

"hospital":
{"dialog":[{"Who": "Hobo-Cat", "What": "Let's make the catnip rehab center\n\
a full blown hospital!", "Choice":true, "Choices":[{"text":"no", "ChoiceID":1},{"text":"yes", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Hobo-Cat", "What": "better stay healthy\n\
then...", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"rehab",Value: "hospital"}, {Stat:"score", Value: -20}, {Stat:"villagersApprovalRating", Value: 0.001}, {Stat:"catPartyApprovalRating", Value: -0.0008}], "End":false},
                {"Who": "Hobo-Cat", "What": "medical care for all cats!", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"I feel healthier already"}},

"psyciatricWing":
{"dialog":[{"Who": "Hobo-Cat", "What": "We should add better\n\
support for care for\n\
the mentally ill \n\
at the hospital.", "Choice":true, "Choices":[{"text":"no", "ChoiceID":1},{"text":"yes", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Hobo-Cat", "What": "better stay sane\n\
then...", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"rehab",Value: "phychiatricWing"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Hobo-Cat", "What": "A new wing has been added\n\
to the hospital", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"Gonna take a stroll in \n\
that fancy new garden"}},
        
"insufficientFunds":
{"dialog":[{"Who": "Hobo-Cat", "What": "Can't make rent", "Choice":false, "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false}
                ],                 
            "idle":{"what":"harsh times"}}
    },
"timmy": {
   
    "youthCenter":
    {"dialog":[{"Who": "Timmy", "What": "can haz youth center for stray kitties?", "Choice":true, "Choices":[{"text":"no", "ChoiceID":1},{"text":"yes", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": "oh no", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"orphanage", Value: "youthCenter"}, {Stat:"score", Value: -20}, {Stat:"kittensApprovalRating", Value: 0.0015}], "End":false},
                {"Who": "Timmy", "What": "yay!", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"can i have some more?"}},
    
    "summerCamp":
    {"dialog":[{"Who": "Timmy", "What": "can haz summer camp for stray kitties?", "Choice":true, "Choices":[{"text":"no", "ChoiceID":1},{"text":"yes", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": "oh no", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"orphanage",Value: "summerCamp"}, {Stat:"score", Value: -20}, {Stat:"kittensApprovalRating", Value: 0.002}], "End":false},
                {"Who": "Timmy", "What": "hurray!", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"can i please some more?"}},
    
    "rocketUniversity":
    {"dialog":[{"Who": "Timmy", "What": "i can be rocketeer too?", "Choice":true, "Choices":[{"text":"there can be only one", "ChoiceID":1},{"text":"i'll teach you all I know", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": "oh no", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"university",Value: "rocketUniversity"}, {Stat:"score", Value: -20}, {Stat:"catPartyApprovalRating", Value: -0.002}, {Stat:"kittensApprovalRating", Value: 0.003}], "End":false},
                {"Who": "Timmy", "What": "i'll enroll to the Catz Rocket Institute Rocketeer Program asap", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"the final frontier"}}},

"priest": {
   
    "monastary":
    {"dialog":[{"Who": "Priest", "What": "I see you have a home for\n\
cats a stray from the flock.", "Choice":false, "NextID":1, "End":false},
                {"Who": "Priest", "What": "When they turned to katnip\n\
they turned away from the cat God.", "Choice":false, "NextID":2, "End":false},
                {"Who": "Catz", "What": "meow?", "Choice":false, "NextID":3, "End":false},
                {"Who": "Priest", "What": "With the help of my congregation\n\
we can lead them back to the\n\
rightous path.", "Choice":true, "Choices":[{"text":"no", "ChoiceID":4},{"text":"yes", "ChoiceID":6}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":5, "End":false},
                {"Who": "Priest", "What": "may the Cat God forgive you", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":7, "Triggers":[{"Stat":"addOn", "Building":"rehab", Value: "monastery"}, {Stat:"score", Value: 20}, {Stat:"villagersApprovalRating", Value: 0.001}], "End":false},
                {"Who": "Priest", "What": "Excellent! Please take this\n\
small gift as a token\n\
of the Lords apprication.", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"blessings upon ye, child of the cat God"}}}
};
diamondConstellation = 
    [
{"x":	156		,"y":	80	,"frame": 	0	,"scale":	0.3	},
{"x":	198		,"y":	195	,"frame": 	5	,"scale":	0.35	},
{"x":	101		,"y":	168	,"frame": 	10	,"scale":	0.4	},
{"x":	134		,"y":	233	,"frame": 	15	,"scale":	0.45	},
{"x":	254		,"y":	80	,"frame": 	20	,"scale":	0.3	},
{"x":	271		,"y":	131	,"frame": 	1	,"scale":	0.35	},
{"x":	288		,"y":	184	,"frame": 	6	,"scale":	0.4	},
{"x":	229		,"y":	90	,"frame": 	11	,"scale":	0.45	},
{"x":	229		,"y":	139	,"frame": 	16	,"scale":	0.3	},
{"x":	228		,"y":	190	,"frame": 	21	,"scale":	0.35	},
{"x":	410		,"y":	81	,"frame": 	2	,"scale":	0.4	},
{"x":	430		,"y":	184	,"frame": 	7	,"scale":	0.45	},
{"x":	496		,"y":	169	,"frame": 	12	,"scale":	0.3	},
{"x":	560		,"y":	97	,"frame": 	17	,"scale":	0.35	},
{"x":	586		,"y":	53	,"frame": 	22	,"scale":	0.4	},
{"x":	629		,"y":	123	,"frame": 	3	,"scale":	0.45	},
{"x":	594		,"y":	171	,"frame": 	8	,"scale":	0.3	},
{"x":	500		,"y":	78	,"frame": 	13	,"scale":	0.35	},
{"x":	470		,"y":	127	,"frame": 	18	,"scale":	0.4	},
{"x":	515		,"y":	175	,"frame": 	23	,"scale":	0.45	},
{"x":	557		,"y":	140	,"frame": 	4	,"scale":	0.3	},
{"x":	662		,"y":	84	,"frame": 	9	,"scale":	0.35	},
{"x":	650		,"y":	133	,"frame": 	14	,"scale":	0.4	},
{"x":	711		,"y":	113	,"frame": 	19	,"scale":	0.45	},
{"x":	637		,"y":	185	,"frame": 	0	,"scale":	0.3	},
{"x":	730		,"y":	173	,"frame": 	5	,"scale":	0.35	},
{"x":	142		,"y":	252	,"frame": 	10	,"scale":	0.4	},
{"x":	170		,"y":	370	,"frame": 	15	,"scale":	0.45	},
{"x":	236		,"y":	328	,"frame": 	20	,"scale":	0.3	},
{"x":	403		,"y":	266	,"frame": 	1	,"scale":	0.35	},
{"x":	456		,"y":	363	,"frame": 	6	,"scale":	0.4	},
{"x":	421		,"y":	235	,"frame": 	11	,"scale":	0.45	},
{"x":	252		,"y":	257	,"frame": 	16	,"scale":	0.3	},
{"x":	251		,"y":	363	,"frame": 	21	,"scale":	0.35	},
{"x":	316		,"y":	255	,"frame": 	2	,"scale":	0.4	},
{"x":	282		,"y":	328	,"frame": 	7	,"scale":	0.45	},
{"x":	272		,"y":	353	,"frame": 	12	,"scale":	0.3	},
{"x":	337		,"y":	298	,"frame": 	17	,"scale":	0.35	},
{"x":	383		,"y":	379	,"frame": 	22	,"scale":	0.4	},
{"x":	363		,"y":	279	,"frame": 	3	,"scale":	0.45	},
{"x":	380		,"y":	230	,"frame": 	8	,"scale":	0.3	},
{"x":	702		,"y":	386	,"frame": 	13	,"scale":	0.35	},
{"x":	718		,"y":	361	,"frame": 	18	,"scale":	0.4	},
{"x":	595		,"y":	325	,"frame": 	23	,"scale":	0.45	},
{"x":	564		,"y":	240	,"frame": 	4	,"scale":	0.3	},
{"x":	549		,"y":	339	,"frame": 	9	,"scale":	0.35	},
{"x":	591		,"y":	240	,"frame": 	14	,"scale":	0.4	},
{"x":	612		,"y":	249	,"frame": 	19	,"scale":	0.45	},
{"x":	639		,"y":	384	,"frame": 	0	,"scale":	0.3	},
{"x":	696		,"y":	360	,"frame": 	5	,"scale":	0.35	},
{"x":	710		,"y":	253	,"frame": 	10	,"scale":	0.4	},
{"x":	677		,"y":	285	,"frame": 	15	,"scale":	0.45	},
{"x":	479		,"y":	234	,"frame": 	20	,"scale":	0.3	},
{"x":	451		,"y":	267	,"frame": 	1	,"scale":	0.35	},
{"x":	538		,"y":	281	,"frame": 	6	,"scale":	0.4	},
{"x":	494		,"y":	338	,"frame": 	11	,"scale":	0.45	}

];


var GameLogic = (function() {
        var
            gameLogic = {},
            clipBoard,
            clipOffset = 0,
            levelLength = 13000,
            cloudSpeed,
            diSpeed,
            fgSpeed,
            jump,
            mousedown,
            parallaxSpeed,
            track,
            tracks,
            trackParts,
            cloudIsIn = new Array(),
            currentDisplacement = 0,
            currentLevel = 0,
            currentTrack = 0,
            directorTimer = 0,
            grav = 12,
            lastResolveNorm = [1, 0],
            onTrack = false,
            selectBox = {
                rect: null,
                graphic: null
            },
            scrollBar = {
                bar: null,
                slider: null,
                cont: new createjs.Container()
            },
            selectPosOnStartDrag = {
                x: null,
                y: null
            },
            trackTimer = 0,
            wind = 0,
            zoomOut = false,
            zooming = false,
            fuelBlinkTimer = 0,
            containerDict = {
                "diamond": cont.diamond,
                "greatDiamond": cont.diamond,
                "attackBird": cont.attackBird,
                "thunderCloud": cont.thunder
            },
            levelViewScale = 1,
            directorStateEnum = {
                Normal: 0,
                Birds: 1,
                Wind: 2,
                Thunder: 3
            },
            levelDesignConts = [cont.diamond,
                cont.thunder,
                cont.attackBird
            ],

            directorState = directorStateEnum.Normal;

        gameLogic.timeAdjust = function(event) {
            if (event.delta > 0.05) {
                event.delta = 0.05;
            }
        }

        gameLogic.houseTick = function(event) {
            //       gameLogic.timeAdjust(event);
            $('.odometer').html(gameStats.score);
            stage.update();
            if (House.characterSpeach.alpha > 0)
                House.characterSpeach.alpha -= 0.015;

            if (House.catzSpeach.alpha > 0)
                House.catzSpeach.alpha -= 0.015;

            debugText.text = +"\nHoboDialogNo: " + House.hoboDialogNumber + "\nbg.y: " + bg.y;
        }

        gameLogic.update = function(event) {
            //        gameLogic.timeAdjust(event);
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
                if (debugOptions.infiniteFuel && CatzRocket.diamondFuel < 1)
                    CatzRocket.diamondFuel = 1;
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

        gameLogic.SetObjectEventListeners = function(turnOn) {
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

        gameLogic.DeleteSelected = function() {
            cont.select.removeAllChildren();
            stage.update();
        }

        gameLogic.DeleteAll = function() {
            GameLogic.SelectedCont.removeAllChildren();
        }

        gameLogic.CutCopy = function(isCopy) {
            clipBoard = [];
            clipOffset = 0;
            var clipLeftMost = levelLength;
            var clipRightMost = 0;
            for (var i = cont.select.children.length - 1; i >= 0; i--) {
                kid = cont.select.children[i];
                kid.x -= cont.select.x;
                kid.y -= cont.select.y;
                clipBoard.push(createClone(kid));
                clipRightMost = Math.max(cont.select.children[i].x, clipRightMost);
                clipLeftMost = Math.min(cont.select.children[i].x, clipLeftMost);
            };
            if (isCopy) {
                clipOffset = clipRightMost - clipLeftMost + 50;
            } else {
                gameLogic.DeleteSelected();
            }
            stage.update();
        }

        gameLogic.Paste = function() {
            moveChildrenFromSelectedToObjCont();
            for (var i = clipBoard.length - 1; i >= 0; i--) {
                clipBoard[i].x += clipOffset;
                var clone = createClone(clipBoard[i]);
                clone.alpha = 0.5;
                cont.select.addChild(clone);
            };
            stage.update();
        }

        gameLogic.StartPressMove = function(evt) {
            selectPosOnStartDrag.x = evt.stageX / levelViewScale - cont.select.x;
            selectPosOnStartDrag.y = evt.stageY / levelViewScale - cont.select.y;
        }

        gameLogic.PressMove = function(evt) {
            evt.currentTarget.x = evt.stageX / levelViewScale - selectPosOnStartDrag.x;
            evt.currentTarget.y = evt.stageY / levelViewScale - selectPosOnStartDrag.y;
            stage.update();
        }

        gameLogic.CreateSelectBox = function(evt) {
            levelViewScale = gameView.scaleX;
            moveChildrenFromSelectedToObjCont();
            selectBox.rect.setValues(evt.stageX / levelViewScale, (evt.stageY - gameView.y) / levelViewScale, 1, 1);
            selectBox.graphic.graphics.clear();
            selectBox.graphic.graphics.setStrokeStyle(1);
            gameView.addChild(selectBox.graphic);
            drawSelectBox();
        }

        gameLogic.DragBox = function(evt) {
            selectBox.graphic.graphics.clear();
            selectBox.rect.width = evt.stageX / levelViewScale - selectBox.rect.x;
            selectBox.rect.height = (evt.stageY - gameView.y) / levelViewScale - selectBox.rect.y;
            drawSelectBox();
        }

        gameLogic.SelectWithBox = function(evt) {
            //remove selected items not in the box
            moveChildrenFromSelectedToObjCont();
            //add items in the box
            for (var i = levelDesignConts.length - 1; i >= 0; i--) {
                var container = levelDesignConts[i];
                for (var j = container.children.length - 1; j >= 0; j--) {
                    kid = container.getChildAt(j);
                    kid.on("mousedown", selectItem);
                    if (helpers.isInRectangle(kid.x, kid.y, selectBox.rect)) {
                        cont.select.addChild(kid);
                    }
                };
            };
            if (cont.select.numChildren === 0) {

                selectBox.graphic.graphics.clear();
            } else {
                selectBox.graphic.graphics.clear();
                cont.select.alpha = 0.5;
            }
            stage.update();
        }

        function createClone(object) {
            var clone = object.clone(true);
            setupObjEvents(clone);
            return clone;
        }

        function selectItem(evt) {
            if (evt.currentTarget.parent !== cont.select) {
                moveChildrenFromSelectedToObjCont();
                cont.select.addChild(evt.currentTarget);
                gameLogic.StartPressMove(evt);
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
            for (i = types.length - 1; i >= 0; i--) {
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
            scrollBar.bar = helpers.createRectangle(800, height, "#ffffcc", {
                y: 450 - height
            });
            var sliderWidth = 800/(levelLength);
            scrollBar.slider = helpers.createRectangle(sliderWidth, height, "#1f1f1f", {
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
            for (var i = cont.select.numChildren - 1; i >= 0; i--) {
                var kid = cont.select.getChildAt(i);
                kid.x += cont.select.x;
                kid.y += cont.select.y;
                kid.alpha = 1;
                var objCont = containerDict[getObjType(kid)];
                objCont.addChild(kid);
            };
            cont.select.x = 0;
            cont.select.y = 0;
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

        gameLogic.CreateThunderCloud = function() {
            var kid = spawnThunderCloud(800, CatzRocket.catzRocketContainer.y);
            if (createjs.Ticker.paused) {
                setupObjEvents(kid);
            }
            stage.update();
        }

        gameLogic.CreateSeagull = function() {
            var kid = spawnAttackBird("seagull", 800, CatzRocket.catzRocketContainer.y);
            if (createjs.Ticker.paused) {
                setupObjEvents(kid)
            }
            stage.update();
        }

        gameLogic.CreateGreatDiamond = function() {
            var kid = helpers.createSprite(dataDict["greatDiamond"], "greatCycle", {
                x: 800,
                y: CatzRocket.catzRocketContainer.y
            });
            cont.diamond.addChild(kid);
            if (createjs.Ticker.paused) {
                setupObjEvents(kid);
            }
            stage.update();;
        }

        gameLogic.CreateDiamond = function() {
            var kid = helpers.createSprite(dataDict["diamond"], "cycle", {
                x: 800,
                y: CatzRocket.catzRocketContainer.y
            });
            cont.diamond.addChild(kid);
            if (createjs.Ticker.paused) {
                setupObjEvents(kid);
            }
            stage.update();
        }

        function updateWorldContainer(event) {
            var zoomDuration = 1000;
            var zoomOutLimit = 0.37;

            if ((!createjs.Tween.hasActiveTweens(gameView) && !createjs.Tween.hasActiveTweens(bg) && !createjs.Tween.hasActiveTweens(cont.star)) && !CatzRocket.isCrashed) {
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

                    createjs.Tween.get(cont.star)
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

                    createjs.Tween.get(cont.star)
                        .to({
                            scaleX: 1,
                            scaleY: 1
                        }, zoomDuration, createjs.Ease.linear);
                }
            }

            var catzCameraPos = Math.min(CatzRocket.catzRocketContainer.y, 200);
            var zoomPercent = (gameView.scaleY - zoomOutLimit) / (1 - zoomOutLimit);
            bg.y = (-1100 - catzCameraPos / 3) * zoomPercent - 200 * (1 - zoomPercent);
            cont.star.y = (100 - catzCameraPos / 3) * zoomPercent - 270 * (1 - zoomPercent);
            gameView.y = (200 - catzCameraPos) * zoomPercent + 300 * (1 - zoomPercent);
        }

        function updateParallax(event) {
            for (var i = 0, arrayLength = cont.parallax.children.length; i < arrayLength; i++) {
                var kid = cont.parallax.children[i];
                if (kid.x <= -2460)
                    kid.x = 2460;
                kid.x = kid.x - parallaxSpeed * event.delta / 10;
            }
        }

        function updateFg(event) {
            if (Math.random() > 0.98) {
                var tree = helpers.createBitmap(queue.getResult("fgTree1"), {
                    x: 2200,
                    y: 290
                });
                cont.fg.addChild(tree);
            }
            for (var i = 0, arrayLength = cont.fg.children.length; i < arrayLength; i++) {
                var kid = cont.fg.children[i];
                if (kid.x <= -3200)
                    kid.x += 6000;
                kid.x = kid.x - fgSpeed * event.delta / 10;
                if ((CatzRocket.catzRocketContainer.x - catzBounds.width) < (kid.x) && CatzRocket.catzRocketContainer.x >
                    kid.x && (CatzRocket.catzRocketContainer.y - catzBounds.height) < kid.y && CatzRocket.catzRocketContainer.y > kid.y) {
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
                if (cont.fg.children[3].x < -100)
                    cont.fg.removeChildAt(3);
            }

            if (leaves.alpha === 1)
                leaves.x -= fgSpeed * event.delta / 20;
        }

        function updateFgTop(event) {
            for (var i = 0, arrayLength = cont.fgTop.children.length; i < arrayLength; i++) {
                var kid = cont.fgTop.children[i];
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
            var cloud = new Cloud(queue.getResult(cloudtype));
            cloud.scaleX = scale;
            cloud.scaleY = scale;
            cloud.x = 2200;
            cloud.y = Math.floor(Math.random() * 1000 - 1000);
            cloud.catzIsInside = false;
            cont.cloud.addChild(cloud);
        }

        function updateClouds(event) {
            if (Math.random() > 0.97) {
                spawnCloud()
            }
            for (var i = 0, arrayLength = cont.cloud.children.length; i < arrayLength; i++) {
                var kid = cont.cloud.children[i];
                kid.x -= cloudSpeed;
                if (kid.x <= -500) {
                    cont.cloud.removeChildAt(i);
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
                    ((CatzRocket.catzRocketContainer.x - catzBounds.width / 2) > (kid.x + rect.width * kid.scaleX) || CatzRocket.catzRocketContainer.y - catzBounds.height / 2 > (kid.y + rect.height * kid.scaleY) || (CatzRocket.catzRocketContainer.y + catzBounds.height < kid.y))) {
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
            var cloud = new ThunderCloud(queue.getResult(cloudtype));
            cloud.scaleX = scale;
            cloud.scaleY = scale;
            cloud.x = xPos;
            cloud.y = yPos;
            cloud.filters = [new createjs.ColorFilter(0.3, 0.3, 0.3, 1, 0, 0, 55, 0)];
            var rect = cloud.getBounds();
            cloud.cache(rect.x, rect.y, rect.width, rect.height);
            cont.thunder.addChild(cloud);
            return cloud;
        }

        function updateThunderClouds(event) {
            for (var i = 0, arrayLength = cont.thunder.children.length; i < arrayLength; i++) {
                var kid = cont.thunder.children[i];
                kid.x -= cloudSpeed;
                if (kid.x <= -500) {
                    cont.thunder.removeChildAt(i);
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
                    for (var i = 0, max = cont.attackBird.children.length; i < max; i++) {
                        var bird = cont.attackBird.children[i];
                        if (bird.x < (kid.x + rect.width * kid.scaleX + 50) && bird.x > kid.x - 100 && bird.y < CatzRocket.catzRocketContainer.y && bird.y > kid.y + 50) {
                            birdHit = true;
                            bird.setGrilled();
                            break;
                            spotX = bird.x;
                            spotY = bird.y;
                        }
                    }
                    if (!birdHit) {
                        if (!debugOptions.godMode) {
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
                    cont.lightning.addChild(lightning);
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
            cont.parallax.removeAllChildren();
            var name = "bgParallax " + int;
            var bgParallax = helpers.createBitmap(queue.getResult(name), {
                y: -200
            });
            var bgParallax2 = helpers.createBitmap(queue.getResult(name), {
                x: 2460,
                y: -200
            });

            if (currentLevel === 1) {
                bgParallax.y = 100;
                bgParallax2.y = 100;
            }
            cont.parallax.addChild(bgParallax, bgParallax2);
        }

        function generateTrack() {
            var result = [];
            var displacementX = 2200;
            if (gameStats.Difficulty >= 0) {
                for (j = 0,
                    max1 = gameLogic.tracks[currentLevel][currentTrack].length; j < max1; j++) {
                    var element = $.extend(true, [], gameLogic.trackParts[gameLogic.tracks[currentLevel][currentTrack][j].difficulty][gameLogic.tracks[currentLevel][currentTrack][j].name]);
                    for (i = 0,
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
                if (cont.diamond.getNumChildren() === 0) {
                    onTrack = false;
                    if (gameLogic.tracks[currentLevel].length === currentTrack) {
                        currentTrack = 0;
                        currentLevel++;
                        if (gameLogic.tracks.length === currentLevel)
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
                    for (i = 0,
                        max = track.length; i < max; i++) {
                        if (track[i].graphicType === "thunderCloud") {
                            spawnThunderCloud(track[i].x, track[i].y - 200);
                        } else if (track[i].graphicType === "sprite") {
                            var sprite = helpers.createSprite(dataDict[track[i].type], track[i].animation, {
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
            switch (directorState) {
                case directorStateEnum.Normal:
                    break;
                case directorStateEnum.Birds:
                    var rand = Math.random();
                    var y;
                    if (rand > 0.99) {
                        y = Math.random() * 700 - 500;
                        spawnGoose(1000, y);
                        for (var i = 1; i < 6; i++) {
                            spawnGoose(1000 + 50 * i, y + i * 50);
                            spawnGoose(1000 + 50 * i, y - i * 50);
                        }
                    } else if (rand > 0.98) {
                        y = Math.random() * 700 - 500;
                        for (var i = 0; i < 10; i++) {
                            spawnGoose(1000 + 100 * i, y);
                        }
                    } else if (rand > 0.97) {
                        spawnSeagull(1000, -500 + Math.random() * 700);
                        spawnSeagull(1000, -500 + Math.random() * 700);
                    }
                    break;
                case directorStateEnum.Thunder:
                    var rand = Math.random();
                    if (rand > 0.98) {
                        spawnThunderCloud(1000, Math.floor(Math.random() * 1000 - 1000));
                    }
                    break;
                case directorStateEnum.Wind:
                    var rand = Math.random();
                    if (rand > 0.98) {
                        upWind();
                    } else if (rand > 0.96) {
                        downWind();
                    }
                    break;
            }
            if (directorTimer > 7000) {
                noWind();
                directorState = 0;
                directorTimer = 0;
            }
        }

        function updateOnlookers(event) {
            var arrayLength = cont.onlooker.children.length;
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
                    var hill = helpers.createBitmap(queue.getResult(variant), {
                        y: 95
                    });
                    oCont.addChild(onlooker, hill);
                    cont.onlooker.addChild(oCont);
                }

                var onlooker;
                if (Math.random() > 1 - gameStats.kittensApprovalRating) {
                    onlooker = helpers.createSprite(SpriteSheetData.onlookers, "orphans", {});
                    addOnlooker(onlooker);
                }
                if (Math.random() < -gameStats.catPartyApprovalRating) {
                    onlooker = helpers.createSprite(SpriteSheetData.onlookers, "cat party", {});
                    addOnlooker(onlooker);
                }
                if (Math.random() < -gameStats.villagersApprovalRating) {
                    onlooker = helpers.createSprite(SpriteSheetData.onlookers, "angry mob", {});
                    addOnlooker(onlooker);
                }
                if (Math.random() > 1 - gameStats.villagersApprovalRating) {
                    onlooker = helpers.createSprite(SpriteSheetData.onlookers, "loving mob", {});
                    addOnlooker(onlooker);
                }
            }

            for (var i = 0; i < arrayLength; i++) {
                var oC = cont.onlooker.children[i];
                oC.x -= diSpeed / 2 * event.delta;
                if (oC.x <= -400) {
                    cont.onlooker.removeChildAt(i);
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
            for (var i = 0, arrayLength = cont.diamond.children.length; i < arrayLength; i++) {
                var kid = cont.diamond.children[i];
                kid.x -= diSpeed * event.delta;
                if (kid.x <= -100) {
                    cont.diamond.removeChildAt(i);
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
                        cont.diamond.removeChildAt(i);
                        arrayLength -= 1;
                        i -= 1;
                        var instance = createjs.Sound.play("diamondSound");
                        instance.volume = 0.15;
                    }
                }
            }
        }

        /*function updateScatterDiamonds(event){
            if(currentTrack<2)
                var thres = 0.95;        
            else if(currentTrack<4)
                thres = 0.90;        
            else if(currentTrack<6)
                thres = 0.8;       
            else
                thres = 0.7;
            
            if(Math.random()>thres){
                var diamond = helpers.createSprite(SpriteSheetData.diamond, "cycle", 
                    {x:800, y:Math.pow(35*Math.random(),2)-1000, scaleX:0.75, scaleY:0.75});                                                
                scatterDiamondsCont.addChild(diamond);
            }        
            for (var i = 0, arrayLength = scatterDiamondsCont.children.length; i < arrayLength; i++) {
                var kid = scatterDiamondsCont.children[i];
                kid.x -= diSpeed*event.delta;    
                if (kid.x <= -100){
                  scatterDiamondsCont.removeChildAt(i);
                  arrayLength -= 1;
                  i -= 1;
                }                               
                if(overlapCheckCircle(kid.x,kid.y,40)){
                    gameStats.score += 1;
                    CatzRocket.frenzyCount+=7.5;
                    arrayLength = arrayLength - 1;
                    diamondSound.play();
                    CatzRocket.diamondFuel +=1;
                    scatterDiamondsCont.removeChildAt(i);
                }
            }   
        }*/

        function upWind() {
            wind = -0.73 * grav;
            cont.wind.removeAllChildren();
            var windSprite1 = helpers.createSprite(SpriteSheetData.wind, "cycle", {
                x: 50,
                y: 50,
                scaleX: -1,
                scaleY: -1,
                rotation: 10
            });
            var windSprite2 = helpers.createSprite(SpriteSheetData.wind, "cycle", {
                x: 200,
                y: 300,
                scaleX: -1,
                scaleY: -1,
                rotation: 10
            });
            var windSprite3 = helpers.createSprite(SpriteSheetData.wind, "cycle", {
                x: 500,
                y: 300,
                scaleX: -1,
                scaleY: -1,
                rotation: 10
            });
            cont.wind.addChild(windSprite1, windSprite2, windSprite3);
        }

        function downWind() {
            wind = 2 * grav;
            cont.wind.removeAllChildren();
            var windSprite1 = helpers.createSprite(SpriteSheetData.wind, "cycle", {
                x: 50,
                y: 50,
                rotation: 10
            });
            var windSprite2 = helpers.createSprite(SpriteSheetData.wind, "cycle", {
                x: 270,
                y: 170,
                rotation: 10
            });
            var windSprite3 = helpers.createSprite(SpriteSheetData.wind, "cycle", {
                x: 700,
                y: 400,
                rotation: 10
            });

            cont.wind.addChild(windSprite1, windSprite2, windSprite3);
        }

        function noWind() {
            wind = 0;
            cont.wind.removeAllChildren();
        }

        function spawnAttackBird(type, x, y) {
            var attackBird = new AttackBird(new createjs.SpriteSheet(SpriteSheetData.enemybirds), type);
            attackBird.x = x;
            attackBird.y = y;
            if (type === "duck") {
                attackBird.scaleX = -attackBird.scaleX;
            }
            cont.attackBird.addChild(attackBird);
            cont.collisionCheckDebug.addChild(attackBird.shape);
            return attackBird;
        }

        function updateAttackBird(event) {
            for (var i = 0, arrayLength = cont.attackBird.children.length; i < arrayLength; i++) {
                var kid = cont.attackBird.children[i];
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
            var h = (catzBounds.height / 2);
            var w = (catzBounds.width / 2);
            catzVertices[0].x = x - w * c - h * s;
            catzVertices[0].y = y + h * c - w * s;
            catzVertices[1].x = x - w * c + h * s;
            catzVertices[1].y = y - h * c - w * s;
            catzVertices[2].x = x + w * c + h * s;
            catzVertices[2].y = y - h * c + w * s;
            catzVertices[3].x = x + w * c - h * s;
            catzVertices[3].y = y + h * c + w * s;

            catzNorm[0].x = (catzVertices[0].y - catzVertices[1].y) / catzBounds.height;
            catzNorm[0].y = (catzVertices[1].x - catzVertices[0].x) / catzBounds.height;
            catzNorm[1].x = (catzVertices[1].y - catzVertices[2].y) / catzBounds.width;
            catzNorm[1].y = (catzVertices[2].x - catzVertices[1].x) / catzBounds.width;

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
            if (!debugOptions.godMode && CatzRocket.getHit(false))
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
            cont.lightning.removeAllChildren();
            cont.attackBird.removeAllChildren();
            cont.diamond.removeAllChildren();
            cont.onlooker.removeAllChildren();
            setParallax(currentLevel);
            directorState = directorStateEnum.Normal;
            noWind();
            updatePointer();
            bg.y = -1200;
            bg.scaleX = 1;
            bg.scaleY = 1;
            cont.star.y = 0;
            cont.star.scaleX = 1;
            cont.star.scaleY = 1;
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

        function updateAndStartHouseView() {
            stage.addChild(House.houseView);
            House.subtractedDiamondCont.removeAllChildren();
            House.removeCharacterEvents();

            houseListener = createjs.Ticker.on("tick", gameLogic.houseTick, this);
            House.deactivateWick();
            createjs.Tween.removeTweens(House.houseView);
            if (debugOptions.trustFund && gameStats.score < 20000)
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
                    House.activateWick(gameLogic.gotoGameView);
                }))
                .call(House.addCharacterEvents);

            if (CatzRocket.isHit)
                House.gotoHouseViewWithoutRocket();
            else
                House.gotoHouseViewWithRocket();

        }

        function crash() {
            var instance = createjs.Sound.play("catzRocketCrash");
            instance.volume = 0.5;

            resetGameView();
            if (debugOptions.noHouseView) {
                gameLogic.gotoGameView();
            } else {
                updateAndStartHouseView();
            }
            CatzRocket.reset();
            updatePointer();
            stage.update();
        }

        gameLogic.gotoGameView = function() {
            initScrollBar();
            initSelectBox();
            gameStats.score = 0;
            gameStats.currentRound += 1;
            zoomOut = false
            if (!debugOptions.noHouseView) {
                House.cricketsSound.stop();
                stage.removeChild(House.houseView);
                createjs.Ticker.off("tick", houseListener);
                if (rocketSong.getPosition() < 100)
                    rocketSong.play({
                        loop: -1
                    });
            }
            //if song hasn't started yet            
            if (!debugOptions.debugMode) {
                cont.collisionCheckDebug.alpha = 0;
                debugText.alpha = 0;
            }
            stage.addChild(gameView, cont.wind,
                //muteButton, 
                //hud, hudPointer, CatzRocket.glass, 
                diamondCounterText, debugText, scrollBar.cont);
            //       muteButton.x=645;             
            gameListener = createjs.Ticker.on("tick", GameLogic.update, this);
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
            GameLogic.jump = false;
            gameLogic.paused = false;

            if (!gameStats.hasBeenFirst.round) {
                gameStats.hasBeenFirst.round = true;
            }
            stage.update();
        }

        return gameLogic;
    }
    ());

var gameProgressionJSON = {"hoboCat": 
    [
		//0
		{"Conditions":[{"ConditionType": "Score","Score": -1, "OperatorType": "LargerThan"}],                
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": "goodEvening"
        },
	
		//1
        {"Conditions":[{"ConditionType": "Score","Score": 20, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building": "hoboCatHouse", "on":false}],                
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": "20Diamonds"
        },
        //2
        {"Conditions":[{"ConditionType": "Score","Score": 0, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building": "hoboCatHouse", "on":false}],                
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": "aDiamond"
        },                
        //3
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
                {"ConditionType": "buildingState", "state": "built", "building": "hoboCatHouse", "on":false}],                
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": "hoboCatHouseBuilt"
        },
		//4
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},           
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":false},            
            {"ConditionType": "buildingState", "state": "built", "building":"hoboCatHouse", "on":true}],               
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": "orphanage"
        },
        //4
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"rehab", "on":false},            
            {"ConditionType": "buildingState", "state": "built", "building":"hoboCatHouse", "on":true}],                
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": "rehab"
        },                
        //5
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"university", "on":false},
                {"ConditionType": "buildingState", "state": "built", "building":"rehab", "on":true},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true}],                
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": "school"
        },                
        //6
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built","building":"rehab", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"rehab", "on":2},
            {"ConditionType": "buildingState", "state": "hospital", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "monastery", "building":"rehab", "on":false}],                
        "ShouldReoccur":false,
        "Chance":0.3,
        "ConversationNumber": "hospital"
        },
        //7
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built","building":"rehab", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"rehab", "on":4},
            {"ConditionType": "buildingState", "state": "phychiatricWing", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "hopspital", "building":"rehab", "on":true}],                
        "ShouldReoccur":false,
        "Chance":0.3,
        "ConversationNumber": "psyciatricWing"
        }
    ],
    "timmy": [
    {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"orphanage", "on":2},
            {"ConditionType": "buildingState", "state": "youthCenter", "building":"orphanage", "on":false}],                    
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": "youthCenter"
    },
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"orphanage", "on":4},
            {"ConditionType": "buildingState", "state": "youthCenter", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "summerCamp", "building":"orphanage","on":false}],        
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": "summerCamp"
        },
    
    {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"university", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"university", "on":5}],        
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": "rocketUniversity"
        }
    ],
    "priest": [
        {"Conditions":[
            {"ConditionType": "buildingState", "state": "built", "building":"rehab", "on":true},            
            {"ConditionType": "buildingState", "state": "hospital", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "monastery", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"university", "on":5}],        
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": "monastary"
        }
    ]
};
var helpers = (function() {
	var halp = {};
	halp.createBitmap = function(queRes, options) {
		var bm = new createjs.Bitmap(queRes);
		var options = options || {};
		bm.x = options.x || 0;
		bm.y = options.y || 0;
		bm.scaleX = options.scaleX || 1;
		bm.scaleY = options.scaleY || 1;
		bm.regX = options.regX || 0;
		bm.regY = options.regY || 0;
		if (typeof options.alpha !== "undefined")
			bm.alpha = options.alpha;
		if (typeof options.sourceRect !== "undefined")
			bm.sourceRect = options.sourceRect;
		return bm;
	};
	halp.createSprite = function(data, anim, options) {
		var sData = new createjs.SpriteSheet(data);
		var spr = new createjs.Sprite(sData, anim);
		var options = options || {};
		spr.x = options.x || 0;
		spr.y = options.y || 0;
		spr.scaleX = options.scaleX || 1;
		spr.scaleY = options.scaleY || 1;
		spr.regX = options.regX || spr.regX;
		spr.regY = options.regY || spr.regY;
		spr.rotation = options.rotation || 0;
		spr.currentAnimationFrame = options.currentAnimationFrame || 0;
		if (typeof options.alpha !== "undefined")
			spr.alpha = options.alpha;
		return spr;
	};

	halp.createCircle = function(r,color,options)
	{
		var circle = new createjs.Shape();
		var options = options || {};
		var x = options.x || 0;
		var y = options.y || 0;
		circle.graphics.beginFill(color).drawCircle(x,y,r);
		circle.scaleX = options.scaleX || 1;
		circle.scaleY = options.scaleY || 1;
		circle.regX = options.regX || spr.regX;
		circle.regY = options.regY || spr.regY;
		if (typeof options.alpha !== "undefined")
			circle.alpha = options.alpha;
		return circle;
	}

	halp.createSquare = function(w,color,options){
		return halp.createRectangle(w, w, color, options);
	}

	halp.createRectangle = function(w,h,color,options)
	{
		var rect = new createjs.Shape();
		var options = options || {};
		var x = options.x || 0;
		var y = options.y || 0;
		rect.graphics.beginFill(color).drawRect(x,y,w,h);
		rect.scaleX = options.scaleX || 1;
		rect.scaleY = options.scaleY || 1;
		rect.regX = options.regX || 0;
		rect.regY = options.regY || 0;
		rect.rotation = options.rotation || 0;
		if (typeof options.alpha !== "undefined")
			rect.alpha = options.alpha;
		return rect;
	}

	halp.createText = function(msg, font, color, options) {
		var text = new createjs.Text(msg, font, color);
		var options = options || {};
		text.x = options.x || 0;
		text.y = options.y || 0;
		if (typeof options.alpha !== "undefined")
			text.alpha = options.alpha;
		return text;
	};

	//determines if number is in range without knowing which is greater
	halp.between = function(number, first, last) {
		return (first < last ? number >= first && number <= last : number >= last && number <= first);
	}

	halp.isInRectangle = function(x, y, rect) {
		return (halp.between(x, rect.x, rect.x + rect.width) && halp.between(y, rect.y, rect.y + rect.height))
	}

	return halp;
}());
var House = (function(){
    var house = {
        house: null,
        bgHill: null,
        houseView: null,        
        crashRocket: null,
        hobo: null,
        timmy: null,
        priest: null,
        diamondHill: null,
        subtractedDiamond: null,
        subtractedDiamondCont:null,
        currentCharacter: "hoboCat",
        mouseHobo: null,
        mouseTimmy: null,
        mousePriest :null,
        mouseChar: {},
        mouseRocket: null,
        mouseCatz: null,
        catz: null,       
        cricketsSound: null,
        wick: null,
        oh: null,
        look: null,
        diamonds: null,
        diCont : null,
        lookingAtStarsButton: null,
        wickLight: null,
        wickClickBox: null,
        hoboCatHouse: null,
        rehab: null,
        orphanage: null,     
        university: null,
        diamondHouseCont: null,
        diamondHouseArray: [],
        characterSpeach: null,
        catzSpeach: null,
        hoboCatSound1: null,
        hoboCatSound2: null,
        catzSound1: null,
        catzSound2: null,                                                      
        characterExclamation : null,
        choiceIDs : [],
        choices : [],
        choice1 : null,
        choice2 : null,
        choice3 : null
    };
    
    var        
        deltaUniversity = 0,
        deltaOrph = 0,
        deltaRehab = 0,                                  
        characterActive = {},        
        wickActive = false,
        hoboActive = true,
        timmyActive = false,
        priestActive = false,
        catzActive = false,        
        currentCharacter = "hoboCat";
        
    house.init = function(){                
        house.houseView = new createjs.Container();
        characterActive = {"hoboCat":hoboActive, "timmy":timmyActive, "priest":priestActive, "catz":catzActive};                
    };    	
	
    house.gotoHouseView = function(){                				
		Cookie.saveAndSetHS(gameStats.score);
						
        house.hobo.alpha = 0;
        house.timmy.alpha = 0;
        house.priest.alpha = 0;        
        house.cricketsSound = createjs.Sound.play("crickets",{loop:-1});        
        house.cricketsSound.volume=0.1;                    
		var hobDiaNo = house.progressionCheck("hoboCat");     
		if(hobDiaNo !== -1) {
			currentCharacter = "hoboCat";
			house.hobo.alpha = 1;
			gameStats.dialogNumber["hoboCat"] = hobDiaNo;           
			hoboActive = true;				
			if(hobDiaNo!="goodEvening")
				house.characterExclamation.alpha=0.5;            
			gameStats.dialogID["hoboCat"] = 0;
		} 
		//If no hobo dialog, check for timmy dialog
		else {  
			var timmyDiaNo = house.progressionCheck("timmy");
			if(timmyDiaNo !== -1) {
				currentCharacter = "timmy";
				house.timmy.alpha = 1;
				gameStats.dialogNumber["timmy"] = timmyDiaNo;
				timmyActive = true;                
				gameStats.dialogID["timmy"] = 0;
				house.characterExclamation.alpha=0.5;
			}
			//If no timmy dialog, cehck for priest dialog
			else {
				var priestDiaNo = house.progressionCheck("priest");
				if(priestDiaNo !== -1) {
					currentCharacter = "priest";
					house.priest.alpha = 1;
					gameStats.dialogNumber["priest"] = priestDiaNo;
					priestActive = true;
					gameStats.dialogID["priest"] = 0;
					house.characterExclamation.alpha=0.5;
				}

				else {
					house.hobo.alpha = 1;
					currentCharacter = "hoboCat";
					$("#mahCanvas").addClass("match-cursor");
				}
			}
		}               
		gameStats.score = 0;		
    };
    
    house.progressionCheck = function(cat) {
        var catProgression = gameProgressionJSON[cat];
        for(var i=0, max1 = catProgression.length;i<max1;i++){                        
        conditionLoop:
            if(!gameStats.HasHappend[cat][i] || catProgression[i].ShouldReoccur && 
                catProgression[i].Chance>Math.random()){                                                
                for(var j=0, max2=catProgression[i].Conditions.length; j<max2; j++)       {
                    var condition = catProgression[i].Conditions[j];
                    if(condition.ConditionType === "Score"){                                        
                        if(condition.OperatorType === "LargerThan" && gameStats.score<=condition.Score)                                                    
							break conditionLoop;                                                    
                        else if(condition.OperatorType === "LessThan" && gameStats.score>=condition.Score)                                                    
							break conditionLoop;                 						
                    }
                    else if(condition.ConditionType === "buildingState"){                     						
                        if(condition.state === "builtOnRound" &&
						((gameStats.buildings[condition.building][condition.state] + condition.on)>=gameStats.currentRound))                            
						   break conditionLoop;                                                  
                        else if(gameStats.buildings[condition.building][condition.state] !== condition.on)                        
                            break conditionLoop;                        						
                    }
                    
                    else if (condition.ConditionType === "state" && gameStats[condition.state] !== condition.on)                    
						break conditionLoop;
                                            
                    //If all conditions have been passed                    
                    if(j===catProgression[i].Conditions.length-1){       
                        currentCharacter = cat;
                        characterActive[currentCharacter] = true;
                        wickActive = false;                        
                        gameStats.HasHappend[cat][i] = true;
                        return catProgression[i].ConversationNumber;
                    }
                }
            }
        }
        return -1;
    };
    
    
    house.characterDialog = function(){           		
        var dialog = dialogJSON[currentCharacter][gameStats.dialogNumber[currentCharacter]];           
		var line = dialog.dialog[gameStats.dialogID[currentCharacter]];
        if(line){
			if(line.Triggers){		
				for(var i=0, max1=line.Triggers.length; i<max1; i++){                    
					var value = line.Triggers[i].Value;
					var stat = line.Triggers[i].Stat;
					
					if(stat === "score"){
						//gameStats.score += value;
					}
					else if (stat=== "kills")                    
						gameStats.kills += value;                    
					
					else if (stat === "built"){
						if(!gameStats.hasBeenFirst.houseWithSlots && (value === "rehab" || value === "orphanage")) {
							setTimeout(function() { 
								paused = true; 
								setTimeout(function() { 
									paused = false; 
								}, 1000);
							}, 1000);
							gameStats.hasBeenFirst.houseWithSlots = true;
						}                        
						gameStats.buildings[value].built = true;
						gameStats.buildings[value].builtOnRound = gameStats.currentRound;                         
						house.BuildingAnimation(house.diamondHouseArray[value]);                        						
					}
					
					else if (stat === "addOn"){
						var building = line.Triggers[i].Building;
						house.diamondHouseArray[building].gotoAndPlay(value);
						gameStats.buildings[building][value]= true;                        						
					}
					else                    
						gameStats[line.Triggers[i].Stat]= value;                                                                    
				}
			}
			
			if (line.Who === "Catz") {
				house.catzSpeach.text = line.What;            
				house.catzSpeach.alpha = 1;
				house.catzSound1.play();
			}
			else if (line.Who === "Hobo-Cat") {
				house.characterSpeach.text = line.What;
				house.characterSpeach.alpha = 1;
				house.hoboCatSound1.play();  
			}                             
			
			else if (line.Who === "Timmy") {
				house.characterSpeach.text = line.What;
				house.characterSpeach.alpha = 1;
				//Should be timmy sound
				house.hoboCatSound1.play();  
			}     
			
			else if (line.Who === "Priest") {
				house.characterSpeach.text = line.What;
				house.characterSpeach.alpha = 1;
				//Should be priest sound
				house.hoboCatSound1.play();  
			}
			
			if(line.Choice) {                                                
				function addClickHandler(i){
					house.choices[i].addEventListener("click",
						function(){                             
							gameStats.dialogID[currentCharacter] = house.choiceIDs[i];                                                                                                
							house.choice1.alpha = 0;
							house.choice2.alpha = 0;
							house.choice3.alpha = 0;
							house.choices[0].removeAllEventListeners();
							house.choices[1].removeAllEventListeners();
							house.characterDialog();
					}); 
					house.choices[i].addEventListener("mouseover", function(){house.choices[i].alpha=1});
					house.choices[i].addEventListener("mouseout", function(){house.choices[i].alpha=0.7});
				}
				for (var i=0, max1 = line.Choices.length;i<max1;i++){                                                   
					house.choices[i].text = line.Choices[i].text;
					house.choices[i].alpha = 0.7;
					house.choiceIDs[i] = line.Choices[i].ChoiceID;      
					addClickHandler(i);                                           
				}                                                                     
			}
			else{                     
				if(!line.End)
					gameStats.dialogID[currentCharacter] = line.NextID;                                
				else{
					//END DIALOG                    
					setTimeout(function(){$("#mahCanvas").addClass("match-cursor");}, 500);                    
					//house.wickExclamation.alpha=1; Replaced by match-cursor					
					showRocket();
					//To shift to idle speach. Should be implemented smarter.
					gameStats.dialogID[currentCharacter]+=100;                					
					Cookie.save(gameStats);					
				}                
			}        
		}
        else{
            house.characterSpeach.text = dialog.idle.what;
            house.characterSpeach.alpha = 1;            
			showRocket();
        }        
    };
    
	function showRocket(){
		characterActive[currentCharacter] = false;
		house.characterExclamation.alpha = 0;                    
		wickActive = true;
							
		if(!createjs.Tween.hasActiveTweens(house.wickExclamation)){
			createjs.Tween.removeTweens(house.wickExclamation);
			createjs.Tween.get(house.wickExclamation).wait(4000).to({alpha:1},4000);
		}
		createjs.Tween.removeTweens(house.wick);
		createjs.Tween.get(house.wick).to({x:-210},1200)
				.call(house.activateWick);
	}
     
    house.buildAnimationFinished = function(){
        createjs.Tween.removeTweens(house.houseView);
        house.houseView.x=0;
        house.houseView.y=0;
    };
    
    house.lightFuse = function(){        
        if(wickActive){
            createjs.Sound.play("wickSound");
            house.mouseRocket.alpha = 0;
            house.wickLight.alpha = 0;
            house.wick.gotoAndPlay("cycle");
            house.wickClickBox.removeAllEventListeners();   
            house.house.removeAllEventListeners();       
            house.wick.addEventListener("animationend",function(){$("#mahCanvas").removeClass("match-cursor");});
            house.wick.addEventListener("animationend",GameLogic.gotoGameView);
            house.catzSpeach.text ="";
            house.characterSpeach.text ="";            
        }
    };

    house.highlightCatz = function(){
        if(!createjs.Tween.hasActiveTweens(house.catz)){
            house.mouseCatz.alpha=1;   
            house.catz.x=360;
            house.catz.y=270; 
            house.catz.rotation = 0;                			
		}
    }


    house.downlightCatz = function(){
        house.mouseCatz.alpha=0;
    }
    
    
    house.highlightCharacter = function(){                       
        $("#mahCanvas").addClass("talk-cursor");
        house.mouseChar[currentCharacter].alpha = 1;
        if(characterActive[currentCharacter] && currentCharacter!="catz")
        {
            house.characterExclamation.alpha = 1;
        }
    };
    
    house.downlightCharacter = function(){
        $("#mahCanvas").removeClass("talk-cursor");
        house.mouseChar[currentCharacter].alpha = 0;
        
        if(characterActive[currentCharacter])        
            house.characterExclamation.alpha=0.5;        
        else        
			house.characterExclamation.alpha=0;        
    };
    
    house.highlightRocket = function(){
        if(wickActive){
            house.mouseRocket.alpha = 1;
            house.wickLight.alpha = 0.7;
        }
    };
    
    house.downlightRocket = function(){
        house.mouseRocket.alpha = 0;
        house.wickLight.alpha = 0;
    };
    
    house.update = function(){               
        if(house.characterSpeach.alpha > 0){
            if(house.characterSpeach.alpha > 0.5)
                house.characterSpeach.alpha -= 0.005;            
            else            
                house.characterSpeach.alpha -= 0.03;            
        }
        
        if(house.catzSpeach.alpha > 0){
            if(house.catzSpeach.alpha >0.5)
                house.catzSpeach.alpha -= 0.005;            
            else 
                house.catzSpeach.alpha -= 0.03;                        
        }   
        if(characterActive[currentCharacter])
        {
            house.characterExclamation.alpha=0;  
        }
    };
    
    house.addCharacterEvents = function(){                
        house.hobo.addEventListener("click",(function(){house.characterDialog();}));
        house.hobo.addEventListener("mouseover", house.highlightCharacter);
        house.hobo.addEventListener("mouseout", house.downlightCharacter);
        
        house.timmy.addEventListener("click",(function(){house.characterDialog();}));
        house.timmy.addEventListener("mouseover", house.highlightCharacter);
        house.timmy.addEventListener("mouseout", house.downlightCharacter);
        
        house.priest.addEventListener("click",(function(){house.characterDialog();}));
        house.priest.addEventListener("mouseover", house.highlightCharacter);
        house.priest.addEventListener("mouseout", house.downlightCharacter);

        house.catz.addEventListener("click", house.meow);
        house.catz.addEventListener("mouseover", house.highlightCatz);
        house.catz.addEventListener("mouseout", house.downlightCatz);				
    };        

    house.removeCharacterEvents = function(){
        house.hobo.removeAllEventListeners();
        house.timmy.removeAllEventListeners();
        house.priest.removeAllEventListeners();
        house.catz.removeAllEventListeners();
        house.characterExclamation.alpha=0;
    }

    house.meow = function(){
        createjs.Sound.play("catzScream2");        
    }
    
	house.load = function(){				
	var sg = Cookie.load();				
	if(sg){
		gameStats = sg;
		for (var key in gameStats.buildings) {
			if (gameStats.buildings.hasOwnProperty(key)) {
				if(gameStats.buildings[key].built)
					house.BuildingAnimation(house.diamondHouseArray[key]);
			}
		}       	
	}				
}
	
    house.gotoHouseViewFirstTime = function(stage, gameView,diamondShardCounter, muteButton, gameListener){        										
        house.characterExclamation.alpha=0;        
        house.gotoHouseView();
        $("#mahCanvas").removeClass("match-cursor");
        house.wick.x=-120;
        house.wickClickBox.removeAllEventListeners();
        house.house.removeAllEventListeners();
        house.wick.gotoAndPlay("still");
        stage.removeAllEventListeners();
        if(wickActive)
            house.activateWick(gotoGameView);   
        house.hobo.x=-300;
        house.hobo.y=270;
        stage.removeChild(gameView,diamondShardCounter,muteButton);
        stage.addChild(house.houseView);
        stage.update();
        createjs.Ticker.setFPS(20);
        createjs.Ticker.off("tick", gameListener);    		
    };
    
    house.gotoHouseViewWithRocket = function(){                
        house.gotoHouseView();
        if(CatzRocket.catzState===CatzRocket.catzStateEnum.OutOfFuelUpsideDown){

            house.crashRocket.x=315;
            house.crashRocket.y = -90;
        }
        else{
			house.crashRocket.x=315-400*Math.cos(CatzRocket.catzRocketContainer.rotation*6.28/360);
			house.crashRocket.y =310-400*Math.sin(CatzRocket.catzRocketContainer.rotation*6.28/360);
        }
		
        house.crashRocket.alpha=1;
        house.crashRocket.rotation=CatzRocket.catzRocketContainer.rotation;        
		
		createjs.Tween.get(house.crashRocket)
                .to({x:315, y:310},200)
                .wait(1500)
                .to({x:315, y:310, rotation:-30},800, createjs.Ease.quadIn); 
		
        house.catz.x = 360;
        house.catz.y = 370;
		
        createjs.Tween.get(house.catz)
                .wait(800)
                .to({x:390, y:350, rotation:10},250)
                .to({x:330, y:330, rotation:-10},250)
                .to({x:390, y:310, rotation:10},250)
                .to({x:330, y:290, rotation:-10},250)
                .to({x:360, y:270, rotation:0},250);
    };    
    
    house.gotoHouseViewWithoutRocket = function(){
        house.gotoHouseView();
        house.catz.x=300-400*Math.cos(CatzRocket.catzRocketContainer.rotation*6.28/360);
        house.catz.y =370-400*Math.sin(CatzRocket.catzRocketContainer.rotation*6.28/360);
        house.catz.gotoAndPlay("flying");
        house.catz.rotation=CatzRocket.catzRocketContainer.rotation+90;
        createjs.Tween.get(house.catz)
                .to({x:300, y:370},200)
                .call(house.catz.gotoAndPlay,["cycle"])
                .wait(800)
                .to({x:390, y:350, rotation:10},250)
                .to({x:330, y:330, rotation:-10},250)
                .to({x:390, y:310, rotation:10},250)
                .to({x:330, y:290, rotation:-10},250)
                .to({x:360, y:270, rotation:0},250);
        house.crashRocket.alpha=1;
        house.crashRocket.x=315;
        house.crashRocket.y=910;
        house.crashRocket.rotation=-90;
        createjs.Tween.get(house.crashRocket)
                .wait(1200)
                .to({x:315, y:310},500)
                .to({x:315, y:310, rotation:-30},800, createjs.Ease.quadIn);
    };           
    
    house.activateWick = function(){   
        house.wickClickBox.addEventListener("click",(function(){ house.lightFuse();}));
        house.wickClickBox.addEventListener("mouseover", house.highlightRocket);
        house.wickClickBox.addEventListener("mouseout", house.downlightRocket);
        house.house.addEventListener("click",(function(){house.lightFuse();}));
        house.house.addEventListener("mouseover", house.highlightRocket);
        house.house.addEventListener("mouseout", house.downlightRocket);                                
    };               

    house.deactivateWick = function(){    
        house.wick.x=-100;
        house.mouseRocket.alpha = 0;
        house.wickLight.alpha = 0;
        house.wick.gotoAndPlay("still");   
        house.wickClickBox.removeAllEventListeners();
        house.wick.removeAllEventListeners();
        house.house.removeAllEventListeners();
    }
    
    house.BuildingAnimation = function(houseGraphic){		        
        var oldx = houseGraphic.x;
        var oldy = houseGraphic.y;        
        createjs.Tween.get(houseGraphic)
                .to({x:oldx-20,y:oldy+50})
				.to({alpha:1})
                .to({x:oldx,y:oldy},2000)
                .call(house.buildAnimationFinished);
        createjs.Tween.get(house.houseView, {loop:true})
            .to({x:-5, y:5},50)
            .to({x:5, y:-5},50);
    };                             
    	
    return house;
}());
var InitializeStage = (function(){
	var is = {},		
	manifest,
	progressBar;
	
	is.init = function(){			
		canvas = $("#mahCanvas")[0]		
        stage = new createjs.Stage(canvas);	
        CatzRocket.Init();        
        House.init();        		
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
    };

    function handleProgress(event){                
        progressBar.graphics.beginFill("#330033").drawRect(0,0,100*event.progress,20);                
        stage.update();
    }

    function handleComplete(){           
        stage.removeChild(progressBar);   
        initBase();      			
        GameLogic.tracks = Tracks;
        GameLogic.trackParts = TrackParts;
        if(debugOptions.noHouseView)
            GameLogic.gotoGameView();
        else
            initHouseViewAndStart();
    }

    function initBase(){
        SpriteSheetData.setValues(queue);
        dataDict = {
            "diamond" : SpriteSheetData.diamond,            
            "greatDiamond" : SpriteSheetData.greatDiamond,
            "seagull" : SpriteSheetData.seagullSheet,
            "goose" : SpriteSheetData.seagullSheet,
            "hawk" : SpriteSheetData.enemybirds,        
        };  
        createBG();
        createGameView();
        stage.addChild(bg, cont.star);
        stage.enableMouseOver();   

    }

    function initHouseViewAndStart(){
                for (var key in gameStats.HasHappend) {
        if (gameStats.HasHappend.hasOwnProperty(key)) {             
                for(var i=0, max1 = gameProgressionJSON[key].length;i<max1;i++){
                    gameStats.HasHappend[key][i] = false;
                }
            }
        }                       
        createHouseView();
        House.gotoHouseViewFirstTime(stage, gameView, 
             gameListener, rocketSong);   
        houseListener = createjs.Ticker.on("tick", GameLogic.houseTick,this);       
    }

    is.CreateViewsAndStartCustomLevel = function(tracks, trackParts){
        initBase();
        GameLogic.tracks = tracks;
        GameLogic.trackParts = trackParts;
        GameLogic.gotoGameView(); 
    }

	
	function createHouseView(){        		                
		House.house = helpers.createBitmap(queue.getResult("house"), 
			{scaleX:0.8, scaleY:0.8, y:-20});                
        
		House.bgHill = helpers.createBitmap(queue.getResult("far right hill"), 
			{scaleX:0.8, scaleY:0.8, y:-20});                        

        House.hobo = helpers.createSprite(SpriteSheetData.hobo, "cycle", 
			{x:-210, y:225, regX:-210, regY:-180});        		        

        House.timmy = helpers.createSprite(SpriteSheetData.supportingCharacter, "timmy", 
			{x:83, y:362, scaleX:0.8, scaleY:0.8, alpha:0});        		
                
        House.priest = helpers.createSprite(SpriteSheetData.supportingCharacter, "priest", 
			{x:52, y:330, scaleX:0.8, scaleY:0.8, alpha:0});        		

		House.oh = helpers.createBitmap(queue.getResult("ohlookdiamonds"), 
			{x:90, y:-1460, alpha:0, sourceRect:new createjs.Rectangle(0,0,227,190)});                                        
        House.look = helpers.createBitmap(queue.getResult("ohlookdiamonds"), 
			{x:340, y:-1460, alpha:0, sourceRect:new createjs.Rectangle(227,0,400,160)});                                                
        House.diamonds = helpers.createBitmap(queue.getResult("ohlookdiamonds"), 
			{x:90, y:-1283, alpha:0, sourceRect:new createjs.Rectangle(0,176,620,160)});                                                
        
        House.diCont = new createjs.Container();
        		
		var position;
		for(var i = 0, max = diamondConstellation.length; i<max; i++){        			
			position = diamondConstellation[i];
            var diamond = helpers.createSprite(SpriteSheetData.diamond, "cycle", 
				{x:position.x, y:position.y-1500, scaleX:position.scale, scaleY:position.scale, 
				currentAnimationFrame:position.frame}); 
            House.diCont.addChild(diamond);
        }

		House.crashRocket = helpers.createBitmap(queue.getResult("rocketSilouette"), 
			{x:220, y:320, alpha:0, regX:180, regY:83,scaleX:0.5, scaleY:0.5});                       
                                
        House.diamondHouseCont = new createjs.Container();
        House.hoboCatHouse = helpers.createSprite(SpriteSheetData.dHouse, "hoboHouse", 
            {x:430, y:378, scaleX:1, scaleY:1, alpha:0,rotation:-8});                              
                
        House.diamondHouseCont.addChild(House.hoboCatHouse);
        House.diamondHouseArray["hoboCatHouse"] = House.hoboCatHouse;
        
        House.rehab = helpers.createSprite(SpriteSheetData.dHouse, "catnip treatment facility", 
            {x:583, y:355, scaleX:1.5, scaleY:1.5, alpha:0});     
                        
        House.diamondHouseCont.addChild(House.rehab);
        House.diamondHouseArray["rehab"] = House.rehab;
        
        House.orphanage = helpers.createSprite(SpriteSheetData.dHouse, "orphanage", 
            {x:500, y:381, scaleX:1.5, scaleY:1.5, alpha:0});               
        House.diamondHouseCont.addChild(House.orphanage);
        House.diamondHouseArray["orphanage"] = House.orphanage;
        
        House.university = helpers.createSprite(SpriteSheetData.dHouse, "university", 
            {x:700, y:305, rotation:5, alpha:0});

        House.diamondHouseCont.addChild(House.university);
        House.diamondHouseArray["university"] = House.university;                        
        
		House.mouseHobo = helpers.createBitmap(queue.getResult("mouseHobo"), 
			{x:110, y:316, alpha:0, scaleX:0.5, scaleY:0.5});                
        
		House.mouseTimmy = helpers.createBitmap(queue.getResult("mouseTimmy"), 
			{x:85, y:360, alpha:0, scaleX:0.5, scaleY:0.5});        
        
        House.mousePries = helpers.createBitmap(queue.getResult("mousePriest"), 
			{x:53, y:330, alpha:0, scaleX:0.5, scaleY:0.5});                
        
        House.mouseChar = {"hoboCat":House.mouseHobo, "timmy":House.mouseTimmy, "priest" : House.mousePriest};
        
		House.mouseRocket = helpers.createBitmap(queue.getResult("mouseRocket"), 
			{x:211, y:338, alpha:0});        		        
			
		House.mouseCatz = helpers.createBitmap(queue.getResult("mouseCatz"), 
			{x:116, y:56, alpha:0, scaleX:0.5, scaleY:0.5});        		        
                				        
        House.catz = helpers.createSprite(SpriteSheetData.cat, "cycle", 
			{x:360, y:270, scaleX:0.8, scaleY:0.8});		                                    		
		
        House.wick = helpers.createSprite(SpriteSheetData.wick, "still", 
			{x:-210, y:50, scaleX:1.5, scaleY:1.5});			
        
        House.wickLight = new createjs.Shape();
        House.wickLight.graphics.beginFill("#ffcc00").dc(0,0,1.5);
        House.wickLight.x = 174;
        House.wickLight.y = 319;
        House.wickLight.alpha = 0;

        House.wickClickBox = helpers.createRectangle(85, 85, "white", {x:155,y:300,alpha:0.01});
        
		House.characterSpeach = helpers.createText("", "16px Fauna One", "#ffffcc", 
			{x:10, y:230, alpha:0});               
        
        House.characterExclamation = helpers.createText("!", "32px Fauna One", "#ffcc00", 
			{x:114, y:265, alpha:0});        				
        
        House.catzSpeach = helpers.createText("", "12px Fauna One", "#ffffcc", 
			{x:350, y:180, alpha:0});        								    													
        
        House.choice1 = helpers.createText("", "20px Fauna One", "#ffcc00", 
			{x:350, y:150, alpha:0});    

        House.choice1.hitArea = helpers.createRectangle(150,30,"white",{x:-50, y:0});  																	
        
		House.choice2 = helpers.createText("", "20px Fauna One", "#ffcc00", 
			{x:350, y:120, alpha:0});        													
	

        House.choice2.hitArea = helpers.createRectangle(150,30,"white",{x:-50, y:0}); 

		House.choice3 = helpers.createText("", "20px Fauna One", "#ffcc00", 
			{x:350, y:180, alpha:0});        													        
                

        House.choice3.hitArea = helpers.createRectangle(150,30,"white",{x:-50, y:0}); 

        House.choices = [House.choice1, House.choice2,House.choice3];
        
        House.hoboCatSound1 = createjs.Sound.play("hoboCatSound1");
        House.hoboCatSound1.stop();
        
        House.catzSound1 = createjs.Sound.play("catzSound1");
        House.catzSound1.stop();
        House.catzSound2 = createjs.Sound.play("catzSound2");
        House.catzSound2.stop();
        
		House.subtractedDiamond = helpers.createBitmap(queue.getResult("diamondShardCounter"), 
			{x:750, y:420, scaleX:0.4, scaleY:0.4});                
        
        House.subtractedDiamondCont = new createjs.Container();
        rocketSong = createjs.Sound.play("palladiumAlloySong");
        rocketSong.stop();		
        House.houseView.y=1500;
        bg.y=0;
        cont.star.y=1000;
		if(!debugOptions.noHouseView)
			bg.addEventListener("click",showOh);
        House.houseView.addChild(House.university, House.rehab, House.bgHill, House.orphanage, 
            House.hoboCatHouse,House.crashRocket, House.catz, 
            House.wick, House.house, House.hobo, House.timmy, House.priest, House.characterExclamation, 
            House.catzSpeach, House.characterSpeach, House.choice1, 
            House.choice2, House.choice3, House.mouseHobo, House.mouseTimmy, 
            House.mousePriest, House.mouseRocket, House.mouseCatz, House.wickLight, House.wickClickBox,House.oh, 
            House.look, House.diamonds, House.diCont, House.lookingAtStarsButton, House.subtractedDiamondCont);
    }
	
	function createBG(){
        bg = helpers.createBitmap(queue.getResult("bg"),{y: -1200});                
        setStars();
   }                            

    function createGameView(){            
        debugText = helpers.createText("", "12px Courier New", "#ffffcc",  {x:500, y:0});		        
		var bgParallax = helpers.createBitmap(queue.getResult("bgParallax 0"), {x:0, y: -200});                
		var bgParallax2 = helpers.createBitmap(queue.getResult("bgParallax 0"), {x:2460, y: -200});        			        
        cont.parallax.addChild(bgParallax,bgParallax2);
        var fgGround1 = helpers.createBitmap(queue.getResult("fgGround"), {x:0, y: 300});        				
        var fgGround2 = helpers.createBitmap(queue.getResult("fgGround"), {x:2000, y: 300});                
		var fgGround3 = helpers.createBitmap(queue.getResult("fgGround"), {x:4000, y: 300});                
        var fgGroundTop1 = helpers.createBitmap(queue.getResult("fgGroundTop"), {y: -830});        			
        var fgGroundTop2 = helpers.createBitmap(queue.getResult("fgGroundTop"), {x:2000, y: -830});    			
		var fgGroundTop3 = helpers.createBitmap(queue.getResult("fgGroundTop"), {x:4000, y: -830});    			
        cont.fg.addChild(fgGround1, fgGround2, fgGround3);  
        cont.fgTop.addChild(fgGroundTop1,fgGroundTop2, fgGroundTop3);         		 			
        diamondShardCounter = helpers.createBitmap(queue.getResult("diamondShardCounter"), 
			{scaleX:0.8, scaleY:0.8, y: -830});    		
        diamondCounterText = helpers.createText("", "22px Courier New", "#fff",  {x:608+118, y:52});		                           
        CatzRocket.catz = helpers.createSprite(SpriteSheetData.rocket, "no shake", {y:5});                
        CatzRocket.rocketFlame = helpers.createSprite(SpriteSheetData.flame, "cycle", 
			{x:190, y:200, regX:40, regY:-37, alpha:0});							                

        CatzRocket.catzRocketContainer.x = 260;
        CatzRocket.catzRocketContainer.y = 200;        
        CatzRocket.catzRocketContainer.regY = 100;
        CatzRocket.catzRocketContainer.regX = 150;
        CatzRocket.catz.currentFrame = 0;  
                
		CatzRocket.rocket = helpers.createBitmap(queue.getResult("rocket"), 
			{scaleX:0.25, scaleY:0.25, regX:-430, regY:-320});        
        
		CatzRocket.catzRocketContainer.addChild(CatzRocket.rocket,CatzRocket.catz);
        catzBounds = CatzRocket.catzRocketContainer.getTransformedBounds();
        
        CatzRocket.rocketSnake.x=0;
        CatzRocket.rocketSnake.y=0;                        
                
        for(var i=0, snakeAmt = 11; i<snakeAmt;i++){
            var shape = new createjs.Shape();
            var x = 260-i*5;
            var r = 9;
            shape.graphics.f(lightningColor).dc(x,200,r);
            shape.regY=5;
            shape.regX=5;
            CatzRocket.rocketSnake.addChild(shape);            
        }
        
        CatzRocket.SnakeLine = new createjs.Shape();
                
        smoke = helpers.createSprite(SpriteSheetData.smoke, "jump", 
			{regX:150, regY:350, alpha:0});											
        exitSmoke = helpers.createSprite(SpriteSheetData.smoke, "right", 
			{regX:150, regY:200, alpha:0});												       				
        		
 //       hud = helpers.createBitmap(queue.getResult("hud"), 
//            {x:588+107, y:-6});                                 
        
//        hudPointer = helpers.createBitmap(queue.getResult("hudPointer"), 
//            {x:588+158, y:50, regX:191,regY:54});               
        
//        CatzRocket.glass = helpers.createSprite(SpriteSheetData.hudGlass, "still", 
//            {regX:150, regY:200, scaleX:0.85, scaleY:0.85, x:670, y:158});  	
                
        leaves = helpers.createSprite(SpriteSheetData.leaves, "cycle", 
			{alpha:0});							                
                        
        cont.onlooker = new createjs.Container();
            
            
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
        flameBounds.length = Math.sqrt(Math.pow(flameBounds.height/2,2)+Math.pow(flameBounds.width,2)); 
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
        catzBounds = {
            height: 15,
            width: 40
        };
        catzNorm = [
            {x:1,y:1, vert1: 0, vert2: 1},
            {x:1,y:1, vert1: 0, vert2: 2}
        ];
        //noseLen=sqrt(width^2+nose^2)
        polygonLine = new createjs.Shape();
        cont.collisionCheckDebug.addChild(polygonLine);
        
        CatzRocket.rocketSound = createjs.Sound.play("rocketSound");
        CatzRocket.rocketSound.volume = 0.1;
        CatzRocket.rocketSound.stop();
        diamondSound = createjs.Sound.play("diamondSound");
        diamondSound.volume = 0.2;
        diamondSound.stop();
        
        squawkSound = createjs.Sound.play(name);
        squawkSound.volume=0.15;
        squawkSound.stop();
        gameView = new createjs.Container();                
        
        gameView.addChild(cont.parallax, cont.onlooker, CatzRocket.rocketSnake,CatzRocket.SnakeLine,
            cont.attackBird, cont.diamond,
            exitSmoke,smoke, CatzRocket.rocketFlame, CatzRocket.catzRocketContainer,
            cont.cloud,cont.lightning,cont.thunder,cont.fg, cont.fgTop,leaves, cont.collisionCheckDebug, cont.select);
    }

	function setStars(){
        for(i=0;i<80;i++){
            var star = helpers.createBitmap(queue.getResult("star"), 
				{x:Math.random()*2200, y:Math.random()*1450-1000});                			
            var delay = Math.random()*2000;                        
            createjs.Tween.get(star,{loop:true})
                    .wait(delay)
                    .to({alpha:0},1000)
                    .to({alpha:1},1000);
            cont.star.addChild(star);
        }
    }
	
	function showOh(){
        bg.removeAllEventListeners();
        bg.addEventListener("click",showLook);
        createjs.Tween.get(House.oh).to({alpha:1},3000);
    }
    
    function showLook(){
        bg.removeAllEventListeners();
        bg.addEventListener("click",showDiamonds);
        createjs.Tween.get(House.look).to({alpha:1},3000);
    }
    
    function showDiamonds(){
        bg.removeAllEventListeners();
        bg.addEventListener("click",goDown);
        createjs.Tween.get(House.diamonds).to({alpha:1},3000);        
    }
		
	function hoboWalk(){					
		function w () {
			createjs.Tween.get(House.hobo)				
				.to({x:-270, y:270, rotation:0},300)
				.to({x:-260, y:270, rotation:-5},300)
				.to({x:-230, y:270, rotation:0},300)
				.to({x:-200, y:270, rotation:-5},300)
				.to({x:-170, y:270, rotation:0},300)
				.to({x:-160, y:270, rotation:-5},300)
				.to({x:-130, y:260, rotation:0},300)
				.to({x:-140, y:260, rotation:-5},300)
				.to({x:-110, y:225, rotation:0},300)
				.call(House.addCharacterEvents)
				.call(function(){House.characterExclamation.alpha=0.5;});
		}
		if(!gameStats.HasHappend["hoboCat"][1])
			setTimeout(w, 4000);
		else{
			w();
		}
	}
	function goDown(){		
        bg.removeAllEventListeners();
        createjs.Tween.get(House.houseView).to({y:0},4000, createjs.Ease.quadInOut).call(House.load).call(hoboWalk);
        createjs.Tween.get(bg).to({y:-1200},4000, createjs.Ease.quadInOut);
        createjs.Tween.get(cont.star).to({y:0},4000, createjs.Ease.quadInOut);        
    }                  			
	return is;
}());

var progressBar;
var stage;
var queue;
var canvas;
var inGameMode = false;
var isSpriteMode = true;
var levels;
var ctrlPressed = false;
var grav = 12;
var dbText;
var selectBox = {
	rect: null,
	graphic: null
};

var bgCoordinates = {
	width: 800,
	height: 1800,
	offset: -520
};

var fgCoordinates = {
	height: 150,
	width: 2000
};

var catzStartPos = {
	x: 260,
	y: 1030
};

var mousedown;
var catzRocketXpos = 0;
var YOriginPosInGame = 830;
var levelLength = 13500;
var levelViewScale = 0.5;
var beginningZoneLength = 1000;
var bgCont = new createjs.Container();
var objCont = new createjs.Container();
GameLogic.SelectedCont = new createjs.Container();
var levelView = new createjs.Container();
var gameClickScreen;
var clipBoard;
var clipOffset = 0;
var levelEditor = {};

levelEditor.Init = function() {
	canvas = $("#levelEditCanvas")[0];
	stage = new createjs.Stage(canvas);
	stage.mouseMoveOutside = true;
	progressBar = new createjs.Shape();
	progressBar.graphics.beginFill("#907a91").drawRect(0, 0, 100, 20);
	progressBar.x = canvas.width / 2 - 50;
	progressBar.y = canvas.height / 2 - 10;
	stage.addChild(progressBar);
	queue = new createjs.LoadQueue(true);
	queue.on("progress", handleProgress);
	queue.on("complete", handleComplete);
	queue.loadManifest(LevelManifest);
}

function handleProgress(event) {
	progressBar.graphics.beginFill("#330033").drawRect(0, 0, 100 * event.progress, 20);
	stage.update();
}

function handleComplete() {
	SpriteSheetData.setValues(queue);
	populateDDL();
	createLevelView();
	initSelectBox();
	setEventListeners();
	//	createToolView();
	dbText = helpers.createText("hej", "16px Fauna One", "#ffffcc", {
		x: 30,
		y: 38
	});
	stage.addChild(levelView, dbText, gameClickScreen);
	stage.removeChild(progressBar);
	createjs.Ticker.on("tick", onTick);
	createjs.Ticker.setFPS(30);
	stage.update();
}

function createLevelView() {
	createBG();
	createCatz();


	levelView.addChild(bgCont, objCont, GameLogic.SelectedCont, CatzRocket.catzRocketContainer);
	levelView.scaleX = levelViewScale;
	levelView.scaleY = levelViewScale;
	var canvasHeight = (bgCoordinates.height + bgCoordinates.offset) * levelViewScale;
	var canvasWidth = levelLength * levelViewScale;
	document.getElementById("levelEditCanvas").height = canvasHeight;
	document.getElementById("levelEditCanvas").width = canvasWidth;
	createGameClickScreen(canvasWidth, canvasHeight);
}

function createGameClickScreen(w, h) {
	gameClickScreen = helpers.createRectangle(w, h, "ffffff", {
		alpha: 0
	});
}

function createBG() {
	for (i = 0, len = 2 + levelLength / bgCoordinates.width; i < len; i++) {
		var bgClone = new createjs.Bitmap(queue.getResult("bg"));
		bgClone.x = i * bgCoordinates.width;
		bgClone.y = bgCoordinates.offset;
		if (i % 2 === 0) {
			bgClone.scaleX = -1;
			bgClone.x -= bgCoordinates.width;
		}
		bgCont.addChild(bgClone);
	}
	for (i = 0, len = levelLength / fgCoordinates.width; i < len; i++) {
		var fgClone = new createjs.Bitmap(queue.getResult("fgGround"));
		fgClone.x = fgCoordinates.width * i;
		fgClone.y = 300 + YOriginPosInGame;
		var topClone = new createjs.Bitmap(queue.getResult("fgGroundTop"));
		topClone.x = fgCoordinates.width * i;
		topClone.y = 0;
		bgCont.addChild(fgClone, topClone);
	}
	startLine=helpers.createRectangle(10,bgCoordinates.height-bgCoordinates.offset, "red", {x:beginningZoneLength})
	bgCont.addChild(startLine);
}

function createCatz() {
	CatzRocket.Init();
	CatzRocket.catz = helpers.createSprite(SpriteSheetData.rocket, "no shake", {
		y: 5
	});
	CatzRocket.catzRocketContainer.regY = 100;
	CatzRocket.catzRocketContainer.regX = 150;
	CatzRocket.catz.currentFrame = 0;
	CatzRocket.rocketFlame = helpers.createSprite(SpriteSheetData.flame, "cycle", {
		x: 190,
		y: 200,
		regX: 40,
		regY: -37,
		alpha: 0
	});
	CatzRocket.SnakeLine = new createjs.Shape();
	CatzRocket.rocket = helpers.createBitmap(queue.getResult("rocket"), {
		scaleX: 0.25,
		scaleY: 0.25,
		regX: -430,
		regY: -320
	});
	CatzRocket.rocketSound = createjs.Sound.play("rocketSound");
	CatzRocket.rocketSound.volume = 0.1;
	CatzRocket.rocketSound.stop();
	for (var i = 0, snakeAmt = 11; i < snakeAmt; i++) {
		var shape = new createjs.Shape();
		var x = 260 - i * 5;
		var r = 9;
		shape.graphics.f("fffff").dc(x, 200, r);
		shape.regY = 5;
		shape.regX = 5;
		CatzRocket.rocketSnake.addChild(shape);
	}
	CatzRocket.setCrashBorders(0, YOriginPosInGame + 450);
	CatzRocket.catzRocketContainer.addChild(CatzRocket.rocket, CatzRocket.catz);
	CatzRocket.catzRocketContainer.on("pressmove", pressMoveCatz);
}

function populateDDL() {
	var ddl = document.getElementById("importSelect");
	levels = Object.keys(TrackParts.easy);
	for (i = 0, len = levels.length; i < len; i++) {
		var option = document.createElement("option");
		option.text = levels[i];
		ddl.add(option);
	}
}


function setEventListeners() {
	bgCont.on("mousedown", createSelectBox);
	bgCont.on("pressmove", dragBox);
	bgCont.on("pressup", selectWithBox);
	$(window).keydown(handleKeyPress);
	$(window).keyup(handleKeyUp);
	GameLogic.SelectedCont.on("mousedown", startPressMove);
	GameLogic.SelectedCont.on("pressmove", pressMove);
	gameClickScreen.on("mousedown", gameMouseDown);
	gameClickScreen.on("click", gameMouseUp);
}

function handleKeyPress(evt){
	if (evt.ctrlKey){
		ctrlPressed = true;
	}
	if((evt.keyCode===67 ||evt.keyCode===88) && ctrlPressed){
		clipBoard = [];
		clipOffset = 0;
		var clipLeftMost = levelLength;
		var clipRightMost = 0;
		for (var i = GameLogic.SelectedCont.children.length - 1; i >= 0; i--) {
			kid = GameLogic.SelectedCont.children[i];
			kid.x-=GameLogic.SelectedCont.x;
			kid.y-=GameLogic.SelectedCont.y;
			clipBoard.push(createClone(kid));
			clipRightMost = Math.max(GameLogic.SelectedCont.children[i].x, clipRightMost);
			clipLeftMost = Math.min(GameLogic.SelectedCont.children[i].x, clipLeftMost);
		};
		if(evt.keyCode===67){
			clipOffset = clipRightMost-clipLeftMost+50;
		}
	}
	if(evt.keyCode===86 && ctrlPressed){
		moveChildrenFromSelectedToObjCont();
		for (var i = clipBoard.length - 1; i >= 0; i--) {
			clipBoard[i].x+=clipOffset;
			var clone = createClone(clipBoard[i]);
			clone.alpha = 0.5;
			GameLogic.SelectedCont.addChild(clone);
		};
	}
	if(evt.keyCode===88 || evt.keyCode=== 46)
	{
		GameLogic.SelectedCont.removeAllChildren();
	}
}

function handleKeyUp(evt){
	if (evt.ctrlKey){
		ctrlPressed = false;
	}
}
function startPressMove(evt) {
	selectPosOnStartDrag.x = evt.stageX / levelViewScale - GameLogic.SelectedCont.x;
	selectPosOnStartDrag.y = evt.stageY / levelViewScale - GameLogic.SelectedCont.y;
}

function pressMove(evt) {
	evt.currentTarget.x = evt.stageX / levelViewScale - selectPosOnStartDrag.x;
	evt.currentTarget.y = evt.stageY / levelViewScale - selectPosOnStartDrag.y;
	stage.update();
}

function pressMoveCatz(evt) {
	evt.currentTarget.x = evt.stageX / levelViewScale;
	evt.currentTarget.y = evt.stageY / levelViewScale;
	stage.update();
}
 function deleteAllSelected(evt) {
	GameLogic.SelectedCont.removeAllChildren();
}

function deleteAll() {
	GameLogic.SelectedCont.removeAllChildren();
	objCont.removeAllChildren();

}

function catzToStartPosition() {
	exitGameMode();
	window.scrollTo(0, 0);
	CatzRocket.catzRocketContainer.y = catzStartPos.y;
	CatzRocket.catzRocketContainer.x = catzStartPos.x;
}

function changeBirdType(evt) {
	types = ["seagull",
		"duck",
		"crow",
		"bat",
		"falcon",
		"glasses"
	];
	for (i = types.length - 1; i >= 0; i--) {
		if (evt.currentTarget.currentAnimation === types[i]) {
			evt.currentTarget.gotoAndStop(types[i + 1]);
			return;
		}
	}
}

function initSelectBox() {
	selectBox.rect = new createjs.Rectangle(0, 0, 0, 0);
	selectBox.graphic = new createjs.Shape();

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
	selectBox.graphic.graphics.beginStroke("#ffffff").drawRect(
		selectBox.rect.x, selectBox.rect.y, selectBox.rect.width, selectBox.rect.height);
	stage.update();
}

function selectWithBox(evt) {
	//remove selected items not in the box
	moveChildrenFromSelectedToObjCont();
	//add items in the box
	for (var i = objCont.numChildren - 1; i >= 0; i--) {
		var kid = objCont.getChildAt(i);
		if (helpers.isInRectangle(kid.x, kid.y, selectBox.rect)) {
			GameLogic.SelectedCont.addChild(kid);
		}
	};
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
	for (var i = GameLogic.SelectedCont.numChildren - 1; i >= 0; i--) {
		var kid = GameLogic.SelectedCont.getChildAt(i);
		kid.x += GameLogic.SelectedCont.x;
		kid.y += GameLogic.SelectedCont.y;
		kid.alpha = 1;
		objCont.addChild(kid);
	};
	GameLogic.SelectedCont.x = 0;
	GameLogic.SelectedCont.y = 0;
}

function createClone(object){
	var clone = object.clone(true);
	clone.on("mousedown",selectItem);
	return clone;
}

function createSmallDiamond(event) {
	var x = currentCenterX()+Math.random()*100;
	var y = 500+Math.random()*100;
	createDisplayObject(x, y, "diamond", "cycle");;
}


function createGrandDiamond(event) {
	var x = currentCenterX()+Math.random()*100;
	var y = 500+Math.random()*100;
	createDisplayObject(x, y, "greatDiamond", "greatCycle");
}

function createSeagull(event) {
	var x = currentCenterX()+Math.random()*100;
	var y = 250+Math.random()*100;
	createDisplayObject(x, y, "enemybirds", "seagull");
}

function createDisplayObject(x, y, sprite, currentAnimation) {
	if (isSpriteMode) {
		var obj = createDisplaySprite(x, y, sprite, currentAnimation);
	} else {
		obj = createDisplayShape(x, y, sprite, currentAnimation);
	}
	objCont.addChild(obj);
	obj.on("mousedown", selectItem);
}

function createDisplaySprite(x, y, sprite, currentAnimation) {
	var obj = helpers.createSprite(SpriteSheetData[sprite], currentAnimation, {
		x: x,
		y: y
	});

	obj.stop();
	if (sprite === "enemybirds") {
		obj.on("dblclick", changeBirdType);
		obj.scaleX = 0.5;
		obj.scaleY = 0.5;
	};
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
	var mult = 1;
	if (CatzRocket.hasFrenzy())
		mult = 2;
	catzRocketXpos += evt.delta * (0.3 + 0.3 * Math.cos((CatzRocket.catzRocketContainer.rotation) / 360 * 2 * Math.PI)) * mult;
	CatzRocket.catzRocketContainer.x += catzRocketXpos;
	var x = catzRocketXpos * levelViewScale - 200;
	window.scrollTo(x, 0);
	if (CatzRocket.isCrashed) {
		exitGameMode();
	}
}

function enterGameMode() {
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
	mousedown = true;
	CatzRocket.catzUp();
}

function gameMouseUp() {
	console.log("up");
	mousedown = false;
	CatzRocket.catzEndLoop();
}

function getObjType(kid) {
	var type;
	if (kid.currentAnimation === "cycle") {
		type = "diamond";
	} 
	else if (kid.currentAnimation === "greatCycle") {
		type = "greatDiamond";
	} else {
		type = "attackBird";
	}
	return type;
}

function getObjGraphicType(objType){
	return {
		diamond: "sprite",
		greatDiamond: "sprite",
		attackBird: "attackBird",
		thunderCloud :"thunderCloud"
	}[objType];
}

function getLevelToString(){
	var stringBuilder = ["levelName:[\n"];
	moveChildrenFromSelectedToObjCont();
	sortDisplayObjectArray();
	for (j = 0, len = objCont.numChildren; j < len; j++) {
		kid = objCont.getChildAt(j);
		stringBuilder.push(displayObjectToString(kid));
	}
	levelString = stringBuilder.join("");
	levelString = levelString.substring(0, levelString.length - 2); //slice off the last comma
	levelString += "\n]";
	return levelString;
}

function getLevelToJson(){
	var levelArray = [];
	moveChildrenFromSelectedToObjCont();
	sortDisplayObjectArray();
	for (j = 0, len = objCont.numChildren; j < len; j++) {
		kid = objCont.getChildAt(j);
		levelArray.push(displayObjectToJson(kid));
	}
	return levelArray;
}

function getTestLevelTrackParts(){
	return  {
    "easy" :{ 
                levelName: getLevelToJson()
            }
        }

}


function saveLevel() {
	document.getElementById("levelText").innerHTML = "";
	levelString = getLevelToString();
	//window.alert(levelString);
	document.getElementById("levelText").innerHTML = levelString;
}

function sortDisplayObjectArray() {
	objCont.children.sort(function(a, b) {
		return (a.x >= b.x) ? 1 : -1;
	});
}

function displayObjectToString(obj) {
	var x = kid.x -beginningZoneLength;
	var objType = getObjType(kid);
	return '{"x":' +
		x+
		', "y"' +
		YEditorToGame(kid.y) +
		',type:"' +
		objType +
		'","animation":"' +
		kid.currentAnimation +
		'" ,"graphicType":"'+
		getObjGraphicType(objType)+'"},\n';
}

function displayObjectToJson(obj){
	var x = kid.x -beginningZoneLength;
	return { 
		x: x,
		y: YEditorToGame(kid.y),
		type: getObjType(kid),
		animation: kid.currentAnimation,
		graphicType: getObjGraphicType(getObjType(kid))}
}

function loadLevel(offsetX) {
	var ddl = document.getElementById("importSelect");
	var levelName = levels[ddl.selectedIndex];
	if (TrackParts.easy.hasOwnProperty(levelName)) {
		for (var i = TrackParts.easy[levelName].length - 1; i >= 0; i--) {
			var kid = TrackParts.easy[levelName][i];
			createDisplayObject(kid.x + offsetX+beginningZoneLength, YGameToEditor(kid.y), kid.type, kid.currentAnimation);
		};
	} else {
		alert("Doesn't seem to exist");
	}
}

function eraseAndImport(evt) {
	if (confirm("Do you want to load a new level? Unsaved progress will be lost?")) {
		objCont.removeAllChildren();
		loadLevel(0);
	}
}

function addToImport(evt) {
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

var LevelManifest = [{
	id: "enemybirds",
	src: "assets/sprites/newBirds.png"
}, {
	id: "rocketCatz",
	src: "assets/sprites/catzOnly.png"
}, {
	id: "rocket",
	src: "assets/img/rocket.png"
}, {
	id: "diamond",
	src: "assets/sprites/newDiamond3.png"
}, {
	id: "mediumDiamond",
	src: "assets/sprites/newDiamond2.png"
}, {
	id: "greatDiamond",
	src: "assets/sprites/newDiamond.png"
}, {
	id: "diamondShardCounter",
	src: "assets/img/DiamondIcon.png"
}, {
	id: "bg",
	src: "assets/img/background long.jpg"
}, {
	id: "bgParallax 0",
	src: "assets/img/background parallax.png"
}, {
	id: "bgParallax 2",
	src: "assets/img/background parallax 4.png"
}, {
	id: "bgParallax 1",
	src: "assets/img/background parallax 3.png"
}, {
	id: "onlookers",
	src: "assets/sprites/onlookers.png"
}, {
	id: "cloud1",
	src: "assets/img/cloud 1.png"
}, {
	id: "cloud2",
	src: "assets/img/cloud 2.png"
}, {
	id: "cloud3",
	src: "assets/img/cloud 3.png"
}, {
	id: "cloud4",
	src: "assets/img/cloud 4.png"
}, {
	id: "cloud5",
	src: "assets/img/cloud 5.png"
}, {
	id: "hud",
	src: "assets/img/HUD.png"
}, {
	id: "hudPointer",
	src: "assets/img/HUDpointer.png"
}, {
	id: "hudGlass",
	src: "assets/sprites/hudGlass.png"
}, {
	id: "mobHill1",
	src: "assets/img/mob hill.png"
}, {
	id: "mobHill2",
	src: "assets/img/mob hill 2.png"
}, {
	id: "fgGround",
	src: "assets/img/fgGround.png"
}, {
	id: "fgGroundTop",
	src: "assets/img/fgGroundTop.png"
}, {
	id: "fgTree1",
	src: "assets/img/tree 4.png"
}, {
	id: "rocketCatz",
	src: "assets/sprites/catzOnly.png"
}, {
	id: "rocket",
	src: "assets/img/rocket.png"
}, {
	id: "flame",
	src: "assets/sprites/newFlame.png"
}, {
	id: "star",
	src: "assets/img/star.png"
}, {
	id:"house", 
	src:"assets/img/house no hill.png"
}, {
	id:"far right hill", src:"assets/img/far right hill.png"
}, {
	id:"house popup", 
	src:"assets/img/house popup.png"
}, {
	id:"hobo", 
	src:"assets/sprites/hoboCat.png"
}, {
	id:"smokepuffs", 
	src:"assets/sprites/smokepuffs.png"
}, {
	id:"diamondhouse", 
	src:"assets/sprites/diamond house progression.png"
}, {
	id:"leaves", 
	src:"assets/sprites/leaves.png"
}, {
	id:"cat", 
	src:"assets/sprites/lookingAtDiamondsSilouette.png"
}, {
	id:"palladiumAlloySong", 
	src:"assets/sound/pallaydiumAlloySongShort.mp3"
}, {
	id:"hoboCatSound1", 
	src:"assets/sound/catz 1.mp3"
}, {
	id:"catzSound1", 
	src:"assets/sound/catz 3.mp3"
}, {
	id:"uploopSound", 
	src:"assets/sound/uploop.mp3"
}, {
	id:"downloopSound", 
	src:"assets/sound/downloop.mp3"
}, {
	id:"secondUploopSound", 
	src:"assets/sound/secondUploop.mp3"
}, {
	id:"secondDownloopSound", 
	src:"assets/sound/secondDownloop.mp3"
}, {
	id:"slingshotSound", 
	src:"assets/sound/slingshot.mp3"
}, {
	id:"frenzySound", 
	src:"assets/sound/frenzy.mp3"
}, {
	id:"emeregencyBoostSound", 
	src:"assets/sound/emergencyBoost.mp3"
}, {
	id:"miscSound", 
	src:"assets/sound/misc.mp3"
}, {
	id:"catzScream2", 
	src:"assets/sound/cat_meow_wounded_1.mp3"
}, {
	id:"wick", 
	src:"assets/sprites/wick.png"
}, {
	id:"wickSound", 
	src:"assets/sound/wick.mp3"
}, {
	id:"supportingCharacter",
	src:"assets/sprites/supporting characters.png"
}];

/*! odometer 0.4.7 */
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G=[].slice;q='<span class="odometer-value"></span>',n='<span class="odometer-ribbon"><span class="odometer-ribbon-inner">'+q+"</span></span>",d='<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">'+n+"</span></span>",g='<span class="odometer-formatting-mark"></span>',c="(,ddd).dd",h=/^\(?([^)]*)\)?(?:(.)(d+))?$/,i=30,f=2e3,a=20,j=2,e=.5,k=1e3/i,b=1e3/a,o="transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",y=document.createElement("div").style,p=null!=y.transition||null!=y.webkitTransition||null!=y.mozTransition||null!=y.oTransition,w=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,l=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,s=function(a){var b;return b=document.createElement("div"),b.innerHTML=a,b.children[0]},v=function(a,b){return a.className=a.className.replace(new RegExp("(^| )"+b.split(" ").join("|")+"( |$)","gi")," ")},r=function(a,b){return v(a,b),a.className+=" "+b},z=function(a,b){var c;return null!=document.createEvent?(c=document.createEvent("HTMLEvents"),c.initEvent(b,!0,!0),a.dispatchEvent(c)):void 0},u=function(){var a,b;return null!=(a=null!=(b=window.performance)&&"function"==typeof b.now?b.now():void 0)?a:+new Date},x=function(a,b){return null==b&&(b=0),b?(a*=Math.pow(10,b),a+=.5,a=Math.floor(a),a/=Math.pow(10,b)):Math.round(a)},A=function(a){return 0>a?Math.ceil(a):Math.floor(a)},t=function(a){return a-x(a)},C=!1,(B=function(){var a,b,c,d,e;if(!C&&null!=window.jQuery){for(C=!0,d=["html","text"],e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(function(a){var b;return b=window.jQuery.fn[a],window.jQuery.fn[a]=function(a){var c;return null==a||null==(null!=(c=this[0])?c.odometer:void 0)?b.apply(this,arguments):this[0].odometer.update(a)}}(a));return e}})(),setTimeout(B,0),m=function(){function a(b){var c,d,e,g,h,i,l,m,n,o,p=this;if(this.options=b,this.el=this.options.el,null!=this.el.odometer)return this.el.odometer;this.el.odometer=this,m=a.options;for(d in m)g=m[d],null==this.options[d]&&(this.options[d]=g);null==(h=this.options).duration&&(h.duration=f),this.MAX_VALUES=this.options.duration/k/j|0,this.resetFormat(),this.value=this.cleanValue(null!=(n=this.options.value)?n:""),this.renderInside(),this.render();try{for(o=["innerHTML","innerText","textContent"],i=0,l=o.length;l>i;i++)e=o[i],null!=this.el[e]&&!function(a){return Object.defineProperty(p.el,a,{get:function(){var b;return"innerHTML"===a?p.inside.outerHTML:null!=(b=p.inside.innerText)?b:p.inside.textContent},set:function(a){return p.update(a)}})}(e)}catch(q){c=q,this.watchForMutations()}}return a.prototype.renderInside=function(){return this.inside=document.createElement("div"),this.inside.className="odometer-inside",this.el.innerHTML="",this.el.appendChild(this.inside)},a.prototype.watchForMutations=function(){var a,b=this;if(null!=l)try{return null==this.observer&&(this.observer=new l(function(a){var c;return c=b.el.innerText,b.renderInside(),b.render(b.value),b.update(c)})),this.watchMutations=!0,this.startWatchingMutations()}catch(c){a=c}},a.prototype.startWatchingMutations=function(){return this.watchMutations?this.observer.observe(this.el,{childList:!0}):void 0},a.prototype.stopWatchingMutations=function(){var a;return null!=(a=this.observer)?a.disconnect():void 0},a.prototype.cleanValue=function(a){var b;return"string"==typeof a&&(a=a.replace(null!=(b=this.format.radix)?b:".","<radix>"),a=a.replace(/[.,]/g,""),a=a.replace("<radix>","."),a=parseFloat(a,10)||0),x(a,this.format.precision)},a.prototype.bindTransitionEnd=function(){var a,b,c,d,e,f,g=this;if(!this.transitionEndBound){for(this.transitionEndBound=!0,b=!1,e=o.split(" "),f=[],c=0,d=e.length;d>c;c++)a=e[c],f.push(this.el.addEventListener(a,function(){return b?!0:(b=!0,setTimeout(function(){return g.render(),b=!1,z(g.el,"odometerdone")},0),!0)},!1));return f}},a.prototype.resetFormat=function(){var a,b,d,e,f,g,i,j;if(a=null!=(i=this.options.format)?i:c,a||(a="d"),d=h.exec(a),!d)throw new Error("Odometer: Unparsable digit format");return j=d.slice(1,4),g=j[0],f=j[1],b=j[2],e=(null!=b?b.length:void 0)||0,this.format={repeating:g,radix:f,precision:e}},a.prototype.render=function(a){var b,c,d,e,f,g,h;for(null==a&&(a=this.value),this.stopWatchingMutations(),this.resetFormat(),this.inside.innerHTML="",f=this.options.theme,b=this.el.className.split(" "),e=[],g=0,h=b.length;h>g;g++)c=b[g],c.length&&((d=/^odometer-theme-(.+)$/.exec(c))?f=d[1]:/^odometer(-|$)/.test(c)||e.push(c));return e.push("odometer"),p||e.push("odometer-no-transitions"),e.push(f?"odometer-theme-"+f:"odometer-auto-theme"),this.el.className=e.join(" "),this.ribbons={},this.formatDigits(a),this.startWatchingMutations()},a.prototype.formatDigits=function(a){var b,c,d,e,f,g,h,i,j,k,l;if(this.digits=[],this.options.formatFunction)for(e=this.options.formatFunction(a),k=e.split("").reverse(),g=0,i=k.length;i>g;g++)c=k[g],c.match(/0-9/)?(b=this.renderDigit(),b.querySelector(".odometer-value").innerHTML=c,this.digits.push(b),this.insertDigit(b)):this.addSpacer(c);else{for(f=!this.format.precision||!t(a)||!1,d=a.toString();3>d.length;)d="0"+d;for(l=d.split("").reverse(),h=0,j=l.length;j>h;h++)b=l[h],"."===b&&(f=!0),this.addDigit(b,f)}},a.prototype.update=function(a){var b,c=this;return a=this.cleanValue(a),(b=a-this.value)?(v(this.el,"odometer-animating-up odometer-animating-down odometer-animating"),b>0?r(this.el,"odometer-animating-up"):r(this.el,"odometer-animating-down"),this.stopWatchingMutations(),this.animate(a),this.startWatchingMutations(),setTimeout(function(){return c.el.offsetHeight,r(c.el,"odometer-animating")},0),this.value=a):void 0},a.prototype.renderDigit=function(){return s(d)},a.prototype.insertDigit=function(a,b){return null!=b?this.inside.insertBefore(a,b):this.inside.children.length?this.inside.insertBefore(a,this.inside.children[0]):this.inside.appendChild(a)},a.prototype.addSpacer=function(a,b,c){var d;return d=s(g),d.innerHTML=a,c&&r(d,c),this.insertDigit(d,b)},a.prototype.addDigit=function(a,b){var c,d,e,f;if(null==b&&(b=!0),"-"===a)return this.addSpacer(a,null,"odometer-negation-mark");if("."===a)return this.addSpacer(null!=(f=this.format.radix)?f:".",null,"odometer-radix-mark");if(b)for(e=!1;;){if(!this.format.repeating.length){if(e)throw new Error("Bad odometer format without digits");this.resetFormat(),e=!0}if(c=this.format.repeating[this.format.repeating.length-1],this.format.repeating=this.format.repeating.substring(0,this.format.repeating.length-1),"d"===c)break;this.addSpacer(c)}return d=this.renderDigit(),d.querySelector(".odometer-value").innerHTML=a,this.digits.push(d),this.insertDigit(d)},a.prototype.animate=function(a){return p&&"count"!==this.options.animation?this.animateSlide(a):this.animateCount(a)},a.prototype.animateCount=function(a){var c,d,e,f,g,h=this;if(d=+a-this.value)return f=e=u(),c=this.value,(g=function(){var i,j,k;return u()-f>h.options.duration?(h.value=a,h.render(),void z(h.el,"odometerdone")):(i=u()-e,i>b&&(e=u(),k=i/h.options.duration,j=d*k,c+=j,h.render(Math.round(c))),null!=w?w(g):setTimeout(g,b))})()},a.prototype.getDigitCount=function(){var a,b,c,d,e,f;for(d=1<=arguments.length?G.call(arguments,0):[],a=e=0,f=d.length;f>e;a=++e)c=d[a],d[a]=Math.abs(c);return b=Math.max.apply(Math,d),Math.ceil(Math.log(b+1)/Math.log(10))},a.prototype.getFractionalDigitCount=function(){var a,b,c,d,e,f,g;for(e=1<=arguments.length?G.call(arguments,0):[],b=/^\-?\d*\.(\d*?)0*$/,a=f=0,g=e.length;g>f;a=++f)d=e[a],e[a]=d.toString(),c=b.exec(e[a]),null==c?e[a]=0:e[a]=c[1].length;return Math.max.apply(Math,e)},a.prototype.resetDigits=function(){return this.digits=[],this.ribbons=[],this.inside.innerHTML="",this.resetFormat()},a.prototype.animateSlide=function(a){var b,c,d,f,g,h,i,j,k,l,m,n,o,p,q,s,t,u,v,w,x,y,z,B,C,D;if(s=this.value,j=this.getFractionalDigitCount(s,a),j&&(a*=Math.pow(10,j),s*=Math.pow(10,j)),d=a-s){for(this.bindTransitionEnd(),f=this.getDigitCount(s,a),g=[],b=0,m=v=0;f>=0?f>v:v>f;m=f>=0?++v:--v){if(t=A(s/Math.pow(10,f-m-1)),i=A(a/Math.pow(10,f-m-1)),h=i-t,Math.abs(h)>this.MAX_VALUES){for(l=[],n=h/(this.MAX_VALUES+this.MAX_VALUES*b*e),c=t;h>0&&i>c||0>h&&c>i;)l.push(Math.round(c)),c+=n;l[l.length-1]!==i&&l.push(i),b++}else l=function(){D=[];for(var a=t;i>=t?i>=a:a>=i;i>=t?a++:a--)D.push(a);return D}.apply(this);for(m=w=0,y=l.length;y>w;m=++w)k=l[m],l[m]=Math.abs(k%10);g.push(l)}for(this.resetDigits(),g.reverse();3>g.length;)g.push([0]);for(m=x=0,z=g.length;z>x;m=++x)for(l=g[m],this.digits[m]||this.addDigit(" ",m>=j),null==(u=this.ribbons)[m]&&(u[m]=this.digits[m].querySelector(".odometer-ribbon-inner")),this.ribbons[m].innerHTML="",0>d&&(l=l.reverse()),o=C=0,B=l.length;B>C;o=++C)k=l[o],q=document.createElement("div"),q.className="odometer-value",q.innerHTML=k,this.ribbons[m].appendChild(q),o===l.length-1&&r(q,"odometer-last-value"),0===o&&r(q,"odometer-first-value");return 0>t&&this.addDigit("-"),p=this.inside.querySelector(".odometer-radix-mark"),null!=p&&p.parent.removeChild(p),j?this.addSpacer(this.format.radix,this.digits[j-1],"odometer-radix-mark"):void 0}},a}(),m.options=null!=(E=window.odometerOptions)?E:{},setTimeout(function(){var a,b,c,d,e;if(window.odometerOptions){d=window.odometerOptions,e=[];for(a in d)b=d[a],e.push(null!=(c=m.options)[a]?(c=m.options)[a]:c[a]=b);return e}},0),m.init=function(){var a,b,c,d,e,f;if(null!=document.querySelectorAll){for(b=document.querySelectorAll(m.options.selector||".odometer"),f=[],c=0,d=b.length;d>c;c++)a=b[c],f.push(a.odometer=new m({el:a,value:null!=(e=a.innerText)?e:a.textContent}));return f}},null!=(null!=(F=document.documentElement)?F.doScroll:void 0)&&null!=document.createEventObject?(D=document.onreadystatechange,document.onreadystatechange=function(){return"complete"===document.readyState&&m.options.auto!==!1&&m.init(),null!=D?D.apply(this,arguments):void 0}):document.addEventListener("DOMContentLoaded",function(){return m.options.auto!==!1?m.init():void 0},!1),"function"==typeof define&&define.amd?define(["jquery"],function(){return m}):"undefined"!=typeof exports&&null!==exports?module.exports=m:window.Odometer=m}).call(this);
SpriteSheetData = (function()
{
    var ssd = {
        hobo: null,
        dHouse : null,
        cat : null,
        wick : null,
        diamond : null,
        mediumDiamond : null,
        greatDiamond : null,
        rocket : null,
        flame : null,
        smoke : null,
        wind : null
    };
    
    ssd.setValues = function(queue)
    {
            ssd.hobo = {
                "framerate":24,
                "images":[queue.getResult("hobo")],
                "frames":[
                            [0, 0, 256, 256, 0, 128,128],
                            [256, 0, 256, 256, 0, 128,128],
                            [512, 0, 256, 256, 0, 128,128],
                            [768, 0, 256, 256, 0, 128,128],
                            [1024, 0, 256, 256, 0, 128,128],
                            [1280, 0, 256, 256, 0, 128,128],
                            [1536, 0, 256, 256, 0, 128,128],
                            [0, 256, 256, 256, 0, 128,128],
                            [256, 256, 256, 256, 0, 128,128],
                            [512, 256, 256, 256, 0, 128,128],
                            [768, 256, 256, 256, 0, 128,128],
                            [1024, 256, 256, 256, 0, 128,128],
                            [1280, 256, 256, 256, 0, 128,128],
                            [1536, 256, 256, 256, 0, 128,128],
                            [0, 512, 256, 256, 0, 128,128],
                            [256, 512, 256, 256, 0, 128,128],
                            [512, 512, 256, 256, 0, 128,128],
                            [768, 512, 256, 256, 0, 128,128],
                            [1024, 512, 256, 256, 0, 128,128],
                            [1280, 512, 256, 256, 0, 128,128],
                            [1536, 512, 256, 256, 0, 128,128],
                            [0, 768, 256, 256, 0, 128,128],
                            [256, 768, 256, 256, 0, 128,128],
                            [512, 768, 256, 256, 0, 128,128],
                            [768, 768, 256, 256, 0, 128,128],
                            [1024, 768, 256, 256, 0, 128,128],
                            [1280, 768, 256, 256, 0, 128,128],
                            [1536, 768, 256, 256, 0, 128,128],
                            [0, 1024, 256, 256, 0, 128,128],
                            [256, 1024, 256, 256, 0, 128,128],
                            [512, 1024, 256, 256, 0, 128,128],
                            [768, 1024, 256, 256, 0, 128,128],
                            [1024, 1024, 256, 256, 0, 128,128],
                            [1280, 1024, 256, 256, 0, 128,128],
                            [1536, 1024, 256, 256, 0, 128,128],
                            [0, 1280, 256, 256, 0, 128,128],
                            [256, 1280, 256, 256, 0, 128,128],
                            [512, 1280, 256, 256, 0, 128,128],
                            [768, 1280, 256, 256, 0, 128,128],
                            [1024, 1280, 256, 256, 0, 128,128],
                            [1280, 1280, 256, 256, 0, 128,128],
                            [1536, 1280, 256, 256, 0, 128,128],
                            [0, 1536, 256, 256, 0, 128,128],
                            [256, 1536, 256, 256, 0, 128,128],
                            [512, 1536, 256, 256, 0, 128,128],
                            [768, 1536, 256, 256, 0, 128,128],
                            [1024, 1536, 256, 256, 0, 128,128],
                            [1280, 1536, 256, 256, 0, 128,128],
                            [1536, 1536, 256, 256, 0, 128,128],
                            [0, 1792, 256, 256, 0, 128,128]
                ],
                "animations":{"cycle": [0,49],"still":[0]}
            },
            ssd.muteButton = {
                "framerate":24,
                "images":[queue.getResult("mute")],
                "frames":[
                    [0, 0, 64, 64, 0, 0,0],
                    [64, 0, 64, 64, 0, 0, 0]
                ],
                "animations":{
                    "mute":[0],
                    "unmute":[1]
                }
            },
            
            ssd.match = {
                "framerate":8,
                "images":[queue.getResult("match")],
                "frames":[
                    [0, 0, 64, 64, 0, -17, -7],
                    [64, 0, 64, 64, 0, -17, -7],
                    [128, 0, 64, 64, 0, -17, -7],
                    [192, 0, 64, 64, 0, -17, -7]
                ],
                "animations":{
                    "cycle":[0,3]
                }
            },
            
            ssd.dHouse= {
                "framerate":24,
                    "images":[queue.getResult("diamondhouse")],
                "frames":[
                    [0, 0, 128, 128, 0, 0, 0],
                    [128, 0, 128, 128, 0, 0, 0],
                    [256, 0, 128, 128, 0, 0, 0],
                    [384, 0, 128, 128, 0, 0, 0],
                    [512, 0, 128, 128, 0, 0, 0],
                    [640, 0, 128, 128, 0, 0, 0],
                    [768, 0, 128, 128, 0, 0, 0],
                    [896, 0, 128, 128, 0, 0, 0],
                    [1024, 0, 128, 128, 0, 0, 0],
                    [1152, 0, 128, 128, 0, 0, 0]
                ],
                "animations":{
                    "rocketUniversity": {"speed": 1, "frames": [9]},
                    "youthCenter": {"speed": 1, "frames": [2]},
                    "hoboHouse": {"speed": 1, "frames": [0]},
                    "monastery": {"speed": 1, "frames": [7]},
                    "phychiatricWing": {"speed": 1, "frames": [6]},
                    "catnip treatment facility": {"speed": 1, "frames": [4]},
                    "university": {"speed": 1, "frames": [8]},
                    "orphanage": {"speed": 1, "frames": [1]},
                    "hospital": {"speed": 1, "frames": [5]},
                    "summerCamp": {"speed": 1, "frames": [3]}
                }
            };
            ssd.cat = {
                "framerate":24,
                "images":[queue.getResult("cat")],
                "frames":[
                    [0, 0, 256, 256, 0, 128, 128],
                    [256, 0, 256, 256, 0, 128, 128],
                    [512, 0, 256, 256, 0, 128, 128],
                    [768, 0, 256, 256, 0, 128, 128],
                    [1024, 0, 256, 256, 0, 128, 128],
                    [1280, 0, 256, 256, 0, 128, 128],
                    [1536, 0, 256, 256, 0, 128, 128],
                    [0, 256, 256, 256, 0, 128, 128],
                    [256, 256, 256, 256, 0, 128, 128],
                    [512, 256, 256, 256, 0, 128, 128],
                    [768, 256, 256, 256, 0, 128, 128],
                    [1024, 256, 256, 256, 0, 128, 128],
                    [1280, 256, 256, 256, 0, 128, 128],
                    [1536, 256, 256, 256, 0, 128, 128],
                    [0, 512, 256, 256, 0, 128, 128],
                    [256, 512, 256, 256, 0, 128, 128],
                    [512, 512, 256, 256, 0, 128, 128],
                    [768, 512, 256, 256, 0, 128, 128],
                    [1024, 512, 256, 256, 0, 128, 128],
                    [1280, 512, 256, 256, 0, 128, 128],
                    [1536, 512, 256, 256, 0, 128, 128]
                ],
                "animations":{
                    "flying": {"speed": 1, "frames": [19, 20]},
                        "cycle": [0,17],"still":[0]
                }
            };
            ssd.supportingCharacter = {
            "framerate":24,
            "images":[queue.getResult("supportingCharacter")],
            "frames":[
                [0, 0, 128, 256, 0, 0, 0],
                [128, 0, 128, 256, 0, 0, 0],
                [256, 0, 128, 256, 0, 0, 0],
                [384, 0, 128, 256, 0, 0, 0],
                [512, 0, 128, 256, 0, 0, 0],
                [640, 0, 128, 256, 0, 0, 0],
                [768, 0, 128, 256, 0, 0, 0],
                [896, 0, 128, 256, 0, 0, 0],
                [1024, 0, 128, 256, 0, 0, 0],
                [1152, 0, 128, 256, 0, 0, 0],
                [1280, 0, 128, 256, 0, 0, 0],
                [1408, 0, 128, 256, 0, 0, 0],
                [1536, 0, 128, 256, 0, 0, 0],
                [1664, 0, 128, 256, 0, 0, 0],
                [1792, 0, 128, 256, 0, 0, 0],
                [0, 256, 128, 256, 0, 0, 0],
                [128, 256, 128, 256, 0, 0, 0],
                [256, 256, 128, 256, 0, 0, 0],
                [384, 256, 128, 256, 0, 0, 0],
                [512, 256, 128, 256, 0, 0, 0],
                [640, 256, 128, 256, 0, 0, 0],
                [768, 256, 128, 256, 0, 0, 0],
                [896, 256, 128, 256, 0, 0, 0],
                [1024, 256, 128, 256, 0, 0, 0],
                [1152, 256, 128, 256, 0, 0, 0],
                [1280, 256, 128, 256, 0, 0, 0],
                [1408, 256, 128, 256, 0, 0, 0],
                [1536, 256, 128, 256, 0, 0, 0],
                [1664, 256, 128, 256, 0, 0, 0],
                [1792, 256, 128, 256, 0, 0, 0],
                [0, 512, 128, 256, 0, 0, 0],
                [128, 512, 128, 256, 0, 0, 0],
                [256, 512, 128, 256, 0, 0, 0],
                [384, 512, 128, 256, 0, 0, 0],
                [512, 512, 128, 256, 0, 0, 0],
                [640, 512, 128, 256, 0, 0, 0],
                [768, 512, 128, 256, 0, 0, 0],
                [896, 512, 128, 256, 0, 0, 0],
                [1024, 512, 128, 256, 0, 0, 0],
                [1152, 512, 128, 256, 0, 0, 0],
                [1280, 512, 128, 256, 0, 0, 0],
                [1408, 512, 128, 256, 0, 0, 0],
                [1536, 512, 128, 256, 0, 0, 0],
                [1664, 512, 128, 256, 0, 0, 0],
                [1792, 512, 128, 256, 0, 0, 0]
            ],
            "animations":{
                "cat party": {
                    "frames": [14,15,16,17,
                        18,19,20,21,22,23,24,25,26,27,28,29],
                    "speed": 1
                },
                "timmy": {
                    "frames": [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
                    "speed": 1
                },
                "priest": {
                    "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                    "speed": 1
                }
            }
            };
            ssd.wick = {
                "framerate":24,
                "images":[queue.getResult("wick")],
                "frames":[
                    [0, 0, 128, 64, 0, -237, -166],
                    [128, 0, 128, 64, 0, -237, -166],
                    [256, 0, 128, 64, 0, -237, -166],
                    [384, 0, 128, 64, 0, -237, -166],
                    [512, 0, 128, 64, 0, -237, -166],
                    [640, 0, 128, 64, 0, -237, -166],
                    [768, 0, 128, 64, 0, -237, -166],
                    [896, 0, 128, 64, 0, -237, -166],
                    [1024, 0, 128, 64, 0, -237, -166],
                    [1152, 0, 128, 64, 0, -237, -166],
                    [1280, 0, 128, 64, 0, -237, -166],
                    [1408, 0, 128, 64, 0, -237, -166],
                    [1536, 0, 128, 64, 0, -237, -166],
                    [1664, 0, 128, 64, 0, -237, -166],
                    [1792, 0, 128, 64, 0, -237, -166],
                    [0, 64, 128, 64, 0, -237, -166],
                    [128, 64, 128, 64, 0, -237, -166],
                    [256, 64, 128, 64, 0, -237, -166],
                    [384, 64, 128, 64, 0, -237, -166],
                    [512, 64, 128, 64, 0, -237, -166],
                    [640, 64, 128, 64, 0, -237, -166],
                    [768, 64, 128, 64, 0, -237, -166],
                    [896, 64, 128, 64, 0, -237, -166],
                    [1024, 64, 128, 64, 0, -237, -166],
                    [1152, 64, 128, 64, 0, -237, -166],
                    [1280, 64, 128, 64, 0, -237, -166],
                    [1408, 64, 128, 64, 0, -237, -166],
                    [1536, 64, 128, 64, 0, -237, -166],
                    [1664, 64, 128, 64, 0, -237, -166],
                    [1792, 64, 128, 64, 0, -237, -166],
                    [0, 128, 128, 64, 0, -237, -166],
                    [128, 128, 128, 64, 0, -237, -166],
                    [256, 128, 128, 64, 0, -237, -166],
                    [384, 128, 128, 64, 0, -237, -166],
                    [512, 128, 128, 64, 0, -237, -166],
                    [640, 128, 128, 64, 0, -237, -166]
                ],
                "animations":{"cycle": [0,35],"still": [0]}
            };
            
            ssd.onlookers ={
                "framerate":5,
                "images":[queue.getResult("onlookers")],
                "frames":[
                    [0, 0, 256, 128, 0, 0, -1],
                    [256, 0, 256, 128, 0, 0, -1],
                    [512, 0, 256, 128, 0, 0, -1],
                    [768, 0, 256, 128, 0, 0, -1],
                    [1024, 0, 256, 128, 0, 0, -1],
                    [1280, 0, 256, 128, 0, 0, -1],
                    [1536, 0, 256, 128, 0, 0, -1],
                    [0, 128, 256, 128, 0, 0, -1],
                    [256, 128, 256, 128, 0, 0, -1],
                    [512, 128, 256, 128, 0, 0, -1],
                    [768, 128, 256, 128, 0, 0, -1],
                    [1024, 128, 256, 128, 0, 0, -1]
                ],
                "animations":{
                    "angry mob": {"speed": 1, "frames": [3, 4, 5]},
                    "orphans": {"speed": 1, "frames": [9, 10, 11]},
                    "loving mob": {"speed": 1, "frames": [6, 7, 8]},
                    "cat party": {"speed": 1, "frames": [0, 1, 2]}
                }
            };

            ssd.diamond = {
                "framerate":24,
                "images":[queue.getResult("diamond")],
                "frames":[
                    [0, 0, 128, 128, 0, 64,64],
                    [128, 0, 128, 128, 0, 64,64],
                    [256, 0, 128, 128, 0, 64,64],
                    [384, 0, 128, 128, 0, 64,64],
                    [512, 0, 128, 128, 0, 64,64],
                    [640, 0, 128, 128, 0, 64,64],
                    [768, 0, 128, 128, 0, 64,64],
                    [896, 0, 128, 128, 0, 64,64],
                    [1024, 0, 128, 128, 0, 64,64],
                    [1152, 0, 128, 128, 0, 64,64],
                    [1280, 0, 128, 128, 0, 64,64],
                    [1408, 0, 128, 128, 0, 64,64],
                    [1536, 0, 128, 128, 0, 64,64],
                    [1664, 0, 128, 128, 0, 64,64],
                    [1792, 0, 128, 128, 0, 64,64],
                    [0, 128, 128, 128, 0, 64,64],
                    [128, 128, 128, 128, 0, 64,64],
                    [256, 128, 128, 128, 0, 64,64],
                    [384, 128, 128, 128, 0, 64,64],
                    [512, 128, 128, 128, 0, 64,64],
                    [640, 128, 128, 128, 0, 64,64],
                    [768, 128, 128, 128, 0, 64,64],
                    [896, 128, 128, 128, 0, 64,64],
                    [1024, 128, 128, 128, 0, 64,64],
                    [1152, 128, 128, 128, 0, 64,64]
                ],
                "animations":{"cycle": [0,24]}
            };            
            
            ssd.greatDiamond = {
                "framerate":24,
                "images":[queue.getResult("greatDiamond")],
                "frames":[
                    [0, 0, 128, 128, 0, 75,64],
                    [128, 0, 128, 128, 0, 75,64],
                    [256, 0, 128, 128, 0, 75,64],
                    [384, 0, 128, 128, 0, 75,64],
                    [512, 0, 128, 128, 0, 75,64],
                    [640, 0, 128, 128, 0, 75,64],
                    [768, 0, 128, 128, 0, 75,64],
                    [896, 0, 128, 128, 0, 75,64],
                    [1024, 0, 128, 128, 0, 75,64],
                    [1152, 0, 128, 128, 0, 75,64],
                    [1280, 0, 128, 128, 0, 75,64],
                    [1408, 0, 128, 128, 0, 75,64],
                    [1536, 0, 128, 128, 0, 75,64],
                    [1664, 0, 128, 128, 0, 75,64],
                    [1792, 0, 128, 128, 0, 75,64],
                    [0, 128, 128, 128, 0, 75,64],
                    [128, 128, 128, 128, 0, 75,64],
                    [256, 128, 128, 128, 0, 75,64],
                    [384, 128, 128, 128, 0, 75,64],
                    [512, 128, 128, 128, 0, 75,64],
                    [640, 128, 128, 128, 0, 75,64],
                    [768, 128, 128, 128, 0, 75,64],
                    [896, 128, 128, 128, 0, 75,64],
                    [1024, 128, 128, 128, 0, 75,64],
                    [1152, 128, 128, 128, 0, 75,64]
                ],
                "animations":{"greatCycle": [0,24]}
            };
            
            ssd.hudGlass = {
                "framerate":24,
                "images":[queue.getResult("hudGlass")],
                "frames":[[0, 0, 128, 128, 0, -196, -14],
                        [128, 0, 128, 128, 0, -196, -14],
                        [256, 0, 128, 64, 0, -196, -14]],
                "animations":{
                    "still":[0],
                    "frenzy":[0,1], 
                    "outOfFuel":{
                        frames:[2],
                        speed: 0.3,
                        next:  "still"
                    }
                }
            };
            
            ssd.rocket = {
                "framerate":24,
                "images":[queue.getResult("rocketCatz")],
                "frames":[
                            [0, 0, 256, 128, 0, 0,-68],
                            [256, 0, 256, 128, 0, 0,-68],
                            [512, 0, 256, 128, 0, 0,-68],
                            [768, 0, 256, 128, 0, 0,-68],
                            [1024, 0, 256, 128, 0, 0,-68],
                            [1280, 0, 256, 128, 0, 0,-68],
                            [1536, 0, 256, 128, 0, 0,-68],
                            [0, 128, 256, 128, 0, 0,-68],
                            [256, 128, 256, 128, 0, 0,-68],
                            [512, 128, 256, 128, 0, 0,-68],
                            [768, 128, 256, 128, 0, 0,-68],
                            [1024, 128, 256, 128, 0, 0,-68],
                            [1280, 128, 256, 128, 0, 0,-68],
                            [1536, 128, 256, 128, 0, 0,-68],
                            [0, 256, 256, 128, 0, 0,-68],
                            [256, 256, 256, 128, 0, 0,-68],
                            [512, 256, 256, 128, 0, 0,-68],
                            [768, 256, 256, 128, 0, 0,-68],
                            [1024, 256, 256, 128, 0, 0,-68],
                            [1280, 256, 256, 128, 0, 0,-68],
                            [1536, 256, 256, 128, 0, 0,-68],
                            [0, 384, 256, 128, 0, -75,-68],
                            [256, 384, 256, 128, 0, -75,-68],
                            [512, 384, 256, 128, 0, -75,-68],
                            [768, 384, 256, 128, 0, -75,-68],
                            [1024, 384, 256, 128, 0, -75,-68],
                            [1280, 384, 256, 128, 0, -75,-68],
                            [1536, 384, 256, 128, 0, -75,-68],
                            [0, 512, 256, 128, 0, -75,-68],
                            [256, 512, 256, 128, 0, 0,-68],
                            [512, 512, 256, 128, 0, 0,-68],
                            [768, 512, 256, 128, 0, 0,-68],
                            [1024, 512, 256, 128, 0, 0,-68]
                        ],
                "animations":{
                    "frenzy": {"speed": 1, "frames": [20, 21, 22, 23, 24, 25, 26, 27, 28]},
                    "shake": {
                        "speed": 1,
                        "frames": [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
                    },
                    "no shake": {"speed": 1, "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
                    "frenzy ready": {"speed": 1, "frames": [29, 30]},
                    "flying": {"speed": 0.5, "frames": [31, 32]},
                    "slipping": {"speed": 1, "frames": [32]}
                }
            };
            ssd.flame = {
                "framerate":24,
                "images":[queue.getResult("flame")],
                "frames":[
                       [0, 0, 128, 128, 0, 64, 64],
                        [128, 0, 128, 128, 0, 64, 64],
                        [256, 0, 128, 128, 0, 64, 64],
                        [384, 0, 128, 128, 0, 64, 64],
                        [512, 0, 128, 128, 0, 64, 64],
                        [640, 0, 128, 128, 0, 64, 64],
                        [768, 0, 128, 128, 0, 64, 64],
                        [896, 0, 128, 128, 0, 64, 64],
                        [1024, 0, 128, 128, 0, 64, 64],
                        [1152, 0, 128, 128, 0, 64, 64],
                        [1280, 0, 128, 128, 0, 64, 64],
                        [1408, 0, 128, 128, 0, 64, 64],
                        [1536, 0, 128, 128, 0, 64, 64],
                        [1664, 0, 128, 128, 0, 64, 64],
                        [1792, 0, 128, 128, 0, 64, 64],
                        [0, 128, 128, 128, 0, 64, 64],
                        [128, 128, 128, 128, 0, 64, 64],
                        [256, 128, 128, 128, 0, 64, 64],
                        [384, 128, 128, 128, 0, 64, 64],
                        [512, 128, 128, 128, 0, 64, 64],
                        [640, 128, 128, 128, 0, 64, 64],
                        [768, 128, 128, 128, 0, 64, 64],
                        [896, 128, 128, 128, 0, 64, 64],
                        [1024, 128, 128, 128, 0, 64, 64],
                        [1152, 128, 128, 128, 0, 64, 64],
                        [1280, 128, 128, 128, 0, 64, 64],
                        [1408, 128, 128, 128, 0, 64, 64],
                        [1536, 128, 128, 128, 0, 64, 64],
                        [1664, 128, 128, 128, 0, 64, 64],
                        [1792, 128, 128, 128, 0, 64, 64],
                        [0, 256, 128, 128, 0, 64, 64],
                        [128, 256, 128, 128, 0, 64, 64],
                        [256, 256, 128, 128, 0, 64, 64],
                        [384, 256, 128, 128, 0, 64, 64],
                        [512, 256, 128, 128, 0, 64, 64],
                        [640, 256, 128, 128, 0, 64, 64]
                    ],
                "animations": {             
                    "ignite":{frames:[0,1,2,3,4,5],next:"cycle",speed:1.5}, 
                    "cycle": {frames:[6,7,8,9,10,11,12,13,14,15,16,17,18],next:"cycle"}
                }
            };
            ssd.smoke = {
                "framerate":24,
                "images":[queue.getResult("smokepuffs")],
                "frames":[
                    [0, 0, 256, 256, 0, -83, -164],
                    [256, 0, 256, 256, 0, -83, -164],
                    [512, 0, 256, 256, 0, -83, -164],
                    [768, 0, 256, 256, 0, -83, -164],
                    [1024, 0, 256, 256, 0, -83, -164],
                    [1280, 0, 256, 256, 0, -83, -164],
                    [1536, 0, 256, 256, 0, -83, -164],
                    [0, 256, 256, 256, 0, -83, -164],
                    [256, 256, 256, 256, 0, -83, -164],
                    [512, 256, 256, 256, 0, -83, -164],
                    [768, 256, 256, 256, 0, -83, -164],
                    [1024, 256, 256, 256, 0, -83, -164],
                    [1280, 256, 256, 256, 0, -83, -164],
                    [1536, 256, 256, 256, 0, -83, -164],
                    [0, 512, 256, 256, 0, -83, -164],
                    [256, 512, 256, 256, 0, -83, -164],
                    [512, 512, 256, 256, 0, -83, -164],
                    [768, 512, 256, 256, 0, -83, -164],
                    [1024, 512, 256, 256, 0, -83, -164],
                    [1280, 512, 256, 256, 0, -83, -164]
                ],
                "animations":{
                    "right": {
                        "frames": [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                        "speed": 1
                    },
                    "jump": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "speed": 1},
                    }
            };
            ssd.leaves = {
                "framerate":24,
                "images":[queue.getResult("leaves")],
                "frames":[
                    [0, 0, 256, 128, 0, 0,0],
                    [256, 0, 256, 128, 0, 0,0],
                    [512, 0, 256, 128, 0, 0,0],
                    [768, 0, 256, 128, 0, 0,0],
                    [1024, 0, 256, 128, 0, 0,0],
                    [1280, 0, 256, 128, 0, 0,0],
                    [1536, 0, 256, 128, 0, 0,0],
                    [0, 128, 256, 128, 0, 0,0],
                    [256, 128, 256, 128, 0, 0,0],
                    [512, 128, 256, 128, 0, 0,0],
                    [768, 128, 256, 128, 0, 0,0],
                    [1024, 128, 256, 128, 0, 0,0],
                    [1280, 128, 256, 128, 0, 0,0],
                    [1536, 128, 256, 128, 0, 0,0],
                    [0, 256, 256, 128, 0, 0,0],
                    [256, 256, 256, 128, 0, 0,0],
                    [512, 256, 256, 128, 0, 0,0],
                    [768, 256, 256, 128, 0, 0,0],
                    [1024, 256, 256, 128, 0, 0,0],
                    [1280, 256, 256, 128, 0, 0,0],
                    [1536, 256, 256, 128, 0, 0,0],
                    [0, 384, 256, 128, 0, 0,0],
                    [256, 384, 256, 128, 0, 0,0],
                    [512, 384, 256, 128, 0, 0,0],
                    [768, 384, 256, 128, 0, 0,0],
                    [1024, 384, 256, 128, 0, 0,0],
                    [1280, 384, 256, 128, 0, 0,0],
                    [1536, 384, 256, 128, 0, 0,0]
                ],
                "animations":{"cycle":[0,27]}
            };
            ssd.enemybirds = {
                 images: [queue.getResult("enemybirds")],
                "framerate":10,
                "frames":[
                    [0, 0, 512, 512, 0, 155,170],
                    [512, 0, 512, 512, 0, 155,170],
                    [1024, 0, 512, 512, 0, 155,170],
                    [1536, 0, 512, 512, 0, 155,170],
                    [2048, 0, 512, 512, 0, 155,170],
                    [2560, 0, 512, 512, 0, 155,170],
                    [3072, 0, 512, 512, 0, 155,170],
                    [0, 512, 512, 512, 0, 155,170],
                    [512, 512, 512, 512, 0, 155,170],
                    [1024, 512, 512, 512, 0, 155,170],
                    [1536, 512, 512, 512, 0, 155,170],
                    [2048, 512, 512, 512, 0, 155,170],
                    [2560, 512, 512, 512, 0, 155,170],
                    [3072, 512, 512, 512, 0, 155,170],
                    [0, 1024, 512, 512, 0, 155,170],
                    [512, 1024, 512, 512, 0, 155,170],
                    [1024, 1024, 512, 512, 0, 155,170],
                    [1536, 1024, 512, 512, 0, 155,170],
                    [2048, 1024, 512, 512, 0, 155,170],
                    [2560, 1024, 512, 512, 0, 155,170],
                    [3072, 1024, 512, 512, 0, 155,170]
                ],
                "animations":{
                    "chicken": {"speed": 1, "frames": [20]},
                    "falcon": {"speed": 1, "frames": [12, 13, 14, 15]},
                    "crow": {"speed": 1, "frames": [0, 1, 2, 3]},
                    "bat": {"speed": 1, "frames": [4, 5, 6, 7]},
                    "duck": {"speed": 1, "frames": [8, 9, 10, 11]},
                    "seagull": {"speed": 1, "frames": [18, 19]},
                    "glasses": {"speed": 1, "frames": [16, 17]}
                }
            };
            ssd.wind = {
                "framerate":24,
                "images":[queue.getResult("wind")],
                "frames":[
                    [0, 0, 64, 64, 0, 32, 32],
                    [64, 0, 64, 64, 0, 32, 32],
                    [128, 0, 64, 64, 0, 32, 32],
                    [192, 0, 64, 64, 0, 32, 32],
                    [256, 0, 64, 64, 0, 32, 32],
                    [320, 0, 64, 64, 0, 32, 32],
                    [384, 0, 64, 64, 0, 32, 32],
                    [448, 0, 64, 64, 0, 32, 32],
                    [512, 0, 64, 64, 0, 32, 32],
                    [576, 0, 64, 64, 0, 32, 32],
                    [640, 0, 64, 64, 0, 32, 32],
                    [704, 0, 64, 64, 0, 32, 32],
                    [768, 0, 64, 64, 0, 32, 32],
                    [832, 0, 64, 64, 0, 32, 32],
                    [896, 0, 64, 64, 0, 32, 32]
                ],
                "animations":{
                    "cycle": [0,14]
                }
            };
        };
        return ssd;
    })();


function ThunderCloud(img) 
{
    this.initialize(img);
}
//inheritance
ThunderCloud.prototype = new createjs.Bitmap();
ThunderCloud.prototype.CloudInit = ThunderCloud.prototype.initialize;

//props
ThunderCloud.prototype.hasFired = false;
ThunderCloud.prototype.height = 0;
ThunderCloud.prototype.width = 0;
ThunderCloud.prototype.cloud = new createjs.Bitmap();
ThunderCloud.prototype.temperature = 0;

//constructor
ThunderCloud.prototype.initialize = function(img) 
{
    this.CloudInit(img);
    //ThunderCloud.prototype.height = height;
    //ThunderCloud.prototype.width = width;
};



function Cloud(img) 
{
    this.initialize(img);
}
//inheritance
Cloud.prototype = new createjs.Bitmap();
Cloud.prototype.CloudInit = Cloud.prototype.initialize;

//props
Cloud.prototype.catzIsInside = false;

//constructor
Cloud.prototype.initialize = function(img) 
{
    this.CloudInit(img);
    //ThunderCloud.prototype.height = height;
    //ThunderCloud.prototype.width = width;
};

var TrackParts = {
    "easy" : 
            { 
                "w1lvl1!":
                [					                
					{"x":0,"y":150,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":30,"y":180,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":30,"y":120,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":50,"y":150,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},   
					{"x":70,"y":120,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":70,"y":180,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":100,"y":150,"type":"diamond","animation":"cycle", "graphicType":"sprite"},                    										               
										   
					{"x":1000,"y":130,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":1030,"y":160,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":1030,"y":100,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":1050,"y":130,"type":"greatDiamond","animation":"greatCycle","graphicType":"sprite"},    
					{"x":1070,"y":100,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":1070,"y":160,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":1100,"y":130,"type":"diamond","animation":"cycle", "graphicType":"sprite"},                    
                    
					
					{"x":2000,"y":110,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":2030,"y":140,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":2030,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":2050,"y":110,"type":"greatDiamond","animation":"greatCycle","graphicType":"sprite"},        
					{"x":2070,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":2070,"y":140,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":2100,"y":110,"type":"diamond","animation":"cycle", "graphicType":"sprite"},                    					                    
					
					{"x":2000,"y":110,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":2030,"y":140,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":2030,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":2050,"y":110,"type":"greatDiamond","animation":"greatCycle","graphicType":"sprite"},        
					{"x":2070,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":2070,"y":140,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":2100,"y":110,"type":"diamond","animation":"cycle", "graphicType":"sprite"},                    					                    
					
					{"x":4000,"y":20,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":4030,"y":50,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":4030,"y":-10,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":4050,"y":20,"type":"greatDiamond","animation":"greatCycle","graphicType":"sprite"},    
					{"x":4070,"y":-10,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":4070,"y":50,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					{"x":4100,"y":20,"type":"diamond","animation":"cycle", "graphicType":"sprite"}            					                    
                ],
                				
				"w1lvl2":
                [					
					{"x":300,"y":680,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":400,"y":580,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":500,"y":480,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":600,"y":380,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":700,"y":280,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":800,"y":180,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":900,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
					
                    {"x":	1062.25701405	, "y":	-6.52635236	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1125.9907573	, "y":	-31.33121883	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1269.7326906	, "y":	-76.08854442	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1350.9905274	, "y":	-196.6914816	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1418.2035123	, "y":	-267.667282	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1456.2628025	, "y":	-342.6312799	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1462.9751187	, "y":	-415.1770559	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1433.5561625	, "y":	-478.6007669	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1386.002438	, "y":	-516.4105943	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1329.1994816	, "y":	-528.3956859	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1276.2562051	, "y":	-513.2310894	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1237.8197927	, "y":	-473.157281	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1225.2364304	, "y":	-411.9219154	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1244.7922799	, "y":	-339.7600216	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1296.2755166	, "y":	-274.1601402	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1372.2007193	, "y":	-215.620014	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1469.3304597	, "y":	-166.6490658	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1590.8224944	, "y":	-120.9453239	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1657.9293147	, "y":	-107.6224837	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1724.7446863	, "y":	-92.2939771	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1791.4098309	, "y":	-75.03864139	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1856.1211905	, "y":	-56.01061641	,type:"diamond","animation":"cycle","graphicType":"sprite"},               
					//
					
					{"x":2500,"y":240,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":2500,"y":-360,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":2800,"y":140,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":2800,"y":-260,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":3200,"y":40,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":3200,"y":-160,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
                    {"x":	3500	, "y":	-60.	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},										
					{"x":	4500	, "y":	-60.	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},					
					{"x":	5500	, "y":	-60.	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},					
										
					{"x":8300,"y":680,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":8400,"y":580,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":8500,"y":480,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":8600,"y":380,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":8700,"y":280,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":8800,"y":180,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":8900,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					
					{"x":	9062.25701405	, "y":	-26.52635236	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9125.9907573	, "y":	-51.33121883	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	9269.7326906	, "y":	-96.08854442	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9350.9905274	, "y":	-216.6914816	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	9418.2035123	, "y":	-287.667282	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9456.2628025	, "y":	-362.6312799	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	9462.9751187	, "y":	-435.1770559	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9433.5561625	, "y":	-498.6007669	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	9386.002438		, "y":	-536.4105943	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9329.1994816	, "y":	-548.3956859	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	9276.2562051	, "y":	-533.2310894	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9237.8197927	, "y":	-493.157281	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	9225.2364304	, "y":	-431.9219154	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9244.7922799	, "y":	-359.7600216	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	9296.2755166	, "y":	-294.1601402	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9372.2007193	, "y":	-235.620014	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	9469.3304597	, "y":	-186.6490658	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9590.8224944	, "y":	-140.9453239	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	9657.9293147	, "y":	-127.6224837	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9724.7446863	, "y":	-112.2939771	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	9791.4098309	, "y":	-95.03864139	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	9856.1211905	, "y":	-76.01061641	,type:"diamond","animation":"cycle","graphicType":"sprite"},
					//									
					
					{"x":12500,"y":240,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":12500,"y":-360,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":12800,"y":140,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":12800,"y":-260,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":13200,"y":40,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":13200,"y":-160,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
                    {"x":	13500	, "y":	-60.	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},										
					{"x":	14500	, "y":	-60.	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},					
					{"x":	15500	, "y":	-60.	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},					
					
					{"x":16300,"y":680,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":16400,"y":580,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":16500,"y":480,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":16600,"y":380,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":16700,"y":280,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":16800,"y":180,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":16900,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},						
					
					{"x":	17062.25701405	, "y":	-26.52635236	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17125.9907573	, "y":	-51.33121883	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	17269.7326906	, "y":	-96.08854442	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17350.9905274	, "y":	-216.6914816	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	17418.2035123	, "y":	-287.667282	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17456.2628025	, "y":	-362.6312799	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	17462.9751187	, "y":	-435.1770559	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17433.5561625	, "y":	-498.6007669	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	17386.002438	, "y":	-536.4105943	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17329.1994816	, "y":	-548.3956859	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	17276.2562051	, "y":	-533.2310894	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17237.8197927	, "y":	-493.157281	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	17225.2364304	, "y":	-431.9219154	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17244.7922799	, "y":	-359.7600216	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	17296.2755166	, "y":	-294.1601402	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17372.2007193	, "y":	-235.620014	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	17469.3304597	, "y":	-186.6490658	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17590.8224944	, "y":	-140.9453239	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	17657.9293147	, "y":	-127.6224837	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17724.7446863	, "y":	-112.2939771	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	17791.4098309	, "y":	-95.03864139	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	17856.1211905	, "y":	-76.01061641	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
					//
					{"x":20500,"y":240,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":20500,"y":-360,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":20800,"y":140,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":20800,"y":-260,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":21200,"y":40,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":21200,"y":-160,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":	21500	, "y":	-30.	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
					{"x":	22500	, "y":	-30.	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
					{"x":	23500	, "y":	-30.	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"}],																			
				
				"w1lvl3":
                [
					{"x":300,"y":680,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":400,"y":580,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":500,"y":480,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":600,"y":380,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":700,"y":280,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":800,"y":180,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":900,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},	
					
                    {"x":	1062.25701405	, "y":	-6.52635236	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1125.9907573	, "y":	-31.33121883	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1269.7326906	, "y":	-76.08854442	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1350.9905274	, "y":	-196.6914816	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1418.2035123	, "y":	-267.667282	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1456.2628025	, "y":	-342.6312799	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1462.9751187	, "y":	-415.1770559	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1433.5561625	, "y":	-478.6007669	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1386.002438	, "y":	-516.4105943	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1329.1994816	, "y":	-528.3956859	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1276.2562051	, "y":	-513.2310894	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1237.8197927	, "y":	-473.157281	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1225.2364304	, "y":	-411.9219154	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1244.7922799	, "y":	-339.7600216	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1296.2755166	, "y":	-274.1601402	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	1372.2007193	, "y":	-215.620014	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1469.3304597	, "y":	-166.6490658	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1590.8224944	, "y":	-120.9453239	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1657.9293147	, "y":	-107.6224837	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1724.7446863	, "y":	-92.2939771	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1791.4098309	, "y":	-75.03864139	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1856.1211905	, "y":	-56.01061641	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
					
					
					{"x":2300,"y":680,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":2400,"y":580,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":2500,"y":480,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":2600,"y":380,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":2700,"y":280,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":2800,"y":180,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":2900,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},	
					
					{"x":	3062.25701405	, "y":	-6.52635236	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	3125.9907573	, "y":	-31.33121883	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3269.7326906	, "y":	-76.08854442	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3350.9905274	, "y":	-196.6914816	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3418.2035123	, "y":	-267.667282	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	3456.2628025	, "y":	-342.6312799	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3462.9751187	, "y":	-415.1770559	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3433.5561625	, "y":	-478.6007669	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3386.002438	, "y":	-516.4105943	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3329.1994816	, "y":	-528.3956859	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	3276.2562051	, "y":	-513.2310894	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3237.8197927	, "y":	-473.157281	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3225.2364304	, "y":	-411.9219154	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3244.7922799	, "y":	-339.7600216	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3296.2755166	, "y":	-274.1601402	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	3372.2007193	, "y":	-215.620014	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3469.3304597	, "y":	-166.6490658	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3590.8224944	, "y":	-120.9453239	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3657.9293147	, "y":	-107.6224837	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3724.7446863	, "y":	-92.2939771	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3791.4098309	, "y":	-75.03864139	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	3856.1211905	, "y":	-56.01061641	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
					//
					
					{"x":5300,"y":680,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":5400,"y":580,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":5500,"y":480,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":5600,"y":380,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":5700,"y":280,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":5800,"y":180,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":5900,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},	
					{"x":	6062.25701405	, "y":	-6.52635236	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	6125.9907573	, "y":	-31.33121883	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6269.7326906	, "y":	-76.08854442	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6350.9905274	, "y":	-196.6914816	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6418.2035123	, "y":	-267.667282	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6456.2628025	, "y":	-342.6312799	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6462.9751187	, "y":	-415.1770559	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6433.5561625	, "y":	-478.6007669	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6386.002438	, "y":	-516.4105943	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6329.1994816	, "y":	-528.3956859	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	6276.2562051	, "y":	-513.2310894	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6237.8197927	, "y":	-473.157281	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6225.2364304	, "y":	-411.9219154	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6244.7922799	, "y":	-339.7600216	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6296.2755166	, "y":	-274.1601402	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6372.2007193	, "y":	-215.620014	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6469.3304597	, "y":	-166.6490658	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6590.8224944	, "y":	-120.9453239	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6657.9293147	, "y":	-107.6224837	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6724.7446863	, "y":	-92.2939771	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6791.4098309	, "y":	-75.03864139	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	6856.1211905	, "y":	-56.01061641	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
					//
					{"x":7100,"y":240,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":7100,"y":-360,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":7400,"y":140,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":7400,"y":-260,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":7700,"y":40,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":7700,"y":-160,"type":"diamond","animation":"cycle", "graphicType":"sprite"},	
					{"x":	7856.1211905	, "y":	-36.01061641	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
					{"x":	8856.1211905	, "y":	-16.01061641	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
					
					{"x":9300,"y":680,"type":"diamond","animation":"cycle", "graphicType":"sprite"},										
					{"x":9400,"y":580,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":9500,"y":480,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":9600,"y":380,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":9700,"y":280,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":9800,"y":180,"type":"diamond","animation":"cycle", "graphicType":"sprite"},					
					{"x":9900,"y":80,"type":"diamond","animation":"cycle", "graphicType":"sprite"},	
					
					{"x":	10062.25701405	, "y":	-6.52635236	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	10125.9907573	, "y":	-31.33121883	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10269.7326906	, "y":	-76.08854442	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10350.9905274	, "y":	-196.6914816	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10418.2035123	, "y":	-267.667282	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10456.2628025	, "y":	-342.6312799	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10462.9751187	, "y":	-415.1770559	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10433.5561625	, "y":	-478.6007669	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10386.002438	, "y":	-516.4105943	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10329.1994816	, "y":	-528.3956859	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
                    {"x":	10276.2562051	, "y":	-513.2310894	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10237.8197927	, "y":	-473.157281	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10225.2364304	, "y":	-411.9219154	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10244.7922799	, "y":	-339.7600216	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10296.2755166	, "y":	-274.1601402	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10372.2007193	, "y":	-215.620014	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10469.3304597	, "y":	-166.6490658	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10590.8224944	, "y":	-120.9453239	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10657.9293147	, "y":	-107.6224837	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10724.7446863	, "y":	-92.2939771	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10791.4098309	, "y":	-75.03864139	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	10856.1211905	, "y":	-56.01061641	,type:"greatDiamond","animation":"greatCycle","graphicType":"sprite"},               															
					
					{"x":11100,"y":150,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},										
					{"x":11100,"y":-450,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},										
					{"x":11400,"y":50,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},										
					{"x":11400,"y":-350,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},										
					{"x":11700,"y":-50,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},										
					{"x":11700,"y":-250,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},	
					
					{"x":12000,"y":-150,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},
					{"x":12030,"y":-120,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},
					{"x":12030,"y":-180,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},					
					{"x":12050,"y":-150,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},   
					{"x":12070,"y":-180,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},
					{"x":12070,"y":-120,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"},
					{"x":12100,"y":-150,"type":"greatDiamond","animation":"greatCycle", "graphicType":"sprite"}     
                ],
				
				"w1lvl1":[ //w2lvl1
					{"x":514.0206557884812, "y":49.2189986249432,"type":"greatDiamond","animation":"greatCycle","graphicType":"sprite"},
					{"x":1030.7334615699947, "y":-327.76085234060884,"type":"attackBird","animation":"seagull","graphicType":"attackBird"},
					{"x":946.8189763976261, "y":-91.78824791032821,"type":"greatDiamond","animation":"greatCycle","graphicType":"sprite"}
				],
				
                "horizontalLine":
                [
                    {"x":50,"y":0,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
                    {"x":100,"y":0,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
                    {"x":150,"y":0,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":200,"y":0,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":250,"y":0,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":300,"y":0,"type":"diamond","animation":"cycle","graphicType":"sprite"}
                ],
                
                "cloud":
                [
                    {"x":0,"y":-50,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
                    {"x":50,"y":0,"type":"diamond","animation":"cycle", "graphicType":"sprite"},
                    {"x":0,"y":50,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":100,"y":-50,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":100,"y":50,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":150,"y":0,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                ],
                
                "downSlope":
                [
                    {"x":0,"y":0,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":50,"y":20,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":100,"y":40,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":150,"y":60,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":200,"y":80,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":250,"y":100,"type":"diamond","animation":"cycle","graphicType":"sprite"}
                ],
                
                "downParable":
                [
                    {"x":	50	, "y":	2.5	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	100	, "y":	10	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	150	, "y":	22.5	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	200	, "y":	40	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	250	, "y":	62.5	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	300	, "y":	90	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	350	, "y":	122.5	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	400	, "y":	160	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	450	, "y":	202.5	,type:"diamond","animation":"cycle","graphicType":"sprite"},

                ],
                
                "upSlope":
                [
                    {"x":0,"y":0,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":50,"y":-20,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":100,"y":-40,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":150,"y":-60,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":200,"y":-80,"type":"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":250,"y":-100,"type":"diamond","animation":"cycle","graphicType":"sprite"}
                ],
                
                "upParable":
                [
                    {"x":	50	, "y":	-2.5	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	100	, "y":	-10	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	150	, "y":	-22.5	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	200	, "y":	-40	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	250	, "y":	-62.5	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	300	, "y":	-90	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	350	, "y":	-122.5	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	400	, "y":	-160	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	450	, "y":	-202.5	,type:"diamond","animation":"cycle","graphicType":"sprite"},

                ],
                
                "zigZag":
                [
                    {"x":	100	, "y":	-20	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	200	, "y":	20	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	300	, "y":	-20	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	400	, "y":	20	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	500	, "y":	-20	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	600	, "y":	20	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	700	, "y":	-20	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	800	, "y":	20	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1000	, "y":	-20	,type:"diamond","animation":"cycle","graphicType":"sprite"}
                ],
                
                "sineCurve":
                [
                    {"x":	0	, "y":	0	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	50	, "y":	15.443276	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	100	, "y":	29.37637629	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	150	, "y":	40.43680303	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	200	, "y":	47.54297303	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	250	, "y":	49.99998415	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	300	, "y":	47.56756881	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	350	, "y":	40.48358941	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	400	, "y":	29.4407781	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	450	, "y":	15.51899548	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	500	, "y":	0.079632646	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	550	, "y":	-15.36751735	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	600	, "y":	-29.31189996	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	650	, "y":	-40.38991407	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	700	, "y":	-47.51825664	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	750	, "y":	-49.99985732	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	800	, "y":	-47.59204394	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	850	, "y":	-40.53027311	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	900	, "y":	-29.50510523	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	950	, "y":	-15.5946756	,type:"diamond","animation":"cycle","graphicType":"sprite"}
                ],
                
                "bigSine":
                [
                    {"x":	0	, "y":	0	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	150	, "y":	46.32982801	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	300	, "y":	88.12912886	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	450	, "y":	121.3104091	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	600	, "y":	142.6289191	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	750	, "y":	149.9999524	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	900	, "y":	142.7027064	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1050	, "y":	121.4507682	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1200	, "y":	88.3223343	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1350	, "y":	46.55698645	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1500	, "y":	0.238897937	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1650	, "y":	-46.10255206	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1800	, "y":	-87.93569988	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	1950	, "y":	-121.1697422	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	2100	, "y":	-142.5547699	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	2250	, "y":	-149.999572	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	2400	, "y":	-142.7761318	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	2550	, "y":	-121.5908193	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	2700	, "y":	-88.5153157	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	2850	, "y":	-46.78402679	,type:"diamond","animation":"cycle","graphicType":"sprite"}

                ],
                
                ///looop
                "loop":
                [
                    {"x":	62.25701405	, "y":	-26.52635236	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	125.9907573	, "y":	-51.33121883	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	269.7326906	, "y":	-96.08854442	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	350.9905274	, "y":	-216.6914816	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	418.2035123	, "y":	-287.667282		,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	456.2628025	, "y":	-362.6312799	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	462.9751187	, "y":	-435.1770559	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	433.5561625	, "y":	-498.6007669	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	386.002438	, "y":	-536.4105943	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	329.1994816	, "y":	-548.3956859	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	276.2562051	, "y":	-533.2310894	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	237.8197927	, "y":	-493.157281		,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	225.2364304	, "y":	-431.9219154	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	244.7922799	, "y":	-359.7600216	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	296.2755166	, "y":	-294.1601402	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	372.2007193	, "y":	-235.620014		,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	469.3304597	, "y":	-186.6490658	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	590.8224944	, "y":	-140.9453239	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	657.9293147	, "y":	-127.6224837	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	724.7446863	, "y":	-112.2939771	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	791.4098309	, "y":	-95.03864139	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	856.1211905	, "y":	-76.01061641	,type:"diamond","animation":"cycle","graphicType":"sprite"}] 
                                ,
                //great diamond
                "greatDiamond":
                [
                    {"x":0,"y":0, "type": "greatDiamond","animation":"greatCycle","graphicType":"sprite"}
                ],
                
                "greatDiamond":
                [
                    {"x":0,"y":0, "type": "greatDiamond","animation":"greatCycle","graphicType":"sprite"}
                ],
                
                "smallDiamond":
                [
                    {"x":0,"y":0, "type": "diamond","animation":"cycle","graphicType":"sprite"}
                ]
            },
    "medium" : 
            {
                ///looop w seagull
                "seagullLoop":
                [
                    {"x":0, "y":0,type:"attackBird","animation":"seagull","graphicType":"attackBird"},
                    {"x":	0	, "y":	0	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	62.25701405	, "y":	-26.52635236	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	125.9907573	, "y":	-51.33121883	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	269.7326906	, "y":	-96.08854442	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	350.9905274	, "y":	-216.6914816	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	418.2035123	, "y":	-287.667282	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	456.2628025	, "y":	-362.6312799	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	462.9751187	, "y":	-435.1770559	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	433.5561625	, "y":	-498.6007669	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	386.002438	, "y":	-536.4105943	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	329.1994816	, "y":	-548.3956859	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	276.2562051	, "y":	-533.2310894	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	237.8197927	, "y":	-493.157281	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	225.2364304	, "y":	-431.9219154	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	244.7922799	, "y":	-359.7600216	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	296.2755166	, "y":	-294.1601402	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	372.2007193	, "y":	-235.620014	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	469.3304597	, "y":	-186.6490658	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	590.8224944	, "y":	-140.9453239	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	657.9293147	, "y":	-127.6224837	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	724.7446863	, "y":	-112.2939771	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	791.4098309	, "y":	-95.03864139	,type:"diamond","animation":"cycle","graphicType":"sprite"},
                    {"x":	856.1211905	, "y":	-76.01061641	,type:"diamond","animation":"cycle","graphicType":"sprite"},]     
                
    },
    "hard" : 
            {
                "falcon":
                [
                    {"x":-500, "y":-400,type:"attackBird","animation":"falcon","graphicType":"attackBird"},
                ],
                "crow":
                [
                    {"x":0, "y":0,type:"attackBird","animation":"crow","graphicType":"attackBird"}
                ],
                "dualCrows":
                [
                    {"x":10, "y":-200,type:"attackBird","animation":"crow","graphicType":"attackBird"},
                    {"x":200, "y":-400,type:"attackBird","animation":"crow","graphicType":"attackBird"}
                ],
                "bat":
                [
                    {"x":0, "y":0,type:"attackBird","animation":"bat","graphicType":"attackBird"}
                ],
                
                "tripleBats":
                [
                    {"x":-700, "y":400,type:"attackBird","animation":"bat","graphicType":"attackBird"},
                    {"x":-800, "y":500,type:"attackBird","animation":"bat","graphicType":"attackBird"},
                    {"x":-900, "y":700,type:"attackBird","animation":"bat","graphicType":"attackBird"}
                ],
                
                "duck":
                [
                    {"x":0, "y":-200,type:"attackBird","animation":"duck","graphicType":"attackBird"}
                ],
                "dualDucks":
                [
                    {"x":0, "y":-200,type:"attackBird","animation":"duck","graphicType":"attackBird"},
                    {"x":0, "y":-400,type:"attackBird","animation":"duck","graphicType":"attackBird"}
                ],
                "quadDucks":
                [
                    {"x":0, "y":-200,type:"attackBird","animation":"duck","graphicType":"attackBird"},
                    {"x":0, "y":-400,type:"attackBird","animation":"duck","graphicType":"attackBird"},
                    {"x":0, "y":200,type:"attackBird","animation":"duck","graphicType":"attackBird"},
                    {"x":0, "y":400,type:"attackBird","animation":"duck","graphicType":"attackBird"}
                ],
                "seagull":
                [
                    {"x":0, "y":0,type:"attackBird","animation":"seagull","graphicType":"attackBird"}
                ],
                "glasses":
                [
                    {"x":0, "y":0,type:"attackBird","animation":"glasses","graphicType":"attackBird"}
                ],
                "thunder":
                [
                    {"x":0, "y":0,type:"thunderCloud","animation":"null","graphicType":"thunderCloud"}
                ]
            }
};

var Tracks = 
[
    //world 1    
    [
        //level 1
        //No frenzy
        //Learn fuel management
        [                        
            {"difficulty":"easy", "name":"w1lvl1"}, 			
        ],
        
        //Learn loop
        [
			{"difficulty":"easy", "name":"w1lvl2"}       
        ],
		
		//Fuel managment + looping
		[
			{"difficulty":"easy", "name":"w1lvl3"}       
        ]
    ],
    
    //world 2
    [        
        //Learn birds 
        //level 1
        [
			{"difficulty":"easy", "name":"w2lvl1"}       
        ],
        
        //Learn clouds 
        //level 2
        [
            {"difficulty":"hard", "name":"dualDucks"},
            {"difficulty":"easy", "name":"horizontalLine"},
            {"difficulty":"easy", "name":"upSlope"},
            {"difficulty":"easy", "name":"loop"},
            {"difficulty":"hard", "name":"thunder"}
        ]
    ],
    
    //world 3
    //Impossible witout support from kittens.
    [   
        //level 4
        [
            {"difficulty":"hard", "name":"falcon"},
            {"difficulty":"easy", "name":"sineCurve"},
            {"difficulty":"easy", "name":"mediumDiamond"},
            {"difficulty":"easy", "name":"sineCurve"},
            {"difficulty":"easy", "name":"mediumDiamond"},
            {"difficulty":"hard", "name":"thunder"}],
        
        //level 5 
        [
            
            {"difficulty":"hard", "name":"dualCrows"},
            {"difficulty":"easy", "name":"loop"},
            {"difficulty":"easy", "name":"horizontalLine"},
            {"difficulty":"easy", "name":"loop"},
            {"difficulty":"hard", "name":"thunder"},],
        
        //level 6 
        [
            {"difficulty":"hard", "name":"quadDucks"},
            {"difficulty":"easy", "name":"upSlope"},
            {"difficulty":"easy", "name":"downSlope"},
            {"difficulty":"easy", "name":"zigZag"},
            {"difficulty":"easy", "name":"loop"},
            {"difficulty":"easy", "name":"bigDiamond"}
            ],
        
        //level 7
        [
            {"difficulty":"hard", "name":"thunder"},
            {"difficulty":"hard", "name":"tripleBats"},
            {"difficulty":"easy", "name":"downParable"},
            {"difficulty":"easy", "name":"cloud"},
            {"difficulty":"easy", "name":"cloud"},
            {"difficulty":"easy", "name":"cloud"},
            {"difficulty":"easy", "name":"cloud"},
            {"difficulty":"easy", "name":"cloud"},
            {"difficulty":"easy", "name":"cloud"}
        ],
        
        //level 8
        [
            {"difficulty":"hard", "name":"quadDucks"},
            {"difficulty":"easy", "name":"bigSine"},
            {"difficulty":"easy", "name":"loop"},
            {"difficulty":"easy", "name":"loop"},
            {"difficulty":"easy", "name":"bigDiamond"}
        ],
        
        //level 9 
        [   
            {"difficulty":"hard", "name":"thunder"},
            {"difficulty":"hard", "name":"glasses"},
            {"difficulty":"easy", "name":"sineCurve"},
            {"difficulty":"easy", "name":"sineCurve"},
            {"difficulty":"easy", "name":"sineCurve"},
            {"difficulty":"easy", "name":"sineCurve"},
            {"difficulty":"easy", "name":"bigDiamond"}
        ]
    
    ]
];
      
    

var TutorialTexts = {
    frenzy : "Diamond Frenzy tool tip:\n\
If Catz gathers enough diamonds, Diamond Frenzy will be triggered.\n\
In this state Catz is supercharged with diamond lust and can't be hurt by birds nor lightning.",
    fuel : "Fuel tool tip:\n\
Each diamond gives Catz enough Diamond essence for two bursts with her rocket\n\
\n\
Pay attention to the fuel meter!",
    houseWithSlots : "House tool tip:\n\
You can set how many catz the houses Hobo-Cat builds can house. \n\
\n\
Click on houses on the hill to add more slots. The more cats Catz helps, the more diamonds does she need to gather each round.\n\
\n\
Help as many cats as you can!!!!!!\n\
\n\
Though be aware, not everyone likes an philfeline."
};
WizardVersion = (function() {
	var wizardVersion = {},
		ctrPressed,
		queue,
		inGameMode = false,
		isSpriteMode = true,
		levels,
		ctrlPressed = false,
		mousedown,
		catzRocketXpos = 0,
		levelLength = 13500,
		levelViewScale = 0.5,
		clipBoard,
		clipOffset = 0,
		levelEditor = {};



	wizardVersion.Init = function() {
		StartGame();
		setEventListeners();
		populateDDL();
	}


	function populateDDL() {
		var ddl = document.getElementById("importSelect");
		levels = Object.keys(TrackParts.easy);
		for (i = 0, len = levels.length; i < len; i++) {
			var option = document.createElement("option");
			option.text = levels[i];
			ddl.add(option);
		}
	}

	function setEventListeners() {
		$(window).keydown(handleKeyPress);
		$(window).keyup(handleKeyUp);
		cont.select.on("mousedown", GameLogic.StartPressMove);
		cont.select.on("pressmove", GameLogic.PressMove);
	}

	function setEventListenersOnPause() {
		bg.on("mousedown", GameLogic.CreateSelectBox);
		bg.on("pressmove", GameLogic.DragBox);
		bg.on("pressup", GameLogic.SelectWithBox);
		GameLogic.SetObjectEventListeners(true);
	}

	function setEventListenersOnResume() {
		bg.off("mousedown", GameLogic.CreateSelectBox);
		bg.off("pressmove", GameLogic.DragBox);
		bg.off("pressup", GameLogic.SelectWithBox);
		GameLogic.SetObjectEventListeners(false);
	}


	function handleKeyPress(evt) {
		if (evt.keyCode === 32) {
			evt.stopPropagation();
			evt.preventDefault();
			createjs.Ticker.paused = !createjs.Ticker.paused;
			if (createjs.Ticker.paused) {
				setEventListenersOnPause();
			} else {
				setEventListenersOnResume();
			}
		}
		if (evt.ctrlKey) {
			ctrlPressed = true;
		}
		if ((evt.keyCode === 67 || evt.keyCode === 88) && ctrlPressed) {
			GameLogic.CutCopy(evt.keyCode === 67);
		}
		if (evt.keyCode === 86 && ctrlPressed) {
			GameLogic.Paste();
		}
		if (evt.keyCode === 46) {
			GameLogic.DeleteSelected();
		}
	}

	function handleKeyUp(evt) {
		if (evt.ctrlKey) {
			ctrlPressed = false;
		}
	}

	return wizardVersion;
}());
angular
  .module('ohld')
  .controller('MainController', MainController);

MainController.$inject = ['$scope', 'levels'];

function MainController($scope, levels) {
  $scope.save = function() {
    levels.save({ title: 'best level', background: 1 });
  }
}
  

angular
  .module('ohld')
  .factory('levels', Levels);

Levels.$inject = ['$http'];

function Levels($http) {
  var levels = {};

  levels.save = function(level) {
    console.log(level);
    $http.post('http://localhost:3000/level', level).then(function(data){ console.log(data);});
  }

  return levels;
}
