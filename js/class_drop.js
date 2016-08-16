

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
            this.startGridPoint = {x: 0, y: 0};
            this.startPoint = gridPointsToCoords(this.startGridPoint);
            this.endGridPoint = {x: this.gridWidth, y: this.gridHeight};
            this.endPoint = gridPointsToCoords(this.endGridPoint);

            this.centerOffsetX = (this.endPoint.x - this.startPoint.x) / 2;
            this.centerOffsetY = (this.endPoint.y - this.startPoint.y) / 2;

            var gridPoints = [this.startGridPoint, this.endGridPoint];
            var coords = gridPointsToCoordsArray(gridPoints);

            this.set({originX: 'center', 
                      originY: 'center',});

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

            // Call level updates for Lyne
            currentLevel.joinLynes(newLyne);

            // Remove temporary oject from level
            currentLevel.removePiece(this);
            currentLevel.mode = '';

            // Audio
            playSFX("snapToGrid");
        },

        removeFromLevel: function() { 

            // Remove temporary oject from level
            currentLevel.removePiece(this);
            currentLevel.mode = '';
        },
        
    }
);

var FollowCircle = fabric.util.createClass( fabric.Group,
    {
        initialize: function(radius) {

            this.callSuper('initialize');

            this.type = "followCircle";
            this.set({originX: 'center', 
                      originY: 'center',});

             this.radius = radius;


            // ---- COPIED FROM CIRCLE CLASS -------
            this.circle = new fabric.Circle(
                {
                 originX: 'center', 
                 originY: 'center',
                 left: 0,
                 top: 0,
                 radius: this.radius * GRID_PIXEL_SIZE,
                 fill: color_second_LT, 
                 stroke: color_second_DK,
                 strokeWidth: POLY_STROKEWIDTH,
                }
            );
            this.addWithUpdate(this.circle);   

        },

        update: function(mouse_e) {
            this.set({left: mouse_e.offsetX, 
                      top: mouse_e.offsetY,});
        },
        
        addToLevel: function() {

            // Calculate gridpoints
            var startGridPoint = coordsToGridPoints({x: this.left,
                                                     y: this.top});
            startGridPoint.x = Math.round(startGridPoint.x);
            startGridPoint.y = Math.round(startGridPoint.y);

            console.log("startGridPoint",startGridPoint);

            // Make Circle
            var newCircle = new Circle(startGridPoint, this.radius);
            currentLevel.addPiece(newCircle);

            // Remove temporary oject from level
            currentLevel.removePiece(this);

            currentLevel.mode = '';

            // Audio
            playSFX("snapToGrid");
        },

        removeFromLevel: function() { 

            // Remove temporary oject from level
            currentLevel.removePiece(this);

            currentLevel.mode = '';
        },
        
    }
);

var FollowPoly = fabric.util.createClass( fabric.Group,
    {
        initialize: function(gridPoints) {

            this.callSuper('initialize');

            this.type = "followPoly";
            this.set({originX: 'center', 
                      originY: 'center',});

            this.gridPoints = gridPoints;
            this.centerOffset = findCenterOffset(gridPoints); 

            console.log("this.centerOffset", this.centerOffset);

            // ---- COPIED FROM POLY CLASS -------
            this.polygon = new fabric.Polygon(gridPointsToCoords(gridPoints),
                {
                 originX: 'center', 
                 originY: 'center',
                 fill: color_main_LT, 
                 stroke: color_main_DK,
                 strokeWidth: POLY_STROKEWIDTH,
                }
            );

            this.addWithUpdate(this.polygon);   

        },

        update: function(mouse_e) {
            this.set({left: mouse_e.offsetX, 
                      top: mouse_e.offsetY,});
        },
        
        addToLevel: function() {

            // Calculate gridpoints
            var startGridPoint = coordsToGridPoints({x: this.left,
                                                     y: this.top});
            startGridPoint.x = Math.round(startGridPoint.x - this.centerOffset.x);
            startGridPoint.y = Math.round(startGridPoint.y - this.centerOffset.y);

            var newGridPoints = translateGridpointsToPoint(this.gridPoints, startGridPoint);

            console.log("newGridPoints", newGridPoints);

            // Make Lyne
            var newPoly = new PolyGroup(newGridPoints);
            currentLevel.addPiece(newPoly);

            // Remove temporary oject from level
            currentLevel.removePiece(this);
            currentLevel.mode = '';

            // Audio
            playSFX("snapToGrid");
        },

        removeFromLevel: function() { 

            // Remove temporary oject from level
            currentLevel.removePiece(this);
            currentLevel.mode = '';
        },
        
    }
);


