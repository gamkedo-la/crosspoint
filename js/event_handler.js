


// Set default Object settings
fabric.Object.prototype.hasBorders = false;
fabric.Object.prototype.hasControls = false;
fabric.Object.prototype.centeredRotation = false;
fabric.Object.prototype.perPixelTargetFind = true;

/*     LIST OF FABRIC.JS EVENTS
https://github.com/kangax/fabric.js/wiki/Working-with-events

after:render — fired continuously after each frame is rendered
before:render — fired before each frame is rendered
canvas:cleared — fired after a call to canvas.clear()

mouse:down — fired when mousedown event occurred on canvas
mouse:up — fired when mouseup event occurred on canvas
mouse:move — fired when the mouse is moving over the canvas

object:added — fired after object has been added
object:modified — fired after object is modified (moved, scaled, rotated)
object:moving — fired continuously during object movement
object:over — fired when mouse is over object (see example below)
object:out — fired when mouse is moved away from object (see example below)
object:removed — fired when object has been removed
object:rotating — fired continuously during object rotating
object:scaling — fired continuously during object scaling
object:selected — fired when object is selected
*/

canvas.on({
    'mouse:move': onMouseMove,
    'mouse:down': onMouseDown,
    'mouse:up': onMouseUp,
    'mouse:over': onMouseOver,
    'mouse:out': onMouseOut,
    'object:selected': onObjectSelected,
    'object:moving': onObjectMoving,
    'object:modified': onObjectModified,
    'before:selection:cleared': beforeSelectionCleared,
    // 'selection:cleared': onSelectionCleared,
});

function onMouseMove(ev) {
    if (currentLevel.mode === 'dropping' || 
        currentLevel.mode === 'dropball' || 
        currentLevel.mode === 'following') {
        // update dropping object
        if(currentLevel.droppingObject) {currentLevel.droppingObject.update(ev.e);}
    }
    
}

function onMouseDown(ev) {

}

function onMouseUp(ev) {
    // Drop object on Grid
    if (currentLevel.mode === 'dropping') {

        // Check for dropping objects, cancel if not activated
        if (currentLevel.droppingObject) {
            if (currentLevel.droppingObject.lyne || currentLevel.droppingObject.rectangle) {
                // Add new piece to level, remove box
                currentLevel.droppingObject.addToLevel();
                if (currentLevel.droppingBox) {currentLevel.removePiece(currentLevel.droppingBox);}
            } else {
                // Do not remove box
                currentLevel.droppingObject.removeFromLevel();
                if (currentLevel.droppingBox) {currentLevel.droppingBox.deselect();}
            }
            canvas.remove(currentLevel.droppingObject);
        } else {
            // No dropping object, just remove the box
            if (currentLevel.droppingBox) {currentLevel.removePiece(currentLevel.droppingBox);}
        }
        
        // Reset values
        currentLevel.resetState();
        // Update board
        currentLevel.updateBoard();
    }

    if (currentLevel.mode === 'dropball') {
        currentLevel.droppingObject.deselect();

        // Reset values
        currentLevel.resetState();
        // Update board
        currentLevel.updateBoard();
    }

    if (currentLevel.mode === 'following') {
        var mouseX = ev.e.offsetX;
        var mouseY = ev.e.offsetY;
        var gridPoint = coordsToGridPoints({x: mouseX, y: mouseY});  
        if (pointInGrid(gridPoint)) {
            currentLevel.droppingObject.addToLevel(ev.e);
            if (currentLevel.droppingBox) {currentLevel.removePiece(currentLevel.droppingBox);}
        } else {
            currentLevel.droppingObject.removeFromLevel();
            if (currentLevel.droppingBox) {currentLevel.droppingBox.deselect();}

            // Audio
            playSFX("undoMove");
        }

        // Reset values
        currentLevel.resetState();
        // Update board
        currentLevel.updateBoard();
    }

    // Check for win condition
    if(currentLevel.isSolved()) {
        console.log("YOU WIN!!!"); 
        
        currentLevel.printLevelSolved();

    }
    
}

function onMouseOver(ev) {
    if (currentLevel.mode) {return;}
    if (ev.target && ev.target.mouseOver) {
        ev.target.mouseOver();
        currentLevel.updateBoard();
    }
    
}
function onMouseOut(ev) {
    if (currentLevel.mode) {return;}
    if (ev.target && ev.target.mouseOut){
        ev.target.mouseOut();
        currentLevel.updateBoard();
    }
}

function onObjectSelected(ev) {


    // LEVEL EDITOR - Keep track of pieces that are selected
    if(ev.target.pieceID) {
        currentLevel.selectedPiece = ev.target;
        console.log("pieceID",ev.target.pieceID)

        // Audio
        if(ev.target.type === "boxPoly" ||
           ev.target.type === "boxCircle" ||
           ev.target.type === "boxArea") {

            playSFX("addToGrid");

        } else if(ev.target.type === "boxLyne") {

            playSFX("addLine");

        } else {
            playSFX("grab");
        }
        
    }
    // LEVEL EDITOR END


    if (currentLevel.selectedObject && currentLevel.mode !== 'dropping') {
        if (currentLevel.selectedObject.deselect) {
            currentLevel.selectedObject.deselect();
        }
        currentLevel.selectedObject = null;
    }

    if (ev.target && ev.target.onSelected){
        currentLevel.selectedObject = ev.target;
        ev.target.onSelected(ev.e);
    }

}

function onObjectMoving(ev) {
    if (ev.target && ev.target.update){
        ev.target.update(ev.e);
    }
}

function onObjectModified(ev) {
    if (ev.target && ev.target.onModified){
        ev.target.onModified();
    }
    // currentLevel.checkWinCondition();
}

function beforeSelectionCleared(ev) {
    // Check to see if a box was deselected
    if (ev.target && ev.e) {
        var clearedObject = ev.target;
        if (clearedObject.type) {
            if (clearedObject.type === 'boxLyne' ||
                clearedObject.type === 'boxArea' ||
                clearedObject.type === 'boxPoly' ||
                clearedObject.type === 'boxCircle' ||
                clearedObject.type === 'boxShape')
            {
                currentLevel.deselectBox(clearedObject, ev.e);
            }
        }
    }
}



