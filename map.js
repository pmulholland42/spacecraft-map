'use strict';

// Page variables
var canvas; 			// <canvas> HTML tag
var ctx;				// Canvas rendering context
var container;			// <div> HTML tag


function init()
{
	// Initialize the canvas
	console.log("Initializing canvas...");
    canvas = document.getElementById("mapcanvas");
	ctx = canvas.getContext('2d');
		
	// Start rendering the map
	setInterval(draw, 100);
}

// Draw the map
function draw()
{
	
}





