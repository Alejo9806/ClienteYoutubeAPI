
//requires 
const Collection = require('../model/collection');
const Tag = require('../model/tag');
const User = require('../model/user');
const { ipcMain } = require('electron');

//global variables
let userToken;
let userInfo;


//get user information and token
ipcMain.on('user',(e,token,info)=>{
    userToken = token; 
    userInfo = info;
});


ipcMain.on('collection',async (e)=>{
    const user = await  User.findOne({ email: userInfo.email });
    const collection = await Collection.aggregate([{$match:{id_user: ""+user._id}},{$project:{'title':1,'description':1}}])
    e.reply('collection', collection);
});

ipcMain.on('new-collection',async (e,newCollection,chosenTags)=>{
    console.log(newCollection);
    let collection = new Collection();  
    const user = await User.findOne({ email: userInfo.email });
    console.log(user);
    collection.title = newCollection.title;
    collection.description = newCollection.description;
    collection.id_user = user._id;
    chosenTags.forEach(chosenTag=> {
        collection.tags.push(chosenTag);
    });
    collection  = await collection.save();
});

ipcMain.on('new-tag',async (e,newTag)=>{
    let mss; 
    let tag = new Tag();
    const user = await User.findOne({ email: userInfo.email });
    const existsTag = await Tag.findOne({tag:newTag,id_user:user._id});
    console.log(existsTag);
    if (!existsTag) {
            tag.id_user = user._id;
            tag.tag = newTag;
            tag = await tag.save();
            mss = "Guardado correctamente"
            e.reply('new-tag',mss);
    }else{
            mss = "El tag ya existe lo hemos seleccionado."
            e.reply('new-tag',mss);
    }
});

ipcMain.on('search-tag',async (e,searchTag)=>{
    console.log(searchTag);
    const regularExpr = new RegExp(searchTag);
    const user = await User.findOne({ email: userInfo.email });
    const tags = await Tag.find({tag:{ $regex: regularExpr , $options: 'i'},id_user:user._id}).limit(5);
    e.reply('search-tag',tags);
});

ipcMain.on('video-collection-modal',(e,id,date)=>{
    e.reply('video-collection-modal',id,date);
})

ipcMain.on('playList-collection-modal',(e,id,date)=>{
    e.reply('playList-collection-modal',id,date);
})


ipcMain.on('new-video-collection',async (e,video,collectionTitle,chosenTags)=>{
    console.log(video);
    console.log(collectionTitle);
    let mss;
    let collection = await Collection.findOne({title:collectionTitle});  
    collection.resource.push({ 
        type:video.type,
        snnipet:{ 
            date : video.date,
            id: video.id,
            startAt: video.startAt,
            endAt:video.endAt,
            comment:video.comment,
        }
    });

    console.log(collection);
    try {
        mss = "Video guardado correctamente"
        collection = await collection.save();
        index = collection.resource.length-1;
        chosenTags.forEach(chosenTag=>{
            collection.resource[index].snnipet.tags.push(chosenTag);
        })
        try {
            collection = await collection.save();
            console.log(collection);
            e.reply('new-video-collection',mss);
        } catch (error) {
            mss = "Ocurrio un error no se pudo guardar el video"
            e.reply('new-video-collection',mss);
        }
        
    } catch (error) {
        mss = "Ocurrio un error no se pudo guardar el video"
        e.reply('new-video-collection',mss);
    }

})

ipcMain.on('new-playList-collection', async (e,playList,collectionTitle,chosenTags)=>{
    console.log(playList);
    console.log(collectionTitle);
    let mss;
    let collection = await Collection.findOne({title:collectionTitle}); 
    collection.resource.push({ 
        type:playList.type,
        snnipet:{ 
            date : playList.date,
            id: playList.id,
            comment: playList.comment,
        }
    });
    console.log(collection);
    try {
        mss = "Playlist guardada correctamente"
        collection = await collection.save();
        index = collection.resource.length-1;
        chosenTags.forEach(chosenTag=>{
            collection.resource[index].snnipet.tags.push(chosenTag);
        })
        try {
            collection = await collection.save();
            console.log(collection);
            e.reply('new-playList-collection',mss);
        } catch (error) {
            mss = "Ocurrio un error no se pudo guardar la playList"
            e.reply('new-playList-collection',mss);
        }
        
    } catch (error) {
        mss = "Ocurrio un error no se pudo guardar la playList"
        e.reply('new-playList-collection',mss);
    }
})