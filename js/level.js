
//-----------------------------------------------------------------------------//
/*
 *  Name:       Level
 *  Abstract:   NO
 *  Superclass: n/a
 *  
 *  Description: Level object, keeps track of level pieces.
 *     
 //-----------------------------------------------------------------------------*/           

function Level() 
{

    //--------------------
    // MEMBERS
    //--------------------

    // Level layout
    this.levelOptions = null;
    this.boardImg = null;
    this.bin = null;
    this.crossButton = null;
    this.borders = [];
    this.levelImages = [];
    this.boardImage = null;

    // Piece management
    this.allPieces = [];
    this.nextPieceID = 1;
    this.selectedPiece = null;

    // Solution Manager (Win conditions)
    this.solutionManager = null

    // Immovable pieces
    this.shadows = [];
    this.boxLynes = [];
    this.boxes = [];
    this.crossMarks = [];

    // Scalars and operators
    this.balls = [];

    // grid pieces
    this.lynes = [];
    this.lyneEnds = [];
    this.polygons = [];
    this.shapes = [];
    this.circles = [];

    // current settings
    this.mode = '';
    this.temporary = [];
    this.selectedObject = null;
    this.hoveringObject = null;
    this.droppingObject = null;
    this.droppingBox = null;
    this.renderCanvasRequired = false;


    // TEMPORARY WIN MESSAGE
    var textShadow = new fabric.Shadow({color: 'white', blur: 20});
    this.levelSolvedMessage = new fabric.Text("You Win!", 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: canvasCenterX, 
                    top: 60,
                    stroke: 'gray',
                    strokeWidth: 1,
                    fontSize: 60,
                    opacity: 0,
                    shadow: textShadow,
                });
    canvas.add(this.levelSolvedMessage);

    return this;
}

/**
 * CONSTRUCTOR
 *
 * @param  pieces [Array]
 * @return {Level}
 */
Level.init = function(levelOptions, _pieces)
{
    _pieces = typeof _pieces != 'undefined' ? _pieces : [];

    var instance = new Level();
    instance.levelOptions = levelOptions;
    instance.loadBoard();
    instance.addPieces(_pieces);
    instance.updateBoard();
    return instance;
}


/**
 * Main Game Loop
 */
Level.prototype.tick = function()
{
    if(this.renderCanvasRequired){
        canvas.renderAll();
        this.renderCanvasRequired = false;
    }
}

// ##################################
// Board
// ##################################

/**
 * Load board objects
 *
 * @param   
 * @return {}
 */
