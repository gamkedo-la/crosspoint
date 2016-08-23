
// Level selection screen

// Instantiate menu canvases as Fabric canvases
var canvas_levels = new fabric.Canvas('canvas_levels');
canvas_levels.hoverCursor = 'pointer';


var back_MENU_LEVELS;
function levelsLoadElements() {

    // Levels button
    back_MENU_LEVELS = new MenuBackButton({x: LEVEL_CARD_PADDINGX/2, y: MENU_BACK_BUTTON_HEIGHT/2 + LEVEL_CARD_PADDINGY});
    canvas_levels.add(back_MENU_LEVELS);
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