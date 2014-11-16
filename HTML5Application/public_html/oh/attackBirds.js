    function AttackBird(acc,sheet,current) 
{
    this.initialize(acc,sheet,current);
}
//inheritance
AttackBird.prototype = new createjs.Sprite();
AttackBird.prototype.BirdInit = AttackBird.prototype.initialize;

//props
AttackBird.prototype.state = "normal";
AttackBird.prototype.velocityX = 0;
AttackBird.prototype.velocityY = 0;
AttackBird.prototype.acceleration = 3;
AttackBird.prototype.rad = 25;
AttackBird.prototype.shape = new createjs.Shape();
AttackBird.prototype.temperature = 0;

//constructor
AttackBird.prototype.initialize = function (acc,sheet,current) 
{
    this.BirdInit(sheet,current);
    this.acceleration = acc;
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill("red").dc(0, 0, this.rad);
    this.scaleX = 0.5;
    this.scaleY = 0.5;
}

AttackBird.prototype.update = function (rocketX, rocketY, event) 
{
    if(this.currentAnimation==="falcon")
    {
        this.updateFalcon(rocketX, rocketY,event);
    }
    else
    {
        this.updateSeagull(rocketX,rocketY,event);
    }
}

AttackBird.prototype.updateFalcon = function(rocketX, rocketY, event)
{

    if(this.state==="normal")
    {
        var aX = this.acceleration*event.delta*(rocketX+500-this.x)/(1000);
        var aY = this.acceleration*event.delta*(rocketY-500-this.y)/(1000);
        if(this.y-rocketY-200>0)
        {
            this.state="attacking";
            aX =0;
            aY =0;
        }
    }
    else if(this.state==="attacking")
    {
        aX = this.acceleration*event.delta*(rocketX-this.x)/(1000);
        aY = this.acceleration*event.delta*(rocketY-this.y)/(1000);
        if(this.y-rocketY-100<0)
        {
            this.state="normal";
        }
        
    }
    else if(this.state==="soaring")
    {
        aX = this.acceleration*event.delta*(this.velocityX/2)/(1000);
        aY = this.acceleration*event.delta*(this.velocityY/2)/(1000);
        if(this.velocityX*this.velocityX+this.velocityY*this.velocityY<100)
        {
            this.state="attacking";
        }
        
    }
    else if(this.state==="grilled")
    {
        aX=0;
        aY=200*this.acceleration*event.delta/1000;
    }
    this.velocityX+=aX;
    this.velocityY += aY;
    //this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    var maxSpeed2=100000;
    var speed2 = this.velocityX*this.velocityX+this.velocityY*this.velocityY;
    if(speed2>maxSpeed2)
    {
        this.velocityX=this.velocityX*maxSpeed2/speed2;
        this.velocityY= this.velocityY*maxSpeed2/speed2;      
    }
}

AttackBird.prototype.updateSeagull = function(rocketX, rocketY, event)
{
    var maxSpeed2=100000;
    var speed2 = this.velocityX*this.velocityX+this.velocityY*this.velocityY;
    if(this.state!=="grilled")
    {
        var aX = this.acceleration*event.delta*(rocketX-this.x)/(1000);
        var aY = this.acceleration*event.delta*(rocketY-this.y)/(1000);
    }
    else
    {
        aX=0;
        aY=200*this.acceleration*event.delta/1000;
    }
    this.velocityX+=aX;
    this.velocityY += aY;
    //this.rotation = Math.atan(2*Math.abs(aX)/aY)*360/6.28;
    if(speed2>maxSpeed2)
    {
        this.velocityX=this.velocityX*maxSpeed2/speed2;
        this.velocityY= this.velocityY*maxSpeed2/speed2;      
    }
}

AttackBird.prototype.updateCircle = function()
{
    this.shape.x=this.x;
    this.shape.y=this.y;
}

AttackBird.prototype.setGrilled = function()
{
    this.velocityX = -10;
    this.gotoAndPlay("chicken");
    this.state = "grilled";
    var instance = createjs.Sound.play("grilled");
    instance.volume=1;
}