
var tabs = (function ($) {

    var activeClass = 'is-active';

    // SET INITIAL STATE
    $('[data-tabs]').each(function(){
        var $this = $(this);
        var activeTabIndex = $this.data('tabs-active') || 0;
        togglePanes($this, activeTabIndex);
    });


    // TAB CLICK
    $('[data-tabs]').on('click', '[data-tab]:not(.is-active)', function(){
       var $this = $(this);
       var $tabs = $this.closest('[data-tabs]');
       var tabIndex = $this.index();
       togglePanes($tabs, tabIndex);
    });


    function togglePanes($tabs, paneIndex){
        var $nav = $tabs.find('[data-tab-nav]');
        var $panes = $tabs.find('[data-tab-panes]');

        // Active classes
        $nav
            .find('[data-tab]:eq('+ paneIndex +')').addClass(activeClass)
            .siblings().removeClass(activeClass);

        // Toggle Panes
        $panes
            .find('[data-tab-pane]:eq('+ paneIndex +')').show()
            .siblings().hide();
    }



})(jQuery);
