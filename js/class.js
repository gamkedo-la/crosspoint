
// ----------------------------------
// LevelPiece
// ----------------------------------

var LevelPiece = fabric.util.createClass(fabric.Group, 
    {
        initialize: function() {
            this.pieceID = currentLevel.getNextPieceID(); // For codewriting purposes, not used explicitly
            this.parentPieces = [];
            this.callSuper('initialize');
        },

        convertToObject: function() {
            return {type: "piece", n: null, points: null};
        }
    }
);

// ----------------------------------
// NumberBall (Scalars)
// ----------------------------------

var NumberBall = fabric.util.createClass(LevelPiece, 
    {
        initialize: function(number) {

            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                }
            );

            this.type = "ball";

            this.number = Math.round(number);
            this.numberString = this.number.toString();
            this.centerPoint = {x:0, y:0};
            
            // Create circle
            this.circle = new fabric.Circle(
                {   left: 0, 
                    top: 0, 
                    radius: NUMBER_BALL_RAD, 
                    fill: NUMBER_BALL_COLOR, 
                    originX: 'center', 
                    originY: 'center',
                }
            );
            this.addWithUpdate(this.circle);

            // Create text box
            this.numberStringTextbox = new fabric.Text(this.numberString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: 0, 
                    top: 1,
                    fontSize: NUMBER_BALL_FONTSIZE,
                    fill: BACKGROUND_COLOR,
                }
            );
            this.addWithUpdate(this.numberStringTextbox);

        },

        mouseOver: function() {
            if (this.selectable) {
                this.circle.set('radius', NUMBER_BALL_RAD + NUMBER_BALL_HOVER_GROWTH);
            }
        },

        mouseOut: function() {
            this.circle.set('radius', NUMBER_BALL_RAD);
        },

        onSelected: function(mouse_e) {
            currentLevel.bringPieceToFront(this);
            this.circle.set({'radius': NUMBER_BALL_RAD,});
            this.circle.set({'opacity': NUMBER_BALL_MOVING_OPACITY,});

            currentLevel.mode = 'dropball';
            currentLevel.droppingObject = this;
        },

        update: function(mouse_e) {
            currentLevel.ballMoving(this);
        },

        deselect: function() {


            // Deselect the object
            currentLevel.mode = '';
            currentLevel.droppingObject = null;
            canvas.discardActiveObject();
            currentLevel.selectedObject = null;

            // Change back to full opacity
            this.circle.set({'opacity': 1,});


             // Check to see if activated on another object
            currentLevel.ballDropped(this);

        },

        setCenterPoint: function(centerPoint) {
            this.centerPoint = centerPoint;
        },

        moveToCenterPoint: function() {
            // Animate ball to return to center position
            this.animate(
                {left: this.centerPoint.x, top: this.centerPoint.y} , 
                {
                  duration: NUMBER_BALL_RETURN_TIME,
                  onChange: function () {currentLevel.renderCanvasRequired = true},
                }
            );
        },


        convertToObject: function() {
            return {type: this.type, n: this.number};
        },
        
        
    }
);


// ----------------------------------
// Line
// ----------------------------------