Level.prototype.loadBoard = function()
{

    // Load board image

    this.boardImage = new fabric.Image(board_images[0], {
        left: gridLeft,
        top:  gridTop,
        selectable: false,
    });
    canvas.add(this.boardImage);

    // DOESN'T WORK
    // fabric.Image.fromURL('img/grid_400_400_purple.png', function (img) {
    //     canvas.add( img.set({ left: gridLeft, top: gridTop }) ); //.scale(0.25)
    // }, {crossOrigin: ''});


    // Create grid borders 

    // North
    this.gridBorderNorth = new fabric.Rect({
        originX: "left",
        originY: "top",
        left: -10,
        top: -10,
        width: canvasWidth + 10, 
        height: gridTop, //- GRID_PADDING (removed for North)
        selectable: false,
    });
    this.gridBorderNorth.setGradient("fill", { 
        x1: this.gridBorderNorth.width / 2,
        y1: this.gridBorderNorth.height - GRID_BORDER_FADE_NORTH,
        x2: this.gridBorderNorth.width / 2,
        y2: this.gridBorderNorth.height,
        colorStops: {
            0: BACKGROUND_COLOR,
            0.9: "rgba(255,255,255,0)",
        }
    });
    // South
    this.gridBorderSouth = new fabric.Rect({
        originX: "left",
        originY: "top",
        left: 0,
        top: gridBot + GRID_PADDING,
        width: canvasWidth + 10,
        height: canvasHeight + 10,
        selectable: false,
    });
    this.gridBorderSouth.setGradient("fill", { 
        x1: this.gridBorderSouth.width / 2,
        y1: GRID_BORDER_FADE,
        x2: this.gridBorderSouth.width / 2,
        y2: 0,
        colorStops: {
            0: BACKGROUND_COLOR,
            0.9: "rgba(255,255,255,0)",
        }
    });
    // East
    this.gridBorderEast = new fabric.Rect({
        originX: "left",
        originY: "top",
        left: gridRight + GRID_PADDING,
        top: -10,
        width: canvasWidth + 10,
        height: canvasHeight + 10,
        selectable: false,
    });
    this.gridBorderEast.setGradient("fill", { 
        x1: GRID_BORDER_FADE,
        y1: this.gridBorderEast.height / 2,
        x2: 0,
        y2: this.gridBorderEast.height / 2,
        colorStops: {
            0: BACKGROUND_COLOR,
            0.9: "rgba(255,255,255,0)",
        }
    });
    // West
   this.gridBorderWest = new fabric.Rect({
        originX: "left",
        originY: "top",
        left: -10,
        top: -10,
        width: gridLeft - GRID_PADDING,
        height: canvasHeight + 10,
        selectable: false,
    });
    this.gridBorderWest.setGradient("fill", { 
        x1: this.gridBorderWest.width - GRID_BORDER_FADE,
        y1: this.gridBorderWest.height / 2,
        x2: this.gridBorderWest.width,
        y2: this.gridBorderWest.height / 2,
        colorStops: {
            0: BACKGROUND_COLOR,
            0.9: "rgba(255,255,255,0)",
        }
    });
    canvas.add(this.gridBorderNorth, 
                this.gridBorderWest, 
                this.gridBorderEast, 
                this.gridBorderSouth );


    // Create cross button
    this.crossButton = new ControlButton("cross", {x: canvasCenterX, 
                                               y: canvasHeight - (canvasHeight - gridBot)/2});
    if (this.levelOptions.crossButton !== "none") {
        canvas.add(this.crossButton);
    }
}

/**
 * Manipulates the order of objects
 *
 * @param   
 * @return {}
 */
Level.prototype.updateBoard = function()
{
    // Board image
    this.boardImage.sendToBack();

    // Shadows
    for (var i = 0; i < this.shadows.length; i++) {
        if(this.shadows[i].polygon) {this.shadows[i].polygon.sendToBack();}
        else if(this.shadows[i].circle) {this.shadows[i].circle.sendToBack();}
    }

    // Polygons - unmodified (for selection purposes)
    // Shapes - unmodified (for selection purposes)

    // Lynes
    for (var i = 0; i < this.lynes.length; i++) {
        this.lynes[i].bringToFront();
        this.lynes[i].lyneEndControl.bringToFront();
    }
    // Grid borders E/W
    this.gridBorderEast.bringToFront();
    this.gridBorderWest.bringToFront();
    // Boxes
    for (var i = 0; i < this.boxes.length; i++) {
        this.boxes[i].bringToFront();
    }
    for (var i = 0; i < this.boxLynes.length; i++) {
        this.boxLynes[i].bringToFront();
    }
    // Grid borders N/S
    this.gridBorderNorth.bringToFront();
    this.gridBorderSouth.bringToFront();

    // Temporary objects
    for (var i = 0; i < this.temporary.length; i++) {
        this.temporary[i].bringToFront();
    }

    // Cross marks
    for (var i = 0; i < this.crossMarks.length; i++) {
        this.crossMarks[i].bringToFront();
    }

    // Balls
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].bringToFront();
    }

    // buttons
    if(this.levelOptions.crossButton !== "none") {this.crossButton.bringToFront();}

    // TEMP LEVEL WIN MESSAGE
    this.levelSolvedMessage.bringToFront();

    // Call canvas.renderAll() through currentLevel.tick()
    this.renderCanvasRequired = true;

    console.log("updateBoard");
}


// ##################################
// Pieces
// ##################################

Level.prototype.getNextPieceID = function()
{
    this.nextPieceID += 1;
    return (this.nextPieceID - 1);
}

/**
 * Bring piece to front
 *
 * @param  _piece 
 * @return {}
 */

Level.prototype.bringPieceToFront = function(_piece)
{

    if (_piece) {
        _piece.bringToFront();
        if (_piece.type === 'lyne') {_piece.lyneEndControl.bringToFront();}
        this.updateBoard();
    }

    // TODO: change order of arrays so that piece order on canvas can change.
}

