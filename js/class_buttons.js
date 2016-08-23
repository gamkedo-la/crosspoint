


// Card Objects for Level Menu, used by menu_level


var ReloadButton = fabric.util.createClass( fabric.Group,
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


            this.img = new fabric.Image(level.card, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
                width: MENU_RELOAD_BUTTON_WIDTH,
                height: MENU_RELOAD_BUTTON_HEIGHT,
            });
            this.addWithUpdate(this.img);
        
        },

        

        mouseOver: function() {
            // Make image larger
            if (this.selectable) {
                this.img.set({width: MENU_RELOAD_BUTTON_WIDTH * MENU_RELOAD_BUTTON_SCALING_FACTOR, 
                              height: MENU_RELOAD_BUTTON_HEIGHT * MENU_RELOAD_BUTTON_SCALING_FACTOR, });
            }
        },

        mouseOut: function() {
            // Make image smaller
            this.img.set({width: MENU_RELOAD_BUTTON_WIDTH, 
                          height: MENU_RELOAD_BUTTON_HEIGHT, });

        },

        onSelected: function() {
            // Reload level
            currentLevelLoader.reloadCurrentLevel();
        },
        
    }
);


// ----------------------------------
// Menu Buttons
// ----------------------------------

var MenuBackButton = fabric.util.createClass( fabric.Group,
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


            this.img = new fabric.Image(menu_back, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
                width: MENU_BACK_BUTTON_WIDTH,
                height: MENU_BACK_BUTTON_HEIGHT,
            });
            this.addWithUpdate(this.img);
        
        },

        

        mouseOver: function() {
            // Make image larger
            if (this.selectable) {
                this.img.set({width: MENU_BACK_BUTTON_WIDTH * MENU_BACK_BUTTON_SCALING_FACTOR, 
                              height: MENU_BACK_BUTTON_HEIGHT * MENU_BACK_BUTTON_SCALING_FACTOR, });
            }
        },

        mouseOut: function() {
            // Make image smaller
            this.img.set({width: MENU_BACK_BUTTON_WIDTH, 
                          height: MENU_BACK_BUTTON_HEIGHT, });

        },

        onSelected: function() {
            // Go to previous menu
            goToPreviousMenuCanvas();
        },
        
    }
);


var MenuLevelsButton = fabric.util.createClass( fabric.Group,
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


            this.img = new fabric.Image(menu_levels, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
                width: MENU_LEVELS_BUTTON_WIDTH,
                height: MENU_LEVELS_BUTTON_HEIGHT,
            });
            this.addWithUpdate(this.img);
        
        },

        

        mouseOver: function() {
            // Make image larger
            if (this.selectable) {
                this.img.set({width: MENU_LEVELS_BUTTON_WIDTH * MENU_LEVELS_BUTTON_SCALING_FACTOR, 
                              height: MENU_LEVELS_BUTTON_HEIGHT * MENU_LEVELS_BUTTON_SCALING_FACTOR, });
            }
        },

        mouseOut: function() {
            // Make image smaller
            this.img.set({width: MENU_LEVELS_BUTTON_WIDTH, 
                          height: MENU_LEVELS_BUTTON_HEIGHT, });

        },

        onSelected: function() {
            // Go to level menu
            switchCanvas("level")

            console.log("TO LEVELS!")
        },
        
    }
);

var MenuCreditsButton = fabric.util.createClass( fabric.Group,
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


            this.img = new fabric.Image(level.card, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
                width: MENU_CREDITS_BUTTON_WIDTH,
                height: MENU_CREDITS_BUTTON_HEIGHT,
            });
            this.addWithUpdate(this.img);
        
        },

        

        mouseOver: function() {
            // Make image larger
            if (this.selectable) {
                this.img.set({width: MENU_CREDITS_BUTTON_WIDTH * MENU_CREDITS_BUTTON_SCALING_FACTOR, 
                              height: MENU_CREDITS_BUTTON_HEIGHT * MENU_CREDITS_BUTTON_SCALING_FACTOR, });
            }
        },

        mouseOut: function() {
            // Make image smaller
            this.img.set({width: MENU_CREDITS_BUTTON_WIDTH, 
                          height: MENU_CREDITS_BUTTON_HEIGHT, });

        },

        onSelected: function() {
            // Go to previous menu
            goToPreviousMenuCanvas();
        },
        
    }
);

MenuCreditsButton.prototype.perPixelTargetFind = false;
