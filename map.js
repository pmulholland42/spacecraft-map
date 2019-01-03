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
var currZoomLevel = 27;
const minZoomLevel = 1;
const maxZoomLevel = 50;
var zoomMultipliers = [];
var xCoord = -149598023; // Start at Earth
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

// Planet sizes are measured in km
planets.push(new Planet("Sun", null, "assets/sun.png", 1391016, 0));

planets.push(new Planet("Mercury", "Sun", "assets/mercury.png", 4879, 57909050));

planets.push(new Planet("Venus", "Sun", "assets/venus.png", 12104, 108208000));

planets.push(new Planet("Earth", "Sun", "assets/earth.png", 12742, 149598023));
planets.push(new Planet("Moon", "Earth", "assets/moon.png", 3474, 384400));

planets.push(new Planet("Mars", "Sun", "assets/mars.png", 6779, 227939200));
planets.push(new Planet("Phobos", "Mars", "assets/phobos.png", 11, 9376));
planets.push(new Planet("Deimos", "Mars", "assets/deimos.png", 6.2, 23463));

planets.push(new Planet("Jupiter", "Sun", "assets/jupiter.png", 139822, 778570000));
planets.push(new Planet("Io", "Jupiter", "assets/io.png", 1821, 421700));
planets.push(new Planet("Europa", "Jupiter", "assets/europa.png", 1560.8, 670900));
planets.push(new Planet("Ganymede", "Jupiter", "assets/ganymede.png", 2634.1, 1070400));
planets.push(new Planet("Callisto", "Jupiter", "assets/callisto.png", 2410.3, 1882700));

planets.push(new Planet("Saturn", "Sun", "assets/saturn.png", 116464, 1433530000));

planets.push(new Planet("Uranus", "Sun", "assets/uranus.png", 50724, 2875040000));

planets.push(new Planet("Neptune", "Sun", "assets/neptune.png", 49244, 4500000000));


function init()
{
	// Initialize the canvas
	canvas = document.getElementById("mapcanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext('2d');

	errorMessage = document.getElementById("errormessage");
	errorMessage.style.display = "none";


	// Set up zoom curve
	for (var i = minZoomLevel; i <= maxZoomLevel; i++)
	{
		zoomMultipliers[i] = Math.pow(2, i/2) / Math.pow(2, 1/2);
	}

	// Set up event listeners for input and window resize
	window.addEventListener("wheel", onScroll);
	window.addEventListener("mouseup", onMouseUp);
	window.addEventListener("mousedown", onMouseDown);
	window.addEventListener("mousemove", onMouseMove);
	window.addEventListener("resize", onWindowResize);
		
	// Start rendering the map
	setInterval(draw, 10);
}

// Zoom in and aout
function onScroll(event)
{
	// Convert the mouse coords to global map coords
	var initialX = (event.clientX - halfScreenWidth) / (zoomMultipliers[currZoomLevel] / kmPerPixel) - xCoord;
	var initialY = (event.clientY - halfScreenHeight) / (zoomMultipliers[currZoomLevel] / kmPerPixel) - yCoord;

	// Scrolling up
	if (event.deltaY < 0)
	{
		if (currZoomLevel < maxZoomLevel)
			currZoomLevel++;
	}
	// Scrolling down
	else
	{
		if (currZoomLevel > minZoomLevel)
			currZoomLevel--;
	}

	var finalX = (event.clientX - halfScreenWidth) / (zoomMultipliers[currZoomLevel] / kmPerPixel) - xCoord;
	var finalY = (event.clientY - halfScreenHeight) / (zoomMultipliers[currZoomLevel] / kmPerPixel) - yCoord;

	// Adjust the offset so that the coord under the cursor stays the same
	// This is what makes it so you don't just zoom straight in and out, but instead it moves with the mouse
	xCoord -= initialX - finalX;
	yCoord -= initialY - finalY;

	updateCanvas = true;
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

// Window resize
function onWindowResize()
{
	console.log("Window resize");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	halfScreenWidth = window.innerWidth/2
	halfScreenHeight = window.innerHeight/2;
	kmPerPixel = maxWidthDistance /  window.innerWidth;
	updateCanvas = true;
}

// Draw the map
function draw()
{
	// Only draw when changes are necessary
	if (!updateCanvas) return;

	updateCanvas = false;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = "gray";
	ctx.fillStyle = "white";

	var zoom = zoomMultipliers[currZoomLevel];
	var scaleFactor = zoom / kmPerPixel;

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
	}

	ctx.fillText("Zoom level: " + currZoomLevel, 100, 100);
	ctx.fillText("Zoom multiplier: " + zoom, 100, 120);
	ctx.fillText("X: " + Math.floor(xCoord), 100, 140);
	ctx.fillText("Y: " + Math.floor(yCoord), 100, 160);
	ctx.fillText("Scale factor: " + scaleFactor, 100, 180);
	ctx.fillText("1 pixel = " + Math.floor(kmPerPixel/zoom) + " km", 100, 200);
}






