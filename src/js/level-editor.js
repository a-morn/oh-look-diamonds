var progressBar,
	stage,
	queue,
	canvas,
	inGameMode = false,
	isSpriteMode = true,
	levels,
	ctrlPressed = false,
	grav = 12,
	dbText,
	selectBox = {
		rect: null,
		graphic: null
	},
	selectPosOnStartDrag = {
		x: null,
		y: null
	},
	bgCoordinates = {
		width: 800,
		height: 1800,
		offset: -520
	},
	fgCoordinates = {
		height: 150,
		width: 2000
	},
	catzStartPos = {
		x: 260,
		y: 1030
	},
	mousedown,
	catzRocketXpos = 0,
	YOriginPosInGame = 830,
	levelLength = 13500,
	levelViewScale = 0.5,
	beginningZoneLength = 1000,
	bgCont = new createjs.Container(),
	objCont = new createjs.Container(),
	selectedCont = new createjs.Container(),
	levelView = new createjs.Container(),
	gameClickScreen,
	clipBoard,
	clipOffset = 0,
	levelEditor = {};

levelEditor.Init = function() {
	canvas = $("#levelEditCanvas")[0];
	stage = new createjs.Stage(canvas);
	stage.mouseMoveOutside = true;
	progressBar = new createjs.Shape();
	progressBar.graphics.beginFill("#907a91").drawRect(0, 0, 100, 20);
	progressBar.x = canvas.width / 2 - 50;
	progressBar.y = canvas.height / 2 - 10;
	stage.addChild(progressBar);
	queue = new createjs.LoadQueue(true);
	queue.on("progress", handleProgress);
	queue.on("complete", handleComplete);
	queue.loadManifest(LevelManifest);
}

function handleProgress(event) {
	progressBar.graphics.beginFill("#330033").drawRect(0, 0, 100 * event.progress, 20);
	stage.update();
}

function handleComplete() {
	SpriteSheetData.setValues(queue);
	populateDDL();
	createLevelView();
	initSelectBox();
	setEventListeners();
	//	createToolView();
	dbText = helpers.createText("hej", "16px Fauna One", "#ffffcc", {
		x: 30,
		y: 38
	});
	stage.addChild(levelView, dbText, gameClickScreen);
	stage.removeChild(progressBar);
	createjs.Ticker.on("tick", onTick);
	createjs.Ticker.setFPS(30);
	stage.update();
}

function createLevelView() {
	createBG();
	createCatz();


	levelView.addChild(bgCont, objCont, selectedCont, CatzRocket.catzRocketContainer);
	levelView.scaleX = levelViewScale;
	levelView.scaleY = levelViewScale;
	var canvasHeight = (bgCoordinates.height + bgCoordinates.offset) * levelViewScale;
	var canvasWidth = levelLength * levelViewScale;
	document.getElementById("levelEditCanvas").height = canvasHeight;
	document.getElementById("levelEditCanvas").width = canvasWidth;
	createGameClickScreen(canvasWidth, canvasHeight);
}

function createGameClickScreen(w, h) {
	gameClickScreen = helpers.createRectangle(w, h, "ffffff", {
		alpha: 0
	});
}

function createBG() {
	for (i = 0, len = 2 + levelLength / bgCoordinates.width; i < len; i++) {
		var bgClone = new createjs.Bitmap(queue.getResult("bg"));
		bgClone.x = i * bgCoordinates.width;
		bgClone.y = bgCoordinates.offset;
		if (i % 2 === 0) {
			bgClone.scaleX = -1;
			bgClone.x -= bgCoordinates.width;
		}
		bgCont.addChild(bgClone);
	}
	for (i = 0, len = levelLength / fgCoordinates.width; i < len; i++) {
		var fgClone = new createjs.Bitmap(queue.getResult("fgGround"));
		fgClone.x = fgCoordinates.width * i;
		fgClone.y = 300 + YOriginPosInGame;
		var topClone = new createjs.Bitmap(queue.getResult("fgGroundTop"));
		topClone.x = fgCoordinates.width * i;
		topClone.y = 0;
		bgCont.addChild(fgClone, topClone);
	}
	startLine=helpers.createRectangle(10,bgCoordinates.height-bgCoordinates.offset, "red", {x:beginningZoneLength})
	bgCont.addChild(startLine);
}

