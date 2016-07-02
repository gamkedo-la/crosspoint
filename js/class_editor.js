


// ----------------------------------
// Boxes for the Level Editor
// ----------------------------------

// Box Superclass

// BoxLyne
// BoxPoly
// BoxArea
// BoxShape

var EditBox = fabric.util.createClass(fabric.Group, 
    {
        initialize: function() {

            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                 lockMovementX: true,
                 lockMovementY: true,
                }
            );

            // Draw default box
            this.box = new fabric.Rect(
                {
                    originX: 'center', 
                    originY: 'center',
                    top : 0,
                    left : 0,
                    width : 100,
                    height : 50,
                    fill: BACKGROUND_COLOR,
                    stroke: FOREGROUND_LINE_COLOR,
                    strokeWidth: BOX_STROKEWIDTH,
                }
            );
            this.addWithUpdate(this.box);

            // OLD CODE - Erik 2016

            // // Draw up arrow
            // var gridPoints = [  {x: this.box.left - this.box.width/2, y: this.box.top - this.box.height/2},
            //                     {x: this.box.left, y: this.box.top - this.box.height/2 - EDIT_ARROW_HEIGHT},
            //                     {x: this.box.left + this.box.width/2, y: this.box.top - this.box.height/2}   ];
            // this.upArrow = new this.polygon = new fabric.Polygon(gridPointsToCoords(gridPoints),
            //     {
            //         fill: FOREGROUND_LINE_COLOR, 
            //     }
            // );
            // this.addWithUpdate(this.upArrow);

            // // Draw down arrow
            // var gridPoints = [  {x: this.box.left - this.box.width/2, y: this.box.top + this.box.height/2},
            //                     {x: this.box.left, y: this.box.top + this.box.height/2 + EDIT_ARROW_HEIGHT},
            //                     {x: this.box.left + this.box.width/2, y: this.box.top + this.box.height/2}   ];
            // this.downArrow = new this.polygon = new fabric.Polygon(gridPointsToCoords(gridPoints),
            //     {
            //         fill: FOREGROUND_LINE_COLOR, 
            //     }
            // );
            // this.addWithUpdate(this.upArrow);

        },

        mouseOver: function() {
            this.box.set('strokeWidth', BOX_HOVER_STROKEWIDTH);
        },

        mouseOut: function() {
            this.box.set('strokeWidth', BOX_STROKEWIDTH);
        },

        onSelected: function(mouse_e) {
            this.box.set('fill', hex_light);

        },
        
        deselect: function() {
            this.box.set('fill', BACKGROUND_COLOR);
        },

    }
);

var EditBoxLyne = fabric.util.createClass(EditBox, 
    {
        initialize: function(gridWidth, gridHeight) {

            this.callSuper('initialize');

            this.type = "editBoxLyne";
            this.gridWidth = Math.round(gridWidth);
            this.gridHeight = gridHeight ? Math.round(gridHeight) : null;

            // override box settings
            this.box.set({width: 50});
        },

        increase: function() {
            this.gridWidth += 1;
            this.gridWidth % EDIT_LYNE_MAX;
            this.updateLength();
        },

        decrease: function() {
            this.gridWidth -= 1;
            this.gridWidth % EDIT_LYNE_MAX;
            this.updateLength();
        },

        updateLength: function() {
            // calculate length
            if (this.gridHeight)
            {
                this.lyneLength = Math.sqrt(Math.pow(gridWidth, 2) + Math.pow(gridHeight, 2));
                this.lyneLength  = this.lyneLength.toFixed(1);
            } else {
                this.lyneLength = this.gridWidth;
            }
            this.lyneString = this.lyneLength.toString(); // getLyneString; //String

            // remove old textbox
            if (this.lyneStringTextbox) {
                this.removeWithUpdate(this.lyneStringTextbox);
            }

            // add textbox
            this.lyneStringTextbox = new fabric.Text(this.lyneString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: this.left, 
                    top: this.top,
                    fontSize: BOXLYNE_FONTSIZE,
                });

            this.addWithUpdate(this.lyneStringTextbox);
        },
    }
);

