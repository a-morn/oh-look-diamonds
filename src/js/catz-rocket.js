import * as Helpers from './helpers.js';
import * as SpriteSheetData from './sprite-sheet-data.js';
import DebugOptions from './debug-options.js';

export const rocketSnake = new createjs.Container();
export let snakeLine;
export let catzBounds;
export let catzRocketContainer;
export let rocketFlame = null;
export let catzVelocity = -20;
export let diamondFuel = 2;
export let frenzyReady = false;
export let catzState = 0;
export let isCrashed = false;
export let rocket = null;
export const catzStateEnum = {
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
};

let silouette = null;
let diamondEnum;
const maxDiamondFuel = 10;
let isWounded = false;
let isHit = false;
const	flameColor = "#99ccff";
let heightOffset = 0;
let frenzyCount = 0;
let frenzyTimer = 0;
let rocketSound = null;
let xScreenPosition = 0;
let yScreenPosition = 0;
let catz = null;

const limitVelocity = 30;
const	rocketSounds = [
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
];
const fuelConsumption = [
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
];
const crashBorder = {
	top: -1000,
	bottom: 450
}

let invincibilityCounter = 0;

export function init(data, queue) {
	diamondEnum = data.diamondEnum;
	catzRocketContainer = new createjs.Container();

	catz = Helpers.createSprite(SpriteSheetData.rocket, "no shake", {y:5});								
	rocketFlame = Helpers.createSprite(SpriteSheetData.flame, "cycle", 
{x:190, y:200, regX:40, regY:-37, alpha:0});															

	catzRocketContainer.x = 260;
	catzRocketContainer.y = 200;				 
	catzRocketContainer.regY = 100;
	catzRocketContainer.regX = 150;
	catz.currentFrame = 0;  
					
	rocket = Helpers.createBitmap(queue.getResult("rocket"), 
		{scaleX:0.25, scaleY:0.25, regX:-430, regY:-320});							
	catzRocketContainer.addChild(rocket, catz);
	catzBounds = catzRocketContainer.getTransformedBounds();
	
	rocketSnake.x=0;
	rocketSnake.y=0;												 
					
	for(let i = 0, snakeAmt = 11; i < snakeAmt; i++){
		var shape = new createjs.Shape();
		var x = 260-i*5;
		var r = 9;
		shape.graphics.f(data.lightningColor).dc(x, 200, r);
		shape.regY=5;
		shape.regX=5;
		rocketSnake.addChild(shape);						 
	}

	snakeLine = new createjs.Shape();
	rocketSound = createjs.Sound.play("rocketSound");
	rocketSound.volume = 0.1;
	rocketSound.stop();
}

export function setCrashBorders(top, bottom) {
	crashBorder.top = top;
	crashBorder.bottom = bottom;
}

