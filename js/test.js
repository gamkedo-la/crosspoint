var greinerHormann = require('../GreinerHormann-master/dist/greiner-hormann');

var poly1 = [{x: 0, y:0}, {x: 0, y: 2}, {x: 2, y: 2}, {x: 1, y: 1}, {x: 2, y: 0}];
var poly2 = [{x: 2, y:2}, {x: 2, y: 3}, {x: 3, y: 2}];


var union = greinerHormann.union(poly1, poly2);

console.log(union);