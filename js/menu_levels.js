
// Level selection screen

// Instantiate menu canvases as Fabric canvases
var canvas_levels = new fabric.Canvas('canvas_levels');
canvas_levels.hoverCursor = 'pointer';
canvas_levels.backgroundColor = 'white';


var back_MENU_LEVELS;
function levelsLoadElements() {

    var startX = canvasWidth - BUTTON_LONG_PADDINGX - BUTTON_LONG_WIDTH/2;
    var startY = BUTTON_LONG_PADDINGY + BUTTON_LONG_HEIGHT/2;

    // Levels button
    back_MENU_LEVELS = new MenuLongButtonXP({x: startX, y: startY}, logo_xp);
    canvas_levels.add(back_MENU_LEVELS);

    //BUTTON_LONG_BUFFERY
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