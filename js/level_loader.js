
// ===================== IMPORTANT =========================================

// ----------------------
//  Official Level Order
// ----------------------

// List of video objects
var video_shape = document.getElementById('video_shape');
linkVideoToCanvas(video_shape);

// Level list
var levelOrderArray = [ // Track 1
                        [ {video: video_shape,          visible: true,  card: card_house}, 
                          {level: level_keyhole,        visible: true,  card: card_house}, 
                          {level: level_house1,         visible: true,  card: card_house}, 
                          {level: level_japan_bridge,   visible: true,  card: card_house}, 
                          {level: level_tangram_easy,   visible: true,  card: card_house}, 
                        ],
                        // Track 2
                        [ {video: video_shape,          visible: true,  card: card_house}, 
                          {level: level_eye,            visible: true,  card: card_house}, 
                          {level: level_heart,          visible: true,  card: card_house}, 
                          {level: level_hourglass,      visible: true,  card: card_house}, 
                          {level: level_propellor,      visible: true,  card: card_house}, 
                          {level: level_cropcircles,    visible: true,  card: card_house}, 
                        ],
                        // Track 3
                        [ {video: video_shape,  visible: true,  card: card_house}, 
                          {level: level_keyhole,      visible: true,  card: card_house}, 
                        ],
                        // Track 4
                        [ {video: video_shape,  visible: true,  card: card_house}, 
                          {level: level_keyhole,      visible: true,  card: card_house}, 
                        ],
                        // Track 5
                        [ {video: video_shape,  visible: true,  card: card_house}, 
                          {level: level_keyhole,      visible: true,  card: card_house}, 
                        ],
                        // Track 6
                        [ {video: video_shape,  visible: true,  card: card_house}, 
                          {level: level_keyhole,      visible: true,  card: card_house}, 
                        ]
                    ];


// Level list
var levelColorArray = [ // Track 1
                        {color: "purple",   main_LT: PURPLE_LT,
                                            main_MD: PURPLE_MD,
                                            main_DK: PURPLE_DK,
                                            second_LT: GREEN_LT,
                                            second_MD: GREEN_MD,
                                            second_DK: GREEN_DK,
                                            line: PURPLE_BRIGHT
                        },
                        // Track 3
                        {color: "red",      main_LT: RED_LT,
                                            main_MD: RED_MD,
                                            main_DK: RED_DK,
                                            second_LT: GRAY_LT,
                                            second_MD: GRAY_MD,
                                            second_DK: GRAY_DK,
                                            line: RED_BRIGHT
                        },
                        // Track 4
                        {color: "skyblue",  main_LT: SKYBLUE_LT,
                                            main_MD: SKYBLUE_MD,
                                            main_DK: SKYBLUE_DK,
                                            second_LT: GRAY_LT,
                                            second_MD: GRAY_MD,
                                            second_DK: GRAY_DK,
                                            line: SKYBLUE_BRIGHT
                        },
                        // Track 5
                        {color: "orange",   main_LT: ORANGE_LT,
                                            main_MD: ORANGE_MD,
                                            main_DK: ORANGE_DK,
                                            second_LT: GRAY_LT,
                                            second_MD: GRAY_MD,
                                            second_DK: GRAY_DK,
                                            line: ORANGE_BRIGHT
                        },
                        // Track 6
                        {color: "green",    main_LT: GREEN_LT,
                                            main_MD: GREEN_MD,
                                            main_DK: GREEN_DK,
                                            second_LT: GRAY_LT,
                                            second_MD: GRAY_MD,
                                            second_DK: GRAY_DK,
                                            line: GREEN_BRIGHT
                        },
                        // Track 2
                        {color: "blue",     main_LT: BLUE_LT,
                                            main_MD: BLUE_MD,
                                            main_DK: BLUE_DK,
                                            second_LT: GRAY_LT,
                                            second_MD: GRAY_MD,
                                            second_DK: GRAY_DK,
                                            line: BLUE_BRIGHT
                        },

                    ];


// initialize color variables with default values
var color_main_LT = PURPLE_LT; // Light
var color_main_MD = PURPLE_MD; // Medium
var color_main_DK = PURPLE_DK; // Dark

var color_second_LT = GREEN_LT; // Light
var color_second_MD = GREEN_MD; // Medium
var color_second_DK = GREEN_DK; // Dark

// ==========================================================================



var clearCurrentLevel = function() 
{
    // Delete all pieces
    currentLevel.deletePieces();
    //clear canvas
    canvas.clear();
    // Delete current level object
    delete currentLevel;
}

