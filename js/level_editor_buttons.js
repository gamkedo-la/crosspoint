

// ----------------------------------
// Level Editor Controls
// ----------------------------------

// Level Editor Toggle
var editorBtn = document.getElementById("editorButton");
// Hidden Divisions
var optionsDiv = document.getElementById("editorOptionsDiv");
var addPieceDiv = document.getElementById("addPieceDiv");
var levelTextField = document.getElementById("levelTextfield");
// Option Buttons
var saveBtn = document.getElementById("saveButton");
var undoBtn = document.getElementById("undoButton");
var deleteBtn = document.getElementById("deleteButton");
var clearBtn = document.getElementById("clearAllButton");


// Toggle
editorBtn.onclick = function(){
    optionsDiv.hidden = !optionsDiv.hidden;
    addPieceDiv.hidden = !addPieceDiv.hidden;
    levelTextField.hidden = !levelTextField.hidden;
    
}

// Save Pieces
saveBtn.onclick = function(){
    console.log("saveBtn Click");
    currentEditor.saveLevelToTextField();
}

// Undo
undoBtn.onclick = function(){
    console.log("undoBtn Click");
}

// Delete Last Selected Piece
deleteBtn.onclick = function(){
    console.log("deleteBtn Click");
    currentEditor.deletePiece(currentLevel.selectedPiece);
    currentLevel.selectedPiece = null;
}

// Clear All
clearBtn.onclick = function(){
    console.log("clearBtn Click");
    currentEditor.clearAll();
}


// ----------------------------------
// Piece Controls
// ----------------------------------

// Pieces
var lyneField = document.getElementById("lyneTextfield");
var lyneBtn = document.getElementById("lyneButton");
var areaField = document.getElementById("areaTextfield");
var areaBtn = document.getElementById("areaButton");
var numberField = document.getElementById("numberTextfield");
var numberBtn = document.getElementById("numberButton");

// Add Lyne Box
lyneBtn.onclick = function(){
    var boxLyne = new BoxLyne(lyneField.value);
    currentEditor.addStartPiece(boxLyne);
}
// Add Area Box
areaBtn.onclick = function(){
    var boxArea = new BoxArea(areaField.value);
    currentEditor.addStartPiece(boxArea);
}
// Add Number Box
numberBtn.onclick = function(){
    var numberBall = new NumberBall(numberField.value);
    currentEditor.addStartPiece(numberBall);
}





