const mongoose = require('mongoose');
const { Schema } = mongoose;


const librarySchema = new Schema ({
    description :String,
    name : String,
    id_user:String,
    resource:[{
        type:String,
        snnipet:{
            date:String,
            id:String,
            startAt:Number,
            endAt:Number
        }
    }],
    id_tags:Array
});


module.exports = mongoose.model('library',librarySchema);
