/* 
* To change this license header, choose License Headers in Project Properties.
* To change this template file, choose Tools | Templates
* and open the template in the editor.
*/
var canvas;
var stage;

var main;
var startB;
var creditsB;
var credits;
var titleView = new createjs.Container();

var bg;
var catz;
var text;

var queue;

var grav = 8;
var jump;
var score = 0;
var total = 0;



var diCont = new createjs.Container();
var bgCont = new createjs.Container();
var fgCont = new createjs.Container();
var diSpeed = 12;
var bgSpeed = 5;
var fgSpeed = 14;

var queue;
var manifest;
var totalLoaded = 0;

function init()
{
    canvas                      = document.getElementById('mahCanvas');
    stage                       = new createjs.Stage(canvas);
    stage.mouseEventsEnabled    = true;

    manifest = [
                //{id: "catz", src: "assets/catz.png"}, 
                {id: "catzRocketSpriteSheet", src: "assets/catzRocketSpriteSheet.png"},
                {id: "diamond", src: "assets/diamond.png"}, 
                {id: "meow", src: "assets/meow.mp3"},
                {id: "main", src: "assets/main.png"}, 
                {id: "startB", src: "assets/startB.png"}, 
                {id: "creditsB", src: "assets/creditsB.png"},
                {id:"bg", src:"assets/bg.png"},
                {id:"credits", src:"assets/credits.png"},
                {id:"cload1", src:"assets/cload1.png"},
                {id:"fgTree1", src:"assets/fgTree1.png"},
                {id:"diamondSound", src:"assets/diamondSound.mp3"},
                {id:"catzRocketCrash", src:"assets/catzRocketCrash.mp3"},
                {id:"fgGround", src:"assets/fgGround.png"}
            ];

    queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", handleProgress);            
    queue.on("complete", handleComplete);
    queue.loadManifest(manifest); 
    
    //play();
}

function handleProgress(event)
{
    event.loaded;
}

function handleComplete(event)
{
    addTitleView();       
}

function addTitleView()
{
    //console.log("Add Title View");
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
    
    creditsBCont = new createjs.Container();
    creditsBCont.addChild(creditsB);
    
    main = new createjs.Bitmap(queue.getResult('main'));
    bg = new createjs.Bitmap(queue.getResult('bg'));
                
    titleView.addChild(main, startB, creditsBCont);        
    stage.addChild(bg, titleView);    
     
    // Button Listeners
    
    startB.addEventListener("click", addGameView);   
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
    
    var cload1 = new createjs.Bitmap(queue.getResult("cload1"));
    cload1.scaleX=0.3;
    cload1.scaleY=0.3;
    cload1.x = 10;
    cload1.y = 50;                           
    
    var cload2 = new createjs.Bitmap(queue.getResult("cload1"));
    cload2.scaleX=0.3;
    cload2.scaleY=0.3;
    cload2.x = 500;
    cload2.y = 80;                       
    
    bgCont.addChild(cload1, cload2);                    
    
    var diamond = new createjs.Bitmap(queue.getResult("diamond"));
    
    diamond.x = 900;
    diamond.y = 50+ Math.random()*100;
    diamond.scaleX = 0.1;
    diamond.scaleY = 0.1;
    diCont.addChild(diamond);
    
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
    text.x = 100;     
        
    var catzData = {
         images: ["assets/catzRocketSpriteSheet.png"],
        frames: {width:1235, height:1320},
        animations: {
            rockOn:{ frames: [7, 8,9,10,11,10,9,8]},
            jump:{ frames: [6,5,4,3,2,1,0,0,0,1,2,3,4,5,6], next: false, frequency: 1 }
        }
    };
    var spriteSheet = new createjs.SpriteSheet(catzData);    
    catzRocket = new createjs.Sprite(spriteSheet, "rockOn");
    catzRocket.x = 300;
    catzRocket.y = 200;
    catzRocket.scaleX = 0.1;
    catzRocket.scaleY = 0.1;
    catzRocket.currentFrame = 0;   
        
    stage.addChild(bgCont);
    stage.addChild(catzRocket);         
    stage.addChild(diCont);    
    stage.addChild(fgCont);             
    stage.addChild(text);
    
    bg.addEventListener("click", startGame);            
    
    createjs.Ticker.on("tick", update);  
    createjs.Ticker.setFPS(30);            
    createjs.Ticker.setPaused(true);
    
    catzRocket.gotoAndStop(7);    
    stage.update();
}

function startGame()
{            
    bg.removeEventListener("click", startGame);        
    stage.addEventListener("click", catzUp);    
    jump = false;
    
    createjs.Ticker.setPaused(false);       
}

function update(event)
{
    if(!event.paused)
    {                
        text.text = score;
        updatecatzRocket();
        updateBg();
        updateFg();
        updateDiamonds();
        stage.update(event); 
    }
}

function updatecatzRocket()
{    
    if(jump)
    {
        total = total + 0.07;
        catzRocket.y = catzRocket.y - (1-total)*4*grav ;                
        if (total>1)
        {                          
            jump=false;
            total = 0;
            catzRocket.gotoAndPlay("rockOn");
        }
    }
    else
    {       
        catzRocket.y = catzRocket.y+grav;
    }    

    if(catzRocket.y > 450)
    {
        reset();
    }
}

function updateBg()
{
    var arrayLength = bgCont.children.length;    
    for (var i = 0; i < arrayLength; i++) {
        var kid = bgCont.children[i];
        kid.x = kid.x - bgSpeed;    
        if (kid.x < -300)
        {
          kid.x = 800;
        }
    }    
}

function updateFg()
{
    if(Math.random()>0.98)
    {
        var tree = new createjs.Bitmap(queue.getResult("fgTree1"));     
        tree.x = 1000;
        tree.y = 200;
        fgCont.addChild(tree);        
    }
    
    var arrayLength = fgCont.children.length;    
    for (var i = 0; i < arrayLength; i++) {
        var kid = fgCont.children[i];        
        if (kid.x <= -3200)
        {
          kid.x = kid.x + 4000;
        }
        kid.x = kid.x - fgSpeed;     
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
        var di = new createjs.Bitmap(queue.getResult("diamond"));
        di.scaleX = 0.1;
        di.scaleY = 0.1;
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
        if(Math.abs(catzRocket.x - kid.x) < 30 && Math.abs(catzRocket.y - kid.y)< 30 )
        {
            diCont.removeChildAt(i);
            score = score +1;
            arrayLength = arrayLength - 1;
            i = i - 1;
            var instance = createjs.Sound.play("diamondSound");
        }
    }   
}

function catzUp()
{
    if (!jump)
    {
        catzRocket.gotoAndPlay("jump");
    }
    jump = true;      
}

function reset()
{    
    var instance = createjs.Sound.play("catzRocketCrash");
    createjs.Ticker.setPaused(true);
    catzRocket.x = 300;
    catzRocket.y = 200;                
    bg.addEventListener("click", startGame);        
    stage.removeEventListener("click", catzUp);  
    
    stage.update();
}

