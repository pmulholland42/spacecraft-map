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
const noObjectSelected = "No object selected";

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
const zoomMultiplierMoonThreshold = 256;
var scaleFactor; // The zoom factor x kmPerPixel
var xCoord = 0; // The coordinates of the center of the screen
var yCoord = 0;
const maxWidthDistance = 14960000000; // When zoomed out all the way, how much distance (km) should the width of the screen take up?
var kmPerPixel = maxWidthDistance /  window.innerWidth; // Kilometers per pixel when zoomed out all the way
const minPlanetSize = 4; // Minimum number of pixels that a planet takes up
const minHitboxSize = 10; // Min number of pixels that can be clicked to select a planet
const tau = Math.PI * 2;
var currentPlanet = null; // The planet currently selected

// Time
const epoch = Date.UTC(2000, 0, 1, 12, 0, 0); // J2000 epoch: January 1, 2000
const oneDay = 86400000; // Number of milliseconds in one day
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit" };
var displayedTime = new Date();
var timeDirection = 0; // -1, 0, or 1 for backwards, stopped, or forwards
var timerInterval;


class Planet {
	/**
	 * @param {string} name - The name of the object
	 * @param {string} parentName - The name of the object that this object orbits
	 * @param {string} spritePath - The file path and name of the image for this object
	 * @param {number} diameter - The diameter of the object, in kilometers
	 * @param {number} semiMajorAxis - The semi-major axis of the object's orbit, in kilometers
	 * @param {number} period - The period of the object's orbit, in days
	 * @param {number} eccentricity - The eccentricity of the object's orbit. Should be between 0 and 1.
	 * @param {number} meanAnomalyAtEpoch - The mean anomaly of the object's orbit at J2000, in degrees
	 * @param {string} type - The type of object, eg. star, planet, or moon
	 */
	constructor(name, parentName, spritePath, diameter, semiMajorAxis, period, eccentricity, meanAnomalyAtEpoch, type) {
		this.name = name;
		this.parent = getPlanet(parentName);
		this.sprite = new Image();
		this.sprite.src = spritePath;
		this.diameter = diameter;
		this.semiMajorAxis = semiMajorAxis;
		this.period = period;
		this.eccentricity = eccentricity;
		this.semiMinorAxis = this.semiMajorAxis * Math.sqrt(1-Math.pow(this.eccentricity, 2)); // b = a * sqrt(1 - e^2)
		this.distanceFromCenterToFocus = Math.sqrt(Math.pow(this.semiMajorAxis, 2) - Math.pow(this.semiMinorAxis, 2)); // c^2 = a^2 - b^2
		this.meanMotion = tau / this.period;
		this.rotation = 0; // rotation of the orbit
		this.meanAnomalyAtEpoch = meanAnomalyAtEpoch * Math.PI / 180;
		this.meanAnomaly = 0;
		this.eccentricAnomaly = 0;
		this.trueAnomaly = 0;
		this.type = type;
		if (this.parent != null)
		{
			this.x = this.parent.x + semiMajorAxis;
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
planets.push(new Planet("Sun", null, "assets/sun.png", 1391016, 0, 0, 0, 0, "star"));

planets.push(new Planet("Mercury", "Sun", "assets/mercury.png", 4879, 57909050, 87.969, 0.205630, 174.796, "planet"));

planets.push(new Planet("Venus", "Sun", "assets/venus.png", 12104, 108208000, 224.701, 0.006772, 50.115, "planet"));

planets.push(new Planet("Earth", "Sun", "assets/earth.png", 12742, 149598023, 365.256363004, 0.0167086, 358.617, "planet"));
planets.push(new Planet("Moon", "Earth", "assets/moon.png", 3474, 384400, 27.321661, 0.0549, 0, "moon"));

planets.push(new Planet("Mars", "Sun", "assets/mars.png", 6779, 227939200, 686.971, 0.0934, 19.387, "planet"));
planets.push(new Planet("Phobos", "Mars", "assets/phobos.png", 11, 9376, 0.31891023, 0.0151, 0, "moon"));
planets.push(new Planet("Deimos", "Mars", "assets/deimos.png", 6.2, 23463, 1.263, 0.00033, 0, "moon"));

planets.push(new Planet("Jupiter", "Sun", "assets/jupiter.png", 139822, 778570000, 4332.59, 0.0489, 0, "planet"));
planets.push(new Planet("Io", "Jupiter", "assets/io.png", 1821, 421700, 1.769137786, 0.0041, 0, "moon"));
planets.push(new Planet("Europa", "Jupiter", "assets/europa.png", 1560.8, 670900, 3.551181, 0.009, 0, "moon"));
planets.push(new Planet("Ganymede", "Jupiter", "assets/ganymede.png", 2634.1, 1070400, 7.15455296, 0.0013, 0, "moon"));
planets.push(new Planet("Callisto", "Jupiter", "assets/callisto.png", 2410.3, 1882700, 16.6890184, 0.0074, 0, "moon"));

planets.push(new Planet("Saturn", "Sun", "assets/saturn.png", 116464, 1433530000, 10759.22, 0.0565, 0, "planet"));

planets.push(new Planet("Uranus", "Sun", "assets/uranus.png", 50724, 2875040000, 30688.5, 0.046381, 0, "planet"));

planets.push(new Planet("Neptune", "Sun", "assets/neptune.png", 49244, 4500000000, 60182, 0.009456, 0, "planet"));

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
	planetLabel.textContent = noObjectSelected;

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
	updatePlanetPositions();
	setInterval(draw, 10);
}


// Draw the map
function draw()
{
	// Only draw when changes are necessary
	if (!updateCanvas) return;

	updateCanvas = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "rgb(50, 50, 50)";
	ctx.fillStyle = "white";
	
	for (var planet of planets)
	{
		// Draw the planet
		var size = planet.diameter * scaleFactor;
		if (size < minPlanetSize && (planet.type == "planet" || planet.type == "star" || zoom >= zoomMultiplierMoonThreshold))
			size = minPlanetSize;
		var screenX = (planet.x + xCoord) * scaleFactor - size/2 + halfScreenWidth;
		var screenY = (planet.y + yCoord) * scaleFactor - size/2 + halfScreenHeight;
		ctx.drawImage(planet.sprite, screenX, screenY, size, size);

		// Draw the label
		if (showLabels && (zoom >= zoomMultiplierMoonThreshold || planet.type != "moon"))
		{
			ctx.font = "18px Courier New";
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
		if (showOrbits && planet.name != "Sun" && ((planet.type == "planet" && size <= minPlanetSize) || (planet.type == "moon" && zoom >= zoomMultiplierMoonThreshold)))
		{	
			var x = (planet.parent.x + planet.distanceFromCenterToFocus + xCoord) * scaleFactor + halfScreenWidth;
			var y = (planet.parent.y + yCoord) * scaleFactor + halfScreenHeight;
			var radiusX = planet.semiMajorAxis * scaleFactor;
			var radiusY = planet.semiMinorAxis * scaleFactor;
			ctx.beginPath();
			ctx.ellipse(x, y, radiusX, radiusY, planet.rotation, 0, tau);
			ctx.stroke();
		}
	}

	// Debug info
	ctx.font = "24px Courier New";
	if (showDebug)
	{
		ctx.textAlign = "left";
		ctx.fillText("Zoom level: " + currZoomLevel, 100, 100);
		ctx.fillText("Zoom multiplier: " + zoom, 100, 120);
		ctx.fillText("X: " + Math.floor(xCoord), 100, 140);
		ctx.fillText("Y: " + Math.floor(yCoord), 100, 160);
		ctx.fillText("Scale factor: " + scaleFactor, 100, 180);
		if (currentPlanet != null)
		{
			ctx.fillText("Selected: " + currentPlanet.name, 100, 200);
			ctx.fillText("Mean Anomaly: " + currentPlanet.meanAnomaly, 100, 220);
			ctx.fillText("Eccentric Anomaly: " + currentPlanet.eccentricAnomaly, 100, 240);
			ctx.fillText("True Anomaly: " + currentPlanet.trueAnomaly, 100, 260);
		}
	}

	// On-screen text
	ctx.textAlign = "center";
	ctx.fillStyle = "rgba(0, 255, 0, 1)";
	ctx.fillText("1 pixel = " + Math.floor(kmPerPixel/zoom) + " km", halfScreenWidth, window.innerHeight*0.05);
	ctx.fillText("Time: " + new Date(displayedTime).toLocaleDateString("en-US", dateOptions), halfScreenWidth, window.innerHeight*0.92);
	ctx.fillText("Epoch: " + new Date(epoch).toLocaleDateString("en-US", dateOptions), halfScreenWidth, window.innerHeight*0.95);
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
				currentPlanet = planet;
				planetLabel.textContent = currentPlanet.name;
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

document.onkeydown = function onKeyDown(event)
{
	if (event.keyCode == 27) // Escape
	{
		currentPlanet = null;
		planetLabel.textContent = noObjectSelected;
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
			displayedTime = new Date(displayedTime.getTime() + oneDay);
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
			displayedTime = new Date(displayedTime.getTime() - oneDay);
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

		if (planet.type != "star")
		{
			// Calculate how far this object is into its orbit
			// 'Year' here refers to the period of the object - ie. one year for Earth, 27 days for the moon, etc.
			var msSinceEpoch = displayedTime - epoch;
			var daysSinceEpoch = Math.floor(msSinceEpoch / oneDay);
			var daysIntoYear = daysSinceEpoch % planet.period;
			var percentOfYear = daysIntoYear / planet.period;

			// Mean anomaly is an angle that is zero at periapsis and increases at a constant rate of 2 PI radians per orbit
			planet.meanAnomaly = (planet.meanAnomalyAtEpoch + percentOfYear * tau) % tau; 
			// Use Newton's method to find the eccentric anomaly from the mean anomaly
			planet.eccentricAnomaly = planet.meanAnomaly;
			var i = 0;
			while (i < 5)
			{
				// TODO: check correctness
				var delta = (planet.eccentricAnomaly - planet.eccentricity * Math.sin(planet.eccentricAnomaly) - planet.meanAnomaly)/(1 - planet.eccentricity * Math.cos(planet.eccentricAnomaly));
				planet.eccentricAnomaly -= delta;
				i++;
			}
			// True anomaly is the angle from the parent object to this object
			planet.trueAnomaly = 2 * Math.atan(Math.sqrt((1 + planet.eccentricity) / (1 - planet.eccentricity)) * Math.tan(planet.eccentricAnomaly/2));
			// The radius is the distance from the parent object to this object
			var radius = planet.semiMajorAxis * (1 - planet.eccentricity * Math.cos(planet.eccentricAnomaly));
			
			// The true anomaly and radius are the polar coordinates of the object
			// Convert them to cartesian coords and add the parent's postion to get the actual coords of the object
			planet.x = planet.parent.x - Math.cos(planet.trueAnomaly) * radius;
			planet.y = planet.parent.y + Math.sin(planet.trueAnomaly) * radius;
		}

		if (keepPlanetCentered && planet == currentPlanet)
		{
			xCoord = -planet.x;
			yCoord = -planet.y;
		}
	}
}









