import * as Cookie from './cookie.js';
import GameProgressionJSON from './game-progression.js';
import * as Helpers from './helpers.js';
import * as SpriteSheetData from './sprite-sheet-data.js';
import DiamondConstellation from './diamond-constellation.js';
import Containers from './containers.js';
import dialog from './dialog.js';
import { dispatch, events } from './event-bus.js';
import DebugOptions from './debug-options.js';

export let diamondHouseArray = [];
export let houseView = null;
export let cricketsSound = null;
export let subtractedDiamondCont = null;
export let wick = null;

let characterExclamation = null;
let diCont;
let house = null;
let bgHill = null;
let crashRocket = null;
let hobo = null;
let timmy = null;
let priest = null;
let currentCharacter = 'hoboCat';
let mouseHobo = null;
let mouseTimmy = null;
let mousePriest = null;
let mouseChar = {};
let mouseRocket = null;
let mouseCatz = null;
let catz = null;       
let oh = null;
let look = null;
let diamonds = null;
let lookingAtStarsButton = null;
let wickLight = null;
let wickClickBox = null;
let hoboCatHouse = null;
let rehab = null;
let orphanage = null;     
let university = null;
let diamondHouseCont = null;
let catzSpeach = null;
let hoboCatSound1 = null;
let catzSound1 = null;
let catzSound2 = null;                                                      
let choiceIDs = [];
let choices = [];
let choice1 = null;
let choice2 = null;
let choice3 = null;
let characterActive = {};
let wickActive = false;
let hoboActive = true;
let timmyActive = false;
let priestActive = false;
let catzActive = false;
let characterSpeach;
let bg;
let gameStats;

