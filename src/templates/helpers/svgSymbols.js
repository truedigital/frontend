module.exports = function(){

  fs = require('fs');

  var response = fs.readFileSync('./src/svg/symbol/svg/sprite.symbol.svg', 'utf8', function (err,data) {

    if (err) {
      return console.log(err);
    }

  });

  return response;

};