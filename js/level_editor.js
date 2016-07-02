
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

LevelEditor.prototype.createShadow = function() 
{
    // Create shadow out of current pieces on the board

    // TEMP
    var gridPoints = [{x:-2, y:-2}, {x:0, y:2}, {x:2, y:2}, {x:0, y:-2}];
    return new Shadow(gridPoints);
}

LevelEditor.prototype.createSolution = function() 
{
    // Create solution out of current pieces on the board

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


    // PIECES

    // Add recorded Level Pieces to list 
    for (var i = 0; i < this.startingPieces.length; i++) {
        _pieces.push( this.convertPieceToObject(this.startingPieces[i]) );
    }

    // Create shadow and solution
    _pieces.push( this.convertPieceToObject(this.createShadow()) );
    _pieces.push( this.convertPieceToObject(this.createSolution()) );
    

    // Create level object for JSON file
    var level_obj = {options: _options, pieces: _pieces}
    document.getElementById("levelTextfield").value = JSON.stringify(level_obj);
}


LevelEditor.prototype.clearAll = function() 
{
    // Delete all pieces from level
}

//-----------------------------------------------------------------------------//
// Iinitialize level editor
var currentEditor = LevelEditor.init();
//-----------------------------------------------------------------------------//

