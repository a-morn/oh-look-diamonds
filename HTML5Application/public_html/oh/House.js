var House = (function(){
    var house = {
        house: null,
        houseView: null,        
        crashRocket: null,
        hobo: null,
        timmy: null,
        priest: null,
        subtractedDiamond: null,
        currentCharacter: "hoboCat",
        mouseHobo: null,
        mouseTimmy: null,
        mousePriest :null,
        mouseChar: {},
        mouseRocket: null,
        catz: null,       
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
        rsText : null,
        osText : null,
        usText : null,
        addOnTextOrphanage1 : null,
        addOnTextOrphanage2 : null,
        addOnRehabText1 : null,
        addOnRehabText2 : null,
        displayedScore : null,
        deltaOrph : 0,
        deltaRehab : 0,
        deltaUniversity : 0,
        bust : 0,  
        wickExclamation : null,
        characterExclamation : null,
        choiceIDs : [],
        choices : [],
        choice1 : null,
        choice2 : null,
        choice3 : null
    };
    
    var
        tutorialTexts,
        deltaUniversity = 0,
        deltaOrph = 0,
        deltaRehab = 0,   
        startGameStats,                
        priestDialogNumber = 0,
        timmyDialogNumber = 0,
        hoboDialogNumber = 0,
        
        characterDialogNumber = {},
        gameStats,
        characterActive = {},        
        wickActive = false,
        hoboActive = true,
        timmyActive = false,
        priestActive = false,
        hoboDialogID = 0,
        timmyDialogID = 0,
        priestDialogID = 0,
        characterdialogID =  [],
        currentCharacter = "hoboCat";
        
    house.Init = function(aTutorialTexts)
    {        
        tutorialTexts = aTutorialTexts;
        house.houseView = new createjs.Container();
        characterActive = {"hoboCat":hoboActive, "timmy":timmyActive, "priest":priestActive};        
        characterDialogNumber = {"hoboCat":hoboDialogNumber, "timmy":timmyDialogNumber, "priest":priestDialogNumber};
        characterdialogID = {"hoboCat": hoboDialogID, "timmy" : timmyDialogID, "priest" : priestDialogID};
    };
    
    house.gotoHouseView = function(aGameStats, diamondCounterText)
    {        
        gameStats = aGameStats; 
       
        house.rsText.text = gameStats.rehab.slots;
        house.osText.text = gameStats.orphanage.slots;
        house.usText.text = gameStats.university.slots;               
        startGameStats = $.extend( true, {}, gameStats );
        house.hobo.alpha = 0;
        house.timmy.alpha = 0;
        house.priest.alpha = 0;
        house.displayedScore = gameStats.score;
        house.cricketsSound = createjs.Sound.play("crickets",{loop:-1});
        house.cricketsSound.volume=0.1;        
        var hobDiaNo = house.UpKeep(diamondCounterText);
            //If not fail upkeep, check for other dialog
            if(hobDiaNo === -1 && gameStats.bust === 0) {
                    var hobDiaNo = house.progressionCheck("hoboCat", gameStats);                
            }

            if(hobDiaNo !== -1) {
                currentCharacter = "hoboCat";
                house.hobo.alpha = 1;
                characterDialogNumber.hoboCat = hobDiaNo;           
                hoboActive = true;
                house.characterExclamation.alpha=0.5;            
                characterdialogID["hoboCat"] = 0;
            } 
            //If no hobo dialog, check for timmy dialog
            else {  
                var timmyDiaNo = house.progressionCheck("timmy", gameStats);
                if(timmyDiaNo !== -1) {
                    currentCharacter = "timmy";
                    house.timmy.alpha = 1;
                    characterDialogNumber.timmy = timmyDiaNo;
                    timmyActive = true;                
                    characterdialogID["timmy"] = 0;
                    house.characterExclamation.alpha=0.5;
                }
                //If no timmy dialog, cehck for priest dialog
                else {
                    var priestDiaNo = house.progressionCheck("priest", gameStats);
                    if(priestDiaNo !== -1) {
                        currentCharacter = "priest";
                        house.priest.alpha = 1;
                        characterDialogNumber.priest= priestDiaNo;
                        priestActive = true;
                        characterdialogID["priest"] = 0;
                        house.characterExclamation.alpha=0.5;
                    }

                    else {
                        house.hobo.alpha = 1;
                        currentCharacter = "hoboCat";
                    }
                }
            }                        
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
                        currentCharacter = cat;
                        characterActive[currentCharacter] = true;
                        wickActive = false;                        
                        catProgression[i].HasHappend = "yes";
                        return catProgression[i].ConversationNumber;
                    }
                }
            }
        }
        return -1;
    };
    
    house.characterDialog = function(diamondCounterText, gotoGameView)
    {             
        console.log(characterDialogNumber);
        console.log(currentCharacter);
        var dialog = dialogJSON[currentCharacter][characterDialogNumber[currentCharacter]];           
        if(dialog.dialog[characterdialogID[currentCharacter]])
        {
            if(dialog.dialog[characterdialogID[currentCharacter]].Triggers)
            {                
                for(i =0; i<dialog.dialog[characterdialogID[currentCharacter]].Triggers.length; i++)
                {                    
                    var value =dialog.dialog[characterdialogID[currentCharacter]].Triggers[i].Value;
                    var stat = dialog.dialog[characterdialogID[currentCharacter]].Triggers[i].Stat;
                    
                    if(stat === "score")
                    {
                        house.SetScore(value, gameStats, diamondCounterText);                        
                    }
                    else if (stat=== "kills")
                    {
                        gameStats.kills += value;
                    }                    
                    
                    else if (stat === "built")
                    {
                        if(!gameStats.hasBeenFirst.houseWithSlots && (value === "rehab" || value === "orphanage")) {
                            setTimeout(function() { 
                                paused = true; 
                                alert(tutorialTexts.houseWithSlots); 
                                setTimeout(function() { 
                                    paused = false; 
                                }, 1000);
                            }, 1000);
                            gameStats.hasBeenFirst.houseWithSlots = true;
                        }                        
                        gameStats[value].built = true;
                        gameStats[value].builtOnRound = gameStats.currentRound;                        
                        //SET ALPHA = 1 HERE                        
                        house.diamondHouseArray[value].alpha = 1;
                    }
                    
                    else if (stat === "addOn")
                    {
                        var building = dialog.dialog[characterdialogID[currentCharacter]].Triggers[i].Building;
                        house.diamondHouseArray[building].gotoAndPlay(value);
                        gameStats[building][value]= true;                        
                        house.UpdateAddOnStat();
                    }
                    else
                    {
                        gameStats[dialog.dialog[characterdialogID[currentCharacter]].Triggers[i].Stat]= value;                                
                    }                    
                }
            }
            
            if (dialog.dialog[characterdialogID[currentCharacter]].Who === "Catz") {
                house.catzSpeach.text = dialog.dialog[characterdialogID[currentCharacter]].What;            
                house.catzSpeach.alpha = 1;
                house.catzSound1.play();
            }
            else if (dialog.dialog[characterdialogID[currentCharacter]].Who === "Hobo-Cat") {
                house.characterSpeach.text = dialog.dialog[characterdialogID[currentCharacter]].What;
                house.characterSpeach.alpha = 1;
                house.hoboCatSound1.play();  
            }                             
            
            else if (dialog.dialog[characterdialogID[currentCharacter]].Who === "Timmy") {
                house.characterSpeach.text = dialog.dialog[characterdialogID[currentCharacter]].What;
                house.characterSpeach.alpha = 1;
                //Should be timmy sound
                house.hoboCatSound1.play();  
            }     
            
            else if (dialog.dialog[characterdialogID[currentCharacter]].Who === "Priest") {
                house.characterSpeach.text = dialog.dialog[characterdialogID[currentCharacter]].What;
                house.characterSpeach.alpha = 1;
                //Should be priest sound
                house.hoboCatSound1.play();  
            }
            
            if(dialog.dialog[characterdialogID[currentCharacter]].Choice) {                                                
                function addClickHandler(i){
                    house.choices[i].addEventListener("click",
                        function()
                        {                             
                            characterdialogID[currentCharacter] = house.choiceIDs[i];                                                                                                

                            house.choice1.alpha = 0;
                            house.choice2.alpha = 0;
                            house.choice3.alpha = 0;
                            house.choices[0].removeAllEventListeners();
                            house.choices[1].removeAllEventListeners();
                            house.characterDialog(diamondCounterText, gotoGameView);
                    }); 
                }
                for (var i=0;i<dialog.dialog[characterdialogID[currentCharacter]].Choices.length;i++)
                {                                                   
                    house.choices[i].text=dialog.dialog[characterdialogID[currentCharacter]].Choices[i].text;
                    house.choices[i].alpha = 1;
                    house.choiceIDs[i] = dialog.dialog[characterdialogID[currentCharacter]].Choices[i].ChoiceID;      
                    addClickHandler(i);                                           
                }                                                                     
            }
            else
            {                     
                if(!dialog.dialog[characterdialogID[currentCharacter]].End)
                {
                    characterdialogID[currentCharacter] = dialog.dialog[characterdialogID[currentCharacter]].NextID;                
                }
                else
                {
                    characterActive[currentCharacter] = false;
                    house.characterExclamation.alpha=0;
                    house.wickExclamation.alpha=1;
                    wickActive = true;
                    
                    
                    if(!createjs.Tween.hasActiveTweens(house.wickExclamation)){
                        createjs.Tween.removeAllTweens(house.wickExclamation);
                        createjs.Tween.get(house.wickExclamation).wait(4000).to({alpha:1},4000);
                    }
                    createjs.Tween.removeAllTweens(house.wick);
                    createjs.Tween.get(house.wick).to({x:-210},1200,createjs.Ease.quadInOut)
                            .call(function () {house.activateWick(gotoGameView)});
                    //To shift to idle speach. Should be implemented smarter.
                    characterdialogID[currentCharacter]+=100;                
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
        if(wickActive)
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
    
    house.highlightCharacter = function()
    {                       
        house.mouseChar[currentCharacter].alpha = 1;
        if(characterActive[currentCharacter])
        {
            house.characterExclamation.alpha = 1;            
        }
    };
    
    house.downlightCharacter = function()
    {
        house.mouseChar[currentCharacter].alpha = 0;
        
        if(characterActive[currentCharacter])
        {
            house.characterExclamation.alpha=0.5;
        }
        else
        {
            house.characterExclamation.alpha=0;
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
    
    house.update = function()
    {               
        if(house.characterSpeach.alpha > 0)
        {
            if(house.characterSpeach.alpha > 0.5) {
                house.characterSpeach.alpha -= 0.005;
            }
            else
            {
                house.characterSpeach.alpha -= 0.03;
            }
        }
        
        if(house.catzSpeach.alpha > 0)
        {
            if(house.catzSpeach.alpha >0.5){
                house.catzSpeach.alpha -= 0.005;
            }
            else {
                house.catzSpeach.alpha -= 0.03;
            }
            
        }            
                
        if(characterActive[currentCharacter])
        {
            house.characterExclamation.alpha=0;  
        }
    };
    
    house.addCharacterEvents = function(diamondCounterText, gotoGameView)
    {        
        house.characterExclamation.alpha=0.5;
        house.hobo.addEventListener("click",(function(){house.characterDialog(diamondCounterText, gotoGameView);}));
        house.hobo.addEventListener("mouseover", house.highlightCharacter);
        house.hobo.addEventListener("mouseout", house.downlightCharacter);
        
        house.timmy.addEventListener("click",(function(){house.characterDialog(diamondCounterText, gotoGameView);}));
        house.timmy.addEventListener("mouseover", house.highlightCharacter);
        house.timmy.addEventListener("mouseout", house.downlightCharacter);
        
        house.priest.addEventListener("click",(function(){house.characterDialog(diamondCounterText, gotoGameView);}));
        house.priest.addEventListener("mouseover", house.highlightCharacter);
        house.priest.addEventListener("mouseout", house.downlightCharacter);
    };
    
    house.addHouseEvents = function()
    {                
        house.rehab.addEventListener("mouseover",(function(){house.houseInfo("rehab");}));
        house.orphanage.addEventListener("mouseover",(function(){house.houseInfo("orphanage");}));
        house.university.addEventListener("mouseover",(function(){house.houseInfo("university");}));
    };
    
    house.houseInfo = function(houseName){
        house.houseInfo[houseName].alpha = 1;
    };
    
    house.gotoHouseViewNormal = function(gameStats, stage, gameView,diamondCounterText, diamondShardCounter, muteButton, gameListener, gotoGameView)
    {        
        house.characterExclamation.alpha=0;
        house.gotoHouseView(gameStats, diamondCounterText);
        house.wick.x=-120;
        house.wick.removeAllEventListeners();
        house.wick.gotoAndPlay("still");
        stage.removeAllEventListeners();
        if(wickActive)
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
        house.wick.addEventListener("click",(function(){house.calculateApproval(); house.CloseHouseInfo(); house.lightFuse(gotoGameView);}));
        house.wick.addEventListener("mouseover", house.highlightRocket);
        house.wick.addEventListener("mouseout", house.downlightRocket);                
    };
    
    house.UpKeep = function (diamondCounterText){        
        if(gameStats.bust > 0){            
            gameStats.bust -= 1;
        }
        
        var sum = 0;
        sum =
            gameStats.hoboCatHouse.built * 1 +
            gameStats.orphanage.built * gameStats.orphanage.slots * 3 +  gameStats.orphanage.youthCenter * 5 + gameStats.orphanage.summerCamp * 5  +
            gameStats.rehab.built * gameStats.rehab.slots * 5 + gameStats.rehab.hospital * 10 + gameStats.rehab.phychiatricWing *5 + gameStats.rehab.monastery * (-5) +
            gameStats.university.built * gameStats.university.slots * 15 + gameStats.university.rocketUniversity * 30;
        
        if(gameStats.score < sum) {
            house.SetScore(-gameStats.score, gameStats, diamondCounterText);
            gameStats.score = 0;
            
            if(gameStats.score - sum>-10){               
                gameStats.bust += 1;
                gameStats.rehab.slots -= deltaRehab;
                gameStats.orphanage.slots -= deltaOrph;
                gameStats.university.slots -= deltaUniversity;
            }
            else{
                gameStats.bust += 3;
                gameStats.rehab.slots = 0;
                gameStats.orphanage.slots = 0;
                gameStats.university.slots = 0;
            }
                    
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
        if(value<0)
        {
            createjs.Tween.get(house.subtractedDiamond, {override:true})
                    .to({alpha:1})
                    .to({y:300, x:100},400)
                    .to({alpha:0},100)
                    .to({x:750,y:420});
        }
    };
    
    house.updateDisplayedScore = function(event, gameStats, diamondCounterText) {
        if(house.displayedScore!==gameStats.score)
        {
            if((house.displayedScore-gameStats.score)<10)
            {
                house.displayedScore-= Math.min(event.delta/100,house.displayedScore-gameStats.score);
            }
            else{    
                house.displayedScore-= (house.displayedScore-gameStats.score)*event.delta/1500;
            }
            if(gameStats.score<10)
            {
                diamondCounterText.text="000"+Math.floor(house.displayedScore);
            }
            else if(gameStats.score<100)
            {
                diamondCounterText.text="00"+Math.floor(house.displayedScore);
            }
            else if(gameStats.score<1000)
            {
                diamondCounterText.text="0"+Math.floor(house.displayedScore);
            }
            else if(gameStats.score<10000)
            {
                diamondCounterText.text=Math.floor(house.displayedScore);
            }
            else
            {
                diamondCounterText.text="alot";
            }    
        }
    };
    
    house.calculateApproval = function () {
        deltaOrph = startGameStats.orphanage.slots - gameStats.orphanage.slots;
        deltaRehab = startGameStats.rehab.slots - gameStats.rehab.slots;
        house.deltaUni = startGameStats.university.slots - gameStats.university.slots;
        
        if(deltaOrph>0)
        {
            gameStats.kittens.approvalRating += 5 * deltaOrph;
            gameStats.villagers.approvalRating -= 1 * deltaOrph;
            gameStats.catParty.approvalRating -= 3 * deltaOrph;
        }
        else if (deltaOrph < 0)
        {
            gameStats.kittens.approvalRating -= 4 * deltaOrph;
            gameStats.villagers.approvalRating +=1 * deltaOrph;
            if(deltaOrph <= -10){
                gameStats.catParty.approvalRating +=1 * deltaOrph;
            }
            else {
                gameStats.catParty.approvalRating +=3 * deltaOrph;
            }                        
        }
        
        if(deltaRehab>0)
        {
            gameStats.kittens.approvalRating += 2 * deltaRehab;
            if(gameStats.rehab.hospital) {
                gameStats.villagers.approvalRating += 5 * deltaRehab;
                gameStats.catParty.approvalRating -= 2 * deltaRehab;
            }
            else {
                gameStats.villagers.approvalRating -= 2 * deltaRehab;
                gameStats.catParty.approvalRating -= 5 * deltaRehab;
            }            
        }
        
        else if (deltaRehab < 0)
        {
            gameStats.kittens.approvalRating -= 2 * deltaRehab;
            if(gameStats.rehab.hospital) {
                if(deltaRehab <= -10){
                    gameStats.catParty.approvalRating += 3 * deltaRehab;
                }
                else {
                    gameStats.catParty.approvalRating += 1 * deltaRehab;
                }                        
                gameStats.villagers.approvalRating -= 5 * deltaRehab;                
            }
            else {
                gameStats.villagers.approvalRating += 1 * deltaRehab;
                if(deltaRehab <= -10){
                    gameStats.catParty.approvalRating += 5 * deltaRehab;
                }
                else {
                    gameStats.catParty.approvalRating += 2 * deltaRehab;
                }                                        
            }            
        }
        
        if(house.deltaUni>0)
        {            
            gameStats.villagers.approvalRating += 5 * house.deltaUni;
            if(gameStats.university.rocketUniversity) {
                gameStats.kittens.approvalRating += 10 * house.deltaUni;                
                gameStats.catParty.approvalRating -= 5 * house.deltaUni;
            }
            else {
                gameStats.kittens.approvalRating += 5 * house.deltaUni;
                gameStats.catParty.approvalRating -= 3 * house.deltaUni;
            }            
        }
        
        else if (house.deltaUni < 0)
        {
            gameStats.villagers.approvalRating -= 5 * house.deltaUni;
            if(gameStats.university.rocketUniversity) {
                gameStats.kittens.approvalRating -= 20 * house.deltaUni;
                gameStats.catParty.approvalRating += 2 * house.deltaUni;
            }
            else {
                gameStats.kittens.approvalRating += 10 * house.deltaUni;
                gameStats.catParty.approvalRating += 1 * house.deltaUni;
            }            
        }                
    };
    
    house.UpdateAddOnStat = function () {        
        if(gameStats.orphanage.summerCamp){            
            house.addOnTextOrphanage1.text = "Summer Camp";
        }
        
        if(gameStats.orphanage.youthCenter){
            house.addOnTextOrphanage2.text = "Youth Center";
        }
        
        if(gameStats.rehab.hospital){
            house.addOnRehabText1.text = "Hospital";
        }
        
        if(gameStats.rehab.monastery){
            house.addOnRehabText1.text = "Monastery";
        }
        
        if(gameStats.rehab.phychiatricWing){
            house.addOnRehabText2.text = "Phychiatric Wing";
        }                
    };
    
    house.CloseHouseInfo = function () {        
        house.houseInfo["rehab"].alpha = 0;
        house.houseInfo["orphanage"].alpha = 0;
        house.houseInfo["university"].alpha = 0;
    };
    
    return house;
}());