export function update(grav, wind, event) {
	invincibilityCountDown(event.delta);
	diamondFuelLossPerTime(event.delta);
	if (DebugOptions.infiniteFuel && diamondFuel < 1) {
			diamondFuel = 1;
	}
	switch (catzState) {
		case catzStateEnum.Normal:
			updateNormal(grav, wind, event);
			break;
		case catzStateEnum.FellOffRocket:
			updateFellOff(grav, wind, event);
			break;
		case catzStateEnum.OutOfFuel:
			updateOutOfFuel(grav, wind, event);
			break;
		case catzStateEnum.OutOfFuelUpsideDown:
				updateOutOfFuelUpsideDown(grav, wind, event);
				break;
		case catzStateEnum.Frenzy:
				updateFrenzy2(grav, wind, event);
				break;
		case catzStateEnum.FrenzyUploop:
				updateFrenzyUploop(grav, wind, event)
				break;
		case catzStateEnum.TerminalVelocity:
				updateTerminal(event);
				break;
		case catzStateEnum.EmergencyBoost:
				updateEmergency(grav, wind, event);
				break;
		case catzStateEnum.Uploop:
				updateUploop(grav, wind, event);
				break;
		case catzStateEnum.Downloop:
		case catzStateEnum.SlammerReady:
				updateDownloop(grav, wind, event);
				break;
		case catzStateEnum.Slammer:
				updateSlammer();
				break;
		case catzStateEnum.SecondUploop:
				updateSecondUploop(grav, wind, event);
				break;
		case catzStateEnum.SecondDownloop:
				updateSecondDownloop(grav, wind, event);
				break;
		case catzStateEnum.Slingshot:
				updateSlingshot();
	}

	if (catzState !== catzStateEnum.SecondDownloop
		&& catzState !== catzStateEnum.Slingshot
		&& catzState !== catzStateEnum.OutOfFuelUpsideDown) {
		xScreenPosition = 200 +
			Math.cos((catzRocketContainer.rotation + 90) / 360 * 2 * Math.PI)
			* 160;
			yScreenPosition = 200 +
				Math.sin((catzRocketContainer.rotation + 90) / 360 * 2 * Math.PI)
				* 210;
	} else if (catzState !== catzStateEnum.OutOfFuelUpsideDown) {
			xScreenPosition = 255 +
				Math.cos((catzRocketContainer.rotation + 90) / 360 * 2 * Math.PI)
				* 80;
			yScreenPosition = 200 +
				Math.sin((catzRocketContainer.rotation + 90) / 360 * 2 * Math.PI)
				* 100;
	}

	if (isWounded && !createjs.Tween.hasActiveTweens(catz))
		catz.x = -50;
	else if (!isWounded &&
		!createjs.Tween.hasActiveTweens(catz))
		catz.x = 0;
	
	if (catzRocketContainer.y > crashBorder.bottom || catzRocketContainer.y < crashBorder.top)
		isCrashed = true;
	catzRocketContainer.x = xScreenPosition;
	catzRocketContainer.y = yScreenPosition + heightOffset;
	diamondFuel -= fuelConsumption[catzState] * event.delta / 1000;
	diamondFuel = Math.max(diamondFuel, 0);
	updateFrenzy(event);
	updateRocketSnake();
};

export function hideSnake() {
	rocketSnake.alpha = 0;
	snakeLine.alpha = 0;
	rocketFlame.alpha = 0;
}

export function playSecondDownloopSound() {
	rocketSound.stop();
	rocketSound = createjs.Sound.play(rocketSounds[
			catzStateEnum.SecondDownloop]);
}

export function catzRelease() {
	if (isWounded) {
			isWounded = false;
			catz.x = 0;
	}
	if (catzState !== catzStateEnum.SlammerReady) {
			catzVelocity = Math.tan(catzRocketContainer.rotation * 3.14 / 360) * 40;
			changeState(catzStateEnum.SecondUploop);
	} else {
			changeState(catzStateEnum.Normal);
			catzVelocity = Math.tan(catzRocketContainer.rotation * 3.14 / 360) * 40;
	}
}

export function getHit(isInstaGib) {
	if ((invincibilityCounter <= 0 || isInstaGib) && !hasFrenzy() && !isHit) {
			var instance = createjs.Sound.play("catzScream2");
			instance.volume = 0.5;

			if (!isWounded && !isInstaGib) {
					isWounded = true;
					catz.gotoAndPlay("slipping");
					createjs.Tween.get(catz)
							.to({
									y: 10,
									x: -25
							}, 100)
							.to({
									x: -50,
									y: 5
							}, 150)
							.call(catz.gotoAndPlay, ["no shake"]);
					invincibilityCounter = 1000;
					return false;
			} else {
					isHit = true;
					changeState(catzStateEnum.FellOffRocket);
					return true;
			}
	} else {
			return false;
	}
}

export function catzUp() {
		if (diamondFuel > 0) {
				if (catzState === catzStateEnum.Normal) {
						diamondFuel -= 0.25;
						catzVelocity -= 2;
						changeState(catzStateEnum.Uploop);
				} else if (catzState === catzStateEnum.Frenzy) {
						catzVelocity -= 2;
						changeState(catzStateEnum.FrenzyUploop);
				} else if (catzState === catzStateEnum.TerminalVelocity) {
						changeState(catzStateEnum.EmergencyBoost);
				} else if (catzState === catzStateEnum.SlammerReady && catzRocketContainer.rotation > -250) {
						changeState(catzStateEnum.Slammer);
				}
		} else {
				//glass.gotoAndPlay("outOfFuel");
		}
}