var Lyne = fabric.util.createClass(LevelPiece, 
    {
        initialize: function(gridPoints) {

            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                }
            );

            this.type = "lyne";

            this.startGridPoint = gridPoints[0];
            this.endGridPoint = gridPoints[1];
            this.gridWidth = gridPoints[1].x - gridPoints[0].x;
            this.gridHeight = gridPoints[1].y - gridPoints[0].y;

            this.startPoint = gridPointsToCoords(this.startGridPoint);
            this.endPoint = gridPointsToCoords(this.endGridPoint);            

            var coords = gridPointsToCoordsArray(gridPoints);

            if (currentLevel.levelOptions.lineAddition === "on") 
            {
                // calculate line coordinates
                distance_along_line_reverse(coords, LYNE_END_RAD);
            }

            // create circles and line and add them to canvas

            this.line = new fabric.Line(coords, 
                {   stroke: hex_dark,
                    strokeWidth: LYNE_STROKEWIDTH,
                    originX: 'center', 
                    originY: 'center', 
                }
            );

            this.startCircle = new fabric.Circle(
                {   left: this.startPoint.x, 
                    top:  this.startPoint.y, 
                    radius: LYNE_START_RAD, 
                    fill: hex_dark, 
                    originX: 'center', 
                    originY: 'center',
                }
            );

            if (currentLevel.levelOptions.lineAddition === "on") 
            {
                this.endCircle = new fabric.Circle(
                    {   left: this.endPoint.x, 
                        top:  this.endPoint.y,
                        radius: LYNE_END_RAD, 
                        stroke: hex_dark, 
                        strokeWidth: LYNE_END_STROKEWIDTH,
                        fill: '',
                        originX: 'center', 
                        originY: 'center',
                    }
                );
            } else {
                this.endCircle = new fabric.Circle(
                    {   left: this.endPoint.x, 
                        top:  this.endPoint.y,
                        radius: LYNE_END_RAD, 
                        fill: hex_dark, 
                        originX: 'center', 
                        originY: 'center',
                    }
                );
            }
            

            this.addWithUpdate(this.line);
            this.addWithUpdate(this.startCircle);
            this.addWithUpdate(this.endCircle);

            // Offset of group left/top to gridpoint
            this.deltaX = this.left - this.startPoint.x;
            this.deltaY = this.top - this.startPoint.y;
            // Offset of mouse click point to group left/top
            this.mouseToLyneOffsetX = null;
            this.mouseToLyneOffsetY = null;

        },

        mouseOver: function() {
            if (this.selectable) {
                this.line.set('strokeWidth', LYNE_STROKEWIDTH + LYNE_HOVER_GROWTH);
                this.startCircle.set('radius', LYNE_START_RAD + LYNE_HOVER_GROWTH);
                if (currentLevel.levelOptions.lineAddition === "on") {
                    this.endCircle.set('strokeWidth', LYNE_END_STROKEWIDTH + LYNE_HOVER_GROWTH); 
                } else {
                    this.endCircle.set('radius', LYNE_END_RAD + LYNE_HOVER_GROWTH);
                }
            }
        },

        mouseOut: function() {
            this.line.set('strokeWidth', LYNE_STROKEWIDTH);
            this.startCircle.set('radius', LYNE_START_RAD);
            if (currentLevel.levelOptions.lineAddition === "on") {
                this.endCircle.set('strokeWidth', LYNE_END_STROKEWIDTH);
            } else {
                this.endCircle.set('radius', LYNE_END_RAD);
            }
            
        },

        update: function(mouse_e) {

            // Center object to mouse
            if(mouse_e) {

                var mouseX = mouse_e.offsetX;
                var mouseY = mouse_e.offsetY;

                // Check if mouse has left the grid
                if ( mouseX < gridLeft) {mouseX = gridLeft;}
                if ( mouseX > gridRight) {mouseX = gridRight;}
                if ( mouseY < gridTop) {mouseY = gridTop;}
                if ( mouseY > gridBot) {mouseY = gridBot;}

    
                // Move object to mouse position
                this.set(
                    {'left': mouseX + this.mouseToLyneOffsetX, 
                     'top':  mouseY + this.mouseToLyneOffsetY, 
                    }
                );
            }

            // Move to nearest grid location (grid lock)
            var newX = canvasCenterX + Math.round(((this.left - this.deltaX) - canvasCenterX) / GRID_PIXEL_SIZE) * GRID_PIXEL_SIZE;
            var newY = canvasCenterY + Math.round(((this.top - this.deltaY) - canvasCenterY) / GRID_PIXEL_SIZE) * GRID_PIXEL_SIZE;
            this.set(
                {'left': (newX + this.deltaX), 
                 'top':  (newY + this.deltaY),
                }
            );

            currentLevel.updateBoard();

            // Update start and end points
            this.startPoint = {x: newX, y: newY}; 
            this.startGridPoint = coordsToGridPoints(this.startPoint);
            this.endPoint = {x: newX + this.gridWidth * GRID_PIXEL_SIZE, y: newY - this.gridHeight * GRID_PIXEL_SIZE};
            this.endGridPoint = coordsToGridPoints(this.endPoint);


        },

        onSelected: function(mouse_e) {
            this.mouseToLyneOffsetX = this.left - mouse_e.offsetX;
            this.mouseToLyneOffsetY = this.top - mouse_e.offsetY;

            currentLevel.removeCrossMark(this.startPoint);
        },
        
        onModified: function() {
            // Lyne Addition - Add Lynes if certain points overlap
            currentLevel.joinLynes(this);
            currentLevel.markCrossLynes();

            // Deselect this object
            canvas.discardActiveObject();


        },

        encloses: function(gridPoint) {

            // Calculate strokeWidth of line in grid units
            var strokeWidth = this.line.strokeWidth / GRID_PIXEL_SIZE;

            // Figure out if the line encloses a gridPoint
            return line_encloses_point(this.startGridPoint, this.endGridPoint, 
                                        strokeWidth, gridPoint);
        },

        scale: function(number) {
            // Scale Lyne length (for NumberBall scalar operation)
            this.gridWidth  *= Math.round(number);
            this.gridHeight *= Math.round(number);
            this.endGridPoint.x = this.startGridPoint.x + this.gridWidth;
            this.endGridPoint.y = this.startGridPoint.y + this.gridHeight;

            // Create new Lyne
            var newLyne = new Lyne([this.startGridPoint, this.endGridPoint]);
            currentLevel.addPiece(newLyne);
            currentLevel.removePiece(this);
        },

        getPoints: function() {
            // Return an array of current grid points
            return translateGridpointsToPoint([this.startGridPoint, this.endGridPoint], this.startGridPoint);

        },


        convertToObject: function() {
            return {type: this.type, points: [this.startGridPoint, this.endGridPoint]};
        },
    }
);