export function init(data) {
	bg = data.bg;
	gameStats = data.gameStats;
	let queue = data.queue;
	houseView = new createjs.Container(); // eslint-disable-line no-undef
	characterActive = {
		'hoboCat':hoboActive,
		'timmy':timmyActive,
		'priest':priestActive,
		'catz':catzActive
	};

	house = Helpers.createBitmap(queue.getResult('house'), 
			{scaleX:0.8, scaleY:0.8, y:-20});								 
				
	bgHill = Helpers.createBitmap(queue.getResult('far right hill'), 
			{scaleX:0.8, scaleY:0.8, y:-20}); 
	hobo = Helpers.createSprite(SpriteSheetData.hobo, 'cycle', 
			{x:-210, y:225, regX:-210, regY:-180});										

	timmy = Helpers.createSprite(SpriteSheetData.supportingCharacter, 'timmy', 
			{x:83, y:362, scaleX:0.8, scaleY:0.8, alpha:0});						
								
	priest = Helpers.createSprite(SpriteSheetData.supportingCharacter, 'priest', 
			{x:52, y:330, scaleX:0.8, scaleY:0.8, alpha:0});						

	oh = Helpers.createBitmap(queue.getResult('ohlookdiamonds'), 
			{x:90, y:-1460, alpha:0, sourceRect:new createjs.Rectangle(0,0,227,190)});																				 // eslint-disable-line no-undef
	look = Helpers.createBitmap(queue.getResult('ohlookdiamonds'), 
			{x:340, y:-1460, alpha:0, sourceRect:new createjs.Rectangle(227,0,400,160)});																								  // eslint-disable-line no-undef
	diamonds = Helpers.createBitmap(queue.getResult('ohlookdiamonds'), 
			{x:90, y:-1283, alpha:0, sourceRect:new createjs.Rectangle(0,176,620,160)});																								 // eslint-disable-line no-undef
				
	diCont = new createjs.Container(); // eslint-disable-line no-undef
						
	var position;
	for(let i = 0, max = DiamondConstellation.length; i<max; i++) {
		position = DiamondConstellation[i];
		var diamond = Helpers.createSprite(SpriteSheetData.diamond, 'cycle', 
			{
				x:position.x,
				y:position.y-1500,
				scaleX:position.scale,
				scaleY:position.scale,
				currentAnimationFrame:position.frame
			}); 
		diCont.addChild(diamond);
	}

	crashRocket = Helpers.createBitmap(queue.getResult('rocketSilouette'), 
		{x:220, y:320, alpha:0, regX:180, regY:83,scaleX:0.5, scaleY:0.5});												
																
	diamondHouseCont = new createjs.Container(); // eslint-disable-line no-undef
	hoboCatHouse = Helpers.createSprite(SpriteSheetData.dHouse, 'hoboHouse', 			{x:430, y:378, scaleX:1, scaleY:1, alpha:0,rotation:-8});															 
								
	diamondHouseCont.addChild(hoboCatHouse);
	diamondHouseArray['hoboCatHouse'] = hoboCatHouse;
        
	rehab = Helpers.createSprite(SpriteSheetData.dHouse, 'catnip treatment facility', {x:583, y:355, scaleX:1.5, scaleY:1.5, alpha:0});     

	diamondHouseCont.addChild(rehab);
	diamondHouseArray['rehab'] = rehab;
        
	orphanage = Helpers.createSprite(SpriteSheetData.dHouse, 'orphanage', 
		{x:500, y:381, scaleX:1.5, scaleY:1.5, alpha:0});               
	diamondHouseCont.addChild(orphanage);
	diamondHouseArray['orphanage'] = orphanage;
        
	university = Helpers.createSprite(SpriteSheetData.dHouse, 'university', 
		{x:700, y:305, rotation:5, alpha:0});

	diamondHouseCont.addChild(university);
	diamondHouseArray['university'] = university;                        
        
	mouseHobo = Helpers.createBitmap(queue.getResult('mouseHobo'), 
		{x:110, y:316, alpha:0, scaleX:0.5, scaleY:0.5});                
        
	mouseTimmy = Helpers.createBitmap(queue.getResult('mouseTimmy'), 
		{x:85, y:360, alpha:0, scaleX:0.5, scaleY:0.5});        
        
	mousePriest = Helpers.createBitmap(queue.getResult('mousePriest'), 
		{x:53, y:330, alpha:0, scaleX:0.5, scaleY:0.5});                
        
	mouseChar = {'hoboCat':mouseHobo, 'timmy':mouseTimmy, 'priest' : mousePriest};
        
	mouseRocket = Helpers.createBitmap(queue.getResult('mouseRocket'), 
		{x:211, y:338, alpha:0});        		        
			
	mouseCatz = Helpers.createBitmap(queue.getResult('mouseCatz'), 
		{x:116, y:56, alpha:0, scaleX:0.5, scaleY:0.5});        		        

	catz = Helpers.createSprite(SpriteSheetData.cat, 'cycle', 
		{x:360, y:270, scaleX:0.8, scaleY:0.8});	
		
	wick = Helpers.createSprite(SpriteSheetData.wick, 'still', 
		{x:-210, y:50, scaleX:1.5, scaleY:1.5});			
        
	wickLight = new createjs.Shape(); // eslint-disable-line no-undef
	wickLight.graphics.beginFill('#ffcc00').dc(0,0,1.5);
	wickLight.x = 174;
	wickLight.y = 319;
	wickLight.alpha = 0;

	wickClickBox = Helpers.createRectangle(85, 85, 'white', {x:155,y:300,alpha:0.01});
        
	characterSpeach = Helpers.createText('', '16px Fauna One', '#ffffcc', 
		{x:10, y:230, alpha:0});               
        
	characterExclamation = Helpers.createText('!', '32px Fauna One', '#ffcc00',		 {x:114, y:265, alpha:0});        				
        
	catzSpeach = Helpers.createText('', '12px Fauna One', '#ffffcc', 
		{x:350, y:180, alpha:0});        								    													
        
	choice1 = Helpers.createText('', '20px Fauna One', '#ffcc00', 
		{x:350, y:150, alpha:0});    

	choice1.hitArea = Helpers.createRectangle(150,30,'white',{x:-50, y:0});  																	
        
	choice2 = Helpers.createText('', '20px Fauna One', '#ffcc00', 
		{x:350, y:120, alpha:0});        													
	
	choice2.hitArea = Helpers.createRectangle(150,30,'white',{x:-50, y:0}); 

	choice3 = Helpers.createText('', '20px Fauna One', '#ffcc00', 
		{x:350, y:180, alpha:0});        													        
                
	choice3.hitArea = Helpers.createRectangle(150,30,'white',{x:-50, y:0}); 

	choices = [choice1, choice2,choice3];
        
	hoboCatSound1 = createjs.Sound.play('hoboCatSound1'); // eslint-disable-line no-undef
	hoboCatSound1.stop();
        
	catzSound1 = createjs.Sound.play('catzSound1'); // eslint-disable-line no-undef
	catzSound1.stop();
	catzSound2 = createjs.Sound.play('catzSound2'); // eslint-disable-line no-undef
	catzSound2.stop();
        
	// subtractedDiamond = Helpers.createBitmap(queue.getResult('diamondShardCounter'), {x:750, y:420, scaleX:0.4, scaleY:0.4});                
        
	subtractedDiamondCont = new createjs.Container(); // eslint-disable-line no-undef
	houseView.y = 1500;
	bg.y = 0;
	Containers.star.y = 1000;
	if(!DebugOptions.noHouseView)
		bg.addEventListener('click',showOh);
	
	houseView.addChild(university, rehab, bgHill, orphanage, 
		hoboCatHouse, crashRocket, catz, 
		wick, house, hobo, timmy, priest, characterExclamation, 
		catzSpeach, characterSpeach, choice1, 
		choice2, choice3, mouseHobo, mouseTimmy, 
		mousePriest, mouseRocket, mouseCatz, wickLight, wickClickBox,oh, 
		look, diamonds, diCont, lookingAtStarsButton, subtractedDiamondCont);
}
    
