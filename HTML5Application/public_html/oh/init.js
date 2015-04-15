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
                    {id:"bgParallax 0", src:"assets/new assets/img/background parallax.png"},                    
                    {id:"bgParallax 2", src:"assets/new assets/img/background parallax 4.png"},                    
                    {id:"bgParallax 1", src:"assets/new assets/img/background parallax 3.png"},                    
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
                    {id:"mobHill1", src:"assets/new assets/img/mob hill.png"},
                    {id:"mobHill2", src:"assets/new assets/img/mob hill 2.png"},
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
                    {id:"mouseCatz", src:"assets/new assets/img/mouseover catz.png"},
                    {id:"mouseCatparty", src:"assets/new assets/img/mouseover cat party.png"},
					{id:"mouseCatparty", src:"assets/new assets/img/mouseover cat party.png"},
                    {id:"supportingCharacter", src:"assets/new assets/sprites/supporting characters.png"},
                    {id:"fgTree1", src:"assets/new assets/img/tree 4.png"},
                    {id:"rocketCatz", src:"assets/new assets/sprites/catzOnly.png"},
                    {id:"rocket", src:"assets/new assets/img/rocket.png"},
                    {id:"flame", src:"assets/new assets/sprites/newFlame.png"},                    
                    {id:"star", src:"assets/new assets/img/star.png"},
                    {id:"house", src:"assets/new assets/img/house no hill.png"},
                    {id:"far right hill", src:"assets/new assets/img/far right hill.png"},
                    {id:"house popup", src:"assets/new assets/img/house popup.png"},
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

    function handleProgress(event){                
        progressBar.graphics.beginFill("#330033").drawRect(0,0,100*event.progress,20);                
        stage.update();
    }

    function handleComplete(){           
        SpriteSheetData.setValues(queue);
		dataDict = {
			"diamond" : SpriteSheetData.diamond,
			"mediumDiamond" : SpriteSheetData.mediumDiamond,
			"greatDiamond" : SpriteSheetData.greatDiamond,
			"seagull" : SpriteSheetData.seagullSheet,
			"goose" : SpriteSheetData.seagullSheet,
			"hawk" : SpriteSheetData.enemybirds,        
		};
        createBG();
        createHouseView();
        createGameView();
        stage.addChild(bg, cont.star);
        stage.enableMouseOver();		
        House.gotoHouseViewFirstTime(gameStats, stage, gameView,diamondCounterText, diamondShardCounter,
            muteButton, gameListener, rocketSong);		
        houseListener = createjs.Ticker.on("tick", GameLogic.houseTick,this);		
        stage.removeChild(progressBar);        
		if(debugOptions.noHouseView)
			GameLogic.gotoGameView();
    }
	
	function createHouseView(){        
		muteButton = helpers.createSprite(SpriteSheetData.muteButton, "mute", {x:745});        
        muteButton.addEventListener("click",switchMute);
                
		House.house = helpers.createBitmap(queue.getResult("house"), 
			{scaleX:0.8, scaleY:0.8, y:-20});                
        
		House.bgHill = helpers.createBitmap(queue.getResult("far right hill"), 
			{scaleX:0.8, scaleY:0.8, y:-20});                        

        House.hobo = helpers.createSprite(SpriteSheetData.hobo, "cycle", 
			{x:-110, y:225, regX:-210, regY:-180});        		        
                       
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
        
        House.houseInfoCont = new createjs.Container();
                
        House.houseInfo["rehab"] = new createjs.Container();
        House.houseInfo["rehab"].x = 390;
        House.houseInfo["rehab"].y = 270;

        var rGraphics = new createjs.Bitmap(queue.getResult("house popup"));
        var rBox = new createjs.Shape();
        rBox.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 100);
        rBox.alpha=0;
        var rxBox = new createjs.Shape();
        rxBox.graphics.beginFill("#ff0000").drawRect(86, 0, 22, 22);
        rxBox.addEventListener("click",(function(){House.houseInfo["rehab"].alpha = 0;}));
        rxBox.alpha=0.01;
        var rpBox = new createjs.Shape();
        rpBox.graphics.beginFill("#ffffff").drawRect(6, 32, 16, 16);
        rpBox.addEventListener("click",(function(){if(gameStats.bust ===0){gameStats.rehab.slots += 1;House.rsText.text = gameStats.rehab.slots;}}));
        rpBox.alpha=0.01;
        var rmBox = new createjs.Shape();
        rmBox.graphics.beginFill("#000000").drawRect(6, 48, 16, 16);
        rmBox.addEventListener("click",(function(){if(gameStats.rehab.slots>0)gameStats.rehab.slots -= 1; House.rsText.text = gameStats.rehab.slots;}));
        rmBox.alpha=0.01;
		
        House.rsText = helpers.createText(gameStats.rehab.slots, "16px Fauna One", "#ffffcc", {x:30, y:38});        
        
        House.addOnRehabText1 = helpers.createText("Rehab", "16px Fauna One", "#000", {x:5, y:5});		       
        
        House.houseInfo["rehab"].addChild(rBox, rGraphics, rxBox, rpBox, rmBox, House.rsText, House.addOnRehabText1);
        House.houseInfo["rehab"].alpha = 0;        
        House.houseInfoCont.addChild(House.houseInfo["rehab"]);
        
        House.houseInfo["orphanage"] = new createjs.Container();
        House.houseInfo["orphanage"].x = 500;
        House.houseInfo["orphanage"].y = 280;
        var oGraphics = new createjs.Bitmap(queue.getResult("house popup"));
        var oBox = new createjs.Shape();
        oBox.graphics.beginFill("#00ff00").drawRect(0, 0, 100, 100);
        oBox.alpha=0;
        var oxBox = new createjs.Shape();
        oxBox.graphics.beginFill("#ff0000").drawRect(86, 0, 22, 22);
        oxBox.addEventListener("click",(function(){House.houseInfo["orphanage"].alpha = 0;}));
        oxBox.alpha=0.01;
        var opBox = new createjs.Shape();
        opBox.graphics.beginFill("#ffffff").drawRect(6, 32, 16, 16);
        opBox.alpha=.01;
        opBox.addEventListener("click",(function(){if(gameStats.bust ===0){gameStats.orphanage.slots += 1;House.osText.text = gameStats.orphanage.slots;}}));
        var omBox = new createjs.Shape();
        omBox.graphics.beginFill("#000000").drawRect(6, 48, 16, 16);
        omBox.alpha=0.01;
        omBox.addEventListener("click",(function(){if(gameStats.orphanage.slots>0)gameStats.orphanage.slots -= 1;House.osText.text = gameStats.orphanage.slots;}));
        House.osText = helpers.createText(gameStats.orphanage.slots, "16px Fauna One", "#ffffcc",  {x:30, y:38});		       		
        
        House.addOnTextOrphanage1 = helpers.createText("Orphanage", "16px Fauna One", "#000",  {x:5, y:5});
				
        
        House.houseInfo["orphanage"].addChild(oBox, oGraphics, oxBox, opBox, omBox, House.osText, House.addOnTextOrphanage1);
        House.houseInfo["orphanage"].alpha = 0; 
        House.houseInfoCont.addChild(House.houseInfo["orphanage"]);
        
        House.houseInfo["university"] = new createjs.Container();
        House.houseInfo["university"].x = 600;
        House.houseInfo["university"].y = 330;
        var uBox = new createjs.Shape();
        uBox.graphics.beginFill("#0000ff").drawRect(0, 0, 100, 100);
        uBox.alpha=0;
        var uxBox = new createjs.Shape();
        uxBox.graphics.beginFill("#ff0000").drawRect(86, 0, 22, 22);
        uxBox.addEventListener("click",(function(){House.houseInfo["university"].alpha = 0;}));        
        uxBox.alpha=0.01;
        var uGraphics = new createjs.Bitmap(queue.getResult("house popup"));
        var upBox = new createjs.Shape();
        upBox.graphics.beginFill("#ffffff").drawRect(6, 32, 16, 16);
        upBox.addEventListener("click",(function(){if(gameStats.bust ===0){gameStats.university.slots += 1; House.usText.text = gameStats.university.slots;}}));
        upBox.alpha=0.01;
        var umBox = new createjs.Shape();
        umBox.graphics.beginFill("#000000").drawRect(6, 48, 16, 16);
        umBox.addEventListener("click",(function(){if(gameStats.university.slots>0)gameStats.university.slots -= 1; House.usText.text = gameStats.university.slots;}));
        umBox.alpha=0.01;
        House.usText = helpers.createText(gameStats.orphanage.slots, "16px Fauna One", "#000",  {x:30, y:38});
		
        House.addOnTextUniversity1 = helpers.createText("School", "16px Fauna One", "#000",  {x:5, y:5});		       
        
        House.houseInfo["university"].addChild(uBox, uGraphics, uxBox, upBox, umBox, House.usText,House.addOnTextUniversity1);
        House.houseInfo["university"].alpha = 0; 
        House.houseInfoCont.addChild(House.houseInfo["university"]);
        
		House.mouseHobo = helpers.createBitmap(queue.getResult("mouseHobo"), 
			{x:110, y:316, alpha:0, scaleX:0.5, scaleY:0.5});                
        
		House.mouseTimmy = helpers.createBitmap(queue.getResult("mouseTimmy"), 
			{x:85, y:360, alpha:0, scaleX:0.5, scaleY:0.5});        
        
        House.mousePries = helpers.createBitmap(queue.getResult("mousePriest"), 
			{x:53, y:330, alpha:0, scaleX:0.5, scaleY:0.5});                
        
        House.mouseChar = {"hoboCat":House.mouseHobo, "timmy":House.mouseTimmy, "priest" : House.mousePriest};
        
		House.mouseRocket = helpers.createBitmap(queue.getResult("mouseRocket"), 
			{x:207, y:338, alpha:0});        		        
			
		House.mouseCatz = helpers.createBitmap(queue.getResult("mouseCatz"), 
			{x:107, y:28, alpha:0, scaleX:0.5, scaleY:0.5});        		        
                				        
        House.catz = helpers.createSprite(SpriteSheetData.cat, "cycle", 
			{x:360, y:270, scaleX:0.8, scaleY:0.8});		                                    		
		
        House.wick = helpers.createSprite(SpriteSheetData.wick, "still", 
			{x:-210, y:50, scaleX:1.5, scaleY:1.5});			
        
        House.wickLight = new createjs.Shape();
        House.wickLight.graphics.beginFill("#ffcc00").dc(0,0,1.5);
        House.wickLight.x = 174;
        House.wickLight.y = 319;
        House.wickLight.alpha = 0;
        
		House.characterSpeach = helpers.createText("", "16px Fauna One", "#ffffcc", 
			{x:10, y:230, alpha:0});               
        
        House.characterExclamation = helpers.createText("!", "32px Fauna One", "#ffcc00", 
			{x:114, y:265, alpha:0});        				
        
        House.catzSpeach = helpers.createText("", "12px Fauna One", "#ffffcc", 
			{x:350, y:180, alpha:0});        								
        
        House.wickExclamation = helpers.createText("<---- Fire up the rocket", "16px Fauna One", "#ffcc00", 
			{x:193, y:305, alpha:0});        													
        
        House.choice1 = helpers.createText("", "20px Fauna One", "#ffcc00", 
			{x:350, y:150, alpha:0});        																	
        
		House.choice2 = helpers.createText("", "20px Fauna One", "#ffcc00", 
			{x:350, y:120, alpha:0});        													
	
		House.choice3 = helpers.createText("", "20px Fauna One", "#ffcc00", 
			{x:350, y:180, alpha:0});        													        
                
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
            House.wickExclamation, House.catzSpeach, House.characterSpeach, House.choice1, 
            House.choice2, House.choice3,muteButton, House.mouseHobo, House.mouseTimmy, 
            House.mousePriest, House.mouseRocket, House.mouseCatz, House.wickLight,House.oh, 
            House.look, House.diamonds, House.diCont, House.lookingAtStarsButton,
            House.houseInfoCont, House.subtractedDiamondCont);
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
        		
        hud = helpers.createBitmap(queue.getResult("hud"), 
            {x:588+107, y:-6});                                 
        
        hudPointer = helpers.createBitmap(queue.getResult("hudPointer"), 
            {x:588+158, y:50, regX:191,regY:54});               
        
        CatzRocket.glass = helpers.createSprite(SpriteSheetData.hudGlass, "still", 
            {regX:150, regY:200, scaleX:0.85, scaleY:0.85, x:670, y:158});  	
                
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
            cont.sg, cont.hawk, cont.goose, cont.attackBird, cont.diamond,
            exitSmoke,smoke, CatzRocket.rocketFlame, CatzRocket.catzRocketContainer,
            cont.cloud,cont.lightning,cont.thunder,cont.fg, cont.fgTop,leaves, cont.collisionCheckDebug);
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
	
	function switchMute(){
        if(createjs.Sound.getMute()){
            createjs.Sound.setMute(false);
            muteButton.gotoAndPlay("mute");
        }
        else{
            createjs.Sound.setMute(true);
            muteButton.gotoAndPlay("unmute");
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
		
	function goDown(){		
        bg.removeAllEventListeners();
        createjs.Tween.get(House.houseView).to({y:0},4000,createjs.Ease.quadInOut);
        createjs.Tween.get(bg).to({y:-1200},4000,createjs.Ease.quadInOut);
        createjs.Tween.get(cont.star).to({y:0},4000,createjs.Ease.quadInOut);
        createjs.Tween.get(House.hobo)
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
            .call(House.addCharacterEvents,[diamondCounterText])
            .call(House.addHouseEvents);
    }                  			
	return is;
}());