var EditBoxBall = fabric.util.createClass(EditBox, 
    {
        initialize: function(number) {

            this.callSuper('initialize');

            this.type = "editBoxBall";
            this.number = number;
            this.numberString = this.numberString.toString(); 

            // override box settings
            this.box.set({width: 50});

            // add to box
            this.numberStringTextbox = new fabric.Text(this.numberString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: 0, 
                    top: 0,
                    fontSize: BOXLYNE_FONTSIZE,
                });

            this.addWithUpdate(this.numberStringTextbox);

        },

        increment: function(val) {
            this.number += val;
            this.number %= EDIT_BALL_MAX;
        },
    }
);

// var EditBoxPoly = fabric.util.createClass(EditBox, 
//     {
//         initialize: function(gridPoints) {

//             this.callSuper('initialize');

//             this.type = "boxPoly";
//             this.gridPoints = gridPoints;

//             // Create shape in miniature, fit into box
//             // Shape will have secondary color
//         },
//     }
// );

var EditBoxArea = fabric.util.createClass(EditBox, 
    {
        initialize: function(gridArea) {

            this.callSuper('initialize');

            this.type = "editBoxArea";
            this.gridArea = Math.round(gridArea);

            this.areaString = this.gridArea.toString(); // getLyneString; //String

            // add to box
            this.areaStringTextbox = new fabric.Text(this.areaString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    left: 0, 
                    top: 0,
                    fontSize: BOX_FONTSIZE,
                });

            this.addWithUpdate(this.areaStringTextbox);

        },

        increment: function(val) {
            this.number += val;
            this.number %= EDIT_BALL_MAX;
        },
    }
);


// ----------------------------------
// Buttons
// ----------------------------------

var ArrowButton = fabric.util.createClass(fabric.Group, 
    {
        initialize: function(centerPoint, val, Box) {

            // val = +/- 1 for up and down arrows.

            // Initialize Polygon
            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                 lockMovementX: true,
                 lockMovementY: true,
                }
            );

            this.type = 'editArrow';
            this.box = Box;
            this.val = val;

            var buttonCoords = [
                { x: centerPoint.x - EDIT_ARROW_WIDTH/2,
                  y: centerPoint.y},
                { x: centerPoint.x + EDIT_ARROW_WIDTH/2,
                  y: centerPoint.y},
                { x: centerPoint.x,
                  y: centerPoint.y + EDIT_ARROW_HEIGHT * val}, 
            ];

            this.button = new fabric.Polygon(buttonCoords,
                {
                 fill: BUTTON_COLOR, 
                }
            );

            this.addWithUpdate(this.button);
            
        },

        mouseOver: function() {
            this.set({'strokeWidth': (POLY_STROKEWIDTH + POLY_HOVER_GROWTH)});
        },

        mouseOut: function() {
            this.set({'strokeWidth': POLY_STROKEWIDTH});
        },

        onSelected: function(mouse_e) {
            // Increase button element
            this.box.increment(this.val);
        },
    }
);

var SaveButton = fabric.util.createClass(fabric.Group, 
    {
        initialize: function(file) {

            // val = +/- 1 for up and down arrows.

            // Initialize Polygon
            this.callSuper('initialize');
            this.set( 
                {originX: 'center', 
                 originY: 'center',
                 lockMovementX: true,
                 lockMovementY: true,
                }
            );

            this.type = 'editArrow';
            this.box = Box;
            this.val = val;

            var buttonCoords = [
                { x: centerPoint.x - EDIT_ARROW_WIDTH/2,
                  y: centerPoint.y},
                { x: centerPoint.x + EDIT_ARROW_WIDTH/2,
                  y: centerPoint.y},
                { x: centerPoint.x,
                  y: centerPoint.y + EDIT_ARROW_HEIGHT * val}, 
            ];

            this.button = new fabric.Polygon(buttonCoords,
                {
                 fill: BUTTON_COLOR, 
                }
            );

            this.addWithUpdate(this.button);
            
        },

        mouseOver: function() {
            this.set({'strokeWidth': (POLY_STROKEWIDTH + POLY_HOVER_GROWTH)});
        },

        mouseOut: function() {
            this.set({'strokeWidth': POLY_STROKEWIDTH});
        },

        onSelected: function(mouse_e) {
            // Increase button element
            this.box.increment(this.val);
        },
    }
);

