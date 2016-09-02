
var currentLevel;
var levels;
var series;

var renderCardCol = 0; // only relevant if rendLevelCardsMode is true, for draw position
var renderCardRow = 0;
var renderCardDimJump = 40;

window.onload = function() {
    loadImages();
}

function keyPressed(e) {

    if (!clearAllBool) {return;}

    console.log('keydown:' + e.keyCode);
    if(e.keyCode === 192){
        // clear
        currentEditor.clearAll();
    } else if(e.keyCode === 49){
        // 1
        var lineBox = new BoxLyne(1,0);
        currentLevel.addPiece(lineBox);
    } else if (e.keyCode === 50) {
        // 2
        var lineBox = new BoxLyne(2,0);
        currentLevel.addPiece(lineBox);
    } else if (e.keyCode === 51) {
        // 3
        var lineBox = new BoxLyne(3,0);
        currentLevel.addPiece(lineBox);
    } else if (e.keyCode === 52) {
        // 4
        var lineBox = new BoxLyne(4,0);
        currentLevel.addPiece(lineBox);
    } else if (e.keyCode === 53) {
        // 5
        var lineBox = new BoxLyne(5,0);
        currentLevel.addPiece(lineBox);
    } else if (e.keyCode === 81) {
        // q
        var lineBox = new BoxLyne(1,1);
        currentLevel.addPiece(lineBox);
    } else if (e.keyCode === 87) {
        // w
        var lineBox = new BoxLyne(2,2);
        currentLevel.addPiece(lineBox);
    } else if (e.keyCode === 69) {
        // e
        var lineBox = new BoxLyne(3,4);
        currentLevel.addPiece(lineBox);
    } else if (e.keyCode === 82) {
        // r
        var lineBox = new BoxLyne(1,2);
        currentLevel.addPiece(lineBox);
    } else if (e.keyCode === 84) {
        // t
        var lineBox = new BoxLyne(3,1);
        currentLevel.addPiece(lineBox);
    } else if (e.keyCode === 76) {
        // l (lowercase L)
        editorBtn.hidden = !editorBtn.hidden;
    }
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
                    cardCtx.drawImage(gamectx.canvas,cx-5, cy);
                    renderCardCol++;
                }
            }
        }
        canvasParent.style.display = "none";
    }

    document.addEventListener("keydown", keyPressed);
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




    


