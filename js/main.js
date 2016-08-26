
var currentLevel;
var levels;
var series;

window.onload = function() {

    // Switch to game canvas for start
    switchCanvas("menu");

    loadImages();
    loadSFX();

    loadMenu();
    loadCredits();
    loadGame();
    loadMenuLevels();

    var framesPerSecond = 10;
    setInterval(function() {
        currentLevel.tick();  
    }, 1000/framesPerSecond);
}


function loadMenu() {
    menuLoadElements();
}

function loadCredits() {
    creditsLoadElements();
}

function loadMenuLevels() {
    levelsLoadElements();

    currentCardOrganizer.makeCards();
    currentCardOrganizer.update();
}


function loadGame() {

    var sol1 = new SolutionManager([])

    var pieces = [sol1];
    currentLevel = Level.init({crossButton: "none", lineAddition: "off"}, pieces);

    console.log("levelOrderArray", levelOrderArray);
    // currentLevelLoader.loadLevel(0,0);
}

    


