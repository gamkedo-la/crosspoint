
var currentCanvas = null;

function switchCanvas(newCanvas) {

    // Hide all canvases
    $('#canvas_menu').parent().hide();
    $('#canvas_levels').parent().hide();
    $('#canvas_game').parent().hide();
    $('#canvas_cutscene').parent().hide();
    $('#canvas_credits').parent().hide();
    

    // Clear fabric elements from game 
    if(newCanvas !== "game" && currentLevel) {
        clearCurrentLevel();
    }

    // Show correct canvas
    if(newCanvas === "game") {
        $('#canvas_game').parent().show();
    } else if (newCanvas === "menu") {
        $('#canvas_menu').parent().show();
    } else if (newCanvas === "level") {
        $('#canvas_levels').parent().show();
    } else if (newCanvas === "cutscene") {
        $('#canvas_cutscene').parent().show();
    } else if (newCanvas === "credits") {
        $('#canvas_credits').parent().show();
    }

    currentCanvas = newCanvas;
    
}

function goToPreviousMenuCanvas() {
    
    // Show correct canvas
    if(currentCanvas === "game") {
        switchCanvas("level");
    } else if (currentCanvas === "level") {
        switchCanvas("menu");
    } else if (currentCanvas === "credits") {
        switchCanvas("menu");
    } 
    
}


