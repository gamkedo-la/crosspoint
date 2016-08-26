


// Card Objects for Level Menu, used by menu_level


// ----------------------------------
// Menu Buttons
// ----------------------------------

var MenuButton = fabric.util.createClass( fabric.Group,
    {
        initialize: function(centerPoint) {
            // Receives centerpoint for button

            this.callSuper('initialize');

            this.set({originX: 'center', 
                      originY: 'center',
                      selectable: true,
                      lockMovementX: true,
                      lockMovementY: true,
            });

            // Draw bounding box
            this.box = new fabric.Rect({
                    originX: 'center', 
                    originY: 'center',
                    top : centerPoint.y,
                    left : centerPoint.x,
                    width : BTN_WIDTH,
                    height : BTN_HEIGHT,
                    rx: 10,
                    ry: 10,
                    fill: GRAY_MENU_LT,
                });
            this.addWithUpdate(this.box);
        },

        mouseOver: function() {
            // Change color
            if (this.selectable) {
                this.box.set({fill: GRAY_MENU_DK, 
                              width: BTN_WIDTH * BTN_SCALING_FACTOR,
                              height: BTN_HEIGHT * BTN_SCALING_FACTOR  });
            }
        },

        mouseOut: function() {
            // Change color
            this.box.set({fill: GRAY_MENU_LT, 
                          width: BTN_WIDTH,
                          height: BTN_HEIGHT });

        },
        
    }
);

var MenuHomeButton = fabric.util.createClass( MenuButton,
    {
        initialize: function(centerPoint) {
            // Receives centerpoint for button

            this.callSuper('initialize', centerPoint);

            this.img = new fabric.Image(menu_home, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
            });
            this.addWithUpdate(this.img);
        
        },

        onSelected: function() {
            // Go to previous menu
            goToPreviousMenuCanvas();
        },
        
    }
);



var ReloadButton = fabric.util.createClass( MenuButton,
    {
        initialize: function(centerPoint) {
            // Receives centerpoint for button

            this.callSuper('initialize', centerPoint);

            this.set({originX: 'center', 
                      originY: 'center',
                      selectable: true,
                      lockMovementX: true,
                      lockMovementY: true,
            });


            this.img = new fabric.Image(menu_reload, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
            });
            this.addWithUpdate(this.img);
        
        },

        onSelected: function() {
            // Reload level
            currentLevelLoader.reloadCurrentLevel();
        },
        
    }
);

var MenuButtonLevelNumber = fabric.util.createClass( MenuButton,
    {
        initialize: function(centerPoint) {
            // Receives centerpoint for button

            this.callSuper('initialize', centerPoint);

            this.selectable = false;

            // Fix box
            this.box.set({fill : color_main_DK, }); 

            // Add text (level number)
            this.numberString = currentLevelLoader.lastLevelLoaded[1].toString();
            this.textbox = new fabric.Text(this.numberString, 
                {   
                    originX: 'center',
                    originY: 'center',
                    top : centerPoint.y + 2,
                    left : centerPoint.x,
                    fontSize: BOX_FONTSIZE * 1.3,
                    fill: BACKGROUND_COLOR,
                });

            this.addWithUpdate(this.textbox);
        
        },

        mouseOver: function() {
            // Change color
            if (this.selectable) {
                this.box.set({width: LEVEL_CARD_WIDTH * MENU_BUTTON_SCALING_FACTOR, 
                                height: LEVEL_CARD_WIDTH * MENU_BUTTON_SCALING_FACTOR, });
            }
        },

        mouseOut: function() {
            // Change color
            this.box.set({width: LEVEL_CARD_WIDTH, 
                            height: LEVEL_CARD_WIDTH, });

        },

        onSelected: function() {
        },
        
    }
);

// Long buttons for Level menu

