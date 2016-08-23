

// Load and play sound files

var sound_snap = null;

function loadSFX() {
    sound_snap = document.getElementById("snap"); 
    sound_grab = document.getElementById("grab"); 
    sound_add = document.getElementById("add"); 
    sound_add_line = document.getElementById("add_line"); 
    sound_rotate_hover = document.getElementById("rotate_hover"); 
    sound_rotate_bing = document.getElementById("rotate_bing"); 
    sound_scale = document.getElementById("scale");
    sound_undo = document.getElementById("undoMove");
    sound_win_level = document.getElementById("win_level");
}

function playSFX(sound_text) {
    var sound;

    if (sound_text === "snapToGrid"){
        sound = sound_snap;
    } else if (sound_text === "grab"){
        sound = sound_grab;
    } else if (sound_text === "addToGrid"){
        sound = sound_add;
    } else if (sound_text === "addLine"){
        sound = sound_add_line;
    } else if (sound_text === "rotateHover"){
        sound = sound_rotate_hover;
    } else if (sound_text === "rotateChange"){
        sound = sound_rotate_bing;
    } else if (sound_text === "scale"){
        sound = sound_scale;
    } else if (sound_text === "undoMove"){
        sound = sound_undo;   
    } else if (sound_text === "winLevel"){
        sound = sound_win_level;    
    } else {
        return;
    }

    if (sound.paused) {
        sound.currentTime = 0; 
        sound.play();
    }
    
}



// -------------------------------
// EXAMPLE (Put this in code to play SFX)

// Audio
// playSFX("addLine");

