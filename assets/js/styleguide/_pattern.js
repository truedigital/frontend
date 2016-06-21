
var pattern = (function ($) {


    var patternClipboard = new Clipboard('[data-markup-copy]', {
        text: function(trigger) {
            var $code = $(trigger).siblings('[data-markup]').find('code');
            return $code.text();
        }
    });

    patternClipboard.on('success', function(e) {
        $(e.trigger).addClass('is-success').find('use').attr('xlink:href', '#copy-success');

        resetIcon(e.trigger);
    });

    patternClipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });

    function resetIcon(trigger) {
        setTimeout(function () {
            $(trigger).removeClass('is-success').find('use').attr('xlink:href', '#copy');
        }, 3000);
    }


})(jQuery);