/**
 * Add pieces to level.
 *
 * @param  _pieces [Array]
 * @return {}
 */
Level.prototype.addPieces = function(_pieces)
{
    if (!_pieces) {return;}
    for (var i = 0; i < _pieces.length; i++) {
        this.addPiece(_pieces[i]);
    }
}

/**
 * Add piece to level.
 *
 * @param  _piece
 * @return {}
 */
Level.prototype.addPiece = function(_piece)
{
    if (_piece.type === "solution") 
    {
        this.solutionManager = _piece;
        return;
    } 
    else if (_piece.type === "lyne") 
    {
        this.lynes.push(_piece);
        if (_piece.lyneEndControl) {this.addPiece(_piece.lyneEndControl);}
    } 
    else if (_piece.type === "lyneEnd")
    {
        this.lyneEnds.push(_piece);
        canvas.add(_piece);
        return; // Sub-piece attached to lyne, does not need to be added, no updateBoard().
    }
    else if (_piece.type === "poly")
    {
        this.polygons.push(_piece);
    }
    else if (_piece.type === "circle")
    {
        this.circles.push(_piece);
    }
    else if (_piece.type === "ball")
    {        
        this.addBall(_piece);
    }
    else if (_piece.type === "boxLyne")
    {
        this.addBoxLyne(_piece);
    }
    else if (_piece.type === "boxPoly")
    {
        this.addBox(_piece);
    }
    else if (_piece.type === "boxCircle")
    {
        this.addBox(_piece);
    }
    else if (_piece.type === "boxArea")
    {
        this.addBox(_piece);
    }
    else if (_piece.type === "boxShape")
    {
        this.addBox(_piece);
    }
    else if (_piece.type === "shadow" || _piece.type === "shadowCircle")
    {
        this.shadows.push(_piece);
    }
    else if (_piece.type === "temporary")
    {
        this.temporary.push(_piece);
    }
    else 
    {
        console.log("Piece has invalid type:", _piece.type, _piece);
        return;
    }

    canvas.add(_piece);
    this.allPieces.push(_piece);
    this.updateBoard();
}

/**
 * Remove pieces from level. 
 *
 * @param  pieces [Array]
 * @return {}
 */
Level.prototype.removePieces = function(_pieces)
{
    if (!_pieces) {return;}
    for (var i = 0; i < _pieces.length; i++) {
        this.removePiece(_pieces[i]);
    }
}

/**
 * Remove piece from level. 
 *
 * @param  piece 
 * @return {}
 */
Level.prototype.removePiece = function(_piece)
{
    if (_piece.type === "solution") 
    {
        this.solutionManager = new SolutionManager([[]]);
        return;
    } 
    else if (_piece.type === "lyne") 
    {
        canvas.remove(_piece); // Workaround for when lyneEndControl is selected 
        if(_piece.lyneEndControl) {this.removePiece(_piece.lyneEndControl);}

        this.lynes = this.lynes.filter(function(e){return e!==_piece});
        console.log("Removed lyne", _piece);
    } 
    else if (_piece.type === "lyneEnd")
    {
        this.lyneEnds = this.lyneEnds.filter(function(e){return e!==_piece});
        console.log("Removed lyneEnd", this.lyneEnds);
    }
    else if (_piece.type === "poly")
    {
        this.polygons = this.polygons.filter(function(e){return e!==_piece});
    }
    else if (_piece.type === "circle")
    {
        this.circles = this.circles.filter(function(e){return e!==_piece});
    }
    else if (_piece.type === "ball")
    {
        this.balls = this.balls.filter(function(e){return e!==_piece});
        this.updateBalls();
    }
    else if (_piece.type === "boxLyne")
    {
        this.boxLynes = this.boxLynes.filter(function(e){return e!==_piece});
        this.updateBoxLynes();
    }
    else if (_piece.type === "boxPoly")
    {
        this.boxes = this.boxes.filter(function(e){return e!==_piece});
        this.updateBoxes();
    }
    else if (_piece.type === "boxCircle")
    {
        this.boxes = this.boxes.filter(function(e){return e!==_piece});
        this.updateBoxes();
    }
    else if (_piece.type === "boxArea")
    {
        this.boxes = this.boxes.filter(function(e){return e!==_piece});
        this.updateBoxes();
    }
    else if (_piece.type === "boxShape")
    {
        this.boxes = this.boxes.filter(function(e){return e!==_piece});
        this.updateBoxes();
    }
    else if (_piece.type === "shadow" || _piece.type === "shadowCircle")
    {
        this.shadows = this.shadows.filter(function(e){return e!==_piece});
    }
    else if (_piece.type === "temporary")
    {
        this.temporary = this.temporary.filter(function(e){return e!==_piece});
    }
    else 
    {
        console.log("Piece has invalid type:", _piece);
        return;
    }

    canvas.remove(_piece);
    delete _piece;
    console.log("Got to bottom");
}


