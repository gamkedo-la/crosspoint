
//-----------------------------------------------------------------------------//
/*
 *  Name:       LevelEditor
 *  Abstract:   NO
 *  Superclass: n/a
 *  
 *  Description: Level Editor object, keeps track of level pieces used.
 *     
 //-----------------------------------------------------------------------------*/           

function LevelEditor() 
{
    this.startingPieces = [];
}

/**
 * CONSTRUCTOR
 */
LevelEditor.init = function()
{

    var instance = new LevelEditor();

    return instance;
}

LevelEditor.prototype.addStartPiece = function(_piece)
{
    this.startingPieces.push(_piece);
    currentLevel.addPiece(_piece);

    console.log("this.startingPieces", this.startingPieces);

}

LevelEditor.prototype.removePieceFromStart = function(_piece)
{
    this.startingPieces = this.startingPieces.filter(function(e){return e!==_piece});;
}

LevelEditor.prototype.deletePiece = function(_piece)
{
    // Remove piece from level
    currentLevel.removePiece(_piece);
    // Remove piece from level editor start pieces
    this.removePieceFromStart(_piece);
    // For all parent pieces call deletePiece.
    for (var i = 0; i < _piece.parentPieces.length; i++) {
        this.deletePiece(_piece.parentPieces[i]);
    }
}

LevelEditor.prototype.createShadows = function() 
{
    // Create shadow out of current pieces on the board
    currentLevel.deleteShadows();
    return currentLevel.convertPiecesToShadows();
}

LevelEditor.prototype.createSolution = function() 
{
    // Create solution out of current pieces on the board
    currentLevel.deleteSolution();
    // TEMP
    var solpoints = [{x:-2, y:-2}, {x:0, y:2}, {x:2, y:2}, {x:0, y:-2}];
    return new SolutionManager([solpoints]);
}

LevelEditor.prototype.convertPieceToObject = function(_piece) 
{
    if (_piece.convertToObject) {
        return _piece.convertToObject();
    } else {
        console.log("Piece has invalid type:", _piece);
        return {};
    }
}

// Save pieces in JSON data
LevelEditor.prototype.saveLevelToTextField = function() 
{
    var _options = {};
    var _pieces = [];

    // OPTIONS

    _options.crossButton = document.getElementById("crossButtonDropdown").value;
    _options.lineAddition = document.getElementById("lineAddDropdown").value;

    // PIECES

    // Add recorded Level Pieces to list 
    for (var i = 0; i < this.startingPieces.length; i++) {
        _pieces.push( this.convertPieceToObject(this.startingPieces[i]) );
    }

    // Create shadows
    var shadows = this.createShadows();
    for (var i = 0; i < shadows.length; i++) {
        _pieces.push( this.convertPieceToObject(shadows[i]) );
    }
    // Create solution
    _pieces.push( this.convertPieceToObject(this.createSolution()) );
    

    // Create level object for JSON file
    var level_obj = {name: levelName.value, designer: levelCreator.value, levelOptions: _options, pieces: _pieces};
    levelTextfield.value = JSON.stringify(level_obj);
}

LevelEditor.prototype.loadLevel = function() 
{
    this.clearAll();
    canvas.clear();

    var levelObject = JSON.parse(levelTextfield.value);

    loadLevelFromJSON(levelObject);
}


LevelEditor.prototype.clearAll = function() 
{
    this.startingPieces = [];
    currentLevel.deletePieces();
}

//-----------------------------------------------------------------------------//
// Iinitialize level editor
var currentEditor = LevelEditor.init();
//-----------------------------------------------------------------------------//

