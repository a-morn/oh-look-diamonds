House = (function(){
    var house = {},
    stage,
    controls,
    catz;
    
    house.Init = function(){      
        stage                       = new createjs.Stage('mahCanvas');
        stage.mouseEventsEnabled    = true;

        var manifest = [
                    //{id: "catz", src: "assets/catz.png"},                                         
                    {id:"bg", src:"assets/bg.png"},                    
                ];

        queue = new createjs.LoadQueue(true);
        queue.installPlugin(createjs.Sound);        
        queue.on("complete", addHouse);
        queue.loadManifest(manifest);        
        controls = new Controls();        
    };

    function addHouse()
    {                
        bg = new createjs.Bitmap(queue.getResult('bg'));
        floor = new createjs.Shape();
        floor.graphics.beginStroke("black");
        floor.graphics.moveTo(100, 450).lineTo(150, 300).lineTo(650, 300).lineTo(700, 450).lineTo(100, 450);
        lWall = new createjs.Shape();
        lWall.graphics.beginStroke("black");
        lWall.graphics.moveTo(100, 450).lineTo(100, 200).lineTo(150, 50).lineTo(150, 300).lineTo(100, 450);
        rWall = new createjs.Shape();
        rWall.graphics.beginStroke("black");
        rWall.graphics.moveTo(650, 300).lineTo(650, 50).lineTo(700, 200).lineTo(700, 450).lineTo(650, 300);
        mWall = new createjs.Shape();
        mWall.graphics.beginStroke("black");
        mWall.graphics.moveTo(650, 300).lineTo(650, 50).lineTo(150, 50).lineTo(150, 300).lineTo(650, 300);
        
        catz = new createjs.Shape();
        catz.graphics.beginFill("#ff0000").drawRect(100, 350, 50, 50);
        
        stage.addChild(bg, floor,mWall,lWall,rWall, catz);           
        stage.update();                        
        controls.Init(catz);        
        
        createjs.Ticker.addEventListener("tick",onTick);
    }      
    
    function onTick(event)
    {
        stage.update();                        
        console.log(catz.x);
        if(catz.x>=400)
        {
            createjs.Ticker.removeAllEventListeners();
            stage.removeAllChildren();
            initINIT();
        }
    }
    
    return house;
});

