var House = (function(){
    var house = {
        house: null,
        houseView: null,        
        crashRocket: null,
        hobo: null,
        catz: null,
        dialogID: 0,
        wick: null,
        diamondHouse: null,
        hoboSpeach: null,
        catzSpeach: null,
        hoboCatSound1: null,
        hoboCatSound2: null,
        catzSound1: null,
        catzSound2: null,
        wickActive:false,
        hoboActive:true,
        wickExclamation: null,
        hoboExclamation: null,
        hoboDialogNumber:0,
        choice1: null,
        choice2: null,
        choice3: null,
        choices:[],
        choiceIDs:[]    
    };
    house.Init = function()
    {        
        house.houseView = new createjs.Container();
    };
    house.gotoHouseView = function(gameStats)
    {
        var hoboCatzProgression = gameProgressionJSON.HoboCatz;           
        for(i=0;i<hoboCatzProgression.length;i++)
        {                        
        conditionLoop:
            if(!hoboCatzProgression[i].HasHappend || hoboCatzProgression[i].ShouldReoccur && 
                hoboCatzProgression[i].Chance>Math.random())
            {                                                
                for(j=0; j<hoboCatzProgression[i].Conditions.length; j++)       
                {
                    if(hoboCatzProgression[i].Conditions[j].ConditionType === "Score")
                    {                                        
                        if(hoboCatzProgression[i].Conditions[j].OperatorType === "LargerThan")
                        {                        
                            if(gameStats.score>hoboCatzProgression[i].Conditions[j].Score)
                            {
                                //pass                                
                            }
                            else
                            {
                                break conditionLoop;
                            }
                        }
                        else if(hoboCatzProgression[i].Conditions[j].OperatorType === "LessThan")
                        {                        
                            if(gameStats.score<hoboCatzProgression[i].Conditions[j].Score)
                            {
                                //pass
                            }
                            else
                            {
                                //next iter
                                break conditionLoop;
                            }
                        }
                    }
                    else if(hoboCatzProgression[i].Conditions[j].ConditionType === "State")
                    {                        
                        if(gameStats[hoboCatzProgression[i].Conditions[j].State] === hoboCatzProgression[i].Conditions[j].On)
                        {                            
                            //pass
                        }
                        else
                        {
                            break conditionLoop;
                        }
                    }
                    //If all conditions have been passed                    
                    if(j===hoboCatzProgression[i].Conditions.length-1)
                    {                        
                        house.hoboDialogNumber = hoboCatzProgression[i].ConversationNumber;
                        house.hoboActive = true;
                        house.wickActive = false;
                        house.dialogID = 0;
                        hoboCatzProgression[i].HasHappend = "yes";
                        return;
                    }
                }
            }
        }  
        house.updateHouse(gameStats);
    };
    
    house.hoboDialog = function(gameStats, text, gotoGameView)
    {     
        var dialog = dialogJSON.HoboCatz[house.hoboDialogNumber];                   
        if(dialog.dialog[house.dialogID])
        {            
            if(dialog.dialog[house.dialogID].Triggers)
            {
                for(i =0; i<dialog.dialog[house.dialogID].Triggers.length; i++)
                {
                    if(dialog.dialog[house.dialogID].Triggers[i].Stat === "score")
                    {
                        gameStats.score += dialog.dialog[house.dialogID].Triggers[i].Value;
                        //Should be a "cash-withdrawn"-animation triggered here
                        text.text = gameStats.score;
                    }
                    else
                    {
                        gameStats[dialog.dialog[house.dialogID].Triggers[i].Stat]= dialog.dialog[house.dialogID].Triggers[i].Value;                                
                    }
                }
            }
            
            if (dialog.dialog[house.dialogID].Who === "Catz")
            {
                house.catzSpeach.text = dialog.dialog[house.dialogID].What;            
                house.catzSpeach.alpha = 1;
                house.catzSound1.play();
            }
            else if (dialog.dialog[house.dialogID].Who === "Hobo-Cat")
            {
                house.hoboSpeach.text = dialog.dialog[house.dialogID].What;
                house.hoboSpeach.alpha = 1;
                house.hoboCatSound1.play();  
            }                             
            
            if(dialog.dialog[house.dialogID].Choice)
            {                                
                for (i=0;i<dialog.dialog[house.dialogID].Choices.length;i++)
                {                    
                    house.choices[i].text=dialog.dialog[house.dialogID].Choices[i].text;
                    house.choices[i].alpha = 1;
                    house.choiceIDs[i] = dialog.dialog[house.dialogID].Choices[i].ChoiceID;                                        

                    //fulfixen                    
                    if(i===0)
                    {
                        house.choices[i].addEventListener("click",
                                function()
                                {                             
                                    house.dialogID = house.choiceIDs[0];                                                                                                

                                    house.choice1.alpha = 0;
                                    house.choice2.alpha = 0;
                                    house.choice3.alpha = 0;
                                    hoboDialog(gameStats, text);
                                }
                            );
                    }
                    if(i===1)
                    {                        
                        house.choices[i].addEventListener("click",
                                function()
                                {                             
                                    house.dialogID = house.choiceIDs[1];                                                                                                                                    
                                    house.choice1.alpha = 0;
                                    house.choice2.alpha = 0;
                                    house.choice3.alpha = 0;
                                    hoboDialog(gameStats, text);
                                }
                            );
                    }
                }                
            }
            else
            {                                
                if(!dialog.dialog[house.dialogID].End)
                {
                    house.dialogID = dialog.dialog[house.dialogID].NextID;                
                }
            }
            if(dialog.dialog[house.dialogID].End)
            {
                //This doesn't work right as activateWick is called from gotoHouseView
                house.wickActive = true;
                house.hoboActive = false;
                house.wick.addEventListener("click",(function(){house.lightFuse(gameStats,gotoGameView);}));                                
                
                //To shift to idle speach. Should be implemented smarter.
                house.updateHouse(gameStats);
            }
        }
        
        else
        {
            house.hoboSpeach.text = dialog.idle.What;
            house.hoboSpeach.alpha = 1;            
        }
        
        
    };
    
    house.lightFuse = function(rocketSong, gotoGameView)
    {        
        //if song hasn't started yet
//        if(rocketSong.getPosition()<100)
//        {
//            rocketSong.play();
//        }
        house.wick.x-=15;
        house.wick.gotoAndPlay("cycle");
        house.wick.removeAllEventListeners();        
        house.wick.addEventListener("animationend",(function(){gotoGameView();}));
        house.catzSpeach.text ="";
        house.hoboSpeach.text ="";
    };        
    
    house.updateHouse = function(gameStats)
    {
        var numberOfHouses = gameStats.HoboCatHouseBuilt + gameStats.OrphanageBuilt +
                gameStats.RehabBuilt;        
        if(numberOfHouses===1)
        {
            house.diamondHouse.alpha=1;
            house.diamondHouse.gotoAndPlay("first");
        }
        else if(numberOfHouses===2){
            house.diamondHouse.alpha=1;
            house.diamondHouse.gotoAndPlay("second");
        }
        else if(numberOfHouses===3){
            house.diamondHouse.alpha=1;            
            house.diamondHouse.gotoAndPlay("third");            
        }
        else{
            house.diamondHouse.alpha=0;
        }

    };
    
    house.gotoHouseViewNormal = function(gameStats, stage, gameView,text, diamondShardCounter, gameListener, rocketSong, gotoGameView)
    {
        house.gotoHouseView(gameStats);
        house.wick.x=-210;
        house.wick.removeAllEventListeners();
        house.wick.gotoAndPlay("still");
        if(house.wickActive)
        {            
            house.wick.addEventListener("click",(function(){house.lightFuse(rocketSong, gotoGameView);}));
        }
        
        house.hobo.addEventListener("click",(function(){house.hoboDialog(gameStats, text, gotoGameView);}));
        
        stage.removeAllEventListeners();
        stage.removeChild(gameView,text, diamondShardCounter);
        stage.addChild(house.houseView);
        stage.update();
        createjs.Ticker.setFPS(20);
        createjs.Ticker.off("tick", gameListener);        
    };
    
    house.gotoHouseViewFromAbove = function(gameStats, catzRocket)
    {
        house.gotoHouseView(gameStats);
        house.crashRocket.alpha=1;
        house.crashRocket.x=315-400*Math.cos(catzRocket.catzRocketContainer.rotation*6.28/360);
        house.crashRocket.y =310-400*Math.sin(catzRocket.catzRocketContainer.rotation*6.28/360);
        house.crashRocket.rotation=catzRocket.catzRocketContainer.rotation;
        createjs.Tween.get(house.crashRocket)
                .to({x:315, y:310},200)
                .wait(1500)
                .to({x:315, y:310, rotation:-30},800, createjs.Ease.quadIn);
    };
    
    house.gotoHouseViewFromBelow = function(gameStats, catzRocket)
    {
        house.gotoHouseView(gameStats);
        house.crashRocket.alpha=1;
        house.crashRocket.x=315-400*Math.cos(catzRocket.catzRocketContainer.rotation*6.28/360);
        house.crashRocket.y =310-400*Math.sin(catzRocket.catzRocketContainer.rotation*6.28/360);
        house.crashRocket.rotation=catzRocket.catzRocketContainer.rotation;
        createjs.Tween.get(house.crashRocket)
                .to({x:315, y:310},200)
                .wait(1500)
                .to({x:315, y:310, rotation:-30},800, createjs.Ease.quadIn);
    };           
    
    house.activateWick = function(gameStats, gotoGameView)
    {
        house.wickActive = true;
        house.wick.addEventListener("click",(function(){house.lightFuse(gameStats, gotoGameView);}));    
    };
    
    return house;
}());
