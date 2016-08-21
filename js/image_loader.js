
// ----------- Logo -----------------
var logo_CrossPoint = document.createElement("img");

// ----------- Boards -----------------
var board_purple = document.createElement("img");
var board_images = [board_purple];

// ----------- Buttons -----------------
var menu_back = document.createElement("img");
var menu_levels = document.createElement("img");

// ----------- Cards -----------------
var card_house = document.createElement("img");




// ------------------------------------

function loadImageForLevel(imgVar, fileName) {
    imgVar.src = "img/" + fileName;
}


function loadImages() {

    // LIST ALL IMAGES HERE (don't forget to create the variable)
    var imageList = [
        {varName: logo_CrossPoint, fileName: "logo_crosspoint.png"},
        {varName: board_purple, fileName: "grid_400_400_purple.png"},

        {varName: menu_back, fileName: "card_house.png"},
        {varName: menu_levels, fileName: "menu_toLevels.png"},

        {varName: card_house, fileName: "card_house.png"},
    ];

    for(var i=0; i < imageList.length; i++) {
        if(imageList[i].varName != undefined) {
            loadImageForLevel(imageList[i].varName, imageList[i].fileName);
        } 
    } 
}