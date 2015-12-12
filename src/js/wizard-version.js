WizardVersion = (function() {
	var wizardVersion = {},
		ctrPressed,
		queue,
		inGameMode = false,
		isSpriteMode = true,
		levels,
		ctrlPressed = false,
		mousedown,
		catzRocketXpos = 0,
		levelLength = 13500,
		levelViewScale = 0.5,
		clipBoard,
		clipOffset = 0,
		levelEditor = {};



	wizardVersion.Init = function() {
		StartGame();
		setEventListeners();
		populateDDL();
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
		$(window).keydown(handleKeyPress);
		$(window).keyup(handleKeyUp);
		cont.select.on("mousedown", GameLogic.StartPressMove);
		cont.select.on("pressmove", GameLogic.PressMove);
	}

	function setEventListenersOnPause() {
		bg.on("mousedown", GameLogic.CreateSelectBox);
		bg.on("pressmove", GameLogic.DragBox);
		bg.on("pressup", GameLogic.SelectWithBox);
		GameLogic.SetObjectEventListeners(true);
	}

	function setEventListenersOnResume() {
		bg.off("mousedown", GameLogic.CreateSelectBox);
		bg.off("pressmove", GameLogic.DragBox);
		bg.off("pressup", GameLogic.SelectWithBox);
		GameLogic.SetObjectEventListeners(false);
	}


	function handleKeyPress(evt) {
		if (evt.keyCode === 32) {
			evt.stopPropagation();
			evt.preventDefault();
			createjs.Ticker.paused = !createjs.Ticker.paused;
			if (createjs.Ticker.paused) {
				setEventListenersOnPause();
			} else {
				setEventListenersOnResume();
			}
		}
		if (evt.ctrlKey) {
			ctrlPressed = true;
		}
		if ((evt.keyCode === 67 || evt.keyCode === 88) && ctrlPressed) {
			GameLogic.CutCopy(evt.keyCode === 67);
		}
		if (evt.keyCode === 86 && ctrlPressed) {
			GameLogic.Paste();
		}
		if (evt.keyCode === 46) {
			GameLogic.DeleteSelected();
		}
	}

	function handleKeyUp(evt) {
		if (evt.ctrlKey) {
			ctrlPressed = false;
		}
	}

	return wizardVersion;
}());