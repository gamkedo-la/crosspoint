
// Main menu screen

// Instantiate menu and credits canvases as Fabric canvases
var canvas_menu = new fabric.Canvas('canvas_menu');
canvas_menu.hoverCursor = 'pointer';
canvas_menu.backgroundColor = 'white';


var mainLogo_MENU;
var mainLogoGrid_MENU;
var levels_MENU;
var credits_MENU;
function menuLoadElements() {
    
    // CrossPoint Logo Grid
    mainLogoGrid_MENU = new fabric.Image(logo_grid, {
        originX: 'center', 
        originY: 'center',
        left: canvasCenterX,
        top:  canvasCenterY,
        selectable: false,
    });
    canvas_menu.add(mainLogoGrid_MENU);

    // CrossPoint Logo
    mainLogo_MENU = new fabric.Image(logo_CrossPoint, {
        originX: 'center', 
        originY: 'center',
        width: MENU_LOGO_WIDTH,
        height: MENU_LOGO_HEIGHT,
        left: canvasCenterX,
        top:  canvasCenterY + MENU_LOGO_OFFSET_Y,
        selectable: false,
    });
    canvas_menu.add(mainLogo_MENU);

    // Buttons
    levels_MENU = new MainMenuLevelsButton({x: canvasCenterX, y: canvasCenterY + MAIN_MENU_BUTTON_OFFSET_Y});
    canvas_menu.add(levels_MENU);
    credits_MENU = new MainMenuCreditsButton({x: canvasCenterX, y: canvasCenterY +  
                                                MAIN_MENU_BUTTON_OFFSET_Y + MAIN_MENU_BUTTON_BUFFER_Y + MAIN_MENU_LEVELS_BUTTON_HEIGHT/2});
    canvas_menu.add(credits_MENU);
}   

canvas_menu.on({
    'mouse:down': menuMouseDown,
    'mouse:over': menuMouseOver,
    'mouse:out': menuMouseOut,
    'object:selected': menuObjectSelected,
});

function menuMouseDown(ev) {
    console.log("Click Main Menu");
}

function menuMouseOver(ev) {
    if(ev.target && ev.target.mouseOver) {
        ev.target.mouseOver();
    }
    canvas_menu.renderAll();
}

function menuMouseOut(ev) {
    if(ev.target && ev.target.mouseOut) {
        ev.target.mouseOut();
    }
    canvas_menu.renderAll();
}

function menuObjectSelected(ev) {
    if(ev.target && ev.target.onSelected) {
        ev.target.onSelected();
    }
    canvas_menu.discardActiveObject();
}



