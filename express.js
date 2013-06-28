

var http = require('http');
var path = require('path');
var fs = require('fs');
qs = require('querystring');

var counter = 0,
    port = 8088,
    serverStorage = {};



http.createServer(function (request, response) {

    var servePage = function(filePath){
        console.log('Trying to get: ' + filePath + ' for URL: ' + request.url);


        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }

        path.exists(filePath, function(exists) {

            if (exists) {
                fs.readFile(filePath, function(error, content) {
                    if (error) {
                        response.writeHead(500);
                        response.end();
                    }
                    else {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    }
                });
            }
            else {
                response.writeHead(404);
                response.end();
            }
        });
    }

    var serveStoredData = function() {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(serverStorage), 'utf-8');
    }

    var storeParameters = function(params) {
        //sätt warg remote viewing url om vi får in ett värde!
        if(params['wargUrl']){
            serverStorage['wargUrl'] = params['wargUrl'];
        }

        console.log('stored data:');
        console.log(serverStorage);
    }

    console.log('START ------------------------------------------------');

    var filePath = '',
        url = '',
        query_string = '',
        query_array = [],
        params = {};

    // hantera /, slutar strängen på en /

    if(request.url.substr(request.url.length-1,request.url.length) === '/'){
        url = request.url+'index.html';
    }else{
        url = request.url;
    }

    //hantera inparametrar.
    //POST asynkront...
    if(request.method=='POST') {
        var body='';
        request.on('data', function (data) {
            body +=data;
        });
        request.on('end',function(){

            var POST =  qs.parse(body);
            console.log('POST in data:');
            console.log(POST);
            params = POST;

            storeParameters(params);
            servePage('./htdocs' + url);

        });
        //GET synkront...
    }else if(request.method=='GET') {
        //har vi en query sträng?
        //Nicklas fulkod går att göra mycket bättre...
        if(url.indexOf("?")>0){
            //sug ut query strängen.
            query_string = url.substr(url.indexOf("?")+1,url.length);
            //console.log('Query string: '+query_string);

            //trimma bort den från url'en
            url = url.substr(0,url.indexOf("?"));

            //splitta dem till 'namn=värde'
            query_array = query_string.split("&");

            //stoppa in dem som key/value i mit fina param obj.
            for(var i=0; i < query_array.length; i++){
                //console.log('query_array['+i+']: '+query_array[i]);
                //key
                var key = query_array[i].substr(0,query_array[i].indexOf("="));
                //value
                var value = query_array[i].substr(query_array[i].indexOf("=")+1,query_array[i].length);

                //lägg till dem till param
                params[key] = value;
            }

            console.log('GET in data:');
            console.log(params);
        }

        storeParameters(params);

        //om det är ett API anropp:
        if(url === '/storedData'){
            serveStoredData();
        }else{
            servePage('./htdocs' + url);
        }


    }



}).listen(port);

console.log('Server running at http://localhost:'+port+'/');