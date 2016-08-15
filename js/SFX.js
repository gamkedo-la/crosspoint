

// Load and play sound files

var sound_snap = null;

function loadSFX() {
    sound_snap = document.getElementById("snap"); 
    sound_add = document.getElementById("add"); 
    sound_rotate = document.getElementById("rotate"); 
    sound_scale = document.getElementById("scale");
}

function playSFX(sound_text) {
    var sound;

    if (sound_text === "snapToGrid"){
        sound = sound_snap;
    } else if (sound_text === "addToGrid"){
        sound = sound_add;
    } else if (sound_text === "rotateLine" || sound_text === "dropArea"){
        sound = sound_rotate;
    } else if (sound_text === "scale"){
        sound = sound_scale;
    } else {
        return;
    }

    sound.currentTime = 0; 
    sound.play();
}





// -------------------------------
// EXAMPLE

// var reflect_sound = null

// function prepSFX() {
//     reflect_sound = document.getElementById("reflect"); 
// }


// // ADD THIS TO CODE TO PLAY SFX
// reflect_sound.currentTime = 0; 
// reflect_sound.play();