// === ERROR HANDLING
// ============================================================================

var gutil = require('gulp-util'),
    browserSync = require('browser-sync');

// function formatError( err ) {
//   console.log(err);
//   var errorString = '[' + err.plugin + ']';
//   errorString += ' ' + err.message.plugins.replace("\n",'');
//   if(err.fileName)
//       errorString += ' in ' + err.fileName;
//   if(err.lineNumber)
//       errorString += ' on line ' + err.lineNumber;
//   return errorString;
// }

module.exports =
{
    handleError: function( err )
    {
        gutil.log( gutil.colors.green(err) );
        browserSync.notify( err , 360000);
        this.emit( 'end' );
    }
};