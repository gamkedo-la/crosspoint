
// TEMPORARY - Color scheme, should change by level track
var color_main_LT = PURPLE_LT; // Light
var color_main_MD = PURPLE_MD; // Medium
var color_main_DK = PURPLE_DK; // Dark

var color_second_LT = GREEN_LT; // Light
var color_second_MD = GREEN_MD; // Medium
var color_second_DK = GREEN_DK; // Dark
// END TEMPORARY


var currentLevel;
var levels;
var series;

window.onload = function() {

    // Switch to game canvas for start
    switchCanvas("game");

    
    loadGame();
    

    var framesPerSecond = 10;
    setInterval(function() {
        currentLevel.tick();  
    }, 1000/framesPerSecond);
}


function loadGame() {

    loadSFX();
    loadImages();

    var sol1 = new SolutionManager([])

    var pieces = [sol1];
    currentLevel = Level.init({crossButton: "none", lineAddition: "off"}, pieces);

    console.log("levelOrderArray", levelOrderArray);
    currentLevelLoader.loadLevel(0,0);
}

    


