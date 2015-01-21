var RocketShip = (function(){
    var 
    currentTrack = 0,
    currentLevel = 0,
    currentDisplacement = 0,
    catzRocket,
    house,     
    hud,
    hudPointer,
    hudGlass,
    houseListener,
    onTrack=false,                
    cloudIsIn = new Array(),
    rocketShip={},
    canvas,
    godMode = true,
    debugMode = true,
    muteButton,
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
    squawkSound,
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
    greatDiamondSheet,
    mediumDiamondSheet,
    grav = 12,
    jump,           
    parallaxCont = new createjs.Container(),
    attackBirdCont = new createjs.Container(),
    collisionCheckDebug = new createjs.Container(),
    lightningCont = new createjs.Container(),
    sgCont = new createjs.Container(),
    gooseCont = new createjs.Container(),
    hawkCont = new createjs.Container(),
    diCont = new createjs.Container(),
    scatterDiamondsCont = new createjs.Container(),
    fgCont = new createjs.Container(),
    fgTopCont = new createjs.Container(),
    starCont = new createjs.Container(),
    cloudCont = new createjs.Container(),
    thunderCont = new createjs.Container(),
    windCont = new createjs.Container(),
    sheetDict,
    containerDict = {
        "diamond" : diCont,
        "mediumDiamond" : diCont,
        "greatDiamond" : diCont,
        "seagull" : sgCont,
        "goose" : gooseCont,
        "hawk" : hawkCont,
        "thunderCloud" : thunderCont
    },
    diSpeed = 25,    
    cloudSpeed = 25,
    fgSpeed = 14,
    parallaxSpeed = 0.2,
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
        kills : 0,
        currentRound: 0,
        CurrentlyBuilding: false,
        hoboCatHouse : {built : false, isBuilding : false, builtOnRound : null} ,
        orphanage : {built : false, isBuilding : false, builtOnRound : null, youthCenter : false, summerCamp : false},       
        rehab: {built : false, isBuilding : false, builtOnRound : null},        
        university: {built : false, isBuilding : false, builtOnRound : null},
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
        
        if ('ontouchstart' in document.documentElement) {
            createjs.Touch.enable(stage);           
        } 
        
        progressBar = new createjs.Shape();         
        
        progressBar.graphics.beginFill("#907a91").drawRect(0,0,100,20);         
        progressBar.x = canvas.width/2-50;        
        progressBar.y = canvas.height/2-10;
                               
        stage.addChild(progressBar);

        manifest = [                    
                    {id: "enemybirds", src: "assets/new assets/sprites/newBirds.png"},
                    {id: "diamond", src: "assets/new assets/sprites/newDiamond3.png"}, 
                    {id: "mediumDiamond", src: "assets/new assets/sprites/newDiamond2.png"}, 
                    {id: "greatDiamond", src: "assets/new assets/sprites/newDiamond.png"}, 
                    {id: "rocketSilouette", src: "assets/new assets/img/catzRocketSilouette.png"}, 
                    {id: "meow", src: "assets/meow.mp3"},                    
                    {id: "diamondSound", src: "assets/diamondSound.mp3"},            
                    {id: "diamondShardCounter", src: "assets/new assets/img/DiamondIcon.png"},                    
                    {id:"bg", src:"assets/new assets/img/background long.jpg"},                    
                    {id:"ohlookdiamonds", src:"assets/new assets/img/ohlookdiamonds.png"},                    
                    {id:"bgParallax", src:"assets/new assets/img/background parallax.png"},                    
                    {id:"bgParallax 3", src:"assets/new assets/img/background parallax 4.png"},                    
                    {id:"bgParallax 2", src:"assets/new assets/img/background parallax 3.png"},                    
                    {id:"onlookers", src:"assets/new assets/sprites/onlookers.png"},                    
                    {id:"cloud1", src:"assets/new assets/img/cloud 1.png"},
                    {id:"cloud2", src:"assets/new assets/img/cloud 2.png"},
                    {id:"cloud3", src:"assets/new assets/img/cloud 3.png"},
                    {id:"cloud4", src:"assets/new assets/img/cloud 4.png"},
                    {id:"cloud5", src:"assets/new assets/img/cloud 5.png"},                                        
                    {id:"hud", src:"assets/new assets/img/HUD.png"},                                        
                    {id:"hudPointer", src:"assets/new assets/img/HUDpointer.png"},                                        
                    {id:"hudGlass", src:"assets/new assets/sprites/hudGlass.png"},                                        
                    {id:"catzRocketCrash", src:"assets/new assets/sound/crash.mp3"},
                    {id:"wind", src:"assets/new assets/sound/wind.mp3"},
                    {id:"klonk1", src:"assets/new assets/sound/klonk1.mp3"},
                    {id:"klonk2", src:"assets/new assets/sound/klonk2.mp3"},
                    {id:"klonk3", src:"assets/new assets/sound/klonk3.mp3"},
                    {id:"klonk4", src:"assets/new assets/sound/klonk4.mp3"},
                    {id:"lightningBolt", src:"assets/new assets/sound/lightning_bolt.mp3"},
                    {id:"thunder", src:"assets/new assets/sound/thunder.mp3"},
                    {id:"crickets", src:"assets/new assets/sound/crickets.mp3"},
                    {id:"grilled", src:"assets/new assets/sound/grilled.mp3"},
                    {id:"squawk1", src:"assets/new assets/sound/squawk1.mp3"},
                    {id:"squawk2", src:"assets/new assets/sound/squawk2.mp3"},
                    {id:"squawk3", src:"assets/new assets/sound/squawk3.mp3"},
                    {id:"fgGround", src:"assets/new assets/img/fgGround.png"},
                    {id:"fgGroundTop", src:"assets/new assets/img/fgGroundTop.png"},
                    {id:"mouseHobo", src:"assets/new assets/img/mouseover hobo.png"},
                    {id:"mouseRocket", src:"assets/new assets/img/mouseover rocket.png"},
                    {id:"mouseTimmy", src:"assets/new assets/img/mouseover timmy.png"},
                    {id:"mousePriest", src:"assets/new assets/img/mouseover priest.png"},
                    {id:"mouseCatparty", src:"assets/new assets/img/mouseover cat party.png"},
                    {id:"supportingCharacter", src:"assets/new assets/sprites/supporting characters.png"},
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
                    {id:"palladiumAlloySong", src:"assets/new assets/sound/pallaydiumAlloySongShort.mp3"},
                    {id:"hoboCatSound1", src:"assets/new assets/sound/catz 1.mp3"},
                    {id:"catzSound1", src:"assets/new assets/sound/catz 3.mp3"},
                    {id:"uploopSound", src:"assets/new assets/sound/uploop.mp3"},
                    {id:"downloopSound", src:"assets/new assets/sound/downloop.mp3"},
                    {id:"secondUploopSound", src:"assets/new assets/sound/secondUploop.mp3"},
                    {id:"secondDownloopSound", src:"assets/new assets/sound/secondDownloop.mp3"},
                    {id:"slingshotSound", src:"assets/new assets/sound/slingshot.mp3"},
                    {id:"frenzySound", src:"assets/new assets/sound/frenzy.mp3"},
                    {id:"emeregencyBoostSound", src:"assets/new assets/sound/emergencyBoost.mp3"},
                    {id:"miscSound", src:"assets/new assets/sound/misc.mp3"},
                    {id:"catzScream2", src:"assets/new assets/sound/cat_meow_wounded_1.mp3"},
                    //{id:"lookDiamondsSong", src:"assets/new assets/sound/tmpMusic1.mp3"},
                    {id:"wick", src:"assets/new assets/sprites/wick.png"},
                    {id:"wickSound", src:"assets/new assets/sound/wick.mp3"},
                    {id:"mute", src:"assets/new assets/sprites/mute button.png"}
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
        spriteSheetData.setValues(queue);
        createBG();
        createHouseView();
        createGameView();
        stage.addChild(bg,starCont);
        stage.enableMouseOver();
        house.gotoHouseViewNormal(gameStats, stage, gameView,text, diamondShardCounter,
            muteButton, gameListener, rocketSong, gotoGameView);
        houseListener = createjs.Ticker.on("tick", houseTick,this);
        stage.removeChild(progressBar);        
    }
    
    function houseTick()
    {
        stage.update();
        if(house.characterSpeach.alpha > 0)
        {
            house.characterSpeach.alpha -= 0.015;
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
                + "bg.y: " + bg.y                        
    }
    
    function createHouseView()
    {
        muteData = spriteSheetData.muteButton;
        mSheet = new createjs.SpriteSheet(muteData);
        muteButton = new createjs.Sprite(mSheet,"mute");
        muteButton.x = 745;
        muteButton.y = 0;
        muteButton.addEventListener("click",switchMute);
        
        house.house = new createjs.Bitmap(queue.getResult("house"));   
        house.house.scaleX=0.8;
        house.house.scaleY=0.8;
        house.house.y=-20;
        
        var hoboData= spriteSheetData.hobo;
        sheet = new createjs.SpriteSheet(hoboData);
        house.hobo  = new createjs.Sprite(sheet,"cycle");
        house.hobo.x=-110;
        house.hobo.y=225;  
        house.hobo.regX = -210;
        house.hobo.regY = -180;
        
        var timmyData= spriteSheetData.supportingCharacter;
        sheet = new createjs.SpriteSheet(timmyData);
        house.timmy= new createjs.Sprite(sheet,"timmy");
        house.timmy.x=83;
        house.timmy.y=362;
        house.timmy.scaleX=0.8;
        house.timmy.scaleY=0.8;
        house.timmy.alpha = 0;
        
        var priestData= spriteSheetData.supportingCharacter;
        sheet = new createjs.SpriteSheet(priestData);
        house.priest= new createjs.Sprite(sheet,"priest");
        house.priest.x=52;
        house.priest.y=330;
        house.priest.scaleX=0.8;
        house.priest.scaleY=0.8;
        house.priest.alpha = 0;
        
        house.oh = new createjs.Bitmap(queue.getResult("ohlookdiamonds"));
        house.oh.sourceRect = new createjs.Rectangle(0,0,227,190);
        house.oh.x=100;
        house.oh.y=-1450;
        house.oh.alpha=0;
        house.look = new createjs.Bitmap(queue.getResult("ohlookdiamonds"));
        house.look.x=350;
        house.look.y=-1450;
        house.look.sourceRect = new createjs.Rectangle(227,0,400,160);
        house.look.alpha=0;;
        house.diamonds = new createjs.Bitmap(queue.getResult("ohlookdiamonds"));
        house.diamonds.sourceRect = new createjs.Rectangle(0,176,620,160);
        house.diamonds.x=100;
        house.diamonds.y=-1273;
        house.diamonds.alpha=0;
        
        house.diCont = new createjs.Container();
        var diamondData = spriteSheetData.diamond;
        diamondSheet = new createjs.SpriteSheet(diamondData);
        var positions = diamondConstellation;
        for(var i=0; i<positions.length;i++)
        {
            var diamond = new createjs.Sprite(diamondSheet,"cycle");
            diamond.x=positions[i].x;
            diamond.y=positions[i].y-1500;
            diamond.currentAnimationFrame = positions[i].frame;
            diamond.scaleX=positions[i].scale;
            diamond.scaleY=positions[i].scale;
            house.diCont.addChild(diamond);
        }
        //house.diCont.alpha=0;

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
        
        house.diamondHouseCont = new createjs.Container();
        house.hoboCatHouse = new createjs.Sprite(dSheet,"hoboHouse");
        house.hoboCatHouse.alpha=0;
        house.hoboCatHouse.x=430;
        house.hoboCatHouse.y=375;
        house.hoboCatHouse.rotation = 5;
        house.diamondHouseCont.addChild(house.hoboCatHouse);
        house.diamondHouseArray["hoboCatHouse"] = house.hoboCatHouse;
        
        house.rehab = new createjs.Sprite(dSheet,"catnip treatment facility");
        house.rehab.alpha=0;
        house.rehab.x=455;
        house.rehab.y=360;
        house.rehab.rotation = 12;
        house.diamondHouseCont.addChild(house.rehab);
        house.diamondHouseArray["rehab"] = house.rehab;
        
        house.orphanage = new createjs.Sprite(dSheet,"orphanage");
        house.orphanage.alpha=0;
        house.orphanage.x=500;
        house.orphanage.y=382;
        house.orphanage.rotation = 15;
        house.diamondHouseCont.addChild(house.orphanage);
        house.diamondHouseArray["orphanage"] = house.orphanage;
        
        house.university = new createjs.Sprite(dSheet,"university");
        house.university.alpha=0;
        house.university.x=550;
        house.university.y=357;
        house.university.rotation = 16;
        house.diamondHouseCont.addChild(house.university);
        house.diamondHouseArray["university"] = house.university;
        
        house.mouseHobo = new createjs.Bitmap(queue.getResult("mouseHobo"));
        house.mouseHobo.scaleX=0.5;
        house.mouseHobo.scaleY=0.5;  
        house.mouseHobo.x=110;
        house.mouseHobo.y=316;
        house.mouseHobo.alpha=0;
        
        house.mouseRocket = new createjs.Bitmap(queue.getResult("mouseRocket"));
        house.mouseRocket.scaleX=1;
        house.mouseRocket.scaleY=1;  
        house.mouseRocket.x=207;
        house.mouseRocket.y=338;
        house.mouseRocket.alpha=0;
        
//        house.lookingAtStarsButton = new createjs.Shape();
//        house.lookingAtStarsButton.graphics.f("black").dr(0,0,760,50);
//        house.lookingAtStarsButton.alpha=0.01;
//        house.lookingAtStarsButton.addEventListener("mouseover",shiftUp);
//        house.lookingAtStarsButton.addEventListener("mouseout",shiftDown);
//        house.lookingAtStarsButton.addEventListener("click",goUp);
        
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
        
        house.wickLight = new createjs.Shape();
        house.wickLight.graphics.beginFill("#ffcc00").dc(0,0,1.5);
        house.wickLight.x = 174;
        house.wickLight.y = 319;
        house.wickLight.alpha = 0;
        
        house.characterSpeach = new createjs.Text("0", "16px Fauna One", "#ffffcc"); 
        house.characterSpeach.x = 10;             
        house.characterSpeach.y = 240;
        house.characterSpeach.text = "";
        house.characterSpeach.alpha= 0;
        
        house.hoboExclamation = new createjs.Text("0", "18px Fauna One", "#ffcc00"); 
        house.hoboExclamation.x = 115;             
        house.hoboExclamation.y = 280;
        house.hoboExclamation.text = "!";
        house.hoboExclamation.alpha= 0;
        
        house.catzSpeach = new createjs.Text("0", "12px Fauna One", "#ffffcc"); 
        house.catzSpeach.x = 350;             
        house.catzSpeach.y = 180;
        house.catzSpeach.text = "";
        house.catzSpeach.Alpha = 0;
        
        house.wickExclamation = new createjs.Text("0", "10px Fauna One", "#ffcc00"); 
        house.wickExclamation.x = 185;             
        house.wickExclamation.y = 313;
        house.wickExclamation.text = "<--------- Fire up the rocket";
        house.wickExclamation.alpha= 0;
        
        house.choice1 = new createjs.Text("", "20px Fauna One", "#ffcc00"); 
        house.choice1.x = 350;             
        house.choice1.y = 150;
        house.choice1.text = "";
        house.choice1.Alpha = 0;
        
        house.choice2 = new createjs.Text("", "20px Fauna One", "#ffcc00"); 
        house.choice2.x = 350;             
        house.choice2.y = 120;
        house.choice2.text = "";
        house.choice2.Alpha = 0;
        
        house.choice3 = new createjs.Text("", "20px Fauna One", "#ffcc00"); 
        house.choice3.x = 350;             
        house.choice3.y = 180;
        house.choice3.text = "";
        house.choice3.Alpha = 0;
        house.choices = [house.choice1, house.choice2,house.choice3];
        
        house.hoboCatSound1 = createjs.Sound.play("hoboCatSound1");
        house.hoboCatSound1.stop();
        
        house.catzSound1 = createjs.Sound.play("catzSound1");
        house.catzSound1.stop();
        house.catzSound2 = createjs.Sound.play("catzSound2");
        house.catzSound2.stop();
        
        rocketSong = createjs.Sound.play("palladiumAlloySong");
        rocketSong.stop();
        house.houseView.y=1500;
        bg.y=0;
        starCont.y=1000;
        bg.addEventListener("click",showOh);
        house.houseView.addChild(house.diamondHouseCont,house.catz,house.house, 
            house.hobo,house.timmy, house.priest, house.wick, house.crashRocket, house.hoboExclamation, 
            house.wickExclamation, house.catzSpeach, house.characterSpeach, house.choice1, 
            house.choice2, house.choice3,muteButton, house.mouseHobo, house.mouseRocket,
            house.wickLight,house.oh, house.look, house.diamonds, house.diCont, house.lookingAtStarsButton);
    }
    
    function showOh()
    {
        bg.removeAllEventListeners();
        bg.addEventListener("click",showLook);
        createjs.Tween.get(house.oh).to({alpha:1},3000);
    }
    
    function showLook()
    {
        bg.removeAllEventListeners();
        bg.addEventListener("click",showDiamonds);
        createjs.Tween.get(house.look).to({alpha:1},3000);
    }
    
    function showDiamonds()
    {
        bg.removeAllEventListeners();
        bg.addEventListener("click",goDown);
        createjs.Tween.get(house.diamonds).to({alpha:1},3000);
        createjs.Tween.get(house.diCont).to({alpha:1},3000);
    }
    
    function goDown()
    {
        bg.removeAllEventListeners();
        createjs.Tween.get(house.houseView).to({y:0},4000,createjs.Ease.quadInOut);
        createjs.Tween.get(bg).to({y:-1200},4000,createjs.Ease.quadInOut);
        createjs.Tween.get(starCont).to({y:0},4000,createjs.Ease.quadInOut);
        createjs.Tween.get(house.hobo)
            .wait(7000)
            .to({x:-270, y:270, rotation:0},300)
            .to({x:-260, y:270, rotation:-5},300)
            .to({x:-230, y:270, rotation:0},300)
            .to({x:-200, y:270, rotation:-5},300)
            .to({x:-170, y:270, rotation:0},300)
            .to({x:-160, y:270, rotation:-5},300)
            .to({x:-130, y:260, rotation:0},300)
            .to({x:-140, y:260, rotation:-5},300)
            .to({x:-110, y:225, rotation:0},300)
            .call(house.addCharacterEvents,[gameStats, text, gotoGameView]);
    }
    
    function shiftUp()
    {
//        house.houseView = 20;
//        bg = -1180;
//        starCont = 20;
    }
    
    function shiftDown()
    {
//        house.houseView = 0;
//        bg = -1200;
//        starCont = 0;        
    }
    
    function goDownAgain()
    {
//        bg.removeAllEventListeners();
//        createjs.Tween.get(house.houseView).to({y:0},4000,createjs.Ease.quadInOut);
//        createjs.Tween.get(bg).to({y:-1200},4000,createjs.Ease.quadInOut);
//        createjs.Tween.get(starCont).to({y:0},4000,createjs.Ease.quadInOut);
    }
    
        function goUp()
    {
//        createjs.Tween.removeAllTweens(house.houseView);
//        createjs.Tween.removeAllTweens(bg);
//        createjs.Tween.removeAllTweens(starCont);
//        createjs.Tween.get(house.houseView).to({y:1500},2000,createjs.Ease.quadInOut);
//        createjs.Tween.get(bg).to({y:0},2000,createjs.Ease.quadInOut);
//        createjs.Tween.get(starCont).to({y:1000},2000,createjs.Ease.quadInOut);
//        bg.addEventListener("click",goDownAgain);
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
        
        var bgParallax = new createjs.Bitmap(queue.getResult("bgParallax"));
        bgParallax.x=0;
        bgParallax.y=-200;
        
        var bgParallax2 = new createjs.Bitmap(queue.getResult("bgParallax"));
        bgParallax2.x=2460;
        bgParallax2.y=-200;
        parallaxCont.addChild(bgParallax,bgParallax2);

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
        var fgGroundTop1 = new createjs.Bitmap(queue.getResult("fgGroundTop"));
        //fgGround.scaleX=0.3;
        //fgGround.scaleY=0.3;
        fgGroundTop1.x = 0;
        fgGroundTop1.y = -830;                       
        var fgGroundTop2 = new createjs.Bitmap(queue.getResult("fgGroundTop"));
        //fgGround.scaleX=0.3;
        //fgGround.scaleY=0.3;
        fgGroundTop2.x = 2000;
        fgGroundTop2.y = -830; 
        fgCont.addChild(fgGround1, fgGround2);  
        fgTopCont.addChild(fgGroundTop1,fgGroundTop2); 
        

        diamondShardCounter = new createjs.Bitmap(queue.getResult("diamondShardCounter"));        
        diamondShardCounter.scaleY= 0.8;
        diamondShardCounter.scaleX= 0.8;        
        text = new createjs.Text("0", "22px Courier New", "white"); 
        text.x = 608+108;             
        text.y = 422-17;
        
        var rocketData = spriteSheetData.rocket;
           
        
        var spriteSheet = new createjs.SpriteSheet(rocketData);    
        catzRocket.catz = new createjs.Sprite(spriteSheet, "no shake");
        
        rocketData = spriteSheetData.flame;
        var spriteSheet = new createjs.SpriteSheet(rocketData);    
        catzRocket.rocketFlame = new createjs.Sprite(spriteSheet, "cycle");
        catzRocket.rocketFlame.alpha=0;
        catzRocket.rocketFlame.x=190;
        catzRocket.rocketFlame.y=200;
        catzRocket.rocketFlame.regY = -37;
        catzRocket.rocketFlame.regX = 40;
        
        catzRocket.silouette = new createjs.Bitmap(queue.getResult("rocketSilouette"));
        catzRocket.silouette.scaleX = 0.25;
        catzRocket.silouette.scaleY = 0.25;
        catzRocket.silouette.alpha = 0;
        catzRocket.silouette.x = 110;
        catzRocket.silouette.y = 90;
                
        catzRocket.catzRocketContainer.x = 260;
        catzRocket.catzRocketContainer.y = 200;
        catzRocket.catz.y = 5;
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
        smoke.regX = 150;
        smoke.regY = 350;
        
        exitSmoke = new createjs.Sprite(smokeSheet,"right");
        exitSmoke.alpha=0;
        exitSmoke.regX = 150;
        exitSmoke.regY = 200;
        
        hud = new createjs.Bitmap(queue.getResult("hud"));
        var glassData = spriteSheetData.hudGlass;
        var glassSheet = new createjs.SpriteSheet(glassData);
        catzRocket.glass = new createjs.Sprite(glassSheet, "still");
        hudPointer = new createjs.Bitmap(queue.getResult("hudPointer"));
        hudPointer.regX=191;
        hudPointer.regY=54;
        hud.x=550+107;
        hud.y=345+2;
        catzRocket.glass.scaleX=0.85;
        catzRocket.glass.scaleY=0.85;
        catzRocket.glass.x=533;
        catzRocket.glass.y=341;
        hudPointer.x=550+191;
        hudPointer.y=350+54;
        
        var leavesData = spriteSheetData.leaves;
        var leavesSheet = new createjs.SpriteSheet(leavesData);
        leaves = new createjs.Sprite(leavesSheet,"cycle");
        leaves.alpha=0;
        
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
        
        catzRocket.rocketSound = createjs.Sound.play("rocketSound");
        catzRocket.rocketSound.volume = 0.1;
        catzRocket.rocketSound.stop();
        diamondSound = createjs.Sound.play("diamondSound");
        diamondSound.volume = 0.2;
        diamondSound.stop();
        
        squawkSound = createjs.Sound.play(name);
        squawkSound.volume=0.15;
        squawkSound.stop();
        gameView = new createjs.Container();
        greatDiamondSheet = new createjs.SpriteSheet(spriteSheetData.greatDiamond);
        mediumDiamondSheet = new createjs.SpriteSheet(spriteSheetData.mediumDiamond);
         sheetDict = {
        "diamond" : diamondSheet,
        "mediumDiamond" : mediumDiamondSheet,
        "greatDiamond" : greatDiamondSheet,
        "seagull" : seagullSheet,
        "goose" : seagullSheet,
        "hawk" : seagullSheet
        };
        
        gameView.addChild(parallaxCont, catzRocket.rocketSnake,catzRocket.SnakeLine,
            sgCont, hawkCont, gooseCont, attackBirdCont,scatterDiamondsCont, diCont,
            exitSmoke,smoke, catzRocket.rocketFlame, catzRocket.catzRocketContainer,
            cloudCont,lightningCont,thunderCont,fgCont, fgTopCont,leaves, collisionCheckDebug);
    }
    
    function gotoGameView()
    {
        gameStats.currentRound += 1;
        house.cricketsSound.stop();
        //if song hasn't started yet
        if(rocketSong.getPosition()<100)
        {
            rocketSong.play({loop:-1});
        }
        catzRocket.hideSnake();
        if(debugMode===false)
        {
            collisionCheckDebug.alpha=0;
            debugText.alpha=0;
        }
        stage.removeChild(house.houseView);
        stage.addChild(gameView, windCont, muteButton, hud, hudPointer, catzRocket.glass, text,debugText);
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
            star.y= Math.random()*1450-1000;
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
        parallaxSpeed = (0.3+0.3* Math.cos((catzRocket.catzRocketContainer.rotation)/360*2*Math.PI))*mult;        
        if(!event.paused)
        {                
            if(catzRocket.invincibilityCounter>0)
            {
                catzRocket.invincibilityCounter-=event.delta;
            }
            if(gameStats.score<10)
            {
                text.text="000"+gameStats.score;
            }
            else if(gameStats.score<100)
            {
                text.text="00"+gameStats.score;
            }
            else if(gameStats.score<1000)
            {
                text.text="0"+gameStats.score;
            }
            else if(gameStats.score<10000)
            {
                text.text=gameStats.score;
            }
            else
            {
                text.text="alot";
            }
            
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
            updateFgTop(event);
            updateParallax(event);
            updateDiamonds(event);
            updateScatterDiamonds(event);
            updatePointer(event);
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
                + "\nHoboDialogNo: " + house.hoboDialogNumber
                +"\n\ncurrentDisplacement: "+currentDisplacement
                +"\n\currentLevel"+currentLevel;
        
        
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

    function updateParallax(event)
    {
        var arrayLength = parallaxCont.children.length;    
        for (var i = 0; i < arrayLength; i++) {
            var kid = parallaxCont.children[i];        
            if (kid.x <= -2460)
            {
              kid.x = 2460;
            }
            kid.x = kid.x - parallaxSpeed*event.delta/10; 
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
    
    function updateFgTop(event)
    {
        var arrayLength = fgTopCont.children.length;    
        for (var i = 0; i < arrayLength; i++) {
            var kid = fgTopCont.children[i];        
            if (kid.x <= -3200)
            {
              kid.x = kid.x + 4000;
            }
            kid.x = kid.x - fgSpeed*event.delta/10; 
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
        createjs.Sound.play("thunder");
        var cloudtype = Math.floor(Math.random()*5+1);
        cloudtype = "cloud"+cloudtype.toString();
        var scale = Math.random()*0.3+0.3;
        var cloud = new ThunderCloud(queue.getResult(cloudtype));
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
            if(kid.hasFired===false && catzRocket.isHit ===false && catzRocket.catzRocketContainer.x<(kid.x+rect.width*kid.scaleX) && catzRocket.catzRocketContainer.x > 
                    kid.x && catzRocket.catzRocketContainer.y < (kid.y+rect.height*kid.scaleY+200)
                    && catzRocket.catzRocketContainer.y > kid.y+50)
            {
                kid.hasFired =true;
                var birdHit=false;
                var spotX=0;
                var spotY=0;
                for (var i = 0; i < attackBirdCont.children.length; i++) 
                {
                    var bird = attackBirdCont.children[i];
                    if(bird.x<(kid.x+rect.width*kid.scaleX+50) 
                        && bird.x > kid.x-100 
                        && bird.y < catzRocket.catzRocketContainer.y
                        && bird.y > kid.y+50)
                    {
                        birdHit=true;
                        bird.setGrilled();
                        break;
                        spotX = bird.x;
                        spotY = bird.y;
                    }
                }
                if(!birdHit)
                {
                    if(!godMode)
                    {
                        getHit();
                    }
                    spotX = catzRocket.catzRocketContainer.x;
                    spotY = catzRocket.catzRocketContainer.y;
                }
                var lightning= new createjs.Shape();
                lightning.graphics.setStrokeStyle(3,1);
                lightning.graphics.beginStroke(lightningColor);
                lightning.graphics.moveTo(kid.x,kid.y);
                lightning.graphics.lineTo(kid.x+(spotX-kid.x)/3+50,kid.y+(spotY-kid.y)/3);
                lightning.graphics.lineTo(kid.x+(spotX-kid.x)*2/3-50,kid.y+(spotY-kid.y)*2/3);
                lightning.graphics.lineTo(spotX,spotY);
                lightning.graphics.endStroke();
                lightningCont.addChild(lightning);
                createjs.Tween.get(lightning).to({alpha:0},300);
                createjs.Sound.play("lightningBolt");
                createjs.Tween.get(gameView)
                .to({x:-50, y:20},50)
                .to({x:50, y:-40},50)
                .to({x:-50, y:50},50)
                .to({x:20, y:-20},50)
                .to({x:-10, y:10},50)
                .to({x:10, y:-10},50)
                .to({x:0, y:0},50);
                console.log("lightning");
            }
        }
    }
    
    function generateTrack()
    {
        var result = [];
        var displacementX = 800;
        var displacementY = currentDisplacement;
        if(tracksJSON[currentLevel].length===currentTrack)
        {
            currentTrack=0;
        }
        if(gameStats.Difficulty>=0)
        {
            for(j=0;j<tracksJSON[currentLevel][currentTrack].length;j++)
            {
                var element = $.extend(true, [], trackPartsJSON[tracksJSON[currentLevel][currentTrack][j].difficulty][tracksJSON[currentLevel][currentTrack][j].name]);
                 for (i=0;i<element.length;i++)
                {
                    element[i].x+=displacementX;
                    element[i].y+=displacementY;
                    if(i===element.length-1 && element[i].graphicType!=="attackBird")
                    {
                        displacementX = element[i].x;
                        displacementY = element[i].y;
                    }
                }
                result = result.concat(element);                
            }
            currentDisplacement=result[result.length-1].y;
            currentTrack+=1;
            return result;
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
                    if (track[i].graphicType==="thunderCloud")
                    {
                        spawnThunderCloud(track[i].x,track[i].y-200);
                    }
                    else if(track[i].graphicType==="sprite")
                    {
                        var sheet = sheetDict[track[i].type];
                        
                        var sprite = new createjs.Sprite(sheet,track[i].animation);
                        sprite.x = track[i].x; 
                        sprite.y = track[i].y;
                        var cont = containerDict[track[i].type];
                        cont.addChild(sprite);
                        
                    }
                    else if(track[i].graphicType==="attackBird")
                    {
                        spawnAttackBird(track[i].animation,track[i].acc,track[i].x,track[i].y+catzRocket.catzRocketContainer.y);
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
    
    function updatePointer(event)
    {
        hudPointer.rotation += (Math.min(catzRocket.frenzyCount*1.4-30,100)
                -hudPointer.rotation)*event.delta/500;
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
                if(kid.currentAnimation==="cycle")
                {
                    gameStats.score += 1;
                    catzRocket.frenzyCount+=7.5;
                    arrayLength = arrayLength - 1;
                }
                else if(kid.currentAnimation==="mediumCycle")
                {
                    gameStats.score += 10;
                    catzRocket.frenzyCount+=15.5;
                    arrayLength = arrayLength - 1;
                }
                else if(kid.currentAnimation==="greatCycle")
                {
                    gameStats.score += 100;
                    catzRocket.frenzyCount+=50.5;
                    arrayLength = arrayLength - 1;
                }

                diamondSound.play();
                catzRocket.diamondFrenzyCharge +=1;
                diCont.removeChildAt(i);
            }
        }   
    }
    
    function updateScatterDiamonds(event)
    {
        if(currentTrack<2)
        {
            var thres = 0.95;
        }
        else if(currentTrack<4)
        {
            thres = 0.90;
        }
        else if(currentTrack<6)
        {
            thres = 0.8;
        }
        else
        {
            thres = 0.7;
        }
        if(Math.random()>thres)
        {
            var diamond = new createjs.Sprite(diamondSheet,"cycle");
            diamond.x=800;
            diamond.y=Math.pow(35*Math.random(),2)-1000;
            diamond.scaleX=0.75;
            diamond.scaleY=0.75;
            scatterDiamondsCont.addChild(diamond);
        }
        var arrayLength = scatterDiamondsCont.children.length;
        for (var i = 0; i < arrayLength; i++) {
            var kid = scatterDiamondsCont.children[i];
            kid.x = kid.x - diSpeed*event.delta;    
            if (kid.x <= -100)
            {
              scatterDiamondsCont.removeChildAt(i);
              arrayLength = arrayLength - 1;
              i = i - 1;
            }                   
            var isOverlap = overlapCheckCircle(kid.x,kid.y,40);
            if(isOverlap)
            {
                gameStats.score += 1;
                catzRocket.frenzyCount+=7.5;
                arrayLength = arrayLength - 1;
                diamondSound.play();
                catzRocket.diamondFrenzyCharge +=1;
                scatterDiamondsCont.removeChildAt(i);
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
    
    function spawnAttackBird(type,acc,x,y)
    {
        
        var attackBird = new AttackBird(acc,seagullSheet,type);
        attackBird.x = x;
        attackBird.y = y;
        if(type==="duck")
        {
            attackBird.scaleX=-attackBird.scaleX;
        }
        attackBirdCont.addChild(attackBird);
        collisionCheckDebug.addChild(attackBird.shape);
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
                if(kid.temperature>200 && kid.state!=="grilled")
                {
                    kid.setGrilled();
                    gameStats.kills +=1;
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
    
    function switchMute()
    {
        if(createjs.Sound.getMute())
        {
            createjs.Sound.setMute(false);
            muteButton.gotoAndPlay("mute");
        }
        else
        {
            createjs.Sound.setMute(true);
            muteButton.gotoAndPlay("unmute");
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
            var x = catzRocket.catzRocketContainer.x+70*c-13*s;
            var y = catzRocket.catzRocketContainer.y+13*c+70*s;
            var h = (newBounds.height/2)+5;
            var w = (newBounds.width/2)+10;
        }
        else
        {
            var x = catzRocket.catzRocketContainer.x-10*c-13*s;
            var y = catzRocket.catzRocketContainer.y+13*c-10*s;
            var h = (newBounds.height/2);
            var w = (newBounds.width/2);
        }
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

        return isCollide;
    }
    
    function collisionCheck(bird)
    {
        var groundLevel=430;
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
                    if(bird.y<groundLevel)
                    {
                        return false;                       
                    }
                    else
                    {
                        console.log("ground");
                        collisionResolve(bird,0,-1,bird.y-groundLevel,true); 
                    }                  
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
                if(bird.y<groundLevel)
                {
                    return false;                       
                }
                else
                {
                    console.log("ground");
                    collisionResolve(bird,0,-1,bird.y-groundLevel,true); 
                }
            }
            else if(bird.rad-projC+projMax<Math.abs(minOverlapDist))
            {
                minOverlapDist = bird.rad-projC+projMax;
                collisionResolve(bird,normX,normY,minOverlapDist,false);                
            }
            else if( bird.rad-projMin+projC<Math.abs(minOverlapDist))
            {
                minOverlapDist = -bird.rad+projMin-projC;
                collisionResolve(bird,normX,normY,minOverlapDist,false);                
            }
            else
            {
                collisionResolve(bird,norm[minOverlapNorm].x,norm[minOverlapNorm].y,minOverlapDist,false);                
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
                var instance = createjs.Sound.play("catzScream2");
                instance.volume = 0.5;
                catzRocket.catz.gotoAndPlay("slipping");
                createjs.Tween.get(catzRocket.catz)
                        .to({y:10, x:-25},100)
                        .to({x:-50,y:5},150)
                        .call(catzRocket.catz.gotoAndPlay,["no shake"]);
                catzRocket.invincibilityCounter=1000;
            }
            else{ getHit();}
            if(catzRocket.catzState!==catzRocket.catzStateEnum.FellOffRocket)
            {
                setTimeout(function() {createjs.Ticker.setPaused(false);},125);
                createjs.Ticker.setPaused(true);
            }
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
    
     function collisionResolve(bird,normX,normY,normDist,isGround)
    { 
        if(isGround || (catzRocket.catzState!==catzRocket.catzStateEnum.FellOffRocket
                && catzRocket.catzState!==catzRocket.catzStateEnum.Frenzy
                && catzRocket.catzState!==catzRocket.catzStateEnum.FrenzyUploop))
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
            if(isGround)
            {
                catzRocket.catzVelocity-=reflect*normY/250;
                var rand = Math.floor(2*Math.random()+3);
                var name = "klonk"+rand;
                var instance = createjs.Sound.play(name);
                instance.volume=0.15;
            }

            if(squawkSound.playState !== createjs.Sound.PLAY_SUCCEEDED)
            {
                rand = Math.floor(3*Math.random()+1);
                name = "squawk"+rand;
                squawkSound = createjs.Sound.play(name);
                squawkSound.volume=0.15;
            }
        }
        else if(catzRocket.catzState===catzRocket.catzStateEnum.Frenzy
                || catzRocket.catzState===catzRocket.catzStateEnum.FrenzyUploop)
        {
            bird.setGrilled();
            gameStats.kills +=1;
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
        if(house.characterSpeach.alpha > 0)
        {
            if(house.characterSpeach.alpha > 0.5) {
                house.characterSpeach.alpha -= 0.005;
            }
            else
            {
                house.characterSpeach.alpha -= 0.03;
            }
        }
        
        if(house.catzSpeach.alpha > 0)
        {
            if(house.catzSpeach.alpha >0.5){
                house.catzSpeach.alpha -= 0.005;
            }
            else {
                house.catzSpeach.alpha -= 0.03;
            }
            
        }            
        
        if(!house.hoboActive)
        {
            house.hoboExclamation.alpha=0;  
        }
        
        debugText.text =                 
                + "\nHoboCatHouseBuilt "+ gameStats.HoboCatHouseBuilt 
                + "\nBuilding orphanage "+ gameStats.BuildOrphanage
                + "HoboDialogNo: " + house.hoboDialogNumber                
        
    };
    
    function crash()
    {
        currentTrack=0;
        currentLevel=0;
        currentDisplacement =0;
        catzRocket.rocket.x=0;
        catzRocket.rocket.alpha=1;
        lightningCont.removeAllChildren();
        attackBirdCont.removeAllChildren();
        diCont.removeAllChildren();
        directorState=directorStateEnum.Normal;
        catzRocket.isWounded=false;
        noWind();
        catzRocket.silouette.alpha=0;
        catzRocket.catz.alpha = 1;
        catzRocket.glass.gotoAndPlay("still");
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
            house.gotoHouseViewWithoutRocket(gameStats, catzRocket, gotoGameView);
        }
        else
        {
            house.gotoHouseViewWithRocket(gameStats, catzRocket, gotoGameView);               
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
            .call((function(){house.activateWick(gotoGameView);}));
        stage.update();        
    }
    return rocketShip;
}());