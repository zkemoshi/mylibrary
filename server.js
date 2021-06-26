if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

// Routes
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

// Middlewares
app.use(expressLayouts);
app.use(express.static('public'));

// Route Middleware
app.use('/', indexRouter);
app.use('/authors', authorRouter);

// Database Connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Mongoose..'));

app.listen(process.env.PORT || 3000);
