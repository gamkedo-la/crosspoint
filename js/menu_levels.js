
// Level selection screen


// Instantiate menu canvases as Fabric canvases
var canvas_levels = new fabric.Canvas('canvas_levels');
canvas_levels.hoverCursor = 'pointer';

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
}