'use strict';

// Page variables
var canvas; 			// <canvas> HTML tag
var ctx;				// Canvas rendering context
var container;			// <div> HTML tag
var errorMessage;

var currZoomLevel;
const minZoomLevel = 1;
const maxZoomLevel = 200;


class Planet {
	constructor(sprite, radius) {
		this.sprite = sprite;
		this.radius = radius;
	}
}

// Planet sizes are in Earth radii
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

	currZoomLevel = 10;
	window.addEventListener("wheel", onScroll);
		
	// Start rendering the map
	setInterval(draw, 1000);
	//draw();
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
			draw();
		}

	}
	// Scrolling down
	else
	{
		console.log("Scrolling down");
		if (currZoomLevel > minZoomLevel)
		{
			currZoomLevel--;
			draw();
		}
	}
}

// Draw the map
function draw()
{
	console.log("Draw");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var size = earth.radius * currZoomLevel;
	console.log(size);

	ctx.drawImage(earth.sprite, canvas.width/2 - size/2, canvas.height/2 - size/2, size, size);

}





