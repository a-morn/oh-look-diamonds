Menu = (function(){
    var menu = {},
    stage,
    startB,
    creditsB,
    titleView = new createjs.Container(),
    credits,
    house;    
    
    menu.Init = function(aHouse)
    {        
        house = aHouse;
        stage                       = new createjs.Stage('mahCanvas');
        stage.mouseEventsEnabled    = true;

        var manifest = [
                    //{id: "catz", src: "assets/catz.png"},                     
                    {id: "main", src: "assets/main.png"}, 
                    {id: "startB", src: "assets/startB.png"}, 
                    {id: "creditsB", src: "assets/creditsB.png"},
                    {id:"bg", src:"assets/bg.png"},
                    {id:"credits", src:"assets/credits.png"}
                ];

        queue = new createjs.LoadQueue(true);
        queue.installPlugin(createjs.Sound);        
        queue.on("complete", addTitleView);
        queue.loadManifest(manifest);        
    };

    function addTitleView()
    {                
        startB = new createjs.Bitmap(queue.getResult('startB'));
        startB.x = 240;
        startB.y = 160;
        startB.name = 'startB';

        startB.scaleX=0.25;
        startB.scaleY=0.25;

        creditsB = new createjs.Bitmap(queue.getResult('creditsB'));
        creditsB.x = 240;
        creditsB.y = 200;

        creditsB.scaleX=0.25;
        creditsB.scaleY=0.25;

        var creditsBCont = new createjs.Container();
        creditsBCont.addChild(creditsB);

        var main = new createjs.Bitmap(queue.getResult('main'));
        var bg = new createjs.Bitmap(queue.getResult('bg'));

        titleView.addChild(main, startB, creditsBCont);        
        stage.addChild(bg, titleView);    

        // Button Listeners

        startB.addEventListener("click", (function(){house.Init();}));   
        creditsBCont.addEventListener("click", showCredits);

        stage.update();
    }
    
    function showCredits()
    {    
        // Show Credits
        startB.x = 50;
        creditsB.x = 50;
        credits = new createjs.Bitmap(queue.getResult('credits'));
        credits.x = 280;

        titleView.addChild(credits);    
        credits.addEventListener("click", hideCredits);

        stage.update();    
    }

    // Hide Credits

    function hideCredits()
    {    
        startB.x = 240;
        creditsB.x = 240;
        titleView.removeChild(credits);
        stage.update();
    };
    return menu;
});
