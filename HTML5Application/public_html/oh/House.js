House = (function(){
    var house,
    stage;
    
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
    };

    function addHouse()
    {                
        bg = new createjs.Bitmap(queue.getResult('bg'));
        
        stage.addChild(bg);           
        stage.update();
    }      
    
    return house;
});

