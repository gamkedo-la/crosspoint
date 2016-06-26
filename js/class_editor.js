


// ----------------------------------
// Boxes for the Level Editor
// ----------------------------------

// Box Superclass

// BoxLyne
// BoxPoly
// BoxArea
// BoxShape

var Box = fabric.util.createClass(fabric.Group, 
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
            this.box = new fabric.Rect(
                {
                    originX: 'center', 
                    originY: 'center',
                    top : 0,
                    left : 0,
                    width : 100,
                    height : 50,
                    fill: BACKGROUND_COLOR,
                    stroke: FOREGROUND_LINE_COLOR,
                    strokeWidth: BOX_STROKEWIDTH,
                }
            );
            this.addWithUpdate(this.box);

            // Draw up arrow
            var gridPoints = [  {x: this.box.left - this.box.width/2, y: this.box.top - this.box.height/2},
                                {x: this.box.left, y: this.box.top - this.box.height/2 - EDIT_ARROW_HEIGHT},
                                {x: this.box.left + this.box.width/2, y: this.box.top - this.box.height/2}   ];
            this.upArrow = new this.polygon = new fabric.Polygon(gridPointsToCoords(gridPoints),
                {
                    fill: FOREGROUND_LINE_COLOR, 
                }
            );
            this.addWithUpdate(this.upArrow);

            // Draw down arrow
            var gridPoints = [  {x: this.box.left - this.box.width/2, y: this.box.top + this.box.height/2},
                                {x: this.box.left, y: this.box.top + this.box.height/2 + EDIT_ARROW_HEIGHT},
                                {x: this.box.left + this.box.width/2, y: this.box.top + this.box.height/2}   ];
            this.downArrow = new this.polygon = new fabric.Polygon(gridPointsToCoords(gridPoints),
                {
                    fill: FOREGROUND_LINE_COLOR, 
                }
            );
            this.addWithUpdate(this.upArrow);

        },

        mouseOver: function() {
            this.box.set('strokeWidth', BOX_HOVER_STROKEWIDTH);
        },

        mouseOut: function() {
            this.box.set('strokeWidth', BOX_STROKEWIDTH);
        },

        onSelected: function(mouse_e) {
            this.box.set('fill', hex_light);

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
    }
);

var BoxPoly = fabric.util.createClass(Box, 
    {
        initialize: function(gridPoints) {

            this.callSuper('initialize');

            this.type = "boxPoly";
            this.gridPoints = gridPoints;

            // Create shape in miniature, fit into box
            // Shape will have secondary color
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
    }
);

var BoxShape = fabric.util.createClass(Box, 
    {
        initialize: function(img) {

            this.callSuper('initialize');

            this.type = "boxShape";
            this.img = img;

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
// Shadows & Solutions
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

            this.startPoint = gridPointsToCoords(gridPoints)[0];

            this.polygon = new fabric.Polygon(gridPointsToCoords(gridPoints),
                {
                 fill: SHADOW_COLOR, 
                 opacity: SHADOW_OPACITY,
                 selectable: false,
                }
            );

            this.addWithUpdate(this.polygon);
            
        },

    }
);


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

    }
);




