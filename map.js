'use strict';

// Page variables
var canvas; 			// <canvas> HTML tag
var ctx;				// Canvas rendering context
var container;			// <div> HTML tag
var errorMessage;

var updateCanvas = true;

// Controls
var mouseDown = false;
var lastMouseX = 0;
var lastMouseY = 0;

var currZoomLevel;
const minZoomLevel = 1;
const maxZoomLevel = 200;

var xOffset = 0;
var yOffset = 0;


class Planet {
	constructor(sprite, diameter) {
		this.sprite = sprite;
		this.diameter = diameter;
	}
}

// Planet sizes are in Earth diameters
// TODO: put these in an array, with string attributes as their names
const sun = new Planet(new Image(), 109);
const mercury = new Planet(new Image(), 0.382);
const venus = new Planet(new Image(), 0.95);
const earth = new Planet(new Image(), 1);
const moon = new Planet(new Image, 0.27);
const mars = new Planet(new Image(), 0.53);
const jupiter = new Planet(new Image(), 11);
const saturn = new Planet(new Image(), 9.5);
const uranus = new Planet(new Image(), 4);
const neptune = new Planet(new Image(), 3.9);


function init()
{
	// Initialize the canvas
	console.log("Initializing canvas...");
	canvas = document.getElementById("mapcanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext('2d');

	errorMessage = document.getElementById("errormessage");
	errorMessage.style.display = "none";

	// Load in sprites
	earth.sprite.src = "assets/earth.png";
	earth.x = 0;
	earth.y = 0;

	moon.sprite.src = "assets/moon.png";
	moon.x = 30.17;
	moon.y = 0;

	currZoomLevel = 10;
	window.addEventListener("wheel", onScroll);
	window.addEventListener("mouseup", onMouseUp);
	window.addEventListener("mousedown", onMouseDown);
	window.addEventListener("mousemove", onMouseMove);
		
	// Start rendering the map
	setInterval(draw, 10);
}

// TODO: curve zoom levels
function onScroll(event)
{
	// Scrolling up
	if (event.deltaY < 0)
	{
		console.log("Scrolling up");
		if (currZoomLevel < maxZoomLevel)
		{
			currZoomLevel++;
			updateCanvas = true;
		}

	}
	// Scrolling down
	else
	{
		console.log("Scrolling down");
		if (currZoomLevel > minZoomLevel)
		{
			currZoomLevel--;
			updateCanvas = true;
		}
	}
}

// Click-and-drag
function onMouseDown(event)
{
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}
function onMouseUp()
{
	mouseDown = false;
}
function onMouseMove(event)
{
	if (mouseDown)
	{
		xOffset += (event.clientX - lastMouseX);
		yOffset += (event.clientY - lastMouseY);
		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
		updateCanvas = true;
		console.log("dragging");
	}
}

// Draw the map
function draw()
{
	if (!updateCanvas) return;

	updateCanvas = false;

	console.log("Draw");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var size = earth.diameter * currZoomLevel;

	ctx.drawImage(earth.sprite, (earth.x * currZoomLevel) - size/2 + xOffset, (earth.y * currZoomLevel) - size/2 + yOffset, size, size);

	size = moon.diameter * currZoomLevel;

	ctx.drawImage(moon.sprite, (moon.x * currZoomLevel) - size/2 + xOffset, (moon.y * currZoomLevel) - size/2 + yOffset, size, size);

}





