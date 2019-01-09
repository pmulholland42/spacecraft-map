'use strict';

// Page variables
var canvas; 			// <canvas> element
var ctx;				// Canvas rendering context
var errorMessage;
var optionsPanel;
var infoPanel;
var timePanel;
var planetLabel;
var planetInfo;
var wikiLink;
var halfScreenWidth = window.innerWidth/2;
var halfScreenHeight = window.innerHeight/2;
var updateCanvas = true;
const noObjectSelected = "No object selected";
const wikiURL ="https://en.wikipedia.org/wiki/NAME_(TYPE)";

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
var showLabels = false;
var showDebug = false;
var keepPlanetCentered = false;

// Zooming, scaling, panning variables
var currZoomLevel = 5;
const minZoomLevel = 1;
const maxZoomLevel = 50;
var zoomMultipliers = [];
var zoom; // The zoom factor
const zoomMultiplierMoonThreshold = 256;
var scaleFactor; // The zoom factor x kmPerPixel
var xCoord = 0; // The coordinates of the center of the screen
var yCoord = 0;
const maxWidthDistance = 14960000000; // When zoomed out all the way, how much distance (km) should the width of the screen take up?
const kmPerAU = 149597870;
var kmPerPixel = maxWidthDistance /  window.innerWidth; // Kilometers per pixel when zoomed out all the way
const minPlanetSize = 4; // Minimum number of pixels that a planet takes up
const minHitboxSize = 15; // Min number of pixels that can be clicked to select a planet
const tau = Math.PI * 2;
var currentPlanet = null; // The planet currently selected

// Time
const epoch = Date.UTC(2000, 0, 1, 12, 0, 0); // J2000 epoch: January 1, 2000
const oneDay = 86400000; // Number of milliseconds in one day
const oneCentury = 1000*60*60*24*365.25*100; // Number of milliseconds in a century
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit" };
var displayedTime = new Date();
var timeDirection = 0; // -1, 0, or 1 for backwards, stopped, or forwards
var timerInterval;


class Planet {
	/**
	 * @param {string} name The name of the object
	 * @param {string} parentName The name of the object that this object orbits
	 * @param {string} type The type of object, eg. star, planet, or moon
	 * @param {string} spritePath The file path and name of the image for this object
	 * @param {number} diameter The diameter of the object (km)
	 * @param {Orbit} orbit The orbit of this object
	 */
	constructor(name, parentName, type, spritePath, diameter, orbit) {
		this.name = name;
		this.parent = getPlanet(parentName);
		this.type = type;
		this.sprite = new Image();
		this.sprite.src = spritePath;
		this.diameter = diameter;
		this.orbit = orbit;

		this.x = 0;
		this.y = 0;
	}

	/**
	 * Sets the planet's coordinates to where they should be at a given time
	 * @param {Date} time 
	 */
	setCoords(time)
	{
		this.orbit.update(time);
		this.distanceFromParent = this.orbit.semiMajorAxis * (1 - this.orbit.eccentricity * Math.cos(toRadians(this.orbit.eccentricAnomaly))) * kmPerAU;
		var angle = toRadians(this.orbit.trueAnomaly + this.orbit.longitudeOfPeriapsis);
		
		// The distance and angle are the polar coordinates of the object relative to its parent
		// Convert them to cartesian coords and add the parent's position to get the actual coords of the object
		this.x = this.parent.x + Math.cos(angle) * this.distanceFromParent;
		this.y = this.parent.y - Math.sin(angle) * this.distanceFromParent;
	}
}