var makePieceFromJSON = function(jpiece) 
{
    var piece;

    if (jpiece.type === "solution") 
    {
        piece = new SolutionManager(jpiece.solutions);
    } 
    else if (jpiece.type === "shadow")
    {
        piece = new Shadow(jpiece.points);
    }
    else if (jpiece.type === "shadowCircle")
    {
        piece = new ShadowCircle(jpiece.point, jpiece.radius);
    }
    else if (jpiece.type === "lyne") 
    {
        piece = new Lyne(jpiece.points);
    } 
    else if (jpiece.type === "poly")
    {
        piece = new PolyGroup(jpiece.n, jpiece.points);
    }
    else if (jpiece.type === "shape")
    {
        piece = null; //TODO
    }
    else if (jpiece.type === "ball")
    {        
        piece = new NumberBall(jpiece.n);
    }
    else if (jpiece.type === "boxLyne")
    {  
        if(jpiece.height) {
            piece = new BoxLyne(jpiece.width, jpiece.height);
        } else {
            piece = new BoxLyne(jpiece.width);
        }
    }
    else if (jpiece.type === "boxPoly")
    {
        piece = new BoxPoly(jpiece.points);
    }
    else if (jpiece.type === "boxArea")
    {
        piece = new BoxArea(jpiece.n);
    }
    else if (jpiece.type === "boxCircle")
    {
        piece = new BoxCircle(jpiece.n);
    }
    else if (jpiece.type === "boxShape")
    {
        piece = null; //TODO
    }
    else 
    {
        console.log("Piece has invalid type:", jpiece);
        return null;
    }

    // Add to level editor
    currentEditor.addStartPiece(piece);

    return piece;
}


var loadPiecesFromJSON = function(jsonPieces) 
{
    var pieces = [];
    // Instantiate pieces 
    for (var i = 0; i < jsonPieces.length; i++) 
    {
        pieces.push( makePieceFromJSON(jsonPieces[i]) );
    }
    return pieces;
}

var loadLevelFromJSON = function(jsonObject) 
{
    // Instantiate pieces
    var pieces = loadPiecesFromJSON(jsonObject.pieces);

    // Create new level
    clearCurrentLevel();
    currentLevel = Level.init(jsonObject.levelOptions, pieces);

}



// // Main function
// var loadLevel = function(track, levelNumber) 
// {   
//     if (levelFiles[track - 1][levelNumber - 1]) {
//         loadLevelFromJSON(levelFiles[track - 1][levelNumber - 1])
//     } else {
//         console.log("No record of level ", track, levelNumber );
//     }
// }

//-----------------------------------------------------------------------------//
/*
 *  Name:       LevelLoader
 *  Abstract:   NO
 *  Superclass: n/a
 *  
 *  Description: Level Loader object, keeps track of levels.
 *     
 //-----------------------------------------------------------------------------*/           

function LevelLoader() 
{
    this.levels = null;
    this.colors = null;
    this.lastLevelLoaded = [0, -1];

}

/**
 * CONSTRUCTOR
 */
LevelLoader.init = function()
{

    var instance = new LevelLoader();
    instance.loadAllLevels();

    return instance;
}

LevelLoader.prototype.loadAllLevels = function()
{

    this.levels = levelOrderArray;
    this.colors = levelColorArray;
    
}

LevelLoader.prototype.loadLevel = function(track, levelNumber)
{
    var element = this.levels[track][levelNumber];

    // Check that level exists
    if (!element) { console.log("No level at ", track, levelNumber); return; }
    
    // Update counter
    this.lastLevelLoaded = [track, levelNumber];
    // Make array element visible in title screen
    element.visible = true;

    // Change color scheme
    this.changeColors(track);

    // Load level
    if (element.level){
        switchCanvas("game");
        // Load level from JSON file
        loadLevelFromJSON(element.level);
    } else if (element.video) {
        // Load video
        element.video.play();
    } else {
        // Unrecognized type
        console.log("Unrecognized level type");
        return;
    }
    
}

LevelLoader.prototype.loadNextLevel = function()
{
    // load the next level in track, if end of track return to level menu.
    var track = this.lastLevelLoaded[0];
    var levelNumber = this.lastLevelLoaded[1] + 1;

    if (this.levels[track][levelNumber]) {
        // Load next level
        this.loadLevel(track, levelNumber);
        this.levels[track][levelNumber].visible = true;
        currentCardOrganizer.update();
    } else {
        // Return to menu
        switchCanvas("level");
    }
}

LevelLoader.prototype.reloadCurrentLevel = function()
{
    // reload level
    var track = this.lastLevelLoaded[0];
    var levelNumber = this.lastLevelLoaded[1];

    this.loadLevel(track, levelNumber);
}

LevelLoader.prototype.solvedCurrentLevel = function()
{
    // reload level
    var track = this.lastLevelLoaded[0];
    var levelNumber = this.lastLevelLoaded[1];

    
}

LevelLoader.prototype.changeColors = function(track) 
{
    // Change color scheme for track
    color_main_LT = this.colors[track].main_LT; // Light
    color_main_MD = this.colors[track].main_MD; // Medium
    color_main_DK = this.colors[track].main_DK; // Dark
    color_second_LT = this.colors[track].second_LT; // Light
    color_second_MD = this.colors[track].second_MD; // Medium
    color_second_DK = this.colors[track].second_DK; // Dark

    console.log("changed colors complete");

}

LevelLoader.prototype.clearAll = function() 
{
    clearCurrentLevel();
}

//-----------------------------------------------------------------------------//
// Iinitialize level loader
var currentLevelLoader = LevelLoader.init();
//-----------------------------------------------------------------------------//
