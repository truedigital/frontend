module.exports.register = function (handlebars) {

    handlebars.registerHelper('svgHelper', function(url) {


    });

    handlebars.registerHelper('link', function(text, url) {

        text = handlebars.Utils.escapeExpression(text);
        url  = handlebars.Utils.escapeExpression(url);

        var result = '<a href="' + url + '">' + text + '</a>';

        return new handlebars.SafeString(result);

    });

};