class Orbit
{
	/**
	 * 
	 * @param {number} semiMajorAxis The semi-major axis of the orbit (AU)
	 * @param {number} semiMajorAxisRate The rate of change of the semi-major axis (AU/century) 
	 * @param {number} eccentricity The eccentricity of the orbit
	 * @param {number} eccentricityRate The rate of change of the eccentricity per century
	 * @param {number} inclination The inclination of the orbit (degrees)
	 * @param {number} inclinationRate The rate of change of the inclination (degrees/century)
	 * @param {number} meanLongitude The mean longitude of the object (degrees)
	 * @param {number} meanLongitudeRate The rate of change of the mean longitude (degrees/century)
	 * @param {number} longitudeOfPeriapsis The longitude of periapsis (degrees)
	 * @param {number} longitudeOfPeriapsisRate The rate of change of the longitude of periapsis (degrees/century)
	 * @param {number} longitudeOfAscendingNode The longitude of the ascending node (degrees/century)
	 * @param {number} longitudeOfAscendingNodeRate The rate of change of the longitude of the ascending node (degrees/century)
	 * @param {number} b Additional correction factor needed for Jupiter through Pluto
	 * @param {number} c Additional correction factor needed for Jupiter through Pluto
	 * @param {number} s Additional correction factor needed for Jupiter through Pluto
	 * @param {number} f Additional correction factor needed for Jupiter through Pluto
	 */
	constructor(semiMajorAxis, semiMajorAxisRate, eccentricity, eccentricityRate, inclination, inclinationRate, meanLongitude, meanLongitudeRate, longitudeOfPeriapsis, longitudeOfPeriapsisRate, longitudeOfAscendingNode, longitudeOfAscendingNodeRate, b = 0, c = 0, s = 0, f = 0)
	{
		this.semiMajorAxis = semiMajorAxis;
		this.semiMajorAxisAtEpoch = semiMajorAxis;
		this.semiMajorAxisRate = semiMajorAxisRate;

		this.eccentricity = eccentricity;
		this.eccentricityAtEpoch = eccentricity;
		this.eccentricityRate = eccentricityRate;

		this.inclination = inclination;
		this.inclinationAtEpoch = inclination;
		this.inclinationRate = inclinationRate;

		this.meanLongitude = meanLongitude;
		this.meanLongitudeAtEpoch = meanLongitude;
		this.meanLongitudeRate = meanLongitudeRate;

		this.longitudeOfPeriapsis = longitudeOfPeriapsis;
		this.longitudeOfPeriapsisAtEpoch = longitudeOfPeriapsis;
		this.longitudeOfPeriapsisRate = longitudeOfPeriapsisRate;

		this.longitudeOfAscendingNode = longitudeOfAscendingNode;
		this.longitudeOfAscendingNodeAtEpoch = longitudeOfAscendingNode;
		this.longitudeOfAscendingNodeRate = longitudeOfAscendingNodeRate;

		this.b = b;
		this.c = c;
		this.s = s;
		this.f = f;

		this.semiMinorAxis = 0;
		this.distanceFromCenterToFocus = 0;
		this.argumentOfPeriapsis = 0;
		this.meanAnomaly = 0;
		this.eccentricAnomaly = 0;
		this.trueAnomaly = 0;
	}