function createCatz() {
	CatzRocket.Init();
	CatzRocket.catz = helpers.createSprite(SpriteSheetData.rocket, "no shake", {
		y: 5
	});
	CatzRocket.catzRocketContainer.regY = 100;
	CatzRocket.catzRocketContainer.regX = 150;
	CatzRocket.catz.currentFrame = 0;
	CatzRocket.rocketFlame = helpers.createSprite(SpriteSheetData.flame, "cycle", {
		x: 190,
		y: 200,
		regX: 40,
		regY: -37,
		alpha: 0
	});
	CatzRocket.SnakeLine = new createjs.Shape();
	CatzRocket.rocket = helpers.createBitmap(queue.getResult("rocket"), {
		scaleX: 0.25,
		scaleY: 0.25,
		regX: -430,
		regY: -320
	});
	CatzRocket.rocketSound = createjs.Sound.play("rocketSound");
	CatzRocket.rocketSound.volume = 0.1;
	CatzRocket.rocketSound.stop();
	for (var i = 0, snakeAmt = 11; i < snakeAmt; i++) {
		var shape = new createjs.Shape();
		var x = 260 - i * 5;
		var r = 9;
		shape.graphics.f("fffff").dc(x, 200, r);
		shape.regY = 5;
		shape.regX = 5;
		CatzRocket.rocketSnake.addChild(shape);
	}
	CatzRocket.glass = helpers.createSprite(SpriteSheetData.hudGlass, "still", {
		regX: 150,
		regY: 200,
		scaleX: 0.85,
		scaleY: 0.85,
		x: 670,
		y: 158
	});
	CatzRocket.setCrashBorders(0, YOriginPosInGame + 450);
	CatzRocket.catzRocketContainer.addChild(CatzRocket.rocket, CatzRocket.catz);
	CatzRocket.catzRocketContainer.on("pressmove", pressMoveCatz);
}

function populateDDL() {
	var ddl = document.getElementById("importSelect");
	levels = Object.keys(TrackParts.easy);
	for (i = 0, len = levels.length; i < len; i++) {
		var option = document.createElement("option");
		option.text = levels[i];
		ddl.add(option);
	}
}


function setEventListeners() {
	bgCont.on("mousedown", createSelectBox);
	bgCont.on("pressmove", dragBox);
	bgCont.on("pressup", selectWithBox);
	$(window).keydown(handleKeyPress);
	$(window).keyup(handleKeyUp);
	selectedCont.on("mousedown", startPressMove);
	selectedCont.on("pressmove", pressMove);
	gameClickScreen.on("mousedown", gameMouseDown);
	gameClickScreen.on("click", gameMouseUp);
}

function handleKeyPress(evt){
	if (evt.ctrlKey){
		ctrlPressed = true;
	}
	if((evt.keyCode===67 ||evt.keyCode===88) && ctrlPressed){
		clipBoard = [];
		clipOffset = 0;
		var clipLeftMost = levelLength;
		var clipRightMost = 0;
		for (var i = selectedCont.children.length - 1; i >= 0; i--) {
			kid = selectedCont.children[i];
			kid.x-=selectedCont.x;
			kid.y-=selectedCont.y;
			clipBoard.push(createClone(kid));
			clipRightMost = Math.max(selectedCont.children[i].x, clipRightMost);
			clipLeftMost = Math.min(selectedCont.children[i].x, clipLeftMost);
		};
		if(evt.keyCode===67){
			clipOffset = clipRightMost-clipLeftMost+50;
		}
	}
	if(evt.keyCode===86 && ctrlPressed){
		moveChildrenFromSelectedToObjCont();
		for (var i = clipBoard.length - 1; i >= 0; i--) {
			clipBoard[i].x+=clipOffset;
			var clone = createClone(clipBoard[i]);
			clone.alpha = 0.5;
			selectedCont.addChild(clone);
		};
	}
	if(evt.keyCode===88 || evt.keyCode=== 46)
	{
		selectedCont.removeAllChildren();
	}
}

function handleKeyUp(evt){
	if (evt.ctrlKey){
		ctrlPressed = false;
	}
}
function startPressMove(evt) {
	selectPosOnStartDrag.x = evt.stageX / levelViewScale - selectedCont.x;
	selectPosOnStartDrag.y = evt.stageY / levelViewScale - selectedCont.y;
}

function pressMove(evt) {
	evt.currentTarget.x = evt.stageX / levelViewScale - selectPosOnStartDrag.x;
	evt.currentTarget.y = evt.stageY / levelViewScale - selectPosOnStartDrag.y;
	stage.update();
}

