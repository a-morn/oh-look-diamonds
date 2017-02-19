import * as InitializeStage from './initialize-stage.js';
import * as Cookie from './cookie.js';
import SpriteSheetData from './sprite-sheet-data.js';
import * as LevelEditor from './level-editor.js';

let ctx;

window.StartGame = function(){
	$("#mute").click(switchMute);
	ctx = document.querySelector("#hs").getContext("2d"),
	InitializeStage.init();
	Cookie.saveAndSetHS(0, paint);
}

window.StartEditor = LevelEditor.StartEditor();

function StartGameFromLevelEditor(){
	$("#mute").click(switchMute);
	var tracks = [[[{"difficulty":"easy", "name": "levelName"}]]];
	var trackParts = getTestLevelTrackParts();
	ctx = document.querySelector("#hs").getContext("2d"),
	InitializeStage.createViewsAndStartCustomLevel(tracks, trackParts);    	
}

function switchMute(){
	if(createjs.Sound.getMute()){
		createjs.Sound.setMute(false);
		$("#mute").toggleClass("mute-is-muted",false);
	}
	else{
		createjs.Sound.setMute(true);
		$("#mute").toggleClass("mute-is-muted",true);    
	}
}

function paint(hs){
var dashLen = 220, dashOffset = dashLen, speed = 5,
    txt = hs+"", x = 0, i = 0;	
ctx.clearRect(0, 0, 200, 57);
ctx.font = "20px Sans Serif, cursive"; 
ctx.lineWidth = 1; ctx.lineJoin = "round"; 
ctx.globalAlpha = 1;
ctx.strokeStyle = "#ffffcc";
ctx.fillStyle =	"#ffffcc";
ctx.fillText('Highscore', 0, 20);
ctx.font = "40px Just Another Hand, cursive"; 
(function loop() {
  ctx.clearRect(x, 30, 60, 40);
  ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
  dashOffset -= speed;                                         // reduce dash length
  ctx.strokeText(txt[i], x, 55);                              // stroke letter

  if (dashOffset > 0) requestAnimationFrame(loop);             // animate
  else {    
	ctx.fillText(txt[i], x, 55);                              // fill final letter
    dashOffset = dashLen;                                      // prep next char
    x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random() + 5;
    if (i < txt.length) requestAnimationFrame(loop);
  }
})();
}
