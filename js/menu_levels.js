
// Level selection screen

// Instantiate menu canvases as Fabric canvases
var canvas_levels = new fabric.Canvas('canvas_levels');
canvas_levels.hoverCursor = 'pointer';
canvas_levels.backgroundColor = 'white';


var back_MENU_LEVELS;
var youtube_MENU_LEVELS;
var math_MENU_LEVELS;
var khan_MENU_LEVELS;
var phet_MENU_LEVELS;
var rotation_MENU_LEVELS;
var units_MENU_LEVELS;
function levelsLoadElements() {

    var startX = canvasWidth - BUTTON_LONG_PADDINGX - BUTTON_LONG_WIDTH/2;
    var startY = BUTTON_LONG_PADDINGY + BUTTON_LONG_HEIGHT/2;

    var leftX = (startX - BUTTON_LONG_WIDTH/4 - BUTTON_LONG_BUFFERY/2)
    var rightX = (startX + BUTTON_LONG_WIDTH/4 + BUTTON_LONG_BUFFERY/2)

    // Buttons
    var newY = startY;
    back_MENU_LEVELS = new MenuLongButtonXP({x: startX, y: newY}, logo_xp);
    canvas_levels.add(back_MENU_LEVELS);

    // YOUTUBE

    // Learn the Math!
    newY = newY + BUTTON_LONG_HEIGHT + BUTTON_LONG_BUFFERY;
    math_MENU_LEVELS = new MenuLongButtonWebsite({x: startX, y: newY}, logo_LearnTheMath, "https://www.youtube.com/playlist?list=PLlVv0Yh5rPcHwUuqI0Hv_04M53TKHrITA");
    canvas_levels.add(math_MENU_LEVELS);

    newY = newY + BUTTON_LONG_HEIGHT + BUTTON_LONG_BUFFERY;
    // Rotation (Left)
    rotation_MENU_LEVELS= new MenuButtonWebsiteSmall({x: leftX, y: newY}, logo_lineRotation, "https://www.youtube.com/watch?v=TeSpBI9VDHo&index=1&list=PLlVv0Yh5rPcHwUuqI0Hv_04M53TKHrITA");
    canvas_levels.add(rotation_MENU_LEVELS);
    // Units (Right)
    units_MENU_LEVELS = new MenuButtonWebsiteSmall({x: rightX, y: newY}, logo_units, "https://www.youtube.com/watch?v=BtnktIs9nWM&index=2&list=PLlVv0Yh5rPcHwUuqI0Hv_04M53TKHrITA");
    canvas_levels.add(units_MENU_LEVELS);
    
    // Cross Product
    newY = newY + BUTTON_LONG_HEIGHT + BUTTON_LONG_BUFFERY;
    youtube_MENU_LEVELS = new MenuLongButtonWebsite({x: startX, y: newY}, logo_xyz, "https://www.youtube.com/watch?v=ENXqdlFZ10w&index=3&list=PLlVv0Yh5rPcHwUuqI0Hv_04M53TKHrITA");
    canvas_levels.add(youtube_MENU_LEVELS);

    

    


    // OUTSIDE RESOURCES
    // newY = newY + BUTTON_LONG_HEIGHT + BUTTON_LONG_BUFFERY;
    // // Phet (left)
    // phet_MENU_LEVELS= new MenuButtonWebsiteSmall({x: leftX, y: newY}, logo_PhET, "https://phet.colorado.edu/en/simulation/vector-addition");
    // canvas_levels.add(phet_MENU_LEVELS);
    // // Khan (right)
    // khan_MENU_LEVELS = new MenuButtonWebsiteSmall({x: rightX, y: newY}, logo_KA, "https://www.khanacademy.org/math/precalculus/vectors-precalc");
    // canvas_levels.add(khan_MENU_LEVELS);
    
} 


canvas_levels.on({
    'mouse:down': levelMouseDown,
    'mouse:over': levelMouseOver,
    'mouse:out': levelMouseOut,
    'object:selected': levelObjectSelected,
});

function levelMouseDown(ev) {

}

function levelMouseOver(ev) {
    if(ev.target && ev.target.mouseOver) {
        ev.target.mouseOver();
    }
    canvas_levels.renderAll();
}

function levelMouseOut(ev) {
    if(ev.target && ev.target.mouseOut) {
        ev.target.mouseOut();
    }
    canvas_levels.renderAll();
}

function levelObjectSelected(ev) {
    if(ev.target && ev.target.onSelected) {
        ev.target.onSelected();
    }
    canvas_levels.discardActiveObject();
}