
var currentLevel;
var levels;
var series;

var renderCardCol = 0; // only relevant if rendLevelCardsMode is true, for draw position
var renderCardRow = 0;
var renderCardDimJump = 40;

// Erik Temp
var clearAllBool = false;

window.onload = function() {
    loadImages();
}

function imagesLoadedSoStartGame() {
    currentEditor = LevelEditor.init();

    loadSFX();

    // Switch to game canvas for start
    switchCanvas("menu");

    loadMenu();
    loadCredits();
    loadGame();
    loadMenuLevels();
    prepSongs();

    if(rendLevelCardsMode==false) {
        canvas.backgroundColor = 'white';
        var framesPerSecond = 10;
        setInterval(function() {
            currentLevel.tick();  
            songTick();
        }, 1000/framesPerSecond);
    } else {
        var cardCanvas = document.createElement("canvas");
        cardCanvas.id = 'canvas_levcards';
        var canvasParent = document.getElementById("canvas_wrapper");
        canvasParent.parentNode.appendChild(cardCanvas);

        var cardArtsNeeded = 0;
        for (var i = 0; i < currentCardOrganizer.cards.length; i++) {
            var thisTrack = currentCardOrganizer.cards[i];
            for (var ii = 0; ii < thisTrack.length; ii++) {
                var trackLocal = i;
                var levNumLocal = ii;
                
                if(currentLevelLoader.levels[trackLocal][levNumLocal].video == undefined) { // skip videos
                    cardArtsNeeded++;
                }
            }
        }

        cardCanvas.width = cardArtsNeeded*renderCardDimJump;
        cardCanvas.height = renderCardDimJump;

        var cardCtx = cardCanvas.getContext("2d");

        console.log("preparing card renders for this many levels: " + (currentCardOrganizer.cards.length));
        renderCardCol = renderCardRow = 0;
        for (var i = 0; i < currentCardOrganizer.cards.length; i++) {
            var thisTrack = currentCardOrganizer.cards[i];
            for (var ii = 0; ii < thisTrack.length; ii++) {
                var trackLocal = i;
                var levNumLocal = ii;
                
                if(currentLevelLoader.levels[trackLocal][levNumLocal].video == undefined) { // skip videos
                    
                    console.log(i,currentLevelLoader.levels[trackLocal][levNumLocal].level.name, trackLocal, levNumLocal);
                    var gamectx = canvas.getContext("2d");
                    gamectx.restore();
                    gamectx.save();
                    gamectx.scale(0.06,0.06);

                    currentLevelLoader.loadLevel(trackLocal,levNumLocal);
                    //currentLevel.updateBoard();

                    var cx = renderCardCol * renderCardDimJump;
                    var cy = renderCardRow * renderCardDimJump;
                    //cardCtx.rect(cx,cy,renderCardDimJump,renderCardDimJump);
                    //cardCtx.stroke();
                    cardCtx.drawImage(gamectx.canvas,cx-4, cy);
                    renderCardCol++;
                }
            }
        }
        canvasParent.style.display = "none";
    }
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

    


