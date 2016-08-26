
// ----------- Logo -----------------
var logo_CrossPoint = document.createElement("img");

// ----------- Boards -----------------
var board_purple = document.createElement("img");
var board_red = document.createElement("img");
var board_aqua = document.createElement("img");
var board_orange = document.createElement("img");
var board_green = document.createElement("img");
var board_blue = document.createElement("img");
var board_images = {purple: board_purple, 
                    red: board_red,
                    aqua: board_aqua,
                    orange: board_orange,
                    green: board_green,
                    blue: board_blue };

// ----------- Buttons -----------------
var menu_back = document.createElement("img");
var menu_levels = document.createElement("img");

// ----------- Cards -----------------
var card_house = document.createElement("img");
var card_video_play = document.createElement("img");

var card_sheet = document.createElement("img");

var imgCountToLoad;


// ------------------------------------

function loadImageForLevel(imgVar, fileName) {
    imgVar.onload = loadedAnotherImgStartGameIfLast;
    imgVar.src = "img/" + fileName;
}

function loadedAnotherImgStartGameIfLast() {
    imgCountToLoad--;
    if(imgCountToLoad==0) {
        imagesLoadedSoStartGame();
    }
}

function loadImages() {

    // LIST ALL IMAGES HERE (don't forget to create the variable)
    var imageList = [
        {varName: logo_CrossPoint, fileName: "logo_crosspoint.png"},
        {varName: board_purple, fileName: "grid_400_400_purple.png"},
        {varName: board_red, fileName: "grid_400_400_red.png"},
        {varName: board_aqua, fileName: "grid_400_400_aqua.png"},
        {varName: board_orange, fileName: "grid_400_400_orange.png"},
        {varName: board_green, fileName: "grid_400_400_green.png"},
        {varName: board_blue, fileName: "grid_400_400_blue.png"},

        {varName: menu_back, fileName: "menu_back.png"},
        {varName: menu_levels, fileName: "menu_toLevels.png"},

        {varName: card_house, fileName: "cards/sample_card.png"},
        {varName: card_video_play, fileName: "cards/sample_video.png"},

        {varName: card_sheet, fileName: "card-img.png"}
    ];

    imgCountToLoad = imageList.length;

    for(var i=0; i < imageList.length; i++) {
        if(imageList[i].varName != undefined) {
            loadImageForLevel(imageList[i].varName, imageList[i].fileName);
        } 
    } 
}