const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/covid-vaccination'));
app.get('/*', function(req,res) {res.sendFile(path.join(__dirname+'/dist/covid-vaccination/index.html'));
});

portapp.listen(process.env.PORT || 8080);