const mongoose = require('mongoose');
const { Schema } = mongoose;


const resourceSchema = new Schema ({
        type:String,
        snippet:{
            date:String,
            id:String,
            startAt:Number,
            endAt:Number,
            comment:String,
            tags:[]
        }
})
const collectionSchema = new Schema ({
    description :{
        type:String,
        required:false,
        unique: false
    },
    title : {
        type:String,
        required:false,
        unique: true
    },
    id_user:{
        type:String,
        required:true,
        unique: false
    },
    resource:[resourceSchema],
    tags:{
        type:Array,
        required:false,
        unique: false
    },
    
});


module.exports = mongoose.model('collection',collectionSchema);
