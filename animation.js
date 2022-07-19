"use strict";
let canvas;
let context;
const SCALAR = 3;
const TILE = 16 * SCALAR;
const CHARSIZE = 32;
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
const REVERSE = [DOWN, UP, RIGHT, LEFT];

var state = "playing";

var playerX = 0;
var playerY = .5;
var xDelta = 0;
var yDelta = 0;
var currFace = DOWN;
var moving = false;
var stepFrame = 0;
var validMove = 0;
var progress = 0;

var speakingTo = null;
var globalLine = "";

var allowMovement = true;

var showMap = 0;

var img = new Image(); // Create new img element
img.src = 'img/map.png'; // Set source path
var avi = new Image(); // Create new img element
avi.src = 'img/sprite.png'; // Set source path
var box = new Image(); // Create new img element
box.src = 'img/box.png'; // Set source path



function Trainer(name, sprite, posX, posY, facing) {
	this.name = name;
	this.sprite = sprite;
	this.posX = parseInt(posX);
	this.posY = parseInt(posY);
	this.boundingBox = [[this.posX, this.posY], [this.posX + 1, this.posY], [this.posX, this.posY + 1], [this.posX + 1, this.posY + 1]];
	this.facing = facing;
	this.avi = new Image();
	this.avi.src = "img/" + this.sprite;
	this.dialogue = [];
	this.draw = function() {
		//console.log("facing", this.facing);
		context.drawImage(this.avi, CHARSIZE * this.facing, 0, (this.avi.width / 4), this.avi.height, (canvas.width / 15) * (this.posX / 2), (canvas.height / 10) * (this.posY / 2), canvas.width / 15, canvas.height / 10); // destination rectangle	}
	}


}
var Trainers = Array();

window.onload = init;

function init() {
	//$.post("initdb.php", {"init": 0}, tossCallback)
	$.post("overworld.php", {"init": 0}, processResult)
	$.post("overworld.php", {"loadTrainers": 0}, drawTrainers)
	
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	context.imageSmoothingEnabled = true;
	context.imageSmoothingQuality = 'high';
	
	// Start the first frame request
	window.requestAnimationFrame(gameLoop);
}

function testFront(coords, coords2) {
	for (var i = 0; i < Trainers.length; i++) {
		var firstMatch = false;
		var secondMatch = false;
		for (var j = 0; j < Trainers[i].boundingBox.length; j++) {
		
			if (Trainers[i].boundingBox[j][0] == coords[0] && Trainers[i].boundingBox[j][1] == coords[1]) {
				firstMatch = true;
			}
			if (Trainers[i].boundingBox[j][0] == coords2[0] && Trainers[i].boundingBox[j][1] == coords2[1]) {
				secondMatch = true;
			}
		}
		if (firstMatch && secondMatch) {
			return Trainers[i];
		}
	}
	return null;
}


function tossCallback(data, textStatus) {
	console.log(textStatus)
	console.log(data)
}

function loadDialogue(data, textStatus) {
	var foundSpeech = JSON.parse(data);
	var trainerName = foundSpeech[0]["trainerName"];
	var addDialogue = null;
	for (var i = 0; i < Trainers.length; i++) {
		if (Trainers[i].name == trainerName) {
			addDialogue = Trainers[i];
			break;
		}
	}
	
	for (var i = 0; i < foundSpeech.length; i += 2) {
		addDialogue.dialogue.push([foundSpeech[i]["value"], foundSpeech[i + 1]["value"]]);
	}
	addDialogue.dialogueState = 0;
}

function drawTrainers(data, textStatus) {
	var loadedTrainers = JSON.parse(data);
	for (var i = 0; i < loadedTrainers.length; i++) {
		var t = loadedTrainers[i];
		var newT = new Trainer(t["name"], t["sprite"], t["posX"], t["posY"], t["facing"])
		Trainers.push(newT);
		$.post("overworld.php", {"trainer": newT["name"]}, loadDialogue)
	}
}

var delta = 50;
var oldTime = 0;
function gameLoop(timeStamp) {
	if (oldTime === 0) {
		oldTime = timeStamp;
	}
	
	if ((timeStamp - oldTime) >= delta){
		context.clearRect(0, 0, canvas.width, canvas.height);
		draw();
		for (var i = 0; i < Trainers.length; i++) {
			Trainers[i].draw();
		}
		playerX += xDelta;
		playerY += yDelta;
		if (moving) {
			if (stepFrame == 0 || stepFrame == 3) {
				movePlayer(playerX, playerY, currFace, false);
				stepFrame++;
			} else if (stepFrame == 4) {
				movePlayer(playerX, playerY, currFace, false);
				xDelta = 0;
				yDelta = 0;
				moving = false;
				allowMovement = true;
			} else {
				movePlayer(playerX, playerY, currFace, true);
				stepFrame++;
			}
		} else {
			movePlayer(playerX, playerY, currFace, false);
		}
		drawText();
		oldTime = timeStamp;
	}

	window.requestAnimationFrame(gameLoop);
}



function movePlayer(x, y, facing, step) {
	// Pick a new frame
	var column = 0;
	if (step) {
		column = stepFrame;
	}
	context.drawImage(avi, column * 32, CHARSIZE * facing, (avi.width / 3), (avi.height / 4), (canvas.width / 15) * x, (canvas.height / 10) * y, canvas.width / 15, canvas.height / 10); // destination rectangle
}

