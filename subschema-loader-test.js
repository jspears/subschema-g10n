var sl = require('./subschema-loader');
var fs = require('fs');
var source = fs.readFileSync('./public/app.subschema.json');

var out = sl(source);
console.log('out', out);