// ----------------------------------
// Polygon
// ----------------------------------

var PolyGroup = fabric.util.createClass(LevelPiece, 
    {
        initialize: function(gridPoints, gridArea) {

            // Initialize Polygon
            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                }
            );

            this.type = "poly";

            this.gridPoints = gridPoints;
            this.startGridPoint = gridPoints[0];
            this.startPoint = gridPointsToCoords(this.startGridPoint);

            if (!gridArea) {
                var gridArea = calculateGridArea(gridPoints);
            }
            this.gridArea = gridArea;

            this.polygon = new fabric.Polygon(gridPointsToCoords(gridPoints),
                {
                 fill: hex_light, 
                 stroke: hex_dark,
                 strokeWidth: POLY_STROKEWIDTH,
                }
            );

            this.addWithUpdate(this.polygon);

            this.mouseToShapeOffsetX = null;
            this.mouseToShapeOffsetY = null;

            this.deltaX = this.left - this.startPoint.x;
            this.deltaY = this.top - this.startPoint.y;
            
        },

        mouseOver: function() {
            if (this.selectable) {
                this.set({'fill': hex_med});
            }
        },

        mouseOut: function() {
            this.set({'fill': hex_light});
        },

        update: function(mouse_e) {

            // Center object to mouse
            if(mouse_e) {

                var mouseX = mouse_e.offsetX;
                var mouseY = mouse_e.offsetY;

                // Check if mouse has left the grid
                if ( mouseX < gridLeft) {mouseX = gridLeft;}
                if ( mouseX > gridRight) {mouseX = gridRight;}
                if ( mouseY < gridTop) {mouseY = gridTop;}
                if ( mouseY > gridBot) {mouseY = gridBot;}
    
                // Move object to mouse position
                this.set(
                    {'left': mouseX + this.mouseToShapeOffsetX, 
                     'top':  mouseY + this.mouseToShapeOffsetY, 
                    }
                );
            }

            // Move to nearest grid location (grid lock)
            var newX = canvasCenterX + Math.round(((this.left - this.deltaX) - canvasCenterX) / GRID_PIXEL_SIZE) * GRID_PIXEL_SIZE;
            var newY = canvasCenterY + Math.round(((this.top - this.deltaY) - canvasCenterY) / GRID_PIXEL_SIZE) * GRID_PIXEL_SIZE;
            this.set(
                {'left': (newX + this.deltaX), 
                 'top':  (newY + this.deltaY),
                }
            );

            currentLevel.updateBoard();

            // TODO: Update position tracker
            this.startPoint = {x: newX, y: newY}; 
            this.startGridPoint = coordsToGridPoints(this.startPoint);
        },

        onSelected: function(mouse_e) {
            this.mouseToShapeOffsetX = this.left - mouse_e.offsetX;
            this.mouseToShapeOffsetY = this.top - mouse_e.offsetY;

            currentLevel.bringPieceToFront(this);
            this.set('opacity', POLY_MOVING_OPACITY);
            currentLevel.mode = 'moving';
            currentLevel.selectedObject = this;
        },

        onModified: function() {
            this.deselect();
        },

        deselect: function() {
            // Change back to full opacity
            this.set('opacity', 1);

            // Deselect this object
            canvas.discardActiveObject();
            currentLevel.selectedObject = null;
            currentLevel.mode = '';
        },

        getPoints: function() {
            // Return an array of current grid points
            return translateGridpointsToPoint(this.gridPoints, this.startGridPoint);

        },

        encloses: function(gridPoint) {
            return poly_encloses_point(this.getPoints(), gridPoint);
        },

        scale: function(number) {
            // Scale polygon area for scalar NumberBall

            if (Number.isInteger(this.gridArea) && this.gridPoints.length === 4) {
                // Add area boxes to Level
                for (var i = 1; i < number; i++) {
                    var boxArea = new BoxArea(this.gridArea);
                    currentLevel.addPiece(boxArea);
                }
            } else {
                // Add shapes to grid (starting in the +x direction)
                for (var i = 1; i < number; i++) {

                    // Calculate new start point
                    var newStartX = this.startGridPoint.x + i <= 5? 
                                    this.startGridPoint.x + i: 
                                    this.startGridPoint.x - (this.startGridPoint.x + i - 5);
                    var newStartGridPoint = {x: newStartX, y: this.startGridPoint.y};
                    var gridPoints = translateGridpointsToPoint(this.gridPoints, newStartGridPoint);

                    // Make new PolyGroup at new location and add to Level
                    var newPoly = new PolyGroup(gridPoints);
                    currentLevel.addPiece(newPoly);
                }
            }
        },
        

        convertToObject: function() {
            return {type: this.type, n: this.gridArea, points: this.gridPoints};
        },
    }
);


