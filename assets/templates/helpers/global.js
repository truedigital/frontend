module.exports.register = function (handlebars) {

    handlebars.registerHelper('svgSymbols', function() {

        fs = require('fs');

        var response = fs.readFileSync('./assets/svg/symbol/svg/sprite.symbol.svg', 'utf8', function (err,data) {

          if (err) {
            return console.log(err);
          }

        });

        return new handlebars.SafeString(response);

    });

    handlebars.registerHelper('link', function(text, url, title) {

        text = handlebars.Utils.escapeExpression(text);
        url  = handlebars.Utils.escapeExpression(url);
        title = handlebars.Utils.escapeExpression(title);

        var result = '<a title="' + title + '" href="' + url + '">' + text + '</a>';

        return new handlebars.SafeString(result);

    });

};