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

var allowMovement = true;

var img = new Image(); // Create new img element
img.src = 'img/map.png'; // Set source path
var avi = new Image(); // Create new img element
avi.src = 'img/sprite.png'; // Set source path

window.onload = init;

function init(){
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

function animateScript(event) {
	if (!allowMovement) {
		return;
	}

	if (event.keyCode == 39 || event.keyCode == 68) { // right
		if (playerX < 13.5) {
			xDelta = .1;
		} else {
			xDelta = 0;
		}
		currFace = RIGHT;
	} else if (event.keyCode == 37 || event.keyCode == 65) { // left
		if (playerX > 0) {
			xDelta = -.1;
		} else {
			xDelta = 0;
		}
		currFace = LEFT;
	} else if (event.keyCode == 38 || event.keyCode == 87) { // up
		if (playerY > 0) {
			yDelta = -.1;
		} else {
			yDelta = 0;
		}
		currFace = UP;
	} else if (event.keyCode == 40 || event.keyCode == 83) { // down
		if (playerY < 8.5) {
			yDelta = .1;
		} else {
			yDelta = 0;
		}
		currFace = DOWN;
	} else {
		return 0;
	}
	allowMovement = false;
	stepFrame = 0;
	moving = true;
} 
 // 960 x 1440
// 30 x 20

$(window).resize(function () { 
	draw();
 });


