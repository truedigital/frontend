


Modernizr.load(

    {
        test: Modernizr.input.placeholder,
        nope: ['/Assets/js/polyfills/jquery.placeholder.js'],
        callback: function(url, result, key) {
            $('input, textarea').placeholder();
        }
    }

);