export function hasFrenzy() {
		if (catzState === catzStateEnum.FrenzyUploop || catzState === catzStateEnum.Frenzy) {
				return true;
		} else {
				return false;
		}
}

export function canCollide() {
		return (catzState !== catzStateEnum.FellOffRocket && !hasFrenzy());
}

export function reset() {
	createjs.Tween.removeTweens(catzRocketContainer);
	frenzyReady = false;
	frenzyTimer = 0;
	frenzyCount = 0;
	changeState(catzStateEnum.Normal);
	diamondFuel = 0;        
	rocket.x=0;
	rocket.alpha=1;
	catz.alpha = 1;
	catzRocketContainer.x = 300;
	catzRocketContainer.y = 200;
	heightOffset = 0;
	catzRocketContainer.rotation = 0;
	catz.gotoAndPlay("no shake");
	catzVelocity = -20;
}

export function start(velocity) {
		isWounded = false;
		isHit = false;
		isCrashed = false;
		hideSnake();
		catzVelocity = velocity;	
diamondFuel = 2;        
}
 
 export function catzEndLoop() {
		if (catzState === catzStateEnum.Uploop
				|| catzState === catzStateEnum.SecondUploop
				|| catzState === catzStateEnum.TerminalVelocity 
				|| catzState === catzStateEnum.EmergencyBoost)
				changeState(catzStateEnum.Normal);
		else if (catzState === catzStateEnum.SecondDownloop)
				changeState(catzStateEnum.Slingshot);
		else if (catzState === catzStateEnum.Downloop)
				changeState(catzStateEnum.SlammerReady);
		else if (catzState === catzStateEnum.FrenzyUploop)
				changeState(catzStateEnum.Frenzy);
}

export function pickupDiamond(size) {
	if (diamondFuel < 10 && catzState != catzStateEnum.Frenzy) {
		switch (size) {
			case diamondEnum.shard:
				diamondFuel += 0.09;
				frenzyCount += 0.1;
				break;                
			case diamondEnum.great:
				diamondFuel += 1.5;
				frenzyCount += 5;
				break;
		}
	}
}

function updateBase(gravWindSum, event, canChangeToTerminal, fellOff, rotate) {
		catzVelocity += (gravWindSum) * event.delta / 1000;
		heightOffset += 20 * catzVelocity * event.delta / 1000;
		if (catzVelocity >= limitVelocity) {
				catzVelocity = limitVelocity;
				if (canChangeToTerminal)
						changeState(catzStateEnum.TerminalVelocity);
		}
		if (rotate && !createjs.Tween.hasActiveTweens(catzRocketContainer)) {
				if (!fellOff || catzRocketContainer.rotation <= -270 || catzRocketContainer.rotation > -90)
						catzRocketContainer.rotation = Math.atan(catzVelocity / 40) * 360 / 3.14;
				else if (catzRocketContainer.rotation <= -180 && catzRocketContainer.rotation > -270)
						catzRocketContainer.rotation = -Math.atan(catzVelocity / 40) * 360 / 3.14;
		}
}

function checkFuel(mightBeUpsideDown) {
		if (diamondFuel === 0) {
//            glass.gotoAndPlay("outOfFuel");
		} else {
				changeState(catzStateEnum.Normal);
				catzVelocity = Math.tan(catzRocketContainer.rotation * 3.14 / 360) * 40;
		}
};

