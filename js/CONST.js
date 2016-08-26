
// ##################################
// Global Variables
// ##################################


// ------------------
// Shape Constants
// ------------------


// Lyne
const LYNE_STROKEWIDTH = 8;
const LYNE_START_RAD = 5;
const LYNE_END_RAD = 8;
const LYNE_END_STROKEWIDTH = 5;
const LYNE_HOVER_GROWTH = 1;
const LYNE_START_SQUARE_WIDTH = 4;
const LYNE_START_SQUARE_STROKEWIDTH = 1;

// Polygon
const POLY_STROKEWIDTH = 2;
const POLY_HOVER_GROWTH = 0;
const POLY_MOVING_OPACITY = 0.5;

// Drop Area
const DROP_AREA_STROKEWIDTH = POLY_STROKEWIDTH;
const DROP_AREA_HOVER_GROWTH = 2;

// Boxes
const BOX_STROKEWIDTH = 3;
const BOX_HOVER_STROKEWIDTH = 5;
const BOX_WIDTH = 75;
const BOX_HEIGHT = 50;
const BOX_PADDING = 10;
const BOX_MOVE_TIME = 1000; // ms
const BOX_FONTSIZE = 20;

const BOXLYNE_WIDTH = 50;
const BOXLYNE_HEIGHT = BOX_HEIGHT;
const BOXLYNE_PADDING = BOX_PADDING;
const BOXLYNE_MOVE_TIME = BOX_MOVE_TIME;
const BOXLYNE_FONTSIZE = BOX_FONTSIZE;

const BOXPOLY_THUMBNAIL_HEIGHT = 40;
const BOXPOLY_THUMBNAIL_WIDTH = 80;
const BOXPOLY_THUMBNAIL_DEFAULT_SCALE = 8;
const BOXPOLY_THUMBNAIL_STROKEWIDTH = 1;

// NumberBalls
const NUMBER_BALL_RAD = 15;
const NUMBER_BALL_HOVER_GROWTH = 1;
const NUMBER_BALL_MOVING_OPACITY = 0.8;
const NUMBER_BALL_RETURN_TIME = 500; // ms
const NUMBER_BALL_PADDING = 8;
const NUMBER_BALL_MOVE_TIME = BOX_MOVE_TIME;
const NUMBER_BALL_FONTSIZE = 18;

// Dropping Objects
const DROPPING_OPACITY = 0.3;

// Shadows
const SHADOW_OPACITY = 1;
const SHADOW_STROKE_WIDTH = 1;
const SHADOW_LINE_STROKE_WIDTH = LYNE_STROKEWIDTH;

// Buttons
const CROSS_BTN_WIDTH = 40;
const CROSS_BTN_HEIGHT = 20;
const CROSS_BTN_LINELENGTH = 8;
const CROSS_BTN_STROKEWIDTH = 3;




// Level Editor
const EDIT_ARROW_WIDTH = BOXLYNE_WIDTH; //pixels
const EDIT_ARROW_HEIGHT = 15; //pixels
const EDIT_LYNE_MAX = 10;
const EDIT_AREA_MAX = 10;
const EDIT_BALL_MAX = 10;


// ------------------
// Menu Constants
// ------------------

// Main Logo
const MENU_LOGO_WIDTH = 600;
const MENU_LOGO_HEIGHT = 160;
const MENU_LOGO_OFFSET_Y = -25;
// Main buttons
const MAIN_MENU_BUTTON_OFFSET_Y = 80;
const MAIN_MENU_BUTTON_BUFFER_Y = 15;
const MAIN_MENU_LEVELS_BUTTON_WIDTH = 120;
const MAIN_MENU_LEVELS_BUTTON_HEIGHT = 80;
const MAIN_MENU_CREDITS_BUTTON_WIDTH = 100;
const MAIN_MENU_CREDITS_BUTTON_HEIGHT = 50;

// Cards
const LEVEL_CARD_WIDTH = 50;
const LEVEL_CARD_HEIGHT = 80;
const LEVEL_CARD_BUFFERX = 5;
const LEVEL_CARD_BUFFERY = 10;
const LEVEL_CARD_PADDINGX = 45;
const LEVEL_CARD_PADDINGY = 35;
const LEVEL_CARD_SCALING_FACTOR = 1.2;

