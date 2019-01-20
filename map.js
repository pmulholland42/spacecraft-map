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
	 * @param {number} semiMajorAxis The semi-major axis of the orbit at the epoch (AU)
	 * @param {number} semiMajorAxisRate The rate of change of the semi-major axis (AU/century) 
	 * @param {number} eccentricity The eccentricity of the orbit at the epoch
	 * @param {number} eccentricityRate The rate of change of the eccentricity per century
	 * @param {number} inclination The inclination of the orbit at the epoch (degrees)
	 * @param {number} inclinationRate The rate of change of the inclination (degrees/century)
	 * @param {number} meanLongitude The mean longitude of the object at the epoch (degrees)
	 * @param {number} meanLongitudeRate The rate of change of the mean longitude (degrees/century)
	 * @param {number} longitudeOfPeriapsis The longitude of periapsis at the epoch (degrees)
	 * @param {number} longitudeOfPeriapsisRate The rate of change of the longitude of periapsis (degrees/century)
	 * @param {number} longitudeOfAscendingNode The longitude of the ascending node at the epoch (degrees/century)
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
		this.period = 360 / (this.meanLongitudeRate / 36525);
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
		this.meanAnomaly = this.meanAnomaly % 360;
	
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

planets.push(new Planet("The Sun", null, "star", "assets/sun.png", 1391016, new Orbit(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)));

planets.push(new Planet("Mercury", "The Sun", "planet", "assets/mercury.png", 4879,
	new Orbit(0.38709843, 0, 0.20563661, 0.00002123, 7.00559432, -0.00590158, 252.25166724, 149472.67486623, 77.45771895, 0.15940013, 48.33961819, -0.12214182)));

planets.push(new Planet("Venus", "The Sun", "planet", "assets/venus.png", 12104, 
	new Orbit(0.72332102, -0.00000026, 0.00676399, -0.00005107, 3.39777545, 0.00043494, 181.97970850, 58517.81560260, 131.76755713, 0.05679648, 76.67261496, -0.27274174)));					

planets.push(new Planet("Earth", "The Sun", "planet", "assets/earth.png", 12742, 
	new Orbit(1.00000018, -0.00000003, 0.01673163, -0.00003661, -0.00054346, -0.01337178, 100.46691572, 35999.37306329, 102.93005885, 0.3179526, -5.11260389, 0.24123856)))
planets.push(new Planet("The Moon",  "Earth", "moon", "assets/moon.png", 3474, 
	new Orbit(0.00256954861, 0, 0.0549, 0, 5.145, 0, 0, 479122.86243729, 0, 2133.35276271, 0, -1934.44384739)));

planets.push(new Planet("Mars", "The Sun", "planet", "assets/mars.png", 6779, 
	new Orbit(1.52371243, 0.00000097, 0.09336511, 0.00009149, 1.85181869, -0.00724757, -4.56813164, 19140.29934243, -23.91744784, 0.45223625, 49.71320984, -0.26852431)))

planets.push(new Planet("Jupiter", "The Sun", "planet", "assets/jupiter.png", 139822, 
	new Orbit(5.20248019, -0.00002864, 0.0485359, 0.00018026, 1.29861416, -0.00322699, 34.33479152, 3034.90371757, 14.27495244, 0.18199196, 100.29282654, 0.13024619, -0.00012452, 0.0606406, -0.35635438, 38.35125)));

planets.push(new Planet("Saturn", "The Sun", "planet", "assets/saturn.png", 116464, 
	new Orbit(9.54149883, -0.00003065, 0.05550825, -0.00032044, 2.49424102, 0.00451969, 50.07571329, 1222.11494724, 92.86136063, 0.54179478, 113.63998702, -0.25015002, 0.00025899, -0.13434469, 0.87320147, 38.35125)));

planets.push(new Planet("Uranus", "The Sun", "planet", "assets/uranus.png", 50724,
	new Orbit(19.18797948, -0.00020455, 0.04685740, -0.00001550, 0.77298127, -0.00180155, 314.20276625, 428.49512595, 172.43404441, 0.09266985, 73.96250215, 0.05739699, 0.00058331, -0.97731848, 0.17689245, 7.67025)));

planets.push(new Planet("Neptune", "The Sun", "planet", "assets/neptune.png", 49244,
	new Orbit(30.06952752, 0.00006447, 0.00895439, 0.00000818, 1.77005520, 0.00022400, 304.22289287, 218.46515314, 46.68158724, 0.01009938, 131.78635853, -0.00606302, -0.00041348, 0.68346318, -0.10162547, 7.67025)));

planets.push(new Planet("Pluto", "The Sun", "dwarf planet", "assets/pluto.png", 1188.3,
	new Orbit(39.48686035, 0.00449751, 0.24885238, 0.00006016, 17.14104260, 0.00000501, 238.96535011, 145.18042903, 224.09702598, -0.00968827, 110.30167986, -0.00809981, -0.01262724)));


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
	window.addEventListener("dblclick", onScroll);
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
	ctx.strokeStyle = "rgb(120, 120, 120)";
	ctx.fillStyle = "white";
	
	for (var planet of planets)
	{
		// Draw the planet
		var size = planet.diameter * scaleFactor;
		if (size < minPlanetSize && (planet.type != "moon" || zoom >= zoomMultiplierMoonThreshold))
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
		if (showOrbits && planet.type != "star" && ((planet.type == "planet" && size <= minPlanetSize) || (planet.type == "moon" && zoom >= zoomMultiplierMoonThreshold)))
		{
			var x = (planet.parent.x - xCoord - planet.orbit.distanceFromCenterToFocus * kmPerAU * Math.cos(toRadians(planet.orbit.longitudeOfPeriapsis))) * scaleFactor + halfScreenWidth;
			var y = (planet.parent.y - yCoord + planet.orbit.distanceFromCenterToFocus * kmPerAU * Math.sin(toRadians(planet.orbit.longitudeOfPeriapsis))) * scaleFactor + halfScreenHeight;
			var radiusX = planet.orbit.semiMajorAxis * scaleFactor * kmPerAU;
			var radiusY = planet.orbit.semiMinorAxis * scaleFactor * kmPerAU;
			var rotation = toRadians(-planet.orbit.longitudeOfPeriapsis);
			ctx.beginPath();
			ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, tau);
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
	if (!event.deltaY || event.deltaY < 0)
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
			infoText += "Period: " + currentPlanet.orbit.period.toFixed(2) + " days\n";
			infoText += "Eccentricity: " + currentPlanet.orbit.eccentricity.toFixed(5) + "\n";
			infoText += "Mean anomaly: " + currentPlanet.orbit.meanAnomaly.toFixed(2) + "°\n"; 
			infoText += "True anomaly: " + currentPlanet.orbit.trueAnomaly.toFixed(2) + "°"; 
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








