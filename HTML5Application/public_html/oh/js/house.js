var House = (function(){
    var house = {
        house: null,
        bgHill: null,
        houseView: null,        
        crashRocket: null,
        hobo: null,
        timmy: null,
        priest: null,
        diamondHill: null,
        subtractedDiamond: null,
        subtractedDiamondCont:null,
        currentCharacter: "hoboCat",
        mouseHobo: null,
        mouseTimmy: null,
        mousePriest :null,
        mouseChar: {},
        mouseRocket: null,
        mouseCatz: null,
        catz: null,       
        cricketsSound: null,
        wick: null,
        oh: null,
        look: null,
        diamonds: null,
        diCont : null,
        lookingAtStarsButton: null,
        wickLight: null,
        wickClickBox: null,
        hoboCatHouse: null,
        rehab: null,
        orphanage: null,     
        university: null,
        diamondHouseCont: null,
        diamondHouseArray: [],
        characterSpeach: null,
        catzSpeach: null,
        hoboCatSound1: null,
        hoboCatSound2: null,
        catzSound1: null,
        catzSound2: null,                                                      
        characterExclamation : null,
        choiceIDs : [],
        choices : [],
        choice1 : null,
        choice2 : null,
        choice3 : null
    };
    
    var        
        deltaUniversity = 0,
        deltaOrph = 0,
        deltaRehab = 0,                                  
        characterActive = {},        
        wickActive = false,
        hoboActive = true,
        timmyActive = false,
        priestActive = false,
        catzActive = false,        
        currentCharacter = "hoboCat";
        
    house.init = function(){                
        house.houseView = new createjs.Container();
        characterActive = {"hoboCat":hoboActive, "timmy":timmyActive, "priest":priestActive, "catz":catzActive};                
    };    	
	
    house.gotoHouseView = function(){                				
		Cookie.saveAndSetHS(gameStats.score);
						
        house.hobo.alpha = 0;
        house.timmy.alpha = 0;
        house.priest.alpha = 0;        
        house.cricketsSound = createjs.Sound.play("crickets",{loop:-1});        
        house.cricketsSound.volume=0.1;                    
		var hobDiaNo = house.progressionCheck("hoboCat");     
		if(hobDiaNo !== -1) {
			currentCharacter = "hoboCat";
			house.hobo.alpha = 1;
			gameStats.dialogNumber["hoboCat"] = hobDiaNo;           
			hoboActive = true;				
			if(hobDiaNo!="goodEvening")
				house.characterExclamation.alpha=0.5;            
			gameStats.dialogID["hoboCat"] = 0;
		} 
		//If no hobo dialog, check for timmy dialog
		else {  
			var timmyDiaNo = house.progressionCheck("timmy");
			if(timmyDiaNo !== -1) {
				currentCharacter = "timmy";
				house.timmy.alpha = 1;
				gameStats.dialogNumber["timmy"] = timmyDiaNo;
				timmyActive = true;                
				gameStats.dialogID["timmy"] = 0;
				house.characterExclamation.alpha=0.5;
			}
			//If no timmy dialog, cehck for priest dialog
			else {
				var priestDiaNo = house.progressionCheck("priest");
				if(priestDiaNo !== -1) {
					currentCharacter = "priest";
					house.priest.alpha = 1;
					gameStats.dialogNumber["priest"] = priestDiaNo;
					priestActive = true;
					gameStats.dialogID["priest"] = 0;
					house.characterExclamation.alpha=0.5;
				}

				else {
					house.hobo.alpha = 1;
					currentCharacter = "hoboCat";
					$("#mahCanvas").addClass("match-cursor");
				}
			}
		}               
		gameStats.score = 0;		
    };
    
    house.progressionCheck = function(cat) {
        var catProgression = gameProgressionJSON[cat];
        for(var i=0, max1 = catProgression.length;i<max1;i++){                        
        conditionLoop:
            if(!gameStats.HasHappend[cat][i] || catProgression[i].ShouldReoccur && 
                catProgression[i].Chance>Math.random()){                                                
                for(var j=0, max2=catProgression[i].Conditions.length; j<max2; j++)       {
                    var condition = catProgression[i].Conditions[j];
                    if(condition.ConditionType === "Score"){                                        
                        if(condition.OperatorType === "LargerThan" && gameStats.score<=condition.Score)                                                    
							break conditionLoop;                                                    
                        else if(condition.OperatorType === "LessThan" && gameStats.score>=condition.Score)                                                    
							break conditionLoop;                 
						console.log("Score cond passed");
                    }
                    else if(condition.ConditionType === "buildingState"){                     						
                        if(condition.state === "builtOnRound" &&
						((gameStats.buildings[condition.building][condition.state] + condition.on)>=gameStats.currentRound))                            
						   break conditionLoop;                                                  
                        else if(gameStats.buildings[condition.building][condition.state] !== condition.on)                        
                            break conditionLoop;                        
						console.log("Building state cond passed");
                    }
                    
                    else if (condition.ConditionType === "state" && gameStats[condition.state] !== condition.on)                    
						break conditionLoop;
                                            
                    //If all conditions have been passed                    
                    if(j===catProgression[i].Conditions.length-1){       
                        currentCharacter = cat;
                        characterActive[currentCharacter] = true;
                        wickActive = false;                        
                        gameStats.HasHappend[cat][i] = true;
                        return catProgression[i].ConversationNumber;
                    }
                }
            }
        }
        return -1;
    };
    
    
    house.characterDialog = function(){           		
        var dialog = dialogJSON[currentCharacter][gameStats.dialogNumber[currentCharacter]];           
		var line = dialog.dialog[gameStats.dialogID[currentCharacter]];
        if(line){
			if(line.Triggers){		
				for(var i=0, max1=line.Triggers.length; i<max1; i++){                    
					var value = line.Triggers[i].Value;
					var stat = line.Triggers[i].Stat;
					
					if(stat === "score"){
						//gameStats.score += value;
					}
					else if (stat=== "kills")                    
						gameStats.kills += value;                    
					
					else if (stat === "built"){
						if(!gameStats.hasBeenFirst.houseWithSlots && (value === "rehab" || value === "orphanage")) {
							setTimeout(function() { 
								paused = true; 
								setTimeout(function() { 
									paused = false; 
								}, 1000);
							}, 1000);
							gameStats.hasBeenFirst.houseWithSlots = true;
						}                        
						gameStats.buildings[value].built = true;
						gameStats.buildings[value].builtOnRound = gameStats.currentRound;                         
						house.BuildingAnimation(house.diamondHouseArray[value]);                        						
					}
					
					else if (stat === "addOn"){
						var building = line.Triggers[i].Building;
						house.diamondHouseArray[building].gotoAndPlay(value);
						gameStats.buildings[building][value]= true;                        						
					}
					else                    
						gameStats[line.Triggers[i].Stat]= value;                                                                    
				}
			}
			
			if (line.Who === "Catz") {
				house.catzSpeach.text = line.What;            
				house.catzSpeach.alpha = 1;
				house.catzSound1.play();
			}
			else if (line.Who === "Hobo-Cat") {
				house.characterSpeach.text = line.What;
				house.characterSpeach.alpha = 1;
				house.hoboCatSound1.play();  
			}                             
			
			else if (line.Who === "Timmy") {
				house.characterSpeach.text = line.What;
				house.characterSpeach.alpha = 1;
				//Should be timmy sound
				house.hoboCatSound1.play();  
			}     
			
			else if (line.Who === "Priest") {
				house.characterSpeach.text = line.What;
				house.characterSpeach.alpha = 1;
				//Should be priest sound
				house.hoboCatSound1.play();  
			}
			
			if(line.Choice) {                                                
				function addClickHandler(i){
					house.choices[i].addEventListener("click",
						function(){                             
							gameStats.dialogID[currentCharacter] = house.choiceIDs[i];                                                                                                
							house.choice1.alpha = 0;
							house.choice2.alpha = 0;
							house.choice3.alpha = 0;
							house.choices[0].removeAllEventListeners();
							house.choices[1].removeAllEventListeners();
							house.characterDialog();
					}); 
					house.choices[i].addEventListener("mouseover", function(){house.choices[i].alpha=1});
					house.choices[i].addEventListener("mouseout", function(){house.choices[i].alpha=0.7});
				}
				for (var i=0, max1 = line.Choices.length;i<max1;i++){                                                   
					house.choices[i].text = line.Choices[i].text;
					house.choices[i].alpha = 0.7;
					house.choiceIDs[i] = line.Choices[i].ChoiceID;      
					addClickHandler(i);                                           
				}                                                                     
			}
			else{                     
				if(!line.End)
					gameStats.dialogID[currentCharacter] = line.NextID;                                
				else{
					//END DIALOG                    
					setTimeout(function(){$("#mahCanvas").addClass("match-cursor");}, 500);                    
					//house.wickExclamation.alpha=1; Replaced by match-cursor					
					showRocket();
					//To shift to idle speach. Should be implemented smarter.
					gameStats.dialogID[currentCharacter]+=100;                					
					Cookie.save(gameStats);					
				}                
			}        
		}
        else{
            house.characterSpeach.text = dialog.idle.what;
            house.characterSpeach.alpha = 1;            
			showRocket();
        }        
    };
    
	function showRocket(){
		characterActive[currentCharacter] = false;
		house.characterExclamation.alpha = 0;                    
		wickActive = true;
							
		if(!createjs.Tween.hasActiveTweens(house.wickExclamation)){
			createjs.Tween.removeTweens(house.wickExclamation);
			createjs.Tween.get(house.wickExclamation).wait(4000).to({alpha:1},4000);
		}
		createjs.Tween.removeTweens(house.wick);
		createjs.Tween.get(house.wick).to({x:-210},1200)
				.call(house.activateWick);
	}
     
    house.buildAnimationFinished = function(){
        createjs.Tween.removeTweens(house.houseView);
        house.houseView.x=0;
        house.houseView.y=0;
    };
    
    house.lightFuse = function(){        
        if(wickActive){
            createjs.Sound.play("wickSound");
            house.mouseRocket.alpha = 0;
            house.wickLight.alpha = 0;
            house.wick.gotoAndPlay("cycle");
            house.wickClickBox.removeAllEventListeners();   
            house.house.removeAllEventListeners();       
            house.wick.addEventListener("animationend",function(){$("#mahCanvas").removeClass("match-cursor");});
            house.wick.addEventListener("animationend",GameLogic.gotoGameView);
            house.catzSpeach.text ="";
            house.characterSpeach.text ="";            
        }
    };

    house.highlightCatz = function(){
        if(!createjs.Tween.hasActiveTweens(house.catz)){
            house.mouseCatz.alpha=1;   
            house.catz.x=360;
            house.catz.y=270; 
            house.catz.rotation = 0;                			
		}
    }


    house.downlightCatz = function(){
        house.mouseCatz.alpha=0;
    }
    
    
    house.highlightCharacter = function(){                       
        $("#mahCanvas").addClass("talk-cursor");
        house.mouseChar[currentCharacter].alpha = 1;
        if(characterActive[currentCharacter] && currentCharacter!="catz")
        {
            house.characterExclamation.alpha = 1;
        }
    };
    
    house.downlightCharacter = function(){
        $("#mahCanvas").removeClass("talk-cursor");
        house.mouseChar[currentCharacter].alpha = 0;
        
        if(characterActive[currentCharacter])        
            house.characterExclamation.alpha=0.5;        
        else        
			house.characterExclamation.alpha=0;        
    };
    
    house.highlightRocket = function(){
        if(wickActive){
            house.mouseRocket.alpha = 1;
            house.wickLight.alpha = 0.7;
        }
    };
    
    house.downlightRocket = function(){
        house.mouseRocket.alpha = 0;
        house.wickLight.alpha = 0;
    };
    
    house.update = function(){               
        if(house.characterSpeach.alpha > 0){
            if(house.characterSpeach.alpha > 0.5)
                house.characterSpeach.alpha -= 0.005;            
            else            
                house.characterSpeach.alpha -= 0.03;            
        }
        
        if(house.catzSpeach.alpha > 0){
            if(house.catzSpeach.alpha >0.5)
                house.catzSpeach.alpha -= 0.005;            
            else 
                house.catzSpeach.alpha -= 0.03;                        
        }   
        if(characterActive[currentCharacter])
        {
            house.characterExclamation.alpha=0;  
        }
    };
    
    house.addCharacterEvents = function(){                
        house.hobo.addEventListener("click",(function(){house.characterDialog();}));
        house.hobo.addEventListener("mouseover", house.highlightCharacter);
        house.hobo.addEventListener("mouseout", house.downlightCharacter);
        
        house.timmy.addEventListener("click",(function(){house.characterDialog();}));
        house.timmy.addEventListener("mouseover", house.highlightCharacter);
        house.timmy.addEventListener("mouseout", house.downlightCharacter);
        
        house.priest.addEventListener("click",(function(){house.characterDialog();}));
        house.priest.addEventListener("mouseover", house.highlightCharacter);
        house.priest.addEventListener("mouseout", house.downlightCharacter);

        house.catz.addEventListener("click", house.meow);
        house.catz.addEventListener("mouseover", house.highlightCatz);
        house.catz.addEventListener("mouseout", house.downlightCatz);				
    };        

    house.removeCharacterEvents = function(){
        house.hobo.removeAllEventListeners();
        house.timmy.removeAllEventListeners();
        house.priest.removeAllEventListeners();
        house.catz.removeAllEventListeners();
        house.characterExclamation.alpha=0;
    }

    house.meow = function(){
        createjs.Sound.play("catzScream2");        
    }
    
	house.load = function(){				
	var sg = Cookie.load();				
	if(sg){
		gameStats = sg;
		for (var key in gameStats.buildings) {
			if (gameStats.buildings.hasOwnProperty(key)) {
				if(gameStats.buildings[key].built)
					house.BuildingAnimation(house.diamondHouseArray[key]);
			}
		}       	
	}				
}
	
    house.gotoHouseViewFirstTime = function(stage, gameView,diamondShardCounter, muteButton, gameListener){        										
        house.characterExclamation.alpha=0;        
        house.gotoHouseView();
        $("#mahCanvas").removeClass("match-cursor");
        house.wick.x=-120;
        house.wickClickBox.removeAllEventListeners();
        house.house.removeAllEventListeners();
        house.wick.gotoAndPlay("still");
        stage.removeAllEventListeners();
        if(wickActive)
            house.activateWick(gotoGameView);   
        house.hobo.x=-300;
        house.hobo.y=270;
        stage.removeChild(gameView,diamondShardCounter,muteButton);
        stage.addChild(house.houseView);
        stage.update();
        createjs.Ticker.setFPS(20);
        createjs.Ticker.off("tick", gameListener);    		
    };
    
    house.gotoHouseViewWithRocket = function(){                
        house.gotoHouseView();
        if(CatzRocket.catzState===CatzRocket.catzStateEnum.OutOfFuelUpsideDown){

            house.crashRocket.x=315;
            house.crashRocket.y = -90;
        }
        else{
			house.crashRocket.x=315-400*Math.cos(CatzRocket.catzRocketContainer.rotation*6.28/360);
			house.crashRocket.y =310-400*Math.sin(CatzRocket.catzRocketContainer.rotation*6.28/360);
        }
		
        house.crashRocket.alpha=1;
        house.crashRocket.rotation=CatzRocket.catzRocketContainer.rotation;        
		
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
                .to({x:360, y:270, rotation:0},250);
    };    
    
    house.gotoHouseViewWithoutRocket = function(){
        house.gotoHouseView();
        house.catz.x=300-400*Math.cos(CatzRocket.catzRocketContainer.rotation*6.28/360);
        house.catz.y =370-400*Math.sin(CatzRocket.catzRocketContainer.rotation*6.28/360);
        house.catz.gotoAndPlay("flying");
        house.catz.rotation=CatzRocket.catzRocketContainer.rotation+90;
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
    
    house.activateWick = function(){   
        house.wickClickBox.addEventListener("click",(function(){ house.lightFuse();}));
        house.wickClickBox.addEventListener("mouseover", house.highlightRocket);
        house.wickClickBox.addEventListener("mouseout", house.downlightRocket);
        house.house.addEventListener("click",(function(){house.lightFuse();}));
        house.house.addEventListener("mouseover", house.highlightRocket);
        house.house.addEventListener("mouseout", house.downlightRocket);                                
    };               

    house.deactivateWick = function(){    
        house.wick.x=-100;
        house.mouseRocket.alpha = 0;
        house.wickLight.alpha = 0;
        house.wick.gotoAndPlay("still");   
        house.wickClickBox.removeAllEventListeners();
        house.wick.removeAllEventListeners();
        house.house.removeAllEventListeners();
    }
    
    house.BuildingAnimation = function(houseGraphic){		        
        var oldx = houseGraphic.x;
        var oldy = houseGraphic.y;        
        createjs.Tween.get(houseGraphic)
                .to({x:oldx-20,y:oldy+50})
				.to({alpha:1})
                .to({x:oldx,y:oldy},2000)
                .call(house.buildAnimationFinished);
        createjs.Tween.get(house.houseView, {loop:true})
            .to({x:-5, y:5},50)
            .to({x:5, y:-5},50);
    };                             
    	
    return house;
}());