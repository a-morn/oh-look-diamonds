function AttackBird() 
{
    this.initialize();
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
AttackBird.prototype.initialize = function () 
{
    this.BirdInit();
    this.graphics.beginFill("black").dc(0, 0, this.rad);
    //this.regX = this.rad;
    //this.regY = this.rad;
}

AttackBird.prototype.update = function (rocketX, rocketY, event) 
{
    //var d = Math.sqrt(Math.pow((rocketX-this.x),2), Math.pow((rocketY-this.y),2));
    var maxSpeed2=100000;
    var speed2 = this.velocityX*this.velocityX+this.velocityY*this.velocityY;
    this.velocityX += this.acceleration*event.delta*(rocketX-this.x)/(1000);
    this.velocityY += this.acceleration*event.delta*(rocketY-this.y)/(1000);
    if(speed2>maxSpeed2)
    {
        this.velocityX=this.velocityX*maxSpeed2/speed2;
        this.velocityY= this.velocityY*maxSpeed2/speed2;      
    }
    this.x += this.velocityX*event.delta/1000;
    this.y += this.velocityY*event.delta/1000;
}
