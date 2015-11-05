module.exports.register = function (handlebars) {

    handlebars.registerHelper('getYear', function() {

      var date = new Date();
      return date.getFullYear();

    });

};