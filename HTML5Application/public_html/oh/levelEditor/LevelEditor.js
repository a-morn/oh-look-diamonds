var progressBar,
	stage,
	queue,
	canvas,
	isSpriteMode = true,
	levels,
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

	YOriginPosInGame = 830,
	levelLength = 10000,
	levelViewScale = 0.5,
	bgCont = new createjs.Container(),
	objCont = new createjs.Container(),
	selectedCont = new createjs.Container(),
	levelView = new createjs.Container(),
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

	manifest = [{
		id: "enemybirds",
		src: "assets/new assets/sprites/newBirds.png"
	}, {
		id: "diamond",
		src: "assets/new assets/sprites/newDiamond3.png"
	}, {
		id: "mediumDiamond",
		src: "assets/new assets/sprites/newDiamond2.png"
	}, {
		id: "greatDiamond",
		src: "assets/new assets/sprites/newDiamond.png"
	}, {
		id: "diamondShardCounter",
		src: "assets/new assets/img/DiamondIcon.png"
	}, {
		id: "bg",
		src: "assets/new assets/img/background long.jpg"
	}, {
		id: "bgParallax 0",
		src: "assets/new assets/img/background parallax.png"
	}, {
		id: "bgParallax 2",
		src: "assets/new assets/img/background parallax 4.png"
	}, {
		id: "bgParallax 1",
		src: "assets/new assets/img/background parallax 3.png"
	}, {
		id: "onlookers",
		src: "assets/new assets/sprites/onlookers.png"
	}, {
		id: "cloud1",
		src: "assets/new assets/img/cloud 1.png"
	}, {
		id: "cloud2",
		src: "assets/new assets/img/cloud 2.png"
	}, {
		id: "cloud3",
		src: "assets/new assets/img/cloud 3.png"
	}, {
		id: "cloud4",
		src: "assets/new assets/img/cloud 4.png"
	}, {
		id: "cloud5",
		src: "assets/new assets/img/cloud 5.png"
	}, {
		id: "mobHill1",
		src: "assets/new assets/img/mob hill.png"
	}, {
		id: "mobHill2",
		src: "assets/new assets/img/mob hill 2.png"
	}, {
		id: "fgGround",
		src: "assets/new assets/img/fgGround.png"
	}, {
		id: "fgGroundTop",
		src: "assets/new assets/img/fgGroundTop.png"
	}, {
		id: "fgTree1",
		src: "assets/new assets/img/tree 4.png"
	}, {
		id: "rocketCatz",
		src: "assets/new assets/sprites/catzOnly.png"
	}, {
		id: "rocket",
		src: "assets/new assets/img/rocket.png"
	}, {
		id: "flame",
		src: "assets/new assets/sprites/newFlame.png"
	}, {
		id: "star",
		src: "assets/new assets/img/star.png"
	}];

	queue = new createjs.LoadQueue(true);
	queue.on("progress", handleProgress);
	queue.on("complete", handleComplete);
	queue.loadManifest(manifest);
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
	stage.addChild(levelView, dbText);
	stage.removeChild(progressBar);
	createjs.Ticker.on("tick", onTick);
	createjs.Ticker.setFPS(10);
	stage.update();
}

function createLevelView() {
	createBG();
	levelView.addChild(bgCont, objCont, selectedCont);
	levelView.scaleX = levelViewScale;
	levelView.scaleY = levelViewScale;
	document.getElementById("levelEditCanvas").height =
		(bgCoordinates.height + bgCoordinates.offset) * levelViewScale;
	document.getElementById("levelEditCanvas").width = levelLength * levelViewScale;
}



function createBG() {
	for (i = 0, len = levelLength / bgCoordinates.width; i < len; i++) {
		var bgClone = new createjs.Bitmap(queue.getResult("bg"));
		bgClone.x = i * bgCoordinates.width;
		bgClone.y = bgCoordinates.offset;
		if (i % 2 === 0) {
			bgClone.scaleX = -1;
			bgClone.x -= bgCoordinates.width;
		}
		bgCont.addChild(bgClone);
	}
	for (i = 0, len = levelLength / fgCoordinates.width + 1; i < len; i++) {
		var fgClone = new createjs.Bitmap(queue.getResult("fgGround"));
		fgClone.x = fgCoordinates.width * i;
		fgClone.y = 300 + YOriginPosInGame;
		var topClone = new createjs.Bitmap(queue.getResult("fgGroundTop"));
		topClone.x = fgCoordinates.width * i;
		topClone.y = 0;
		bgCont.addChild(fgClone, topClone);
	}
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
	selectedCont.on("mousedown", startPressMove);
	selectedCont.on("pressmove", pressMove);
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

function deleteAllSelected(evt) {
	selectedCont.removeAllChildren();
}

function deleteAll() {
	selectedCont.removeAllChildren();
	objCont.removeAllChildren();

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

function createSmallDiamond(event) {
	var x = currentCenterX();
	var y = 500;
	createDisplayObject(x, y, "diamond", "cycle");;
}

function createMediumDiamond(event) {
	var x = currentCenterX();
	var y = 500;
	createDisplayObject(x, y, "mediumDiamond", "mediumCycle");
}

function createGrandDiamond(event) {
	var x = currentCenterX();
	var y = 500;
	createDisplayObject(x, y, "greatDiamond", "greatCycle");
}

function createSeagull(event) {
	var x = currentCenterX();
	var y = 250;
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

function createDisplayShape() {

}

function onTick(evt) {
	dbText.text = "sC.x : " + selectedCont.x + " sC.y : " + selectedCont.y +
		"\nposOSD.x" + selectPosOnStartDrag.x + "posOSD.y" + selectPosOnStartDrag.y;
	stage.update();
}

function getObjType(kid) {
	var type;
	if (kid.currentAnimation === "cycle") {
		type = "diamond";
	} else if (kid.currentAnimation === "mediumCycle") {
		type = "mediumDiamond";
	} else if (kid.currentAnimation === "greatCycle") {
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
	return '{"x":' +
		kid.x +
		', "y":' +
		YEditorToGame(kid.y) +
		',type:' +
		getObjType(kid) +
		',"animation":' +
		kid.currentAnimation +
		',"graphicType":"sprite"},\n';
}

function loadLevel(offsetX) {
	var ddl = document.getElementById("importSelect");
	var levelName = levels[ddl.selectedIndex];
	if (TrackParts.easy.hasOwnProperty(levelName)) {
		for (var i = TrackParts.easy[levelName].length - 1; i >= 0; i--) {
			var kid = TrackParts.easy[levelName][i];
			createDisplayObject(kid.x + offsetX, YGameToEditor(kid.y), kid.type, kid.currentAnimation);
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