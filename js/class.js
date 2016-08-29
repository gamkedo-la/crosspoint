
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
                {   stroke: color_main_DK,
                    strokeWidth: LYNE_STROKEWIDTH,
                    originX: 'center', 
                    originY: 'center', 
                }
            );

            this.startCircle = new fabric.Circle(
                {   left: this.startPoint.x, 
                    top:  this.startPoint.y, 
                    radius: LYNE_START_RAD, 
                    fill: color_main_DK, //BUTTON_COLOR
                    originX: 'center', 
                    originY: 'center',
                }
            );

            this.addWithUpdate(this.line);
            this.addWithUpdate(this.startCircle);

            if (currentLevel.levelOptions.lineAddition === "on") 
            {
                this.endCircle = new fabric.Circle(
                    {   left: this.endPoint.x, 
                        top:  this.endPoint.y,
                        radius: LYNE_END_RAD, 
                        stroke: color_main_DK, 
                        strokeWidth: LYNE_END_STROKEWIDTH,
                        fill: INVISIBLE_COLOR,
                        originX: 'center', 
                        originY: 'center',
                    }
                );
            } else {
                this.endCircle = new fabric.Circle(
                    {   left: this.endPoint.x, 
                        top:  this.endPoint.y,
                        radius: LYNE_END_RAD, 
                        fill: color_main_DK, 
                        originX: 'center', 
                        originY: 'center',
                    }
                );
            }
            this.addWithUpdate(this.endCircle);  

            // Create End Circle Control for changing orientation of vector
            this.lyneEndControl = new LyneEndControl(this, this.endPoint, this.endCircle.radius);


            if (currentLevel.levelOptions.crossButton !== "none") 
            {
                this.startSquare = new fabric.Rect(
                    {   originX: 'center', 
                        originY: 'center',
                        left: this.startPoint.x, 
                        top:  this.startPoint.y, 
                        width: LYNE_START_SQUARE_WIDTH, 
                        height: LYNE_START_SQUARE_WIDTH, 
                        fill: BACKGROUND_COLOR, 
                        stroke: BACKGROUND_COLOR, 
                        strokeWidth: 0, 
                    }
                );
                this.addWithUpdate(this.startSquare);
            }

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

                if(this.startSquare) {
                    this.startSquare.strokeWidth = LYNE_START_SQUARE_STROKEWIDTH;
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

            if(this.startSquare) {
                this.startSquare.strokeWidth = 0; 
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

            // Move Lyne End Control
            this.lyneEndControl.moveToPoint(this.endPoint);


        },

        onSelected: function(mouse_e) {
            this.mouseToLyneOffsetX = this.left - mouse_e.offsetX;
            this.mouseToLyneOffsetY = this.top - mouse_e.offsetY;

            currentLevel.removeCrossMark(this.startPoint);
        },
        
        onModified: function() {
            // Lyne Addition - Add Lynes if certain points overlap
            var join_bool = currentLevel.joinLynes(this);
            var mark_bool = currentLevel.markCrossLynes();

            // Deselect this object
            canvas.discardActiveObject();

            // Audio
            if (join_bool) {
                playSFX("snapToGrid");
            } else if (mark_bool) {
                playSFX("snapToGrid");
            } else {
                playSFX("snapToGrid");
            }
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

var LyneEndControl = fabric.util.createClass(LevelPiece, 
    {
        initialize: function(lyne, endPoint, radius) {

            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                }
            );

            this.type = "lyneEnd";

            this.lyne = lyne;
            this.endPoint = endPoint;
            this.radius = radius;          

            this.endCircle = new fabric.Circle(
                {   left: this.endPoint.x, 
                    top:  this.endPoint.y, 
                    radius: this.radius, 
                    fill: INVISIBLE_COLOR, 
                    stroke: INVISIBLE_COLOR, 
                    strokeWidth: this.lyne.endCircle.strokeWidth + LYNE_HOVER_GROWTH, 
                    originX: 'center', 
                    originY: 'center',
                }
            );

            this.addWithUpdate(this.endCircle);

        },

        mouseOver: function() {
            if (this.selectable) {

                if (currentLevel.levelOptions.lineAddition === "on") {
                    this.endCircle.set('stroke', color_main_MD);
                } else {
                    this.endCircle.set('stroke', color_main_DK);
                    this.endCircle.set('fill', color_main_MD);
                }
                

                // Audio
                playSFX("rotateHover");
            }
        },

        mouseOut: function() {
            this.endCircle.set('stroke', INVISIBLE_COLOR);
            this.endCircle.set('fill', INVISIBLE_COLOR);
        },

        onSelected: function(mouse_e) {
            // make invisible
            this.endCircle.set('stroke', INVISIBLE_COLOR);

            // Set mode to dropping
            currentLevel.mode = 'dropping';

            // Call function to add new line to grid, give old lyne for deletion
            currentLevel.addLyneToGrid(this.lyne.startGridPoint, this.lyne.gridWidth, this.lyne.gridHeight, this.lyne);
        },

        moveToPoint: function(point) {
            this.set({left: point.x, 
                      top:  point.y});
            this.setCoords();
        },
        
        onModified: function() {

            // Deselect this object
            canvas.discardActiveObject();

            // Delete this object
            currentLevel.removePiece(this);

            // Audio
            playSFX("rotateLine");

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

            if (gridArea) {
                // Placement of area can be modified using grid handle
                if (gridArea !== 1) {
                    this.gridHandle = null; //TODO
                }
            } else {
                var gridArea = calculateGridArea(gridPoints);
            }
            this.gridArea = gridArea;

            this.polygon = new fabric.Polygon(gridPointsToCoords(gridPoints),
                {
                 fill: color_main_LT, 
                 stroke: color_main_DK,
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
                this.set({'fill': color_main_MD});
            }
        },

        mouseOut: function() {
            this.set({'fill': color_main_LT});
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

            // Play audio - Add to level
            playSFX("snapToGrid");
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

            // if (Number.isInteger(this.gridArea) && this.gridPoints.length === 4) {
            //     // Add area boxes to Level
            //     for (var i = 1; i < number; i++) {
            //         var boxArea = new BoxArea(this.gridArea);
            //         currentLevel.addPiece(boxArea);
            //     }
            // } else {
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
            // }
        },
        

        convertToObject: function() {
            return {type: this.type, n: this.gridArea, points: this.gridPoints};
        },
    }
);


// ----------------------------------
// Shapes
// ----------------------------------

var Circle = fabric.util.createClass(LevelPiece, 
    {
        initialize: function(gridPoint, radius) {

            // Initialize Polygon
            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                }
            );

            this.type = "circle";

            this.gridPoint = gridPoint;
            this.startPoint = gridPointsToCoords(this.gridPoint);
            this.radius = radius;


            this.circle = new fabric.Circle(
                {
                 originX: 'center', 
                 originY: 'center',
                 left: this.startPoint.x,
                 top: this.startPoint.y,
                 radius: this.radius * GRID_PIXEL_SIZE,
                 fill: color_second_LT, 
                 stroke: color_second_DK,
                 strokeWidth: POLY_STROKEWIDTH,
                }
            );
            this.addWithUpdate(this.circle);   

            this.mouseToShapeOffsetX = null;
            this.mouseToShapeOffsetY = null;                     
        },

        mouseOver: function() {
            if (this.selectable) {
                this.set({'fill': color_second_MD});
            }
        },

        mouseOut: function() {
            this.set({'fill': color_second_LT});
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
            var newX = canvasCenterX + Math.round((this.left - canvasCenterX) / GRID_PIXEL_SIZE) * GRID_PIXEL_SIZE;
            var newY = canvasCenterY + Math.round((this.top - canvasCenterY) / GRID_PIXEL_SIZE) * GRID_PIXEL_SIZE;
            this.set(
                {'left': (newX), 
                 'top':  (newY),
                }
            );

            if(rendLevelCardsMode==false) {
                currentLevel.updateBoard();
            }

            // TODO: Update position tracker
            this.startPoint = {x: newX, y: newY}; 
            this.gridPoint = coordsToGridPoints(this.startPoint);
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

            // Play audio - Add to level
            playSFX("snapToGrid");
        },

        getPoints: function() {
            // Return an array of current grid points
            return [this.gridPoint];

        },

        encloses: function(gridPoint) {
            if(distance_between_two_points(gridPoint, this.gridPoint) <= this.radius) {
                return true;
            } else {
                return false;   
            }  
        },

        scale: function(number) {
            
            // Add shapes to grid (starting in the +x direction)
            for (var i = 1; i < number; i++) {

                // Calculate new start point
                var newStartX = this.gridPoint.x + i <= 5? 
                                this.gridPoint.x + i: 
                                this.gridPoint.x - (this.gridPoint.x + i - 5);
                var newStartGridPoint = {x: newStartX, y: this.gridPoint.y};

                // Make new PolyGroup at new location and add to Level
                var newCircle = new Circle(newStartGridPoint, this.radius);
                currentLevel.addPiece(newCircle);
            }
            
        },
        

        convertToObject: function() {
            return {type: this.type, n: this.radius, points: [this.gridPoint]};
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
            this.box.set('fill', color_main_UL);
        },
        
        deselect: function() {
            this.box.set('fill', BACKGROUND_COLOR);
            canvas.discardActiveObject();
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

            // add text to box
            this.lyneStringTextbox = new fabric.Text(this.lyneString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: 0, 
                    top: 0,
                    fontSize: BOXLYNE_FONTSIZE,
                });
            this.addWithUpdate(this.lyneStringTextbox);

            // add vector symbol (line) to text
            var overLine = new fabric.Line([-10, -13, 10, -13],
                {
                    stroke: color_main_DK,
                    strokeWidth: 2,
                    originX: 'center', 
                    originY: 'center', 
                });
            this.addWithUpdate(overLine);
        },

        onSelected: function(mouse_e) {
            
            // Create temporaryLyne that follows mouse
            var follow = new FollowLyne(this.gridWidth, this.gridHeight);
            currentLevel.addPiece(follow);
            follow.update(mouse_e);

            currentLevel.mode = 'following';
            currentLevel.droppingObject = follow;

            // Mark box for removal
            currentLevel.droppingBox = this;
            this.box.set('fill', color_main_UL);

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

            // Center points to (0,0) and scale
            for (var i = 0; i < this.gridPoints.length; i++) 
            {
                gridPoints.push({x: (this.gridPoints[i].x - bounds.centerPoint.x) * scale,
                                 y: -(this.gridPoints[i].y - bounds.centerPoint.y) * scale } );
            }

            // Create thumbnail polygon
            this.thumbnail = new fabric.Polygon(gridPoints,
                {
                 fill: color_main_LT, 
                 stroke: color_main_DK,
                 strokeWidth: BOXPOLY_THUMBNAIL_STROKEWIDTH,
                }
            );
            this.addWithUpdate(this.thumbnail);
        },

        onSelected: function(mouse_e) {
            
            // Create temporaryLyne that follows mouse
            var follow = new FollowPoly(this.gridPoints);
            currentLevel.addPiece(follow);
            follow.update(mouse_e);

            currentLevel.mode = 'following';
            currentLevel.droppingObject = follow;

            // Mark box for removal
            currentLevel.droppingBox = this;
            this.box.set('fill', color_main_UL);

        },

        convertToObject: function() {
            return {type: this.type, points: this.gridPoints};
        },
    }
);

