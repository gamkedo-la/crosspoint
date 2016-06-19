

// Get string for length / area



// Returns all valid grid points with their respective angle ranges (for dropLyne)
function getValidGridPoints(gridWidth, gridHeight) {
    
     // Ensure gridWidth and gridHeight are integers?
     gridWidth =  Math.round(gridWidth);
     gridHeight = Math.round(gridHeight);
     // Throw error for lyneLength < 1?

    var validPoints = [];
    var result = {angles: [], points: []};

    var pyth_triples = [[5, 4, 3],
                        [10, 8, 6],
                        [13, 12, 5]];

    var lyneLength = Math.sqrt(Math.pow(gridWidth, 2) + Math.pow(gridHeight, 2));

    console.log("lyneLength",lyneLength);


    // Special case of pythagorean tiples
    for (var i = 0; i < pyth_triples.length; i++) {
        if (lyneLength === pyth_triples[i][0] ||
            lyneLength === pyth_triples[i][0] ||
            lyneLength === pyth_triples[i][0]) {

            console.log("tiples");

            gridWidth = pyth_triples[i][1];
            gridHeight = pyth_triples[i][2];

            validPoints.push({x:  lyneLength,  y: 0});
            validPoints.push({x: -lyneLength,  y: 0});
            validPoints.push({x:  0,           y: lyneLength});
            validPoints.push({x:  0,           y: -lyneLength});

        } 
    }

    // Loop through all valid combinations of gridWidth/gridHeight pairs
    for (var i = -1; i <= 1; i += 2) {
        if (gridWidth == 0 && i == 1) {continue;} // Only one loop for gridWidth = zero
        for (var j = -1; j <= 1; j += 2) {
            if (gridHeight == 0 && j == 1) {continue;} // Only one loop for gridHeight = zero

            validPoints.push({ x: (gridWidth * i),   y: (gridHeight * j) });
            validPoints.push({ x: (gridHeight * j),  y: (gridWidth * i) });
        }
    }

    // Find angles associated with those points
    for (var i = 0; i < validPoints.length; i++) {
        validPoints[i].angle = 360-getAngleFromPoints({x:0,y:0}, validPoints[i]); // to agree with y axis
    }

    // sort based on angles
    validPoints.sort(sort_by('angle', false, parseInt));

    console.log("validPoints",validPoints);

    // Divvy up angle ranges using lower bound of angle bisection
    var p1, p0 = validPoints[validPoints.length-1];
    var a1, a0 = p0.angle;
    for (var i = 0; i < validPoints.length; i++) {
        // Save point
        p1 = validPoints[i];
        result.points.push(p1);

        // Find lower bisection
        a0 = p0.angle;
        a1 = p1.angle;
        if (a0 > a1) {a0 = a0 - 360;}
        result.angles.push(a1 - ((a1 - a0) / 2));

        // Iterate previous point
        p0 = p1;
    }

    console.log('result', result);

    // ----------------------------------
    // Example:
    // result.angles = [-45, 45, 135, 225];
    // result.points = [{x:1, y:0}, {x:0, y:-1}, {x:-1, y:0}, {x:0, y:1}];
    // ----------------------------------

    return result;
}

// Returns all valid grid points with their respective angle ranges (for dropLyne)
function getValidGridAreas(gridArea) {
    
    gridArea =  Math.round(gridArea);
    var gridWidth, gridHeight;

    var validPoints = [];
    var result = {angles: [], points: []};

    // Calculate all the ways to make a rectangle with given grid area
    // Save as set of points, distance center of frist square to center of final square
    // e.g. gridArea = 3, result = (2, 0), (-2, 0), (0, 2), (0, -2) 

    // Save (N x 1) rectangles
    validPoints.push({x:  (gridArea - 1),  y: 0});
    validPoints.push({x: -(gridArea - 1),  y: 0});
    validPoints.push({x:  0,               y:  (gridArea - 1)});
    validPoints.push({x:  0,               y: -(gridArea - 1)});

    // Find all diagonal points
    for (var n = 2; n < (Math.sqrt(gridArea) + 0.1) ; n++) {

        var m = gridArea / n;
        if (Number.isInteger(m)) {
            // All combinations of (n x m) are valid
            validPoints.push({x:  (n-1),  y:  (m-1)});
            validPoints.push({x:  (n-1),  y: -(m-1)});
            validPoints.push({x: -(n-1),  y: -(m-1)});
            validPoints.push({x: -(n-1),  y:  (m-1)});
            // If number is not square, add all (m x n)
            if (n !== m) {
                validPoints.push({x:  (m-1),  y:  (n-1)});
                validPoints.push({x:  (m-1),  y: -(n-1)});
                validPoints.push({x: -(m-1),  y: -(n-1)});
                validPoints.push({x: -(m-1),  y:  (n-1)});
            }

        } 
    }


    // Find angles associated with those points
    for (var i = 0; i < validPoints.length; i++) {
        validPoints[i].angle = 360-getAngleFromPoints({x:0,y:0}, validPoints[i]); // to agree with y axis
    }

    // sort based on angles
    validPoints.sort(sort_by('angle', false, parseInt));

    console.log("validPoints",validPoints);

    // Divvy up angle ranges using lower bound of angle bisection
    var p1, p0 = validPoints[validPoints.length-1];
    var a1, a0 = p0.angle;
    for (var i = 0; i < validPoints.length; i++) {
        // Save point
        p1 = validPoints[i];
        result.points.push(p1);

        // Find lower bisection
        a0 = p0.angle;
        a1 = p1.angle;
        if (a0 > a1) {a0 = a0 - 360;}
        result.angles.push(a1 - ((a1 - a0) / 2));

        // Iterate previous point
        p0 = p1;
    }

    console.log('result', result);

    // ----------------------------------
    // Example:
    // result.angles = [-45, 45, 135, 225];
    // result.points = [{x:1, y:0}, {x:0, y:-1}, {x:-1, y:0}, {x:0, y:1}];
    // ----------------------------------

    return result;
}

function getAngleFromPoints(origin, point) {
    var angle;

    var deltaY = point.y - origin.y;
    var deltaX = point.x - origin.x;

    angle = Math.atan2(deltaY, deltaX);
    angle = rad_to_deg(angle);
    angle = deg_to_dir(angle);

    return angle;
}


function angleInRange(angle, lower, upper) {
    if (upper < lower) {
        upper += 360;
    } 
    if (angle < lower) {
        angle += 360;
    }

    return (lower <= angle && angle < upper);
}


var sort_by = function(field, reverse, primer){
    // reverse is bool, primer is function e.g. parseInt

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}


