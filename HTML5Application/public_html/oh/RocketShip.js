var RocketShip = (function(){
    var 
    dialogID= 0,
    diamondDistanceCounter =0,
    catzBounds,
    onTrack=false,
    diamondFrenzyCharge = 0,
    hasFrenzy = false,
    catzRocketContainer = new createjs.Container(),
    cloudIsIn = new Array(),
    rocketShip={},
    canvas,
    hit = false,
    debugText,
    gameView,
    silouette,
    gameListener,
    houseListener,
    stage,
    wind=0,
    trackTimer = 0,
    smoke,
    windSheet,
    cat,
    track,
    crashRocket,
    exitSmoke,
    leaves,
    catzRocket,    
    rocketFlame,
    flameColor = "#99ccff",
    rocketSound,
    rocketSnake =  new createjs.Container(),
    SnakeLine,
    houseView = new createjs.Container(),
    seagullSheet,
    bg,    
    wick,
    text, 
    diamondHouse,
    diamondShardCounter,
    queue,
    mousedown,
    diamondSheet,
    grav = 12,
    jump,       
    catzVelocity = -2,
    limitVelocity = 30,
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
        "hawk" : hawkCont,
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
    catzStateEnum = {
        Normal : 0,
        Uploop : 1,
        Downloop : 2,
        SecondUploop : 3,
        SecondDownloop : 4,
        Slingshot : 5,
        TerminalVelocity : 6,
        EmergencyBoost : 7,
        SlammerReady : 8,
        Slammer : 9
    },
    catzState=catzStateEnum.Normal,
    loopTimer = 0,
    directorStateEnum = {
        Normal : 0,
        Birds : 1,
        Wind : 2,
        Thunder : 3,
    },
    directorState=directorStateEnum.Normal,
    directorTimer=0,
    progressBar,
    hoboSpeach,
    catzSpeach,
    diamondSound,
    hoboCatSound1,
    hoboCatSound2,
    catzSound1,
    catzSound2,
    wickActive=false,
    hoboActive=true,
    wickExclamation,
    hoboExclamation,
    hoboDialogNumber=0,
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
        },
    choice1,
    choice2,
    choice3,
    choices=[],
    choiceIDs=[]    
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
                    //{id: "catz", src: "assets/catz.png"}, 
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
        gotoHouseViewNormal();
        stage.removeChild(progressBar);
        //createjs.Sound.setMute(true);
    }
    
    function createHouseView()
    {
        house = new createjs.Bitmap(queue.getResult("house"));   
        house.scaleX=0.8;
        house.scaleY=0.8;
        house.y=-20;
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
        hobo  = new createjs.Sprite(sheet,"cycle");
        hobo.x=-110;
        hobo.y=225;
        hobo.scaleX=0.8;
        hobo.scaleY=0.8;        
        
        crashRocket = new createjs.Bitmap(queue.getResult("rocketSilouette"));
        crashRocket.regX=180;
        crashRocket.regY=83;
        crashRocket.scaleX=0.5;
        crashRocket.scaleY=0.5;  
        crashRocket.alpha = 0;
        crashRocket.x=220;
        crashRocket.y=320;
        
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
        diamondHouse = new createjs.Sprite(dSheet,"first");
        diamondHouse.alpha=0;
        diamondHouse.x=450;
        diamondHouse.y=310;
        diamondHouse.rotation = 12;
        
        
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
        cat  = new createjs.Sprite(catSheet,"cycle");
        //cat.x = 235;
        //cat.y = 190;
        cat.y=60;
        cat.x=100;
        cat.scaleX =0.8;
        cat.scaleY =0.8;
        
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
        wick  = new createjs.Sprite(sheet,"still");
        wick.y=50;
        wick.x=-210;
        wick.scaleX=1.5;
        wick.scaleY=1.5;
        
        hoboSpeach = new createjs.Text("0", "16px Courier New", "#ffffcc"); 
        hoboSpeach.x = 10;             
        hoboSpeach.y = 240;
        hoboSpeach.text = "";
        hoboSpeach.alpha= 0;
        
        hoboExclamation = new createjs.Text("0", "18px Courier New", "#ffcc00"); 
        hoboExclamation.x = 115;             
        hoboExclamation.y = 280;
        hoboExclamation.text = "!";
        hoboExclamation.alpha= 0;
        
        catzSpeach = new createjs.Text("0", "12px Courier New", "#ffffcc"); 
        catzSpeach.x = 350;             
        catzSpeach.y = 180;
        catzSpeach.text = "";
        catzSpeach.Alpha = 0;
        
        wickExclamation = new createjs.Text("0", "10px Courier New", "#ffcc00"); 
        wickExclamation.x = 185;             
        wickExclamation.y = 310;
        wickExclamation.text = "<-- Fire up the rocket";
        wickExclamation.alpha= 0;
        
        choice1 = new createjs.Text("", "20px Courier New", "#ffcc00"); 
        choice1.x = 0;             
        choice1.y = 40;
        choice1.text = "";
        choice1.Alpha = 0;
        
        choice2 = new createjs.Text("", "20px Courier New", "#ffcc00"); 
        choice2.x = 0;             
        choice2.y = 60;
        choice2.text = "";
        choice2.Alpha = 0;
        
        choice3 = new createjs.Text("", "20px Courier New", "#ffcc00"); 
        choice3.x = 0;             
        choice3.y = 80;
        choice3.text = "";
        choice3.Alpha = 0;
        
        choices = [choice1, choice2,choice3];
        
        hoboCatSound1 = createjs.Sound.play("hoboCatSound1");
        hoboCatSound1.stop();
        hoboCatSound2 = createjs.Sound.play("hoboCatSound2");
        hoboCatSound2.stop();
        
        catzSound1 = createjs.Sound.play("catzSound1");
        catzSound1.stop();
        catzSound2 = createjs.Sound.play("catzSound2");
        catzSound2.stop();
        
        rocketSong = createjs.Sound.play("palladiumAlloySong");
        rocketSong.stop();                
        
        houseView.addChild(bg,starCont,diamondHouse,cat,house, hobo,wick, crashRocket, hoboExclamation, 
        wickExclamation, hoboSpeach, catzSpeach, choice1, choice2, choice3);
    }
    
    
   function createBG()
   {
        
        bg = new createjs.Bitmap(queue.getResult("bg"));
        bg.y = -1200;
        setStars();
   }
    function gotoHouseView()
    {
        console.log(gameStats);
        var hoboCatzProgression = gameProgressionJSON.HoboCatz;           
        for(i=0;i<hoboCatzProgression.length;i++)
        {                        
        conditionLoop:
            if(!hoboCatzProgression[i].HasHappend || hoboCatzProgression[i].ShouldReoccur && 
                hoboCatzProgression[i].Chance>Math.random())
            {                                                
                for(j=0; j<hoboCatzProgression[i].Conditions.length; j++)       
                {
                    if(hoboCatzProgression[i].Conditions[j].ConditionType === "Score")
                    {                                        
                        if(hoboCatzProgression[i].Conditions[j].OperatorType === "LargerThan")
                        {                        
                            if(gameStats.score>hoboCatzProgression[i].Conditions[j].Score)
                            {
                                //pass                                
                            }
                            else
                            {
                                break conditionLoop;
                            }
                        }
                        else if(hoboCatzProgression[i].Conditions[j].OperatorType === "LessThan")
                        {                        
                            if(gameStats.score<hoboCatzProgression[i].Conditions[j].Score)
                            {
                                //pass
                            }
                            else
                            {
                                //next iter
                                break conditionLoop;
                            }
                        }
                    }
                    else if(hoboCatzProgression[i].Conditions[j].ConditionType === "State")
                    {                        
                        if(gameStats[hoboCatzProgression[i].Conditions[j].State] === hoboCatzProgression[i].Conditions[j].On)
                        {                            
                            //pass
                        }
                        else
                        {
                            break conditionLoop;
                        }
                    }
                    //If all conditions have been passed                    
                    if(j===hoboCatzProgression[i].Conditions.length-1)
                    {                        
                        hoboDialogNumber = hoboCatzProgression[i].ConversationNumber;
                        hoboActive = true;
                        wickActive = false;
                        dialogID = 0;
                        hoboCatzProgression[i].HasHappend = "yes";
                        return;
                    }
                }
            }
        }  
        updateHouse();
    }
    
    function gotoHouseViewNormal()
    {
        gotoHouseView();
        wick.x=-210;
        wick.removeAllEventListeners();
        wick.gotoAndPlay("still");
        if(wickActive)
        {
            wick.addEventListener("click",lightFuse);
        }
        
        hobo.addEventListener("click",hoboDialog);
        
        stage.removeAllEventListeners();
        stage.removeChild(gameView,text, diamondShardCounter);
        stage.addChild(houseView);
        stage.update();
        createjs.Ticker.setFPS(20);
        createjs.Ticker.off("tick", gameListener);
        houseListener = createjs.Ticker.on("tick", houseTick,this);
    }
    
    function gotoHouseViewFromAbove()
    {
        gotoHouseView();
        crashRocket.alpha=1;
        crashRocket.x=315-400*Math.cos(catzRocketContainer.rotation*6.28/360);
        crashRocket.y =310-400*Math.sin(catzRocketContainer.rotation*6.28/360);
        crashRocket.rotation=catzRocketContainer.rotation;
        createjs.Tween.get(crashRocket)
                .to({x:315, y:310},200)
                .wait(1500)
                .to({x:315, y:310, rotation:-30},800, createjs.Ease.quadIn);
    }
    
    function gotoHouseViewFromBelow()
    {
        gotoHouseView();
        crashRocket.alpha=1;
        crashRocket.x=315-400*Math.cos(catzRocketContainer.rotation*6.28/360);
        crashRocket.y =310-400*Math.sin(catzRocketContainer.rotation*6.28/360);
        crashRocket.rotation=catzRocketContainer.rotation;
        createjs.Tween.get(crashRocket)
                .to({x:315, y:310},200)
                .wait(1500)
                .to({x:315, y:310, rotation:-30},800, createjs.Ease.quadIn);
    }
    
    function updateHouse()
    {
        var numberOfHouses = gameStats.HoboCatHouseBuilt + gameStats.OrphanageBuilt +
                gameStats.RehabBuilt;        
        if(numberOfHouses===1)
        {
            diamondHouse.alpha=1;
            diamondHouse.gotoAndPlay("first");
        }
        else if(numberOfHouses===2){
            diamondHouse.alpha=1;
            diamondHouse.gotoAndPlay("second");
        }
        else if(numberOfHouses===3){
            diamondHouse.alpha=1;            
            diamondHouse.gotoAndPlay("third");            
        }
        else{
            diamondHouse.alpha=0;
        }

    }
    
    function lightFuse()
    {        
        //if song hasn't started yet
        if(rocketSong.getPosition()<100)
        {
            rocketSong.play();
        }
        wick.x-=15;
        wick.gotoAndPlay("cycle");
        wick.removeAllEventListeners();
        wick.addEventListener("animationend",function(){gotoGameView();});
        catzSpeach.text ="";
        hoboSpeach.text ="";
    }
    
    function hoboDialog()
    {     
        var dialog = dialogJSON.HoboCatz[hoboDialogNumber];                   
        if(dialog.dialog[dialogID])
        {            
            if(dialog.dialog[dialogID].Triggers)
            {
                for(i =0; i<dialog.dialog[dialogID].Triggers.length; i++)
                {
                    if(dialog.dialog[dialogID].Triggers[i].Stat === "score")
                    {
                        gameStats.score += dialog.dialog[dialogID].Triggers[i].Value;
                        //Should be a "cash-withdrawn"-animation triggered here
                        text.text = gameStats.score;
                    }
                    else
                    {
                        gameStats[dialog.dialog[dialogID].Triggers[i].Stat]= dialog.dialog[dialogID].Triggers[i].Value;                                
                    }
                }
            }
            
            if (dialog.dialog[dialogID].Who === "Catz")
            {
                catzSpeach.text = dialog.dialog[dialogID].What;            
                catzSpeach.alpha = 1;
                catzSound1.play();
            }
            else if (dialog.dialog[dialogID].Who === "Hobo-Cat")
            {
                hoboSpeach.text = dialog.dialog[dialogID].What;
                hoboSpeach.alpha = 1;
                hoboCatSound1.play();  
            }                             
            
            if(dialog.dialog[dialogID].Choice)
            {                
                
                for (i=0;i<dialog.dialog[dialogID].Choices.length;i++)
                {                    
                    choices[i].text=dialog.dialog[dialogID].Choices[i].text;
                    choices[i].alpha = 1;
                    choiceIDs[i] = dialog.dialog[dialogID].Choices[i].ChoiceID;                                        

                    //fulfixen                    
                    if(i===0)
                    {
                        choices[i].addEventListener("click",
                                function()
                                {                             
                                    dialogID = choiceIDs[0];                                                                                                

                                    choice1.alpha = 0;
                                    choice2.alpha = 0;
                                    choice3.alpha = 0;
                                    hoboDialog();
                                }
                            );
                    }
                    if(i===1)
                    {                        
                        choices[i].addEventListener("click",
                                function()
                                {                             
                                    dialogID = choiceIDs[1];                                                                                                                                    
                                    choice1.alpha = 0;
                                    choice2.alpha = 0;
                                    choice3.alpha = 0;
                                    hoboDialog();
                                }
                            );
                    }
                }                
            }
            else
            {                                
                if(!dialog.dialog[dialogID].End)
                {
                    dialogID = dialog.dialog[dialogID].NextID;                
                }
            }
            if(dialog.dialog[dialogID].End)
            {
                //This doesn't work right as activateWick is called from gotoHouseView
                wickActive = true;
                hoboActive = false;
                wick.addEventListener("click",lightFuse);                                
                
                //To shift to idle speach. Should be implemented smarter.
                updateHouse();
            }
        }
        
        else
        {
            hoboSpeach.text = dialog.idle.What;
            hoboSpeach.alpha = 1;            
        }
        
        
    }
    function houseTick()
    {
        stage.update();
        if(hoboSpeach.alpha > 0)
        {
            hoboSpeach.alpha -= 0.015;
        }
        
        if(catzSpeach.alpha > 0)
        {
            catzSpeach.alpha -= 0.015;
        }            
                
        if(wickExclamation.alpha > 0.8 && wickExclamation.alpha < 0.9)
        {                       
            if(rocketSong.getPosition()<100)
            {
                rocketSong.play();
            }
        }
        
        hoboExclamation.alpha = hoboActive;                
        
        if(wickActive && wickExclamation.alpha <1)
        {
            wickExclamation.alpha += 0.01;
        }
        
        debugText.text = 
                "rotation "+catzRocketContainer.rotation
                +"\nvelocity "+catzVelocity
                +"\nstate "+catzState
                + "\nHoboCatHouseBuilt "+ gameStats.HoboCatHouseBuilt 
                + "\nBuilding orphanage "+ gameStats.BuildOrphanage
                + "HoboDialogNo: " + hoboDialogNumber
                + "\nonTrack: " + onTrack;
        
    }
    
    function activateWick()
    {
        wickActive = true;
        wick.addEventListener("click",lightFuse);    
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
            [0, 0, 256, 128, 0, -274, -199],
            [256, 0, 256, 128, 0, -274, -199],
            [512, 0, 256, 128, 0, -274, -199],
            [768, 0, 256, 128, 0, -274, -199],
            [1024, 0, 256, 128, 0, -274, -199],
            [1280, 0, 256, 128, 0, -274, -199],
            [1536, 0, 256, 128, 0, -274, -199],
            [0, 128, 256, 128, 0, -274, -199],
            [256, 128, 256, 128, 0, -274, -199],
            [512, 128, 256, 128, 0, -274, -199],
            [768, 128, 256, 128, 0, -274, -199],
            [1024, 128, 256, 128, 0, -274, -199],
            [1280, 128, 256, 128, 0, -274, -199],
            [1536, 128, 256, 128, 0, -274, -199],
            [0, 256, 256, 128, 0, -274, -199],
            [256, 256, 256, 128, 0, -274, -199],
            [512, 256, 256, 128, 0, -274, -199],
            [768, 256, 256, 128, 0, -274, -199],
            [1024, 256, 256, 128, 0, -274, -199],
            [1280, 256, 256, 128, 0, -274, -199]
            ],
            "animations":{
                "no shake": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "speed": 1},
                "shake": {
                    "frames": [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                    "speed": 1
                }
            }        
        };
           
        
        var spriteSheet = new createjs.SpriteSheet(rocketData);    
        catzRocket = new createjs.Sprite(spriteSheet, "no shake");
        
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
                [1536, 1024, 256, 256, 0, -142, -196]],
            "animations":{
                "ignite":{frames:[0,1,2,3,4,5],next:"cycle",speed:1.5}, 
                "cycle": {frames:[6,7,8,9,10,11,12,13,14,15,16,17,18],next:"cycle"}
            }};
        
        var spriteSheet = new createjs.SpriteSheet(rocketData);    
        rocketFlame = new createjs.Sprite(spriteSheet, "cycle");
        rocketFlame.alpha=0;
        rocketFlame.scaleX = 0.4;
        rocketFlame.scaleY = 0.4;
        rocketFlame.x=190;
        rocketFlame.y=200;
        rocketFlame.regY = 265;
        rocketFlame.regX = 390;
        
        silouette = new createjs.Bitmap(queue.getResult("rocketSilouette"));
        silouette.scaleX = 0.25;
        silouette.scaleY = 0.25;
        silouette.alpha = 0;
        silouette.x = 110;
        silouette.y = 90;
                
        catzRocketContainer.x = 260;
        catzRocketContainer.y = 200;
        catzRocket.scaleX = 0.4;
        catzRocket.scaleY = 0.4;
        catzRocketContainer.regY = 100;
        catzRocketContainer.regX = 150;
        catzRocket.currentFrame = 0;              
        catzRocketContainer.addChild(catzRocket,silouette);
        catzBounds = catzRocketContainer.getTransformedBounds();
        
        rocketSnake.x=0;
        rocketSnake.y=0;
        var snakeAmt = 11;
        for(i=0;i<snakeAmt;i++)
        {
            var shape = new createjs.Shape();
            var x = 260-i*5;
            var r = 8;
            shape.graphics.f(flameColor).dc(x,200,r);
            shape.regY=0;
            shape.regX=0;
            rocketSnake.addChild(shape);
            if(i>0)
            {
                shape.alpha=0;
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
            
            
        rocketSound = createjs.Sound.play("rocketSound");
        rocketSound.volume = 0.1;
        rocketSound.stop();
        diamondSound = createjs.Sound.play("diamondSound");
        diamondSound.volume = 0.2;
        diamondSound.stop();
        gameView = new createjs.Container();
         sheetDict = {
        "diamond" : diamondSheet,
        "seagull" : seagullSheet,
        "goose" : seagullSheet,
        "hawk" : seagullSheet,
        };
        gameView.addChild(bg,starCont,rocketSnake,SnakeLine,rocketFlame,catzRocketContainer,sgCont, hawkCont, gooseCont, diCont,
            exitSmoke,smoke,cloudCont,lightningCont,thunderCont,fgCont,leaves);
    }
    
    function gotoGameView()
    {
        hideSnake();
        stage.removeChild(houseView);
        stage.addChild(gameView, windCont, text, diamondShardCounter,debugText);
        //createjs.Ticker.removeAllEventListeners();  
        createjs.Ticker.off("tick", houseListener);    
        gameListener = createjs.Ticker.on("tick", update,this);  
        createjs.Ticker.setFPS(30);            
        stage.addEventListener("stagemousedown", catzUp);    
        stage.addEventListener("stagemouseup", catzEndLoop);    
        jump = false;
        catzVelocity=-20;
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
        diSpeed = 0.4+0.4* Math.cos((catzRocketContainer.rotation)/360*2*Math.PI);    
        diamondDistanceCounter += diSpeed*event.delta;
        cloudSpeed = 12.5+12.5* Math.cos((catzRocketContainer.rotation)/360*2*Math.PI);
        fgSpeed = 7+7* Math.cos((catzRocketContainer.rotation)/360*2*Math.PI);
        sgSpeed = 6+6* Math.cos((catzRocketContainer.rotation)/360*2*Math.PI);        
        if(!event.paused)
        {                
            text.text = gameStats.score;            
            if(diamondFrenzyCharge>0)
            {
                diamondFrenzyCharge -= event.delta/2000;
            }
            if(diamondFrenzyCharge>3 && !hasFrenzy)
            {
                hasFrenzy = true;                
            }
            else if(diamondFrenzyCharge<3 && hasFrenzy)
            {
                hasFrenzy = false;
            }
            if(!crashed)
            {
                updatecatzRocket(event); 
                updateDirector(event);
                updateFg(event);
                updateDiamonds(event);
                updateClouds(event);
                updateGoose();
                updateSeagulls(event);
                updateRocketSnake();
                updateWorldContainer();
                updateThunderClouds();
            }
            debugText.text = 
                "rotation "+catzRocketContainer.rotation
                +"\nvelocity "+catzVelocity
                +"\nstate "+catzState
                +"\nwind"+wind
                +"\ndirectorState"+directorState
                +"\ndirectorTimer"+directorTimer
                +"\nflameFrame"+rocketFlame.currentFrame
                + "\nHoboCatHouseBuilt "+ gameStats.HoboCatHouseBuilt 
                + "\nBuilding orphanage "+ gameStats.BuildOrphanage
                + "\nonTrack: " + onTrack
                + "HoboDialogNo: " + hoboDialogNumber;
        
            stage.update(event); 
        }
    }
    
    function updateWorldContainer(event)
    {
          bg.y = -1100-(catzRocketContainer.y)/2;
          starCont.y=100-(catzRocketContainer.y)/2;
          if(catzRocketContainer.y<200 && catzRocketContainer.y>-600)
          {
              gameView.y=200-catzRocketContainer.y;

          }
    }

    function updatecatzRocket(event)
    {                       
        if(catzState === catzStateEnum.Normal)   
        {
            catzVelocity += (grav+wind)*event.delta/1000;
            if(catzVelocity>=limitVelocity)
            {
                catzVelocity = limitVelocity;
                catzState = catzStateEnum.TerminalVelocity;
                catzRocket.gotoAndPlay("shake");
            }
            heightOffset += 20*catzVelocity*event.delta/1000;            
            loopTimer = 0;
            if(!createjs.Tween.hasActiveTweens(catzRocketContainer))
            {
                catzRocketContainer.rotation = Math.atan(catzVelocity/40)*360/3.14;                
            }                        
        }   
        else if (catzState === catzStateEnum.TerminalVelocity)
        {
            heightOffset += 20*catzVelocity*event.delta/1000;
            catzRocketContainer.rotation =-280;
        }
        else if (catzState === catzStateEnum.EmergencyBoost)
        {
            catzVelocity -= (10*grav-3.7*wind)*event.delta/1000; 
            heightOffset += 20*catzVelocity*event.delta/1000;
            catzRocketContainer.rotation = Math.atan(catzVelocity/40)*360/3.14;
            if(catzRocketContainer.rotation<0)
            {
                catzState = catzStateEnum.Uploop;
            }
        }
        else if (catzState === catzStateEnum.Uploop)
        {
            catzVelocity -= (2.3*grav-wind)*event.delta/1000;          
            heightOffset += 20*catzVelocity*event.delta/1000;   
            loopTimer+= event.delta;   
            if(!createjs.Tween.hasActiveTweens(catzRocketContainer))
            {
                catzRocketContainer.rotation = Math.atan(catzVelocity/40)*360/3.14;
            }
        }
        else if (catzState === catzStateEnum.Downloop || catzState === catzStateEnum.SlammerReady)
        {
            loopTimer+= event.delta;
            catzVelocity += ((2-8*Math.sin(catzRocketContainer.rotation))*
                grav+6*wind)*event.delta/1000+0.4;
        }
        else if (catzState === catzStateEnum.Slammer && catzRocketContainer.rotation<-250)
        {
            createjs.Tween.removeAllTweens(catzRocketContainer);
            catzVelocity = limitVelocity;
            catzState = catzStateEnum.TerminalVelocity;
            catzRocket.gotoAndPlay("shake");
            hideSnake();
        }
        if (catzRocketContainer.rotation<-60 && catzState === catzStateEnum.Uploop)
        {
            rocketSound.stop();
            createjs.Tween.removeAllTweens(catzRocketContainer);
            tween = createjs.Tween.get(catzRocketContainer)
                .to({rotation:-270},1000)
                .to({rotation:-330},350)
                .call(catzRelease);
            catzState = catzStateEnum.Downloop;
            loopTimer = 0;
        }
        else if (catzState === catzStateEnum.SecondUploop)
        {
            catzVelocity -= (5.5*grav-2*wind)*event.delta/1000;          
            //heightOffset += 20*catzVelocity*event.delta/1000;  
            heightOffset += 20*catzVelocity*event.delta/1000;
            loopTimer+= event.delta;   
            if(!createjs.Tween.hasActiveTweens(catzRocketContainer))
            {
                catzRocketContainer.rotation = Math.atan(catzVelocity/40)*360/3.14;
            }
        }
        else if (catzState === catzStateEnum.SecondDownloop)
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
        else if (catzState === catzStateEnum.Slingshot && catzRocketContainer.rotation <-400)
        {
            createjs.Tween.removeAllTweens(catzRocketContainer);
            catzState = catzStateEnum.Normal;
            catzRocket.gotoAndPlay("no shake");
            hideSnake();
            heightOffset-=110*Math.sin((catzRocketContainer.rotation+110)/360*2*Math.PI);
            catzVelocity =-20;
            //Math.atan(catzVelocity/40)*360/3.14;
        }
        if (catzRocketContainer.rotation<-60 && catzState === catzStateEnum.SecondUploop)
        {
            restartSecondLoop();
            catzState = catzStateEnum.SecondDownloop;
            heightOffset+=110*Math.sin((catzRocketContainer.rotation+110)/360*2*Math.PI);
            loopTimer = 0;
        }
        if(catzState !== catzStateEnum.SecondDownloop 
                && catzState !== catzStateEnum.Slingshot)
        {
            catzRocketContainer.x = 200+
                        Math.cos((catzRocketContainer.rotation+90)/360*2*Math.PI)*160;
            catzRocketContainer.y = 200+
                        Math.sin((catzRocketContainer.rotation+90)/360*2*Math.PI)*210
                +heightOffset;
        }
        else
        {
            catzRocketContainer.x = 255+
                Math.cos((catzRocketContainer.rotation+90)/360*2*Math.PI)*80;
            catzRocketContainer.y = 200+
                Math.sin((catzRocketContainer.rotation+90)/360*2*Math.PI)*100
                +heightOffset;
        }
        if(catzRocketContainer.y > 450 || catzRocketContainer.y < -1000)
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
            if((catzRocketContainer.x-catzBounds.width)<(kid.x) && catzRocketContainer.x > 
                    kid.x && (catzRocketContainer.y-catzBounds.height) < kid.y
                    && catzRocketContainer.y > kid.y)
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
            if(catzRocketContainer.x<(kid.x+rect.width*kid.scaleX) && catzRocketContainer.x > 
                    kid.x && catzRocketContainer.y < (kid.y+rect.height*kid.scaleY)
                    && catzRocketContainer.y > kid.y && cloudIsIn[kid]===false)
            {
                cloudIsIn[kid] = true;
                smoke.alpha = 1;
                smoke.rotation = catzRocketContainer.rotation+270;
                smoke.x = catzRocketContainer.x;
                smoke.y = catzRocketContainer.y;
                smoke.gotoAndPlay("jump");
                smoke.addEventListener("animationend",function(){hideSmoke();});
            }
            else if(cloudIsIn[kid]===true
                    && 
                    ((catzRocketContainer.x-catzBounds.width/2)> (kid.x+rect.width*kid.scaleX)
                    || catzRocketContainer.y-catzBounds.height/2 > (kid.y+rect.height*kid.scaleY)
                    || (catzRocketContainer.y+catzBounds.height < kid.y)))
            {
                cloudIsIn[kid] = false;
                exitSmoke.alpha = 1;
                exitSmoke.rotation = catzRocketContainer.rotation;
                exitSmoke.x = catzRocketContainer.x;
                exitSmoke.y = catzRocketContainer.y;
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
            if(hit ===false && catzRocketContainer.x<(kid.x+rect.width*kid.scaleX) && catzRocketContainer.x > 
                    kid.x && catzRocketContainer.y < (kid.y+rect.height*kid.scaleY+100)
                    && catzRocketContainer.y > kid.y+50)
            {
                    var lightning= new createjs.Shape();
                    lightning.graphics.setStrokeStyle(15,1);
                    lightning.graphics.beginStroke(flameColor);
                    lightning.graphics.moveTo(kid.x,kid.y);
                    lightning.graphics.lineTo(catzRocketContainer.x,catzRocketContainer.y);
                    lightning.graphics.endStroke();
                    lightning.graphics.setStrokeStyle(12,1);
                    lightning.graphics.beginStroke(flameColor);
                    lightning.graphics.moveTo(catzRocketContainer.x,catzRocketContainer.y);
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
                element1[i].y+=catzRocketContainer.y;
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
                                console.log("!x:"+track[i].x);
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
            if(Math.pow(catzRocketContainer.x-kid.x,2) +
                    Math.pow(catzRocketContainer.y-kid.y,2) <2500)
            {
                diCont.removeChildAt(i);
                gameStats.score += 1;
                arrayLength = arrayLength - 1;
                icon = i - 1;
                diamondSound.play();
                diamondFrenzyCharge +=1;
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
            if((catzRocketContainer.x-catzBounds.width)<kid.x && catzRocketContainer.x-20 > 
            kid.x && (catzRocketContainer.y-catzBounds.height) < kid.y
            && catzRocketContainer.y > kid.y)
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
            if((catzRocketContainer.x-catzBounds.width)<kid.x && catzRocketContainer.x > 
            kid.x && (catzRocketContainer.y-catzBounds.height) < kid.y
            && catzRocketContainer.y > kid.y)
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
            kid.x = rocketSnake.children[i-1].x-2*Math.cos(6.28*catzRocketContainer.rotation/360);
            kid.y = rocketSnake.children[i-1].y;
        }
        if(catzState !== catzStateEnum.SecondDownloop 
        && catzState !== catzStateEnum.Slingshot)
        {
            rocketSnake.children[0].x = -60+
                Math.cos((catzRocketContainer.rotation+101)/360*2*Math.PI)*176;
            rocketSnake.children[0] .y =
                Math.sin((catzRocketContainer.rotation+100)/360*2*Math.PI)*232
            +heightOffset;
            rocketFlame.x =catzRocketContainer.x;
            rocketFlame.y = catzRocketContainer.y;
        }
        else 
        {
            rocketSnake.children[0].x =-5+
                Math.cos((catzRocketContainer.rotation+110)/360*2*Math.PI)*100;
            rocketSnake.children[0] .y =
                Math.sin((catzRocketContainer.rotation+110)/360*2*Math.PI)*120
            +heightOffset;
            rocketFlame.x =catzRocketContainer.x;
            rocketFlame.y = catzRocketContainer.y;
        }
        rocketFlame.rotation =catzRocketContainer.rotation;
        SnakeLine.graphics = new createjs.Graphics();
        for (var i = arrayLength-1; i >0 ; i--) {
            var kid = rocketSnake.children[i];
            SnakeLine.graphics.setStrokeStyle(arrayLength*2-i*2,1);
            SnakeLine.graphics.beginStroke(flameColor);
            SnakeLine.graphics.moveTo(kid.x+260,kid.y+200);
            SnakeLine.graphics.lineTo(rocketSnake.children[i-1].x+260,rocketSnake.children[i-1].y+200);
            SnakeLine.graphics.endStroke();
        }
    }
    
    function showSnake()
    {
        rocketSnake.children[0].x = -60+
            Math.cos((catzRocketContainer.rotation+101)/360*2*Math.PI)*176;
        rocketSnake.children[0] .y =
            Math.sin((catzRocketContainer.rotation+100)/360*2*Math.PI)*232
            +heightOffset;
        rocketFlame.x = rocketSnake.children[0].x;
        rocketFlame.y = rocketSnake.children[0].y;
        rocketFlame.rotation =catzRocketContainer.rotation;
        var arrayLength = rocketSnake.children.length;    
        for (var i = arrayLength-1; i >0 ; i--) {
            var kid = rocketSnake.children[i];
            kid.x = rocketSnake.children[0].x+2*Math.cos(6.28*catzRocketContainer.rotation/360);
            kid.y = rocketSnake.children[0].y;
        }
        //rocketSnake.alpha=1;
        SnakeLine.alpha = 1;
        rocketFlame.alpha =1;
        rocketFlame.gotoAndPlay("ignite");
    }
    
    function hideSnake()
    {
        rocketSnake.alpha=0;
        SnakeLine.alpha = 0;
        rocketFlame.alpha = 0;
    }
    
    function catzUp()
    {
        rocketSound.play();
        mousedown = true;
        if(catzState === catzStateEnum.Normal)
        {
            catzVelocity-=2;
            catzState = catzStateEnum.Uploop;
            showSnake();
            //rocketFlame.gotoAndPlay("ignite");
            catzRocket.gotoAndPlay("shake");
            //createjs.Tween.removeAllTweens(catzRocket);
            //createjs.Tween.get(catzRocket)
            //        .to({rotation:-65},800,createjs.Ease.quadOut);
        }
        else if(catzState === catzStateEnum.TerminalVelocity)
        {
           catzState = catzStateEnum.EmergencyBoost;
           showSnake();
        }
        else if(catzState === catzStateEnum.SlammerReady 
                && catzRocketContainer.rotation>-250)
        {
           catzState = catzStateEnum.Slammer;
        }
    }

    function catzEndLoop()
    {
        rocketSound.stop();
        mousedown = false;
        if(catzState!==catzStateEnum.Downloop
                && catzState!==catzStateEnum.SlammerReady 
                && catzState!==catzStateEnum.Slammer 
                && catzState!==catzStateEnum.SecondDownloop
                && catzState!==catzStateEnum.Slingshot)
        {
            catzState = catzStateEnum.Normal;
            hideSnake();
            catzRocket.gotoAndPlay("no shake");
        }
        else if (catzState===catzStateEnum.SecondDownloop)
        {
            catzState = catzStateEnum.Slingshot;
        }
        else if (catzState===catzStateEnum.Downloop)
        {
            catzState = catzStateEnum.SlammerReady;
        }
    }
    
    function restartSecondLoop()
    {
        createjs.Tween.removeAllTweens(catzRocketContainer);
        tween = createjs.Tween.get(catzRocketContainer,{loop:true})
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
        catzVelocity = 10;
        if(mousedown)
        {
                catzVelocity = Math.tan(catzRocketContainer.rotation *3.14/360)*40;
                rocketSound.play();
                catzState = catzStateEnum.SecondUploop;
                catzRocket.gotoAndPlay("shake");
        }
        else
        {
            catzState = catzStateEnum.Normal;
            catzRocket.gotoAndPlay("no shake");
            hideSnake();
            catzVelocity = Math.tan(catzRocketContainer.rotation *3.14/360)*40;            
        }        
    }
    
    function getHit()
    {
        hit = true;
        silouette.alpha=1;
        catzRocket.alpha = 0;
        catzVelocity =Math.min(catzVelocity+20,limitVelocity); 
        catzEndLoop();
        stage.removeAllEventListeners();
        leaves.alpha = 1;
        leaves.rotation = 0;
        leaves.x = catzRocketContainer.x-50;
        leaves.y = catzRocketContainer.y-50;
        leaves.gotoAndPlay("cycle");
        leaves.addEventListener("animationend",function(){hideLeaves();});
    }
    
    function crash()
    {
        hit = false;
        lightningCont.removeAllChildren();
        directorState=directorStateEnum.Normal;
        noWind();
        silouette.alpha=0;
        catzRocket.alpha = 1;
        stage.removeAllEventListeners();
        stage.removeChild(gameView);
        stage.addChild(houseView);
        stage.update();
        wickExclamation.alpha= 0;
        createjs.Ticker.setFPS(20);
        createjs.Ticker.off("tick", gameListener);
        houseListener = createjs.Ticker.on("tick", houseTick,this);
        wick.x=-100;
        wick.removeAllEventListeners();
        wick.gotoAndPlay("still");
        createjs.Tween.removeAllTweens(catzRocketContainer);
        createjs.Tween.removeAllTweens(houseView);
        if(catzRocketContainer.y > 450)
        {            
            gotoHouseViewFromAbove();
        }
        else if (catzRocketContainer.y < -1000)
        {
            gotoHouseViewFromBelow();               
        }
        catzRocketContainer.x = 300;
        catzRocketContainer.y = 200;
        heightOffset=0;
        catzRocketContainer.rotation =0;
        hideSnake();
        catzState = catzStateEnum.Normal;
        catzVelocity = 0;
        bg.y = -1200;
        starCont.y=0;
        var instance = createjs.Sound.play("catzRocketCrash");
        instance.volume=0.5;
        onTrack=false;
        //shold check for hoboActive here
        hideSnake();
        createjs.Tween.get(houseView)
                .wait(200)
                .to({x:-50, y:20},50)
                .to({x:50, y:-40},50)
                .to({x:-50, y:50},50)
                .to({x:20, y:-20},50)
                .to({x:-10, y:10},50)
                .to({x:10, y:-10},50)
                .to({x:0, y:0},50)
                .wait(800);
        createjs.Tween.get(wick)
            .wait(2000)
            .to({x:-210},1500,createjs.Ease.quadInOut)
            .call(activateWick);
        cat.x = 100;
        cat.y = 160;
        createjs.Tween.get(cat)
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