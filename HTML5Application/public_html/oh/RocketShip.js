var RocketShip = (function(){
    var 
    dialogueCounter= 0,
    catzBounds,
    diamondFrenzyCharge = 0,
    hasFrenzy = false,
    catzRocketContainer = new createjs.Container(),
    cloudIsIn = new Array(),
    rocketShip={},
    canvas,
    gameView,
    gameListener,
    houseListener,
    stage,    
    smoke,
    exitSmoke,
    leaves,
    catzRocket,    
    rocketFlame,
    rocketSound,
    
    houseView = new createjs.Container(),
    seagullSheet,
    bg,    
    text, 
    diamondShardCounter,
    queue,
    mousedown,
    diamondSheet,
    grav = 12,
    jump,
    score = 0,    
    catzVelocity = -2,
    limitVelocity = 20,
    sgCont = new createjs.Container(),
    diCont = new createjs.Container(),
    fgCont = new createjs.Container(),
    starCont = new createjs.Container(),
    cloudCont = new createjs.Container(),
    diSpeed = 25,    
    cloudSpeed = 25,
    fgSpeed = 14,
    sgSpeed =12,
    crashed = false,
    bg,
    queue,
    manifest,    
    rocketSong,
    loopTimer = 0,
    catzStateEnum = {
        Normal : 0,
        Uploop : 1,
        Downloop : 2
    },
    catzState=catzStateEnum.Normal,
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
    heightOffset=0;

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
                    {id: "seagullSpriteSheet", src: "assets/seagull.png"},
                    {id: "diamond", src: "assets/new assets/sprites/newDiamond3.png"}, 
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
                    {id:"rocket", src:"assets/new assets/sprites/catzAllanimations.png"},
                    {id:"flame", src:"assets/new assets/sprites/flame.png"},
                    {id:"star", src:"assets/new assets/img/star.png"},
                    {id:"house", src:"assets/new assets/img/house no hill.png"},
                    {id:"hobo", src:"assets/new assets/sprites/hoboCat.png"},
                    {id:"smokepuffs", src:"assets/new assets/sprites/smokepuffs.png"},
                    {id:"leaves", src:"assets/new assets/sprites/leaves.png"},
                    {id:"cat", src:"assets/new assets/sprites/lookingAtDiamondsSilouette.png"},
                    {id:"palladiumAlloySong", src:"assets/new assets/sound/palladium alloy.mp3"},
                    {id:"hoboCatSound1", src:"assets/new assets/sound/catz 1.mp3"},
                    {id:"hoboCatSound2", src:"assets/new assets/sound/catz 2.mp3"},
                    {id:"catzSound1", src:"assets/new assets/sound/catz 3.mp3"},
                    {id:"catzSound2", src:"assets/new assets/sound/catz 4.mp3"},
                    {id:"rocketSound", src:"assets/new assets/sound/rocket.mp3"},
                    {id:"lookDiamondsSong", src:"assets/new assets/sound/tmpMusic1.mp3"},
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
        gotoHouseView();
        stage.removeChild(progressBar);
        createjs.Sound.setMute(true);
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
        
        houseView.addChild(bg,starCont,house, cat, hobo,wick, hoboExclamation, 
        wickExclamation, hoboSpeach, catzSpeach);
    }
    
    
   function createBG()
   {
        
        bg = new createjs.Bitmap(queue.getResult("bg"));
        bg.y = -1200;
        setStars();
   }
    
    function gotoHouseView()
    {
        wick.x=-210;
        wick.removeAllEventListeners();
        wick.gotoAndPlay("still");
        if(wickActive)
        {
            wick.addEventListener("click",lightFuse);
        }
        
        hobo.addEventListener("click",hoboConversation);
        
        stage.removeAllEventListeners();
        stage.removeChild(gameView,text, diamondShardCounter);
        stage.addChild(houseView);
        stage.update();
        createjs.Ticker.setFPS(20);
        createjs.Ticker.off("tick", gameListener);
        houseListener = createjs.Ticker.on("tick", houseTick,this);
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
    
    function hoboConversation()
    {        
        if(dialogueCounter ===0)
        {            
            hoboCatSound1.play();        
            hoboSpeach.text = "good evening";
            hoboSpeach.alpha = 1;            
        }
        
        if(dialogueCounter ===1)
        {                    
            catzSound1.play();
            catzSpeach.text = "meow";                    
            catzSpeach.alpha = 1;
        }
        
        if(dialogueCounter ===2)
        {
            hoboCatSound2.play();        
            hoboSpeach.text = "whatcha lookin' at\n\
there, kitten?";
            hoboSpeach.alpha = 1;            
        }
        
        if(dialogueCounter ===3)
        {                    
            catzSound1.play();
            catzSpeach.text = "diamonds!";                    
            catzSpeach.alpha = 1;
        }
        
        if(dialogueCounter ===4)
        {
            hoboCatSound1.play();        
            hoboSpeach.text = "Heh, kitten what you got\n\
up there is none but \n\
big balls of gas and fire";
            hoboSpeach.alpha = 1;                        
        }
        
        if(dialogueCounter ===5)
        {
            hoboCatSound2.play();        
            hoboSpeach.text = "Wish I had me some \n\
diamonds though\n\
Then I could build myself \n\
a house";
            hoboSpeach.alpha = 1;                        
        }
        
        if(dialogueCounter ===6)
        {
            hoboCatSound2.play();        
            hoboSpeach.text = "Been awhile since \n\
I built something \n\
Been awhile since \n\
I had a house";
            hoboSpeach.alpha = 1;            
            wickActive = true;
            hoboActive = false;
            wick.addEventListener("click",lightFuse);            
        }
                
        if(dialogueCounter > 6 && !dialogueCounter%3===0)
        {            
            hoboSpeach.text = "*cough*";
            hoboSpeach.alpha = 1;                        
        }
        if(dialogueCounter > 6 && dialogueCounter%3===0)
        {            
            hoboSpeach.text = "hum hum";
            hoboSpeach.alpha = 1;                        
        }
        
        dialogueCounter += 1;
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
            rocketSong.play();
        }
        
        hoboExclamation.alpha = hoboActive;
        
        if(wickActive && wickExclamation.alpha <1)
        {
            wickExclamation.alpha += 0.01;
        }
        
    }

    function createGameView()
    {    
        var diamondData ={
            "framerate":24,
            "images":[queue.getResult("diamond")],
            "frames":[
                [0, 0, 256, 256, 0, -193, -133],
                [256, 0, 256, 256, 0, -193, -133],
                [512, 0, 256, 256, 0, -193, -133],
                [768, 0, 256, 256, 0, -193, -133],
                [1024, 0, 256, 256, 0, -193, -133],
                [1280, 0, 256, 256, 0, -193, -133],
                [1536, 0, 256, 256, 0, -193, -133],
                [0, 256, 256, 256, 0, -193, -133],
                [256, 256, 256, 256, 0, -193, -133],
                [512, 256, 256, 256, 0, -193, -133],
                [768, 256, 256, 256, 0, -193, -133],
                [1024, 256, 256, 256, 0, -193, -133],
                [1280, 256, 256, 256, 0, -193, -133],
                [1536, 256, 256, 256, 0, -193, -133],
                [0, 512, 256, 256, 0, -193, -133],
                [256, 512, 256, 256, 0, -193, -133],
                [512, 512, 256, 256, 0, -193, -133],
                [768, 512, 256, 256, 0, -193, -133],
                [1024, 512, 256, 256, 0, -193, -133],
                [1280, 512, 256, 256, 0, -193, -133],
                [1536, 512, 256, 256, 0, -193, -133],
                [0, 768, 256, 256, 0, -193, -133],
                [256, 768, 256, 256, 0, -193, -133],
                [512, 768, 256, 256, 0, -193, -133],
                [768, 768, 256, 256, 0, -193, -133]
            ],
            "animations":{"cycle": [0,24]}
            };
        diamondSheet = new createjs.SpriteSheet(diamondData);
        var diamond = new createjs.Sprite(diamondSheet,"cycle");

        diamond.x = 900;
        diamond.y = 50+ Math.random()*100;
        diamond.scaleX = 0.1;
        diamond.scaleY = 0.1;
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
                [0, 0, 256, 256, 0, -275, -200],
                [256, 0, 256, 256, 0, -275, -200],
                [512, 0, 256, 256, 0, -275, -200],
                [768, 0, 256, 256, 0, -275, -200],
                [1024, 0, 256, 256, 0, -275, -200],
                [1280, 0, 256, 256, 0, -275, -200],
                [1536, 0, 256, 256, 0, -275, -200],
                [0, 256, 256, 256, 0, -275, -200],
                [256, 256, 256, 256, 0, -275, -200],
                [512, 256, 256, 256, 0, -275, -200],
                [768, 256, 256, 256, 0, -275, -200],
                [1024, 256, 256, 256, 0, -275, -200],
                [1280, 256, 256, 256, 0, -275, -200],
                [1536, 256, 256, 256, 0, -275, -200],
                [0, 512, 256, 256, 0, -275, -200],
                [256, 512, 256, 256, 0, -275, -200],
                [512, 512, 256, 256, 0, -275, -200],
                [768, 512, 256, 256, 0, -275, -200],
                [1024, 512, 256, 256, 0, -275, -200],
                [1280, 512, 256, 256, 0, -275, -200]
            ],
            "animations":{
                "shake": {
                    "frames": [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                    "speed": 1
                },
                "no shake": {"frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "speed": 1}
            }            
        };
           
        
        var spriteSheet = new createjs.SpriteSheet(rocketData);    
        catzRocket = new createjs.Sprite(spriteSheet, "no shake");
        
        rocketData = {
            "framerate":24,
            "images":[queue.getResult("flame")],
            "frames":[
                [0, 0, 256, 256, 0, -292, -207],
                [256, 0, 256, 256, 0, -292, -207],
                [512, 0, 256, 256, 0, -292, -207],
                [768, 0, 256, 256, 0, -292, -207],
                [1024, 0, 256, 256, 0, -292, -207],
                [1280, 0, 256, 256, 0, -292, -207],
                [1536, 0, 256, 256, 0, -292, -207],
                [0, 256, 256, 256, 0, -292, -207],
                [256, 256, 256, 256, 0, -292, -207],
                [512, 256, 256, 256, 0, -292, -207],
                [768, 256, 256, 256, 0, -292, -207],
                [1024, 256, 256, 256, 0, -292, -207],
                [1280, 256, 256, 256, 0, -292, -207],
                [1536, 256, 256, 256, 0, -292, -207],
                [0, 512, 256, 256, 0, -292, -207],
                [256, 512, 256, 256, 0, -292, -207],
                [512, 512, 256, 256, 0, -292, -207],
                [768, 512, 256, 256, 0, -292, -207],
                [1024, 512, 256, 256, 0, -292, -207],
                [1280, 512, 256, 256, 0, -292, -207],
                [1536, 512, 256, 256, 0, -292, -207],
                [0, 768, 256, 256, 0, -292, -207],
                [256, 768, 256, 256, 0, -292, -207],
                [512, 768, 256, 256, 0, -292, -207],
                [768, 768, 256, 256, 0, -292, -207],
                [1024, 768, 256, 256, 0, -292, -207],
                [1280, 768, 256, 256, 0, -292, -207],
                [1536, 768, 256, 256, 0, -292, -207],
                [0, 1024, 256, 256, 0, -292, -207],
                [256, 1024, 256, 256, 0, -292, -207],
                [512, 1024, 256, 256, 0, -292, -207],
                [768, 1024, 256, 256, 0, -292, -207]
            ],
            "animations":{"ignite":{frames:[0,31],next:"cycle"}, "cycle": [8,31]}
            };
        
        var spriteSheet = new createjs.SpriteSheet(rocketData);    
        rocketFlame = new createjs.Sprite(spriteSheet, "cycle");
        rocketFlame.alpha=0;
        rocketFlame.scaleX = 0.4;
        rocketFlame.scaleY = 0.4;
        rocketFlame.x-=70;
        
        catzRocketContainer.x = 260;
        catzRocketContainer.y = 200;
        catzRocket.scaleX = 0.4;
        catzRocket.scaleY = 0.4;
        catzRocketContainer.regY = 100;
        catzRocketContainer.regX = 150;
        catzRocket.currentFrame = 0;   
                        
        catzRocketContainer.addChild(rocketFlame,catzRocket);
        
        catzBounds = catzRocketContainer.getTransformedBounds();
        
        
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
        }
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
             images: ["assets/seagull.png"],
            frames: {width:1235, height:1320},
            animations: {
                flappy:{ frames: [7,8,9,10,11]}
            }
        };
        
        seagullSheet = new createjs.SpriteSheet(seagullData);    
        var seagull = new createjs.Sprite(seagullSheet,"flappy");
        seagull.scaleX = 0.1;
        seagull.scaleY = 0.1;
        seagull.x = 900;
        seagull.y = 50+ Math.random()*100;
        sgCont.addChild(seagull);   
        
        rocketSound = createjs.Sound.play("rocketSound");
        rocketSound.volume = 0.1;
        rocketSound.stop();
        diamondSound = createjs.Sound.play("diamondSound");
        diamondSound.volume = 0.2;
        diamondSound.stop();
        
        gameView = new createjs.Container();
        gameView.addChild(bg,starCont, catzRocketContainer,sgCont, diCont,exitSmoke,smoke,cloudCont,fgCont,leaves);
    }
    
    function gotoGameView()
    {
        stage.removeChild(houseView);
        stage.addChild(gameView,text, diamondShardCounter);
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
        diSpeed = 12.5+12.5* Math.cos((catzRocketContainer.rotation)/360*2*Math.PI);    
        cloudSpeed = 12.5+12.5* Math.cos((catzRocketContainer.rotation)/360*2*Math.PI);
        fgSpeed = 7+7* Math.cos((catzRocketContainer.rotation)/360*2*Math.PI);
        sgSpeed = 6+6* Math.cos((catzRocketContainer.rotation)/360*2*Math.PI);        
        
        if(!event.paused)
        {                
            text.text = score;            
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
                updateFg(event);
                updateDiamonds();
                updateClouds(event);
                updateSeagulls();
                updateWorldContainer();
            }
            stage.update(event); 

        }
    }
    
    function updateWorldContainer(event)
    {
//        catzScreenPosition = catzRocketContainer.y+gameView.y;
//        if(catzScreenPosition<150)
//        {
//            gameView.y+= 150-catzScreenPosition;
//        }
//        else if(catzScreenPosition>250)
//        {
//            gameView.y-= catzScreenPosition-250;
//        }
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
            catzVelocity += grav*event.delta/1000;
            catzVelocity = Math.min(catzVelocity,limitVelocity);
            heightOffset += 20*catzVelocity*event.delta/1000;            
            loopTimer = 0;
            if(!createjs.Tween.hasActiveTweens(catzRocketContainer))
            {
                catzRocketContainer.rotation = Math.atan(catzVelocity/40)*360/3.14;                
            }                        
        }    
        else if (catzState === catzStateEnum.Uploop)
        {
            catzVelocity -= 2*grav*event.delta/1000;          
            heightOffset += 20*catzVelocity*event.delta/1000;   
            loopTimer+= event.delta;   
            if(!createjs.Tween.hasActiveTweens(catzRocketContainer))
            {
                catzRocketContainer.rotation = Math.atan(catzVelocity/40)*360/3.14;
            }
        }
        else if (catzState === catzStateEnum.Downloop)
        {
            loopTimer+= event.delta;
            catzVelocity += (2-8*Math.sin(catzRocketContainer.rotation))
                *grav*event.delta/1000+0.4;
        }
        if (catzRocketContainer.rotation<-60 && catzState === catzStateEnum.Uploop)
        {
            rocketFlame.alpha = 0;
            rocketSound.stop();
            createjs.Tween.removeAllTweens(catzRocketContainer);
            tween = createjs.Tween.get(catzRocketContainer)
                .to({rotation:-270},1000)
                .to({rotation:-330},350)
                .call(catzRelease);
            catzState = catzStateEnum.Downloop;
            loopTimer = 0;
        }
        catzRocketContainer.x = 200+
                    Math.cos((catzRocketContainer.rotation+90)/360*2*Math.PI)*160;
        catzRocketContainer.y = 200+
                    Math.sin((catzRocketContainer.rotation+90)/360*2*Math.PI)*210
            +heightOffset;

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
                console.log("woosh");
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
        leaves.alpha=1;
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
            //console.log("added cloud at " +yPos );
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
                smoke.x = 200+
                    Math.cos((catzRocketContainer.rotation+90)/360*2*Math.PI)*160;
                smoke.y = 200+
                    Math.sin((catzRocketContainer.rotation+90)/360*2*Math.PI)*210
            +heightOffset;
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
                exitSmoke.x = 200+
                    Math.cos((catzRocketContainer.rotation+90)/360*2*Math.PI)*160;
                exitSmoke.y = 200+
                    Math.sin((catzRocketContainer.rotation+90)/360*2*Math.PI)*210
            +heightOffset;
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
    
    function hideSmoke()
    {
        smoke.alpha = 0;
    }
    
    function hideExitSmoke()
    {
        exitSmoke.alpha = 0;
    }

    function updateDiamonds()
    {
        //Up
        if(false)
        {
            for (i = 0;i<5;i++)
            {
                var di = new createjs.Sprite(diamondSheet,"cycle");
                di.scaleX = 0.5;
                di.scaleY = 0.5;                                
                di.x = 800+100*i;
                di.y = 300-400/(5.1-i);
                                
                diCont.addChild(di);
            }            
        }
        //loop
        if(false)
        {
            var heightRan = Math.random()*-200;
            for (i = 0;i<20;i++)
            {
                var di = new createjs.Sprite(diamondSheet,"cycle");
                di.scaleX = 0.5;
                di.scaleY = 0.5;                                
                di.x = 800+Math.cos((i-4)*2*3.14/20)*300+60*i;
                di.y = 50-Math.sin((i-4)*2*3.14/20)*300+heightRan;                                
                diCont.addChild(di);                
            }            
        }
        
        if(Math.random()>0.99)
        {            
            for (i = 0;i<20;i++)
            {
                var di = new createjs.Sprite(diamondSheet,"cycle");
                di.scaleX = 0.5;
                di.scaleY = 0.5;                                
                di.x = 800+Math.cos(i/20*2*3.14-3.14/2)*350+50*i;
                di.y = 100-Math.sin(i/20*2*3.14-3.14/2)*180;                                
                diCont.addChild(di);                
            }            
        }

        var arrayLength = diCont.children.length;
        for (var i = 0; i < arrayLength; i++) {
            var kid = diCont.children[i];
            kid.x = kid.x - diSpeed;    
            if (kid.x <= -100)
            {
              diCont.removeChildAt(i);
              arrayLength = arrayLength - 1;
              i = i - 1;
            }                        
            if((catzRocketContainer.x-catzBounds.width)<(kid.x) && catzRocketContainer.x > 
                    kid.x && (catzRocketContainer.y-catzBounds.height) < kid.y
                    && catzRocketContainer.y > kid.y)
            {
                diCont.removeChildAt(i);
                score = score +1;
                arrayLength = arrayLength - 1;
                icon = i - 1;
                diamondSound.play();
                diamondFrenzyCharge +=1;
            }
        }   
    }

    function updateSeagulls()
    {
        if(Math.random()>1.1) // kill spawnrate
        {
            var seagull = new createjs.Sprite(seagullSheet,"flappy");
            seagull.scaleX = 0.1;
            seagull.scaleY = 0.1;
            seagull.x = 800;
            seagull.y = 50 +Math.random()*200;
            sgCont.addChild(seagull);
        }
        var arrayLength = sgCont.children.length;   
        for (var i = 0; i < arrayLength; i++) {
            var kid = sgCont.children[i];
            kid.x = kid.x - sgSpeed;    
            if (kid.x <= -100)
            {
              sgCont.removeChildAt(i);
              arrayLength = arrayLength - 1;
              i = i - 1;
            }
            if(Math.abs(catzRocket.x - kid.x) < 30 && Math.abs(catzRocket.y - 
    kid.y)< 30 )
            {
                sgCont.removeAllChildren();
                var instance = createjs.Sound.play("birdcry");
                instance.volume = 0.1;
                crash();
            }
        }   
    }



    function catzUp()
    {
        rocketSound.play();
        mousedown = true;
        if(catzState === catzStateEnum.Normal)
        {
            catzVelocity-=2;
            catzState = catzStateEnum.Uploop;
            rocketFlame.alpha = 1;
            rocketFlame.gotoAndPlay("ignite");
            catzRocket.gotoAndPlay("shake");
            //createjs.Tween.removeAllTweens(catzRocket);
            //createjs.Tween.get(catzRocket)
            //        .to({rotation:-65},800,createjs.Ease.quadOut);
        }

    }

    function catzEndLoop()
    {
        rocketSound.stop();
        mousedown = false;
        if(catzState!==catzStateEnum.Downloop)
        {
            catzState = catzStateEnum.Normal;
            rocketFlame.alpha = 0;
            catzRocket.gotoAndPlay("no shake");
        }
    }

    function catzRelease()
    {
        if(mousedown)
        {
            rocketSound.play();
            catzState = catzStateEnum.Uploop;
            catzVelocity = 0;
            rocketFlame.alpha = 1;
            rocketFlame.gotoAndPlay("ignite");
            catzRocket.gotoAndPlay("shake");
        }
        else
        {
            catzState = catzStateEnum.Normal;
            catzRocket.gotoAndPlay("no shake");
            rocketFlame.alpha=0;
            catzVelocity = Math.tan(catzRocketContainer.rotation *3.14/360)*40;            
        }        
    }
    
    function crash()
    {
        if(!crashed)
        {
            var instance = createjs.Sound.play("catzRocketCrash");
            instance.volume=0.5;
            crashed = true;
            createjs.Tween.removeAllTweens(catzRocketContainer);
            createjs.Tween.removeAllTweens(gameView);
            rocketFlame.alpha=0;
            var tween = createjs.Tween.get(gameView)
                    .to({x:-50, y:20},50)
                    .to({x:50, y:-40},50)
                    .to({x:-50, y:50},50)
                    .to({x:20, y:-20},50)
                    .to({x:-10, y:10},50)
                    .to({x:10, y:-10},50)
                    .to({x:0, y:0},50)
                    .wait(800)
                    .call(reset);
            console.log("crashed");
        }
    }

    function reset()
    {    
        console.log("reset");
        //gameView.y = -600;
        catzRocketContainer.x = 300;
        catzRocketContainer.y = 200;
                heightOffset=0;
        catzRocketContainer.rotation =0;
        createjs.Tween.removeAllTweens(catzRocketContainer);
        rocketFlame.alpha=0;
        catzState = catzStateEnum.Normal;
        catzVelocity = 0;
        bg.y = -1200;
        starCont.y=0;
        crashed = false;
        gotoHouseView();
        stage.update();
    }

    return rocketShip;
}());