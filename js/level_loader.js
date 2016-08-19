
// ===================== IMPORTANT =========================================

// ----------------------
//  Official Level Order
// ----------------------

// List of video objects
var video_shape = document.getElementById('video_shape');
linkVideoToCanvas(video_shape);

// Level list
var levelOrderArray = [ [video_shape, keyhole, video_shape, japan_bridge, tangram_easy] ];

// ==========================================================================



var clearCurrentLevel = function() 
{
    // Delete all pieces
    currentLevel.deletePieces();
    //clear canvas
    canvas.clear();
    // Delete current level object
    delete currentLevel;
}

var makePieceFromJSON = function(jpiece) 
{
    var piece;

    if (jpiece.type === "solution") 
    {
        piece = new SolutionManager(jpiece.solutions);
    } 
    else if (jpiece.type === "shadow")
    {
        piece = new Shadow(jpiece.points);
    }
    else if (jpiece.type === "shadowCircle")
    {
        piece = new ShadowCircle(jpiece.point, jpiece.radius);
    }
    else if (jpiece.type === "lyne") 
    {
        piece = new Lyne(jpiece.points);
    } 
    else if (jpiece.type === "poly")
    {
        piece = new PolyGroup(jpiece.n, jpiece.points);
    }
    else if (jpiece.type === "shape")
    {
        piece = null; //TODO
    }
    else if (jpiece.type === "ball")
    {        
        piece = new NumberBall(jpiece.n);
    }
    else if (jpiece.type === "boxLyne")
    {  
        if(jpiece.height) {
            piece = new BoxLyne(jpiece.width, jpiece.height);
        } else {
            piece = new BoxLyne(jpiece.width);
        }
    }
    else if (jpiece.type === "boxPoly")
    {
        piece = new BoxPoly(jpiece.points);
    }
    else if (jpiece.type === "boxArea")
    {
        piece = new BoxArea(jpiece.n);
    }
    else if (jpiece.type === "boxCircle")
    {
        piece = new BoxCircle(jpiece.n);
    }
    else if (jpiece.type === "boxShape")
    {
        piece = null; //TODO
    }
    else 
    {
        console.log("Piece has invalid type:", jpiece);
        return null;
    }

    // Add to level editor
    currentEditor.addStartPiece(piece);

    return piece;
}


var loadPiecesFromJSON = function(jsonPieces) 
{
    var pieces = [];
    // Instantiate pieces 
    for (var i = 0; i < jsonPieces.length; i++) 
    {
        pieces.push( makePieceFromJSON(jsonPieces[i]) );
    }
    return pieces;
}

var loadLevelFromJSON = function(jsonObject) 
{
    // Instantiate pieces
    var pieces = loadPiecesFromJSON(jsonObject.pieces);

    // Create new level
    clearCurrentLevel();
    currentLevel = Level.init(jsonObject.levelOptions, pieces);

}



// // Main function
// var loadLevel = function(track, levelNumber) 
// {   
//     if (levelFiles[track - 1][levelNumber - 1]) {
//         loadLevelFromJSON(levelFiles[track - 1][levelNumber - 1])
//     } else {
//         console.log("No record of level ", track, levelNumber );
//     }
// }

//-----------------------------------------------------------------------------//
/*
 *  Name:       LevelLoader
 *  Abstract:   NO
 *  Superclass: n/a
 *  
 *  Description: Level Loader object, keeps track of levels.
 *     
 //-----------------------------------------------------------------------------*/           

function LevelLoader() 
{
    this.levels = [];
    this.lastLevelLoaded = [0, -1];
}

/**
 * CONSTRUCTOR
 */
LevelLoader.init = function()
{

    var instance = new LevelLoader();
    instance.loadAllLevels();

    return instance;
}

LevelLoader.prototype.loadAllLevels = function()
{

    this.levelsJSON = levelOrderArray;
    
}

LevelLoader.prototype.loadLevel = function(track, levelNumber)
{
    // Check that level exists
    if (!this.levelsJSON[track][levelNumber]) { console.log("No level at ", track, levelNumber); return; }

    // Load level
    if (this.levelsJSON[track][levelNumber].pieces){
        // Load level from JSON file
        loadLevelFromJSON(this.levelsJSON[track][levelNumber]);
    } else if (this.levelsJSON[track][levelNumber].play) {
        // Load video
        var video = this.levelsJSON[track][levelNumber].play();
    } else {
        // Unrecognized type
        console.log("Unrecognized level type");
        return;
    }
    
    // Update counter
    this.lastLevelLoaded = [track, levelNumber];
    
}

LevelLoader.prototype.loadNextLevel = function()
{
    // load the next level in track, if end of track return to level menu.
    var track = this.lastLevelLoaded[0];
    var levelNumber = this.lastLevelLoaded[1] + 1;

    if (this.levelsJSON[track][levelNumber]) {
        // Load next level
        this.loadLevel(track, levelNumber);
    } else {
        // Return to menu
        console.log("return to menu")
    }
}

LevelLoader.prototype.reloadCurrentLevel = function()
{
    // reload level
    var track = this.lastLevelLoaded[0];
    var levelNumber = this.lastLevelLoaded[1];

    this.loadLevel(track, levelNumber);
}


LevelLoader.prototype.clearAll = function() 
{
    clearCurrentLevel();
}

//-----------------------------------------------------------------------------//
// Iinitialize level loader
var currentLevelLoader = LevelLoader.init();
//-----------------------------------------------------------------------------//