// ##################################
// Selectability
// ##################################

Level.prototype.makeGridPiecesSelectable = function()
{
    var shapePieces = this.polygons.concat(this.shapes, this.lynes, this.lyneEnds, this.circles);
    for (var i = 0; i < shapePieces.length; i++) {
        shapePieces[i].selectable = true;
    }
}

Level.prototype.makeGridPiecesUnselectable = function()
{
    var shapePieces = this.polygons.concat(this.shapes, this.lynes, this.lyneEnds, this.circles);
    for (var i = 0; i < shapePieces.length; i++) {
        shapePieces[i].selectable = false;
    }    
}

// ##################################
// Deleting Pieces
// ##################################

Level.prototype.deletePieces = function()
{       
    this.removePieces(this.allPieces);
}

Level.prototype.deleteShadows = function()
{
    this.removePieces(this.shadows);
    this.shadows = [];
}

Level.prototype.deleteSolution = function()
{
    this.removePieces(this.solutionManager);
}


// ##################################
// Boxes
// ##################################

Level.prototype.addBoxLyne = function(_piece)
{   
    // TODO: Check if already have a box for that Lyne length, if so add to its count and return

    // Move piece to "new piece location" and set transparency to zero,
    _piece.set({left: BOXLYNE_START_X, top: BOXLYNE_START_Y, opacity: 0});

    // Set up animation for all boxes to move to new position
    for (var i = 0; i < this.boxLynes.length; i++) {
        var newY = BOXLYNE_START_Y - ((i+1) * BOXLYNE_HEIGHT) - ((i+1) * BOXLYNE_PADDING);
        var indx = this.boxLynes.length - i - 1;
        this.boxLynes[indx].animate(
            {left: BOXLYNE_START_X, top: newY} , 
            {
              duration: BOXLYNE_MOVE_TIME,
            }
        );
    }
    // Set up _piece animation
    _piece.animate(
        {opacity: 1} , 
        {
          duration: 2 * BOXLYNE_MOVE_TIME,
          onChange: function () {currentLevel.renderCanvasRequired = true},
        }
    );

    // Add to Level array
    this.boxLynes.push(_piece);
}

Level.prototype.updateBoxLynes = function()
{

    // Set up animation for all boxes to move to correct position
    for (var i = 0; i < this.boxLynes.length; i++) {
        var newY = BOXLYNE_START_Y - (i * BOXLYNE_HEIGHT) - (i * BOXLYNE_PADDING);
        var indx = this.boxLynes.length - i - 1;
        this.boxLynes[indx].animate(
            {left: BOXLYNE_START_X, top: newY} , 
            {
              duration: BOXLYNE_MOVE_TIME,
              onChange: function () {currentLevel.renderCanvasRequired = true},
            }
        );
    }
}

Level.prototype.addBox = function(_piece)
{   

    // Move piece to "new piece location" and set transparency to zero,
    _piece.set({left: BOX_START_X, top: BOX_START_Y, opacity: 0});

    // Set up animation for all boxes to move to new position
    for (var i = 0; i < this.boxes.length; i++) {
        var newY = BOX_START_Y - ((i+1) * BOX_HEIGHT) - ((i+1) * BOX_PADDING);
        var indx = this.boxes.length - i - 1;
        this.boxes[indx].animate(
            {left: BOX_START_X, top: newY} , 
            {
              duration: BOX_MOVE_TIME,
            }
        );
    }
    // Set up _piece animation
    _piece.animate(
        {opacity: 1} , 
        {
          duration: 2 * BOX_MOVE_TIME,
          onChange: function () {currentLevel.renderCanvasRequired = true},
        }
    );

    // Add to Level array
    this.boxes.push(_piece);
}

