

// Card Objects for Level Menu, used by menu_level


// ----------------------------------
// Cards
// ----------------------------------

var LevelCard = fabric.util.createClass( fabric.Group,
    {
        initialize: function(level, centerPoint, track, levelNumber) {
            // Receives level from currentLevelLoader, and centerpoint on Level Menu canvas

            this.callSuper('initialize');

            this.set({originX: 'center', 
                      originY: 'center',
                      selectable: true,
                      lockMovementX: true,
                      lockMovementY: true,
            });

            this.level = level;
            this.centerPoint = centerPoint;
            this.track = track;
            this.levelNumber = levelNumber;
            this.visible = false;

            this.img = new fabric.Image(level.card, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
                width: LEVEL_CARD_WIDTH,
                height: LEVEL_CARD_HEIGHT,
            });
            this.addWithUpdate(this.img);

            // Set position to center point
            this.set({left: centerPoint.x, top: centerPoint.y});

            this.update();
        
        },

        update: function(mouse_e) {
            // If visibility has changed, update image
            if (this.visible !== this.level.visible) {
                
                if(this.level.visible) {
                    // Should be visible, add to canvas

                    canvas_levels.add(this);
                    this.visible = true;

                } else {
                    // Should be invisible, remove from canvas

                    canvas_levels.remove(this);
                    this.visible = false;
                }
            }
            
        },
        

        mouseOver: function() {
            // Make image larger
            if (this.selectable) {
                this.img.set({width: LEVEL_CARD_WIDTH * LEVEL_CARD_SCALING_FACTOR, 
                              height: LEVEL_CARD_HEIGHT * LEVEL_CARD_SCALING_FACTOR, });
            }
        },

        mouseOut: function() {
            // Make image smaller
            this.img.set({width: LEVEL_CARD_WIDTH, 
                          height: LEVEL_CARD_HEIGHT, });

        },

        onSelected: function() {
            // Go to level
            currentLevelLoader.loadLevel(this.track, this.levelNumber);
        },
        
    }
);



// ----------------------------------
// Card Organizer
// ----------------------------------


var CardOrganizer = fabric.util.createClass( 
    {
        initialize: function(levels) {

            this.levels = levels;
            this.cards = [];

        },

        makeCards: function() {

            // LEVEL_CARD_HEIGHT
            // LEVEL_CARD_WIDTH
            // LEVEL_CARD_BufferX = 5;
            // LEVEL_CARD_BufferY = 10;
            // const LEVEL_CARD_PADDINGX = 15;
            // const LEVEL_CARD_PADDINGY = 15;
            // var canvasWidth = canvas.getWidth();
            // var canvasHeight = canvas.getHeight();
            // var canvasCenter = canvas.getCenter();
            // var canvasCenterX = canvasCenter.left;
            // var canvasCenterY = canvasCenter.top;


            // Calculate card positions
            var nRows = this.levels.length;
            var nCols = this.levels[0].length;
            for (var i = 1; i < this.levels.length; i++) {
                nCols = Math.max(nCols, this.levels[i].length);
            };

            // Calculate first card position
            var startY = LEVEL_CARD_PADDINGY + LEVEL_CARD_HEIGHT/2;
            var startX = LEVEL_CARD_PADDINGX + LEVEL_CARD_WIDTH/2;

            // Create cards
            for (var i = 0; i < this.levels.length; i++) {
                var centerY = startY + i * (LEVEL_CARD_HEIGHT + LEVEL_CARD_BufferY);
                for (var j = 0; j < this.levels[i].length; j++) {
                    var centerX = startX + j * (LEVEL_CARD_WIDTH + LEVEL_CARD_BufferX);
                    var card = new LevelCard(this.levels[i][j], {x: centerX, y: centerY}, i, j);
                    this.cards.push(card);
                }
            }
        },

        update: function() {
            for (var i = 0; i < this.cards.length; i++) {
                this.cards[i].update();
            }
            canvas_levels.renderAll();
        },
        
    }
);


//-----------------------------------------------------------------------------//
// Iinitialize level loader
var currentCardOrganizer = new CardOrganizer(currentLevelLoader.levels);
//-----------------------------------------------------------------------------//

