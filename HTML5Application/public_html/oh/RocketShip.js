var RocketShip = (function(){
    var 
    catzBounds,
    diamondFrenzyCharge = 0,
    hasFrenzy = false,
    catzRocketContainer = new createjs.Container(),
    rocketShip={},
    canvas,
    worldContainer,
    stage,    
    catzRocket,
    credits,
    rocketFlame,
    titleView = new createjs.Container(),
    seagullSheet,
    bg,    
    text,
    queue,
    mousedown,
    diamondSheet,
    grav = 9,
    jump,
    score = 0,    
    catzVelocity = -2,
    cameraOffset = 0,
    sgCont = new createjs.Container(),
    diCont = new createjs.Container(),
    fgCont = new createjs.Container(),
    starCont = new createjs.Container(),
    diSpeed = 25,
    fgSpeed = 14,
    sgSpeed =12,
    bg,
    queue,
    manifest,    
    loopTimer = 0,
    catzStateEnum = {
        Normal : 0,
        Uploop : 1,
        Downloop : 2
    },
    catzState=catzStateEnum.Normal;

    rocketShip.Init = function()
    {
        canvas                      = document.getElementById('mahCanvas');
        stage                       = new createjs.Stage(canvas);
        stage.mouseEventsEnabled    = true;

        manifest = [
                    //{id: "catz", src: "assets/catz.png"}, 
                    {id: "catzRocketSpriteSheet", src: 
                    "assets/catzRocketSpriteSheet.png"},
                    {id: "seagullSpriteSheet", src: "assets/seagull.png"},
                    {id: "diamond", src: "assets/new assets/sprites/newDiamond3.png"}, 
                    {id: "meow", src: "assets/meow.mp3"},
                    //{id:"birdcry", src: "assets/birdcry.mp3"},
                    {id: "main", src: "assets/main.png"}, 
                    {id: "startB", src: "assets/startB.png"}, 
                    {id: "creditsB", src: "assets/creditsB.png"},
                    {id:"bg", src:"assets/new assets/img/background long.jpg"},
                    {id:"credits", src:"assets/credits.png"},
                    {id:"cload1", src:"assets/cload1.png"},
                    {id:"fgTree1", src:"assets/new assets/img/tree 8.png"},
                    {id:"diamondSound", src:"assets/diamondSound.mp3"},
                    {id:"catzRocketCrash", src:"assets/new assets/sound/crash.ogg"},
                    {id:"fgGround", src:"assets/new assets/img/fgGround.png"},
                    {id:"rocket", src:"assets/new assets/sprites/catzRocketNoShake.png"},
                    {id:"flame", src:"assets/new assets/sprites/flame.png"},
                    {id:"star", src:"assets/new assets/img/star.png"}
                ];

        queue = new createjs.LoadQueue(true);
        queue.installPlugin(createjs.Sound);
        queue.on("progress", handleProgress);            
        queue.on("complete", handleComplete);
        queue.loadManifest(manifest);         
    };

    function handleProgress(event)
    {
        event.loaded;
    }

    function handleComplete(event)
    {
        addGameView();       
    }

    function addGameView()
    {    
        stage.removeChild(titleView);
        titleView = null;
        credits = null;    

        //catzRocket = new createjs.Bitmap(queue.getResult("catzRocket"));
        //catzRocket.scaleX=0.1;
        //catzRocket.scaleY=0.1;
        //catzRocket.x = 300;
        //catzRocket.y = 200;                           

        bg = new createjs.Bitmap(queue.getResult("bg"));
        bg.y = -1200;

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

        text = new createjs.Text("0", "20px Courier New", "#ff7700"); 
        text.x = 20;     
        textFrenzy = new createjs.Text("0", "20px Courier New", "#ff7700"); 
        textFrenzy.x = 450;     
        
        var rocketData = {
            "framerate":12,
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
                [512, 256, 256, 256, 0, -275, -200]
            ],
            "animations":{"cycle":[0,9]}
            };
        
        var spriteSheet = new createjs.SpriteSheet(rocketData);    
        catzRocket = new createjs.Sprite(spriteSheet, "cycle");
        
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
        
        catzRocketContainer.x = 300;
        catzRocketContainer.y = 200;
        catzRocket.scaleX = 0.4;
        catzRocket.scaleY = 0.4;
        catzRocketContainer.regY = 50;
        catzRocketContainer.regX = 50;
        catzRocket.currentFrame = 0;   
                        
        catzRocketContainer.addChild(rocketFlame,catzRocket);
        
        catzBounds = catzRocketContainer.getTransformedBounds();
                
       
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
        
        setStars();
        
        worldContainer = new createjs.Container();
        worldContainer.addChild(bg,starCont, catzRocketContainer,sgCont, diCont,fgCont);
        stage.addChild(worldContainer,text, textFrenzy);
        bg.addEventListener("click", startGame);        

        createjs.Ticker.on("tick", update);  
        createjs.Ticker.setFPS(30);            
        createjs.Ticker.setPaused(true);
   
        stage.update();
    }
    
    function setStars()
    {
        for(i=0;i<80;i++)
        {
            star = new createjs.Bitmap(queue.getResult("star"));
            delay = Math.random()*2000;
            star.x = Math.random()*800;
            star.y= Math.random()*600;
            createjs.Tween.get(star,{loop:true})
                    .wait(delay)
                    .to({alpha:0},1000)
                    .to({alpha:1},1000);
            starCont.addChild(star);
        }
    }

    function startGame()
    {            
        bg.removeEventListener("click", startGame); 
        bg.on("click", function(evt) {
            console.log(evt.stageX + " y:" +evt.stageY);            
        },null,false);
        stage.addEventListener("stagemousedown", catzUp);    
        stage.addEventListener("stagemouseup", catzEndLoop);    
        jump = false;
        catzVelocity-=2;

        createjs.Ticker.setPaused(false);       
    }

    function update(event)
    {        
        if(!event.paused)
        {                
            text.text = "Total shards collected: " + score;
            textFrenzy.text = "Frenzy Charge: " +diamondFrenzyCharge +
                    "\n\Has frenzy: " + hasFrenzy;
            if(diamondFrenzyCharge>0)
            {
                diamondFrenzyCharge -= event.delta/2000;
            }
            if(diamondFrenzyCharge>3 && !hasFrenzy)
            {
                hasFrenzy = true;
                //catzRocketContainer.x+=100;
            }
            else if(diamondFrenzyCharge<3 && hasFrenzy)
            {
                hasFrenzy = false;
                //catzRocketContainer.x-=100;
            }
            updatecatzRocket(event);            
            updateFg(event);
            updateDiamonds();
            updateSeagulls();
            updateWorldContainer();
            stage.update(event); 

        }
    }
    
    function updateWorldContainer(event)
    {
//        catzScreenPosition = catzRocketContainer.y+worldContainer.y;
//        if(catzScreenPosition<150)
//        {
//            worldContainer.y+= 150-catzScreenPosition;
//        }
//        else if(catzScreenPosition>250)
//        {
//            worldContainer.y-= catzScreenPosition-250;
//        }
          if(catzRocketContainer.y<200 && catzRocketContainer.y>-1350)
          {
              worldContainer.y=200-catzRocketContainer.y;
          }
    }

    function updatecatzRocket(event)
    {    
        if(catzState === catzStateEnum.Normal)   
        {

            catzVelocity += grav*event.delta/1000;
            catzRocketContainer.y += 20*catzVelocity*event.delta/1000;
            loopTimer = 0;
            if(!createjs.Tween.hasActiveTweens(catzRocketContainer))
            {
            catzRocketContainer.rotation = Math.atan(catzVelocity/40)*360/3.14;
            }
        }    
        else if (catzState === catzStateEnum.Uploop)
        {
            catzVelocity -= 2.5*grav*event.delta/1000;
            catzRocketContainer.y += 20*catzVelocity*event.delta/1000;
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
                *grav*event.delta/1000;  
    //        diSpeed = diSpeed * 0.98;
    //        bgSpeed = bgSpeed * 0.98;
    //        fgSpeed = fgSpeed * 0.98;

            catzRocketContainer.y+= 20*catzVelocity*event.delta/1000;
        }
        if (catzRocketContainer.rotation<-40 && catzState === catzStateEnum.Uploop)
        {
            rocketFlame.alpha = 0;
            createjs.Tween.removeAllTweens(catzRocketContainer);
            tween = createjs.Tween.get(catzRocketContainer)
                .to({rotation:-270},1000)
                .to({rotation:-330},200)
                .call(catzRelease);
            catzState = catzStateEnum.Downloop;
            loopTimer = 0;
        }

        if(catzRocketContainer.y > 450)
        {            
            reset();
        }
    }

    function updateFg(event)
    {
        if(Math.random()>0.98)
        {
            var tree = new createjs.Bitmap(queue.getResult("fgTree1"));     
            tree.scaleX = 0.8;
            tree.scaleY = 0.8;
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
        }                
        if (arrayLength>2)
        {
            if(fgCont.children[2].x < -100)
            {
                fgCont.removeChildAt(2);
            }        
        }
    }

    function updateDiamonds()
    {
        if(Math.random()>0.98)
        {
            var di = new createjs.Sprite(diamondSheet,"cycle");
            di.scaleX = 0.5;
            di.scaleY = 0.5;
            di.x = 800;
            di.y = 50 +Math.random()*200;
            diCont.addChild(di);
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
            //50 and 50 is approx height and width of diamonds
            if((catzRocketContainer.x-catzBounds.width)<(kid.x) && catzRocketContainer.x > 
                    kid.x && (catzRocketContainer.y-catzBounds.height) < kid.y
                    && catzRocketContainer.y > kid.y)
            {
                diCont.removeChildAt(i);
                score = score +1;
                arrayLength = arrayLength - 1;
                icon = i - 1;
                var instance = createjs.Sound.play("diamondSound");
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
                reset();;
            }
        }   
    }



    function catzUp()
    {
        mousedown = true;
        if(catzState === catzStateEnum.Normal)
        {
            catzVelocity-=2;
            catzState = catzStateEnum.Uploop;
            rocketFlame.alpha = 1;
            rocketFlame.gotoAndPlay("ignite");
            //createjs.Tween.removeAllTweens(catzRocket);
            //createjs.Tween.get(catzRocket)
            //        .to({rotation:-65},800,createjs.Ease.quadOut);
        }

    }

    function catzEndLoop()
    {
        mousedown = false;
        if(catzState!==catzStateEnum.Downloop)
        {
            catzState = catzStateEnum.Normal;
            rocketFlame.alpha = 0;
        }
        diSpeed = 12;
        bgSpeed = 5;
        fgSpeed = 14;
    }

    function catzRelease()
    {
        if(mousedown)
        {
            catzState = catzStateEnum.Uploop;
            rocketFlame.alpha = 1;
            rocketFlame.gotoAndPlay("ignite");
        }
        else
        {
            catzState = catzStateEnum.Normal;
            rocketFlame.alpha=0;
        }
        rotation=0;
    }

    function reset()
    {    
        createjs.Ticker.setPaused(true);
        //worldContainer.y = -600;
        catzRocketContainer.x = 300;
        catzRocketContainer.y = 200;
        catzRocketContainer.rotation =0;
        createjs.Tween.removeAllTweens(catzRocketContainer);
        rocketFlame.alpha=0;
        catzState = catzStateEnum.Normal;
        catzVelocity = 0;
        
        starCont.removeAllChildren();
        setStars();

        bg.addEventListener("click", startGame);        
        stage.removeEventListener("click", catzUp);  

        stage.update();
    }

    return rocketShip;
}());