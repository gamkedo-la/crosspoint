



// Level Editor Toggle
var editorBtn = document.getElementById("editorButton");
// Hidden Division
var editorDiv = document.getElementById("editor");


// ----------------------------------
// Main Control Bar
// ----------------------------------

// Option buttons and text fields
var deleteBtn = document.getElementById("deleteButton");
var clearBtn = document.getElementById("clearAllButton");
var levelName = document.getElementById("levelNameField");
var levelCreator = document.getElementById("levelCreatorField");
var saveBtn = document.getElementById("saveButton");
var loadBtn = document.getElementById("loadButton");
var levelTextfield = document.getElementById("levelTextfield");




// Toggle
editorBtn.onclick = function(){

    // if(editorDiv.hidden) {
    //     // Delete all pieces in level

    //     // Create new level editor

    // } else {
    //     // Delete current level editor
    // }

    editorDiv.hidden = !editorDiv.hidden;
    
}

// Delete Last Selected Piece
deleteBtn.onclick = function(){
    currentEditor.deletePiece(currentLevel.selectedPiece);
    currentLevel.selectedPiece = null;
}

// Clear All
clearBtn.onclick = function(){
    currentEditor.clearAll();
}


// Save Level
saveBtn.onclick = function(){
    currentEditor.saveLevelToTextField();
}

// Load Level
loadBtn.onclick = function(){
    currentEditor.clearAll();
    currentEditor.loadLevel();
}


// Dropdown level options
var crossDropdown = document.getElementById("crossButtonDropdown");
crossDropdown.onchange = function(){
    currentLevel.levelOptions.crossButton = crossDropdown.value;
    if (crossDropdown.value === "none") {
        canvas.remove(currentLevel.crossButton);
    } else {
        canvas.add(currentLevel.crossButton);
    }
}
var lineAddDropdown = document.getElementById("lineAddDropdown");
lineAddDropdown.onchange = function(){
    currentLevel.levelOptions.lineAddition = lineAddDropdown.value;
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
var circleField = document.getElementById("circleTextfield");
var circleBtn = document.getElementById("circleButton");
var polyField = document.getElementById("polyTextfield");
var polyBtn = document.getElementById("polyButton");


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
// Add NumberBall
numberBtn.onclick = function(){
    var numberBall = new NumberBall(numberField.value);
    currentEditor.addStartPiece(numberBall);
}
// Add Circle Box
circleBtn.onclick = function(){
    var circle = new BoxCircle(circleField.value);
    currentEditor.addStartPiece(circle);
}

// Add Polygon Box
polyBtn.onclick = function(){

    // Convert field into points
    var jsonString = '[' + polyField.value + ']';
    var pointArray = JSON.parse(jsonString);
    var gridPoints = [];

    for (var i = 0; i < pointArray.length; i++) {
        gridPoints.push({x: pointArray[i][0], y: pointArray[i][1]});
    }

    var boxPoly = new BoxPoly(gridPoints);
    currentEditor.addStartPiece(boxPoly);
}