Level.prototype.updateBoxes = function()
{
    // Set up animation for all boxes to move to new position
    for (var i = 0; i < this.boxes.length; i++) {
        var newY = BOX_START_Y - (i * BOX_HEIGHT) - (i * BOX_PADDING);
        var indx = this.boxes.length - i - 1;
        this.boxes[indx].animate(
            {left: BOX_START_X, top: newY} , 
            {
              duration: BOX_MOVE_TIME,
              onChange: function () {currentLevel.renderCanvasRequired = true},
            }
        );
    }

}

Level.prototype.deselectBox = function(box, mouse_e)
{
    var mouseX = mouse_e.offsetX;
    var mouseY = mouse_e.offsetY;

    var gridPoint = coordsToGridPoints({x: mouseX, y: mouseY});  
    

    if (!pointInGrid(gridPoint)) {return;}

    this.mode = 'dropping';
    // Mark box for removal
    this.droppingBox = box;

    if (box.type === 'boxLyne') 
    {
        // Round to closest grid point
        gridPoint.x = Math.round(gridPoint.x);
        gridPoint.y = Math.round(gridPoint.y);

        // Attempt to add Lyne object to Grid
        this.addLyneToGrid(gridPoint, box.gridWidth, box.gridHeight);

    } else if(box.type === 'boxArea') {

        // Calculate closest center point e.g. (0.5, 0.5)
        gridPoint.x = Math.round(gridPoint.x + 0.5) - 0.5;
        gridPoint.y = Math.round(gridPoint.y + 0.5) - 0.5;

        // Attempt to add Area to Grid as PolyGroup
        this.addAreaToGrid(gridPoint, box.gridArea);

    } else if(box.type === 'boxPoly') {

        // Round to closest grid point
        gridPoint.x = Math.round(gridPoint.x);
        gridPoint.y = Math.round(gridPoint.y);

        // Attempt to add polygon to Grid as PolyGroup
        this.addPolyToGrid(gridPoint, box.gridPoints);       

    } else if(box.type === 'boxCircle') {

        // Round to closest grid point
        gridPoint.x = Math.round(gridPoint.x);
        gridPoint.y = Math.round(gridPoint.y);

        // Attempt to add polygon to Grid as PolyGroup
        this.addCircleToGrid(gridPoint, box.radius);    
    }
    
}

Level.prototype.addAreaToGrid = function(gridPoint, gridArea)
{
    var dropArea = new DropArea(gridPoint, gridArea);

    this.droppingObject = dropArea;
    this.updateBoard();
}

Level.prototype.addPolyToGrid = function(startPoint, gridPoints)
{
    // Calculate new gridpoint positions
    var newGridPoints = translateGridpointsToPoint(gridPoints, startPoint);

    // Create PolyGroup object at gridPoint
    var poly = new PolyGroup(newGridPoints);
    currentLevel.addPiece(poly);
}
Level.prototype.addCircleToGrid = function(gridPoint, radius)
{
    // Create Circle object at gridPoint
    var circle = new Circle(gridPoint, radius);
    currentLevel.addPiece(circle);
}

// ##################################
// Balls
// ##################################

Level.prototype.addBall = function(_piece)
{   

    var startX = this.crossButton.left - (CROSS_BTN_WIDTH + NUMBER_BALL_RAD + NUMBER_BALL_PADDING);
    var startY = this.crossButton.top;

    // Move piece to "new piece location" and set opacity to zero,
    _piece.set({left: startX, 
                top: startY, 
                opacity: 0});
    _piece.setCenterPoint({x: startX, y: startY});

    // Set up animation for all balls to move to new position
    for (var i = 0; i < this.balls.length; i++) {
        var newX = startX - ((i+1) * 2 * NUMBER_BALL_RAD) - ((i+1) * NUMBER_BALL_PADDING);
        var indx = this.balls.length - i - 1;

        this.balls[indx].setCenterPoint({x: newX, y: startY});
        this.balls[indx].animate(
            {left: newX, top: startY} , 
            {
              duration: NUMBER_BALL_MOVE_TIME,
            }
        );
    }


    // Set up _piece animation
    _piece.animate(
        {opacity: 1} , 
        {
          duration: 2 * NUMBER_BALL_MOVE_TIME,
          onChange: function () {currentLevel.renderCanvasRequired = true},
        }
    );

    // Add to Level array
    this.balls.push(_piece);
}

