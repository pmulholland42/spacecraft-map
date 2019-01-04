'use strict';

// Page variables
var canvas; 			// <canvas> element
var ctx;				// Canvas rendering context
var errorMessage;
var optionsPanel;
var infoPanel;
var timePanel;
var planetLabel;
var halfScreenWidth = window.innerWidth/2;
var halfScreenHeight = window.innerHeight/2;
var updateCanvas = true;

// Controls
var mouseDown = false;
var draggingPanel = false;
var currentPanel;
var panelX;
var panelY;
var lastMouseX = 0;
var lastMouseY = 0;

// Options
var showOrbits = true;
var showLabels = true;
var showDebug = false;
var keepPlanetCentered = false;

// Zooming, scaling, panning variables
var currZoomLevel = 10;
const minZoomLevel = 1;
const maxZoomLevel = 50;
var zoomMultipliers = [];
var zoom; // The zoom factor
var scaleFactor; // The zoom factor x kmPerPixel
var xCoord = 0; // The coordinates of the center of the screen
var yCoord = 0;
const maxWidthDistance = 14960000000; // When zoomed out all the way, how much distance (km) should the width of the screen take up?
var kmPerPixel = maxWidthDistance /  window.innerWidth; // Kilometers per pixel when zoomed out all the way
const minPlanetSize = 3; // Minimum number of pixels that a planet takes up
const minHitboxSize = 5; // Min number of pixels that can be clicked to select a planet
const tau = Math.PI * 2;
var currentPlanet = "Earth"; // The planet currently selected

// Time
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit" };
var displayedTime = new Date();
var timeDirection = 0; // -1, 0, or 1 for backwards, stopped, or forwards
var timerInterval;


