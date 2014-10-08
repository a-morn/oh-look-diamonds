var RocketShip = (function(){
    var 
    catzRocket,
    house,                
    houseListener,
    onTrack=false,                
    cloudIsIn = new Array(),
    rocketShip={},
    canvas,
    catzBounds,
    polygonVertices,
    catzVertices,
    polygonLine,
    catzNorm,
    norm,
    newBounds,
    catzBounds,
    hit = false,
    debugText,
    gameView,    
    gameListener,    
    stage,
    wind=0,
    trackTimer = 0,
    smoke,
    windSheet,    
    track,    
    exitSmoke,
    leaves,    
    flameColor = "#99ccff",    
    rocketSnake =  new createjs.Container(),
    SnakeLine,    
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
    heightOffset=0,
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
                    {id: "enemybirds", src: "assets/new assets/sprites/enemy birds.png"},
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
                    {id:"rocket", src:"assets/new assets/sprites/catzAllanimationsNewColors.png"},
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
                    {id:"rocketSound", src:"assets/new assets/sound/rocket.mp3"},
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
        var hoboData={
            "framerate":24,
            "images":[queue.getResult("hobo")],
            "frames":[
                [0, 0, 256, 256, 0, -139, -81],
                [256, 0, 256, 256, 0, -139, -81],
                [512, 0, 256, 256, 0, -139, -81],
                [768, 0, 256, 256, 0, -139, -81],
                [1024, 0, 256, 256, 0, -139, -81],
                [1280, 0, 256, 256, 0, -139, -81],
                [1536, 0, 256, 256, 0, -139, -81],
                [0, 256, 256, 256, 0, -139, -81],
                [256, 256, 256, 256, 0, -139, -81],
                [512, 256, 256, 256, 0, -139, -81],
                [768, 256, 256, 256, 0, -139, -81],
                [1024, 256, 256, 256, 0, -139, -81],
                [1280, 256, 256, 256, 0, -139, -81],
                [1536, 256, 256, 256, 0, -139, -81],
                [0, 512, 256, 256, 0, -139, -81],
                [256, 512, 256, 256, 0, -139, -81],
                [512, 512, 256, 256, 0, -139, -81],
                [768, 512, 256, 256, 0, -139, -81],
                [1024, 512, 256, 256, 0, -139, -81],
                [1280, 512, 256, 256, 0, -139, -81],
                [1536, 512, 256, 256, 0, -139, -81],
                [0, 768, 256, 256, 0, -139, -81],
                [256, 768, 256, 256, 0, -139, -81],
                [512, 768, 256, 256, 0, -139, -81],
                [768, 768, 256, 256, 0, -139, -81],
                [1024, 768, 256, 256, 0, -139, -81],
                [1280, 768, 256, 256, 0, -139, -81],
                [1536, 768, 256, 256, 0, -139, -81],
                [0, 1024, 256, 256, 0, -139, -81],
                [256, 1024, 256, 256, 0, -139, -81],
                [512, 1024, 256, 256, 0, -139, -81],
                [768, 1024, 256, 256, 0, -139, -81],
                [1024, 1024, 256, 256, 0, -139, -81],
                [1280, 1024, 256, 256, 0, -139, -81],
                [1536, 1024, 256, 256, 0, -139, -81],
                [0, 1280, 256, 256, 0, -139, -81],
                [256, 1280, 256, 256, 0, -139, -81],
                [512, 1280, 256, 256, 0, -139, -81],
                [768, 1280, 256, 256, 0, -139, -81],
                [1024, 1280, 256, 256, 0, -139, -81],
                [1280, 1280, 256, 256, 0, -139, -81],
                [1536, 1280, 256, 256, 0, -139, -81],
                [0, 1536, 256, 256, 0, -139, -81],
                [256, 1536, 256, 256, 0, -139, -81],
                [512, 1536, 256, 256, 0, -139, -81],
                [768, 1536, 256, 256, 0, -139, -81],
                [1024, 1536, 256, 256, 0, -139, -81],
                [1280, 1536, 256, 256, 0, -139, -81],
                [1536, 1536, 256, 256, 0, -139, -81],
                [0, 1792, 256, 256, 0, -139, -81]
            ],
            "animations":{"cycle": [0,49],"still":[0]}
        };
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
        
        dHouseData = {
            "framerate":24,
            "images":[queue.getResult("diamondhouse")],
            "frames":[
                [0, 0, 128, 128, 0, 0, 0],
                [128, 0, 128, 128, 0, 0, 0],
                [256, 0, 128, 128, 0, 0, 0],
                [384, 0, 128, 128, 0, 0, 0],
                [512, 0, 128, 128, 0, 0, 0],
                [640, 0, 128, 128, 0, 0, 0],
                [768, 0, 128, 128, 0, 0, 0]
            ],
            "animations":{
                "first": [0],
                "second": [1],
                "third": [2],
                "fourth": [3],
                "fifth": [4],
                "sixth": [5],
                "seventh": [6]
                }
        };
        dSheet = new createjs.SpriteSheet(dHouseData);
        house.diamondHouse = new createjs.Sprite(dSheet,"first");
        house.diamondHouse.alpha=0;
        house.diamondHouse.x=450;
        house.diamondHouse.y=310;
        house.diamondHouse.rotation = 12;
        
        
        catData ={
            "framerate":24,
            "images":[queue.getResult("cat")],
            "frames":[
                [0, 0, 128, 256, 0, -183, -148],
                [128, 0, 128, 256, 0, -183, -148],
                [256, 0, 128, 256, 0, -183, -148],
                [384, 0, 128, 256, 0, -183, -148],
                [512, 0, 128, 256, 0, -183, -148],
                [640, 0, 128, 256, 0, -183, -148],
                [768, 0, 128, 256, 0, -183, -148],
                [896, 0, 128, 256, 0, -183, -148],
                [1024, 0, 128, 256, 0, -183, -148],
                [1152, 0, 128, 256, 0, -183, -148],
                [1280, 0, 128, 256, 0, -183, -148],
                [1408, 0, 128, 256, 0, -183, -148],
                [1536, 0, 128, 256, 0, -183, -148],
                [1664, 0, 128, 256, 0, -183, -148],
                [1792, 0, 128, 256, 0, -183, -148],
                [0, 256, 128, 256, 0, -183, -148],
                [128, 256, 128, 256, 0, -183, -148],
                [256, 256, 128, 256, 0, -183, -148]
            ],
            "animations":{"cycle": [0,17],"still":[0]}
        };
        catSheet = new createjs.SpriteSheet(catData);
        house.catz = new createjs.Sprite(catSheet,"cycle");
        //cat.x = 235;
        //cat.y = 190;
        house.catz.y=60;
        house.catz.x=100;
        house.catz.scaleX =0.8;
        house.catz.scaleY =0.8;
        
        wickData = {
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
        
        var diamondData ={
            "framerate":24,
            "images":[queue.getResult("diamond")],
            "frames":[
                [0, 0, 256, 256, 0, 128, 128],
                [256, 0, 256, 256, 0, 128, 128],
                [512, 0, 256, 256, 0, 128, 128],
                [768, 0, 256, 256, 0, 0, 128],
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
                [1536, 512, 256, 256, 0, 128, 128],
                [0, 768, 256, 256, 0, 128, 128],
                [256, 768, 256, 256, 0, 128, 128],
                [512, 768, 256, 256, 0, 128, 128],
                [768, 768, 256, 256, 0, 128, 128]
            ],
            "animations":{"cycle": [0,24]}
            };
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
        
        var rocketData = {
            "framerate":24,
            "images":[queue.getResult("rocket")],
            "frames":[
                [738, 444, 245, 124, 0, -274, -199],
                [980, 568, 245, 124, 0, -274, -199],
                [735, 568, 245, 124, 0, -274, -199],
                [490, 568, 245, 124, 0, -274, -199],
                [245, 568, 245, 124, 0, -274, -199],
                [0, 568, 245, 124, 0, -274, -199],
                [1719, 444, 245, 124, 0, -274, -199],
                [1474, 444, 245, 124, 0, -274, -199],
                [1229, 444, 245, 124, 0, -274, -199],
                [1225, 568, 245, 124, 0, -274, -199],
                [945, 310, 246, 125, 0, -274, -199],
                [1191, 310, 246, 125, 0, -274, -199],
                [246, 444, 246, 124, 0, -274, -199],
                [492, 444, 246, 124, 0, -274, -199],
                [699, 310, 246, 125, 0, -274, -199],
                [1437, 310, 246, 125, 0, -274, -199],
                [0, 444, 246, 124, 0, -274, -199],
                [1683, 310, 246, 124, 0, -274, -199],
                [983, 444, 246, 124, 0, -274, -199],
                [453, 310, 246, 125, 0, -274, -199],
                [511, 0, 516, 156, 0, -274, -199],
                [0, 0, 511, 160, 0, -274, -199],
                [1394, 160, 506, 142, 0, -274, -199],
                [906, 160, 488, 145, 0, -274, -199],
                [443, 160, 463, 150, 0, -274, -199],
                [1027, 0, 408, 154, 0, -274, -199],
                [0, 160, 443, 150, 0, -274, -199],
                [0, 310, 453, 134, 0, -274, -199],
                [1435, 0, 447, 154, 0, -274, -199],    
                [1470, 568, 245, 118, 0, -276, -199],
                [1715, 568, 245, 116, 0, -275, -203]
            ],
            "animations":{
                "no shake": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "speed": 1},
                "frenzy ready": {"frames": [29, 30], "speed": 1},
                "shake": {
                    "frames": [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                    "speed": 1
                },
                "frenzy": {"frames": [20, 21, 22, 23, 24, 25, 26, 27, 28], "speed": 1}
            }
        };
           
        
        var spriteSheet = new createjs.SpriteSheet(rocketData);    
        catzRocket.catzRocket = new createjs.Sprite(spriteSheet, "no shake");
        
        rocketData = {
            "framerate":24,
            "images":[queue.getResult("flame")],
            "frames":[
                [0, 0, 256, 256, 0, -142, -196],
                [256, 0, 256, 256, 0, -142, -196],
                [512, 0, 256, 256, 0, -142, -196],
                [768, 0, 256, 256, 0, -142, -196],
                [1024, 0, 256, 256, 0, -142, -196],
                [1280, 0, 256, 256, 0, -142, -196],
                [1536, 0, 256, 256, 0, -142, -196],
                [0, 256, 256, 256, 0, -142, -196],
                [256, 256, 256, 256, 0, -142, -196],
                [512, 256, 256, 256, 0, -142, -196],
                [768, 256, 256, 256, 0, -142, -196],
                [1024, 256, 256, 256, 0, -142, -196],
                [1280, 256, 256, 256, 0, -142, -196],
                [1536, 256, 256, 256, 0, -142, -196],
                [0, 512, 256, 256, 0, -142, -196],
                [256, 512, 256, 256, 0, -142, -196],
                [512, 512, 256, 256, 0, -142, -196],
                [768, 512, 256, 256, 0, -142, -196],
                [1024, 512, 256, 256, 0, -142, -196],
                [1280, 512, 256, 256, 0, -142, -196],
                [1536, 512, 256, 256, 0, -142, -196],
                [0, 768, 256, 256, 0, -142, -196],
                [256, 768, 256, 256, 0, -142, -196],
                [512, 768, 256, 256, 0, -142, -196],
                [768, 768, 256, 256, 0, -142, -196],
                [1024, 768, 256, 256, 0, -142, -196],
                [1280, 768, 256, 256, 0, -142, -196],
                [1536, 768, 256, 256, 0, -142, -196],
                [0, 1024, 256, 256, 0, -142, -196],
                [256, 1024, 256, 256, 0, -142, -196],
                [512, 1024, 256, 256, 0, -142, -196],
                [768, 1024, 256, 256, 0, -142, -196],
                [1024, 1024, 256, 256, 0, -142, -196],
                [1280, 1024, 256, 256, 0, -142, -196],
                [1536, 1024, 256, 256, 0, -142, -196]
            ],
            "animations": {             
                "ignite":{frames:[0,1,2,3,4,5],next:"cycle",speed:1.5}, 
                "cycle": {frames:[6,7,8,9,10,11,12,13,14,15,16,17,18],next:"cycle"}
            }
        };
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
        catzRocket.catzRocket.scaleX = 0.4;
        catzRocket.catzRocket.scaleY = 0.4;
        catzRocket.catzRocketContainer.regY = 100;
        catzRocket.catzRocketContainer.regX = 150;
        catzRocket.catzRocket.currentFrame = 0;              
        catzRocket.catzRocketContainer.addChild(catzRocket.catzRocket,catzRocket.silouette);
        catzBounds = catzRocket.catzRocketContainer.getTransformedBounds();
        
        rocketSnake.x=0;
        rocketSnake.y=0;
        var snakeAmt = 11;
        for(i=0;i<snakeAmt;i++)
        {
            var shape = new createjs.Shape();
            var x = 260-i*5;
            var r = 9;
            shape.graphics.f(flameColor).dc(x,200,r);
            shape.regY=5;
            shape.regX=5;
            rocketSnake.addChild(shape);
            if(i>0)
            {
                //shape.alpha=0;
            }
        }
        
        SnakeLine = new createjs.Shape();
        
        var smokeData = {
            "framerate":24,
            "images":[queue.getResult("smokepuffs")],
            "frames":[
                [0, 0, 512, 512, 0, -2, -84],
                [512, 0, 512, 512, 0, -2, -84],
                [1024, 0, 512, 512, 0, -2, -84],
                [1536, 0, 512, 512, 0, -2, -84],
                [2048, 0, 512, 512, 0, -2, -84],
                [2560, 0, 512, 512, 0, -2, -84],
                [3072, 0, 512, 512, 0, -2, -84],
                [0, 512, 512, 512, 0, -2, -84],
                [512, 512, 512, 512, 0, -2, -84],
                [1024, 512, 512, 512, 0, -2, -84],
                [1536, 512, 512, 512, 0, -2, -84],
                [2048, 512, 512, 512, 0, -2, -84],
                [2560, 512, 512, 512, 0, -2, -84],
                [3072, 512, 512, 512, 0, -2, -84],
                [0, 1024, 512, 512, 0, -2, -84],
                [512, 1024, 512, 512, 0, -2, -84],
                [1024, 1024, 512, 512, 0, -2, -84],
                [1536, 1024, 512, 512, 0, -2, -84],
                [2048, 1024, 512, 512, 0, -2, -84],
                [2560, 1024, 512, 512, 0, -2, -84],
                [3072, 1024, 512, 512, 0, -2, -84],
                [0, 1536, 512, 512, 0, -2, -84],
                [512, 1536, 512, 512, 0, -2, -84],
                [1024, 1536, 512, 512, 0, -2, -84],
                [1536, 1536, 512, 512, 0, -2, -84],
                [2048, 1536, 512, 512, 0, -2, -84],
                [2560, 1536, 512, 512, 0, -2, -84],
                [3072, 1536, 512, 512, 0, -2, -84],
                [0, 2048, 512, 512, 0, -2, -84],
                [512, 2048, 512, 512, 0, -2, -84]
            ],
            "animations":{
                "right": {
                    "frames": [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                    "speed": 1
                },
                "jump": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "speed": 1},
                "puff": {
                    "frames": [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
                    "speed":1
                }
            }
        };
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
        
        var leavesData ={
            "framerate":24,
            "images":[queue.getResult("leaves")],
            "frames":[
                [0, 0, 512, 256, 0, -171, -78],
                [512, 0, 512, 256, 0, -171, -78],
                [1024, 0, 512, 256, 0, -171, -78],
                [1536, 0, 512, 256, 0, -171, -78],
                [2048, 0, 512, 256, 0, -171, -78],
                [2560, 0, 512, 256, 0, -171, -78],
                [3072, 0, 512, 256, 0, -171, -78],
                [0, 256, 512, 256, 0, -171, -78],
                [512, 256, 512, 256, 0, -171, -78],
                [1024, 256, 512, 256, 0, -171, -78],
                [1536, 256, 512, 256, 0, -171, -78],
                [2048, 256, 512, 256, 0, -171, -78],
                [2560, 256, 512, 256, 0, -171, -78],
                [3072, 256, 512, 256, 0, -171, -78],
                [0, 512, 512, 256, 0, -171, -78],
                [512, 512, 512, 256, 0, -171, -78],
                [1024, 512, 512, 256, 0, -171, -78],
                [1536, 512, 512, 256, 0, -171, -78],
                [2048, 512, 512, 256, 0, -171, -78],
                [2560, 512, 512, 256, 0, -171, -78],
                [3072, 512, 512, 256, 0, -171, -78],
                [0, 768, 512, 256, 0, -171, -78],
                [512, 768, 512, 256, 0, -171, -78],
                [1024, 768, 512, 256, 0, -171, -78],
                [1536, 768, 512, 256, 0, -171, -78],
                [2048, 768, 512, 256, 0, -171, -78],
                [2560, 768, 512, 256, 0, -171, -78],
                [3072, 768, 512, 256, 0, -171, -78]
            ],
            "animations":{"cycle":[0,27]}
        };
        
                var leavesSheet = new createjs.SpriteSheet(leavesData);
        leaves = new createjs.Sprite(leavesSheet,"cycle");
        leaves.alpha=0;
        leaves.scaleX = 0.5;
        leaves.scaleY = 0.5;
       
        var seagullData = {
             images: [queue.getResult("enemybirds")],
            "framerate":10,
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
                [1536, 256, 256, 256, 0, 128, 128]
            ],
            "animations":{
                "bat": {"frames": [0, 1, 2, 3], "speed": 1},
                "seagull": {"frames": [6, 7, 8, 9], "speed": 1},
                "goose": {"frames": [10, 11, 12], "speed": 1},
                "eagle strike": {"frames": [5], "speed": 1},
                "eagle soar": {"frames": [4], "speed": 1}
            }
        };
        
        seagullSheet = new createjs.SpriteSheet(seagullData);
        
        var windData = {
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
        windSheet = new createjs.SpriteSheet(windData);  
            
            
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
        attackBird = new AttackBird(3);
        attackBird2 = new AttackBird(5);
        attackBird3 = new AttackBird(6);
        
        attackBirdCont.addChild(attackBird, attackBird2,attackBird3);
        collisionCheckDebug.addChild(polygonLine);
        
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
        
        gameView.addChild(bg,starCont,rocketSnake,SnakeLine,sgCont, hawkCont, gooseCont, attackBirdCont,diCont,
            exitSmoke,smoke, catzRocket.rocketFlame, catzRocket.catzRocketContainer,
             cloudCont,lightningCont,thunderCont,fgCont,leaves, collisionCheckDebug);
    }
    
    function gotoGameView()
    {
        hideSnake();
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
            if(!crashed)
            {
                updateFrenzy(event);
                updatecatzRocket(event);
                updateVertices();
                updateDirector(event);
                updateFg(event);
                updateDiamonds(event);
                updateClouds(event);
                updateGoose();
                updateSeagulls(event);
                updateRocketSnake();
                updateWorldContainer();
                updateThunderClouds();
                updateAttackBird(event);
                drawCollisionModels();
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
    
    function updateFrenzy(event)
    {
        if (catzRocket.catzState===catzRocket.catzStateEnum.Frenzy)
        {
            catzRocket.frenzyTimer+=event.delta;
            if(catzRocket.frenzyTimer>1500)
            {
                catzRocket.catzState=catzRocket.catzStateEnum.Normal;
                catzRocket.catzRocket.gotoAndPlay("no shake");
                catzRocket.frenzyCount=0;
                catzRocket.frenzyTimer=0;
                smoke.alpha = 1;
                smoke.rotation = catzRocket.catzRocketContainer.rotation+270;
                smoke.x = catzRocket.catzRocketContainer.x;
                smoke.y = catzRocket.catzRocketContainer.y;
                smoke.gotoAndPlay("jump");
                smoke.addEventListener("animationend",function(){hideSmoke();});
            }
            catzRocket.frenzyReady=false;
        }
        else if (catzRocket.frenzyReady===true)
        {
            catzRocket.frenzyTimer+=event.delta;
            if(catzRocket.frenzyTimer>500)
            {
                if (catzRocket.catzState===catzRocket.catzStateEnum.SecondDownloop)
                {
                    catzRocket.catzState = catzRocket.catzStateEnum.Slingshot;
                }
                else if (catzRocket.catzState!==catzRocket.catzStateEnum.Downloop &&
                        catzRocket.catzState!==catzRocket.catzStateEnum.SlammerReady &&
                        catzRocket.catzState!==catzRocket.catzStateEnum.Slammer &&
                        catzRocket.catzState!==catzRocket.catzStateEnum.Slingshot)
                {                    
                    if(mousedown)
                    {
                        catzRocket.catzState=catzRocket.catzStateEnum.FrenzyUploop;
                    }
                    else
                    {
                        catzRocket.catzState=catzRocket.catzStateEnum.Frenzy;
                    }
                    catzRocket.catzRocket.gotoAndPlay("frenzy");
                    hideSnake();
                    catzRocket.frenzyTimer=0;
                    catzRocket.frenzyReady=false;
                    smoke.alpha = 1;
                    smoke.rotation = catzRocket.catzRocketContainer.rotation+270;
                    smoke.x = catzRocket.catzRocketContainer.x+200;
                    smoke.y = catzRocket.catzRocketContainer.y;
                    smoke.gotoAndPlay("jump");
                    smoke.addEventListener("animationend",function(){hideSmoke();});
                }
            }
        }
        else if (catzRocket.catzState!==catzRocket.catzStateEnum.Frenzy 
                && catzRocket.catzState!==catzRocket.catzStateEnum.FrenzyUploop
                && catzRocket.frenzyCount>0)
        {
            if (catzRocket.frenzyCount>100)
            {
                catzRocket.catzRocket.gotoAndPlay("frenzy ready");
                catzRocket.frenzyReady=true;
                catzRocket.frenzyTimer= 0;
            }
            catzRocket.frenzyTimer+=event.delta;
            if(catzRocket.frenzyTimer>2000)
            {
                catzRocket.frenzyCount=0;
                catzRocket.frenzyTimer=0;
            }
        }
    }

    function updatecatzRocket(event)
    {      
        if(catzRocket.catzState === catzRocket.catzStateEnum.Normal)   
        {
            catzRocket.catzVelocity += (grav+wind)*event.delta/1000;
            if(catzRocket.catzVelocity>=catzRocket.limitVelocity)
            {
                catzRocket.catzVelocity = catzRocket.limitVelocity;
                catzRocket.catzState = catzRocket.catzStateEnum.TerminalVelocity;
                catzRocket.catzRocket.gotoAndPlay("shake");
            }
            heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;            
            loopTimer = 0;
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;                
            }                        
        }   
        if(catzRocket.catzState === catzRocket.catzStateEnum.Frenzy)   
        {
            catzRocket.catzVelocity += (1/2)*(grav+wind)*event.delta/1000;
            heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;            
            loopTimer = 0;
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;                
            }                        
        }   
        if(catzRocket.catzState === catzRocket.catzStateEnum.FrenzyUploop)   
        {
            catzRocket.catzVelocity -= (1/2)*(2.3*grav-wind)*event.delta/1000; 
            heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;            
            loopTimer = 0;
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;                
            }                        
        }   
        else if (catzRocket.catzState === catzRocket.catzStateEnum.TerminalVelocity)
        {
            heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;
            catzRocket.catzRocketContainer.rotation =-280;
        }
        else if (catzRocket.catzState === catzRocket.catzStateEnum.EmergencyBoost)
        {
            catzRocket.catzVelocity -= (10*grav-3.7*wind)*event.delta/1000; 
            heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;
            catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;
            if(catzRocket.catzRocketContainer.rotation<0)
            {
                catzRocket.catzState = catzRocket.catzStateEnum.Uploop;
            }
        }
        else if (catzRocket.catzState === catzRocket.catzStateEnum.Uploop)
        {
            catzRocket.catzVelocity -= (2.3*grav-wind)*event.delta/1000;          
            heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;   
            loopTimer+= event.delta;   
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;
            }
        }
        else if (catzRocket.catzState === catzRocket.catzStateEnum.Downloop || 
                catzRocket.catzState === catzRocket.catzStateEnum.SlammerReady)
        {
            loopTimer+= event.delta;
            catzRocket.catzVelocity += ((2-8*Math.sin(catzRocket.catzRocketContainer.rotation))*
                grav+6*wind)*event.delta/1000+0.4;
        }
        else if (catzRocket.catzState === catzRocket.catzStateEnum.Slammer && catzRocket.catzRocketContainer.rotation<-250)
        {
            createjs.Tween.removeAllTweens(catzRocket.catzRocketContainer);
            catzRocket.catzVelocity = catzRocket.limitVelocity;
            catzRocket.catzState = catzRocket.catzStateEnum.TerminalVelocity;
            catzRocket.catzRocket.gotoAndPlay("shake");
            hideSnake();
        }
        if (catzRocket.catzRocketContainer.rotation<-60 && catzRocket.catzState === catzRocket.catzStateEnum.Uploop)
        {
            catzRocket.rocketSound.stop();
            createjs.Tween.removeAllTweens(catzRocket.catzRocketContainer);
            tween = createjs.Tween.get(catzRocket.catzRocketContainer)
                .to({rotation:-270},1000)
                .to({rotation:-330},350)
                .call(catzRelease);
            catzRocket.catzState = catzRocket.catzStateEnum.Downloop;
            loopTimer = 0;
        }
        else if (catzRocket.catzState === catzRocket.catzStateEnum.SecondUploop)
        {
            catzRocket.catzVelocity -= (5.5*grav-2*wind)*event.delta/1000;          
            //heightOffset += 20*catzVelocity*event.delta/1000;  
            heightOffset += 20*catzRocket.catzVelocity*event.delta/1000;
            loopTimer+= event.delta;   
            if(!createjs.Tween.hasActiveTweens(catzRocket.catzRocketContainer))
            {
                catzRocket.catzRocketContainer.rotation = Math.atan(catzRocket.catzVelocity/40)*360/3.14;
            }
        }
        else if (catzRocket.catzState === catzRocket.catzStateEnum.SecondDownloop)
        {
            if(wind>=0)
            {
                heightOffset += (150+12*wind)*event.delta/1000;
            }
            else
            {
                heightOffset += (150+40*wind)*event.delta/1000;
            }
        }
        else if (catzRocket.catzState === catzRocket.catzStateEnum.Slingshot && catzRocket.catzRocketContainer.rotation <-400)
        {
            createjs.Tween.removeAllTweens(catzRocket.catzRocketContainer);
            catzRocket.catzState = catzRocket.catzStateEnum.Normal;
            catzRocket.catzRocket.gotoAndPlay("no shake");
            hideSnake();
            heightOffset-=110*Math.sin((catzRocket.catzRocketContainer.rotation+110)/360*2*Math.PI);
            catzRocket.catzVelocity =-20;            
        }
        if (catzRocket.catzRocketContainer.rotation<-60 && catzRocket.catzState === catzRocket.catzStateEnum.SecondUploop)
        {
            restartSecondLoop();
            catzRocket.catzState = catzRocket.catzStateEnum.SecondDownloop;
            heightOffset+=110*Math.sin((catzRocket.catzRocketContainer.rotation+110)/360*2*Math.PI);
            loopTimer = 0;
        }
        if(catzRocket.catzState !== catzRocket.catzStateEnum.SecondDownloop 
                && catzRocket.catzState !== catzRocket.catzStateEnum.Slingshot)
        {
            catzRocket.catzRocketContainer.x = 200+
                        Math.cos((catzRocket.catzRocketContainer.rotation+90)/360*2*Math.PI)*160;
            catzRocket.catzRocketContainer.y = 200+
                        Math.sin((catzRocket.catzRocketContainer.rotation+90)/360*2*Math.PI)*210
                +heightOffset;
        }
        else
        {
            catzRocket.catzRocketContainer.x = 255+
                Math.cos((catzRocket.catzRocketContainer.rotation+90)/360*2*Math.PI)*80;
            catzRocket.catzRocketContainer.y = 200+
                Math.sin((catzRocket.catzRocketContainer.rotation+90)/360*2*Math.PI)*100
                +heightOffset;
        }
        if(catzRocket.catzRocketContainer.y > 450 || catzRocket.catzRocketContainer.y < -1000)
        {            
            crash();
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
            if(hit ===false && catzRocket.catzRocketContainer.x<(kid.x+rect.width*kid.scaleX) && catzRocket.catzRocketContainer.x > 
                    kid.x && catzRocket.catzRocketContainer.y < (kid.y+rect.height*kid.scaleY+100)
                    && catzRocket.catzRocketContainer.y > kid.y+50)
            {
                    var lightning= new createjs.Shape();
                    lightning.graphics.setStrokeStyle(15,1);
                    lightning.graphics.beginStroke(flameColor);
                    lightning.graphics.moveTo(kid.x,kid.y);
                    lightning.graphics.lineTo(catzRocket.catzRocketContainer.x,catzRocket.catzRocketContainer.y);
                    lightning.graphics.endStroke();
                    lightning.graphics.setStrokeStyle(12,1);
                    lightning.graphics.beginStroke(flameColor);
                    lightning.graphics.moveTo(catzRocket.catzRocketContainer.x,catzRocket.catzRocketContainer.y);
                    lightning.graphics.lineTo(Math.random()*300+100,500);
                    lightning.graphics.endStroke();
                    lightningCont.addChild(lightning);
                    createjs.Tween.get(lightning).to({alpha:0},300);
                    getHit();
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
            var isOverlap = overlapCheckCircle(kid.x,kid.y,25);
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
            var colTrue = collisionCheck(kid);
            catzCollisionCheck(kid);
            if(colTrue)
            {
                kid.alpha=0.5;
                var distx=(polygonVertices[3].x-kid.x);
                var disty=(polygonVertices[3].y-kid.y);
                if(distx*distx+disty*disty<100)
                {
                    attackBirdCont.removeChild(kid);
                    leaves.alpha=1;
                    leaves.x=kid.x;
                    leaves.y=kid.y;
                    leaves.gotoAndPlay("cycle");
                    leaves.addEventListener("animationend",function(){hideLeaves();});
                    newKid = new AttackBird(Math.random()*5+2);
                    attackBirdCont.addChild(newKid);
                }
            }
            else
            {
                kid.alpha=1;
            }
        }   
    }

    function updateGoose()
    {
        var arrayLength = gooseCont.children.length;   
        for (var i = 0; i < arrayLength; i++) {
            var kid = gooseCont.children[i];
            kid.x = kid.x - sgSpeed;    
            if (kid.x <= -100)
            {
              gooseCont.removeChildAt(i);
              arrayLength = arrayLength - 1;
              i = i - 1;
            }
            if((catzRocket.catzRocketContainer.x-catzBounds.width)<kid.x && catzRocket.catzRocketContainer.x-20 > 
            kid.x && (catzRocket.catzRocketContainer.y-catzBounds.height) < kid.y
            && catzRocket.catzRocketContainer.y > kid.y)
            {
                gooseCont.removeChild(kid);
                var instance = createjs.Sound.play("birdcry");
                instance.volume = 0.1;
                getHit();
            }
        }   
    }
    
    function updateSeagulls(event)
    {
        var arrayLength = sgCont.children.length;   
        for (var i = 0; i < arrayLength; i++) {
            var kid = sgCont.children[i];
            kid.x = kid.x - diSpeed*event.delta;    
            kid.y += Math.cos(kid.x/2);
            if (kid.x <= -100)
            {
              sgCont.removeChildAt(i);
              arrayLength = arrayLength - 1;
              i = i - 1;
            }
            if((catzRocket.catzRocketContainer.x-catzBounds.width)<kid.x && catzRocket.catzRocketContainer.x > 
            kid.x && (catzRocket.catzRocketContainer.y-catzBounds.height) < kid.y
            && catzRocket.catzRocketContainer.y > kid.y)
            {
                sgCont.removeChild(kid);
                var instance = createjs.Sound.play("birdcry");
                instance.volume = 0.1;
                getHit();
            }
        }   
    }
    
    function updateRocketSnake()
    {
        var arrayLength = rocketSnake.children.length; 
        for (var i = arrayLength-1; i >0 ; i--) {
            var kid = rocketSnake.children[i];
            kid.x = rocketSnake.children[i-1].x-2*Math.cos(6.28*catzRocket.catzRocketContainer.rotation/360);
            kid.y = rocketSnake.children[i-1].y;
        }           
        if(catzRocket.catzState !== catzRocket.catzStateEnum.SecondDownloop 
        && catzRocket.catzState !== catzRocket.catzStateEnum.Slingshot)
        {
            rocketSnake.children[0].x = -60+
                Math.cos((catzRocket.catzRocketContainer.rotation+101)/360*2*Math.PI)*176;
            rocketSnake.children[0] .y =
                Math.sin((catzRocket.catzRocketContainer.rotation+100)/360*2*Math.PI)*232
            +heightOffset;
            catzRocket.rocketFlame.x = catzRocket.catzRocketContainer.x;
            catzRocket.rocketFlame.y = catzRocket.catzRocketContainer.y;
        }
        else 
        {
            rocketSnake.children[0].x =-5+
                Math.cos((catzRocket.catzRocketContainer.rotation+110)/360*2*Math.PI)*100;
            rocketSnake.children[0] .y =
                Math.sin((catzRocket.catzRocketContainer.rotation+110)/360*2*Math.PI)*120
            +heightOffset;
            catzRocket.rocketFlame.x = catzRocket.catzRocketContainer.x;
            catzRocket.rocketFlame.y = catzRocket.catzRocketContainer.y;
        }
        SnakeLine.graphics = new createjs.Graphics();
        SnakeLine.x=260;
        SnakeLine.y=200;
        for (var i = arrayLength-1; i >0 ; i--) {
            var kid = rocketSnake.children[i];
            SnakeLine.graphics.setStrokeStyle(arrayLength*2-i*2,1);
            SnakeLine.graphics.beginStroke(flameColor);
            SnakeLine.graphics.moveTo(kid.x-i*5,kid.y);
            SnakeLine.graphics.lineTo(rocketSnake.children[i-1].x-(i-1)*5,rocketSnake.children[i-1].y);
            SnakeLine.graphics.endStroke();
        } 
        catzRocket.rocketFlame.rotation =catzRocket.catzRocketContainer.rotation;

    }
    
    function showSnake()
    {
        rocketSnake.children[0].x = -60+
            Math.cos((catzRocket.catzRocketContainer.rotation+101)/360*2*Math.PI)*176;
        rocketSnake.children[0] .y =
            Math.sin((catzRocket.catzRocketContainer.rotation+100)/360*2*Math.PI)*232
            +heightOffset;
        catzRocket.rocketFlame.x = rocketSnake.children[0].x;
        catzRocket.rocketFlame.y = rocketSnake.children[0].y;
        catzRocket.rocketFlame.rotation =catzRocket.catzRocketContainer.rotation;
        
        SnakeLine.alpha = 1;
        catzRocket.rocketFlame.alpha =1;
        catzRocket.rocketFlame.gotoAndPlay("ignite");
    }
    
    function hideSnake()
    {
        rocketSnake.alpha=0;
        SnakeLine.alpha = 0;
        catzRocket.rocketFlame.alpha = 0;
    }
    
    function catzUp()
    {
        catzRocket.rocketSound.play();
        mousedown = true;
        if(catzRocket.catzState === catzRocket.catzStateEnum.Normal)
        {
            catzRocket.catzVelocity-=2;
            catzRocket.catzState = catzRocket.catzStateEnum.Uploop;
            showSnake();
            //rocketFlame.gotoAndPlay("ignite");
            if(!catzRocket.frenzyReady)
            {
                catzRocket.catzRocket.gotoAndPlay("shake");                
            }            
        }
        else if(catzRocket.catzState === catzRocket.catzStateEnum.Frenzy)
        {
            catzRocket.catzVelocity-=2;
            catzRocket.catzState = catzRocket.catzStateEnum.FrenzyUploop;
        }
        else if(catzRocket.catzState === catzRocket.catzStateEnum.TerminalVelocity)
        {
           catzRocket.catzState = catzRocket.catzStateEnum.EmergencyBoost;
           showSnake();
        }
        else if(catzRocket.catzState === catzRocket.catzStateEnum.SlammerReady 
                && catzRocket.catzRocketContainer.rotation>-250)
        {
           catzRocket.catzState = catzRocket.catzStateEnum.Slammer;
        }
    }

    function catzEndLoop()
    {
        catzRocket.rocketSound.stop();
        mousedown = false;
        if(catzRocket.catzState!==catzRocket.catzStateEnum.Downloop
                && catzRocket.catzState!==catzRocket.catzStateEnum.SlammerReady 
                && catzRocket.catzState!==catzRocket.catzStateEnum.Slammer 
                && catzRocket.catzState!==catzRocket.catzStateEnum.SecondDownloop
                && catzRocket.catzState!==catzRocket.catzStateEnum.Slingshot
                && catzRocket.catzState!==catzRocket.catzStateEnum.Frenzy
                && catzRocket.catzState!==catzRocket.catzStateEnum.FrenzyUploop)
        {
            catzRocket.catzState = catzRocket.catzStateEnum.Normal;
            hideSnake();            
            if(!catzRocket.frenzyReady)
            {
                catzRocket.catzRocket.gotoAndPlay("no shake");                
            }
        }
        else if (catzRocket.catzState===catzRocket.catzStateEnum.SecondDownloop)
        {
            catzRocket.catzState = catzRocket.catzStateEnum.Slingshot;
        }
        else if (catzRocket.catzState===catzRocket.catzStateEnum.Downloop)
        {
            catzRocket.catzState = catzRocket.catzStateEnum.SlammerReady;
        }
        else if (catzRocket.catzState===catzRocket.catzStateEnum.FrenzyUploop)
        {
            catzRocket.catzState = catzRocket.catzStateEnum.Frenzy;
        }
    }
    
    function restartSecondLoop()
    {
        createjs.Tween.removeAllTweens(catzRocket.catzRocketContainer);
        tween = createjs.Tween.get(catzRocket.catzRocketContainer,{loop:true})
        .to({rotation:-270},500)
        .to({rotation:-420},500);
//        catzRocketContainer.rotation = catzRocketContainer.rotation%360;
//        createjs.Tween.removeAllTweens(catzRocketContainer);
//        tween = createjs.Tween.get(catzRocketContainer)
//        .to({rotation:-270},500)
//        .to({rotation:-420},500)
//        .call(restartSecondLoop);
    }

    function catzRelease()
    {
        if(catzRocket.isWounded)
        {
            catzRocket.isWounded=false;
        }
        if(mousedown)
        {
                catzRocket.catzVelocity = Math.tan(catzRocket.catzRocketContainer.rotation *3.14/360)*40;
                catzRocket.rocketSound.play();
                catzRocket.catzState = catzRocket.catzStateEnum.SecondUploop;
                if(!catzRocket.frenzyReady)
                {
                    catzRocket.catzRocket.gotoAndPlay("shake");                    
                }
        }
        else
        {
            catzRocket.catzState = catzRocket.catzStateEnum.Normal;
            if(!catzRocket.frenzyReady)
            {
                catzRocket.catzRocket.gotoAndPlay("no shake");                    
            }
            hideSnake();
            catzRocket.catzVelocity = Math.tan(catzRocket.catzRocketContainer.rotation *3.14/360)*40;            
        }        
    }
    
    //hittar de globala x-y koordinaterna till hörnen på raketen, samt normalvektorer
    function updateVertices()
    {
        var s = Math.sin(catzRocket.catzRocketContainer.rotation*Math.PI/180);
        var c = Math.cos(catzRocket.catzRocketContainer.rotation*Math.PI/180);
        var x = catzRocket.catzRocketContainer.x-10*c-13*s;
        var y = catzRocket.catzRocketContainer.y+13*c-10*s;
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
        
        norm[0].x =(polygonVertices[0].y-polygonVertices[1].y)/newBounds.height;
        norm[0].y =(polygonVertices[1].x-polygonVertices[0].x)/newBounds.height;
        norm[1].x =(polygonVertices[1].y-polygonVertices[2].y)/newBounds.width;
        norm[1].y =(polygonVertices[2].x-polygonVertices[1].x)/newBounds.width;
        norm[2].x =(polygonVertices[2].y-polygonVertices[3].y)/newBounds.noseLen;
        norm[2].y =(polygonVertices[3].x-polygonVertices[2].x)/newBounds.noseLen;
        norm[3].x =(polygonVertices[3].y-polygonVertices[4].y)/newBounds.noseLen;
        norm[3].y =(polygonVertices[4].x-polygonVertices[3].x)/newBounds.noseLen;
        
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
    }
    
    function collisionCheckBbirds()
    {
        var arrayLength = attackBirdCont.children.length;   
        for (var i = 0; i < arrayLength; i++) {
            var kid = attackBirdCont.children[i];
            collisionCheck(kid);
        }
    }
    
    function catzMoveAndCollisionCheck()
    {
        
    }
    
    function moveAndCollisionCheck(bird)
    {
        collisionCheck(this);
        if(bird.dispX>this.rad/2 || bird.dispY>this.rad/2 )
        {
            var noSteps = Math.min(2*Math.max(bird.dispX,bird.dispY)/this.rad,4);
            for(i=0; i<noSteps;i++)
            {
                this.x += bird.dispX/noSteps;
                this.y += bird.dispY/noSteps;
                isCollide = collisionCheck(this);
                if(isCollide)
                {
                    return;
                }
            }
        }
        else
        {
            this.x += bird.dispX;
            this.y += bird.dispY;
            collisionCheck(this);
        }
    }
    
    function collisionCheck(bird)
    {
        if(Math.abs(kid.x-catzRocketContainer.x)<200 && Math.abs(kid.y-catzRocketContainer.y)<150)
        {
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
            }
            closestVertex=0;
            minDist=inf;
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
            collisionResolve();
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
        if(catzRocket.invincibilityCounter<=0)
        {
            if(!catzRocket.isWounded)
            {
                catzRocket.isWounded=true;
                catzRocket.invincibilityCounter=1000;
            }
            else{ getHit();}
        }
        return true;
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
        for (var i = 0; i < attackBirdCont.children.length; i++) {
            var kid = attackBirdCont.children[i];
            polygonLine.graphics.setStrokeStyle(2,2);
            polygonLine.graphics.beginStroke("pink");
            polygonLine.graphics.moveTo(kid.x,kid.y);
            polygonLine.graphics.lineTo(kid.x+kid.distX,kid.y+kid.distY);
            polygonLine.graphics.endStroke();
            console.log(kid.x+" "+kid.distX+" "+kid.y+" "+kid.distY);
        }
    }
    
    function getHit()
    {
        hit = true;
        catzRocket.silouette.alpha=1;
        catzRocket.catzRocket.alpha = 0;
        catzRocket.catzVelocity =Math.min(catzRocket.catzVelocity+20,catzRocket.limitVelocity); 
        catzEndLoop();
        stage.removeAllEventListeners();
        leaves.alpha = 1;
        leaves.rotation = 0;
        leaves.x = catzRocket.catzRocketContainer.x-50;
        leaves.y = catzRocket.catzRocketContainer.y-50;
        leaves.gotoAndPlay("cycle");
        leaves.addEventListener("animationend",function(){hideLeaves();});
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
        hit = false;
        lightningCont.removeAllChildren();
        directorState=directorStateEnum.Normal;
        noWind();
        catzRocket.silouette.alpha=0;
        catzRocket.catzRocket.alpha = 1;
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
        if(catzRocket.catzRocketContainer.y > 450)
        {            
            house.gotoHouseViewFromAbove(gameStats, catzRocket);
        }
        else if (catzRocket.catzRocketContainer.y < -1000)
        {
            house.gotoHouseViewFromBelow(gameStats, catzRocket);               
        }        
        catzRocket.catzRocketContainer.x = 300;
        catzRocket.catzRocketContainer.y = 200;
        heightOffset=0;
        catzRocket.catzRocketContainer.rotation =0;
        hideSnake();
        catzRocket.frenzyReady=false;
        catzRocket.frenzyTimer=0;
        catzRocket.frenzyCount=0;
        catzRocket.catzRocket.gotoAndPlay("no shake");
        catzRocket.catzState = catzRocket.catzStateEnum.Normal;
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
        house.catz.x = 100;
        house.catz.y = 160;
        createjs.Tween.get(house.catz)
                .wait(800)
                .to({x:130, y:140, rotation:10},250)
                .to({x:70, y:120, rotation:-10},250)
                .to({x:130, y:100, rotation:10},250)
                .to({x:70, y:80, rotation:-10},250)
                .to({x:100, y:60, rotation:0},250);
        stage.update();        
    }
    return rocketShip;
}());