Level.prototype.updateBalls = function()
{
    var startX = this.crossButton.left - (CROSS_BTN_WIDTH + NUMBER_BALL_RAD + NUMBER_BALL_PADDING);
    var startY = this.crossButton.top;

    // Set up animation for all balls to move to new position
    for (var i = 0; i < this.balls.length; i++) {
        var newX = startX - (i * 2 * NUMBER_BALL_RAD) - (i * NUMBER_BALL_PADDING);
        var indx = this.balls.length - i - 1;

        this.balls[indx].setCenterPoint({x: newX, y: startY});
        this.balls[indx].moveToCenterPoint();
    }

}

Level.prototype.ballMoving = function(ball)
{

    var ballPoint = coordsToGridPoints({x: ball.left, y: ball.top});
    
    var shapePieces = this.polygons.concat(this.shapes, this.lynes, this.circles);

    // Check if hovering on lynes 
    for (var i = 0; i < shapePieces.length; i++) {
        if(shapePieces[i].encloses(ballPoint)) {

            if(this.hoveringObject === shapePieces[i]) {return;}

            // establish new hovering object
            if(this.hoveringObject) {this.hoveringObject.mouseOut();}
            this.hoveringObject = shapePieces[i];
            this.hoveringObject.mouseOver();
            this.updateBoard();
            return;
        }
    }

    // Not overlapping any level pieces
    if (this.hoveringObject) {
        this.hoveringObject.mouseOut();
        this.hoveringObject = null;
        this.updateBoard();
    }
}

Level.prototype.ballDropped = function(ball)
{   
    // Get center of ball
    var ballPoint = coordsToGridPoints({x: ball.left, y: ball.top});

    var shapePieces = this.lynes.concat(this.circles, this.polygons);

    // Check if dropped on shapes 
    for (var i = 0; i < shapePieces.length; i++) 
    {
        if(shapePieces[i].encloses(ballPoint)) {
            // scale shape
            shapePieces[i].scale(ball.number);
            // remove ball
            this.removePiece(ball);
            return;
        }
    }

    // Ball was not dropped on level piece
    ball.moveToCenterPoint();
}


// ##################################
// Lynes
// ##################################

/**
 * Vector addition with Lyne objects
 *
 * @param  lyne [Lyne]
 * @return {}
 */
Level.prototype.joinLynes = function(lyne)
{

    // Courtesy check, return if there are only two lines on board
    if (this.levelOptions.lineAddition !== "on") {return;}


    var p0 = lyne.startGridPoint;
    var p1 = lyne.endGridPoint;
    var lyne2, p2, p3;

    for (var i = 0; i < this.lynes.length; i++) {
        lyne2 = this.lynes[i];
        if (lyne === lyne2) { continue; }
        p2 = lyne2.startGridPoint;
        p3 = lyne2.endGridPoint;

        // Check for null condition
        if (p1.x === p2.x && p1.y === p2.y && p0.x === p3.x && p0.y === p3.y) {
            break;
        }

        // Check for lyne addition conditions (head to butt / butt to head)
        if (p1.x === p2.x && p1.y === p2.y) {
            // Create new lyne, p0 -> p3
            var lyne_sum = new Lyne([p0, p3]);
            this.addPieces([lyne_sum]);
            // Remove old lines
            this.removePieces([lyne, lyne2]);

            break;

        } else if (p0.x === p3.x && p0.y === p3.y) {
            // Create new lyne, p2 -> p1
            var lyne_sum = new Lyne([p2, p1]);
            this.addPieces([lyne_sum]);
            // Remove old lines
            this.removePieces([lyne, lyne2]);

            break;

        }

        // SUBTRACTION

        // // Check for lyne subtraction conditions (head to head)
        // if (p1.x === p3.x && p1.y === p3.y) {
        //     // Create new lyne, p2 -> p0
        //     var lyne_sum = new Lyne([p2, p0]);
        //     this.addPieces([lyne_sum]);
        //     // Remove old lines
        //     this.removePieces([lyne, lyne2]);

        //     break;

        // } 
        
    }
}


