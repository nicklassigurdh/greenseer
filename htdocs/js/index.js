(function(){
    $(function(){

        var oldUrl = '';

        var getWargUrl = function(){
            $.ajax({
                type: "GET",
                url: '/api/getWargUrl',
                success: function(data){
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
                error: function () {
                  console.log('fel...');
                },
                dataType: 'json'
            });
        }

        setInterval(getWargUrl, 1000);

        $('.closebutton').on('click', function(){
            $('.header').hide();
        });

    });
})();