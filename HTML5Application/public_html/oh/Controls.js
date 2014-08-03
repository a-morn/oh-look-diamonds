var Controls = (function(){
    
    var ctrls = {}
    ,up, down, left, right, attack, z,
    catz;
    ctrls.UpPressed = function(){return up;};
    ctrls.DownPressed = function(){return down;};
    ctrls.LeftPressed = function(){return left;};
    ctrls.RightPressed = function(){return right;};
    ctrls.AttackPressed = function(){return attack;};
    ctrls.ZPressed = function(){return z;};    
    
        KEYCODE_W=87;
        KEYCODE_UP=38;
        KEYCODE_DOWN=40;
        KEYCODE_S=83;
        KEYCODE_A=65;
        KEYCODE_D =68;
        KEYCODE_LEFT=37;
        KEYCODE_RIGHT=39;
        KEYCODE_SPACE=32;
        KEYCODE_ENTER = 13;
        KEYCODE_Z = 90;

    ctrls.Init = function(aCatz){        
        down = false;
        up = false;        
        left = false;
        right = false;      
        attack = false;
        catz = aCatz;
        
        document.onkeydown = function (event)
        {
            handleKeyDown(event);
        };
        document.onkeyup = function (event)
        {
             handleKeyUp(event);
        };   
    };
    
    function handleKeyDown (event){
        switch (event.keyCode) {
        case KEYCODE_UP:
                up = true;
            break;
        case KEYCODE_DOWN:
                down = true;
            break;
        case KEYCODE_LEFT: ;
        case KEYCODE_A:            
                left = true;
                catz.x -=5;
            break;
        case KEYCODE_RIGHT: ;
        case KEYCODE_D:
                right = true;
                catz.x +=5;
            break;
        case KEYCODE_SPACE:     
            attack = true;            
            this.presenter.handleAttack("normal"); //should prolly be implemented as 
            //  dispatched event event
            break;
        case KEYCODE_Z:     
            z = true;                        
            this.presenter.handleAttack("pulling");
            break;
        }
    }

    function handleKeyUp (event){             
        switch (event.keyCode) {
        case KEYCODE_UP:
                up = false;
            break;
        case KEYCODE_DOWN:
                down = false;
            break;
        case KEYCODE_LEFT: ;
        case KEYCODE_A:            
                left = false;            
            break;
        case KEYCODE_RIGHT: ;
        case KEYCODE_D:
                right = false;
            break;
        case KEYCODE_SPACE:   
                attack = false;
            break;
        }
    }
    return ctrls;
});