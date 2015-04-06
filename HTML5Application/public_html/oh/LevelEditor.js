var progressBar,
	stage,
	queue,
	canvas,
	levels,
	levelViewScale = 0.3,
	bgCoordinates = {
		width: 800,
		height: 1800,
		offset: -520
	}
fgCoordinates = {
	height: 150,
	width: 2000
}
YOriginPosInGame = 830,
	levelLength = 10000,
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
	//	createToolView();
	stage.addChild(levelView);
	stage.removeChild(progressBar);
	createjs.Ticker.on("tick", onTick);
	createjs.Ticker.setFPS(10);
	stage.update();
}

function createLevelView() {
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
	for (i = 0, len = levelLength / fgCoordinates.width; i < len; i++) {
		var fgClone = new createjs.Bitmap(queue.getResult("fgGround"));
		fgClone.x = fgCoordinates.width * i;
		fgClone.y = bgCoordinates.height + bgCoordinates.offset - fgCoordinates.height;
		var topClone = new createjs.Bitmap(queue.getResult("fgGroundTop"));
		topClone.x = fgCoordinates.width * i;
		topClone.y = 0;
		bgCont.addChild(fgClone, topClone);
	}
	levelView.addChild(bgCont, objCont);
	levelView.scaleX = levelViewScale;
	levelView.scaleY = levelViewScale;
	document.getElementById("levelEditCanvas").height =
		(bgCoordinates.height + bgCoordinates.offset) * levelViewScale;
	document.getElementById("levelEditCanvas").width = levelLength * levelViewScale;
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


function pressMove(evt) {
	evt.currentTarget.x = evt.stageX / levelViewScale + 25;
	evt.currentTarget.y = evt.stageY / levelViewScale + 25;
	stage.update();
}

function deleteAllSelected(evt) {

}

function changeDiamondSize(evt) {
	var x = evt.currentTarget.x;
	var y = evt.currentTarget.y;
	if (evt.currentTarget.currentAnimation === "cycle") {
		createDiamond(x, y, "medium");
	} else if (evt.currentTarget.currentAnimation === "mediumCycle") {
		createDiamond(x, y, "great");
	} else {
		createDiamond(x, y, "small");
	}
	evt.currentTarget.parent.removeChild(evt.currentTarget);
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

function dragBox(evt) {}

function SelectWithBox(evt) {}

function createSmallDiamond(event) {
	var x = CurrentCenterX();
	var y = 500;
	createDiamond(x, y, "small");;
}

function createMediumDiamond(event) {
	var x = CurrentCenterX();
	var y = 500;
	createDiamond(x, y, "medium");
}

function createGreatDiamond(event) {
	var x = CurrentCenterX();
	var y = 500;
	createDiamond(x, y, "great");
}

function createSeagull(event) {
	var x = CurrentCenterX();
	var y = 250;
	createBird(x, y, "seagull");
}

function createDiamond(x, y, type) {
	if (type === "medium") {
		diamond = helpers.createSprite(SpriteSheetData.mediumDiamond, "mediumCycle", {
			x: x,
			y: y
		});
	} else if (type === "great") {
		diamond = helpers.createSprite(SpriteSheetData.greatDiamond, "greatCycle", {
			x: x,
			y: y
		});
	} else {
		diamond = helpers.createSprite(SpriteSheetData.diamond, "cycle", {
			x: x,
			y: y
		});
	}
	objCont.addChild(diamond);
	diamond.addEventListener("pressmove", pressMove);
	diamond.addEventListener("dblclick", changeDiamondSize);
	diamond.stop();
}


function createBird(x, y, typeOfBird) {
	var bird = helpers.createSprite(SpriteSheetData.enemybirds, typeOfBird, {
		x: x,
		y: y,
		scaleX: 0.5,
		scaleY: 0.5
	});
	bird.stop();
	bird.on("dblclick", changeBirdType);
	bird.on("pressmove", pressMove);
	objCont.addChild(bird);
}

function onTick(evt) {
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
	var objList = getSortedDisplayObjectArray();
	for (j = 0, len = objList.length; j < len; j++) {
		kid = objList.children[j];
		stringBuilder.push(displayObjectToString(kid));
	}
	levelString = stringBuilder.join("");
	levelString = levelString.substring(0, levelString.length - 2); //slice off the last comma
	levelString += "\n]";
	//window.alert(levelString);
	document.getElementById("levelText").innerHTML = levelString;
}

function getSortedDisplayObjectArray() {
	var objList = objCont.children.slice(0);
	objList.sort(function(a, b) {
		return (a.x <= b.x) ? a : b
	});
	return objList;
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

function loadLevel() {
	var ddl = document.getElementById("importSelect");
	var levelName = levels[ddl.selectedIndex];
	if (TrackParts.easy.hasOwnProperty(levelName)) {
		objCont.removeAllChildren();
		for (var i = TrackParts.easy[levelName].length - 1; i >= 0; i--) {
			var kid = TrackParts.easy[levelName][i];
			switch (kid.type) {
				case "diamond":
					createDiamond(kid.x, YGameToEditor(kid.y), "small");
					break;
				case "mediumDiamond":
					createDiamond(kid.x, YGameToEditor(kid.y), "medium");
					break;
				case "greatDiamond":
					createDiamond(kid.x, YGameToEditor(kid.y), "great");
					break;
				case "attackBird":
					createBird(kid.x, YGameToEditor(kid.y), kid.animation);
					break;
				case "thunder":
					createThunder(kid.x, YGameToEditor(kid.y));
					break;
			}
		};
	} else {
		alert("Doesn't seem to exist");
	}
}

function eraseAndImport(evt) {
	objCont.removeAllChildren();
	loadLevel(0);
}

function addToImport(evt) {
	objCont.removeAllChildren();
	loadLevel(CurrentCenterX());
}

function YEditorToGame(y) {
	return y - YOriginPosInGame;
}

function YGameToEditor(y) {
	return y + YOriginPosInGame;
}

function CurrentCenterX() {
	return window.pageXOffset / levelViewScale + 200;
}