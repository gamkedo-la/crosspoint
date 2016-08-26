
var canvas_video = new fabric.Canvas('canvas_cutscene');
// var canvas_video = document.getElementById("canvas_cutscene");
var ctx_video = canvas_video.getContext('2d');


function drawVideo(v,c,w,h) {
    if(v.paused || v.ended) {

        // Call "solved level" to show video was watched
        currentLevelLoader.solvedCurrentLevel();

        // Load next level
        switchCanvas("game");
        currentLevelLoader.loadNextLevel();


        return false;
    }
    c.drawImage(v,0,0,w,h);
    setTimeout(drawVideo,20,v,c,w,h);
}

function  linkVideoToCanvas (video) {
    video.addEventListener('play', function(){
                // Swap canvases
                switchCanvas("cutscene");
                // setTimeout(switchCanvas,900,"cutscene");
                drawVideo(this, ctx_video, canvasWidth, canvasHeight);
                // setTimeout(drawVideo,900,this,ctx_video,canvasWidth,canvasHeight);
                
            },false);
}