function pressMoveCatz(evt) {
	evt.currentTarget.x = evt.stageX / levelViewScale;
	evt.currentTarget.y = evt.stageY / levelViewScale;
	stage.update();
}
 function deleteAllSelected(evt) {
	selectedCont.removeAllChildren();
}

function deleteAll() {
	selectedCont.removeAllChildren();
	objCont.removeAllChildren();

}

function catzToStartPosition() {
	exitGameMode();
	window.scrollTo(0, 0);
	CatzRocket.catzRocketContainer.y = catzStartPos.y;
	CatzRocket.catzRocketContainer.x = catzStartPos.x;
}

function changeBirdType(evt) {
	types = ["seagull",
		"duck",
		"crow",
		"bat",
		"falcon",
		"glasses"
	];
	for (i = types.length - 1; i >= 0; i--) {
		if (evt.currentTarget.currentAnimation === types[i]) {
			evt.currentTarget.gotoAndStop(types[i + 1]);
			return;
		}
	}
}

function initSelectBox() {
	selectBox.rect = new createjs.Rectangle(0, 0, 0, 0);
	selectBox.graphic = new createjs.Shape();

}

function createSelectBox(evt) {
	moveChildrenFromSelectedToObjCont();
	selectBox.rect.setValues(evt.stageX / levelViewScale, evt.stageY / levelViewScale, 1, 1);
	selectBox.graphic.graphics.clear();
	selectBox.graphic.graphics.setStrokeStyle(1);
	levelView.addChild(selectBox.graphic);
	drawSelectBox();
}


function dragBox(evt) {
	selectBox.graphic.graphics.clear();
	selectBox.rect.width = evt.stageX / levelViewScale - selectBox.rect.x;
	selectBox.rect.height = evt.stageY / levelViewScale - selectBox.rect.y;
	drawSelectBox();
}

function drawSelectBox() {
	selectBox.graphic.graphics.beginStroke("#ffffff").drawRect(
		selectBox.rect.x, selectBox.rect.y, selectBox.rect.width, selectBox.rect.height);
	stage.update();
}

function selectWithBox(evt) {
	//remove selected items not in the box
	moveChildrenFromSelectedToObjCont();
	//add items in the box
	for (var i = objCont.numChildren - 1; i >= 0; i--) {
		var kid = objCont.getChildAt(i);
		if (helpers.isInRectangle(kid.x, kid.y, selectBox.rect)) {
			selectedCont.addChild(kid);
		}
	};
	if (selectedCont.numChildren === 0) {

		selectBox.graphic.graphics.clear();
	} else {
		selectBox.graphic.graphics.clear();
		selectedCont.alpha = 0.5;
	}
}

function selectItem(evt) {
	if (evt.currentTarget.parent === objCont) {
		moveChildrenFromSelectedToObjCont();
		selectedCont.addChild(evt.currentTarget);
		startPressMove(evt);
	}
}


function moveChildrenFromSelectedToObjCont() {
	for (var i = selectedCont.numChildren - 1; i >= 0; i--) {
		var kid = selectedCont.getChildAt(i);
		kid.x += selectedCont.x;
		kid.y += selectedCont.y;
		kid.alpha = 1;
		objCont.addChild(kid);
	};
	selectedCont.x = 0;
	selectedCont.y = 0;
}

function createClone(object){
	var clone = object.clone(true);
	clone.on("mousedown",selectItem);
	return clone;
}

function createSmallDiamond(event) {
	var x = currentCenterX()+Math.random()*100;
	var y = 500+Math.random()*100;
	createDisplayObject(x, y, "diamond", "cycle");;
}


function createGrandDiamond(event) {
	var x = currentCenterX()+Math.random()*100;
	var y = 500+Math.random()*100;
	createDisplayObject(x, y, "greatDiamond", "greatCycle");
}

function createSeagull(event) {
	var x = currentCenterX()+Math.random()*100;
	var y = 250+Math.random()*100;
	createDisplayObject(x, y, "enemybirds", "seagull");
}

function createDisplayObject(x, y, sprite, currentAnimation) {
	if (isSpriteMode) {
		var obj = createDisplaySprite(x, y, sprite, currentAnimation);
	} else {
		obj = createDisplayShape(x, y, sprite, currentAnimation);
	}
	objCont.addChild(obj);
	obj.on("mousedown", selectItem);
}

