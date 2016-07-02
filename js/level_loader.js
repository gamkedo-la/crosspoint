

// Load level from JSON files



var loadLevelFromJSON = function(file_name) {
    $.getJSON(file_name, function(data) {

        // TODO
        // Delete previous level
        // if (currentLevel) {
        //     currentLevel.deleteAll();
        // }

        // Load new level
        currentLevel = Level.init(data.levelOptions, data.pieces);

    });
}