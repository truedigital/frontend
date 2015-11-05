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

};