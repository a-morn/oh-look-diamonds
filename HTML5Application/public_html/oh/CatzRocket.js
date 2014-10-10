var CatzRocket = (function(){
    var catzRocket = {
    catzRocketContainer: null,
    silouette: null,
    invincibilityCounter:0,    
    hasFrenzy: false,
    diamondFrenzyCharge: 0,
    isWounded: false,
    frenzyCount: 0,
    frenzyTimer: 0,
    frenzyReady: false,
    rocketSound: null,
    catz: null,  
    rocket: null,
    rocketFlame: null,
    catzVelocity: -2,
    limitVelocity: 30,
    catzStateEnum: {
        Normal : 0,
        Uploop : 1,
        Downloop : 2,
        SecondUploop : 3,
        SecondDownloop : 4,
        Slingshot : 5,
        TerminalVelocity : 6,
        EmergencyBoost : 7,
        SlammerReady : 8,
        Slammer : 9,
        Frenzy : 10,
        FrenzyUploop : 11
    },
    catzState: 0};
    catzRocket.Init = function()
    {
        catzRocket.catzRocketContainer = new createjs.Container();
    };
    return catzRocket;
}());

