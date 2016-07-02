
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

window.onload = function() {
    var framesPerSecond = 30;
    loadImages();
    loadGame();
    
    
    setInterval(function() {
            currentLevel.tick();  
        }, 1000/framesPerSecond);
}


function loadGame() {
    currentLevel = Level.init({}, []);

    var box1a = new BoxLyne(1);
    var box1b = new BoxLyne(2);
    var box1c = new BoxLyne(3);
    var box1d = new BoxLyne(5);
    var box1e = new BoxLyne(1,5);

    var box2a = new BoxArea(1);
    var box2b = new BoxArea(3);
    var box2c = new BoxArea(4);
    var box2d = new BoxArea(9);
    var box2e = new BoxArea(12);

    var box3a = new BoxArea([{x:-4, y:-4}, {x:-4, y:2}, {x:2, y:-4}]);
    var poly3a = new PolyGroup([{x:-4, y:-4}, {x:-4, y:2}, {x:2, y:-4}]);

    var ball1a = new NumberBall(1);
    var ball1b = new NumberBall(2);
    var ball1c = new NumberBall(3);
    var ball1d = new NumberBall(-1);
    var ball1e = new NumberBall(0);

    var solpoints = [{x:-2, y:-2}, {x:0, y:2}, {x:2, y:2}, {x:0, y:-2}]
    var shad1 = new Shadow(solpoints);
    var sol1 = new SolutionManager([solpoints])

    var pieces = [shad1,sol1 ]; //box1a,box1b,box1c,box1d, ball1b,ball1c, box2b,box2c ];
    currentLevel.addPieces(pieces);
}

    



