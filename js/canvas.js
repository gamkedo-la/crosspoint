
// var canvas_game = document.getElementById('canvas_game');
var canvas = new fabric.Canvas('canvas_game', { selection: false, stateful: false });

var canvasWidth = canvas.getWidth();
var canvasHeight = canvas.getHeight();
var canvasCenter = canvas.getCenter();
var canvasCenterX = canvasCenter.left;
var canvasCenterY = canvasCenter.top;


// ##################################
// Canvas Constants
// ##################################

const GRID_SIZE = 10;
const GRID_WIDTH_RATIO = 0.5;
const GRID_PIXEL_SIZE = (GRID_WIDTH_RATIO * canvas.getWidth()) / GRID_SIZE;

const GRID_PADDING = 10; //pixels
const GRID_BORDER_FADE = 40; //pixels
const GRID_BORDER_FADE_NORTH = 20; //pixels

// ##################################
// Grid coordinates
// ##################################

// Grid bounds in canvas coordinates
var gridLeft = canvasCenterX - (GRID_SIZE/2) * GRID_PIXEL_SIZE;
var gridRight = canvasCenterX + (GRID_SIZE/2) * GRID_PIXEL_SIZE;
var gridTop = canvasCenterY - (GRID_SIZE/2) * GRID_PIXEL_SIZE;
var gridBot = canvasCenterY + (GRID_SIZE/2) * GRID_PIXEL_SIZE;

// ##################################
// Other Constants
// ##################################

const BOX_START_X = gridRight + (canvasWidth - gridRight)/2;
const BOX_START_Y = gridBot - 50;
const BOXLYNE_START_X = gridLeft/2;
const BOXLYNE_START_Y = BOX_START_Y;


function gridPointsToCoords(gridPoints) {
    // Receives {x y} gridPoint objects, returns canvas coordinates

    // handle single value cases
    if (!Array.isArray(gridPoints)) {gridPoints = [gridPoints];}

    var coords = [];
    for (var i = 0; i < gridPoints.length; i++) {
        if (gridPoints[i].x === null || gridPoints[i].y === null) {throw "gridPointsToCoords(): incorrect input (no x,y)";}
        coords.push({x: (canvasCenterX + gridPoints[i].x * GRID_PIXEL_SIZE),
                     y: (canvasCenterY - gridPoints[i].y * GRID_PIXEL_SIZE),
            });
    }

    // handle single value cases
    if (gridPoints.length === 1) {return coords[0];}

    return coords;
}

function gridPointsToCoordsArray(gridPoints) {
    // Receives {x y} gridPoint objects, returns canvas coordinates as an array

    // handle single value cases
    if (!Array.isArray(gridPoints)) {gridPoints = [gridPoints];}

    var coordsArray = [];
    for (var i = 0; i < gridPoints.length; i++) {
        if (gridPoints[i].x === null || gridPoints[i].y === null) {throw "gridPointsToCoordsArray(): incorrect input (no x,y)";}
        coordsArray.push(canvasCenterX + gridPoints[i].x * GRID_PIXEL_SIZE);
        coordsArray.push(canvasCenterY - gridPoints[i].y * GRID_PIXEL_SIZE);  
    }
    return coordsArray;
}

function coordsToGridPoints(coords) {
    
    // handle single value cases
    if (!Array.isArray(coords)) {coords = [coords];}

    var gridpoints = [];
    for (var i = 0; i < coords.length; i++) {
        if (coords[i].x === null || coords[i].y === null) {throw "coordsToGridPoints(): incorrect input (no x,y)";}
        gridpoints.push({x: ((coords[i].x - canvasCenterX) / GRID_PIXEL_SIZE),
                         y: (-(coords[i].y - canvasCenterY) / GRID_PIXEL_SIZE),
            });
    }

    // handle single value cases
    if (coords.length === 1) {return gridpoints[0];}

    return gridpoints;
}

function coordsToGridPointsArray(coords) {

    // handle single value cases
    if (!Array.isArray(coords)) {coords = [coords];}

    var gridpointsArray = [];
    for (var i = 0; i < coords.length; i++) {
        if (coords[i].x === null || coords[i].y === null) {throw "coordsToGridPointsArray(): incorrect input (no x,y)";}
        gridpointsArray.push((coords[i].x - canvasCenterX) / GRID_PIXEL_SIZE);
        gridpointsArray.push(-(coords[i].y - canvasCenterY) / GRID_PIXEL_SIZE);
    }

    return gridpointsArray;
}



function pointInGrid(gridPoint) {
    if (gridPoint.x >= -GRID_SIZE/2 &&
        gridPoint.x <=  GRID_SIZE/2 &&
        gridPoint.y >= -GRID_SIZE/2 &&
        gridPoint.y <=  GRID_SIZE/2 ){
        return true;
    } else {
        return false;
    }
    
}


function translateGridpointsToPoint(gridPoints, startPoint) {
    
    var newGridPoints = [];
    var offset = {x: startPoint.x - gridPoints[0].x, 
                  y: startPoint.y - gridPoints[0].y};

    // Loop through gridPoints and apply offset
    for (var i = 0; i < gridPoints.length; i++) {
        newGridPoints.push({x: gridPoints[i].x + offset.x,
                            y: gridPoints[i].y + offset.y});
    }

    return newGridPoints;
}

function calculateGridArea(gridPoints) {
    // TODO
    return 42.5;
}

function getGridPointBounds(gridPoints) {
    var bounds = {minX: gridPoints[0].x, 
                  maxX: gridPoints[0].x,
                  minY: gridPoints[0].y, 
                  maxY: gridPoints[0].y };

    for (var i = 1; i < gridPoints.length; i++) {
        if(gridPoints[i].x < bounds.minX){
            bounds.minX = gridPoints[i].x;
            bounds.pointMinX = gridPoints[i];
        }
        
        bounds.maxX = Math.max(bounds.maxX, gridPoints[i].x);
        bounds.minY = Math.min(bounds.minY, gridPoints[i].y);
        bounds.maxY = Math.max(bounds.maxY, gridPoints[i].y);
    }

    bounds.width = bounds.maxX - bounds.minX;
    bounds.height = bounds.maxY - bounds.minY;
    bounds.centerPoint = {x: (bounds.maxX + bounds.minX)/2 , 
                          y: (bounds.maxY + bounds.minY)/2 };

    return bounds;
}



