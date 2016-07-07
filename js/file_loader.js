





document.getElementById('file').addEventListener('change', function (evt) {
    console.log("readFile");
   var files = evt.target.files;
   var file = files[0];           
   var reader = new FileReader();
   reader.onload = function() {
     currentEditor.loadLevel(this.result);
     console.log("Loaded level from file");            
   }
   reader.readAsText(file);
});




// <input type="file" id="fileinput" />
// <script type="text/javascript">
//   function readSingleFile(evt) {
//     //Retrieve the first (and only!) File from the FileList object
//     var f = evt.target.files[0]; 

//     if (f) {
//       var r = new FileReader();
//       r.onload = function(e) { 
//           var contents = e.target.result;
//         alert( "Got the file.n" 
//               +"name: " + f.name + "n"
//               +"type: " + f.type + "n"
//               +"size: " + f.size + " bytesn"
//               + "starts with: " + contents.substr(1, contents.indexOf("n"))
//         );  
//       }
//       r.readAsText(f);
//     } else { 
//       alert("Failed to load file");
//     }
//   }

//   document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
// </script>