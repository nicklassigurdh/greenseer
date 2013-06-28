var express = require("express"),
    app = express(),
    port = 8089,
    serverStorage = {};
//, io = require('socket.io').listen(app);

app.configure(function(){
    app.use(express.bodyParser());

    app.use('/api/getWargUrl', function(req, res) {
        res.json(JSON.stringify(serverStorage))
    });

    app.use(express.static(__dirname + '/htdocs'));
});

app.post('/api/setWargUrl/', function(req, res) {
    console.log(req.body);

    //store the data
    serverStorage['wargUrl'] = req.body.wargUrl;

    //just bounce the obj back.. maybe some status
    //TODO:errors?

    res.json(JSON.stringify(serverStorage))
});

app.listen(port);