Level.prototype.addLyneToGrid = function(gridPoint, gridWidth, gridHeight, currentLyne)
{
    console.log("addLyneToGrid currentLyne", currentLyne);

    var dropLyne = new DropLyne(gridPoint, gridWidth, gridHeight);
    if (currentLyne) {dropLyne.lyne = currentLyne; console.log("currentLyne",currentLyne);} 

    this.droppingObject = dropLyne;

    this.updateBoard();
}

/**
 * Create a cross-mark at specified point.
 *
 * @param  point (canvas coordinates)
 * @return {}
 */
Level.prototype.createCrossMark = function(point)
{

    var rect = new fabric.Rect({
        originX: "center",
        originY: "center",
        width: 2 * (LYNE_START_RAD + LYNE_HOVER_GROWTH),
        height: 2 * (LYNE_START_RAD + LYNE_HOVER_GROWTH),
        left: point.x,
        top: point.y,
        fill: BUTTON_COLOR,
        selectable: false,
    });
    this.crossMarks.push(rect);
    canvas.add(rect);

    rect.animate('angle', '+180', {
      duration: 1000,
      onChange: function () {currentLevel.renderCanvasRequired = true},
      // onComplete: 
      easing: fabric.util.ease["easeOutBack"],
    });
}

/**
 * Delete a cross-mark at specified point.
 *
 * @param  point (canvas coordinates)
 * @return {}
 */
Level.prototype.removeCrossMark = function(point)
{
    var toRemove = [];
    for (var i = 0; i < this.crossMarks.length; i++)
    {
        var rect = this.crossMarks[i];

        if (rect.left === point.x && rect.top === point.y) 
        {
            toRemove.push(rect);
        }
    }

    for (var i = 0; i < toRemove.length; i++)
    {
        canvas.remove(toRemove[i]);
        this.crossMarks = this.crossMarks.filter(function(e){return e!==toRemove[i]});
    }
}

/**
 * Delete all cross-marks.
 *
 * @param  point (canvas coordinates)
 * @return {}
 */
Level.prototype.removeAllCrossMarks = function(point)
{
    for (var i = 0; i < this.crossMarks.length; i++)
    {
        canvas.remove(this.crossMarks[i]);
    }

    this.crossMarks = [];   
}


/**
 * Mark all points where cross can occur
 *
 * @param 
 * @return {}
 */
Level.prototype.markCrossLynes = function()
{
    if (currentLevel.levelOptions.crossButton === "none") {return;}

    // delete all previous marks
    this.removeAllCrossMarks();

    // make new marks
    var lyne1, lyne2;
    for (var i = 0; i < this.lynes.length - 1; i++) {
        lyne1 = this.lynes[i];
        for (var j = i+1; j < this.lynes.length; j++) {
            lyne2 = this.lynes[j];
            if (lyne1.startGridPoint.x === lyne2.startGridPoint.x &&
                lyne1.startGridPoint.y === lyne2.startGridPoint.y) {

                this.createCrossMark(lyne1.startPoint);
            }
        }
    }
}

/**
 * Perform cross product for all Lynes that have same start point
 *
 * @param  
 * @return {}
 */
Level.prototype.crossLynes = function()
{
    if (currentLevel.levelOptions.crossButton === "none") {return;}

    // Remove cross marks
    this.removeAllCrossMarks();

    // check starting number of Lynes
    if (this.lynes.length < 2) {return;}

    var lyne1, lyne2, toCross = [];

    // Find all pairs that can be crossed
    for (var i = 0; i < this.lynes.length - 1; i++) {
        lyne1 = this.lynes[i];
        for (var j = i+1; j < this.lynes.length; j++) {
            lyne2 = this.lynes[j];

            if (lyne1.startGridPoint.x === lyne2.startGridPoint.x &&
                lyne1.startGridPoint.y === lyne2.startGridPoint.y) {

                toCross.push([lyne1, lyne2]);
            }
        }
    }

    for (var i = 0; i < toCross.length; i++) {

        var lyne1 = toCross[i][0];
        var lyne2 = toCross[i][1];
        var p0, p1, p2, p3;

        // Check that both lynes are on the board
        if (!lyne1 || !lyne2 ||
            this.lynes.indexOf(lyne1) === -1 || 
            this.lynes.indexOf(lyne2) === -1 )
        {
            continue;
        }
        // Create polygon
        p0 = lyne1.startGridPoint;
        p1 = lyne1.endGridPoint;
        p3 = lyne2.endGridPoint;
        p2 = {x: (p1.x - p0.x) + (p3.x - p0.x) + p0.x,
              y: (p1.y - p0.y) + (p3.y - p0.y) + p0.y};

        // Add polygon
        var PG = new PolyGroup([p0, p1, p2, p3]);
        currentLevel.addPiece(PG);
        // Delete lynes
        currentLevel.removePieces([lyne1, lyne2]);        

    }

}



