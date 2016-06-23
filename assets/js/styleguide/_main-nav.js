var mainNav = (function ($) {

    var $nav = $('.main-nav');

    var mobileMaxWidth = 739;


    // OPEN ON PAGE LOAD
    var page = $('body').data('page');
    var $selectedNav = $nav.find('li[data-nav="'+ page +'"]');

    if($selectedNav.closest('.main-nav__dropdown').length){
        var $dropdown = $selectedNav.closest('.main-nav__dropdown')
        $dropdown.css('display', 'block').closest('.main-nav__primary').addClass('is-active');
    }

    $('.main-nav__primary').on('click', '> a', function(e){
        if ($(this).next('.main-nav__dropdown').length){
            e.preventDefault();
            toggleNav($(this).next('.main-nav__dropdown'));
        }
    });


    function toggleNav($dropdown){
        $dropdown.closest('.main-nav__primary').toggleClass('is-active');

        if ($dropdown.is(':hidden')){
            $dropdown.velocity('slideDown', { duration: 250 });
        }
        else {
            $dropdown.velocity('slideUp', { duration: 250 });
        }
    }


    // CUSTOM SCROLLBAR

    // Plugin acts funny with flexbox controlled height.
    // Need to set max-height and trigger update for it to behave

    function setNavMaxHeight(){
        var viewportHeight = $(window).height();
        var sideColRowHeight = $('.side-col__row').height();
        var navHeight = viewportHeight - sideColRowHeight;
        $nav.css('max-height', navHeight).mCustomScrollbar('update');
    }
    setNavMaxHeight();

    $(window).smartresize(function(){
        setNavMaxHeight();
    });


    $nav.mCustomScrollbar({
        theme: "minimal",
        scrollbarPosition: "outside",
        scrollIntertia: 1000,
        mouseWheel:{ preventDefault: true }
    });




    // === MOBILE
    $('.nav-toggle').on('click', function(){
        var $nav = $('.main-nav__wrap');
        if ($nav.is(':visible')){
            $nav.velocity('slideUp', {
                duration: 300,
                easing: [ 0.215, 0.61, 0.355, 1 ]
            });
        }
        else {
            $nav.velocity('slideDown', {
                duration: 300,
                easing: [ 0.215, 0.61, 0.355, 1 ]
            });
        }

        $('.hamburger').toggleClass('is-active');







    });




})(jQuery);
