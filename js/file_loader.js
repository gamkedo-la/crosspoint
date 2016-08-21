





document.getElementById('file').addEventListener('change', function (evt) {

   var files = evt.target.files;
   var file = files[0];           
   var reader = new FileReader();
   reader.onload = function() {
     currentEditor.loadLevel(this.result);       
   }
   reader.readAsText(file);
});