	/**
	 * Updates the orbital parameters for a given time
	 * @param {Date} time 
	 */
	update(time)
	{
		var centuriesSinceEpoch = (time - epoch) / oneCentury;
		this.semiMajorAxis = this.semiMajorAxisAtEpoch + this.semiMajorAxisRate * centuriesSinceEpoch;
		this.semiMinorAxis = this.semiMajorAxis * Math.sqrt(1 - Math.pow(this.eccentricity, 2));
		this.distanceFromCenterToFocus = Math.sqrt(Math.pow(this.semiMajorAxis, 2) - Math.pow(this.semiMinorAxis, 2)); // c^2 = a^2 - b^2
		this.eccentricity = this.eccentricityAtEpoch + this.eccentricityRate * centuriesSinceEpoch;
		this.inclination = this.inclinationAtEpoch + this.inclinationRate * centuriesSinceEpoch;
		this.meanLongitude = this.meanLongitudeAtEpoch + this.meanLongitudeRate * centuriesSinceEpoch;
		this.longitudeOfPeriapsis = this.longitudeOfPeriapsisAtEpoch + this.longitudeOfPeriapsisRate * centuriesSinceEpoch;
		this.longitudeOfAscendingNode = this.longitudeOfAscendingNodeAtEpoch + this.longitudeOfAscendingNodeRate * centuriesSinceEpoch;
		this.argumentOfPeriapsis = this.longitudeOfPeriapsis - this.longitudeOfAscendingNode;

		this.meanAnomaly = this.meanLongitude - this.longitudeOfPeriapsis;
		// Correction factor needed for outer planets
		this.meanAnomaly += this.b * Math.pow(centuriesSinceEpoch, 2) + this.c * Math.cos(toRadians(this.f * centuriesSinceEpoch)) + this.s * Math.sin(toRadians(this.f * centuriesSinceEpoch));
	
		// Use Newton's method to approximate the eccentric anomaly
		this.eccentricAnomaly = this.meanAnomaly;
		for (var i = 0; i < 5; i++)
		{
			var delta = (this.eccentricAnomaly - this.eccentricity * Math.sin(toRadians(this.eccentricAnomaly)) - this.meanAnomaly)/(1 - this.eccentricity * Math.cos(toRadians(this.eccentricAnomaly)));
			this.eccentricAnomaly -= delta;
		}

		this.trueAnomaly = toDegrees(2 * Math.atan(Math.sqrt((1 + this.eccentricity) / (1 - this.eccentricity)) * Math.tan(toRadians(this.eccentricAnomaly/2))));
		if (this.trueAnomaly < 0)
			this.trueAnomaly += 360;
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

var sun = new Planet("The Sun", null, "star", "assets/sun.png", 1391016, new Orbit(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
planets.push(sun);
var mercury = new Planet("Mercury", "The Sun", "planet", "assets/mercury.png", 4879,
	new Orbit(0.38709843, 0, 0.20563661, 0.00002123, 7.00559432, -0.00590158, 252.25166724, 149472.67486623, 77.45771895, 0.15940013, 48.33961819, -0.12214182));

planets.push(mercury);


/*planets.push(new Planet("Sun", null, "assets/sun.png", 1391016, 0, 0, 0, 0, 0, 0, "star"));

planets.push(new Planet("Mercury", "Sun", "assets/mercury.png", 4879, 57909050, 87.969, 0.205630, 48.331, 29.124, 174.796, "planet"));

planets.push(new Planet("Venus", "Sun", "assets/venus.png", 12104, 108208000, 224.701, 0.006772, 76.680, 54.884, 50.115, "planet"));

planets.push(new Planet("Earth", "Sun", "assets/earth.png", 12742, 149598023, 365.256363004, 0.0167086, -11.26064, 114.20783, 358.617, "planet"));
planets.push(new Planet("Moon", "Earth", "assets/moon.png", 3474, 384400, 27.321661, 0.0549, 0, 0, 123, "moon"));

planets.push(new Planet("Mars", "Sun", "assets/mars.png", 6779, 227939200, 686.971, 0.0934, 49.558, 286.502, 19.387, "planet"));
planets.push(new Planet("Phobos", "Mars", "assets/phobos.png", 11, 9376, 0.31891023, 0.0151, 0, 0, 0, "moon"));
planets.push(new Planet("Deimos", "Mars", "assets/deimos.png", 6.2, 23463, 1.263, 0.00033, 0, 0, 0, "moon"));

planets.push(new Planet("Jupiter", "Sun", "assets/jupiter.png", 139822, 778570000, 4332.59, 0.0489, 100.464, 273.867, 20.020, "planet"));
planets.push(new Planet("Io", "Jupiter", "assets/io.png", 1821, 421700, 1.769137786, 0.0041, 0, 0, 0, "moon"));
planets.push(new Planet("Europa", "Jupiter", "assets/europa.png", 1560.8, 670900, 3.551181, 0.009, 0, 0, 0, "moon"));
planets.push(new Planet("Ganymede", "Jupiter", "assets/ganymede.png", 2634.1, 1070400, 7.15455296, 0.0013, 0, 0, 0, "moon"));
planets.push(new Planet("Callisto", "Jupiter", "assets/callisto.png", 2410.3, 1882700, 16.6890184, 0.0074, 0, 0, 0, "moon"));

planets.push(new Planet("Saturn", "Sun", "assets/saturn.png", 116464, 1433530000, 10759.22, 0.0565, 113.665, 339.392, 317.020, "planet"));

planets.push(new Planet("Uranus", "Sun", "assets/uranus.png", 50724, 2875040000, 30688.5, 0.046381, 74.006, 96.998857, 142.2386, "planet"));

planets.push(new Planet("Neptune", "Sun", "assets/neptune.png", 49244, 4500000000, 60182, 0.009456, 131.784, 276.336, 256.228, "planet"));*/

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
	optionsPanel.style.top = (window.innerHeight*0.05) + "px";
	optionsPanel.style.left = (window.innerWidth*0.8) + "px";

	infoPanel = document.getElementById("info");
	infoPanel.style.top = (window.innerHeight*0.05) + "px";
	infoPanel.style.left = (window.innerHeight*0.05) + "px";

	timePanel = document.getElementById("timeline");
	timePanel.style.top = (window.innerHeight*0.85) + "px";
	timePanel.style.left = (window.innerWidth*0.4) + "px";

	planetLabel = document.getElementById("planetlabel");

	planetInfo = document.getElementById("planetinfo");
	wikiLink = document.getElementById("wikilink");

	showOrbits = document.getElementById("orbitsCheck").checked;
	showLabels = document.getElementById("labelsCheck").checked;
	showDebug = document.getElementById("debugCheck").checked;
	document.getElementById("focusCheck").checked = false;

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
	updateInfoBox();
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
		var screenX = (planet.x - xCoord) * scaleFactor - size/2 + halfScreenWidth;
		var screenY = (planet.y - yCoord) * scaleFactor - size/2 + halfScreenHeight;
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
		/*if (showOrbits && planet.name != "Sun" && ((planet.type == "planet" && size <= minPlanetSize) || (planet.type == "moon" && zoom >= zoomMultiplierMoonThreshold)))
		{

			var x = (planet.parent.x - xCoord - planet.orbit.distanceFromCenterToFocus() * Math.cos(planet.longitudeOfPeriapsis)) * scaleFactor + halfScreenWidth;
			var y = (planet.parent.y - yCoord + planet.orbit.distanceFromCenterToFocus() * Math.sin(planet.longitudeOfPeriapsis)) * scaleFactor + halfScreenHeight;
			var radiusX = planet.semiMajorAxis * scaleFactor;
			var radiusY = planet.semiMinorAxis * scaleFactor;
			ctx.beginPath();
			ctx.ellipse(x, y, radiusX, radiusY, -planet.longitudeOfPeriapsis, 0, tau);
			ctx.stroke();
		}*/
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
		ctx.fillText("x: " + mercury.x, 100, 300);
		ctx.fillText("y: " + mercury.y, 100, 320);
		ctx.fillText("mean: " + mercury.orbit.meanAnomaly(new Date(displayedTime)) % 360, 100, 340);
		ctx.fillText("eccentric: " + mercury.orbit.eccentricAnomaly(new Date(displayedTime)) % 360, 100, 360);
		ctx.fillText("true: " + mercury.orbit.trueAnomaly(new Date(displayedTime)) % 360, 100, 380);
	}

	// On-screen text
	ctx.textAlign = "center";
	ctx.fillStyle = "rgba(0, 255, 0, 1)";
	ctx.fillText("1 pixel = " + Math.floor(kmPerPixel/zoom) + " km", halfScreenWidth, window.innerHeight*0.05);
	ctx.fillText("Time: " + new Date(displayedTime).toLocaleDateString("en-US", dateOptions), halfScreenWidth, window.innerHeight*0.95);
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
			var screenX = (planet.x - xCoord) * scaleFactor + halfScreenWidth;
			var screenY = (planet.y - yCoord) * scaleFactor + halfScreenHeight;
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
		xCoord += initialX - finalX;
		yCoord += initialY - finalY;
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
		currentPanel = event.target;
		while (currentPanel.className != "panel")
		{
			currentPanel = currentPanel.parentElement;
		}


		draggingPanel = true;
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
			xCoord += (lastMouseX - event.clientX) * kmPerPixel / zoom;
			yCoord += (lastMouseY - event.clientY) * kmPerPixel / zoom;
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
		document.getElementById("focusCheck").checked = false;
		keepPlanetCentered = false;
		updateInfoBox();
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
			planet.setCoords(new Date(displayedTime));
		}

		if (keepPlanetCentered && planet == currentPlanet)
		{
			xCoord = planet.x;
			yCoord = planet.y;
		}
	}

	updateInfoBox();
}

function updateInfoBox()
{
	var infoText = "";
	if (currentPlanet != null)
	{
		if (currentPlanet.parent != null)
		{
			infoText += "Distance from " + currentPlanet.parent.name + ": " + Math.round(currentPlanet.distanceFromParent).toLocaleString() + " km\n";
			infoText += "Period: " + currentPlanet.period + " days\n";
			infoText += "Eccentricity: " + currentPlanet.eccentricity + "\n";
			infoText += "Mean anomaly: " + (currentPlanet.meanAnomaly * 180 / Math.PI).toFixed(2) + "°\n"; 
			infoText += "True anomaly: " + (currentPlanet.trueAnomaly * 180 / Math.PI).toFixed(2) + "°"; 
		}
		wikiLink.href = wikiURL.replace("NAME", currentPlanet.name).replace("TYPE", currentPlanet.type);
		wikiLink.style.display = "";
	}
	else
	{
		planetLabel.textContent = noObjectSelected;
		wikiLink.style.display = "none";
	}
	planetInfo.textContent = infoText;
}

function toRadians(angle)
{
	return angle * (Math.PI / 180);
}

function toDegrees(angle)
{
	return angle * (180 / Math.PI);
}