var FollowArea = fabric.util.createClass( fabric.Group,
    {
        initialize: function(gridArea) {

            this.callSuper('initialize');

            this.type = "followArea";
            this.set({originX: 'center', 
                      originY: 'center',});

            this.gridArea = Math.round(gridArea);
            this.gridPoints = [{x: 0, y: 0},{x: 0, y: 1},{x: 1, y: 1},{x: 1, y: 0}];
            

            // Square
            this.polygon = new fabric.Polygon(gridPointsToCoords(this.gridPoints),
                {
                 originX: 'center', 
                 originY: 'center',
                 fill: color_main_DK, 
                 stroke: color_main_DK,
                 strokeWidth: POLY_STROKEWIDTH,
                }
            );

            // Text
            this.areaString = '  ' + this.gridArea.toString() + '  ';
            this.areaStringTextbox = new fabric.Text(this.areaString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: this.polygon.left, 
                    top: this.polygon.top,
                    fontSize: BOX_FONTSIZE,
                    fill: BACKGROUND_COLOR,
                });

            this.addWithUpdate(this.polygon);  
            this.addWithUpdate(this.areaStringTextbox); 

        },

        update: function(mouse_e) {
            this.set({left: mouse_e.offsetX, 
                      top: mouse_e.offsetY,});
        },
        
        addToLevel: function() {

            // Calculate middle gridpoint
            var centerGridPoint = coordsToGridPoints({x: this.left,
                                                     y: this.top});
            centerGridPoint.x = Math.round(centerGridPoint.x - 0.5) + 0.5;
            centerGridPoint.y = Math.round(centerGridPoint.y - 0.5) + 0.5;

            if (this.gridArea > 1) {

                var pack = new PackArea(centerGridPoint, this.gridArea);
                currentLevel.addPiece(pack);

            } else if (this.gridArea === 1) { 
                // Add polygon of size 1
                var gridPoint = {x: Math.round(centerGridPoint.x - 0.5), y: Math.round(centerGridPoint.y - 0.5)};
                var rectangle = new PolyGroup([{x: gridPoint.x,     y: gridPoint.y },
                                                {x: gridPoint.x,     y: gridPoint.y + 1},
                                                {x: gridPoint.x + 1, y: gridPoint.y + 1},
                                                {x: gridPoint.x + 1, y: gridPoint.y }], this.gridArea);
                currentLevel.addPiece(rectangle);
            }

            // Reset mode
            currentLevel.mode = '';
            console.log("selectable", this.selectable);
            currentLevel.removePiece(this);

            // Play audio - Add to level
            playSFX("snapToGrid");
        },

        removeFromLevel: function() { 

            // Remove temporary oject from level
            currentLevel.removePiece(this);
            currentLevel.mode = '';
        },
        
    }
);


// ----------------------------------
// Packaged Object
// ----------------------------------

