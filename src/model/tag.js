const mongoose = require('mongoose');
const { Schema } = mongoose;


const tagSchema = new Schema ({
    tag : String,
});

module.exports = mongoose.model('tag',tagSchema);
