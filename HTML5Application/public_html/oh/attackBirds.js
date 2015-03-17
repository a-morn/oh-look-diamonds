function AttackBird(sheet,current) {
    this.initialize(sheet,current);
}
//inheritance
AttackBird.prototype = new createjs.Sprite();
AttackBird.prototype.BirdInit = AttackBird.prototype.initialize;

//props
AttackBird.prototype.state = "normal";
AttackBird.prototype.velocityX = 0;
AttackBird.prototype.velocityY = 0;
AttackBird.prototype.acceleration = 3;
AttackBird.prototype.topSpeed2 = 3;
AttackBird.prototype.rad = 25;
AttackBird.prototype.shape = new createjs.Shape();
AttackBird.prototype.temperature = 0;
AttackBird.prototype.weight = 0;
AttackBird.prototype.BirdProperties = {
                    "chicken":  {acceleration: 0,  topSpeed2: 100000, weight: 0.2},
                    "falcon":   {acceleration: 8, topSpeed2: 100000, weight:0.3}, 
                    "crow":     {acceleration: 5,  topSpeed2: 100000, weight:0.5}, 
                    "bat":      {acceleration: 7,  topSpeed2: 100000, weight:0.1}, 
                    "duck":     {acceleration: 5, topSpeed2: 100000, weight:0.2}, 
                    "seagull":  {acceleration: 3, topSpeed2: 100000, weight:0.1}, 
                    "glasses":  {acceleration: 11, topSpeed2: 100000, weight:1}
                };
               
//constructor
AttackBird.prototype.initialize = function (sheet,current) {
    this.BirdInit(sheet,current);
    this.topSpeed2 = this.BirdProperties[current].topSpeed2;
    this.weight = this.BirdProperties[current].weight;
    this.acceleration = this.BirdProperties[current].acceleration;
    this.falconTimer=0;
    this.target=0;
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill("red").dc(0, 0, this.rad);
    this.scaleX = 0.5;
    this.scaleY = 0.5;
};

AttackBird.prototype.update = function (rocketX, rocketY, event) {
    if(this.currentAnimation==="falcon"){
        this.updateFalcon(rocketX, rocketY,event);
    }
    else if(this.currentAnimation==="duck"){
        this.updateDuck(rocketX,rocketY,event);
    }
    else{
        this.updateSeagull(rocketX,rocketY,event);
    }
};

AttackBird.prototype.updateDuck = function(rocketX,rocketY,event) {
    if(this.state==="normal"){
        this.velocityX=-300;
        var aY=0;
        if(this.x<650){
            this.state="attacking";
            this.target=rocketY;
        }
    }
    else if(this.state==="attacking"){
        this.velocityX=-250;
        aY=this.acceleration*event.delta*(rocketY-this.y)/(1000);
    }
    else if(this.state==="grilled"){
        aY=200*this.acceleration*event.delta/1000;
        this.rotation = Math.atan(this.velocityY/600)*360/3.14;
    }
    this.velocityY += aY;
    //this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    var speed2 = this.velocityX*this.velocityX+this.velocityY*this.velocityY;
    if(speed2>this.topSpeed2){
        this.velocityX=this.velocityX*this.topSpeed2/speed2;
        this.velocityY= this.velocityY*this.topSpeed2/speed2;      
    }
};

AttackBird.prototype.updateFalcon = function(rocketX, rocketY, event){
    if(this.state==="normal"){
        var aX = this.acceleration*event.delta*(rocketX-this.x)/(1000);
        var aY = this.acceleration*event.delta*(rocketY-350-this.y)/(1000);
        if(rocketY-250-this.y>0){
            this.rotation=-20;
            this.state="soaring";
            this.falconTimer=3000;
            aX =0;
            aY =0;
        }
    }
    else if(this.state==="attacking"){
        aX = this.acceleration*event.delta*(rocketX-this.x)/(1000);
        aY = this.acceleration*event.delta*(rocketY-this.y)/(1000);
        this.rotation = Math.atan(aY/60)*270/3.14;
        if(this.y-(rocketY)>0){
            this.rotation=-30;
            this.state="normal";
        }
        
    }
    else if(this.state==="soaring"){
        aX = this.acceleration*event.delta*(rocketX-this.x)/(1000);
        aY = this.acceleration*event.delta*(rocketY-250-this.y)/(1000);
        this.falconTimer-=event.delta;
        if(this.falconTimer<0){
            this.state="attacking";
            this.rotation=45;
            this.velocityX = this.acceleration*event.delta*(rocketX-this.x)/(1000);
            this.velocityY = this.acceleration*event.delta*(rocketY-this.y)/(1000);
        }
    }
    else if(this.state==="grilled"){
        aX=0;
        aY=200*this.acceleration*event.delta/1000;
        this.rotation = Math.atan(this.velocityY/600)*360/3.14;  
    }
    this.velocityX+=aX;
    this.velocityY += aY;
    //this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    var speed2 = this.velocityX*this.velocityX+this.velocityY*this.velocityY;
    if(speed2>this.topSpeed2)
    {
        this.velocityX=this.velocityX*this.topSpeed2/speed2;
        this.velocityY= this.velocityY*this.topSpeed2/speed2;      
    }
};

AttackBird.prototype.updateSeagull = function(rocketX, rocketY, event){
    var maxSpeed2=100000;
    var speed2 = this.velocityX*this.velocityX+this.velocityY*this.velocityY;
    if(this.state!=="grilled"){
        var aX = this.acceleration*event.delta*(rocketX-this.x)/(1000);
        var aY = this.acceleration*event.delta*(rocketY-this.y)/(1000);
    }
    else{
        aX=0;
        aY=200*this.acceleration*event.delta/1000;
        this.rotation = Math.atan(this.velocityY/600)*360/3.14;
    }
    this.velocityX+=aX;
    this.velocityY += aY;
    //this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    if(speed2>this.topSpeed2){
        this.velocityX=this.velocityX*this.topSpeed2/speed2;
        this.velocityY= this.velocityY*this.topSpeed2/speed2;      
    }
};

AttackBird.prototype.updateCircle = function(){
    this.shape.x=this.x;
    this.shape.y=this.y;
};

AttackBird.prototype.setGrilled = function(){
    this.velocityX = -10;
    this.gotoAndPlay("chicken");
    this.state = "grilled";
    var instance = createjs.Sound.play("grilled");
    instance.volume=1;
};