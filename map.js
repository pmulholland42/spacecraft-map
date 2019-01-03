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
const maxZoomLevel = 1000;
var zoomMultipliers = [];

var xOffset = 0;
var yOffset = 0;

const maxWidthDistance = 14960000000; //km
var kmPerPixel = maxWidthDistance /  window.innerWidth;


class Planet {
	constructor(name, parentName, spritePath, diameter, distance) {
		this.name = name;
		this.parent = getPlanet(parentName);
		if (this.parent != null)
			console.log(this.name + "s parent is " + this.parent.name);
		else
			console.log(this.name + " has no parent");
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

// TODO: curve zoom levels
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
		xOffset += zoom * (event.clientX - lastMouseX);
		yOffset += zoom * (event.clientY - lastMouseY);
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
	ctx.strokeStyle = "gray";
	ctx.fillStyle = "white";

	var zoom = zoomMultipliers[currZoomLevel];

	var ex = 0;
	var ey = 0;
	var sx = 0;
	var sy = 0;

	for (var planet of planets)
	{
		// Draw the planet
		var size = (planet.diameter / kmPerPixel) * zoom;
		if (size < 4)
			size = 4;
		ctx.drawImage(planet.sprite, ((planet.x / kmPerPixel) * zoom) - size/2 + (xOffset / zoom), ((planet.y / kmPerPixel) * zoom) - size/2 + (yOffset / zoom), size, size);

		// Draw the orbit
		var parentX;
		var parentY;
		if (planet.parent != null)
		{
			parentX = planet.parent.x;
			parentY = planet.parent.y;
		}
		else
		{
			parentX = 0;
			parentY = 0;
		}
		ctx.beginPath();
		ctx.arc(((parentX / kmPerPixel) * zoom) + xOffset/zoom, ((parentY / kmPerPixel) * zoom) + yOffset/zoom, ((planet.distance / kmPerPixel) * zoom), 0, 2*Math.PI);
		ctx.stroke();

		if (planet.name == "Earth")
		{
			ex = ((planet.x / kmPerPixel) * zoom);
			ey = ((planet.y / kmPerPixel) * zoom);
		}
		else if (planet.name == "Sun")
		{
			sx = ((planet.x / kmPerPixel) * zoom);
			sy = ((planet.y / kmPerPixel) * zoom);
		}

	}

	ctx.fillText("Zoom level: " + currZoomLevel, 100, 100);
	ctx.fillText("Zoom multiplier: " + zoom, 100, 120);
	ctx.fillText("Earth: " + Math.floor(ex) + "," + Math.floor(ey), 100, 150);
	ctx.fillText("Sun: " + Math.floor(sx) + "," + Math.floor(sy), 100, 170);
	ctx.fillText("Offset: " + Math.floor(xOffset) + "," + Math.floor(yOffset), 100, 190);
	ctx.fillText("Screen center: " + window.innerWidth/2 + "," + window.innerHeight/2, 100, 210);
	ctx.fillText("Distance: " + (kmPerPixel*xOffset), 100, 230);

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





