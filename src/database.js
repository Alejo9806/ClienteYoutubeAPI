//environment variables
const { URI_L  } = require('./config/keys');
const mongoose = require('mongoose');
require('dotenv').config({path:'.env'});


mongoose.connect(URI_L,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(db => console.log('Database is connected'))
    .catch(err => console.error(err));