function createDisplaySprite(x, y, sprite, currentAnimation) {
	var obj = helpers.createSprite(SpriteSheetData[sprite], currentAnimation, {
		x: x,
		y: y
	});

	obj.stop();
	if (sprite === "enemybirds") {
		obj.on("dblclick", changeBirdType);
		obj.scaleX = 0.5;
		obj.scaleY = 0.5;
	};
	return obj;
}

function createDisplayShape() {}

function onTick(evt) {

	if (inGameMode === true) {
		gameUpdate(evt);
	}
	stage.update();
}

function gameUpdate(evt) {
	CatzRocket.diamondFuel = 10;
	CatzRocket.update(grav, 0, evt);
	var mult = 1;
	if (CatzRocket.hasFrenzy())
		mult = 2;
	catzRocketXpos += evt.delta * (0.3 + 0.3 * Math.cos((CatzRocket.catzRocketContainer.rotation) / 360 * 2 * Math.PI)) * mult;
	CatzRocket.catzRocketContainer.x += catzRocketXpos;
	var x = catzRocketXpos * levelViewScale - 200;
	window.scrollTo(x, 0);
	if (CatzRocket.isCrashed) {
		exitGameMode();
	}
}

function enterGameMode() {
	catzRocketXpos = CatzRocket.catzRocketContainer.x - 200;
	CatzRocket.heightOffset =
		CatzRocket.catzRocketContainer.y - 400;
	CatzRocket.start(CatzRocket.catzVelocity);
	gameClickScreen.alpha = 0.05;
	inGameMode = true;
}


function exitGameMode() {
	CatzRocket.reset();
	CatzRocket.catzRocketContainer.y = catzStartPos.y;
	CatzRocket.catzRocketContainer.x = currentCenterX();
	gameClickScreen.alpha = 0;
	inGameMode = false;
}

function gameMouseDown() {
	mousedown = true;
	CatzRocket.catzUp();
}

function gameMouseUp() {
	console.log("up");
	mousedown = false;
	CatzRocket.catzEndLoop();
}

function getObjType(kid) {
	var type;
	if (kid.currentAnimation === "cycle") {
		type = "diamond";
	} 
	else if (kid.currentAnimation === "greatCycle") {
		type = "greatDiamond";
	} else {
		type = "attackBird";
	}
	return type;
}


function saveLevel() {
	document.getElementById("levelText").innerHTML = "";
	var stringBuilder = ["levelName:[\n"];
	moveChildrenFromSelectedToObjCont();
	sortDisplayObjectArray();
	for (j = 0, len = objCont.numChildren; j < len; j++) {
		kid = objCont.getChildAt(j);
		stringBuilder.push(displayObjectToString(kid));
	}
	levelString = stringBuilder.join("");
	levelString = levelString.substring(0, levelString.length - 2); //slice off the last comma
	levelString += "\n]";
	//window.alert(levelString);
	document.getElementById("levelText").innerHTML = levelString;
}

function sortDisplayObjectArray() {
	objCont.children.sort(function(a, b) {
		return (a.x >= b.x) ? 1 : -1;
	});
}

function displayObjectToString(obj) {
	var x = kid.x -beginningZoneLength;
	var graphicType = getObjType(kid) === "attackBird" ? "attackBird": "sprite" ;
	return '{"x":' +
		x+
		', "y"' +
		YEditorToGame(kid.y) +
		',type:"' +
		getObjType(kid) +
		'","animation":"' +
		kid.currentAnimation +
		'" ,"graphicType":"'+
		graphicType+'"},\n';
}

function loadLevel(offsetX) {
	var ddl = document.getElementById("importSelect");
	var levelName = levels[ddl.selectedIndex];
	if (TrackParts.easy.hasOwnProperty(levelName)) {
		for (var i = TrackParts.easy[levelName].length - 1; i >= 0; i--) {
			var kid = TrackParts.easy[levelName][i];
			createDisplayObject(kid.x + offsetX+beginningZoneLength, YGameToEditor(kid.y), kid.type, kid.currentAnimation);
		};
	} else {
		alert("Doesn't seem to exist");
	}
}

function eraseAndImport(evt) {
	if (confirm("Do you want to load a new level? Unsaved progress will be lost?")) {
		objCont.removeAllChildren();
		loadLevel(0);
	}
}

function addToImport(evt) {
	loadLevel(currentCenterX());
}

function YEditorToGame(y) {
	return y - YOriginPosInGame;
}

function YGameToEditor(y) {
	return y + YOriginPosInGame;
}

function currentCenterX() {
	return window.scrollX / levelViewScale + 200;
}