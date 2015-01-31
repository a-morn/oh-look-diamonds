var CatzRocket = (function(){
    var catzRocket = {
    catzRocketContainer: null,
    silouette: null,    
    diamondFuel: 2,
    isWounded: false,
    isHit : false,
    isCrashed : false,
    flameColor : "#99ccff",
    glass: null,
    heightOffset: 0,
    frenzyCount: 0,
    frenzyTimer: 0,
    frenzyReady: false,
    rocketSound: null,
    catz: null,  
    rocket: null,
    rocketFlame: null,
    rocketSnake :  new createjs.Container(),
    SnakeLine : null, 
    catzVelocity: -2,
    limitVelocity: 30,    
    rocketSounds : [
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
        "catzScream3"
    ],
    catzState: 0};

    var catzStateEnum = {
        Normal : 0,
        Uploop : 1,
        Downloop : 2,
        SecondUploop : 3,
        SecondDownloop : 4,
        Slingshot : 5,
        TerminalVelocity : 6,
        EmergencyBoost : 7,
        SlammerReady : 8,
        Slammer : 9,
        Frenzy : 10,
        FrenzyUploop : 11,
        FellOffRocket : 12
    },
    invincibilityCounter = 0;
    
    catzRocket.Init = function()
    {
        catzRocket.catzRocketContainer = new createjs.Container();
    };        
    
    catzRocket.update = function(grav,wind,event)
    {      
        if(catzRocket.catzState === catzStateEnum.Normal)   
        {
            catzRocket.catzVelocity += (grav+wind)*event.delta/1000;
            if(catzRocket.catzVelocity>=catzRocket.limitVelocity)
            {
                catzRocket.catzVelocity = catzRocket.limitVelocity;
                catzRocket.changeState(catzStateEnum.TerminalVelocity);
            }
            catzRocket.heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;                
            }                        
        } 
        if(catzRocket.catzState === catzStateEnum.FellOffRocket)
        {
            catzRocket.catzVelocity += (grav+wind)*event.delta/1000;
            if(catzRocket.catzVelocity>=catzRocket.limitVelocity)
            {
                catzRocket.catzVelocity = catzRocket.limitVelocity;
            }
            catzRocket.heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;   
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;                
            }        
        }
        if(catzRocket.catzState === catzStateEnum.Frenzy)   
        {
            catzRocket.catzVelocity += (1/2)*(grav+wind)*event.delta/1000;
            catzRocket.heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;            
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;                
            }                        
        }   
        if(catzRocket.catzState === catzStateEnum.FrenzyUploop)   
        {
            catzRocket.catzVelocity -= (1/2)*(2.3*grav-wind)*event.delta/1000; 
            catzRocket.heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;            
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;                
            }                        
        }   
        else if (catzRocket.catzState === catzStateEnum.TerminalVelocity)
        {
            catzRocket.heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;
            catzRocket.catzRocketContainer.rotation =-280;
        }
        else if (catzRocket.catzState === catzStateEnum.EmergencyBoost)
        {
            catzRocket.catzVelocity -= (10*grav-3.7*wind)*event.delta/1000; 
            catzRocket.heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;
            catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;
            if(catzRocket.catzRocketContainer.rotation<0)
            {
                catzRocket.changeState(catzStateEnum.Uploop);
            }
        }
        else if (catzRocket.catzState === catzStateEnum.Uploop)
        {
            catzRocket.catzVelocity -= (3.2*grav-wind)*event.delta/1000;          
            catzRocket.heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;   
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;
            }
        }
        else if (catzRocket.catzState === catzStateEnum.Downloop || 
                catzRocket.catzState === catzStateEnum.SlammerReady)
        {
            catzRocket.catzVelocity += ((2-8*Math.sin(catzRocket.catzRocketContainer.rotation))*
                grav+6*wind)*event.delta/1000+0.4;
        }
        else if (catzRocket.catzState === catzStateEnum.Slammer && catzRocket.catzRocketContainer.rotation<-250)
        {
            createjs.Tween.removeAllTweens(catzRocket.catzRocketContainer);
            catzRocket.catzVelocity = catzRocket.limitVelocity;
            catzRocket.changeState(catzStateEnum.TerminalVelocity);
        }
        if (catzRocket.catzRocketContainer.rotation<-60 && catzRocket.catzState === catzStateEnum.Uploop)
        {
            createjs.Tween.removeAllTweens(catzRocket.catzRocketContainer);
            tween = createjs.Tween.get(catzRocket.catzRocketContainer)
                .to({rotation:-270},1000)
                .to({rotation:-330},350)
                .call(catzRocket.catzRelease);
            catzRocket.changeState(catzStateEnum.Downloop);
        }
        else if (catzRocket.catzState === catzStateEnum.SecondUploop)
        {
            catzRocket.catzVelocity -= (5.5*grav-2*wind)*event.delta/1000;    
            catzRocket.heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;
            }
        }
        else if (catzRocket.catzState === catzStateEnum.SecondDownloop)
        {
            if(wind>=0)
            {
                catzRocket.heightOffset += (150+12*wind)*event.delta/1000;
            }
            else
            {
                catzRocket.heightOffset += (150+40*wind)*event.delta/1000;
            }
        }
        else if (catzRocket.catzState === catzStateEnum.Slingshot && catzRocket.catzRocketContainer.rotation <-400)
        {
            createjs.Tween.removeAllTweens(catzRocket.catzRocketContainer);
            catzRocket.changeState(catzStateEnum.Normal);
            catzRocket.heightOffset-=110*Math.sin((catzRocket.catzRocketContainer.rotation+110)/360*2*Math.PI);
            catzRocket.catzVelocity =-20;            
        }
        if (catzRocket.catzRocketContainer.rotation<-60 && catzRocket.catzState === catzStateEnum.SecondUploop)
        {
            catzRocket.heightOffset+=110*Math.sin((catzRocket.catzRocketContainer.rotation+110)/360*2*Math.PI);
            catzRocket.changeState(catzStateEnum.SecondDownloop);
            createjs.Tween.removeAllTweens(catzRocket.catzRocketContainer);
            tween = createjs.Tween.get(catzRocket.catzRocketContainer,{loop:true})
            .to({rotation:-270},500)
            .to({rotation:-420},500)
            .call(catzRocket.playSecondDownloopSound);
        }
        if(catzRocket.catzState !== catzStateEnum.SecondDownloop 
                && catzRocket.catzState !== catzStateEnum.Slingshot)
        {
            catzRocket.catzRocketContainer.x = 200+
                        Math.cos((catzRocket.catzRocketContainer.rotation+90)/360*2*Math.PI)*160;
            catzRocket.catzRocketContainer.y = 200+
                        Math.sin((catzRocket.catzRocketContainer.rotation+90)/360*2*Math.PI)*210
                +catzRocket.heightOffset;
        }
        else
        {
            catzRocket.catzRocketContainer.x = 255+
                Math.cos((catzRocket.catzRocketContainer.rotation+90)/360*2*Math.PI)*80;
            catzRocket.catzRocketContainer.y = 200+
                Math.sin((catzRocket.catzRocketContainer.rotation+90)/360*2*Math.PI)*100
                +catzRocket.heightOffset;
        }
        if(catzRocket.isWounded && 
                !createjs.Tween.hasActiveTweens(catzRocket.catz))
        {
            catzRocket.catz.x=-50;
        }
        else if (!catzRocket.isWounded && 
                !createjs.Tween.hasActiveTweens(catzRocket.catz))
        {
            catzRocket.catz.x=0;
        }
        if(catzRocket.catzRocketContainer.y > 450 || catzRocket.catzRocketContainer.y < -1000)
        {            
            catzRocket.isCrashed = true;
        }
        updateFrenzy(event);
        updateRocketSnake();
    };
    
    function updateFrenzy (event)
    {
        if (catzRocket.catzState===catzStateEnum.Frenzy)
        {
            catzRocket.frenzyTimer+=event.delta;
            if(catzRocket.frenzyTimer>1500)
            {
                catzRocket.changeState(catzStateEnum.Normal);
                catzRocket.catz.gotoAndPlay("no shake");
                catzRocket.glass.gotoAndPlay("still");
                catzRocket.rocket.alpha=1;
                catzRocket.frenzyCount=0;
                catzRocket.frenzyTimer=0;
            }
            catzRocket.frenzyReady=false;
        }
        else if (catzRocket.frenzyReady===true)
        {
            catzRocket.frenzyTimer+=event.delta;
            if(catzRocket.frenzyTimer>500)
            {
                if (catzRocket.catzState===catzStateEnum.SecondDownloop)
                {
                    catzRocket.changeState(catzStateEnum.Slingshot);
                }
                else if (catzRocket.catzState!==catzStateEnum.Downloop &&
                        catzRocket.catzState!==catzStateEnum.SlammerReady &&
                        catzRocket.catzState!==catzStateEnum.Slammer &&
                        catzRocket.catzState!==catzStateEnum.Slingshot)
                {      
                    if(catzRocket.catzState===catzStateEnum.Uploop
                            || catzRocket.catzState===catzStateEnum.SecondUploop)
                    {
                        catzRocket.changeState(catzStateEnum.FrenzyUploop);
                    }
                    else
                    {
                        catzRocket.changeState(catzStateEnum.Frenzy);
                    }
                    catzRocket.glass.gotoAndPlay("frenzy");
                    catzRocket.isWounded=false;
                    catzRocket.frenzyTimer=0;
                    catzRocket.frenzyReady=false;
                }
            }
        }
        else if (!catzRocket.hasFrenzy()
                && catzRocket.frenzyCount>0)
        {
            if (catzRocket.frenzyCount>100 && 
                    catzRocket.catzState!==catzStateEnum.FellOffRocket)
            {
                catzRocket.catz.gotoAndPlay("frenzy ready");
                catzRocket.rocket.alpha=0;
                catzRocket.frenzyReady=true;
                catzRocket.isWounded=false;
                catzRocket.frenzyTimer= 0;
            }
            catzRocket.frenzyTimer+=event.delta;
            if(catzRocket.frenzyTimer>2000)
            {
                catzRocket.frenzyCount=0;
                catzRocket.frenzyTimer=0;
            }
        }
    };
    
    function updateRocketSnake()
    {
        var arrayLength = catzRocket.rocketSnake.children.length; 
        for (var i = arrayLength-1; i >0 ; i--) {
            var kid = catzRocket.rocketSnake.children[i];
            kid.x = catzRocket.rocketSnake.children[i-1].x-2*Math.cos(6.28*catzRocket.catzRocketContainer.rotation/360);
            kid.y = catzRocket.rocketSnake.children[i-1].y;
        }           
        if(catzRocket.catzState !== catzStateEnum.SecondDownloop 
        && catzRocket.catzState !== catzStateEnum.Slingshot)
        {
            catzRocket.rocketSnake.children[0].x = -60+
                Math.cos((catzRocket.catzRocketContainer.rotation+101)/360*2*Math.PI)*176;
            catzRocket.rocketSnake.children[0] .y =
                Math.sin((catzRocket.catzRocketContainer.rotation+100)/360*2*Math.PI)*232
            +catzRocket.heightOffset;
            catzRocket.rocketFlame.x = catzRocket.catzRocketContainer.x;
            catzRocket.rocketFlame.y = catzRocket.catzRocketContainer.y;
        }
        else 
        {
            catzRocket.rocketSnake.children[0].x =-5+
                Math.cos((catzRocket.catzRocketContainer.rotation+110)/360*2*Math.PI)*100;
            catzRocket.rocketSnake.children[0] .y =
                Math.sin((catzRocket.catzRocketContainer.rotation+110)/360*2*Math.PI)*120
            +catzRocket.heightOffset;
            catzRocket.rocketFlame.x = catzRocket.catzRocketContainer.x;
            catzRocket.rocketFlame.y = catzRocket.catzRocketContainer.y;
        }
        catzRocket.SnakeLine.graphics = new createjs.Graphics();
        catzRocket.SnakeLine.x=260;
        catzRocket.SnakeLine.y=200;
        for (var i = arrayLength-1; i >0 ; i--) {
            var kid = catzRocket.rocketSnake.children[i];
            catzRocket.SnakeLine.graphics.setStrokeStyle(arrayLength*2-i*2,1);
            catzRocket.SnakeLine.graphics.beginStroke(catzRocket.flameColor);
            catzRocket.SnakeLine.graphics.moveTo(kid.x-i*5,kid.y);
            catzRocket.SnakeLine.graphics.lineTo(catzRocket.rocketSnake.children[i-1].x-(i-1)*5,catzRocket.rocketSnake.children[i-1].y);
            catzRocket.SnakeLine.graphics.endStroke();
        } 
        catzRocket.rocketFlame.rotation =catzRocket.catzRocketContainer.rotation;

    };
    
    function showSnake()
    {
        catzRocket.rocketSnake.children[0].x = -60+
            Math.cos((catzRocket.catzRocketContainer.rotation+101)/360*2*Math.PI)*176;
        catzRocket.rocketSnake.children[0] .y =
            Math.sin((catzRocket.catzRocketContainer.rotation+100)/360*2*Math.PI)*232
            +catzRocket.heightOffset;
        catzRocket.rocketFlame.x = catzRocket.rocketSnake.children[0].x;
        catzRocket.rocketFlame.y = catzRocket.rocketSnake.children[0].y;
        catzRocket.rocketFlame.rotation =catzRocket.catzRocketContainer.rotation;
        
        catzRocket.SnakeLine.alpha = 1;
        catzRocket.rocketFlame.alpha =1;
        catzRocket.rocketFlame.gotoAndPlay("ignite");
    };
    
    catzRocket.hideSnake = function()
    {
        catzRocket.rocketSnake.alpha=0;
        catzRocket.SnakeLine.alpha = 0;
        catzRocket.rocketFlame.alpha = 0;
    };
    
    catzRocket.playSecondDownloopSound = function()
    {
        catzRocket.rocketSound.stop();
        catzRocket.rocketSound = createjs.Sound.play(catzRocket.rocketSounds[
            catzStateEnum.SecondDownloop]);
    };
    
    catzRocket.catzRelease = function()
    {
        if(catzRocket.isWounded)
        {
            catzRocket.isWounded=false;
            catzRocket.catz.x=0;
        }
        if(catzRocket.catzState!==catzStateEnum.SlammerReady)
        {
                catzRocket.catzVelocity = Math.tan(catzRocket.catzRocketContainer.rotation *3.14/360)*40;
                catzRocket.changeState(catzStateEnum.SecondUploop);
        }
        else
        {
            catzRocket.changeState(catzStateEnum.Normal);
            catzRocket.catzVelocity = Math.tan(catzRocket.catzRocketContainer.rotation *3.14/360)*40;            
        }        
    };
    
    catzRocket.getHit = function(isInstaGib)
    {
        if((invincibilityCounter<=0 || isInstaGib) && !catzRocket.hasFrenzy() && !catzRocket.isHit)
        {
            var instance = createjs.Sound.play("catzScream2");
            instance.volume = 0.5;
            
            if(!catzRocket.isWounded && !isInstaGib)
            {                
                catzRocket.isWounded=true;
                catzRocket.catz.gotoAndPlay("slipping");
                createjs.Tween.get(catzRocket.catz)
                        .to({y:10, x:-25},100)
                        .to({x:-50,y:5},150)
                        .call(catzRocket.catz.gotoAndPlay,["no shake"]);
                invincibilityCounter=1000;
                return false;
            }
            else{                 
                catzRocket.isHit = true;
                catzRocket.changeState(catzStateEnum.FellOffRocket);      
                return true;
            }            
        }    
        else{
            return false;
        }
    };
    
    catzRocket.catzUp = function()
    {
        if(catzRocket.diamondFuel>0) {
            mousedown = true;
            if(catzRocket.catzState === catzStateEnum.Normal)
            {
                catzRocket.diamondFuel -= 0.5;
                catzRocket.catzVelocity-=2;
                catzRocket.changeState(catzStateEnum.Uploop);
            }
            else if(catzRocket.catzState === catzStateEnum.Frenzy)
            {
                catzRocket.catzVelocity-=2;
                catzRocket.changeState(catzStateEnum.FrenzyUploop);
            }
            else if(catzRocket.catzState === catzStateEnum.TerminalVelocity)
            {
               catzRocket.changeState(catzStateEnum.EmergencyBoost);
            }
            else if(catzRocket.catzState === catzStateEnum.SlammerReady 
                    && catzRocket.catzRocketContainer.rotation>-250)
            {
               catzRocket.changeState(catzStateEnum.Slammer);
            }
        }
    };
    
    catzRocket.changeState = function(state)
    {
        catzRocket.catzState = state;
        if(state!==catzStateEnum.SlammerReady && 
                state!==catzStateEnum.FrenzyUploop)
        {
            catzRocket.rocketSound.stop();
            if(catzRocket.rocketSounds[state]!==null)
            {
                catzRocket.rocketSound = createjs.Sound.play(catzRocket.rocketSounds[state]);
                catzRocket.rocketSound.volume = 0.5;
            }
        }
        if(state===catzStateEnum.Normal
            || state===catzStateEnum.TerminalVelocity)
        {
            catzRocket.hideSnake();
            if(!catzRocket.frenzyReady && state===catzStateEnum.Normal)
            {
                catzRocket.catz.gotoAndPlay("no shake");
            }
            else if(!catzRocket.frenzyReady)
            {
                catzRocket.catz.gotoAndPlay("shake");
            }
        }
        else if(state!==catzStateEnum.FellOffRocket 
                && !catzRocket.hasFrenzy())
        {
            if(catzRocket.SnakeLine.alpha===0)
            {
                showSnake();
            }
            if(!catzRocket.frenzyReady)
            {
                catzRocket.catz.gotoAndPlay("shake");
            }
        }
        else if(state!==catzStateEnum.FellOffRocket)
        {
            catzRocket.hideSnake();
            catzRocket.catz.gotoAndPlay("frenzy");
        }
        else
        {
            catzRocket.hideSnake();
            catzRocket.catz.gotoAndPlay("flying");
        }
    };
    
    catzRocket.hasFrenzy = function(){
        if(catzRocket.catzState === catzStateEnum.FrenzyUploop || catzRocket.catzState === catzStateEnum.Frenzy){
            return true;
        }
        else{
            return false;
        }
    };        
    
    catzRocket.canCollide = function(){
        return (catzRocket.catzState!==catzStateEnum.FellOffRocket
                && !catzRocket.hasFrenzy());
    };
    
    catzRocket.reset = function(){
        catzRocket.isWounded=false;
        catzRocket.isHit = false;
        catzRocket.isCrashed = false;
        catzRocket.hideSnake();
        catzRocket.frenzyReady=false;
        catzRocket.frenzyTimer=0;
        catzRocket.frenzyCount=0;
        catzRocket.changeState(catzStateEnum.Normal);
    };
    
    catzRocket.catzEndLoop = function()
    {        
        if(catzRocket.catzState!==catzStateEnum.Downloop
                && catzRocket.catzState!==catzStateEnum.SlammerReady 
                && catzRocket.catzState!==catzStateEnum.Slammer 
                && catzRocket.catzState!==catzStateEnum.SecondDownloop
                && catzRocket.catzState!==catzStateEnum.Slingshot
                && catzRocket.catzState!==catzStateEnum.Frenzy
                && catzRocket.catzState!==catzStateEnum.FrenzyUploop)
        {
            catzRocket.changeState(catzStateEnum.Normal);
        }
        else if (catzRocket.catzState===catzStateEnum.SecondDownloop)
        {
            catzRocket.changeState(catzStateEnum.Slingshot);
        }
        else if (catzRocket.catzState===catzStateEnum.Downloop)
        {
            catzRocket.changeState(catzStateEnum.SlammerReady);
        }
        else if (catzRocket.catzState===catzStateEnum.FrenzyUploop)
        {
            catzRocket.changeState(catzStateEnum.Frenzy);
        }
    };   
    
    catzRocket.invincibilityCountDown = function(minusTime){
        if(invincibilityCounter>0)
        {
            invincibilityCounter-=minusTime;
        }
    };
    
    catzRocket.diamondFuelLossPerTime = function(time){            
        if(catzRocket.diamondFuel>5)
        {
            catzRocket.diamondFuel -= time/1000;
        }

        if(catzRocket.diamondFuel>10)
        {                            
            catzRocket.diamondFuel -= time/20;                
        }
    };
    
    return catzRocket;
}());

