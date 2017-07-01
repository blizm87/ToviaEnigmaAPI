const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// CONFIG
app.use(cors())
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// ROUTES
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/app', require('./routes/app'));

// SOCKET
const sockets = require('./routes/sockets')(io);

// SERVER
const port = process.env.PORT || 3001;

http.listen(port, () => {
  console.log('Listening on Port: ' + port);
});