const LEVEL_CARD_TRACK_LINEWIDTH = 3;
const LEVEL_CARD_BOX_STROKEWIDTH = 2;

// Buttons

// Game Canvas buttons
const BTN_WIDTH = 50;
const BTN_HEIGHT = 50;
const BTN_PADDINGX = 40;
const BTN_PADDINGY = 30;
const BTN_BUFFERX = 5;
const BTN_BUFFERY = 5;
const BTN_SCALING_FACTOR = 1.05;

// Menu canvas buttons
const MENU_BUTTON_SCALING_FACTOR = BTN_SCALING_FACTOR;

const BUTTON_LONG_WIDTH = 150;
const BUTTON_LONG_HEIGHT = BTN_HEIGHT;
const BUTTON_LONG_PADDINGX = 60;
const BUTTON_LONG_PADDINGY = BTN_PADDINGY;
// const BUTTON_LONG_BUFFERX = 5;
const BUTTON_LONG_BUFFERY = 5;








// ------------------
// Color Schemes
// ------------------

// make 3xN grid of hex colors

const BACKGROUND_COLOR = "white";
const FOREGROUND_LINE_COLOR = "black";

const SHADOW_COLOR = "gray";
const BUTTON_COLOR = "black";
const NUMBER_BALL_COLOR = "black";
const INVISIBLE_COLOR = 'rgba(255,0,0,0.01)';
const INVISIBLE_COLOR_MODIFIED = 'rgba(255,0,0,1.0)';
const GRAY_VERY_LT = '#EEEEEE';
const GRAY_LT_LEVELCARDS = '#B8B8B8';
const GRAY_MENU_LT = '#585858';
const GRAY_MENU_DK = '#424242'; 


const PURPLE_LT = '#d2a2f1';
const PURPLE_MD = '#ca7dfc';
const PURPLE_DK = '#5f1a8c';//'#64427A';
const PURPLE_BRIGHT = '#9A00DB';
const PURPLE_ULTRALIGHT = '#f1e8fa';

const DARK_GREEN_LT = '#81da7d';
const DARK_GREEN_MD = '#56cd50';
const DARK_GREEN_DK = '#0b6a07';
const DARK_GREEN_BRIGHT = '#2bc32e';
const DARK_GREEN_ULTRALIGHT = '#dcfbdd';

const RED_LT = '#e5787d';
const RED_MD = '#df6a6f';
const RED_DK = '#b12020';
const RED_BRIGHT = '#DB1600';
const RED_ULTRALIGHT = '#fce7e6';

const ORANGE_LT = '#fb9e5a'; // '#ebb27f';
const ORANGE_MD = '#fd9344';
const ORANGE_DK = '#d85c0a';
const ORANGE_BRIGHT = '#f86b03'; //fe8f07
const ORANGE_ULTRALIGHT = '#f8e4d2';

const BLUE_LT = '#a8b1e9';
const BLUE_MD = '#838ed3';
const BLUE_DK = '#39479e';
const BLUE_BRIGHT = '#0500DB';
const BLUE_ULTRALIGHT = '#d3e6f8';

const AQUA_LT = '#9fe7f8';
const AQUA_MD = '#63d6f2';
const AQUA_DK = '#0f7c96';
const AQUA_BRIGHT = '#00D7DB';
const AQUA_ULTRALIGHT = '#dff7fc';

// Secondaries
const GRAY_LT = '#B8B8B8';
const GRAY_MD = '#A8A9AB';
const GRAY_DK = '#333333';

const GREEN_LT = '#d2f19b';
const GREEN_MD = '#c2f171';
const GREEN_DK = '#64832E';

const MARINE_GREEN_LT = '#a4ecb1';
const MARINE_GREEN_MD = '#7de891';
const MARINE_GREEN_DK = '#27a23e';


const BROWN_LT = '#C7A58B';
const BROWN_MD = '#a68a75';
const BROWN_DK = '#4A3A2B';

const GOLD_LT = '#fbf69f';
const GOLD_MD = '#f8f17b';
const GOLD_DK = '#e2d504';

const PINK_LT = '#f2bef3';
const PINK_MD = '#efa1f0';
const PINK_DK = '#a42fa5';


const SKY_BLUE_LT = '#a4f2f4';
const SKY_BLUE_MD = '#57f2f5';
const SKY_BLUE_DK = '#05abad';