// ----------------------------------
// Boxes
// ----------------------------------

// Box Superclass

// BoxLyne
// BoxPoly
// BoxArea
// BoxShape

var Box = fabric.util.createClass(LevelPiece, 
    {
        initialize: function() {

            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                 lockMovementX: true,
                 lockMovementY: true,
                }
            );

            // Draw default box
            this.box = new fabric.Rect({
                    originX: 'center', 
                    originY: 'center',
                    top : 0,
                    left : 0,
                    width : 100,
                    height : 50,
                    fill: BACKGROUND_COLOR,
                    stroke: FOREGROUND_LINE_COLOR,
                    strokeWidth: BOX_STROKEWIDTH,
                });
            this.addWithUpdate(this.box);

        },

        mouseOver: function() {
            if (this.selectable) {
                this.box.set('strokeWidth', BOX_HOVER_STROKEWIDTH);
            }
        },

        mouseOut: function() {
            this.box.set('strokeWidth', BOX_STROKEWIDTH);
        },

        onSelected: function(mouse_e) {
            this.box.set('fill', hex_light);
            currentLevel.makeGridPiecesUnselectable();

        },
        
        deselect: function() {
            this.box.set('fill', BACKGROUND_COLOR);
        },

    }
);

var BoxLyne = fabric.util.createClass(Box, 
    {
        initialize: function(gridWidth, gridHeight) {

            this.callSuper('initialize');

            this.type = "boxLyne";
            this.gridWidth = Math.round(gridWidth);
            this.gridHeight = gridHeight ? Math.round(gridHeight) : null;

            // override box settings
            this.box.set({width: 50});

            // calculate length
            if (this.gridHeight)
            {
                this.lyneLength = Math.sqrt(Math.pow(gridWidth, 2) + Math.pow(gridHeight, 2));
                this.lyneLength  = this.lyneLength.toFixed(1);
            } else {
                this.lyneLength = this.gridWidth;
            }
            this.lyneString = this.lyneLength.toString(); // getLyneString; //String

            // add to box
            this.lyneStringTextbox = new fabric.Text(this.lyneString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: 0, 
                    top: 0,
                    fontSize: BOXLYNE_FONTSIZE,
                });

            this.addWithUpdate(this.lyneStringTextbox);

        },

        convertToObject: function() {
            return {type: this.type, width: this.gridWidth, height: this.gridHeight};
        },
    }
);