class Planet {
	constructor(name, parentName, spritePath, diameter, distance, type) {
		this.name = name;
		this.parent = getPlanet(parentName);
		this.sprite = new Image();
		this.sprite.src = spritePath;
		this.diameter = diameter;
		this.distance = distance;
		this.type = type;
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
planets.push(new Planet("Sun", null, "assets/sun.png", 1391016, 0, "star"));

planets.push(new Planet("Mercury", "Sun", "assets/mercury.png", 4879, 57909050, "planet"));

planets.push(new Planet("Venus", "Sun", "assets/venus.png", 12104, 108208000, "planet"));

planets.push(new Planet("Earth", "Sun", "assets/earth.png", 12742, 149598023, "planet"));
planets.push(new Planet("Moon", "Earth", "assets/moon.png", 3474, 384400, "moon"));

planets.push(new Planet("Mars", "Sun", "assets/mars.png", 6779, 227939200, "planet"));
planets.push(new Planet("Phobos", "Mars", "assets/phobos.png", 11, 9376, "moon"));
planets.push(new Planet("Deimos", "Mars", "assets/deimos.png", 6.2, 23463, "moon"));

planets.push(new Planet("Jupiter", "Sun", "assets/jupiter.png", 139822, 778570000, "planet"));
planets.push(new Planet("Io", "Jupiter", "assets/io.png", 1821, 421700, "moon"));
planets.push(new Planet("Europa", "Jupiter", "assets/europa.png", 1560.8, 670900, "moon"));
planets.push(new Planet("Ganymede", "Jupiter", "assets/ganymede.png", 2634.1, 1070400, "moon"));
planets.push(new Planet("Callisto", "Jupiter", "assets/callisto.png", 2410.3, 1882700, "moon"));

planets.push(new Planet("Saturn", "Sun", "assets/saturn.png", 116464, 1433530000, "planet"));

planets.push(new Planet("Uranus", "Sun", "assets/uranus.png", 50724, 2875040000, "planet"));

planets.push(new Planet("Neptune", "Sun", "assets/neptune.png", 49244, 4500000000, "planet"));


function init()
{
	// Initialize the canvas
	canvas = document.getElementById("mapcanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext('2d');

	// Set up menus
	errorMessage = document.getElementById("errormessage");
	errorMessage.style.display = "none";

	optionsPanel = document.getElementById("options");
	optionsPanel.style.top = (window.innerHeight*0.1) + "px";
	optionsPanel.style.left = (window.innerWidth*0.7) + "px";

	infoPanel = document.getElementById("info");
	infoPanel.style.top = (window.innerHeight*0.5) + "px";
	infoPanel.style.left = (window.innerWidth*0.1) + "px";

	timePanel = document.getElementById("timeline");
	timePanel.style.top = (window.innerHeight*0.85) + "px";
	timePanel.style.left = (window.innerWidth*0.4) + "px";

	planetLabel = document.getElementById("planetlabel");
	planetLabel.textContent = currentPlanet;

	showOrbits = document.getElementById("orbitsCheck").checked;
	showLabels = document.getElementById("labelsCheck").checked;
	showDebug = document.getElementById("debugCheck").checked;
	keepPlanetCentered = document.getElementById("focusCheck").checked;

	// Set up zoom curve
	// This needs to be tweaked
	for (var i = minZoomLevel; i <= maxZoomLevel; i++)
	{
		zoomMultipliers[i] = Math.pow(2, i/2) / Math.pow(2, 1/2);
	}
	zoom = zoomMultipliers[currZoomLevel];
	scaleFactor = zoom / kmPerPixel;

	// Set up event listeners for input and window resize
	window.addEventListener("wheel", onScroll);
	window.addEventListener("mouseup", onMouseUp);
	window.addEventListener("mousedown", onMouseDown);
	window.addEventListener("mousemove", onMouseMove);
	window.addEventListener("click", onClick);
	window.addEventListener("resize", onWindowResize);
		
	// Start rendering the map
	setInterval(draw, 10);
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
	ctx.font = "24px Courier New";
	
	for (var planet of planets)
	{
		// Draw the planet
		var size = planet.diameter * scaleFactor;
		if (size < minPlanetSize)
			size = minPlanetSize;
		var screenX = (planet.x + xCoord) * scaleFactor - size/2 + halfScreenWidth;
		var screenY = (planet.y + yCoord) * scaleFactor - size/2 + halfScreenHeight;
		ctx.drawImage(planet.sprite, screenX, screenY, size, size);

		// Draw the label
		if (showLabels)
		{
			
			if (planet.type == "planet" || planet.type == "star")
			{
				ctx.textAlign = "center";
				ctx.fillText(planet.name, screenX + size/2, screenY - 20);
			}
			else
			{
				ctx.textAlign = "left";
				ctx.fillText(planet.name, screenX + size + 2, screenY + size/2);
			}
		}

		// Draw the orbit
		if (showOrbits)
		{
			if (planet.name != "Sun")
			{
				ctx.beginPath();
				ctx.arc((planet.parent.x + xCoord) * scaleFactor + halfScreenWidth, (planet.parent.y + yCoord) * scaleFactor + halfScreenHeight, planet.distance * scaleFactor, 0, tau);
				ctx.stroke();
			}
		}
	}

	// Debug info
	if (showDebug)
	{
		ctx.textAlign = "left";
		ctx.fillText("Zoom level: " + currZoomLevel, 100, 100);
		ctx.fillText("Zoom multiplier: " + zoom, 100, 120);
		ctx.fillText("X: " + Math.floor(xCoord), 100, 140);
		ctx.fillText("Y: " + Math.floor(yCoord), 100, 160);
		ctx.fillText("Scale factor: " + scaleFactor, 100, 180);
		ctx.fillText("Selected: " + currentPlanet, 100, 200);
	}

	// On-screen text
	ctx.textAlign = "center";
	ctx.fillStyle = "rgba(0, 255, 0, 1)";
	ctx.fillText("1 pixel = " + Math.floor(kmPerPixel/zoom) + " km", halfScreenWidth, window.innerHeight*0.05);
	ctx.fillText("Time: " + displayedTime.toLocaleDateString("en-US",  dateOptions), halfScreenWidth, window.innerHeight*0.95);
}

// Click to select planets
function onClick(event)
{
	// Check if the user clicked on the canvas or a menu
	if (event.target == canvas)
	{
		// Get the planet that was clicked
		for (var planet of planets)
		{
			var screenX = (planet.x + xCoord) * scaleFactor + halfScreenWidth;
			var screenY = (planet.y + yCoord) * scaleFactor + halfScreenHeight;
			var size = planet.diameter * scaleFactor;
			if (size < minHitboxSize)
				size = minHitboxSize;	

			if (Math.abs(screenX - event.clientX) < size/2 && Math.abs(screenY - event.clientY) < size/2)
			{
				currentPlanet = planet.name;
				planetLabel.textContent = currentPlanet;
				updatePlanetPositions();
				updateCanvas = true;
				break;
			}
		}
	}
}

// Zoom in and out
function onScroll(event)
{
	// Convert the mouse coords to global map coords
	var initialX = (event.clientX - halfScreenWidth) / (zoomMultipliers[currZoomLevel] / kmPerPixel) - xCoord;
	var initialY = (event.clientY - halfScreenHeight) / (zoomMultipliers[currZoomLevel] / kmPerPixel) - yCoord;

	// Scrolling up
	if (event.deltaY < 0)
	{
		if (currZoomLevel < maxZoomLevel)
		{
			currZoomLevel++;
			zoom = zoomMultipliers[currZoomLevel];
			scaleFactor = zoom / kmPerPixel;
		}
	}
	// Scrolling down
	else
	{
		if (currZoomLevel > minZoomLevel)
		{
			currZoomLevel--;
			zoom = zoomMultipliers[currZoomLevel];
			scaleFactor = zoom / kmPerPixel;
		}
	}

	var finalX = (event.clientX - halfScreenWidth) / (zoomMultipliers[currZoomLevel] / kmPerPixel) - xCoord;
	var finalY = (event.clientY - halfScreenHeight) / (zoomMultipliers[currZoomLevel] / kmPerPixel) - yCoord;

	if (!keepPlanetCentered || currentPlanet == null)
	{
		// Adjust the offset so that the coord under the cursor stays the same
		// This is what makes it so you don't just zoom straight in and out, but instead it moves with the mouse
		xCoord -= initialX - finalX;
		yCoord -= initialY - finalY;
	}

	updateCanvas = true;
}

// Click-and-drag
function onMouseDown(event)
{
	mouseDown = true;

	if (event.target == canvas)
	{
		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
	}
	else
	{
		// Start dragging a panel
		// Keep track of where in the div it was clicked so it can be dropped smoothly
		draggingPanel = true;
		currentPanel = event.target;
		var rect = currentPanel.getBoundingClientRect();
		panelX = rect.left - event.clientX;
		panelY = rect.top - event.clientY;
	}
}
function onMouseUp()
{
	mouseDown = false;
	draggingPanel = false;
}
function onMouseMove(event)
{
	if (mouseDown)
	{
		if (draggingPanel)
		{
			// Move the panel that is currently being dragged
			currentPanel.style.left = event.clientX + panelX + "px";
			currentPanel.style.top = event.clientY + panelY + "px";
		}
		else if (!keepPlanetCentered || currentPlanet == null)
		{
			// Pan around the map
			xCoord += (event.clientX - lastMouseX) * kmPerPixel / zoom;
			yCoord += (event.clientY - lastMouseY) * kmPerPixel / zoom;
			lastMouseX = event.clientX;
			lastMouseY = event.clientY;
			updateCanvas = true;
		}
	}
}

// Options checkboxes
function onCheck(event)
{
	if (event.target.id == "orbitsCheck")
		showOrbits = event.target.checked;
	else if (event.target.id == "labelsCheck")
		showLabels = event.target.checked;
	else if (event.target.id == "debugCheck")
		showDebug = event.target.checked;
	else if (event.target.id == "focusCheck")
	{
		keepPlanetCentered = event.target.checked;
		updatePlanetPositions();
	}
	updateCanvas = true;
}

// Window resize
function onWindowResize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	halfScreenWidth = window.innerWidth/2
	halfScreenHeight = window.innerHeight/2;
	kmPerPixel = maxWidthDistance /  window.innerWidth;
	scaleFactor = zoom / kmPerPixel;
	updateCanvas = true;
}


function fastForwardTime()
{
	if (timeDirection != 1)
	{
		clearInterval(timerInterval);
		timerInterval = setInterval(function() {
			displayedTime.setDate(displayedTime.getDate() + 1); 
			updatePlanetPositions();
			updateCanvas = true;
		}, 50);
	}
}
function reverseTime()
{
	if (timeDirection != -1)
	{
		clearInterval(timerInterval);
		timerInterval = setInterval(function() {
			displayedTime.setDate(displayedTime.getDate() - 1);
			updatePlanetPositions();
			updateCanvas = true;
		}, 50);
	}
}
function pauseTime()
{
	clearInterval(timerInterval);
}
function resetTime()
{
	clearInterval(timerInterval);
	displayedTime = new Date();
	updatePlanetPositions();
	updateCanvas = true;
}

function updatePlanetPositions()
{
	for (var planet of planets)
	{
		if (planet.name == "Earth")
		{
			//var now = new Date();
			var start = new Date(displayedTime.getFullYear(), 0, 0);
			var diff = displayedTime - start;
			var oneDay = 1000 * 60 * 60 * 24;
			var day = Math.floor(diff / oneDay);
			var percentOfYear = day/365;
			var radiansAngle = tau * percentOfYear;
			var circleX = Math.cos(radiansAngle);
			var circleY = Math.sin(radiansAngle);
			planet.x = circleX * planet.distance;
			planet.y = circleY * planet.distance;
		}

		if (keepPlanetCentered && planet.name == currentPlanet)
		{
			xCoord = -planet.x;
			yCoord = -planet.y;
		}
	}
}









