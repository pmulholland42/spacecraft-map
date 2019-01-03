'use strict';

// Page variables
var canvas; 			// <canvas> HTML tag
var ctx;				// Canvas rendering context
var container;			// <div> HTML tag
var errorMessage;

var updateCanvas = false;

// Controls
var mouseDown = false;
var lastMouseX = 0;
var lastMouseY = 0;

var currZoomLevel;
const minZoomLevel = 1;
const maxZoomLevel = 20000;

var xOffset = 500;
var yOffset = 500;

const maxWidthDistance = 14960000000; //km
var kmPerPixel = maxWidthDistance /  window.innerWidth;


class Planet {
	constructor(name, spritePath, diameter, distance) {
		this.name = name;
		this.sprite = new Image();
		this.sprite.src = spritePath;
		this.diameter = diameter;
		this.distance = distance;
		this.x = this.distance;
		this.y = 0;
	}
}

var planets = [];

// Planet sizes are measured in km
planets.push(new Planet("Sun", "assets/sun.png", 1391016, 0));
planets.push(new Planet("Mercury", "assets/mercury.png", 4879, 57909050));
planets.push(new Planet("Venus", "assets/venus.png", 12104, 0));
planets.push(new Planet("Earth", "assets/earth.png", 12742, 0));
planets.push(new Planet("Moon", "assets/moon.png", 3474, 0));
planets.push(new Planet("Mars", "assets/mars.png", 6779, 0));
planets.push(new Planet("Jupiter", "assets/jupiter.png", 139822, 0));
planets.push(new Planet("Saturn", "assets/saturn.png", 116464, 0));
planets.push(new Planet("Uranus", "assets/uranus.png", 50724, 0));
planets.push(new Planet("Neptune", "assets/neptune.png", 49244, 0));


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
			currZoomLevel+=20;
			updateCanvas = true;
		}

	}
	// Scrolling down
	else
	{
		console.log("Scrolling down");
		if (currZoomLevel > minZoomLevel)
		{
			currZoomLevel-=20;
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

	for (var planet of planets)
	{
		var size = (planet.diameter / kmPerPixel) * currZoomLevel;
		if (size < 2)
			size = 2;
		ctx.drawImage(planet.sprite, ((planet.x / kmPerPixel) * currZoomLevel) - size/2 + xOffset, ((planet.y / kmPerPixel) * currZoomLevel) - size/2 + yOffset, size, size);

	}
}





