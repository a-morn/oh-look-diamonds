var RocketShip = (function(){
    var 
    catzRocket,
    house,                
    houseListener,
    onTrack=false,                
    cloudIsIn = new Array(),
    rocketShip={},
    canvas,
    godMode = false,
    debugMode = false,
    catzBounds,
    lastResolveNorm = [1,0],
    polygonLine,
    polygonVertices,
    catzVertices,
    flameVertices,
    flameNorm,
    flameBounds,
    catzNorm,
    norm,
    newBounds,
    catzBounds,
    debugText,
    gameView,    
    gameListener,    
    stage,
    wind=0,
    trackTimer = 0,
    windSheet,    
    track,    
    smoke,
    exitSmoke,
    leaves,    
    lightningColor = "#99ccff",       
    seagullSheet,
    bg,        
    text,     
    diamondShardCounter,
    queue,
    mousedown,
    diamondSheet,
    grav = 12,
    jump,           
    attackBirdCont = new createjs.Container(),
    collisionCheckDebug = new createjs.Container(),
    lightningCont = new createjs.Container(),
    sgCont = new createjs.Container(),
    gooseCont = new createjs.Container(),
    hawkCont = new createjs.Container(),
    diCont = new createjs.Container(),
    fgCont = new createjs.Container(),
    starCont = new createjs.Container(),
    cloudCont = new createjs.Container(),
    thunderCont = new createjs.Container(),
    windCont = new createjs.Container(),
    sheetDict,
    containerDict = {
        "diamond" : diCont,
        "seagull" : sgCont,
        "goose" : gooseCont,
        "hawk" : hawkCont
    },
    diSpeed = 25,    
    cloudSpeed = 25,
    fgSpeed = 14,
    sgSpeed =25,
    crashed = false,
    bg,
    queue,
    manifest,    
    rocketSong,
    loopTimer = 0,            
    directorStateEnum = {
        Normal : 0,
        Birds : 1,
        Wind : 2,
        Thunder : 3
    },
    directorState=directorStateEnum.Normal,
    directorTimer=0,
    progressBar,    
    diamondSound,    
    gameStats = {
        score : 0,
        HoboCatHouseBuilt : false,
        BuildOrphanage : false,
        OrphanageBuilt : false,
        CurrentlyBuilding: false,
        BuildRehab: false,
        RehabBuilt: false,
        Difficulty : 0
        }
    ;
    
    function Director() 
    {
        this.initialize();
    }
    //inheritance
    Director.prototype = new createjs.Shape();
    Director.prototype.DirectorInit = Director.prototype.initialize;

    //props
    Director.prototype.state = "normal";
    Director.prototype.opponent = null;
    Director.prototype.freeze = 0;

    //constructor
    Director.prototype.initialize = function (color) 
    {
        this.color = color;
        this.DirectorInit();
        this.graphics.beginFill(color).drawRect(0, 0, 50, 200);
    };
    

    rocketShip.Init = function()
    {
        catzRocket = CatzRocket;
        catzRocket.Init();
        house = House;
        house.Init();
        canvas = document.getElementById('mahCanvas');
                
        var style = canvas.style;
        style.marginLeft = "auto";
        style.marginRight = "auto";
        var parentStyle = canvas.parentElement.style;
        parentStyle.textAlign = "center";
        parentStyle.width = "100%";
        
        stage                       = new createjs.Stage(canvas);
        stage.mouseEventsEnabled    = true;
        
        progressBar = new createjs.Shape();         
        
        progressBar.graphics.beginFill("#907a91").drawRect(0,0,100,20);         
        progressBar.x = canvas.width/2-50;        
        progressBar.y = canvas.height/2-10;
                               
        stage.addChild(progressBar);

        manifest = [                    
                    {id: "enemybirds", src: "assets/new assets/sprites/newBirds.png"},
                    {id: "diamond", src: "assets/new assets/sprites/newDiamond3.png"}, 
                    {id: "rocketSilouette", src: "assets/new assets/img/catzRocketSilouette.png"}, 
                    {id: "meow", src: "assets/meow.mp3"},                    
                    {id: "diamondSound", src: "assets/diamondSound.mp3"},            
                    {id: "diamondShardCounter", src: "assets/new assets/img/DiamondIcon.png"},                    
                    {id:"bg", src:"assets/new assets/img/background long.jpg"},                    
                    {id:"cloud1", src:"assets/new assets/img/cloud 1.png"},
                    {id:"cloud2", src:"assets/new assets/img/cloud 2.png"},
                    {id:"cloud3", src:"assets/new assets/img/cloud 3.png"},
                    {id:"cloud4", src:"assets/new assets/img/cloud 4.png"},
                    {id:"cloud5", src:"assets/new assets/img/cloud 5.png"},                                        
                    {id:"catzRocketCrash", src:"assets/new assets/sound/crash.mp3"},
                    {id:"fgGround", src:"assets/new assets/img/fgGround.png"},
                    {id:"fgTree1", src:"assets/new assets/img/tree 4.png"},
                    {id:"rocketCatz", src:"assets/new assets/sprites/catzOnly.png"},
                    {id:"rocket", src:"assets/new assets/img/rocket.png"},
                    {id:"flame", src:"assets/new assets/sprites/newFlame.png"},
                    {id:"wind", src:"assets/new assets/sprites/wind.png"},
                    {id:"star", src:"assets/new assets/img/star.png"},
                    {id:"house", src:"assets/new assets/img/house no hill.png"},
                    {id:"hobo", src:"assets/new assets/sprites/hoboCat.png"},
                    {id:"smokepuffs", src:"assets/new assets/sprites/smokepuffs.png"},
                    {id:"diamondhouse", src:"assets/new assets/sprites/diamond house progression.png"},
                    {id:"leaves", src:"assets/new assets/sprites/leaves.png"},
                    {id:"cat", src:"assets/new assets/sprites/lookingAtDiamondsSilouette.png"},
                    //{id:"palladiumAlloySong", src:"assets/new assets/sound/palladium alloy.mp3"},
                    {id:"hoboCatSound1", src:"assets/new assets/sound/catz 1.mp3"},
                    {id:"hoboCatSound2", src:"assets/new assets/sound/catz 2.mp3"},
                    {id:"catzSound1", src:"assets/new assets/sound/catz 3.mp3"},
                    {id:"catzSound2", src:"assets/new assets/sound/catz 4.mp3"},
                    {id:"uploopSound", src:"assets/new assets/sound/uploop.mp3"},
                    {id:"downloopSound", src:"assets/new assets/sound/downloop.mp3"},
                    {id:"secondUploopSound", src:"assets/new assets/sound/secondUploop.mp3"},
                    {id:"secondDownloopSound", src:"assets/new assets/sound/secondDownloop.mp3"},
                    {id:"slingshotSound", src:"assets/new assets/sound/slingshot.mp3"},
                    {id:"frenzySound", src:"assets/new assets/sound/frenzy.mp3"},
                    {id:"emeregencyBoostSound", src:"assets/new assets/sound/emergencyBoost.mp3"},
                    {id:"miscSound", src:"assets/new assets/sound/misc.mp3"},
                    {id:"catzScreamSound", src:"assets/new assets/sound/catzScream.mp3"},
                    //{id:"lookDiamondsSong", src:"assets/new assets/sound/tmpMusic1.mp3"},
                    {id:"wick", src:"assets/new assets/sprites/wick.png"}
                ];

        queue = new createjs.LoadQueue(true);
        queue.installPlugin(createjs.Sound);
        queue.on("progress", handleProgress);            
        queue.on("complete", handleComplete);
        queue.loadManifest(manifest);         
    };

    function handleProgress(event)
    {                
        progressBar.graphics.beginFill("#330033").drawRect(0,0,100*event.progress,20);                
        stage.update();
    }

    function handleComplete()
    {
        console.log(spriteSheetData);
        spriteSheetData.setValues(queue);
        createBG();
        createHouseView();
        createGameView();
        stage.addChild(bg,starCont);
        house.gotoHouseViewNormal(gameStats, stage, gameView,text, diamondShardCounter, gameListener, rocketSong, gotoGameView);
        houseListener = createjs.Ticker.on("tick", houseTick,this);
        stage.removeChild(progressBar);        
    }
    
    function houseTick()
    {
        stage.update();
        if(house.hoboSpeach.alpha > 0)
        {
            house.hoboSpeach.alpha -= 0.015;
        }
        
        if(house.catzSpeach.alpha > 0)
        {
            house.catzSpeach.alpha -= 0.015;
        }            
                
        if(house.wickExclamation.alpha > 0.8 && house.wickExclamation.alpha < 0.9)
        {                       
            if(rocketSong.getPosition()<100)
            {
                rocketSong.play();
            }
        }
        
        house.hoboExclamation.alpha = house.hoboActive;                
        
        if(house.wickActive && house.wickExclamation.alpha <1)
        {
            house.wickExclamation.alpha += 0.01;
        }
        
        debugText.text =                 
                + "\nHoboCatHouseBuilt "+ gameStats.HoboCatHouseBuilt 
                + "\nBuilding orphanage "+ gameStats.BuildOrphanage
                + "HoboDialogNo: " + house.hoboDialogNumber                        
    }
    
    function createHouseView()
    {
        house.house = new createjs.Bitmap(queue.getResult("house"));   
        house.house.scaleX=0.8;
        house.house.scaleY=0.8;
        house.house.y=-20;
        var hoboData= spriteSheetData.hobo;
        sheet = new createjs.SpriteSheet(hoboData);
        house.hobo  = new createjs.Sprite(sheet,"cycle");
        house.hobo.x=-110;
        house.hobo.y=225;
        house.hobo.scaleX=0.8;
        house.hobo.scaleY=0.8;        
        
        house.crashRocket = new createjs.Bitmap(queue.getResult("rocketSilouette"));
        house.crashRocket.regX=180;
        house.crashRocket.regY=83;
        house.crashRocket.scaleX=0.5;
        house.crashRocket.scaleY=0.5;  
        house.crashRocket.alpha = 0;
        house.crashRocket.x=220;
        house.crashRocket.y=320;
        
        dHouseData = spriteSheetData.dHouse;
        dSheet = new createjs.SpriteSheet(dHouseData);
        house.diamondHouse = new createjs.Sprite(dSheet,"first");
        house.diamondHouse.alpha=0;
        house.diamondHouse.x=450;
        house.diamondHouse.y=310;
        house.diamondHouse.rotation = 12;
        
        
        catData = spriteSheetData.cat;
        catSheet = new createjs.SpriteSheet(catData);
        house.catz = new createjs.Sprite(catSheet,"cycle");
        //cat.x = 235;
        //cat.y = 190;
        house.catz.y=270;
        house.catz.x=360;
        house.catz.scaleX =0.8;
        house.catz.scaleY =0.8;
        
        wickData = spriteSheetData.wick;
        sheet = new createjs.SpriteSheet(wickData);
        house.wick  = new createjs.Sprite(sheet,"still");
        house.wick.y=50;
        house.wick.x=-210;
        house.wick.scaleX=1.5;
        house.wick.scaleY=1.5;
        
        house.hoboSpeach = new createjs.Text("0", "16px Courier New", "#ffffcc"); 
        house.hoboSpeach.x = 10;             
        house.hoboSpeach.y = 240;
        house.hoboSpeach.text = "";
        house.hoboSpeach.alpha= 0;
        
        house.hoboExclamation = new createjs.Text("0", "18px Courier New", "#ffcc00"); 
        house.hoboExclamation.x = 115;             
        house.hoboExclamation.y = 280;
        house.hoboExclamation.text = "!";
        house.hoboExclamation.alpha= 0;
        
        house.catzSpeach = new createjs.Text("0", "12px Courier New", "#ffffcc"); 
        house.catzSpeach.x = 350;             
        house.catzSpeach.y = 180;
        house.catzSpeach.text = "";
        house.catzSpeach.Alpha = 0;
        
        house.wickExclamation = new createjs.Text("0", "10px Courier New", "#ffcc00"); 
        house.wickExclamation.x = 185;             
        house.wickExclamation.y = 310;
        house.wickExclamation.text = "<-- Fire up the rocket";
        house.wickExclamation.alpha= 0;
        
        house.choice1 = new createjs.Text("", "20px Courier New", "#ffcc00"); 
        house.choice1.x = 0;             
        house.choice1.y = 40;
        house.choice1.text = "";
        house.choice1.Alpha = 0;
        
        house.choice2 = new createjs.Text("", "20px Courier New", "#ffcc00"); 
        house.choice2.x = 0;             
        house.choice2.y = 60;
        house.choice2.text = "";
        house.choice2.Alpha = 0;
        
        house.choice3 = new createjs.Text("", "20px Courier New", "#ffcc00"); 
        house.choice3.x = 0;             
        house.choice3.y = 80;
        house.choice3.text = "";
        house.choice3.Alpha = 0;
        house.choices = [house.choice1, house.choice2,house.choice3];
        
        house.hoboCatSound1 = createjs.Sound.play("hoboCatSound1");
        house.hoboCatSound1.stop();
        house.hoboCatSound2 = createjs.Sound.play("hoboCatSound2");
        house.hoboCatSound2.stop();
        
        house.catzSound1 = createjs.Sound.play("catzSound1");
        house.catzSound1.stop();
        house.catzSound2 = createjs.Sound.play("catzSound2");
        house.catzSound2.stop();
        
        rocketSong = createjs.Sound.play("palladiumAlloySong");
        rocketSong.stop();                
        
        house.houseView.addChild(bg,starCont,house.diamondHouse,house.catz,house.house, house.hobo,house.wick, house.crashRocket, house.hoboExclamation, 
        house.wickExclamation, house.catzSpeach, house.hoboSpeach, house.choice1, house.choice2, house.choice3);
    }
       
   function createBG()
   {
        
        bg = new createjs.Bitmap(queue.getResult("bg"));
        bg.y = -1200;
        setStars();
   }                            

    function createGameView()
    {    
        directorState=directorStateEnum.Normal;
        debugText = new createjs.Text("0", "12px Courier New", "#ffffcc"); 
        debugText.x=500;
        debugText.y=0;
        
        var diamondData = spriteSheetData.diamond;
        diamondSheet = new createjs.SpriteSheet(diamondData);
        var diamond = new createjs.Sprite(diamondSheet,"cycle");

        diamond.x = 0;
        diamond.y = 0;
        
        diCont.addChild(diamond);
        diCont.x = 0;
        diCont.y = 0;

        var fgGround1 = new createjs.Bitmap(queue.getResult("fgGround"));
        //fgGround.scaleX=0.3;
        //fgGround.scaleY=0.3;
        fgGround1.x = 0;
        fgGround1.y = 300;                       
        var fgGround2 = new createjs.Bitmap(queue.getResult("fgGround"));
        //fgGround.scaleX=0.3;
        //fgGround.scaleY=0.3;
        fgGround2.x = 2000;
        fgGround2.y = 300;                       
        fgCont.addChild(fgGround1, fgGround2);    

        diamondShardCounter = new createjs.Bitmap(queue.getResult("diamondShardCounter"));        
        diamondShardCounter.scaleY= 0.8;
        diamondShardCounter.scaleX= 0.8;        
        text = new createjs.Text("0", "20px Courier New", "white"); 
        text.x = 60;             
        text.y = 25;
        
        var rocketData = spriteSheetData.rocket;
           
        
        var spriteSheet = new createjs.SpriteSheet(rocketData);    
        catzRocket.catz = new createjs.Sprite(spriteSheet, "no shake");
        
        rocketData = spriteSheetData.flame;
        var spriteSheet = new createjs.SpriteSheet(rocketData);    
        catzRocket.rocketFlame = new createjs.Sprite(spriteSheet, "cycle");
        catzRocket.rocketFlame.alpha=0;
        catzRocket.rocketFlame.scaleX = 0.4;
        catzRocket.rocketFlame.scaleY = 0.4;
        catzRocket.rocketFlame.x=190;
        catzRocket.rocketFlame.y=200;
        catzRocket.rocketFlame.regY = 265;
        catzRocket.rocketFlame.regX = 390;
        
        catzRocket.silouette = new createjs.Bitmap(queue.getResult("rocketSilouette"));
        catzRocket.silouette.scaleX = 0.25;
        catzRocket.silouette.scaleY = 0.25;
        catzRocket.silouette.alpha = 0;
        catzRocket.silouette.x = 110;
        catzRocket.silouette.y = 90;
                
        catzRocket.catzRocketContainer.x = 260;
        catzRocket.catzRocketContainer.y = 200;
        catzRocket.catz.scaleX = 0.4;
        catzRocket.catz.scaleY = 0.4;
        catzRocket.catzRocketContainer.regY = 100;
        catzRocket.catzRocketContainer.regX = 150;
        catzRocket.catz.currentFrame = 0;  
        
        catzRocket.rocket = new createjs.Bitmap(queue.getResult("rocket"));
        catzRocket.rocket.scaleX = 0.25;
        catzRocket.rocket.scaleY = 0.25;
        catzRocket.rocket.regX = -430;
        catzRocket.rocket.regY = -320;
        catzRocket.catzRocketContainer.addChild(catzRocket.rocket,catzRocket.catz,catzRocket.silouette);
        catzBounds = catzRocket.catzRocketContainer.getTransformedBounds();
        
        catzRocket.rocketSnake.x=0;
        catzRocket.rocketSnake.y=0;
        var snakeAmt = 11;
        for(i=0;i<snakeAmt;i++)
        {
            var shape = new createjs.Shape();
            var x = 260-i*5;
            var r = 9;
            shape.graphics.f(lightningColor).dc(x,200,r);
            shape.regY=5;
            shape.regX=5;
            catzRocket.rocketSnake.addChild(shape);
            if(i>0)
            {
                //shape.alpha=0;
            }
        }
        
        catzRocket.SnakeLine = new createjs.Shape();
        
        var smokeData = spriteSheetData.smoke;
        var smokeSheet = new createjs.SpriteSheet(smokeData);
        smoke = new createjs.Sprite(smokeSheet,"jump");
        smoke.alpha=0;
        smoke.scaleX = 0.5;
        smoke.scaleY = 0.5;
        smoke.regX = 200;
        smoke.regY = 350;
        
        exitSmoke = new createjs.Sprite(smokeSheet,"right");
        exitSmoke.alpha=0;
        exitSmoke.scaleX = 0.5;
        exitSmoke.scaleY = 0.5;
        exitSmoke.regX = 200;
        exitSmoke.regY = 200;
        
        var leavesData = spriteSheetData.leaves;
        var leavesSheet = new createjs.SpriteSheet(leavesData);
        leaves = new createjs.Sprite(leavesSheet,"cycle");
        leaves.alpha=0;
        leaves.scaleX = 0.5;
        leaves.scaleY = 0.5;
        
        var seagullData = spriteSheetData.enemybirds;
        seagullSheet = new createjs.SpriteSheet(seagullData);
        
        var windData = spriteSheetData.wind;
        windSheet = new createjs.SpriteSheet(windData);  
            
            
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
        collisionCheckDebug.addChild(polygonLine);
        
        var anim = ["falcon","crow","bat","duck","seagull","glasses"];
        for (i=0; i<6; i++)
        {
            attackBird = new AttackBird(i+2,seagullSheet,anim[i]);
            attackBirdCont.addChild(attackBird);
            collisionCheckDebug.addChild(attackBird.shape);
        }
        
        catzRocket.rocketSound = createjs.Sound.play("rocketSound");
        catzRocket.rocketSound.volume = 0.1;
        catzRocket.rocketSound.stop();
        diamondSound = createjs.Sound.play("diamondSound");
        diamondSound.volume = 0.2;
        diamondSound.stop();
        gameView = new createjs.Container();
         sheetDict = {
        "diamond" : diamondSheet,
        "seagull" : seagullSheet,
        "goose" : seagullSheet,
        "hawk" : seagullSheet
        };
        
        gameView.addChild(bg,starCont,catzRocket.rocketSnake,catzRocket.SnakeLine,sgCont, hawkCont, gooseCont, attackBirdCont,diCont,
            exitSmoke,smoke, catzRocket.rocketFlame, catzRocket.catzRocketContainer,
             cloudCont,lightningCont,thunderCont,fgCont,leaves, collisionCheckDebug);
    }
    
    function gotoGameView()
    {
        catzRocket.hideSnake();
        if(debugMode===false)
        {
            collisionCheckDebug.alpha=0;
            debugText.alpha=0;
        }
        stage.removeChild(house.houseView);
        stage.addChild(gameView, windCont, text, diamondShardCounter,debugText);
        //createjs.Ticker.removeAllEventListeners();  
        createjs.Ticker.off("tick", houseListener);    
        gameListener = createjs.Ticker.on("tick", update,this);  
        createjs.Ticker.setFPS(30);            
        stage.addEventListener("stagemousedown", catzUp);    
        stage.addEventListener("stagemouseup", catzEndLoop);    
        jump = false;
        catzRocket.catzVelocity=-20;
        createjs.Ticker.setPaused(false);      
        stage.update();
    }
    
    function setStars()
    {
        for(i=0;i<80;i++)
        {
            star = new createjs.Bitmap(queue.getResult("star"));
            delay = Math.random()*2000;
            star.x = Math.random()*800;
            star.y= Math.random()*900-450;
            createjs.Tween.get(star,{loop:true})
                    .wait(delay)
                    .to({alpha:0},1000)
                    .to({alpha:1},1000);
            starCont.addChild(star);
        }
    }

    function update(event)
    { 
        var mult=1;
        if (catzRocket.catzState===catzRocket.catzStateEnum.Frenzy || catzRocket.catzState===catzRocket.catzStateEnum.FrenzyUploop)
        {
            mult=2;
        }
        diSpeed = (0.4+0.4* Math.cos((catzRocket.catzRocketContainer.rotation)/360*2*Math.PI))*mult;            
        cloudSpeed = (12.5+12.5* Math.cos((catzRocket.catzRocketContainer.rotation)/360*2*Math.PI))*mult;
        fgSpeed = (7+7* Math.cos((catzRocket.catzRocketContainer.rotation)/360*2*Math.PI))*mult;
        sgSpeed = (6+6* Math.cos((catzRocket.catzRocketContainer.rotation)/360*2*Math.PI))*mult;        
        if(!event.paused)
        {                
            if(catzRocket.invincibilityCounter>0)
            {
                catzRocket.invincibilityCounter-=event.delta;
            }
            text.text = gameStats.score;            
            if(catzRocket.diamondFrenzyCharge>0)
            {
                catzRocket.diamondFrenzyCharge -= event.delta/2000;
            }
            if(catzRocket.diamondFrenzyCharge>3 && !catzRocket.hasFrenzy)
            {
                catzRocket.hasFrenzy = true;                
            }
            else if(catzRocket.diamondFrenzyCharge<3 && catzRocket.hasFrenzy)
            {
                catzRocket.hasFrenzy = false;
            }
            catzRocket.update(grav,wind,event);
            updateVertices();
            updateDirector(event);
            updateFg(event);
            updateDiamonds(event);
            updateClouds(event);
            updateWorldContainer();
            updateThunderClouds();
            updateAttackBird(event);
            drawCollisionModels();
            if(catzRocket.isCrashed)
            {
                crash();
            }
            debugText.text = 
                "rotation "+catzRocket.catzRocketContainer.rotation
                +"\nvelocity "+catzRocket.catzVelocity
                +"\nstate "+catzRocket.catzState
                +"\nwind"+wind
                +"\ndirectorState"+directorState
                +"\ndirectorTimer"+directorTimer
                +"\nflameFrame"+catzRocket.rocketFlame.currentFrame
                + "\nHoboCatHouseBuilt "+ gameStats.HoboCatHouseBuilt 
                + "\nBuilding orphanage "+ gameStats.BuildOrphanage
                + "\nonTrack: " + onTrack
                + "\nFrenzy: " + catzRocket.frenzyCount
                + "\nFrenzyTimer: " + catzRocket.frenzyTimer
                + "\nfrenzyReady: " + catzRocket.frenzyReady
                + "\nHoboDialogNo: " + house.hoboDialogNumber;
        
            stage.update(event); 
        }
    }
    
    function updateWorldContainer(event)
    {
          bg.y = -1100-(catzRocket.catzRocketContainer.y)/2;
          starCont.y=100-(catzRocket.catzRocketContainer.y)/2;
          if(catzRocket.catzRocketContainer.y<200 && catzRocket.catzRocketContainer.y>-600)
          {
              gameView.y=200-catzRocket.catzRocketContainer.y;

          }
    }

    function updateFg(event)
    {
        if(Math.random()>0.98)
        {
            var tree = new createjs.Bitmap(queue.getResult("fgTree1"));
            tree.x = 1000;
            tree.y = 290;
            fgCont.addChild(tree);        
        }

        var arrayLength = fgCont.children.length;    
        for (var i = 0; i < arrayLength; i++) {
            var kid = fgCont.children[i];        
            if (kid.x <= -3200)
            {
              kid.x = kid.x + 4000;
            }
            kid.x = kid.x - fgSpeed*event.delta/10; 
            if((catzRocket.catzRocketContainer.x-catzBounds.width)<(kid.x) && catzRocket.catzRocketContainer.x > 
                    kid.x && (catzRocket.catzRocketContainer.y-catzBounds.height) < kid.y
                    && catzRocket.catzRocketContainer.y > kid.y)
            {
                leaves.alpha = 1;
                leaves.rotation = 0;
                leaves.x = kid.x+50;
                leaves.y = kid.y;
                leaves.gotoAndPlay("cycle");
                leaves.addEventListener("animationend",function(){hideLeaves();});

            }
        }                
        if (arrayLength>2)
        {
            if(fgCont.children[2].x < -100)
            {
                fgCont.removeChildAt(2);
            }        
        }
        
        if(leaves.alpha===1)
        {
           leaves.x-= fgSpeed*event.delta/20;  
        }
    }
    
    function hideLeaves()
    {
        leaves.alpha=0;
    }
    
    function updateClouds(event)
    {
        if(Math.random()>0.97)
        {
            var cloudtype = Math.floor(Math.random()*5+1);
            cloudtype = "cloud"+cloudtype.toString();
            var yPos = Math.floor(Math.random()*1000-1000);
            var scale = Math.random()*0.3+0.3;
            var cloud = new createjs.Bitmap(queue.getResult(cloudtype));
            cloudIsIn[cloud]=false;

            cloud.scaleX = scale;
            cloud.scaleY = scale;
            cloud.x = 1000;
            cloud.y = yPos;
            cloudCont.addChild(cloud); 
        }
        var arrayLength = cloudCont.children.length;    
        for (var i = 0; i < arrayLength; i++) {
            var kid = cloudCont.children[i];  
             kid.x = kid.x - cloudSpeed;   
            if (kid.x <= -500)
            {
              cloudCont.removeChildAt(i);
              arrayLength = arrayLength - 1;
              i = i - 1;
            }
            var rect = kid.getBounds();
            if(catzRocket.catzRocketContainer.x<(kid.x+rect.width*kid.scaleX) && catzRocket.catzRocketContainer.x > 
                    kid.x && catzRocket.catzRocketContainer.y < (kid.y+rect.height*kid.scaleY)
                    && catzRocket.catzRocketContainer.y > kid.y && cloudIsIn[kid]===false)
            {
                cloudIsIn[kid] = true;
                smoke.alpha = 1;
                smoke.rotation = catzRocket.catzRocketContainer.rotation+270;
                smoke.x = catzRocket.catzRocketContainer.x;
                smoke.y = catzRocket.catzRocketContainer.y;
                smoke.gotoAndPlay("jump");
                smoke.addEventListener("animationend",function(){hideSmoke();});
            }
            else if(cloudIsIn[kid]===true
                    && 
                    ((catzRocket.catzRocketContainer.x-catzBounds.width/2)> (kid.x+rect.width*kid.scaleX)
                    || catzRocket.catzRocketContainer.y-catzBounds.height/2 > (kid.y+rect.height*kid.scaleY)
                    || (catzRocket.catzRocketContainer.y+catzBounds.height < kid.y)))
            {
                cloudIsIn[kid] = false;
                exitSmoke.alpha = 1;
                exitSmoke.rotation = catzRocket.catzRocketContainer.rotation;
                exitSmoke.x = catzRocket.catzRocketContainer.x;
                exitSmoke.y = catzRocket.catzRocketContainer.y;
                exitSmoke.gotoAndPlay("right");
                exitSmoke.addEventListener("animationend",function(){hideExitSmoke();});
            }
        }  
        if(smoke.alpha===1)
        {
            smoke.x-=cloudSpeed;
        }
        if(exitSmoke.alpha===1)
        {
            exitSmoke.x-=cloudSpeed;
        }
    }
    
    function spawnThunderCloud(xPos,yPos)
    {
        console.log("thundercloud spawned");
        var cloudtype = Math.floor(Math.random()*5+1);
        cloudtype = "cloud"+cloudtype.toString();
        var scale = Math.random()*0.3+0.3;
        var cloud = new createjs.Bitmap(queue.getResult(cloudtype));
        cloud.scaleX = scale;
        cloud.scaleY = scale;
        cloud.x = xPos;
        cloud.y = yPos;
        cloud.filters = [new createjs.ColorFilter(0.3,0.3,0.3,1, 0,0,55,0)];
        rect = cloud.getBounds();
        cloud.cache(rect.x,rect.y,rect.width,rect.height);
        thunderCont.addChild(cloud); 
    }
    
    function updateThunderClouds(event)
    {
        var arrayLength = thunderCont.children.length;    
        for (var i = 0; i < arrayLength; i++) {
            var kid = thunderCont.children[i];  
             kid.x = kid.x - cloudSpeed;   
            if (kid.x <= -500)
            {
              thunderCont.removeChildAt(i);
              arrayLength = arrayLength - 1;
              i = i - 1;
            }
            var rect = kid.getBounds();
            if(catzRocket.isHit ===false && catzRocket.catzRocketContainer.x<(kid.x+rect.width*kid.scaleX) && catzRocket.catzRocketContainer.x > 
                    kid.x && catzRocket.catzRocketContainer.y < (kid.y+rect.height*kid.scaleY+100)
                    && catzRocket.catzRocketContainer.y > kid.y+50)
            {
                var lightning= new createjs.Shape();
                lightning.graphics.setStrokeStyle(15,1);
                lightning.graphics.beginStroke(lightningColor);
                lightning.graphics.moveTo(kid.x,kid.y);
                lightning.graphics.lineTo(catzRocket.catzRocketContainer.x,catzRocket.catzRocketContainer.y);
                lightning.graphics.endStroke();
                lightning.graphics.setStrokeStyle(12,1);
                lightning.graphics.beginStroke(lightningColor);
                lightning.graphics.moveTo(catzRocket.catzRocketContainer.x,catzRocket.catzRocketContainer.y);
                lightning.graphics.lineTo(Math.random()*300+100,500);
                lightning.graphics.endStroke();
                lightningCont.addChild(lightning);
                createjs.Tween.get(lightning).to({alpha:0},300);
                getHit();
            }
        }
    }
    
    function generateTrack()
    {
        if(gameStats.Difficulty>=0)
        {
            var rand = Math.floor(Math.random()*tracksJSON["easy"].length);
            var element1  = $.extend(true, [], tracksJSON["easy"][0]);
            for (i=0;i<element1.length;i++)
            {
                element1[i].x+=800;
                element1[i].y+=catzRocket.catzRocketContainer.y;
            }
            rand = Math.floor(Math.random()*tracksJSON["easy"].length);
            var element2 = $.extend(true,[],tracksJSON["easy"][2]);
            for (i=0;i<element2.length;i++)
            {
                element2[i].x+=element1[element1.length-1].x;
                element2[i].y+=element1[element1.length-1].y;
            }
            return element1.concat(element2);
        }
        else if(gameStats.Difficulty===1)
        {
            
        }
        else if(gameStats.Difficulty>1)
        {
            
        }
    }
    
    
    function updateDirector(event)
    {
        directorTimer+=event.delta;
        if (onTrack)
        {
            if(diCont.getNumChildren()===0)
            {
                onTrack =false;
            }
        }
        else
        {
            trackTimer+=event.delta;
            if (trackTimer>5000)
            {
                trackTimer=0;
                onTrack=true;
                gameStats.Difficulty++;
                track = generateTrack();
                for (i=0; i<track.length;i++)
                {
                    if (track[i].graphicType==="bitmap")
                    {
                        var bitmap = new createjs.Bitmap(queue.getResult(track[i].type));
                        var cont = containerDict[track[i].type];
                        bitmap.x = track[i].x;
                        bitmap.y = track[i].y;
                        cont.addChild(bitmap);
                    }
                    else if(track[i].graphicType==="sprite")
                    {
                        var sheet = sheetDict[track[i].type];
                        
                        var sprite = new createjs.Sprite(sheet,track[i].animation);
                        sprite.x = track[i].x; 
                        sprite.y = track[i].y;
                        if(track[i].type ==="diamond")
                        {
                            sprite.scaleX=0.8;
                            sprite.scaleY=0.8;
                        }
                        var cont = containerDict[track[i].type];
                        cont.addChild(sprite);
                        
                    }
                }
            }
        }
        switch(directorState)
        {
            case directorStateEnum.Normal:
               break;
            case directorStateEnum.Birds:
                var rand =Math.random();
                if(rand>0.99)
                {
                    y =Math.random()*700-500;
                    spawnGoose(1000,y);
                    for (var i=1; i<6 ;i++)
                    {
                        spawnGoose(1000+50*i,y+i*50);
                        spawnGoose(1000+50*i,y-i*50);
                    }
                }
                else if(rand>0.98)
                {
                    y =Math.random()*700-500;
                    for (var i=0; i<10 ;i++)
                    {
                        spawnGoose(1000+100*i,y);
                    }
                }
                else if(rand>0.97)
                {
                   spawnSeagull(1000,-500 +Math.random()*700);
                   spawnSeagull(1000,-500 +Math.random()*700);
                }
                break;
            case directorStateEnum.Thunder:
                var rand =Math.random();
                if(rand>0.98)
                {
                    spawnThunderCloud(1000,Math.floor(Math.random()*1000-1000));                   
                }
               break;
            case directorStateEnum.Wind:
                var rand =Math.random();
                if(rand>0.98)
                {
                    upWind();
                }
                else if (rand>0.96)
                {
                    downWind();
                }
                break;
        }
        if(directorTimer>7000)
        {
            noWind();
            //directorState = Math.floor(Math.random()*4);
            directorState = 0;
            directorTimer=0;
        }
    }

    function updateDiamonds(event)
    {      
        var arrayLength = diCont.children.length;
        for (var i = 0; i < arrayLength; i++) {
            var kid = diCont.children[i];
            kid.x = kid.x - diSpeed*event.delta;    
            if (kid.x <= -100)
            {
              diCont.removeChildAt(i);
              arrayLength = arrayLength - 1;
              i = i - 1;
            }                   
            var isOverlap = overlapCheckCircle(kid.x,kid.y,40);
            if(isOverlap)
            {
                diCont.removeChildAt(i);
                gameStats.score += 1;
                catzRocket.frenzyCount+=10;
                arrayLength = arrayLength - 1;
                icon = i - 1;
                diamondSound.play();
                catzRocket.diamondFrenzyCharge +=1;
            }
        }   
    }
    
    
    function upWind()
    {
        wind = -0.73*grav;
        windCont.removeAllChildren();
        var windSprite1 = new createjs.Sprite(windSheet,"cycle");
        windSprite1.x = 50;
        windSprite1.y = 50;
        windSprite1.scaleX = -1;
        windSprite1.scaleY = -1;
        windSprite1.rotation = 10;
        var windSprite2 = new createjs.Sprite(windSheet,"cycle");
        windSprite2.x = 200;
        windSprite2.y = 300;
        windSprite2.scaleX = -1;
        windSprite2.scaleY = -1;
        windSprite1.rotation = 10;
        var windSprite3 = new createjs.Sprite(windSheet,"cycle");
        windSprite3.x = 500;
        windSprite3.y = 400;
        windSprite3.scaleX = -1;
        windSprite3.scaleY = -1;
        windSprite1.rotation = 10;
        windCont.addChild(windSprite1,windSprite2,windSprite3);
        }
         
    function downWind()
    {
        wind = 2*grav;
        windCont.removeAllChildren();
        var windSprite1 = new createjs.Sprite(windSheet,"cycle");
        windSprite1.x = 50;
        windSprite1.y = 50;
        windSprite1.scaleX = 1;
        windSprite1.scaleY = 1;
        windSprite1.rotation = 10;
        var windSprite2 = new createjs.Sprite(windSheet,"cycle");
        windSprite2.x = 270;
        windSprite2.y = 170;
        windSprite2.scaleX = 1;
        windSprite2.scaleY = 1;
        windSprite1.rotation = 10;
        var windSprite3 = new createjs.Sprite(windSheet,"cycle");
        windSprite3.x = 700;
        windSprite3.y = 400;
        windSprite3.scaleX = 1;
        windSprite3.scaleY = 1;
        windSprite1.rotation = 10;
        windCont.addChild(windSprite1,windSprite2,windSprite3);
    }
    
    function noWind()
    {
        wind = 0;
        windCont.removeAllChildren();
    }
    
    function spawnGoose(x,y)
    {
        var seagull = new createjs.Sprite(seagullSheet,"goose");
        seagull.scaleX = 0.8;
        seagull.scaleY = 0.8;
        seagull.x = x;
        seagull.y = y;
        gooseCont.addChild(seagull);
    }
    
    function spawnSeagull(x,y)
    {
        var seagull = new createjs.Sprite(seagullSheet,"seagull");
        seagull.scaleX = 0.8;
        seagull.scaleY = 0.8;
        seagull.x = x;
        seagull.y = y;
        sgCont.addChild(seagull);
    }
    
    function updateAttackBird(event)
    {
        var arrayLength = attackBirdCont.children.length;   
        for (var i = 0; i < arrayLength; i++) {
            var kid = attackBirdCont.children[i];
            kid.update(catzRocket.catzRocketContainer.x,catzRocket.catzRocketContainer.y,event);
            moveAndCollisionCheck(kid,event);
            kid.updateCircle();
            catzCollisionCheck(kid);
            if(flameCollisionCheck(kid))
            {
                kid.temperature+=event.delta; 
                console.log(kid.temperature);
                if(kid.temperature>200 && kid.state!=="grilled")
                {
                    console.log("grilled");
                    kid.setGrilled();
                }
            }
            else if(kid.temperature>=0)
            {
                kid.temperature-=event.delta; 
                if(kid.temperature<0)
                {
                    kid.temperature=0;
                }
            }
        }   
    }
    
    function hideSmoke()
    {
        smoke.alpha = 0;
    }
    
    function hideExitSmoke()
    {
        exitSmoke.alpha = 0;
    }
    
    function catzUp()
    {
        mousedown = true;
        if(catzRocket.catzState === catzRocket.catzStateEnum.Normal)
        {
            catzRocket.catzVelocity-=2;
            catzRocket.changeState(catzRocket.catzStateEnum.Uploop);
        }
        else if(catzRocket.catzState === catzRocket.catzStateEnum.Frenzy)
        {
            catzRocket.catzVelocity-=2;
            catzRocket.changeState(catzRocket.catzStateEnum.FrenzyUploop);
        }
        else if(catzRocket.catzState === catzRocket.catzStateEnum.TerminalVelocity)
        {
           catzRocket.changeState(catzRocket.catzStateEnum.EmergencyBoost);
        }
        else if(catzRocket.catzState === catzRocket.catzStateEnum.SlammerReady 
                && catzRocket.catzRocketContainer.rotation>-250)
        {
           catzRocket.changeState(catzRocket.catzStateEnum.Slammer);
        }
    }

    function catzEndLoop()
    {
        mousedown = false;
        if(catzRocket.catzState!==catzRocket.catzStateEnum.Downloop
                && catzRocket.catzState!==catzRocket.catzStateEnum.SlammerReady 
                && catzRocket.catzState!==catzRocket.catzStateEnum.Slammer 
                && catzRocket.catzState!==catzRocket.catzStateEnum.SecondDownloop
                && catzRocket.catzState!==catzRocket.catzStateEnum.Slingshot
                && catzRocket.catzState!==catzRocket.catzStateEnum.Frenzy
                && catzRocket.catzState!==catzRocket.catzStateEnum.FrenzyUploop)
        {
            catzRocket.changeState(catzRocket.catzStateEnum.Normal);
        }
        else if (catzRocket.catzState===catzRocket.catzStateEnum.SecondDownloop)
        {
            catzRocket.changeState(catzRocket.catzStateEnum.Slingshot);
        }
        else if (catzRocket.catzState===catzRocket.catzStateEnum.Downloop)
        {
            catzRocket.changeState(catzRocket.catzStateEnum.SlammerReady);
        }
        else if (catzRocket.catzState===catzRocket.catzStateEnum.FrenzyUploop)
        {
            catzRocket.changeState(catzRocket.catzStateEnum.Frenzy);
        }
    }
    
    //hittar de globala x-y koordinaterna till hörnen på raketen, samt normalvektorer
    function updateVertices()
    {
        var s = Math.sin(catzRocket.catzRocketContainer.rotation*Math.PI/180);
        var c = Math.cos(catzRocket.catzRocketContainer.rotation*Math.PI/180);
        if(catzRocket.catzState===catzRocket.catzStateEnum.Frenzy ||
                catzRocket.catzState===catzRocket.catzStateEnum.FrenzyUploop)
        {
            var x = catzRocket.catzRocketContainer.x+85*c-13*s;
            var y = catzRocket.catzRocketContainer.y+13*c+85*s;
        }
        else
        {
            var x = catzRocket.catzRocketContainer.x-10*c-13*s;
            var y = catzRocket.catzRocketContainer.y+13*c-10*s;
        }
        var h = (newBounds.height/2);
        var w = (newBounds.width/2);
        polygonVertices[0].x=x-w*c-h*s;
        polygonVertices[0].y=y+h*c-w*s;
        polygonVertices[1].x=x-w*c+h*s;
        polygonVertices[1].y=y-h*c-w*s;
        polygonVertices[2].x=x+w*c+h*s;
        polygonVertices[2].y=y-h*c+w*s;
        polygonVertices[3].x=x+(w+newBounds.nose)*c;
        polygonVertices[3].y=y+(w+newBounds.nose)*s;
        polygonVertices[4].x=x+w*c-h*s;
        polygonVertices[4].y=y+h*c+w*s;
        
        norm[0].x =-(polygonVertices[0].y-polygonVertices[1].y)/newBounds.height;
        norm[0].y =-(polygonVertices[1].x-polygonVertices[0].x)/newBounds.height;
        norm[1].x =-(polygonVertices[1].y-polygonVertices[2].y)/newBounds.width;
        norm[1].y =-(polygonVertices[2].x-polygonVertices[1].x)/newBounds.width;
        norm[2].x =-(polygonVertices[2].y-polygonVertices[3].y)/newBounds.noseLen;
        norm[2].y =-(polygonVertices[3].x-polygonVertices[2].x)/newBounds.noseLen;
        norm[3].x =-(polygonVertices[3].y-polygonVertices[4].y)/newBounds.noseLen;
        norm[3].y =-(polygonVertices[4].x-polygonVertices[3].x)/newBounds.noseLen;
        
        if(catzRocket.isWounded)
        {
            var x = catzRocket.catzRocketContainer.x-55*c+3*s;
            var y = catzRocket.catzRocketContainer.y-3*c-55*s;
        }
        else
        {
            var x = catzRocket.catzRocketContainer.x-5*c+3*s;
            var y = catzRocket.catzRocketContainer.y-3*c-5*s;
        }
        var h = (catzBounds.height/2);
        var w = (catzBounds.width/2);
        catzVertices[0].x=x-w*c-h*s;
        catzVertices[0].y=y+h*c-w*s;
        catzVertices[1].x=x-w*c+h*s;
        catzVertices[1].y=y-h*c-w*s;
        catzVertices[2].x=x+w*c+h*s;
        catzVertices[2].y=y-h*c+w*s;
        catzVertices[3].x=x+w*c-h*s;
        catzVertices[3].y=y+h*c+w*s;
        
        catzNorm[0].x =(catzVertices[0].y-catzVertices[1].y)/catzBounds.height;
        catzNorm[0].y =(catzVertices[1].x-catzVertices[0].x)/catzBounds.height;
        catzNorm[1].x =(catzVertices[1].y-catzVertices[2].y)/catzBounds.width;
        catzNorm[1].y =(catzVertices[2].x-catzVertices[1].x)/catzBounds.width;
        
        if(catzRocket.catzState===catzRocket.catzStateEnum.Frenzy ||
                catzRocket.catzState===catzRocket.catzStateEnum.FrenzyUploop)
        {
            var x = catzRocket.catzRocketContainer.x+55*c-13*s;
            var y = catzRocket.catzRocketContainer.y+13*c+55*s;
        }
        else
        {
            var x = catzRocket.catzRocketContainer.x-40*c-13*s;
            var y = catzRocket.catzRocketContainer.y+13*c-40*s;
        }
        var h = (flameBounds.height/2);
        var w = (flameBounds.width);
        flameVertices[0].x=x-h*s;
        flameVertices[0].y=y+h*c;
        flameVertices[1].x=x+h*s;
        flameVertices[1].y=y-h*c;
        flameVertices[2].x=x-w*c;
        flameVertices[2].y=y-w*s;
        flameNorm[0].x =(flameVertices[0].y-flameVertices[1].y)/flameBounds.height;
        flameNorm[0].y =(flameVertices[1].x-flameVertices[0].x)/flameBounds.height;
        flameNorm[1].x =-(flameVertices[0].y-flameVertices[2].y)/flameBounds.length;
        flameNorm[1].y =-(flameVertices[2].x-flameVertices[0].x)/flameBounds.length;
        flameNorm[2].x =(flameVertices[1].y-flameVertices[2].y)/flameBounds.length;
        flameNorm[2].y =(flameVertices[2].x-flameVertices[1].x)/flameBounds.length;
    }
    
    function collisionCheckBbirds()
    {
        var arrayLength = attackBirdCont.children.length;   
        for (var i = 0; i < arrayLength; i++) {
            var kid = attackBirdCont.children[i];
            collisionCheck(kid);
        }
    }
    
    function moveAndCollisionCheck(bird,event)
    {
        isCollide = collisionCheck(bird);
        var dispX = bird.velocityX*event.delta/1000;
        var dispY = bird.velocityY*event.delta/1000;
        if(dispX>bird.rad/2 || dispY>bird.rad/2 )
        {
            var noSteps = Math.min(2*Math.max(dispX,dispY)/bird.rad,4);
            for(i=0; i<noSteps;i++)
            {
                bird.x += dispX/noSteps;
                bird.y += dispY/noSteps;
                isCollide = collisionCheck(bird);
                if(isCollide)
                {

                    dispX = bird.velocityX*event.delta/1000;
                    dispY = bird.velocityY*event.delta/1000;
                }
            }
        }
        else
        {
            bird.x += dispX;
            bird.y += dispY;
            isCollide = collisionCheck(bird);
        }
        //console.log(dispX+" "+dispY);
        return isCollide;
    }
    
    function collisionCheck(bird)
    {
        if(Math.abs(bird.x-catzRocket.catzRocketContainer.x)<200 
                && Math.abs(bird.y-catzRocket.catzRocketContainer.y)<150)
        {
            var minOverlapNorm = 0;
            var minOverlapDist=Infinity;
            for(var i=0; i<norm.length;i++)
            {
                var proj1 = norm[i].x*polygonVertices[norm[i].vert1].x+
                        norm[i].y*polygonVertices[norm[i].vert1].y;
                var proj2 = norm[i].x*polygonVertices[norm[i].vert2].x+
                        norm[i].y*polygonVertices[norm[i].vert2].y;
                var projC = norm[i].x*bird.x+norm[i].y*bird.y;
                if(projC-Math.max(proj1,proj2)>bird.rad || Math.min(proj1,proj2)-projC>bird.rad)
                {
                    return false;
                }
                if(bird.rad-projC+Math.max(proj1,proj2)<Math.abs(minOverlapDist))
                {
                    minOverlapDist= bird.rad-projC+Math.max(proj1,proj2);
                    minOverlapNorm = i;
                }
                if(bird.rad-Math.min(proj1,proj2)+projC<Math.abs(minOverlapDist))
                {
                    minOverlapDist=-bird.rad+Math.min(proj1,proj2)-projC;
                    minOverlapNorm = i;
                }
            }
            closestVertex=0;
            minDist=Infinity;
            for(var i=0; i<polygonVertices.length;i++)
            {
                var dist = Math.pow((polygonVertices[i].x-bird.x),2)
                        +Math.pow((polygonVertices[i].y-bird.y),2);
                if(dist<minDist)
                {
                    closestVertex=i;
                    minDist=dist;
                }
            }
            var x= bird.x-polygonVertices[closestVertex].x;
            var y= bird.y-polygonVertices[closestVertex].y;
            var normX = x/Math.sqrt(y*y+x*x);
            var normY = y/Math.sqrt(y*y+x*x);
            var projMin = Infinity;
            var projMax = -Infinity;
            for(var i=0; i<polygonVertices.length;i++)
            {
                var proj = normX*polygonVertices[i].x+
                    normY*polygonVertices[i].y;
                    if(proj<projMin)
                    {
                        projMin=proj;
                    }
                    if (proj>projMax)
                    {
                        projMax=proj;                    
                    }
            } 
            projC = normX*bird.x+normY*bird.y;
            if(projC-projMax>bird.rad || projMin-projC>bird.rad)
            {
                return false;
            }
            else if(bird.rad-projC+projMax<Math.abs(minOverlapDist))
            {
                minOverlapDist = bird.rad-projC+projMax;
                collisionResolve(bird,normX,normY,minOverlapDist);                
            }
            else if( bird.rad-projMin+projC<Math.abs(minOverlapDist))
            {
                minOverlapDist = -bird.rad+projMin-projC;
                collisionResolve(bird,normX,normY,minOverlapDist);                
            }
            else
            {
                collisionResolve(bird,norm[minOverlapNorm].x,norm[minOverlapNorm].y,minOverlapDist);                
            }
            return true;
        }
        else{return false;}
    }
    
    //enklare, snabbare variant av kollisionhanteringen som kan användas vid tex diamanplockning
    function overlapCheckCircle(x,y,r)
    {
        for(var i=0; i<norm.length;i++)
        {
            var proj1 = norm[i].x*polygonVertices[norm[i].vert1].x+
                    norm[i].y*polygonVertices[norm[i].vert1].y;
            var proj2 = norm[i].x*polygonVertices[norm[i].vert2].x+
                    norm[i].y*polygonVertices[norm[i].vert2].y;
            var projC = norm[i].x*x+norm[i].y*y;
            if(projC-Math.max(proj1,proj2)>r || Math.min(proj1,proj2)-projC>r)
            {
                return false;
            }
        }
        return true;
    }
    
    function catzCollisionCheck(bird)
    {
        for(var i=0; i<catzNorm.length;i++)
        {
            var proj1 = catzNorm[i].x*catzVertices[catzNorm[i].vert1].x+
                    catzNorm[i].y*catzVertices[catzNorm[i].vert1].y;
            var proj2 = catzNorm[i].x*catzVertices[catzNorm[i].vert2].x+
                    catzNorm[i].y*catzVertices[catzNorm[i].vert2].y;
            var projC = catzNorm[i].x*bird.x+catzNorm[i].y*bird.y;
            if(projC-Math.max(proj1,proj2)>bird.rad || Math.min(proj1,proj2)-projC>bird.rad)
            {
                return false;
            }
        }
        if(catzRocket.invincibilityCounter<=0 && godMode ===false
                &&catzRocket.catzState!==catzRocket.catzStateEnum.Frenzy
                &&catzRocket.catzState!==catzRocket.catzStateEnum.FrenzyUploop)
        {
            if(!catzRocket.isWounded)
            {                
                catzRocket.isWounded=true;
                catzRocket.catz.gotoAndPlay("slipping");
                createjs.Tween.removeAllTweens(catzRocket.catz);
                createjs.Tween.get(catzRocket.catz)
                        .to({y:10, x:-25},100)
                        .to({x:-50,y:0},150)
                        .call(catzRocket.catz.gotoAndPlay,["no shake"]);
                catzRocket.invincibilityCounter=1000;
            }
            else{ catzRocket.getHit();}
        }
        return true;
    }
    
    function flameCollisionCheck(bird)
    {
        if(1===catzRocket.rocketFlame.alpha)
        {
            for(var i=0; i<flameNorm.length;i++)
            {
                var proj1 = flameNorm[i].x*flameVertices[flameNorm[i].vert1].x+
                        flameNorm[i].y*flameVertices[flameNorm[i].vert1].y;
                var proj2 = flameNorm[i].x*flameVertices[flameNorm[i].vert2].x+
                        flameNorm[i].y*flameVertices[flameNorm[i].vert2].y;
                var projC = flameNorm[i].x*bird.x+flameNorm[i].y*bird.y;
                if(projC-Math.max(proj1,proj2)>bird.rad || Math.min(proj1,proj2)-projC>bird.rad)
                {
                    return false;
                }
            }

            return true;
        }
        else
        {
            return false;
        }
    }
    
    function sign(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x))
    {    
        return x;
    }
    return x > 0 ? 1 : -1;
}
    
     function collisionResolve(bird,normX,normY,normDist)
    { 
        if(catzRocket.catzState!==catzRocket.catzStateEnum.FellOffRocket)
        {
            bird.x+=normX*normDist*2;
            bird.y+=normY*normDist*2;
            normX=normX*sign(normDist);
            normY=normY*sign(normDist);
            lastResolveNorm[0]=normX;
            lastResolveNorm[1]=normY;
            reflect = -2.5*(normX*bird.velocityX+normY*bird.velocityY);
            bird.velocityX+=reflect*normX;
            bird.velocityY+=reflect*normY;
            catzRocket.catzVelocity-=reflect*normY/250;
        }
    }
   
    function drawCollisionModels()
    {
        polygonLine.graphics = new createjs.Graphics();
        polygonLine.x=0;
        polygonLine.y=0;
        for (var i = 0; i <polygonVertices.length ; i++) 
        {
            polygonLine.graphics.setStrokeStyle(2,1);
            polygonLine.graphics.beginStroke("black");
            polygonLine.graphics.moveTo(polygonVertices[i].x,polygonVertices[i].y);
            if(i===polygonVertices.length-1)
            {
                polygonLine.graphics.lineTo( polygonVertices[0].x, polygonVertices[0].y);
            
            }
            else
            {
                polygonLine.graphics.lineTo( polygonVertices[i+1].x, polygonVertices[i+1].y);
            }
            polygonLine.graphics.endStroke();
        } 
        for (var i = 0; i <catzVertices.length ; i++) 
        {
            polygonLine.graphics.setStrokeStyle(2,1);
            polygonLine.graphics.beginStroke("red");
            polygonLine.graphics.moveTo(catzVertices[i].x,catzVertices[i].y);
            if(i===catzVertices.length-1)
            {
                polygonLine.graphics.lineTo( catzVertices[0].x, catzVertices[0].y);
            
            }
            else
            {
                polygonLine.graphics.lineTo( catzVertices[i+1].x, catzVertices[i+1].y);
            }
            polygonLine.graphics.endStroke();
        } 
        var colors = ["green","red","blue"];         
        for (var i = 0; i <flameVertices.length ; i++) 
        {
            polygonLine.graphics.setStrokeStyle(2,1);
            polygonLine.graphics.beginStroke("green");
            polygonLine.graphics.moveTo(flameVertices[i].x,flameVertices[i].y);
            if(i===flameVertices.length-1)
            {
                polygonLine.graphics.lineTo( flameVertices[0].x, flameVertices[0].y);
            }
            else
            {
                polygonLine.graphics.lineTo( flameVertices[i+1].x, flameVertices[i+1].y);
            }
            polygonLine.graphics.endStroke();
        } 
        polygonLine.graphics.setStrokeStyle(2,2);
        polygonLine.graphics.beginStroke("pink");
        polygonLine.graphics.moveTo(
                catzRocket.catzRocketContainer.x,
                catzRocket.catzRocketContainer.y);
        polygonLine.graphics.lineTo(
                catzRocket.catzRocketContainer.x+lastResolveNorm[0]*100,
                catzRocket.catzRocketContainer.y+lastResolveNorm[1]*100);
        polygonLine.graphics.endStroke();
    }
    
    function getHit()
    {
        stage.removeAllEventListeners();
        catzRocket.getHit();
    }
    
    function houseTick ()
    {
        stage.update();
        if(house.hoboSpeach.alpha > 0)
        {
            house.hoboSpeach.alpha -= 0.015;
        }
        
        if(house.catzSpeach.alpha > 0)
        {
            house.catzSpeach.alpha -= 0.015;
        }            
                
        if(house.wickExclamation.alpha > 0.8 && house.wickExclamation.alpha < 0.9)
        {                       
            if(rocketSong.getPosition()<100)
            {
                rocketSong.play();
            }
        }
        
        house.hoboExclamation.alpha = house.hoboActive;                
        
        if(house.wickActive && house.wickExclamation.alpha <1)
        {
            house.wickExclamation.alpha += 0.01;
        }
        
        debugText.text =                 
                + "\nHoboCatHouseBuilt "+ gameStats.HoboCatHouseBuilt 
                + "\nBuilding orphanage "+ gameStats.BuildOrphanage
                + "HoboDialogNo: " + house.hoboDialogNumber                
        
    };
    
    function crash()
    {
        catzRocket.rocket.x=0;
        catzRocket.rocket.alpha=1;
        lightningCont.removeAllChildren();
        directorState=directorStateEnum.Normal;
        catzRocket.isWounded=false;
        noWind();
        catzRocket.silouette.alpha=0;
        catzRocket.catz.alpha = 1;
        stage.removeAllEventListeners();
        stage.removeChild(gameView);
        stage.addChild(house.houseView);
        stage.update();
        house.wickExclamation.alpha= 0;
        createjs.Ticker.setFPS(20);
        createjs.Ticker.off("tick", gameListener);
        houseListener = createjs.Ticker.on("tick", houseTick,this);
        house.wick.x=-100;
        house.wick.removeAllEventListeners();
        house.wick.gotoAndPlay("still");
        createjs.Tween.removeAllTweens(catzRocket.catzRocketContainer);
        createjs.Tween.removeAllTweens(house.houseView);
        if(catzRocket.isHit)
        {            
            house.gotoHouseViewWithoutRocket(gameStats, catzRocket);
        }
        else
        {
            house.gotoHouseViewWithRocket(gameStats, catzRocket);               
        }   
        catzRocket.isHit = false;
        catzRocket.isCrashed = false;
        catzRocket.catzRocketContainer.x = 300;
        catzRocket.catzRocketContainer.y = 200;
        catzRocket.heightOffset=0;
        catzRocket.catzRocketContainer.rotation =0;
        catzRocket.hideSnake();
        catzRocket.frenzyReady=false;
        catzRocket.frenzyTimer=0;
        catzRocket.frenzyCount=0;
        catzRocket.catz.gotoAndPlay("no shake");
        catzRocket.changeState(catzRocket.catzStateEnum.Normal);
        catzRocket.catzVelocity = 0;
        bg.y = -1200;
        starCont.y=0;
        var instance = createjs.Sound.play("catzRocketCrash");
        instance.volume=0.5;
        onTrack=false;
        //shold check for hoboActive here        
        createjs.Tween.get(house.houseView)
                .wait(200)
                .to({x:-50, y:20},50)
                .to({x:50, y:-40},50)
                .to({x:-50, y:50},50)
                .to({x:20, y:-20},50)
                .to({x:-10, y:10},50)
                .to({x:10, y:-10},50)
                .to({x:0, y:0},50)
                .wait(800);
        createjs.Tween.get(house.wick)
            .wait(2000)
            .to({x:-210},1500,createjs.Ease.quadInOut)
            .call((function(){house.activateWick(gameStats, gotoGameView);}));
        stage.update();        
    }
    return rocketShip;
}());