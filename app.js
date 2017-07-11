const express          = require('express');
const bodyParser       = require('body-parser');
const expressValidator = require('express-validator');
const routes           = require('./routes/routes.js');
const mongoose         = require('mongoose');
const path             = require("path");
const app              = express();
const morgan           = require('morgan');

// Morgan to log router activity
if (app.get('env') == 'production') {
  app.use(morgan('common', {
    skip: function(req, res) {
      return res.statusCode < 400
    },
    stream: __dirname + '/../morgan.log'
  }));
} else {
  app.use(morgan('dev'));
};

// MongoDB access
const nodeEnv = process.env.NODE_ENV || "development";
const config = require("./config.json")[nodeEnv];

mongoose.connect(config.mongoURL,{useMongoClient:true});

// Set Port
app.set('port', (process.env.PORT || 8000));

// Serve static files to server
app.use(express.static(path.join(__dirname, "public")));

// Body parser and validator implementation
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

// Routes
app.use(routes);

// Open Port
if (require.main === module) {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
};

module.exports = app;
