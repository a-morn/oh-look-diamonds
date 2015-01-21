var House = (function(){
    var house = {
        house: null,
        houseView: null,        
        crashRocket: null,
        hobo: null,
        timmy: null,
        priest: null,
        currentCharacter: "hoboCat",
        mouseHobo: null,
        mouseTimmy: null,
        mousePriest :null,
        mouseChar: {},
        mouseRocket: null,
        catz: null,
        hoboDialogID:0,
        timmyDialogID:0,
        priestDialogID:0,
        characterdialogID: [],
        cricketsSound: null,
        wick: null,
        oh: null,
        look: null,
        diamonds: null,
        diCont : null,
        lookingAtStarsButton: null,
        wickLight: null,
        hoboCatHouse: null,
        rehab: null,
        orphanage: null,     
        university: null,
        diamondHouseCont: null,
        diamondHouseArray: [],
        houseInfoCont: null,
        houseInfo : {},
        characterSpeach: null,
        catzSpeach: null,
        hoboCatSound1: null,
        hoboCatSound2: null,
        catzSound1: null,
        catzSound2: null,
        wickActive:false,
        hoboActive:true,
        timmyActive:false,
        priestActive:false,
        characterActive: {},
        wickExclamation: null,
        hoboExclamation: null,
        hoboDialogNumber:0,
        timmyDialogNumber:0,
        priestDialogNumber:0,
        characterDialogNumber: {},
        choice1: null,
        choice2: null,
        choice3: null,
        choices:[],
        choiceIDs:[],
        gameStats : null,
        startGameStats : null,
        rsText : null,
        osText : null,
        usText : null
    };
    house.Init = function()
    {        
        house.houseView = new createjs.Container();
        house.characterActive = {"hoboCat":house.hoboActive, "timmy":house.timmyActive, "priest":house.priestActive};        
        house.characterDialogNumber = {"hoboCat":house.hoboDialogNumber, "timmy":house.timmyDialogNumber, "priest":house.priestDialogNumber};
        house.characterdialogID = {"hoboCat": house.hoboDialogID, "timmy" : house.timmyDialogID, "priest" : house.priestDialogID};
    };
    house.gotoHouseView = function(gameStats, diamondCounterText)
    {
        house.rsText.text = gameStats.rehab.slots;
        house.osText.text = gameStats.orphanage.slots;
        house.usText.text = gameStats.university.slots;
        house.gameStats = gameStats;
        house.startGameStats = $.extend( true, {}, gameStats );
        house.hobo.alpha = 0;
        house.timmy.alpha = 0;
        house.priest.alpha = 0;
        
        house.cricketsSound = createjs.Sound.play("crickets",{loop:-1});
        house.cricketsSound.volume=0.1;
        
        var hobDiaNo = house.UpKeep(gameStats, diamondCounterText);
        //If not fail upkeep, check for other dialog
        if(hobDiaNo === -1) {
                var hobDiaNo = house.progressionCheck("hoboCat", gameStats);                
        }
        
        if(hobDiaNo !== -1) {
            house.currentCharacter = "hoboCat";
            house.hobo.alpha = 1;
            house.characterDialogNumber.hoboCat = hobDiaNo;           
            house.hoboActive = true;
            house.hoboExclamation.alpha=0.5;            
            house.characterdialogID["hoboCat"] = 0;
        } 
        //If no hobo dialog, check for timmy dialog
        else {  
            var timmyDiaNo = house.progressionCheck("timmy", gameStats);
            if(timmyDiaNo !== -1) {
                house.currentCharacter = "timmy";
                house.timmy.alpha = 1;
                house.characterDialogNumber.timmy = timmyDiaNo;
                house.timmyActive = true;                
                house.characterdialogID["timmy"] = 0;
                house.hoboExclamation.alpha=0.5;
            }
            //If no timmy dialog, cehck for priest dialog
            else {
                var priestDiaNo = house.progressionCheck("priest", gameStats);
                if(priestDiaNo !== -1) {
                    house.currentCharacter = "priest";
                    house.priest.alpha = 1;
                    house.characterDialogNumber.priest= priestDiaNo;
                    house.priestActive = true;
                    house.characterdialogID["priest"] = 0;
                    house.hoboExclamation.alpha=0.5;
                }
                
                else {
                    house.hobo.alpha = 1;
                    house.currentCharacter = "hoboCat";
                }
            }
        }
        
        house.updateHouse(gameStats);
    };
    
    house.progressionCheck = function(cat, gameStats) {
        var catProgression = gameProgressionJSON[cat];
        for(i=0;i<catProgression.length;i++)
        {                        
        conditionLoop:
            if(!catProgression[i].HasHappend || catProgression[i].ShouldReoccur && 
                catProgression[i].Chance>Math.random())
            {                                                
                for(j=0; j<catProgression[i].Conditions.length; j++)       
                {
                    var condition = catProgression[i].Conditions[j];
                    if(condition.ConditionType === "Score")
                    {                                        
                        if(condition.OperatorType === "LargerThan")
                        {                        
                            if(gameStats.score>condition.Score)
                            {
                                //pass                                
                            }
                            else
                            {
                                break conditionLoop;
                            }
                        }
                        else if(condition.OperatorType === "LessThan")
                        {                        
                            if(gameStats.score<condition.Score)
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
                    else if(condition.ConditionType === "buildingState")
                    {                     
                        if(condition.state === "builtOnRound") {
                            if(gameStats[condition.building][condition.state] + condition.on <gameStats.currentRound) {
                           //pass     
                            }
                           else {
                               break conditionLoop;
                           }
                        }
                        else if(gameStats[condition.building][condition.state] === condition.on)
                        {                            
                            //pass
                        }
                        else
                        {
                            break conditionLoop;
                        }
                    }
                    
                    else if (condition.ConditionType === "state")
                    {
                        if(gameStats[condition.state] === condition.on)
                        {
                            //pass
                        }
                        else
                        {
                            break conditionLoop;
                        }
                    }
                    //If all conditions have been passed                    
                    if(j===catProgression[i].Conditions.length-1)
                    {       
                        house.currentCharacter = cat;
                        house.characterActive[house.currentCharacter] = true;
                        house.wickActive = false;                        
                        catProgression[i].HasHappend = "yes";
                        return catProgression[i].ConversationNumber;
                    }
                }
            }
        }
        return -1;
    };
    
    house.characterDialog = function(gameStats, diamondCounterText, gotoGameView)
    {             
        var dialog = dialogJSON[house.currentCharacter][house.characterDialogNumber[house.currentCharacter]];           
        if(dialog.dialog[house.characterdialogID[house.currentCharacter]])
        {
            if(dialog.dialog[house.characterdialogID[house.currentCharacter]].Triggers)
            {                
                for(i =0; i<dialog.dialog[house.characterdialogID[house.currentCharacter]].Triggers.length; i++)
                {                    
                    var value =dialog.dialog[house.characterdialogID[house.currentCharacter]].Triggers[i].Value;
                    var stat = dialog.dialog[house.characterdialogID[house.currentCharacter]].Triggers[i].Stat;
                    
                    if(stat === "score")
                    {
                        house.SetScore(value, gameStats, diamondCounterText);                        
                    }
                    else if (stat=== "kills")
                    {
                        gameStats.kills += value;
                    }
                    else if (stat === "isBuilding") {
                        gameStats[value].isBuilding = true;
                        gameStats.CurrentlyBuilding = true;
                    }
                    
                    else if (stat === "built")
                    {
                        gameStats[value].isBuilding = false;
                        gameStats[value].built = true;
                        gameStats[value].builtOnRound = gameStats.currentRound;
                        gameStats.CurrentlyBuilding = false;
                        //SET ALPHA = 1 HERE                        
                        house.diamondHouseArray[value].alpha = 1;
                    }
                    
                    else if (stat === "addOn")
                    {
                        var building = dialog.dialog[house.characterdialogID[house.currentCharacter]].Triggers[i].Building;
                        house.diamondHouseArray[building].gotoAndPlay(value);
                        gameStats[building][value]= true;
                    }
                    else
                    {
                        gameStats[dialog.dialog[house.characterdialogID[house.currentCharacter]].Triggers[i].Stat]= value;                                
                    }                    
                }
            }
            
            if (dialog.dialog[house.characterdialogID[house.currentCharacter]].Who === "Catz")
            {
                house.catzSpeach.text = dialog.dialog[house.characterdialogID[house.currentCharacter]].What;            
                house.catzSpeach.alpha = 1;
                house.catzSound1.play();
            }
            else if (dialog.dialog[house.characterdialogID[house.currentCharacter]].Who === "Hobo-Cat")
            {
                house.characterSpeach.text = dialog.dialog[house.characterdialogID[house.currentCharacter]].What;
                house.characterSpeach.alpha = 1;
                house.hoboCatSound1.play();  
            }                             
            
            else if (dialog.dialog[house.characterdialogID[house.currentCharacter]].Who === "Timmy")
            {
                house.characterSpeach.text = dialog.dialog[house.characterdialogID[house.currentCharacter]].What;
                house.characterSpeach.alpha = 1;
                //Should be timmy sound
                house.hoboCatSound1.play();  
            }     
            
            else if (dialog.dialog[house.characterdialogID[house.currentCharacter]].Who === "Priest")
            {
                house.characterSpeach.text = dialog.dialog[house.characterdialogID[house.currentCharacter]].What;
                house.characterSpeach.alpha = 1;
                //Should be priest sound
                house.hoboCatSound1.play();  
            }
            
            if(dialog.dialog[house.characterdialogID[house.currentCharacter]].Choice)
            {                                                
                for (var i=0;i<dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices.length;i++)
                {           
                    //THis needs fixin
                    if(i===0 && house.currentCharacter === "hoboCat")
                    {
                        house.choices[i].text=dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].text;
                        house.choices[i].alpha = 1;
                        house.choiceIDs[i] = dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].ChoiceID;                                                                                

                        house.choices[i].addEventListener("click",
                            function()
                            {                             
                                house.characterdialogID[house.currentCharacter] = house.choiceIDs[0];                                                                                                

                                house.choice1.alpha = 0;
                                house.choice2.alpha = 0;
                                house.choice3.alpha = 0;
                                house.choices[0].removeAllEventListeners();
                                house.choices[1].removeAllEventListeners();
                                house.characterDialog(gameStats, diamondCounterText, gotoGameView);
                            });                        
                    }
                    
                    if(i===1 && house.currentCharacter === "hoboCat")
                    {
                        house.choices[i].text=dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].text;
                        house.choices[i].alpha = 1;
                        house.choiceIDs[i] = dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].ChoiceID;                                                                                

                        house.choices[i].addEventListener("click",
                            function()
                            {                             
                                house.characterdialogID["hoboCat"] = house.choiceIDs[1];                                                                                                

                                house.choice1.alpha = 0;
                                house.choice2.alpha = 0;
                                house.choice3.alpha = 0;                             
                                house.choices[0].removeAllEventListeners();
                                house.choices[1].removeAllEventListeners();
                                house.characterDialog(gameStats, diamondCounterText, gotoGameView);                                
                            });                        
                    }
                    
                    if(i===0 && house.currentCharacter === "timmy")
                    {
                        house.choices[i].text=dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].text;
                        house.choices[i].alpha = 1;
                        house.choiceIDs[i] = dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].ChoiceID;                                                                                

                        house.choices[i].addEventListener("click",
                            function()
                            {                             
                                house.characterdialogID["timmy"] = house.choiceIDs[0];                                                                                                

                                house.choice1.alpha = 0;
                                house.choice2.alpha = 0;
                                house.choice3.alpha = 0;
                                house.choices[0].removeAllEventListeners();
                                house.choices[1].removeAllEventListeners();
                                house.characterDialog(gameStats, diamondCounterText,gotoGameView);                                
                            });                        
                    }
                    
                    if(i===1 && house.currentCharacter ==="timmy")
                    {
                        house.choices[i].text=dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].text;
                        house.choices[i].alpha = 1;
                        house.choiceIDs[i] = dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].ChoiceID;                                                                                

                        house.choices[i].addEventListener("click",
                            function()
                            {                             
                                house.characterdialogID["timmy"] = house.choiceIDs[1];                                                                                                

                                house.choice1.alpha = 0;
                                house.choice2.alpha = 0;
                                house.choice3.alpha = 0;                             
                                house.choices[0].removeAllEventListeners();
                                house.choices[1].removeAllEventListeners();
                                house.characterDialog(gameStats, diamondCounterText, gotoGameView);
                            });                        
                    }
                    
                    if(i===0 && house.currentCharacter === "priest")
                    {
                        house.choices[i].text=dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].text;
                        house.choices[i].alpha = 1;
                        house.choiceIDs[i] = dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].ChoiceID;                                                                                

                        house.choices[i].addEventListener("click",
                            function()
                            {                             
                                house.characterdialogID["priest"] = house.choiceIDs[0];                                                                                                

                                house.choice1.alpha = 0;
                                house.choice2.alpha = 0;
                                house.choice3.alpha = 0;
                                house.choices[0].removeAllEventListeners();
                                house.choices[1].removeAllEventListeners();
                                house.characterDialog(gameStats, diamondCounterText,gotoGameView);                                
                            });                        
                    }
                    
                    if(i===1 && house.currentCharacter ==="priest")
                    {
                        house.choices[i].text=dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].text;
                        house.choices[i].alpha = 1;
                        house.choiceIDs[i] = dialog.dialog[house.characterdialogID[house.currentCharacter]].Choices[i].ChoiceID;                                                                                

                        house.choices[i].addEventListener("click",
                            function()
                            {                             
                                house.characterdialogID["priest"] = house.choiceIDs[1];                                                                                                

                                house.choice1.alpha = 0;
                                house.choice2.alpha = 0;
                                house.choice3.alpha = 0;                             
                                house.choices[0].removeAllEventListeners();
                                house.choices[1].removeAllEventListeners();
                                house.characterDialog(gameStats, diamondCounterText, gotoGameView);
                            });                        
                    }
                    
                }                
            }
            else
            {                     
                if(!dialog.dialog[house.characterdialogID[house.currentCharacter]].End)
                {
                    house.characterdialogID[house.currentCharacter] = dialog.dialog[house.characterdialogID[house.currentCharacter]].NextID;                
                }
                else
                {
                    house.characterActive[house.currentCharacter] = false;
                    house.hoboExclamation.alpha=0;
                    house.wickActive = true;
                    
                    
                    if(!createjs.Tween.hasActiveTweens(house.wickExclamation)){
                        createjs.Tween.removeAllTweens(house.wickExclamation);
                        createjs.Tween.get(house.wickExclamation).wait(4000).to({alpha:1},4000);
                    }
                    createjs.Tween.removeAllTweens(house.wick);
                    createjs.Tween.get(house.wick).to({x:-210},1200,createjs.Ease.quadInOut)
                            .call(function () {house.activateWick(gotoGameView)});
                    //To shift to idle speach. Should be implemented smarter.
                    house.updateHouse(gameStats);
                    house.characterdialogID[house.currentCharacter]+=100;                
                }                
            }
        }
        
        else
        {
            house.characterSpeach.text = dialog.idle.what;
            house.characterSpeach.alpha = 1;            
        }
        
        
    };
    
    house.lightFuse = function(gotoGameView)
    {        
        if(house.wickActive)
        {
            createjs.Sound.play("wickSound");
            house.mouseRocket.alpha = 0;
            house.wickLight.alpha = 0;
            house.wick.x=-225;
            house.wick.gotoAndPlay("cycle");
            house.wick.removeAllEventListeners();        
            house.wick.addEventListener("animationend",gotoGameView);
            house.catzSpeach.text ="";
            house.characterSpeach.text ="";
        }
    };    
    
    house.highlightHobo = function()
    {                       
        if(house.characterActive[house.currentCharacter])
        {
            house.hoboExclamation.alpha = 1;
            house.mouseChar[house.currentCharacter].alpha = 1;
        }
    };
    
    house.downlightHobo = function()
    {
        house.mouseChar[house.currentCharacter].alpha = 0;
        
        if(house.characterActive[house.currentCharacter])
        {
            house.hoboExclamation.alpha=0.5;
        }
        else
        {
            house.hoboExclamation.alpha=0;
        }
    };
    
    house.highlightRocket = function()
    {
        house.mouseRocket.alpha = 1;
        house.wickLight.alpha = 0.7;
    };
    
    house.downlightRocket = function()
    {
        house.mouseRocket.alpha = 0;
        house.wickLight.alpha = 0;
    };
    
    house.updateHouse = function(gameStats)
    {               
    };
    
    house.addCharacterEvents = function(gameStats, diamondCounterText, gotoGameView)
    {        
        house.hoboExclamation.alpha=0.5;
        house.hobo.addEventListener("click",(function(){house.characterDialog(gameStats, diamondCounterText, gotoGameView);}));
        house.hobo.addEventListener("mouseover", house.highlightHobo);
        house.hobo.addEventListener("mouseout", house.downlightHobo);
        
        house.timmy.addEventListener("click",(function(){house.characterDialog(gameStats, diamondCounterText, gotoGameView);}));
        house.timmy.addEventListener("mouseover", house.highlightHobo);
        house.timmy.addEventListener("mouseout", house.downlightHobo);
        
        house.priest.addEventListener("click",(function(){house.characterDialog(gameStats, diamondCounterText, gotoGameView);}));
        house.priest.addEventListener("mouseover", house.highlightHobo);
        house.priest.addEventListener("mouseout", house.downlightHobo);
    };
    
    house.addHouseEvents = function()
    {                
        house.rehab.addEventListener("mouseover",(function(){house.houseInfo("rehab");}));
        house.orphanage.addEventListener("mouseover",(function(){house.houseInfo("orphanage");}));
        house.university.addEventListener("mouseover",(function(){house.houseInfo("university");}));
    };
    
    house.houseInfo = function(houseName){
        house.houseInfo[houseName].alpha = 1;
    }
    
    house.gotoHouseViewNormal = function(gameStats, stage, gameView,diamondCounterText, diamondShardCounter, muteButton, gameListener, gotoGameView)
    {        
        house.hoboExclamation.alpha=0;
        house.gotoHouseView(gameStats, diamondCounterText);
        house.wick.x=-120;
        house.wick.removeAllEventListeners();
        house.wick.gotoAndPlay("still");
        stage.removeAllEventListeners();
        if(house.wickActive)
        {
            house.wick.x=-210;
            house.wick.addEventListener("click",(function(){house.lightFuse(gotoGameView);}));
            house.wick.addEventListener("mouseover", house.highlightRocket);
            house.wick.addEventListener("mouseout", house.downlightRocket);
        }
        house.hobo.x=-300;
        house.hobo.y=270;
        stage.removeChild(gameView,diamondCounterText, diamondShardCounter,muteButton);
        stage.addChild(house.houseView);
        stage.update();
        createjs.Ticker.setFPS(20);
        createjs.Ticker.off("tick", gameListener);        
    };
    
    house.gotoHouseViewWithRocket = function(gameStats, catzRocket, gotoGameView, diamondCounterText)
    {        
        
        house.gotoHouseView(gameStats, diamondCounterText);
        house.crashRocket.alpha=1;
        house.crashRocket.x=315-400*Math.cos(catzRocket.catzRocketContainer.rotation*6.28/360);
        house.crashRocket.y =310-400*Math.sin(catzRocket.catzRocketContainer.rotation*6.28/360);
        house.crashRocket.rotation=catzRocket.catzRocketContainer.rotation;        
        createjs.Tween.get(house.crashRocket)
                .to({x:315, y:310},200)
                .wait(1500)
                .to({x:315, y:310, rotation:-30},800, createjs.Ease.quadIn); 
        house.catz.x = 360;
        house.catz.y = 370;
        createjs.Tween.get(house.catz)
                .wait(800)
                .to({x:390, y:350, rotation:10},250)
                .to({x:330, y:330, rotation:-10},250)
                .to({x:390, y:310, rotation:10},250)
                .to({x:330, y:290, rotation:-10},250)
                .to({x:360, y:270, rotation:0},250)
                ;
    };    
    
    house.gotoHouseViewWithoutRocket = function(gameStats, catzRocket, gotoGameView, diamondCounterText)
    {
        house.gotoHouseView(gameStats, diamondCounterText);
        house.catz.x=300-400*Math.cos(catzRocket.catzRocketContainer.rotation*6.28/360);
        house.catz.y =370-400*Math.sin(catzRocket.catzRocketContainer.rotation*6.28/360);
        house.catz.gotoAndPlay("flying");
        house.catz.rotation=catzRocket.catzRocketContainer.rotation+90;
        createjs.Tween.get(house.catz)
                .to({x:300, y:370},200)
                .call(house.catz.gotoAndPlay,["cycle"])
                .wait(800)
                .to({x:390, y:350, rotation:10},250)
                .to({x:330, y:330, rotation:-10},250)
                .to({x:390, y:310, rotation:10},250)
                .to({x:330, y:290, rotation:-10},250)
                .to({x:360, y:270, rotation:0},250);
        house.crashRocket.alpha=1;
        house.crashRocket.x=315;
        house.crashRocket.y=910;
        house.crashRocket.rotation=-90;
        createjs.Tween.get(house.crashRocket)
                .wait(1200)
                .to({x:315, y:310},500)
                .to({x:315, y:310, rotation:-30},800, createjs.Ease.quadIn);
    };           
    
    house.activateWick = function(gotoGameView)
    {   
        house.wick.addEventListener("click",(function(){house.lightFuse(gotoGameView); house.calculateApproval();}));
        house.wick.addEventListener("mouseover", house.highlightRocket);
        house.wick.addEventListener("mouseout", house.downlightRocket);                
    };
    
    house.UpKeep = function (gameStats, diamondCounterText){
        var sum = 0;
        sum =
            gameStats.hoboCatHouse.built * 1 +
            gameStats.orphanage.built * gameStats.orphanage.slots * 3 +  gameStats.orphanage.youthCenter * 5 + gameStats.orphanage.summerCamp * 5  +
            gameStats.rehab.built * gameStats.rehab.slots * 5 + gameStats.rehab.hospital * 10 + gameStats.rehab.phychiatricWing *5 + gameStats.rehab.monastery * (-5) +
            gameStats.university.built * gameStats.university.slots * 15 + gameStats.university.rocketUniversity * 30;
        if(gameStats.score < sum) {
            house.SetScore(-gameStats.score, gameStats, diamondCounterText);
            gameStats.score = 0;
            if(true) {
                return 11;
            }            
        }
        else {
            house.SetScore(-sum, gameStats, diamondCounterText);
            return -1;
        }
    };
    
    house.SetScore = function (value, gameStats, diamondCounterText){
        gameStats.score += value;
        //Should be a "cash-withdrawn"-animation triggered here
        if(gameStats.score<10)
        {
            diamondCounterText.text="000"+gameStats.score;
        }
        else if(gameStats.score<100)
        {
            diamondCounterText.text="00"+gameStats.score;
        }
        else if(gameStats.score<1000)
        {
            diamondCounterText.text="0"+gameStats.score;
        }
        else if(gameStats.score<10000)
        {
            diamondCounterText.text=gameStats.score;
        }
        else
        {
            diamondCounterText.text="alot";
        }                        
    };
    
    house.calculateApproval = function () {
        var deltaOrph = house.startGameStats.orphanage.slots - house.gameStats.orphanage.slots;
        var deltaRehab = house.startGameStats.rehab.slots - house.gameStats.rehab.slots;
        var deltaUni = house.startGameStats.university.slots - house.gameStats.university.slots;
        
        if(deltaOrph>0)
        {
            house.gameStats.kittens.approvalRating += 5 * deltaOrph;
            house.gameStats.villagers.approvalRating -= 1 * deltaOrph;
            house.gameStats.catParty.approvalRating -= 3 * deltaOrph;
        }
        else if (deltaOrph < 0)
        {
            house.gameStats.kittens.approvalRating -= 4 * deltaOrph;
            house.gameStats.villagers.approvalRating +=1 * deltaOrph;
            if(deltaOrph <= -10){
                house.gameStats.catParty.approvalRating +=1 * deltaOrph;
            }
            else {
                house.gameStats.catParty.approvalRating +=3 * deltaOrph;
            }                        
        }
        
        if(deltaRehab>0)
        {
            house.gameStats.kittens.approvalRating += 2 * deltaRehab;
            if(house.gameStats.rehab.hospital) {
                house.gameStats.villagers.approvalRating += 5 * deltaRehab;
                house.gameStats.catParty.approvalRating -= 2 * deltaRehab;
            }
            else {
                house.gameStats.villagers.approvalRating -= 2 * deltaRehab;
                house.gameStats.catParty.approvalRating -= 5 * deltaRehab;
            }            
        }
        
        else if (deltaRehab < 0)
        {
            house.gameStats.kittens.approvalRating -= 2 * deltaRehab;
            if(house.gameStats.rehab.hospital) {
                if(deltaRehab <= -10){
                    house.gameStats.catParty.approvalRating += 3 * deltaRehab;
                }
                else {
                    house.gameStats.catParty.approvalRating += 1 * deltaRehab;
                }                        
                house.gameStats.villagers.approvalRating -= 5 * deltaRehab;                
            }
            else {
                house.gameStats.villagers.approvalRating += 1 * deltaRehab;
                if(deltaRehab <= -10){
                    house.gameStats.catParty.approvalRating += 5 * deltaRehab;
                }
                else {
                    house.gameStats.catParty.approvalRating += 2 * deltaRehab;
                }                                        
            }            
        }
        
        if(deltaUni>0)
        {            
            house.gameStats.villagers.approvalRating += 5 * deltaUni;
            if(house.gameStats.university.rocketUniversity) {
                house.gameStats.kittens.approvalRating += 10 * deltaUni;                
                house.gameStats.catParty.approvalRating -= 5 * deltaUni;
            }
            else {
                house.gameStats.kittens.approvalRating += 5 * deltaUni;
                house.gameStats.catParty.approvalRating -= 3 * deltaUni;
            }            
        }
        
        else if (deltaUni < 0)
        {
            house.gameStats.villagers.approvalRating -= 5 * deltaUni;
            if(house.gameStats.university.rocketUniversity) {
                house.gameStats.kittens.approvalRating -= 20 * deltaUni;
                house.gameStats.catParty.approvalRating += 2 * deltaUni;
            }
            else {
                house.gameStats.kittens.approvalRating += 10 * deltaUni;
                house.gameStats.catParty.approvalRating += 1 * deltaUni;
            }            
        }                
    };
    
    return house;
}());

