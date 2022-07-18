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


var playerX = 0;
var playerY = .5;
var xDelta = 0;
var yDelta = 0;
var currFace = DOWN;
var moving = false;
var stepFrame = 0;
var validMove = 0;
var progress = 0;

var allowMovement = true;

var showMap = 0;

var img = new Image(); // Create new img element
img.src = 'img/map.png'; // Set source path
var avi = new Image(); // Create new img element
avi.src = 'img/sprite.png'; // Set source path

window.onload = init;

function init() {
	$.post("overworld.php", {"init": 0}, processResult)
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	context.imageSmoothingEnabled = true;
	context.imageSmoothingQuality = 'high';
	
	// Start the first frame request
	window.requestAnimationFrame(gameLoop);
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
		oldTime = timeStamp;
	}

	window.requestAnimationFrame(gameLoop);
}


// function move(direction) {
// 	if (direction == )
// }

function movePlayer(x, y, facing, step) {
	// Pick a new frame
	var column = 0;
	if (step) {
		column = stepFrame;
	}
	context.drawImage(avi, column * 32, CHARSIZE * facing, (avi.width / 3), (avi.height / 4), (canvas.width / 15) * x, (canvas.height / 10) * y, canvas.width / 15, canvas.height / 10); // destination rectangle
}



function draw() {
	context.canvas.width  = window.innerWidth / 1.05;
	context.canvas.height = window.innerHeight / 1.1;
	context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height); // destination rectangle
	//console.log(img.height);

	//context.drawImage(img, 0, 0, img.width * SCALAR, img.height * SCALAR);

	//context.drawImage(avi, 0, 0, CHARSIZE * 2, CHARSIZE * 2, 0, TILE * 2, avi.width * SCALAR, avi.height * SCALAR);
}


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
	} else if (event.keyCode == 32) {
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
	} else {
		return 0;
	}
} 
 // 960 x 1440
// 30 x 20

$(window).resize(function () { 
	draw();
 });


