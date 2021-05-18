const mongoose = require('mongoose');
const { Schema } = mongoose;


const tagSchema = new Schema ({
    tag :{
        type:String,
        required:true
    },
    id_user:{
        type:String,
        required:true,
        unique: false
    }
});

module.exports = mongoose.model('tag',tagSchema);
