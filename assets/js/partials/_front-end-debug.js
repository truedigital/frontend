var debugGrid = (function ($) {

    $('body').append('<div class="grid-debug--trigger">|||</div>')
     .on('click', '.grid-debug--trigger', function(){
        $(this).toggleClass('active');
        $('body').toggleClass('grid--debug');
    });

})(jQuery);