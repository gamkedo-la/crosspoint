
var board_purple = document.createElement("img");
// var board_purple = document.getElementById('board-purple');

var board_images = [board_purple];

    

function loadImageForLevel(imgVar, fileName) {
    imgVar.src = "img/" + fileName;
    imgVar.onload = function () {
        ctx.drawImage(imgVar, gridLeft, gridTop);
    }
}


function loadImages() {

    // LIST ALL IMAGES HERE (don't forget to create the variable)
    var imageList = [
        {varName: board_purple, fileName: "grid_400_400_purple.png"},
    ];

    for(var i=0; i < imageList.length; i++) {
        if(imageList[i].varName != undefined) {
            loadImageForLevel(imageList[i].varName, imageList[i].fileName);
        } 
    } 
}