// ##################################
// Shadows / Outlines
// ##################################

Level.prototype.convertPiecesToShadows = function()
{
    //TODO
    // Go through all shape pieces in level and create single outline if possible
    // Use GreinerHormann?

    var newShadows = []; 
    var shapePieces = this.polygons.concat(this.shapes, this.lynes);

    // Make shadows of 2D pieces on the board
    for (var i = 0; i < shapePieces.length; i++) 
    {
        var shadow = new Shadow(shapePieces[i].getPoints());
        newShadows.push(shadow);
    }

    // Make shadows of Circles
    for (var i = 0; i < this.circles.length; i++) 
    {
        var shadow = new ShadowCircle(this.circles[i].gridPoint, this.circles[i].radius);
        newShadows.push(shadow);
    }

// TODO commented out, ERIK 2016-07
    // // Combine all shadows that overlap
    // var finished = false;
    // while (!finished) 
    // {
    //     var combined = false;
    //     for (var i = 0; i < newShadows.length-1; i++) 
    //     {
    //         for (var j = i+1; j < newShadows.length; j++) 
    //         {
    //             // Greiner-Hormann method of joining polygons
    //             var union = GreinerHormann.union(newShadows[i].gridPoints, newShadows[j].gridPoints);

    //             if(union)
    //             {
    //                 // Create shadows out of union 
    //                 // (for loop just in case multiple returned)
    //                 for (var k = 0; k < union.length; k++) 
    //                 {
    //                     var shadow = new Shadow(union[k]);
    //                     newShadows.push(shadow);
    //                 }
    //                 // remove old shadows
    //                 newShadows = newShadows.filter(function(e){return e!==newShadows[i] && e!==newShadows[j]});
    //                 combined = true;
    //                 break;
    //             }
    //         }
    //         if (combined) {break;}

    //     }
    //     if (!combined) {finished = true;}
    // }

    return newShadows;

}

// ##################################
// Solution
// ##################################


Level.prototype.convertPiecesToPoints = function()
{   
    // Returns the points of all current pieces on the board.

    var newPoints = []; 
    var shapePieces = this.polygons.concat(this.lynes, this.circles);

    // Extract points from 2D pieces on the board
    for (var i = 0; i < shapePieces.length; i++) 
    {
        var points = shapePieces[i].getPoints();
        for (var j = 0; j < points.length; j++) 
        {
            newPoints.push({x: points[j].x, y: points[j].y});
        }
    }

    return newPoints;

}

Level.prototype.printLevelSolved = function()
{
    this.levelSolvedMessage.animate(
        {opacity: 1} , 
        {
          duration:  BOXLYNE_MOVE_TIME,
          onChange: function () {currentLevel.renderCanvasRequired = true},
          onComplete: function () {
            currentLevel.levelSolvedMessage.animate(
                {opacity: 0} , 
                {
                  duration: 3 * BOXLYNE_MOVE_TIME,
                  onChange: function () {currentLevel.renderCanvasRequired = true},
                }
            );
          },
        }
    );
}


/**
 * Check if Level win condition has been met
 *
 * @param  pieces [Array]
 * @return {}
 */
Level.prototype.isSolved = function()
{

    // Check if current board matches a solution set
    var gridPoints = []; 
    var shapePieces = this.polygons.concat(this.lynes, this.circles);

    // Loop through all shapes and compile their points
    for (var i = 0; i < shapePieces.length; i++) {
        var points = shapePieces[i].getPoints();

        for (var j = 0; j < points.length; j++) {
            gridPoints.push(points[j]);
        }
    }

    return this.solutionManager.levelSolved(gridPoints);
}



