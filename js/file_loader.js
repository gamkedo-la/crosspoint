





document.getElementById('file').addEventListener('change', function (evt) {

   var files = evt.target.files;
   var file = files[0];           
   var reader = new FileReader();
   reader.onload = function() {
     currentEditor.loadLevel(this.result);
     console.log("Loaded level from file");            
   }
   reader.readAsText(file);
});



