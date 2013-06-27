(function(){
    $(function(){

        var oldUrl = '';

        var getWargUrl = function(){
            $.ajax({
                type: "GET",
                url: '/storedData',
                success: function(data){
                    if(oldUrl !== data.wargUrl){

                        //sen ladda iframen om det är en url.
                        if(data.wargUrl){
                            var start = data.wargUrl.substring(0,7);
                            if(start.toLowerCase() === 'http://'){
                                $('#theFrame').attr('src',data.wargUrl);
                            }

                            //se tilla tt jag kollar mot rätt värde
                            oldUrl = data.wargUrl;
                        }

                    }
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