var PackArea = fabric.util.createClass( LevelPiece,
    {
        initialize: function(centerGridPoint, gridArea) {


            this.callSuper('initialize');

            this.type = "packArea";
            this.set({originX: 'center', 
                      originY: 'center',});

            this.gridArea = Math.round(gridArea);
            this.centerGridPoint = centerGridPoint;
            this.gridPoints = [ {x: centerGridPoint.x, y: centerGridPoint.y - 1},
                                {x: centerGridPoint.x, y: centerGridPoint.y },
                                {x: centerGridPoint.x + 1, y: centerGridPoint.y },
                                {x: centerGridPoint.x + 1, y: centerGridPoint.y - 1}];
            

            // Square
            this.polygon = new fabric.Polygon(gridPointsToCoords(this.gridPoints),
                {
                 originX: 'center', 
                 originY: 'center',
                 fill: color_main_DK, 
                 stroke: color_main_DK,
                 strokeWidth: DROP_AREA_STROKEWIDTH,
                }
            );

            // Text
            this.areaString = '  ' + this.gridArea.toString() + '  ';
            this.areaStringTextbox = new fabric.Text(this.areaString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: this.polygon.left, 
                    top: this.polygon.top,
                    fontSize: BOX_FONTSIZE,
                    fill: BACKGROUND_COLOR,
                });

            this.addWithUpdate(this.polygon);  
            this.addWithUpdate(this.areaStringTextbox); 


        },

        mouseOver: function() {
            if (this.selectable) {
                this.set({'strokeWidth': DROP_AREA_STROKEWIDTH + DROP_AREA_HOVER_GROWTH});

                // Audio
                playSFX("rotateHover");
            }
        },

        mouseOut: function() {
            this.set({'strokeWidth': DROP_AREA_STROKEWIDTH});
        },

        onSelected: function(mouse_e) { 

            var drop = new DropArea(this.centerGridPoint, this.gridArea);
            drop.update(mouse_e);
            currentLevel.addPiece(drop);

            //Set level mode
            currentLevel.mode = 'dropping';
            currentLevel.droppingObject = drop;
            currentLevel.removePiece(this);
        },

        encloses: function(gridPoint) {
            var gridPoints = [ {x: this.centerGridPoint.x - 0.5, y: this.centerGridPoint.y - 0.5},
                                {x: this.centerGridPoint.x - 0.5, y: this.centerGridPoint.y + 0.5},
                                {x: this.centerGridPoint.x + 0.5, y: this.centerGridPoint.y + 0.5},
                                {x: this.centerGridPoint.x + 0.5, y: this.centerGridPoint.y - 0.5}];
            return poly_encloses_point(gridPoints, gridPoint);
        },

        scale: function(number) {
            // Scale area for scalar NumberBall
            
            // Add Packed Areas to grid (starting in the +x direction)
            for (var i = 1; i < number; i++) {

                // Calculate new start point
                var newStartX = this.centerGridPoint.x + i <= 5? 
                                this.centerGridPoint.x + i: 
                                this.centerGridPoint.x - (this.centerGridPoint.x + i - 5);
                var newStartGridPoint = {x: newStartX, y: this.centerGridPoint.y};

                // Make new Packed Areas at new location and add to Level
                var newPack = new PackArea(newStartGridPoint, this.gridArea);
                currentLevel.addPiece(newPack);
            }
            
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

            // Audio
            playSFX("rotateChange");
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



// For user interface when creating Area objects
var DropArea = fabric.util.createClass( 
    {
        initialize: function(centerGridPoint, gridArea) {

            this.type = "dropArea";

            this.gridArea = Math.round(gridArea);
            this.centerGridPoint = centerGridPoint;
            this.centerPoint = gridPointsToCoords(this.centerGridPoint); 

            this.rectangle = null;
            this.indx = null;
            
            this.startBox = new fabric.Rect({
                    originX: 'center', 
                    originY: 'center',
                    left: this.centerPoint.x, 
                    top:  this.centerPoint.y, 
                    width : GRID_PIXEL_SIZE,
                    height : GRID_PIXEL_SIZE,
                    fill: color_main_DK, 
                    opacity: DROPPING_OPACITY,
                    selectable: false,
                
            });
            this.startBox.type = "temporary";
            

            currentLevel.addPiece(this.startBox);
            

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
            var angle = getAngleFromPoints(this.centerPoint, {x: mouse_e.offsetX, y: mouse_e.offsetY});
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
            var p0 = this.centerGridPoint;
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

            // Audio
            playSFX("rotateChange");
        },
        
        addToLevel: function() {
            currentLevel.removePiece(this.startBox);

            canvas.remove(this.rectangle); 
            currentLevel.addPiece(this.rectangle);

            // Audio
            playSFX("snapToGrid");

        },
        
        removeFromLevel: function() {
            currentLevel.removePiece(this.startBox);
        },
    }
);

