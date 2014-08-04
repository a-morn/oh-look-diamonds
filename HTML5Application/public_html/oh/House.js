House = (function(){
    var house = {},
    stage,
    telescopeContainer = new createjs.Container(),
    rocketContainer = new createjs.Container(),
    catz,
    rS,
    coordinates=[],
    starHeaven,
    queue,
    windowProximity,
    rocketProximity;
    
    house.Init = function(aRS){      
        rS = aRS;
        stage                       = new createjs.Stage('mahCanvas');
        stage.mouseEventsEnabled    = true;

        var manifest = [
                    //{id: "catz", src: "assets/catz.png"},                                         
                    {id:"bg", src:"assets/bg.png"},                    
                    {id:"sH", src:"assets/starHeaven.png"}                    
                ];

        queue = new createjs.LoadQueue(true);
        queue.installPlugin(createjs.Sound);        
        queue.on("complete", addHouse);
        queue.loadManifest(manifest);                
    };

    function addHouse()
    {
        starHeaven = new createjs.Bitmap(queue.getResult("sH"));
        starHeaven.on("click", function(evt) {
            stage.removeChild(starHeaven);
        },null,false);
        
        bg = new createjs.Shape();
        bg.graphics.beginFill("#111111").drawRect(0, 0, 800, 450);
        floor = new createjs.Shape();
        floor.graphics.beginStroke("black");
        floor.graphics.beginFill('#aa4411').moveTo(100, 450).lineTo(150, 300).lineTo(650, 300).lineTo(700, 450).lineTo(100, 450);        
        floor.on("click", function(evt) {
            coordinates.x =evt.stageX-25;
            coordinates.y =evt.stageY-50;            
        },null,false);
        lWall = new createjs.Shape();
        lWall.graphics.beginStroke("black");
        lWall.graphics.beginFill('#aa4411').moveTo(100, 450).lineTo(100, 200).lineTo(150, 50).lineTo(150, 300).lineTo(100, 450);
        rWall = new createjs.Shape();
        rWall.graphics.beginStroke("black");
        rWall.graphics.beginFill('#aa4411').moveTo(650, 300).lineTo(650, 50).lineTo(700, 200).lineTo(700, 450).lineTo(650, 300);
        mWall = new createjs.Shape();
        mWall.graphics.beginStroke("black");
        mWall.graphics.beginFill('#aa5511').moveTo(650, 300).lineTo(650, 50).lineTo(150, 50).lineTo(150, 300).lineTo(650, 300);
        
        catz = new createjs.Shape();
        catz.graphics.beginFill("#ff0000").drawRect(0, 0, 50, 50);
                
        telescope = new createjs.Shape();
        telescope.graphics.beginStroke("black");
        telescope.graphics.beginFill('#333333').moveTo(0, 100).lineTo(50, 20).lineTo(70, 30).lineTo(0, 100);
        starWindow= new createjs.Shape();
        starWindow.graphics.beginStroke("black");
        starWindow.graphics.beginFill('#333355').drawCircle(80, 20, 50);
        starWindow.on("click", function(evt) {
            if(windowProximity)
                LookAtStars();
        },null,false);
        
        rocket = new createjs.Shape();
        rocket.graphics.beginStroke("red");
        rocket.graphics.beginFill('#333333').moveTo(0, 100).lineTo(50, 20).lineTo(70, 10).lineTo(70, 50).
                lineTo(20, 130).lineTo(0,100);        
        rocket.on("click", function(evt) {
            if(rocketProximity)
            {
                stage.removeAllChildren();                           
                stage.removeAllEventListeners();
                createjs.Ticker.removeAllEventListeners();
                stage.update();
                rS.Init();
            }
        },null,false);
        rocketContainer.addChild(rocket);
        rocketContainer.x = 600;
        rocketContainer.y = 250;
        
        telescopeContainer.addChild(starWindow, telescope); 
        telescopeContainer.x = 320;
        telescopeContainer.y = 170;
        
        coordinates.x = 370;
        coordinates.y = 380;
        
        catz.x =coordinates.x;
        catz.y =coordinates.y;
        
        
        stage.addChild(bg, floor,mWall,lWall,rWall, catz, telescopeContainer, rocketContainer);           
        stage.update();                                
        
        createjs.Ticker.addEventListener("tick",onTick);
    }      
    
    function onTick(event)
    {
        stage.update();                                
        if(Math.abs(catz.x-coordinates.x)>5)
        {
            if(catz.x<coordinates.x)
                catz.x+=5;
            else
                catz.x-=5;
        }
        if(Math.abs(catz.y-coordinates.y)>6)
        {
            if(catz.y<coordinates.y)
                catz.y+=6;
            else
                catz.y-=6;
        }
                
        if(Math.pow(catz.x-telescopeContainer.x+30,2)+Math.pow(catz.y-telescopeContainer.y,2)<10000)
        {
            telescopeContainer.alpha=1;
            windowProximity = true;
        }
        else
        {
            telescopeContainer.alpha=0.5;
            windowProximity = false;
        }   
        if(Math.pow(catz.x-rocketContainer.x+30,2)+Math.pow(catz.y-rocketContainer.y,2)<10000)
        {
            rocketContainer.alpha=1;
            rocketProximity = true;
        }
        else
        {
            rocketContainer.alpha=0.5;
            rocketProximity = false;
        }   
    }
    
    function LookAtStars()
    {
        stage.addChild(starHeaven);
        
    }
    return house;
});

