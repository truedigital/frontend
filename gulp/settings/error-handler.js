// === ERROR HANDLING
// ============================================================================

module.exports =
{
    formatError: function( )
    {
        console.log(err);
        var errorString = '[' + err.plugin + ']';
        errorString += ' ' + err.message.plugins.replace("\n",'');
        if(err.fileName)
            errorString += ' in ' + err.fileName;
        if(err.lineNumber)
            errorString += ' on line ' + err.lineNumber;
        return errorString;
    },
    handleError: function( )
    {
        gutil.log(gutil.colors.green(err));
        browserSync.notify(formatError(err), 360000);
        this.emit( 'end' );
    }
};