function AttackBird(acc,collider) 
{
    this.initialize(acc,collider);
}
//inheritance
AttackBird.prototype = new createjs.Shape();
AttackBird.prototype.BirdInit = AttackBird.prototype.initialize;

//props
AttackBird.prototype.state = "normal";
AttackBird.prototype.velocityX = 0;
AttackBird.prototype.velocityY = 0;
AttackBird.prototype.acceleration = 3;
AttackBird.prototype.rad = 25;

//constructor
AttackBird.prototype.initialize = function (acc,collider) 
{
    this.BirdInit();
    this.colliderInstance = collider;
    this.acceleration = acc;
    this.graphics.beginFill("black").dc(0, 0, this.rad);
}

AttackBird.prototype.update = function (rocketX, rocketY, event) 
{
   var maxSpeed2=100000;
    var speed2 = this.velocityX*this.velocityX+this.velocityY*this.velocityY;
    this.velocityX += this.acceleration*event.delta*(rocketX-this.x)/(1000);
    this.velocityY += this.acceleration*event.delta*(rocketY-this.y)/(1000);
    if(speed2>maxSpeed2)
    {
        this.velocityX=this.velocityX*maxSpeed2/speed2;
        this.velocityY= this.velocityY*maxSpeed2/speed2;      
    }
}