var BoxPoly = fabric.util.createClass(Box, 
    {
        initialize: function(gridPoints) {

            this.callSuper('initialize');

            this.type = "boxPoly";
            this.gridPoints = gridPoints;

            this.createThumbnail();
        },

        createThumbnail: function(){

            // Create shape in miniature, fit into box

            var gridPoints = [];

            // Get bounds of shape
            var bounds = getGridPointBounds(this.gridPoints);

            // Calculate scaling factor for thumbnail
            var scale = BOXPOLY_THUMBNAIL_DEFAULT_SCALE;
            if(bounds.width * scale > BOXPOLY_THUMBNAIL_WIDTH){
                scale = BOXPOLY_THUMBNAIL_WIDTH / bounds.width;
            }
            if(bounds.height * scale > BOXPOLY_THUMBNAIL_HEIGHT){
                scale = BOXPOLY_THUMBNAIL_HEIGHT / bounds.height;
            }

            console.log("bounds.centerPoint",bounds.centerPoint);
            console.log("scale",scale);
            console.log("gridPoints",gridPoints);

            // Center points to (0,0) and scale
            for (var i = 0; i < this.gridPoints.length; i++) 
            {
                console.log("gridpoint",this.gridPoints[i]);
                gridPoints.push({x: (this.gridPoints[i].x - bounds.centerPoint.x) * scale,
                                 y: -(this.gridPoints[i].y - bounds.centerPoint.y) * scale } );
            }

            console.log("gridPoints",gridPoints);

            // Create thumbnail polygon
            this.thumbnail = new fabric.Polygon(gridPoints,
                {
                 fill: hex_light, 
                 stroke: hex_dark,
                 strokeWidth: BOXPOLY_THUMBNAIL_STROKEWIDTH,
                }
            );
            this.addWithUpdate(this.thumbnail);
        },

        convertToObject: function() {
            return {type: this.type, points: this.gridPoints};
        },
    }
);

var BoxArea = fabric.util.createClass(Box, 
    {
        initialize: function(gridArea) {

            this.callSuper('initialize');

            this.type = "boxArea";
            this.gridArea = Math.round(gridArea);

            this.areaString = this.gridArea.toString(); // getLyneString; //String

            // add to box
            this.areaStringTextbox = new fabric.Text(this.areaString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: 0, 
                    top: 0,
                    fontSize: BOX_FONTSIZE,
                });

            this.addWithUpdate(this.areaStringTextbox);

        },

        convertToObject: function() {
            return {type: this.type, n: this.gridArea};
        },
    }
);

var BoxShape = fabric.util.createClass(Box, 
    {
        initialize: function(img) {

            this.callSuper('initialize');

            this.type = "boxShape";
            this.img = img;

        },

        convertToObject: function() {
            return {type: this.type, image: this.img};
        },
    }
);


// ----------------------------------
// Dropping Objects
// ----------------------------------


// For user interface when creating Lyne objects
var DropLyne = fabric.util.createClass( 
    {
        initialize: function(gridPoint, gridWidth, gridHeight) {

            this.type = "dropLyne";

            this.gridWidth = gridWidth;
            this.gridHeight = gridHeight;
            this.startGridPoint = gridPoint;
            this.startPoint = gridPointsToCoords(this.startGridPoint);    
            this.endPoint = null;

            this.startCircle = new fabric.Circle(
                { left: this.startPoint.x, 
                top:  this.startPoint.y, 
                radius: LYNE_START_RAD, 
                fill: hex_dark, 
                originX: 'center', 
                originY: 'center',
                selectable: false,
                }
            );

            canvas.add(this.startCircle);

            this.lyne = null;
            this.indx = null;

            // Calculate angle ranges with corresponding coordinate points
            var validGridPoints = getValidGridPoints(gridWidth, gridHeight);
            this.points = validGridPoints.points;
            this.angles = validGridPoints.angles;


        },

        update: function(mouse_e) {

            // Check if this is first update
            if(!this.lyne){
                canvas.remove(this.startCircle);
            }

            // Calculate new angle
            var angle = getAngleFromPoints(this.startPoint, {x: mouse_e.offsetX, y: mouse_e.offsetY});
            var newIndx = 0;

            // If angle falls in new category, create new line
            for (var i = 0; i < this.angles.length; i++) {
                if ( angleInRange(angle, this.angles[i], this.angles[(i+1)%(this.angles.length)]) ) {
                    newIndx = i;
                    break;
                }
            }

            // Exit if index does not change
            if (newIndx === this.indx) {return;}
            
            // Remove old line from canvas
            if (this.lyne) {canvas.remove(this.lyne);}

            // Save new index and point
            this.indx = newIndx;
            this.endPoint = {x: (this.startGridPoint.x + this.points[newIndx].x),
                             y: (this.startGridPoint.y + this.points[newIndx].y)};

            // Add new Lyne to group
            var newLyne = new Lyne([this.startGridPoint, this.endPoint]);
            this.lyne = newLyne;
            canvas.add(this.lyne);

            currentLevel.updateBoard();
        },
        
        addToLevel: function() {
            canvas.remove(this.lyne); 
            currentLevel.addPiece(this.lyne);
            currentLevel.joinLynes(this.lyne);
            currentLevel.markCrossLynes();
        },
        
        removeFromLevel: function() {
            canvas.remove(this.startCircle); 
        },
    }
);