function checkFuel(mightBeUpsideDown) {
		if (diamondFuel === 0) {
//            glass.gotoAndPlay("outOfFuel");
				createjs.Tween.removeTweens(catzRocketContainer);
				if (mightBeUpsideDown) {
						if (catzRocketContainer.rotation <= -90 && catzRocketContainer.rotation >= -270) {
								changeState(catzStateEnum.OutOfFuelUpsideDown);
								isHit = true;
						} else
								changeState(catzStateEnum.OutOfFuel);

				} else
						changeState(catzStateEnum.OutOfFuel);
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
		if (diamondFuel > 0)
				changeState(catzStateEnum.Normal);
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
		heightOffset += 20 * catzVelocity * event.delta / 1000;
		catzRocketContainer.rotation = -280;
		checkFuel(false);
}

function updateFrenzy(event) {
		if (catzState === catzStateEnum.Frenzy) {
				frenzyTimer += event.delta;
				if (frenzyTimer > 1500) {
						changeState(catzStateEnum.Normal);
						catz.gotoAndPlay("no shake");
						//glass.gotoAndPlay("still");
						rocket.alpha = 1;
						frenzyCount = 0;
						frenzyTimer = 0;
				}
				frenzyReady = false;
		} else if (frenzyReady === true) {
				frenzyTimer += event.delta;
				if (frenzyTimer > 500) {
						if (catzState === catzStateEnum.SecondDownloop) {
								changeState(catzStateEnum.Slingshot);
						} else if (catzState !== catzStateEnum.Downloop &&
								catzState !== catzStateEnum.SlammerReady &&
								catzState !== catzStateEnum.Slammer &&
								catzState !== catzStateEnum.Slingshot) {
								if (catzState === catzStateEnum.Uploop || catzState === catzStateEnum.SecondUploop) {
										changeState(catzStateEnum.FrenzyUploop);
								} else {
										changeState(catzStateEnum.Frenzy);
								}
								//glass.gotoAndPlay("frenzy");
								isWounded = false;
								frenzyTimer = 0;
								frenzyReady = false;
						}
				}
		} else if (!hasFrenzy() && frenzyCount > 0) {
				if (diamondFuel >= maxDiamondFuel) {
						diamondFuel = maxDiamondFuel / 2;
						catz.gotoAndPlay("frenzy ready");
						rocket.alpha = 0;
						frenzyReady = true;
						isWounded = false;
						frenzyTimer = 0;
				}
		}
}

function updateRocketSnake() {
		var arrayLength = rocketSnake.children.length;
		for (var i = arrayLength - 1; i > 0; i--) {
				var kid = rocketSnake.children[i];
				kid.x = rocketSnake.children[i - 1].x - 2 * Math.cos(6.28 * catzRocketContainer.rotation / 360);
				kid.y = rocketSnake.children[i - 1].y;
		}
		if (catzState !== catzStateEnum.SecondDownloop && catzState !== catzStateEnum.Slingshot) {
				rocketSnake.children[0].x = -60 +
						Math.cos((catzRocketContainer.rotation + 101) / 360 * 2 * Math.PI) * 176;
				rocketSnake.children[0].y =
						Math.sin((catzRocketContainer.rotation + 100) / 360 * 2 * Math.PI) * 232 + heightOffset;
				rocketFlame.x = catzRocketContainer.x;
				rocketFlame.y = catzRocketContainer.y;
		} else {
				rocketSnake.children[0].x = -5 +
						Math.cos((catzRocketContainer.rotation + 110) / 360 * 2 * Math.PI) * 100;
				rocketSnake.children[0].y =
						Math.sin((catzRocketContainer.rotation + 110) / 360 * 2 * Math.PI) * 120 + heightOffset;
				rocketFlame.x = catzRocketContainer.x;
				rocketFlame.y = catzRocketContainer.y;
		}
		snakeLine.graphics = new createjs.Graphics();
		snakeLine.x = 260;
		snakeLine.y = 200;
		for (var i = arrayLength - 1; i > 0; i--) {
				var kid = rocketSnake.children[i];
				snakeLine.graphics.setStrokeStyle(arrayLength * 2 - i * 2, 1);
				snakeLine.graphics.beginStroke(flameColor);
				snakeLine.graphics.moveTo(kid.x - i * 5, kid.y);
				snakeLine.graphics.lineTo(rocketSnake.children[i - 1].x - (i - 1) * 5, rocketSnake.children[i - 1].y);
				snakeLine.graphics.endStroke();
		}
		rocketFlame.rotation = catzRocketContainer.rotation;

};

function showSnake() {
		rocketSnake.children[0].x = -60 +
				Math.cos((catzRocketContainer.rotation + 101) / 360 * 2 * Math.PI) * 176;
		rocketSnake.children[0].y =
				Math.sin((catzRocketContainer.rotation + 100) / 360 * 2 * Math.PI) * 232 + heightOffset;
		rocketFlame.x = rocketSnake.children[0].x;
		rocketFlame.y = rocketSnake.children[0].y;
		rocketFlame.rotation = catzRocketContainer.rotation;

		snakeLine.alpha = 1;
		rocketFlame.alpha = 1;
		rocketFlame.gotoAndPlay("ignite");
};

function changeState(state) {
		catzState = state;
		if (state !== catzStateEnum.SlammerReady &&
				state !== catzStateEnum.FrenzyUploop) {
				rocketSound.stop();
				if (rocketSounds[state] !== null) {
						rocketSound = createjs.Sound.play(rocketSounds[state]);
						rocketSound.volume = 0.5;
				}
		}
		if (state === catzStateEnum.Normal || state === catzStateEnum.TerminalVelocity || state === catzStateEnum.OutOfFuel || state === catzStateEnum.OutOfFuelUpsideDown) {
				hideSnake();
				if (frenzyReady || state === catzStateEnum.TerminalVelocity)
						catz.gotoAndPlay("shake");
				else
						catz.gotoAndPlay("no shake");
		} else if (state !== catzStateEnum.FellOffRocket && !hasFrenzy()) {
				if (snakeLine.alpha === 0)
						showSnake();
				if (!frenzyReady)
						catz.gotoAndPlay("shake");
		} else if (state !== catzStateEnum.FellOffRocket) {
				hideSnake();
				catz.gotoAndPlay("frenzy");
		} else {
				hideSnake();
				catz.gotoAndPlay("flying");
		}
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
		if (diamondFuel > 5)
				diamondFuel -= time / 1000;

		if (diamondFuel > 10)
				diamondFuel -= time / 20;
};

function updateUploop(grav, wind, event) {
	updateBase(-(3.2 * grav - wind), event, false, false,true);
	if(catzRocketContainer.rotation < -60) {
		createjs.Tween.removeTweens(catzRocketContainer);
		createjs.Tween.get(catzRocketContainer)
			.to({
				rotation: -270
			}, 1000)
			.to({
				rotation: -330
			}, 350)
			.call(catzRelease);
		changeState(catzStateEnum.Downloop);
	}
	checkFuel(false);
}

function updateEmergency(grav, wind, event) {
	updateBase(-10 * grav - 3.7 * wind, event, false, false,true);
	if (catzRocketContainer.rotation < 0)
		changeState(catzStateEnum.Uploop);
	checkFuel(false);
}

function updateDownloop(grav, wind, event) {
	catzVelocity += ((2 - 8 * Math.sin(catzRocketContainer.rotation)) *
		grav + 6 * wind) * event.delta / 1000 + 0.4;
	checkFuel(true);
}

function updateSlammer() {
	if (catzRocketContainer.rotation < -250) {
		createjs.Tween.removeTweens(catzRocketContainer);
		catzVelocity = limitVelocity;
		changeState(catzStateEnum.TerminalVelocity);
	}
	checkFuel(true);
}

function updateSecondUploop(grav, wind, event) {
	updateBase(-(5.5 * grav - 2 * wind), event, false, false,true);
	if (!createjs.Tween.hasActiveTweens(catzRocketContainer))
		catzRocketContainer.rotation = Math.atan(catzVelocity / 40) * 360 / 3.14;
	if (catzRocketContainer.rotation < -60) {
		heightOffset += 110 * Math.sin((catzRocketContainer.rotation + 110) / 360 * 2 * Math.PI);
		changeState(catzStateEnum.SecondDownloop);
		createjs.Tween.removeTweens(catzRocketContainer);
		createjs.Tween.get(catzRocketContainer, {
				loop: true
			})
			.to({
				rotation: -270
			}, 500)
			.to({
				rotation: -420
			}, 500)
			.call(playSecondDownloopSound);
	}
	checkFuel(false);
}

function updateSlingshot() {
	if (catzRocketContainer.rotation < -400) {
		createjs.Tween.removeTweens(catzRocketContainer);
		changeState(catzStateEnum.Normal);
		heightOffset -= 110 * Math.sin((catzRocketContainer.rotation + 110)
			/ 360 * 2 * Math.PI);
		catzVelocity = -20;
	}
	checkFuel(true);
}

function updateSecondDownloop(grav, wind, event) {
	if (wind >= 0)
		heightOffset += (150 + 12 * wind) * event.delta / 1000;
	else
		heightOffset += (150 + 40 * wind) * event.delta / 1000;
	
	checkFuel(true);
}
