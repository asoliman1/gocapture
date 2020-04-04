const PORT=8080; 
const APP_DIR = __dirname + '/platforms/browser/www';

var express = require('express');
var app = express();
var path = require("path");

app.use(express.static(APP_DIR));

app.get('/', function (req, res) {
    res.sendFile(path.join(APP_DIR + 'index.html'));
});

app.listen(PORT);

console.log("Running at Port: " + PORT);
