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

    function updateBase(gravWindSum, event, canChangeToTerminal, fellOff) {
        catzRocket.catzVelocity += (gravWindSum) * event.delta / 1000;
        catzRocket.heightOffset += 20 * catzRocket.catzVelocity * event.delta / 1000;
        if (catzRocket.catzVelocity >= catzRocket.limitVelocity) {
            catzRocket.catzVelocity = catzRocket.limitVelocity;
            if (canChangeToTerminal)
                changeState(catzRocket.catzStateEnum.TerminalVelocity);
        }
        if (!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer)) {
            if (!fellOff || catzRocket.catzRocketContainer.rotation <= -270 || catzRocket.catzRocketContainer.rotation > -90)
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity / 40) * 360 / 3.14;
            else if (catzRocket.catzRocketContainer.rotation <= -180 && catzRocket.catzRocketContainer.rotation > -270)
                catzRocket.catzRocketContainer.rotation = -Math.atan(catzRocket.catzVelocity / 40) * 360 / 3.14;
        }
    }

    function checkFuel(mightBeUpsideDown) {
        if (catzRocket.diamondFuel === 0) {
            mousedown = false;
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
        updateBase(grav + wind, event, true, false);
        checkFuel(false);
    }

    function updateFellOff(grav, wind, event) {
        updateBase(grav + wind, event, false, false);
    }

    function updateOutOfFuel(grav, wind, event) {
        updateBase(grav + wind, event, false, true);
        if (catzRocket.diamondFuel > 0)
            changeState(catzRocket.catzStateEnum.Normal);
    }

    function updateOutOfFuelUpsideDown(grav, wind, event) {
        updateBase(grav + wind, event, false, true);
    }

    function updateFrenzy2(grav, wind, event) {
        updateBase(0.5 * (grav + wind), event, false, false);
    }

    function updateFrenzyUploop(grav, wind, event) {
        updateBase(-0.5 * (2.3 * grav - wind), event, false, false);
    }

    function updateTerminal(event) {
        catzRocket.heightOffset += 20 * catzRocket.catzVelocity * event.delta / 1000;
        catzRocket.catzRocketContainer.rotation = -280;
        checkFuel(false);
    }

    function updateEmergency(grav, wind, event) {
        updateBase(-10 * grav - 3.7 * wind, event, false, false);
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
        updateBase(-(3.2 * grav - wind), event, false, false);
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
        updateBase(-(5.5 * grav - 2 * wind), event, false, false);
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
                case diamondEnum.medium:
                    CatzRocket.diamondFuel += 1.2;
                    CatzRocket.frenzyCount += 5;
                    break;
                case diamondEnum.great:
                    CatzRocket.diamondFuel += 3;
                    CatzRocket.frenzyCount += 50.5;
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
            mousedown = true;
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
		stage.addEventListener("stagemousedown", CatzRocket.catzUp);    
        stage.addEventListener("stagemouseup", function(){mousedown = false; CatzRocket.catzEndLoop();});    
	}
     
     catzRocket.catzEndLoop = function() {
        if (catzRocket.catzState === catzRocket.catzStateEnum.Uploop
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
