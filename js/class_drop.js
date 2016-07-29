

// Dropping or changing Level Pieces


// ----------------------------------
// Mouse-following
// ----------------------------------

var FollowLyne = fabric.util.createClass( fabric.Group,
    {
        initialize: function(gridWidth, gridHeight) {

            this.callSuper('initialize');

            this.type = "followLyne";

            this.gridWidth = gridWidth;
            this.gridHeight = gridHeight ? gridHeight : 0;
            console.log("this.gridHeight", this.gridHeight);
            this.startGridPoint = {x: 0, y: 0};
            this.startPoint = gridPointsToCoords(this.startGridPoint);
            this.endGridPoint = {x: this.gridWidth, y: this.gridHeight};
            console.log("mark 1");
            console.log("this.endGridPoint", this.endGridPoint);
            this.endPoint = gridPointsToCoords(this.endGridPoint);
            console.log("mark 2");

            this.centerOffsetX = (this.endPoint.x - this.startPoint.x) / 2;
            this.centerOffsetY = (this.endPoint.y - this.startPoint.y) / 2;

            console.log("mark 3");
            var gridPoints = [this.startGridPoint, this.endGridPoint];
            var coords = gridPointsToCoordsArray(gridPoints);
            console.log("mark 4");

            // ---- COPIED FROM LYNE CLASS -------

            if (currentLevel.levelOptions.lineAddition === "on") 
            {
                // calculate line coordinates
                distance_along_line_reverse(coords, LYNE_END_RAD);
            }

            
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
                    fill: color_main_DK, 
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

            this.addWithUpdate(this.startCircle);
            this.addWithUpdate(this.line);
            this.addWithUpdate(this.endCircle);

            this.set({originX: 'center', 
                      originY: 'center',});


        },

        update: function(mouse_e) {
            this.set({left: mouse_e.offsetX, 
                      top: mouse_e.offsetY,});
        },
        
        addToLevel: function() {

            // Calculate gridpoints
            var startGridPoint = coordsToGridPoints({x: this.left - this.centerOffsetX,
                                                     y: this.top - this.centerOffsetY});
            startGridPoint.x = Math.round(startGridPoint.x);
            startGridPoint.y = Math.round(startGridPoint.y);
            var endGridPoint = {x: startGridPoint.x + this.gridWidth,
                                y: startGridPoint.y + this.gridHeight};
            var gridPoints = [startGridPoint, endGridPoint];
            // Make Lyne
            var newLyne = new Lyne(gridPoints);
            currentLevel.addPiece(newLyne);

            // Remove temporary oject from level
            currentLevel.removePiece(this);
        },

        removeFromLevel: function() { 

            // Add box to level
            if(this.gridHeight === 0) {this.gridHeight = null;}
            var newBox = new BoxLyne(this.gridWidth, this.gridHeight);
            currentLevel.addPiece(newBox);

            // Remove temporary oject from level
            currentLevel.removePiece(this);
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

            // REMOVED BY ERIK 2016-07-22
            // this.startCircle = new fabric.Circle(
            //     { left: this.startPoint.x, 
            //     top:  this.startPoint.y, 
            //     radius: LYNE_START_RAD, 
            //     fill: color_main_DK, 
            //     originX: 'center', 
            //     originY: 'center',
            //     selectable: false,
            //     }
            // );

            // canvas.add(this.startCircle);

            this.lyne = null;
            this.indx = null;

            // Calculate angle ranges with corresponding coordinate points
            var validGridPoints = getValidGridPoints(gridWidth, gridHeight);
            this.points = validGridPoints.points;
            this.angles = validGridPoints.angles;


        },

        update: function(mouse_e) {

            // REMOVED BY ERIK 2016-07-22
            // Check if this is first update
            // if(!this.lyne){
            //     canvas.remove(this.startCircle);
            // }

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
            if (this.lyne) {currentLevel.removePiece(this.lyne);}

            // Save new index and point
            this.indx = newIndx;
            this.endGridPoint = {x: (this.startGridPoint.x + this.points[newIndx].x),
                             y: (this.startGridPoint.y + this.points[newIndx].y)};

            // Add new Lyne to group
            var newLyne = new Lyne([this.startGridPoint, this.endGridPoint]);
            this.lyne = newLyne;
            currentLevel.addPiece(this.lyne);
        },
        
        addToLevel: function() {
            // canvas.remove(this.lyne); 
            // currentLevel.addPiece(this.lyne);
            currentLevel.joinLynes(this.lyne);
            currentLevel.markCrossLynes();
        },
        
        removeFromLevel: function() {
            // canvas.remove(this.startCircle); 
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
                    fill: color_main_DK, 
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

