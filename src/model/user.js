const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema ({
    email :{
        type: String,
        required:true,
        unique: true
    },
    name : {
        type: String,
        required:true,
        unique: false
    },
    verified_email:{
        type: Boolean,
        required:false,
        unique: false
    }
});


module.exports = mongoose.model('users',userSchema);
