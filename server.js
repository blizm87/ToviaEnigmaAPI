require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const graphQLHTTP = require('express-graphql')
const Schema = require('./db/schema.js');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// CONFIG
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true })); // Excludes graphql
app.use(/\/((?!graphql).)*/, bodyParser.json()); // Excludes graphql
app.use(methodOverride('_method'));

// ROUTES
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/graphql', graphQLHTTP({
  schema: Schema,
  graphiql: true,
  pretty: true
}));

// SOCKET
const sockets = require('./routes/sockets')(io);

// SERVER
const port = process.env.PORT || 3001;

http.listen(port, () => {
  console.log('Listening on Port: ' + port);
});
