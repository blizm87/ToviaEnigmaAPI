const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// CONFIG
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// ROUTES
app.use('/', require('./routes/index'));

// SERVER
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log('Listening on Port: ' + port);
});