var BoxCircle = fabric.util.createClass(Box, 
    {
        initialize: function(radius) {

            this.callSuper('initialize');

            this.type = "boxCircle";
            this.radius = radius;

            this.createThumbnail();
        },

        createThumbnail: function(){

            // Create shape in miniature, fit into box

            // Calculate scaling factor for thumbnail
            var scale = BOXPOLY_THUMBNAIL_DEFAULT_SCALE;
            if ((2 * this.radius) * scale > BOXPOLY_THUMBNAIL_WIDTH){
                scale = BOXPOLY_THUMBNAIL_WIDTH / (2 * this.radius);
            }
            if ((2 * this.radius)  * scale > BOXPOLY_THUMBNAIL_HEIGHT){
                scale = BOXPOLY_THUMBNAIL_HEIGHT / (2 * this.radius);
            }

            // Create thumbnail of circle
            this.thumbnail = new fabric.Circle(
                {
                 originX: 'center', 
                 originY: 'center',
                 left: 0,
                 top: 0,
                 radius: this.radius * scale,
                 fill: color_second_LT, 
                 stroke: color_second_DK,
                 strokeWidth: POLY_STROKEWIDTH,
                }
            );
            this.addWithUpdate(this.thumbnail);
        },

        onSelected: function(mouse_e) {
            
            // Create temporary Circle that follows mouse
            var follow = new FollowCircle(this.radius);
            currentLevel.addPiece(follow);
            follow.update(mouse_e);

            currentLevel.mode = 'following';
            currentLevel.droppingObject = follow;

            // Mark box for removal
            currentLevel.droppingBox = this;
            this.box.set('fill', color_main_UL);

        },

        convertToObject: function() {
            return {type: this.type, n: this.radius};
        },
    }
);

