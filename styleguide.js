const express = require('express');
const rewrite = require('express-urlrewrite');
const app = express();
const port = process.env.PORT || 3000;

app.use(rewrite('/', '/src/html/index.html'));

// Rewrite any requests not including "src" to the html directory
app.use(rewrite(/^\/(?!src)(.+)/, '/src/html/$1'));

// Serve static files from root
app.use(express.static(__dirname + '/'));

app.listen(port);

console.log('Styleguide running at http://localhost:' + port);