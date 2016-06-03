const express = require('express');
const rewrite = require('express-urlrewrite');
const app = express();
const port = process.env.PORT || 3000;

app.use(rewrite('/', '/assets/html/index.html'));

// Rewrite any requests not including "assets" to the html directory
app.use(rewrite(/^\/(?!assets)(.+)/, '/assets/html/$1'));

// Serve static files from root
app.use(express.static(__dirname + '/'));

app.listen(port);

console.log('Styleguide running at http://localhost:' + port);