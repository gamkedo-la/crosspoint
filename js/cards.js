

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
            this.playable = false;
            this.completed = false;

            // Draw bounding box
            this.box = new fabric.Rect({
                    originX: 'center', 
                    originY: 'center',
                    top : centerPoint.y,
                    left : centerPoint.x,
                    width : 50,
                    height : 80,
                    rx: 10,
                    ry: 10,
                    fill: GRAY_VERY_LT,
                    stroke: SHADOW_COLOR,
                    strokeWidth: LEVEL_CARD_BOX_STROKEWIDTH,

                });
            this.addWithUpdate(this.box);

            // Add level image
            this.img = new fabric.Image(level.card, {
                originX: 'center', 
                originY: 'center',
                left: centerPoint.x,
                top:  centerPoint.y,
                visible: false,
            });
            this.addWithUpdate(this.img);

            // Set position to center point
            this.set({left: centerPoint.x, top: centerPoint.y});

            canvas_levels.add(this);
            
            if(this.level.playable){
                this.displayPlayable();
            } else {
                this.displayUnplayable();
            }
        },
        

        mouseOver: function() {
            // Change background to track color
            if (this.selectable) {
                this.box.set({fill: currentLevelLoader.colors[this.track].main_UL });
            }
        },

        mouseOut: function() {
            // Change background to white
            if (this.selectable) {
                this.box.set({fill: BACKGROUND_COLOR });
            }
        },

        onSelected: function() {
            // Go to level
            currentLevelLoader.loadLevel(this.track, this.levelNumber);
        },

        displayUnplayable: function() {

            this.selectable = false;

            // Change appearance to visible card
            this.img.visible = false;
            this.box.set({fill: GRAY_VERY_LT,
                          stroke: SHADOW_COLOR });

        },

        displayPlayable: function() {
            this.playable = true;
            this.selectable = true;

            // Change appearance to visible card
            this.img.visible = true;
            // Image to gray
            this.img.filters.length = 0;
            this.img.filters.push(new fabric.Image.filters.Tint({
                color: SHADOW_COLOR,
                opacity: 1.0,
            }));
            this.img.applyFilters(canvas_levels.renderAll.bind(canvas_levels));
            // Box to black and white
            this.box.set({fill: BACKGROUND_COLOR,
                          stroke: FOREGROUND_LINE_COLOR });
        },

        displayCompleted: function() {
            this.completed = true;
            this.playable = true;
            this.selectable = true;

            // Change appearance to completed card
            this.img.visible = true;
            // Image to black
            this.img.filters.length = 0;
            this.img.filters.push(new fabric.Image.filters.Tint({
                color: FOREGROUND_LINE_COLOR,
                opacity: 1.0,
            }));
            this.img.applyFilters(canvas_levels.renderAll.bind(canvas_levels));
            // Box to black and white
            this.box.set({fill: BACKGROUND_COLOR,
                          stroke: FOREGROUND_LINE_COLOR });

        },
        
    }
);


var VideoCard = fabric.util.createClass( LevelCard,
    {
        

        mouseOver: function() {
            // Change background to track color
            if (this.selectable) {
                this.box.set({fill: currentLevelLoader.colors[this.track].main_DK });
            }
        },

        // mouseOut: function() {
        //     if (this.selectable) {
        //         this.box.set({fill: SHADOW_COLOR });
        //     }
        // },

        displayUnplayable: function() {

            this.selectable = false;

            // Change appearance to visible card
            this.img.visible = false;
            this.box.set({fill: GRAY_VERY_LT,
                          stroke: SHADOW_COLOR });

        },

        displayPlayable: function() {
            this.playable = true;
            this.selectable = true;

            // Change appearance to visible card
            this.img.visible = true;
        
            // Box to black
            this.box.set({fill: BACKGROUND_COLOR,
                          stroke: FOREGROUND_LINE_COLOR });
        },

        displayCompleted: function() {
            this.displayPlayable();
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
            this.lines = [];

        },

        makeCards: function() {


            // Calculate card positions
            var nRows = this.levels.length;
            var nCols = this.levels[0].length;
            for (var i = 1; i < this.levels.length; i++) {
                nCols = Math.max(nCols, this.levels[i].length);
            };

            // Calculate first card position
            var startY = LEVEL_CARD_PADDINGY + LEVEL_CARD_HEIGHT/2;
            var startX = LEVEL_CARD_PADDINGX + LEVEL_CARD_WIDTH/2;
            var lineX = startX - LEVEL_CARD_WIDTH/2 - 2*LEVEL_CARD_BUFFERX;

            // Create track cards
            for (var i = 0; i < this.levels.length; i++) {
                var centerY = startY + i * (LEVEL_CARD_HEIGHT + LEVEL_CARD_BUFFERY);

                // Create line

                var line = new fabric.Line([lineX, centerY - LEVEL_CARD_HEIGHT/2, 
                                             lineX, centerY + LEVEL_CARD_HEIGHT/2,], 
                    {   stroke: levelColorArray[i].line,
                        strokeWidth: LEVEL_CARD_TRACK_LINEWIDTH,
                        originX: 'center', 
                        originY: 'center', 
                        selectable: false,
                    }
                );
                canvas_levels.add(line);

                // Create cards
                this.cards.push([]);
                for (var j = 0; j < this.levels[i].length; j++) {
                    var centerX = startX + j * (LEVEL_CARD_WIDTH + LEVEL_CARD_BUFFERX);
                    var card;
                    if (this.levels[i][j].level) {
                        // Create a level card
                        card = new LevelCard(this.levels[i][j], {x: centerX, y: centerY}, i, j);
                    } else if (this.levels[i][j].video) {
                        // Create a video card
                        card = new VideoCard(this.levels[i][j], {x: centerX, y: centerY}, i, j);
                    }
                    
                    this.cards[i].push(card);
                }
            }

            
        },

        update: function() {
            canvas_levels.renderAll();
        },

        levelWasLoaded: function(track, levelNumber) {
            this.cards[track][levelNumber].displayPlayable();

            canvas_levels.renderAll();
        },

        levelWasCompleted: function(track, levelNumber) {
            this.cards[track][levelNumber].displayCompleted();

            canvas_levels.renderAll();
        },
        
    }
);

//-----------------------------------------------------------------------------//
// Iinitialize level loader
var currentCardOrganizer = new CardOrganizer(currentLevelLoader.levels);
//-----------------------------------------------------------------------------//