var fontBase = 1000,                   // selected default width for canvas
    fontSize = 27;                     // default size for font

function getFont() {
    var ratio = fontSize / fontBase;   // calc ratio
    var size = canvas.width * ratio;   // get font size based on current width
    return (size|0) + 'px monospace'; // set font
}

function drawText() {
	if (state == "talking") {
		context.drawImage(box, 0, 0, box.width, box.height, 0, canvas.height - (canvas.height / 3), canvas.width, canvas.height / 3);
		context.font = getFont();
		context.fillText(speakingTo.dialogue[speakingTo.dialogueState][0], canvas.width / 11.6, canvas.height / 1.25);
		context.fillText(speakingTo.dialogue[speakingTo.dialogueState][1], canvas.width / 11.6, canvas.height / 1.15);
	}
}

function draw() {
	context.canvas.width  = window.innerWidth / 1.05;
	context.canvas.height = window.innerHeight / 1.1;
	context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

}

// 11.5
// 1.238

function processResult (data, textStatus) {
	//console.log(data);
	if (data == "1") {
		if (currFace == RIGHT) { // right
			xDelta = .1;
		} else if (currFace == LEFT) { // left
			xDelta = -.1;
		} else if (currFace == UP) { // up
			yDelta = -.1;
		} else if (currFace == DOWN) { // down
			yDelta = .1;
		} else {
			return 0;
		}
	}
	allowMovement = false;
	stepFrame = 0;
	moving = true;
}

function animateScript(event) {
	if (!allowMovement) {
		return;
	}
	var posX = Math.round((playerX * 2));
	var posY = Math.round((playerY * 2)) + 1;

	if (state == "playing") {
		if (event.keyCode == 39 || event.keyCode == 68) { // right
			currFace = RIGHT;
			console.log("X:", posX + 1, "Y:", posY)
			$.post("overworld.php", {"checkMovement": {"direction": currFace, "x": posX + 1, "y": posY}}, processResult)
		} else if (event.keyCode == 37 || event.keyCode == 65) { // left
			currFace = LEFT;
			console.log("X:", posX, "Y:", posY)
			$.post("overworld.php", {"checkMovement": {"direction": currFace, "x": posX, "y": posY}}, processResult)
		} else if (event.keyCode == 38 || event.keyCode == 87) { // up
			currFace = UP;
			console.log("X:", posX, "Y:", posY)
			$.post("overworld.php", {"checkMovement": {"direction": currFace, "x": posX, "y": posY}}, processResult)
		} else if (event.keyCode == 40 || event.keyCode == 83) { // down
			currFace = DOWN;
			console.log("X:", posX, "Y:", posY)
			$.post("overworld.php", {"checkMovement": {"direction": currFace, "x": posX, "y": posY}}, processResult)
		} else if (event.keyCode == 13) {
			if (showMap) {
				$("canvas").show();
				$("#demo").hide();
				showMap = 0;
			} else {
				$("canvas").hide()
				if (currFace == RIGHT) { // right
					$("#demo").load("overworld.php", {"printArray": {"direction": currFace, "x": posX + 1, "y": posY}}).css("font-family", "monospace, monospace").show()
				} else if (currFace == LEFT) { // left
					$("#demo").load("overworld.php", {"printArray": {"direction": currFace, "x": posX, "y": posY}}).css("font-family", "monospace, monospace").show()
				} else if (currFace == UP) { // up
					$("#demo").load("overworld.php", {"printArray": {"direction": currFace, "x": posX, "y": posY}}).css("font-family", "monospace, monospace").show()
				} else if (currFace == DOWN) { // down
					$("#demo").load("overworld.php", {"printArray": {"direction": currFace, "x": posX, "y": posY}}).css("font-family", "monospace, monospace").show()
				} 
				showMap = 1;
			}
		}
	}

	if (event.keyCode == 32 && state == "playing") {
		if (currFace == RIGHT) { // right
			speakingTo = testFront([posX + 2, posY - 1], [posX + 2, posY]);
		} else if (currFace == LEFT) { // left
			speakingTo = testFront([posX - 1, posY], [posX - 1, posY - 1]);
		} else if (currFace == UP) { // up
			speakingTo = testFront([posX, posY - 1], [posX + 1, posY - 1]);
		} else if (currFace == DOWN) { // down
			speakingTo = testFront([posX, posY + 1], [posX + 1, posY + 1]);
		} else {
			alert("none found!")
		}
		if (speakingTo) {
			speakingTo.facing = REVERSE[currFace];
			state = "talking";
		}
	} else if (event.keyCode == 32 && state == "talking") {
		if (speakingTo.dialogueState == speakingTo.dialogue.length - 1) {
			speakingTo.dialogueState = 0;
			if (speakingTo.name == "Wealthy" || speakingTo.name == "Leader" || speakingTo.name == "Lady") {
				state = "playing";
				location.replace("./combat.html")
			} else {
				speakingTo = null;
				state = "playing";
			}
		} else {
			speakingTo.dialogueState++;
		}
	}

} 
 // 960 x 1440
// 30 x 20

$(window).resize(function () { 
	draw();
 });


