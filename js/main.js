
// TEMPORARY
var hex_light = PURPLE_LT;
var hex_med = PURPLE_MD;
var hex_dark = PURPLE_DK;
// END TEMPORARY


// // create line grid (TEMPORARY)
// for (var i = -GRID_SIZE/2; i <= (GRID_SIZE/2); i++) {
//     var gridPoints = [{x: i, y: i}];
//     var coords = gridPointsToCoords(gridPoints);

//     if (i === 0) {var color = '#000';} else {var color = '#ccc';} 

//     canvas.add(new fabric.Line([ coords.x, gridTop, coords.x, gridBot], { stroke: color, selectable: false }));
//     canvas.add(new fabric.Line([ gridLeft, coords.y, gridRight, coords.y], { stroke: color, selectable: false }));
// }

var currentLevel;
var levels;
var series;

window.onload = function() {
    loadImages();
    loadGame();

    var framesPerSecond = 10;
    setInterval(function() {
        currentLevel.tick();  
    }, 1000/framesPerSecond);
}


function loadGame() {

    // var box1a = new BoxLyne(1);
    // var box1b = new BoxLyne(2);
    // var box1c = new BoxLyne(3);
    // var box1d = new BoxLyne(5);
    // var box1e = new BoxLyne(1,5);

    // var box2a = new BoxArea(1);
    // var box2b = new BoxArea(3);
    // var box2c = new BoxArea(4);
    // var box2d = new BoxArea(9);
    // var box2e = new BoxArea(12);

    // var box3a = new BoxPoly([{x:-4, y:-4}, {x:-4, y:2}, {x:2, y:-4}]);
    // var poly3a = new PolyGroup([{x:-4, y:-4}, {x:-4, y:2}, {x:2, y:-4}]);

    // var ball1a = new NumberBall(1);
    // var ball1b = new NumberBall(2);
    // var ball1c = new NumberBall(3);
    // var ball1d = new NumberBall(-1);
    // var ball1e = new NumberBall(0);

    var sol1 = new SolutionManager([])

    var pieces = [sol1];
    currentLevel = Level.init({crossButton: "none", lineAddition: "off"}, pieces);

    // loadLevel(1,1);
}

    


