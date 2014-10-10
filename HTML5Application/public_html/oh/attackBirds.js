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
   var maxSpeed2=100000;
    var speed2 = this.velocityX*this.velocityX+this.velocityY*this.velocityY;
    var aX = this.acceleration*event.delta*(rocketX-this.x)/(1000);
    var aY = this.acceleration*event.delta*(rocketY-this.y)/(1000);
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