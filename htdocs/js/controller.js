(function(){
    $(function(){

        $('#postIt').on('click',function(){

            console.log('post to the server')

            $.ajax({
                type: "POST",
                url: '/api/setWargUrl/',
                data: {'wargUrl' : $('#wargUrl').val() },
                success: function(data){
                    console.log('returned data: '+data);
                },
                dataType: 'html'
            });
        })

        $('#wargUrl').on('keypress', function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if(code == 13) { //Enter keycode
                $('#postIt').click();
            }
        });

        $('#exampleUrl').val('http://'+location.host+'/')

    });
})();