var BoxArea = fabric.util.createClass(Box, 
    {
        initialize: function(gridArea) {

            this.callSuper('initialize');

            this.type = "boxArea";
            this.gridArea = Math.round(gridArea);

            this.areaString = '  ' + this.gridArea.toString() + '  '; // getLyneString; //String

            // add to box
            this.areaStringTextbox = new fabric.Text(this.areaString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: 0, 
                    top: 0,
                    fontSize: BOX_FONTSIZE,
                    fill: BACKGROUND_COLOR,
                    backgroundColor: color_main_DK,
                });

            this.addWithUpdate(this.areaStringTextbox);

        },

        onSelected: function(mouse_e) {
            
            // Create temporary Circle that follows mouse
            var follow = new FollowArea(this.gridArea);
            currentLevel.addPiece(follow);
            follow.update(mouse_e);

            currentLevel.mode = 'following';
            currentLevel.droppingObject = follow;

            // Mark box for removal
            currentLevel.droppingBox = this;
            this.box.set('fill', color_main_UL);

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

            // Draw bounding box
            this.box = new fabric.Rect({
                    originX: 'center', 
                    originY: 'center',
                    top : centerPoint.y,
                    left : centerPoint.x,
                    width : 2 * CROSS_BTN_WIDTH,
                    height : 2 * CROSS_BTN_HEIGHT,
                    rx: 10,
                    ry: 10,
                    fill: BUTTON_COLOR,
                });
            this.addWithUpdate(this.box);

            var line1_coords = [centerPoint.x - CROSS_BTN_LINELENGTH, centerPoint.y - CROSS_BTN_LINELENGTH,
                                centerPoint.x + CROSS_BTN_LINELENGTH, centerPoint.y + CROSS_BTN_LINELENGTH];
            this.line1 = new fabric.Line(line1_coords,
                {
                 stroke: BACKGROUND_COLOR, 
                 strokeWidth: CROSS_BTN_STROKEWIDTH, 
                 strokeLineCap: 'round',
                 originX: 'center', 
                 originY: 'center', 

                }
            );
            this.addWithUpdate(this.line1);

            var line2_coords = [centerPoint.x + CROSS_BTN_LINELENGTH, centerPoint.y - CROSS_BTN_LINELENGTH,
                                centerPoint.x - CROSS_BTN_LINELENGTH, centerPoint.y + CROSS_BTN_LINELENGTH];
            this.line2 = new fabric.Line(line2_coords,
                {
                 stroke: BACKGROUND_COLOR, 
                 strokeWidth: CROSS_BTN_STROKEWIDTH, 
                 strokeLineCap: 'round',
                 originX: 'center', 
                 originY: 'center', 
                }
            );
            this.addWithUpdate(this.line2);

            
        },

        mouseOver: function() {
            this.box.set({  width : 2 * CROSS_BTN_WIDTH * CROSS_BTN_HOVER_SCALING_FACTOR,
                            height : 2 * CROSS_BTN_HEIGHT * CROSS_BTN_HOVER_SCALING_FACTOR,});
        },

        mouseOut: function() {
            this.box.set({  width : 2 * CROSS_BTN_WIDTH,
                            height : 2 * CROSS_BTN_HEIGHT,});
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
                    selectable: false,
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

var ShadowCircle = fabric.util.createClass(fabric.Group, 
    {
        initialize: function(gridPoint, radius) {

            // Initialize Polygon
            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                 selectable: false,
                }
            );

            this.type = "shadowCircle";

            this.gridPoint = gridPoint;
            this.startPoint = gridPointsToCoords(this.gridPoint);
            this.radius = radius;

            // Draw shadow
            this.circle = new fabric.Circle(
                {
                 originX: 'center', 
                 originY: 'center',
                 left: this.startPoint.x,
                 top: this.startPoint.y,
                 radius: this.radius * GRID_PIXEL_SIZE,
                 fill: SHADOW_COLOR, 
                 selectable: false,
                }
            );
            this.addWithUpdate(this.circle);   
        },

        convertToObject: function() {
            return {type: this.type, point: this.gridPoint, radius: this.radius};
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




