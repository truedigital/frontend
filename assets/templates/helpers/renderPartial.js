module.exports.register = function (handlebars) {

    handlebars.registerHelper('renderPartial', function(name) {

        var fs = require('fs'),
            path = require('path'),
            fn,
            template = '';

        fs.readdirSync('./assets/templates/partials').forEach(function(name) {

            var filePath = path.join('./assets/templates/partials', name);
            var stat = fs.statSync(filePath);

            if ( stat.isFile() ) {

              var partialName = path.basename( name, path.extname(name) );

              template = handlebars.partials[partialName];

              if (!template) {
                  return "Partial not loaded";
              }

              return new handlebars.SafeString( template );

            }
        });

    });

};