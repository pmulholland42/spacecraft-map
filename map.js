'use strict';

// Page variables
var canvas; 			// <canvas> HTML tag
var ctx;				// Canvas rendering context
var container;			// <div> HTML tag
var errorMessage;

var currZoomLevel;
const minZoomLevel = 1;
const maxZoomLevel = 200;


const sunSprite = new Image();
const mercurySprite = new Image();
const venusSprite = new Image();
const earthSprite = new Image();
const marsSprite = new Image();
const jupiterSprite = new Image();
const saturnSprite = new Image();
const uranusSprite = new Image();
const neptuneSprite = new Image();

const earthSize = 1;


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
	earthSprite.src = "assets/earth.png";

	currZoomLevel = 10;
	window.addEventListener("wheel", onScroll);
		
	// Start rendering the map
	setInterval(draw, 1000);
	//draw();
}

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

	var size = earthSize * currZoomLevel;
	console.log(size);

	ctx.drawImage(earthSprite, canvas.width/2 - size/2, canvas.height/2 - size/2, size, size);

}





