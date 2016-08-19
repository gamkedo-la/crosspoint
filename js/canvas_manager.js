


function switchCanvas(newCanvas) {

    // Hide all canvases
    $('#canvas_game').parent().hide();
    $('#canvas_cutscene').parent().hide();

    // Clear fabric elements from game 
    if(newCanvas !== "game") {
        clearCurrentLevel();
    }

    // Show correct canvas
    if(newCanvas === "game") {
        $('#canvas_game').parent().show();
    } else if (newCanvas === "cutscene") {
        $('#canvas_cutscene').parent().show();
    }
    
}



