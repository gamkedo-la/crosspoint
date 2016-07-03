



var clearCurrentLevel = function() 
{
    // Delete all pieces
    currentLevel.deletePieces();
    //clear canvas
    canvas.clear();
    // Delete current level object
    // delete currentLevel;
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
        console.log("jpiece", jpiece);
        if(jpiece.height) {
            console.log("if");
            piece = new BoxLyne(jpiece.width, jpiece.height);
            console.log("endif");
        } else {
            console.log("else");
            piece = new BoxLyne(jpiece.width);
            console.log("endelse");
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
    else if (jpiece.type === "boxShape")
    {
        piece = null; //TODO
    }
    else 
    {
        console.log("Piece has invalid type:", jpiece);
        return null;
    }

    console.log("piece", piece);

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
        console.log("loadPiecesFromJSON", i);
        console.log("jsonPieces[i]", jsonPieces[i]);
        pieces.push( makePieceFromJSON(jsonPieces[i]) );
    }
    return pieces;
}

var loadLevelFromJSON = function(jsonObject) 
{
    console.log("jsonObject.levelOptions", jsonObject.levelOptions);
    console.log("jsonObject.pieces", jsonObject.pieces);
    // Instantiate pieces
    var pieces = loadPiecesFromJSON(jsonObject.pieces);

    // Create new level
    canvas.clear();
    delete currentLevel;
    currentLevel = Level.init(jsonObject.levelOptions, pieces);

}

// // Main function
// var loadLevel = function(track, levelNumber) 
// {   
//     if (levelFiles[track - 1][levelNumber - 1]) {
//         loadLevelFromJSON(levelFiles[track - 1][levelNumber - 1])
//     } else {
//         console.log("No record of level ", track, levelNumber );
//         throw "Level Not Found.";
//     }
// }