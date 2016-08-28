

// Load and play music files

const NO_SONG = -1;
const SONG_TITLE = 0;
const SONG_WIND1 = 1;
const SONG_WIND2 = 2;

const TITLE_VOLUME = 1;
const WIND1_VOLUME = 1;
const WIND2_VOLUME = 1;
const LOW_VOLUME_MULTIPLIER = 0.5;

var lastSongPlaying = SONG_TITLE;
var songs = [];

function prepSongs() {
    var title_song, wind1_song, wind2_song;
    title_song = document.getElementById("title_song");
    title_song.volume = TITLE_VOLUME;
    songs.push(title_song);
   
    wind1_song = document.getElementById("wind1_song");
    wind1_song.volume = WIND1_VOLUME;
    songs.push(wind1_song);
    wind2_song = document.getElementById("wind2_song");
    wind2_song.volume = WIND2_VOLUME;
    songs.push(wind2_song);
}

function stopMusic() {
    for (var i = 0; i < songs.length; i++) {
        songs[i].pause();
    }
    lastSongPlaying = NO_SONG;
}

function changeSong(toSong) {
    // toSong is integer that corresponds to a son
    if(lastSongPlaying === toSong) { return; }

    stopMusic();

    var newSong = songs[toSong];    
    
    
    if (newSong !== undefined && newSong !== null) {
        newSong.currentTime = 0;
        newSong.play();
        // songTo.controls = true;
        lastSongPlaying = toSong;
    }
    
}

function playRandomInGameSong() {
    // play random game track (not title at position 0)
    var newSongNumber = getRandomInt(1, songs.length);
    console.log("newSong", newSongNumber);
    changeSong(newSongNumber);
}

function changeToInGameSongs() {
    // Change from title sequence to in-game soundtrack
    console.log("changeToInGameSongs");
    playRandomInGameSong();

    
}

function changeToTitleSong() {
    // Change from title sequence to in-game soundtrack
    console.log("changeToTitleSong");
    changeSong(SONG_TITLE);

    
}

function songTick() {
    if(songs[lastSongPlaying] && songs[lastSongPlaying].ended) {

        if (SONG_TITLE === lastSongPlaying) {
            changeSong(SONG_TITLE);
        } else {
            playRandomInGameSong();
        }

    } 
}

function set_volume_to_low() {
    eerie_song.volume = WIND1_VOLUME * LOW_VOLUME_MULTIPLIER;
    intro_song.volume = WIND2_VOLUME * LOW_VOLUME_MULTIPLIER;
}

function set_volume_to_normal() {
    eerie_song.volume = EERIE_VOLUME;
    intro_song.volume = POP_VOLUME;
}


// Helper function
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}