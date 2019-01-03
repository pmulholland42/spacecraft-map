'use strict';

// Page variables
var canvas; 			// <canvas> HTML tag
var ctx;				// Canvas rendering context
var container;			// <div> HTML tag
var errorMessage;
var halfScreenWidth = window.innerWidth/2;
var halfScreenHeight = window.innerHeight/2;
var updateCanvas = true;

// Controls
var mouseDown = false;
var lastMouseX = 0;
var lastMouseY = 0;

// Zooming, scaling, panning variables
var currZoomLevel;
const minZoomLevel = 1;
const maxZoomLevel = 1000;
var zoomMultipliers = [];
var xCoord = 0;
var yCoord = 0;
const maxWidthDistance = 14960000000; //km
var kmPerPixel = maxWidthDistance /  window.innerWidth;
const minPlanetSize = 3; // Minimum number of pixels that a planet takes up
const tau = Math.PI * 2;


class Planet {
	constructor(name, parentName, spritePath, diameter, distance) {
		this.name = name;
		this.parent = getPlanet(parentName);
		this.sprite = new Image();
		this.sprite.src = spritePath;
		this.diameter = diameter;
		this.distance = distance;
		if (this.parent != null)
		{
			this.x = this.parent.x + distance;
		}
		else
		{
			this.x = 0;
		}
		this.y = 0;
	}
}

var planets = [];

// Planet sizes are measured in km
planets.push(new Planet("Sun", null, "assets/sun.png", 1391016, 0));
planets.push(new Planet("Mercury", "Sun", "assets/mercury.png", 4879, 57909050));
planets.push(new Planet("Venus", "Sun", "assets/venus.png", 12104, 108208000));
planets.push(new Planet("Earth", "Sun", "assets/earth.png", 12742, 149598023));
planets.push(new Planet("Moon", "Earth", "assets/moon.png", 3474, 384400));
planets.push(new Planet("Mars", "Sun", "assets/mars.png", 6779, 227939200));
planets.push(new Planet("Jupiter", "Sun", "assets/jupiter.png", 139822, 778570000));
planets.push(new Planet("Saturn", "Sun", "assets/saturn.png", 116464, 1433530000));
planets.push(new Planet("Uranus", "Sun", "assets/uranus.png", 50724, 2875040000));
planets.push(new Planet("Neptune", "Sun", "assets/neptune.png", 49244, 4500000000));


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

	for (var i = 1; i <= 1000; i++)
	{
		zoomMultipliers[i] = i*i/2;
	}

	// Set up input
	window.addEventListener("wheel", onScroll);
	window.addEventListener("mouseup", onMouseUp);
	window.addEventListener("mousedown", onMouseDown);
	window.addEventListener("mousemove", onMouseMove);
		
	// Start rendering the map
	setInterval(draw, 10);
}

function onScroll(event)
{
	// Scrolling up
	if (event.deltaY < 0)
	{
		if (currZoomLevel < maxZoomLevel)
		{
			
			currZoomLevel++;
			updateCanvas = true;
		}

	}
	// Scrolling down
	else
	{
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
		var zoom = zoomMultipliers[currZoomLevel];
		xCoord += (event.clientX - lastMouseX) * kmPerPixel / zoom;
		yCoord += (event.clientY - lastMouseY) * kmPerPixel / zoom;
		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
		updateCanvas = true;
	}
}

// Draw the map
function draw()
{
	if (!updateCanvas) return;

	updateCanvas = false;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	halfScreenWidth = window.innerWidth/2
	halfScreenHeight = window.innerHeight/2;

	ctx.strokeStyle = "gray";
	ctx.fillStyle = "white";

	var zoom = zoomMultipliers[currZoomLevel];
	var scaleFactor = zoom / kmPerPixel;

	var ex = 0;
	var ey = 0;
	var sx = 0;
	var sy = 0;

	for (var planet of planets)
	{
		// Draw the planet
		var size = planet.diameter * scaleFactor;
		if (size < minPlanetSize)
			size = minPlanetSize;
		ctx.drawImage(planet.sprite, (planet.x + xCoord) * scaleFactor - size/2 + halfScreenWidth, (planet.y + yCoord) * scaleFactor - size/2 + halfScreenHeight, size, size);

		// Draw the orbit
		if (planet.name != "Sun")
		{
			ctx.beginPath();
			ctx.arc((planet.parent.x + xCoord) * scaleFactor + halfScreenWidth, (planet.parent.y + yCoord) * scaleFactor + halfScreenHeight, planet.distance * scaleFactor, 0, tau);
			ctx.stroke();
		}

		if (planet.name == "Earth")
		{
			ex = planet.x * scaleFactor;
			ey = planet.y * scaleFactor;
		}
		else if (planet.name == "Sun")
		{
			sx = planet.x * scaleFactor;
			sy = planet.y * scaleFactor;
		}

	}

	ctx.fillText("Zoom level: " + currZoomLevel, 100, 100);
	ctx.fillText("Zoom multiplier: " + zoom, 100, 120);
	ctx.fillText("Earth: " + Math.floor(ex) + "," + Math.floor(ey), 100, 150);
	ctx.fillText("Sun: " + Math.floor(sx) + "," + Math.floor(sy), 100, 170);
	ctx.fillText("X: " + Math.floor(xCoord), 100, 190);
	ctx.fillText("Y: " + Math.floor(yCoord), 100, 210);
	ctx.fillText("Screen center: " + halfScreenWidth + "," + halfScreenHeight, 100, 230);
	ctx.fillText("Distance: " + (kmPerPixel*xCoord), 100, 250);
	ctx.fillText("Scale factor: " + scaleFactor, 100, 270);

}

function getPlanet(name)
{
	for (var planet of planets)
	{
		if (planet.name == name)
		{
			return planet;
		}
	}
	return null;
}