export function progressionCheck(cat) {
	const catProgression = GameProgressionJSON[cat];
	for(let i=0, max1 = catProgression.length;i<max1;i++) { 
		conditionLoop:
			if(!gameStats.HasHappend[cat][i] || catProgression[i].ShouldReoccur
				&&  catProgression[i].Chance>Math.random()) {
				for(var j=0, max2=catProgression[i].Conditions.length; j<max2; j++) {
					var condition = catProgression[i].Conditions[j];
					if(condition.ConditionType === 'Score') { 
						if(condition.OperatorType === 'LargerThan'
							&& gameStats.score<=condition.Score)
							break conditionLoop;                                
						else if (condition.OperatorType === 'LessThan'
							&& gameStats.score>=condition.Score)
							break conditionLoop;				
					} else if(condition.ConditionType === 'buildingState') {
						if(condition.state === 'builtOnRound'
							&& ((gameStats.buildings[condition.building][condition.state] + condition.on) >= gameStats.currentRound))
							break conditionLoop;
						else if(gameStats.buildings[condition.building][condition.state] !== condition.on)                        
							break conditionLoop;                        						
					} else if (condition.ConditionType === 'state'
						&& gameStats[condition.state] !== condition.on)
						break conditionLoop;														
					
					//If all conditions have been passed                    
					if(j===catProgression[i].Conditions.length-1) {
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
}

function addClickHandler(i) {
	choices[i].addEventListener('click', function() {
		gameStats.dialogID[currentCharacter] = choiceIDs[i];
		choice1.alpha = 0;
		choice2.alpha = 0;
		choice3.alpha = 0;
		choices[0].removeAllEventListeners();
		choices[1].removeAllEventListeners();
		characterDialog();
	}); 
	
	choices[i].addEventListener('mouseover', function() {
		choices[i].alpha=1;
	});
	choices[i].addEventListener('mouseout', function() {
		choices[i].alpha=0.7;
	});
}
			

export function characterDialog() {
	const currentDialog = dialog[currentCharacter][gameStats.dialogNumber[currentCharacter]];           
	const line = currentDialog.dialog[gameStats.dialogID[currentCharacter]];
	if(line) {
		if(line.Triggers) {		
			for(let i=0, max1=line.Triggers.length; i<max1; i++) { 
				var value = line.Triggers[i].Value;
				var stat = line.Triggers[i].Stat;
			
				if(stat === 'score') {
					//gameStats.score += value;
				} else if (stat=== 'kills') {
					gameStats.kills += value;                    
				} else if (stat === 'built') {
					if(!gameStats.hasBeenFirst.houseWithSlots && (value === 'rehab' || value === 'orphanage')) {
						setTimeout(function() { 
							setTimeout(function() { 
							}, 1000);
						}, 1000);
						gameStats.hasBeenFirst.houseWithSlots = true;
					}                        
					gameStats.buildings[value].built = true;
					gameStats.buildings[value].builtOnRound = gameStats.currentRound; 
					buildingAnimation(diamondHouseArray[value]);
				}	else if (stat === 'addOn') {
					var building = line.Triggers[i].Building;
					diamondHouseArray[building].gotoAndPlay(value);
					building = line.Triggers[i].Building;
					diamondHouseArray[building].gotoAndPlay(value);
					gameStats.buildings[building][value]= true;	
				} else {
					gameStats[line.Triggers[i].Stat]= value;
				} 
			}
		}
	
		if (line.Who === 'Catz') {
			catzSpeach.text = line.What;            
			catzSpeach.alpha = 1;
			catzSound1.play();
		} else if (line.Who === 'Hobo-Cat') {
			characterSpeach.text = line.What;
			characterSpeach.alpha = 1;
			hoboCatSound1.play();  
		} else if (line.Who === 'Timmy') {
			characterSpeach.text = line.What;
			characterSpeach.alpha = 1;
			//Should be timmy sound
			hoboCatSound1.play();  
		} else if (line.Who === 'Priest') {
			characterSpeach.text = line.What;
			characterSpeach.alpha = 1;
			//Should be priest sound
			hoboCatSound1.play();  
		}
				
		if(line.Choice) {                                                
			for (var i=0, max1 = line.Choices.length;i<max1;i++) {
				choices[i].text = line.Choices[i].text;
				choices[i].alpha = 0.7;
				choiceIDs[i] = line.Choices[i].ChoiceID;      
				addClickHandler(i);                                           
			} 
		} else {                     
			if(!line.End)
				gameStats.dialogID[currentCharacter] = line.NextID;
			else {
				//END DIALOG                    
				setTimeout(function() {
					$('#mahCanvas').addClass('match-cursor'); // eslint-disable-line no-undef
				}, 500);                    
				showRocket();
				//To shift to idle speach. Should be implemented smarter.
				gameStats.dialogID[currentCharacter]+=100;                					
				Cookie.save(gameStats);					
			}                
		}        
	} else {
		characterSpeach.text = currentDialog.idle.what;
		characterSpeach.alpha = 1;            
		showRocket();
	}  
}
	
export function gotoHouseView() {
	Cookie.saveAndSetHS(gameStats.score);
					
	hobo.alpha = 0;
	timmy.alpha = 0;
	priest.alpha = 0;        
	cricketsSound = createjs.Sound.play('crickets',{loop:-1}); // eslint-disable-line no-undef

	cricketsSound.volume=0.1;                    
	var hobDiaNo = progressionCheck('hoboCat');     
	if(hobDiaNo !== -1) {
		currentCharacter = 'hoboCat';
		hobo.alpha = 1;
		gameStats.dialogNumber['hoboCat'] = hobDiaNo;           
		hoboActive = true;				
		if(hobDiaNo!='goodEvening')
			characterExclamation.alpha=0.5;            
		gameStats.dialogID['hoboCat'] = 0;
	} 
	//If no hobo dialog, check for timmy dialog
	else {  
		var timmyDiaNo = progressionCheck('timmy');
		if(timmyDiaNo !== -1) {
			currentCharacter = 'timmy';
			timmy.alpha = 1;
			gameStats.dialogNumber['timmy'] = timmyDiaNo;
			timmyActive = true;
			gameStats.dialogID['timmy'] = 0;
			characterExclamation.alpha=0.5;
		} //If no timmy dialog, cehck for priest dialog
		else { 
			var priestDiaNo = progressionCheck('priest');
			if(priestDiaNo !== -1) {
				currentCharacter = 'priest';
				priest.alpha = 1;
				priestActive = true;
				gameStats.dialogID['priest'] = 0;
				characterExclamation.alpha=0.5;
			}
			else {
				hobo.alpha = 1;
				currentCharacter = 'hoboCat';
				$('#mahCanvas').addClass('match-cursor'); // eslint-disable-line no-undef
			}
		}
	}               
	gameStats.score = 0;
}

export function update() { 
	if(characterSpeach.alpha > 0) {
		if(characterSpeach.alpha > 0.5)
			characterSpeach.alpha -= 0.005;            
		else            
			characterSpeach.alpha -= 0.03;            
	}
		
	if(catzSpeach.alpha > 0) {
		if(catzSpeach.alpha >0.5)
			catzSpeach.alpha -= 0.005;            
		else 
			catzSpeach.alpha -= 0.03;                        
	}   
	
	if(characterActive[currentCharacter]) {
		characterExclamation.alpha=0;
	}
}

export function gotoHouseViewWithoutRocket (catzRocketRotation){
	gotoHouseView();
	catz.x=300-400*Math.cos(catzRocketRotation*6.28/360);
	catz.y =370-400*Math.sin(catzRocketRotation*6.28/360);
	catz.gotoAndPlay('flying');
	catz.rotation=catzRocketRotation+90;
	createjs.Tween.get(catz) // eslint-disable-line no-undef
					.to({x:300, y:370},200)
					.call(catz.gotoAndPlay,['cycle'])
					.wait(800)
					.to({x:390, y:350, rotation:10},250)
					.to({x:330, y:330, rotation:-10},250)
					.to({x:390, y:310, rotation:10},250)
					.to({x:330, y:290, rotation:-10},250)
					.to({x:360, y:270, rotation:0},250);
	crashRocket.alpha=1;
	crashRocket.x=315;
	crashRocket.y=910;
	crashRocket.rotation=-90;
	createjs.Tween.get(crashRocket) // eslint-disable-line no-undef
					.wait(1200)
					.to({x:315, y:310},500)
					.to({x:315, y:310, rotation:-30},800, createjs.Ease.quadIn); // eslint-disable-line no-undef
}

export function gotoHouseViewWithRocket (upSideDown, catzRocketRotation) {
	if(upSideDown) {
		crashRocket.x = 315;
		crashRocket.y = -90;
	} else {
		crashRocket.x =
			315-400*Math.cos(catzRocketRotation*6.28/360);
		crashRocket.y =
			310-400*Math.sin(catzRocketRotation*6.28/360);
	}

	crashRocket.alpha=1;
	crashRocket.rotation=catzRocketRotation;        

	createjs.Tween.get(crashRocket) // eslint-disable-line no-undef
		.to({x:315, y:310},200)
		.wait(1500)
		.to({x:315, y:310, rotation:-30},800, createjs.Ease.quadIn);  // eslint-disable-line no-undef
		
	catz.x = 360;
	catz.y = 370;
		
	createjs.Tween.get(catz) // eslint-disable-line no-undef
		.wait(800)
		.to({x:390, y:350, rotation:10}, 250)
		.to({x:330, y:330, rotation:-10}, 250)
		.to({x:390, y:310, rotation:10}, 250)
		.to({x:330, y:290, rotation:-10}, 250)
		.to({x:360, y:270, rotation:0}, 250);
}

export function addCharacterEvents() {
	hobo.addEventListener('click', () => characterDialog());

	hobo.addEventListener('mouseover', highlightCharacter);
	hobo.addEventListener('mouseout', downlightCharacter);
		
	timmy.addEventListener('click', () => characterDialog());
	timmy.addEventListener('mouseover', highlightCharacter);
	timmy.addEventListener('mouseout', downlightCharacter);
	
	priest.addEventListener('click', () => characterDialog());
	priest.addEventListener('mouseover', highlightCharacter);
	priest.addEventListener('mouseout', downlightCharacter);

	catz.addEventListener('click', meow);
	catz.addEventListener('mouseover', highlightCatz);
	catz.addEventListener('mouseout', downlightCatz);				
}

export function removeCharacterEvents() {
	hobo.removeAllEventListeners();
	timmy.removeAllEventListeners();
	priest.removeAllEventListeners();
	catz.removeAllEventListeners();
	characterExclamation.alpha=0;
}

export function meow() {
	createjs.Sound.play('catzScream2');         // eslint-disable-line no-undef
}
	
export function gotoHouseViewFirstTime(stage, gameView, diamondShardCounter, muteButton, gameListener) {
	characterExclamation.alpha=0;        
	gotoHouseView();
	$('#mahCanvas').removeClass('match-cursor'); // eslint-disable-line no-undef
	wick.x=-120;
	wickClickBox.removeAllEventListeners();
	house.removeAllEventListeners();
	wick.gotoAndPlay('still');
	stage.removeAllEventListeners();
	if(wickActive)
		activateWick();   
	hobo.x=-300;
	hobo.y=270;
	stage.removeChild(gameView,diamondShardCounter,muteButton);
	stage.addChild(houseView);
	stage.update();
	createjs.Ticker.setFPS(20); // eslint-disable-line no-undef
	createjs.Ticker.off('tick', gameListener); // eslint-disable-line no-undef
}
    
export function load() {
	const sg = Cookie.load();
	if(sg) {
		for (let key in gameStats.buildings) {
			if (gameStats.buildings.hasOwnProperty(key)) {
				if(gameStats.buildings[key].built)
					buildingAnimation(diamondHouseArray[key]);
			}
		}
	}
}

export function tick() {
	$('.odometer').html(gameStats.score); // eslint-disable-line no-undef
	if (characterSpeach.alpha > 0) {
		characterSpeach.alpha -= 0.015;
	}

	if (catzSpeach.alpha > 0) {
		catzSpeach.alpha -= 0.015;
	}
}

export function deactivateWick() {
	wick.x=-100;
	mouseRocket.alpha = 0;
	wickLight.alpha = 0;
	wick.gotoAndPlay('still');   
	wickClickBox.removeAllEventListeners();
	wick.removeAllEventListeners();
	house.removeAllEventListeners();
}

export function activateWick() {   
	wickClickBox.addEventListener('click',(() => lightFuse()));
	wickClickBox.addEventListener('mouseover', highlightRocket);
	wickClickBox.addEventListener('mouseout', downlightRocket);
	house.addEventListener('click',(() => lightFuse()));
	house.addEventListener('mouseover', highlightRocket);
	house.addEventListener('mouseout', downlightRocket);
}

function showOh() {
	bg.removeAllEventListeners();
	bg.addEventListener('click',showLook);
	createjs.Tween // eslint-disable-line no-undef
		.get(oh)
		.to({alpha:1}, 3000);
}

function showLook(){
	bg.removeAllEventListeners();
	bg.addEventListener('click',showDiamonds);
	createjs.Tween // eslint-disable-line no-undef
		.get(look)
		.to({alpha:1}, 3000);
}
		
function showDiamonds(){
	bg.removeAllEventListeners();
	bg.addEventListener('click',goDown);
	createjs.Tween // eslint-disable-line no-undef
		.get(diamonds)
		.to({alpha:1}, 3000);				
}

function goDown(){		
	bg.removeAllEventListeners();
	createjs.Tween // eslint-disable-line no-undef
		.get(houseView)
		.to({y:0}, 4000, createjs.Ease.quadInOut) // eslint-disable-line no-undef
		.call(load)
		.call(hoboWalk);
	createjs.Tween // eslint-disable-line no-undef
		.get(bg)
		.to({y:-1200}, 4000, createjs.Ease.quadInOut); // eslint-disable-line no-undef
	createjs.Tween // eslint-disable-line no-undef
		.get(Containers.star)
		.to({y:0}, 4000, createjs.Ease.quadInOut);				 // eslint-disable-line no-undef
}	

function hoboWalk(){					
	function w () {
		createjs.Tween.get(hobo)				 // eslint-disable-line no-undef
			.to({x:-270, y:270, rotation:0}, 300)
			.to({x:-260, y:270, rotation:-5}, 300)
			.to({x:-230, y:270, rotation:0}, 300)
			.to({x:-200, y:270, rotation:-5}, 300)
			.to({x:-170, y:270, rotation:0}, 300)
			.to({x:-160, y:270, rotation:-5}, 300)
			.to({x:-130, y:260, rotation:0}, 300)
			.to({x:-140, y:260, rotation:-5}, 300)
			.to({x:-110, y:225, rotation:0}, 300)
			.to({x:-110, y:225, rotation:0}, 300)
			.call(addCharacterEvents)
			.call(() => characterExclamation.alpha=0.5);
	}
	if(!gameStats.HasHappend['hoboCat'][1])
		setTimeout(w, 2500);
	else{
		w();
	}
}


function highlightCatz() {
	if(!createjs.Tween.hasActiveTweens(catz)) { // eslint-disable-line no-undef
		mouseCatz.alpha=1;   
		catz.x=360;
		catz.y=270; 
		catz.rotation = 0;                			
	}
}

function downlightCatz() {
	mouseCatz.alpha=0;
}

function highlightCharacter() { 
	$('#mahCanvas').addClass('talk-cursor'); // eslint-disable-line no-undef
	mouseChar[currentCharacter].alpha = 1;
	if(characterActive[currentCharacter] && currentCharacter!='catz') {
		characterExclamation.alpha = 1;
	}
}

function downlightCharacter(){
	$('#mahCanvas').removeClass('talk-cursor'); // eslint-disable-line no-undef
	mouseChar[currentCharacter].alpha = 0;
	
	if(characterActive[currentCharacter]) {
		characterExclamation.alpha = 0.5;
	} else {
		characterExclamation.alpha=0; 
	}
}

function highlightRocket() {
	if(wickActive) {
		mouseRocket.alpha = 1;
		wickLight.alpha = 0.7;
	}
}

function downlightRocket() {
	mouseRocket.alpha = 0;
	wickLight.alpha = 0;
}

function buildingAnimation (houseGraphic){		        
	var oldx = houseGraphic.x;
	var oldy = houseGraphic.y;        
	createjs.Tween.get(houseGraphic) // eslint-disable-line no-undef
		.to({x:oldx-20,y:oldy+50})
		.to({alpha:1})
		.to({x:oldx,y:oldy},2000)
		.call(buildAnimationFinished);
	createjs.Tween.get(houseView, {loop:true}) // eslint-disable-line no-undef
		.to({x:-5, y:5},50)
		.to({x:5, y:-5},50);
}

function buildAnimationFinished() {
	createjs.Tween.removeTweens(houseView); // eslint-disable-line no-undef
	houseView.x=0;
	houseView.y=0;
}
function showRocket(){
	characterActive[currentCharacter] = false;
	characterExclamation.alpha = 0;                    
	wickActive = true;
						
	createjs.Tween.removeTweens(wick); // eslint-disable-line no-undef
	createjs.Tween // eslint-disable-line no-undef
		.get(wick)
		.to({x:-210}, 1200)
		.call(activateWick);
}

function lightFuse() {        
	if(wickActive){
		createjs.Sound.play('wickSound'); // eslint-disable-line no-undef
		mouseRocket.alpha = 0;
		wickLight.alpha = 0;
		wick.gotoAndPlay('cycle');
		wickClickBox.removeAllEventListeners();   
		house.removeAllEventListeners();       
		wick.addEventListener('animationend',
			() =>$('#mahCanvas').removeClass('match-cursor')); // eslint-disable-line no-undef
		wick.addEventListener('animationend',
			() => dispatch(events.ROCKET_FIRED));
		catzSpeach.text = '';
		characterSpeach.text = '';
	}
}