// For user interface when creating Lyne objects
var DropArea = fabric.util.createClass( 
    {
        initialize: function(gridPoint, gridArea) {

            this.type = "dropArea";

            this.gridArea = Math.round(gridArea);
            this.startGridPoint = gridPoint;
            this.startPoint = gridPointsToCoords(this.startGridPoint); 

            this.rectangle = null;
            this.indx = null;
            
            this.startBox = new fabric.Rect({
                    originX: 'center', 
                    originY: 'center',
                    left: this.startPoint.x, 
                    top:  this.startPoint.y, 
                    width : GRID_PIXEL_SIZE,
                    height : GRID_PIXEL_SIZE,
                    fill: hex_dark, 
                    opacity: DROPPING_OPACITY,
                    selectable: false,
                
            });
            this.startBox.type = "temporary";
            if (gridArea > 1) {
                currentLevel.addPiece(this.startBox);
            } else if (gridArea === 1) { 
                // Automatically add piece to level
                this.rectangle = new PolyGroup([{x: gridPoint.x - 0.5, y: gridPoint.y - 0.5},
                                                {x: gridPoint.x - 0.5, y: gridPoint.y + 0.5},
                                                {x: gridPoint.x + 0.5, y: gridPoint.y + 0.5},
                                                {x: gridPoint.x + 0.5, y: gridPoint.y - 0.5}], this.gridArea);
                currentLevel.addPiece(this.rectangle);
                return;
            }

            // Calculate angle ranges with coordinate points corresponding to area of shape
            var validGridAreas = getValidGridAreas(gridArea);
            this.points = validGridAreas.points;
            this.angles = validGridAreas.angles;
        },

        update: function(mouse_e) {

            // Check for special case
            if(this.gridArea === 1) {
                return;
            }

            // Calculate new angle
            var angle = getAngleFromPoints(this.startPoint, {x: mouse_e.offsetX, y: mouse_e.offsetY});
            var newIndx = 0;

            // If angle falls in new category, create new line
            for (var i = 0; i < this.angles.length; i++) {
                if ( angleInRange(angle, this.angles[i], this.angles[(i+1)%(this.angles.length)]) ) {
                    newIndx = i;
                    break;
                }
            }

            // Exit if index does not change
            if (newIndx === this.indx) {return;}
            
            // Remove old rectangle from canvas
            if (this.rectangle) {canvas.remove(this.rectangle);}

            // Save new index
            this.indx = newIndx;

            // Calculate borders of new rectangle
            var p0 = this.startGridPoint;
            var p1 = this.points[newIndx];
            var minX = Math.min( (p0.x - 0.5) , p0.x - 0.5 + p1.x );
            var maxX = Math.max( (p0.x + 0.5) , p0.x + 0.5 + p1.x );
            var minY = Math.min( (p0.y - 0.5) , p0.y - 0.5 + p1.y );
            var maxY = Math.max( (p0.y + 0.5) , p0.y + 0.5 + p1.y );

            var points = [{x: minX, y: minY},
                          {x: minX, y: maxY},
                          {x: maxX, y: maxY},
                          {x: maxX, y: minY},];

            // Add new Polygon to group
            var rectangle = new PolyGroup(points, this.gridArea);
            this.rectangle = rectangle;
            canvas.add(this.rectangle);

            
            currentLevel.updateBoard();
        },
        
        addToLevel: function() {
            currentLevel.removePiece(this.startBox);

            canvas.remove(this.rectangle); 
            currentLevel.addPiece(this.rectangle);

        },
        
        removeFromLevel: function() {
            currentLevel.removePiece(this.startBox);
        },
    }
);

