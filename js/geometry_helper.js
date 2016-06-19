
// ##################################
// CURRENT Helper Functions
// ##################################

// Vector Length
function vector_length(vector) {
    // Args: vector = [x1,y1]
    var n = 0, result;
    
    for (var i = 0; i < vector.length; i++) {
        n += Math.pow(vector[i],2);
    }
    
    result = Math.sqrt(n);
        
    return result;
}

// Normalize a vector
function normalize(vector) {
    // Args: vector = [x1,y1]
    var vectorLength, result = [];
    
    vectorLength = vector_length(vector);
        
    for (var i = 0; i < vector.length; i++) {
        result.push(vector[i] / vectorLength);
    }
    
    return result;
}

// Go a distance along a given line, and return new line
function distance_along_line(coords, dist) {
    var norm = normalize([ (coords[2] - coords[0]), (coords[3] - coords[1]) ]);
    coords[2] = coords[0] + dist * norm[0];
    coords[3] = coords[1] + dist * norm[1];

    return coords;
}

// Go distance along line to get "dist" away from end point
// Meant for drawing line a radius away from a point
function distance_along_line_reverse(coords, dist) {
    var norm = normalize([ (coords[2] - coords[0]), (coords[3] - coords[1]) ]);
    coords[2] -= dist * norm[0];
    coords[3] -= dist * norm[1];
}


// Convert angle in degrees to direction (0-360)
function deg_to_dir(angle) {
    while (angle < 0){
        angle += 360;
    }
    while (angle >= 360){
        angle -= 360;
    }
    return angle;
}

// Convert radians to degrees
function rad_to_deg(radians) {
    return radians * 180/Math.PI;
}

// Convert degrees to radians
function deg_to_rad(degrees) {
    return degrees * Math.PI/180;
}


// Check to see if polygon encloses point
function poly_encloses_point(polygon_points, point) {
    // Return true if point is inside polygon
    var n = polygon_points.length;
    var inside = false;
    var p1x = polygon_points[0].x;
    var p1y = polygon_points[0].y;
    var p2x, p2y, xints;
    
    for (var i=0; i < n+1; i++) {
        p2x = polygon_points[i % n].x;
        p2y = polygon_points[i % n].y;
        if (point.y > Math.min(p1y, p2y)) {
            if (point.y < Math.max(p1y,p2y)) { 
                if (point.x < Math.max(p1x,p2x)) {
                    if (p1y != p2y) {
                        xints = (point.y-p1y)*(p2x-p1x)/(p2y-p1y)+p1x;
                    }
                    if (p1x == p2x || point.x < xints) {
                        inside = !inside;
                    }
                }
            }
        }
        p1x = p2x;
        p1y = p2y;
    }
    return inside
}

// Create box around line
function line_encloses_point(startPoint, endPoint, lineWidth, point) {
    var angle;
    
    // Find angle
    angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) + Math.PI/2;
    var deltaX = lineWidth * Math.cos(angle);
    var deltaY = lineWidth * Math.sin(angle);
    
    // calculate points
    var p1, p2, p3, p4;
    p1 = {x: startPoint.x + deltaX, y: startPoint.y + deltaY};
    p2 = {x: startPoint.x - deltaX, y: startPoint.y - deltaY};
    p3 = {x: endPoint.x  - deltaX, y: endPoint.y - deltaY};
    p4 = {x: endPoint.x  + deltaX, y: endPoint.y + deltaY};
    
    return poly_encloses_point([p1,p2,p3,p4], point);
}


// ##################################
// OLD Helper Functions
// ##################################




// Dot product of two vectors
function dot_product(a,b) {
	// Args: a = [x1,y1], b = [x2,y2]
	var n = 0, lim = Math.min(a.length,b.length);
	for (var i = 0; i < lim; i++) n += a[i] * b[i];
	return n;
}

// Cross product of two vectors
function cross_product(a,b) {
	// Args: a = [x1,y1], b = [x2,y2]
	// Note: order matters, returns a x b
	var result = a[0] * b[1] - a[1] * b[0];
	return result;
}

// Angle between two vectors
function angle_between_vectors(a,b) {
	// Args: a = [x1,y1], b = [x2,y2]
	var result; 
	result = dot_product(a,b) / (vector_length(a) * vector_length(b));
	result = Math.acos(result);
	return result;
}





// Distance between two points
function distance_between_two_points(x0, y0, x1, y1) {
    var deltaX = x1 - x0;
    var deltaY = y1 - y0;
    return Math.hypot(deltaX, deltaY);
    
}

// Translate Point objects
function translate_points(points, deltaX, deltaY) {
    for (var i=0; i < points.length; i++) {
	points[i].x += deltaX;
	points[i].y += deltaY;
    }
    return points;
}

// Rotate Points around origin
function rotate_around_origin(points, angle) {
    // Calculates rotation of point around origin using angle.
    // angle in degrees
    var s = Math.sin(deg_to_rad(angle));
    var c = Math.cos(deg_to_rad(angle));
    
    for (var i=0; i < points.length; i++) {
	var newX = (points[i].x * c  - points[i].y * s);
	var newY = (points[i].x * s  + points[i].y * c);
	points[i].x = newX;
	points[i].y = newY;
    }
    
    return points;
    
}




// Helper for function intersect()
function ccw(A,B,C) {  
        return Boolean( (C[1]-A[1]) * (B[0]-A[0]) > (B[1]-A[1]) * (C[0]-A[0]) ); 
}

// Line intersection test
function lines_intersect(L1, L2) {
    // Return true if lines L1 and L2 intersect
    var A = [L1.startX, L1.startY];
    var B = [L1.endX, L1.endY];    
    
    var C = [L2.startX, L2.startY];
    var D = [L2.endX, L2.endY];   
     
    return Boolean(ccw(A,C,D) != ccw(B,C,D) && ccw(A,B,C) != ccw(A,B,D));
}

// Intersection point
function intersection_point(line1, line2) {
    // Returns point of intersection between two Line objects
        
   var line1StartX = line1.startX; 
   var line1StartY = line1.startY; 
   var line1EndX = line1.endX; 
   var line1EndY = line1.endY;
   var line2StartX = line2.startX; 
   var line2StartY = line2.startY;
   var line2EndX = line2.endX;
   var line2EndY = line2.endY;
   
    // FROM THE INTERWEBS!!! http://jsfiddle.net/justin_c_rounds/Gd2S2/
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - 
		      ((line2EndX - line2StartX) * (line1EndY - line1StartY));

    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

        // it is worth noting that this should be the same as:
        // x = line2StartX + (b * (line2EndX - line2StartX));
        // y = line2StartX + (b * (line2EndY - line2StartY));
        
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    

    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
}