var MenuLongButton = fabric.util.createClass( MenuButton,
    {
        initialize: function(centerPoint, new_img) {
            // Receives centerpoint for button

            this.callSuper('initialize', centerPoint);

            // Fix box dimensions
            this.box.set({width : BUTTON_LONG_WIDTH,
                          height: BUTTON_LONG_HEIGHT}); 

            console.log("new_img", new_img)

            this.img = new fabric.Image(new_img, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
            });
            this.addWithUpdate(this.img);
        
        },

        mouseOver: function() {
            // Change color
            if (this.selectable) {
                this.box.set({fill: GRAY_MENU_DK, 
                              width: BUTTON_LONG_WIDTH * BTN_SCALING_FACTOR,
                              height: BUTTON_LONG_HEIGHT * BTN_SCALING_FACTOR  });
            }
        },

        mouseOut: function() {
            // Change color
            this.box.set({fill: GRAY_MENU_LT, 
                          width: BUTTON_LONG_WIDTH,
                          height: BUTTON_LONG_HEIGHT });

        },

        onSelected: function() {

        },
        
    }
);


var MenuLongButtonXP = fabric.util.createClass( MenuLongButton,
    {
        initialize: function(centerPoint, new_img) {
            // Receives centerpoint for button

            this.callSuper('initialize', centerPoint, new_img);
        },

        onSelected: function() {
            // Go to previous menu
            goToPreviousMenuCanvas();
        },
        
    }
);


// Main Menu Buttons

var MainMenuLevelsButton = fabric.util.createClass( fabric.Group,
    {
        initialize: function(centerPoint) {
            // Receives centerpoint for button

            this.callSuper('initialize');

            this.set({originX: 'center', 
                      originY: 'center',
                      selectable: true,
                      lockMovementX: true,
                      lockMovementY: true,
            });


            this.img = new fabric.Image(menu_to_levels, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
                width: MAIN_MENU_LEVELS_BUTTON_WIDTH,
                height: MAIN_MENU_LEVELS_BUTTON_HEIGHT,
            });
            this.addWithUpdate(this.img);
        
        },

        

        mouseOver: function() {
            // Make image larger
            if (this.selectable) {
                this.img.set({width: MAIN_MENU_LEVELS_BUTTON_WIDTH * MENU_BUTTON_SCALING_FACTOR, 
                              height: MAIN_MENU_LEVELS_BUTTON_HEIGHT * MENU_BUTTON_SCALING_FACTOR, });
            }
        },

        mouseOut: function() {
            // Make image smaller
            this.img.set({width: MAIN_MENU_LEVELS_BUTTON_WIDTH, 
                          height: MAIN_MENU_LEVELS_BUTTON_HEIGHT, });

        },

        onSelected: function() {
            // Go to level menu
            switchCanvas("level")
        },
        
    }
);

var MainMenuCreditsButton = fabric.util.createClass( fabric.Group,
    {
        initialize: function(centerPoint) {
            // Receives centerpoint for button

            this.callSuper('initialize');

            this.set({originX: 'center', 
                      originY: 'center',
                      selectable: true,
                      lockMovementX: true,
                      lockMovementY: true,
            });


            this.img = new fabric.Image(menu_to_credits, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
                width: MAIN_MENU_CREDITS_BUTTON_WIDTH,
                height: MAIN_MENU_CREDITS_BUTTON_HEIGHT,
            });
            this.addWithUpdate(this.img);
        
        },

        

        mouseOver: function() {
            // Make image larger
            if (this.selectable) {
                this.img.set({width: MAIN_MENU_CREDITS_BUTTON_WIDTH * MENU_BUTTON_SCALING_FACTOR, 
                              height: MAIN_MENU_CREDITS_BUTTON_HEIGHT * MENU_BUTTON_SCALING_FACTOR, });
            }
        },

        mouseOut: function() {
            // Make image smaller
            this.img.set({width: MAIN_MENU_CREDITS_BUTTON_WIDTH, 
                          height: MAIN_MENU_CREDITS_BUTTON_HEIGHT, });

        },

        onSelected: function() {
            // Go to level menu
            switchCanvas("credits")
        },
        
    }
);

// MainMenuCreditsButton.prototype.perPixelTargetFind = false;
