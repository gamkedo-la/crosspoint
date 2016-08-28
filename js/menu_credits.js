
// Credits menu screen

var canvas_credits = new fabric.Canvas('canvas_credits');
canvas_credits.hoverCursor = 'pointer';
canvas_credits.backgroundColor = 'white';

var back_MENU_CREDITS;
var credits_string = {};
var credits_obj = {};
function creditsLoadElements() {

    // Credits Images

    // Credits Text
    credits_string.projectlead = "Project Lead:\n     Erik Verlage";
    credits_string.coding = "Game Design:\n     Erik Verlage\n     Chris Deleon";
    credits_string.levels = "Level Design:\n     Erik Verlage\n     Chris Deleon\n     Tim Waskett\n     Jeremy Kenyon\n     Chris Markle\n     Micky Turner\n     Paul Diaz";
    credits_string.sounds = "Sound and Music:\n     Micky Turner\n     Erik Verlage"
    credits_string.special = "Special Thanks:\n     Sasha Reneau (color consultant)\n     Listvetra (http://subtlepatterns.com/)\n\nLevel Testers:\n     Alex Verlage\n     Midori Shibuya\n     Sarah Haney";

    // Make credits objects
    var startX = 170;
    var startY = 65;
    var bufferX = 230;
    var bufferY = 20;
    var newX = startX;
    var newY = startY;
    // Project Lead
    credits_obj.c1 = new CredtisText(credits_string.projectlead, {x: newX, y: newY}, levelColorArray[0].line);
    // Coding
    newY = credits_obj.c1.top + credits_obj.c1.height + bufferY;
    credits_obj.c2 = new CredtisText(credits_string.coding, {x: newX, y: newY}, levelColorArray[4].line);
    // Project Lead
    newY = credits_obj.c2.top + credits_obj.c2.height + bufferY;
    credits_obj.c3 = new CredtisText(credits_string.levels, {x: newX, y: newY}, levelColorArray[1].line);
    // Project Lead
    newY = credits_obj.c3.top + credits_obj.c3.height + bufferY;
    credits_obj.c4 = new CredtisText(credits_string.sounds, {x: newX, y: newY}, levelColorArray[5].line);
    // Special
    newX += bufferX;
    newY = startY;
    credits_obj.c5 = new CredtisText(credits_string.special, {x: newX, y: newY}, levelColorArray[2].line);

    
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


// ----------------------------------
// Credit Text Class
// ----------------------------------


var CredtisText = fabric.util.createClass( fabric.Group,
    {
        initialize: function(string, startPoint, lineColor) {
            // Receives centerpoint for button

            this.callSuper('initialize');

            this.set({originX: 'left', 
                      originY: 'top',
                      selectable: true,
                      lockMovementX: true,
                      lockMovementY: true,
            });

            // Textbox
            this.textbox = new fabric.Text(string, {
                                          fontSize: 20,
                                          left: startPoint.x,
                                          top: startPoint.y,
                                          selectable: false,
                                        });
            // Draw line
            this.line = new fabric.Line([this.textbox.left - 15, this.textbox.top, this.textbox.left - 15, this.textbox.top + this.textbox.height], 
                                {   stroke: lineColor,
                                    strokeWidth: LEVEL_CARD_TRACK_LINEWIDTH,
                                    selectable: false,
                                }
                            );
            this.addWithUpdate(this.textbox);
            this.addWithUpdate(this.line);

            console.log(this.line);

            canvas_credits.add(this);            
        },
        
    }
);


// var credString = credits_string.projectlead + "\n \n" + 
//                      credits_string.coding + "\n \n" + 
//                      credits_string.levels + "\n \n" + 
//                      credits_string.special + "\n \n" ;

//     credits_text_obj = new fabric.Text(credString, {
//                                           originX: "center",
//                                           originY: "center",
//                                           fontSize: 20,
//                                           left: canvasCenterX,
//                                           top: canvasCenterY + 30,
//                                           selectable: false,
//                                         });

//     canvas_credits.add(credits_text_obj);