// ----------------------------------
// Buttons
// ----------------------------------

var ControlButton = fabric.util.createClass(fabric.Group, 
    {
        initialize: function(type, centerPoint) {

            // Initialize Polygon
            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                 lockMovementX: true,
                 lockMovementY: true,
                }
            );

            this.type = type;

            var buttonCoords = [
                { x: centerPoint.x - CROSS_BTN_WIDTH,
                  y: centerPoint.y - CROSS_BTN_HEIGHT},
                { x: centerPoint.x + CROSS_BTN_WIDTH,
                  y: centerPoint.y - CROSS_BTN_HEIGHT},
                { x: centerPoint.x + CROSS_BTN_WIDTH,
                  y: centerPoint.y + CROSS_BTN_HEIGHT},
                { x: centerPoint.x - CROSS_BTN_WIDTH,
                  y: centerPoint.y + CROSS_BTN_HEIGHT}   
            ];

            this.button = new fabric.Polygon(buttonCoords,
                {
                 fill: BUTTON_COLOR, 
                }
            );

            this.addWithUpdate(this.button);
            
        },

        mouseOver: function() {
            this.set({'strokeWidth': (POLY_STROKEWIDTH + POLY_HOVER_GROWTH)});
        },

        mouseOut: function() {
            this.set({'strokeWidth': POLY_STROKEWIDTH});
        },

        onSelected: function(mouse_e) {
            // Button action
            currentLevel.crossLynes();
            
            canvas.discardActiveObject();
        },
    }
);


// -----------------------------------
// Shadows
// -----------------------------------

var Shadow = fabric.util.createClass(fabric.Group, 
    {
        initialize: function(gridPoints) {

            // Initialize Polygon
            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                 selectable: false,
                }
            );

            this.type = "shadow";

            this.gridPoints = gridPoints;
            this.startPoint = gridPointsToCoords(gridPoints)[0];

            // Draw shadow
            if (gridPoints.length > 2) {
                // Normal polygonal shadow
                this.polygon = new fabric.Polygon(gridPointsToCoords(gridPoints),
                    {
                     fill: SHADOW_COLOR, 
                     opacity: SHADOW_OPACITY,
                     stroke: SHADOW_COLOR, 
                     strokeWidth: SHADOW_STROKE_WIDTH,
                     selectable: false,
                    }
                );

                this.addWithUpdate(this.polygon);

            } else {
                // Line shadow
                var coords = gridPointsToCoordsArray(gridPoints);
                this.polygon = new fabric.Line(coords, 
                    { stroke: SHADOW_COLOR,
                    strokeWidth: LYNE_STROKEWIDTH,
                    strokeLineCap: 'round',
                    originX: 'center', 
                    originY: 'center', 
                    }
                );

                this.addWithUpdate(this.polygon);
            }

            
            
        },

        convertToObject: function() {
            return {type: this.type, points: this.gridPoints};
        },

    }
);

// -----------------------------------
// Solutions
// -----------------------------------

var SolutionManager = fabric.util.createClass( 
    {
        initialize: function(solutions) {
            // Receive "solutions", an array of solutions to level, each an array of point objects.

            this.type = "solution";
            this.solutionsArray = solutions;

        },

        levelSolved: function(gridPoints) {

            // Compare gridPoints to solution sets
            for (var i = 0; i < this.solutionsArray.length; i++) {

                var solutionClone = this.solutionsArray[i].slice(0);

                for (var j = 0; j < gridPoints.length; j++) {
                    
                    var element = gridPoints[j];

                    // Run through solutionClone and remove point if it exists.
                    for (var k = 0; k < solutionClone.length; k++) {
                        if(element.x === solutionClone[k].x && element.y === solutionClone[k].y) {
                            // Remove element from solution array
                            solutionClone.splice(k, 1);
                            element = null;
                            break;
                        }
                    }    

                    if (element) {
                        // Current element not found in this solution, move to next solution set
                        continue;
                    }

                    if(j === (gridPoints.length -1) && solutionClone.length === 0) {
                        // All gridPoints match solution set
                        return true;
                    }

                }
            }

            // Gridpoints do not match solutions
            return false;
        },


        convertToObject: function() {
            return {type: this.type, solutions: this.solutionsArray};
        },

    }
);




