var express = require("express"),
    app = express(),
    server = require('http').createServer(app),
    WebSocketServer = require('websocket').server,
    port = 8089,
    serverStorage = {},
    clients = [];

app.configure(function(){
    app.use(express.bodyParser());

    app.use('/api/getWargUrl', function(req, res) {
        res.json(JSON.stringify(serverStorage))
    });

    app.use(express.static(__dirname + '/htdocs'));
});

app.post('/api/setWargUrl/', function(req, res) {

    console.log('setting the new wargUrl: '+ req.body.wargUrl);

    //store the data
    serverStorage['wargUrl'] = req.body.wargUrl;

    //just bounce the obj back.. maybe some status
    //TODO:errors?

    //send message to the websocket connections
    console.log('Broadcasting: : '+ JSON.stringify(serverStorage));
    for (var i=0; i < clients.length; i++) {
        //console.log(clients[i]);
        clients[i].sendUTF(JSON.stringify(serverStorage));
    }

    //send a esult to the posting page...
    res.json(JSON.stringify(serverStorage))

});

//app.listen(port);
server.listen(port);

wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {

    console.log('conection..');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin),
    index = clients.push(connection) - 1;
    // we need to know client index to remove them on 'close' event

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {

            // process WebSocket message
            console.log(message.utf8Data)
            console.log('you should go here my son, '+JSON.stringify(serverStorage))

            //whatever message i get i return the storage.. =)
            connection.sendUTF(JSON.stringify(serverStorage));
        }
    });

    connection.on('close', function(connection) {
        // close user connection
        // remove user from the list of connected clients
        clients.splice(index, 1);
        console.log('connections closed')
    });
});