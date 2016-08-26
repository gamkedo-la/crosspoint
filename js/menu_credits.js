
// Credits menu screen

var canvas_credits = new fabric.Canvas('canvas_credits');
canvas_credits.hoverCursor = 'pointer';
canvas_credits.backgroundColor = 'white';

var back_MENU_CREDITS;
function creditsLoadElements() {

    // Credits Images

    // Credits Text

    
    // Buttons
    back_MENU_CREDITS = new MenuHomeButton({x: BTN_PADDINGX + BTN_WIDTH/2 , y: BTN_PADDINGY + BTN_HEIGHT/2});
    canvas_credits.add(back_MENU_CREDITS);
}   

canvas_credits.on({
    'mouse:down': creditsMouseDown,
    'mouse:over': creditsMouseOver,
    'mouse:out': creditsMouseOut,
    'object:selected': creditsObjectSelected,
});

function creditsMouseDown(ev) {

}

function creditsMouseOver(ev) {
    if(ev.target && ev.target.mouseOver) {
        ev.target.mouseOver();
    }
    canvas_credits.renderAll();
}

function creditsMouseOut(ev) {
    if(ev.target && ev.target.mouseOut) {
        ev.target.mouseOut();
    }
    canvas_credits.renderAll();
}

function creditsObjectSelected(ev) {
    if(ev.target && ev.target.onSelected) {
        ev.target.onSelected();
    }
    canvas_credits.discardActiveObject();
}



