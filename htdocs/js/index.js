(function(){
    $(function(){

        var oldUrl = '',
            handleSuccess = function(data){
                var dta = JSON.parse(data);
                if(oldUrl !== dta.wargUrl){

                    //sen ladda iframen om det är en url.
                    if(dta.wargUrl){
                        var start = dta.wargUrl.substring(0,7);
                        if(start.toLowerCase() === 'http://'){
                            $('#theFrame').attr('src',dta.wargUrl);
                        }

                        //se tilla tt jag kollar mot rätt värde
                        oldUrl = data.wargUrl;
                    }

                }
            },
            getWargUrl = function(){
                $.ajax({
                    type: "GET",
                    url: '/api/getWargUrl',
                    success: handleSuccess,
                    error: function () {
                      console.log('fel...');
                    },
                    dataType: 'json'
                });
            };



        //do we have websocket ability?
        if (window.WebSocket){

            // if user is running mozilla then use it's built-in WebSocket
            window.WebSocket = window.WebSocket || window.MozWebSocket;

            var connection = new WebSocket('ws://localhost:8089');

            connection.onopen = function () {
                // connection is opened and ready to use
                console.log('Websocket connection open');

                //now its time to send a message to se if we can get the wargUrl saved.
                connection.send('where shall i go?');

            };

            connection.onerror = function (error) {
                // an error occurred when sending/receiving data
                console.log('ERROR!');
            };

            connection.onmessage = function (message) {
                // try to decode json (I assume that each message from server is json)
                try {
                    var json = JSON.parse(message.data);
                } catch (e) {
                    console.log('This doesn\'t look like a valid JSON: ', message.data);
                    return;
                }
                // handle incoming message

                handleSuccess(message.data);
                //console.log(message.data);

            };
        }else{
            //Ping away...
            setInterval(getWargUrl, 1000);
        }



        $('.closebutton').on('click', function(){
            $('.header').hide();
        });

    });
})();




//connection.send($('#wargUrl').val());