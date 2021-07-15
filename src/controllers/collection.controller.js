
//requires 
const Collection = require('../model/collection');
const Tag = require('../model/tag');
const User = require('../model/user');
const { ipcMain } = require('electron');
const { YOUTUBE_API_KEY } = process.env;
const Axios = require('axios');


//global variables
let titleCollection;
let userInfo;
let userToken;

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

ipcMain.on('video-collection-modal',(e,id,date,time)=>{
    e.reply('video-collection-modal',id,date,time);
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
        snippet:{ 
            date : video.date,
            id: video.id,
            startAt: video.startAt,
            endAt:video.endAt,
            comment:video.comment,
            tags:chosenTags
        }
    });

    console.log(collection);
    try {
        mss = "Video guardado correctamente"
        collection = await collection.save();
        console.log(collection);
        e.reply('new-video-collection',mss);
    } catch (error) {
        mss = "Ocurrio un error no se pudo guardar el video"
        e.reply('new-video-collection',mss);
    }
})


ipcMain.on('new-channel-collection',async (e,channel,collectionTitle,chosenTags)=>{
    console.log(channel);
    console.log(collectionTitle);
    let mss;
    let collection = await Collection.findOne({title:collectionTitle});  
    collection.resource.push({ 
        type:channel.type,
        snippet:{ 
            date :channel.date,
            id: channel.id,
            comment:channel.comment,
            tags:chosenTags
        }
    });

    console.log(collection);
    try {
        mss = "Playlist guardada correctamente"
        collection = await collection.save();
        console.log(collection);
        e.reply('new-channel-collection',mss);
    } catch (error) {
        mss = "Ocurrio un error no se pudo guardar el video"
        e.reply('new-channel-collection',mss);
    }
})

ipcMain.on('new-playList-collection', async (e,playList,collectionTitle,chosenTags)=>{
    console.log(playList);
    console.log(collectionTitle);
    let mss;
    let collection = await Collection.findOne({title:collectionTitle}); 
    collection.resource.push({ 
        type:playList.type,
        snippet:{ 
            date : playList.date,
            id: playList.id,
            comment: playList.comment,
            tags:chosenTags
        }
    });
    console.log(collection);
    try {
        mss = "Playlist guardada correctamente"
        collection = await collection.save();
        console.log(collection);
        e.reply('new-playList-collection',mss);
    } catch (error) {
        mss = "Ocurrio un error no se pudo guardar la playList"
        e.reply('new-playList-collection',mss);
    }

})


ipcMain.on('get-edit-collection', async (e,title)=>{
    const getCollection = await Collection.findOne({title: title},{'title':1,'tags':1,'description':1,'_id':1}); 
    console.log(getCollection);
    e.reply('get-edit-collection',getCollection);
})

ipcMain.on('get-collection', (e,title)=>{
    titleCollection = title;

});

ipcMain.on('edit-collection',async (e,editCollection,chosenTagsEdit)=>{
    console.log(editCollection,chosenTagsEdit)
    let collection = await Collection.findOne({title: titleCollection});
    collection.title = editCollection.title;
    collection.description = editCollection.description;
    collection.tags = chosenTagsEdit;
    try {
        collection = await collection.save();
    } catch (error) {
        console.log(error)
    }
});

ipcMain.on('get-collection-select', async (e) =>{
    let videos =[];
    let playList=[];
    let channel=[];
    let elementsVideo = [];
    let elementsPlaylist = [];
    let elementsChannel = [];
    let  chainVideo = "";
    let chainPlaylist = "";
    let chainChannel = "";
    console.log(titleCollection);
    const getCollection = await Collection.findOne({title: titleCollection}); 
    getCollection.resource.forEach((element,i) =>{
        if (element.type == 'VIDEO') {
            elementsVideo.push({
                id:element.snippet.id,
                startAt:element.snippet.startAt,
                endAt:element.snippet.endAt,
                tags:element.snippet.tags,
                comment:element.snippet.comment,
            });
            chainVideo += '&id='+element.snippet.id;
        }else if (element.type == 'PLAYLIST') {
            elementsPlaylist.push({
                id:element.snippet.id,
                tags:element.snippet.tags,
                comment:element.snippet.comment,
            })
            chainPlaylist += '&id='+element.snippet.id;
        }else if (element.type == 'CHANNEL') {
            elementsChannel.push({
                id:element.snippet.id,
                tags:element.snippet.tags,
                comment:element.snippet.comment,
            })
            chainChannel += '&id='+element.snippet.id;
        }
    })
            let apiCallVideo = 'https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics%2Cstatus'+chainVideo+'&key=';
            Axios.get(apiCallVideo + YOUTUBE_API_KEY,{
                headers: {
                    Host:'www.googleapis.com',
                    Authorization: 'Bearer '+userToken.access_token,
                    Accept:'application/json'
                } 
            }).then((res)=>{
                let data = res.data.items;
                for (let i = 0; i < data.length; i++) {
                    elementsVideo.forEach(element => {
                        if(element.id ==data[i].id){
                            videos.push({
                                startAt:element.startAt,
                                endAt:element.endAt,
                                tags:element.tags,
                                comment:element.comment,
                                title: data[i].snippet.title,
                                image: data[i].snippet.thumbnails.medium, 
                                channelTitle: data[i].snippet.channelTitle, 
                                videoId: data[i].id, 
                                date: data[i].snippet.publishedAt,
                                channelId: data[i].snippet.channelId,
                                duration : data[i].contentDetails.duration,
                                publicStatsViewable : data[i].status.publicStatsViewable,
                                viewCount : data[i].statistics.viewCount,
                                likeCount : data[i].statistics.likeCount,
                                dislikeCount : data[i].statistics.dislikeCount,
                                commentCount : data[i].statistics.commentCount
                            })
                        }  
                    });
                       
                    e.reply('get-collection-select',videos,playList,channel)
                }
            }).catch((error) =>{
            });
            let apiCallPlayList = 'https://youtube.googleapis.com/youtube/v3/playlists?part=snippet'+chainPlaylist+'&key='
            Axios.get( apiCallPlayList + YOUTUBE_API_KEY,{
                headers: {
                    Host:'www.googleapis.com',
                    Authorization: 'Bearer '+userToken.access_token,
                    Accept:'application/json'
                } 
            }).then((res)=>{
                let data = res.data.items;
                for (let i = 0; i < data.length; i++) {
                    elementsPlaylist.forEach(element => {
                        if(element.id ==data[i].id){
                            playList.push({
                                tags:element.tags,
                                comment:element.comment,
                                title: data[i].snippet.title,
                                image: data[i].snippet.thumbnails.medium, 
                                channelTitle: data[i].snippet.channelTitle, 
                                channelId:data[i].snippet.channelId,
                                id:data[i].id,
                                date: data[i].snippet.publishedAt,
                            })
                        }  
                    });
                      
                }     
                e.reply('get-collection-select',videos,playList,channel)
            }).catch((error) =>{
            });
            let apiCallChannel = 'https://youtube.googleapis.com/youtube/v3/channels?part=snippet'+chainChannel+'&key='
            Axios.get( apiCallChannel + YOUTUBE_API_KEY,{
                headers: {
                    Host:'www.googleapis.com',
                    Authorization: 'Bearer '+userToken.access_token,
                    Accept:'application/json'
                } 
            }).then((res)=>{
                let data = res.data.items;
                for (let i = 0; i < data.length; i++) {
                    elementsChannel.forEach(element => {
                        if(element.id ==data[i].id){
                            channel.push({
                                id:element.id,
                                tags:element.tags,
                                comment:element.comment,
                                title: data[i].snippet.title,
                                image: data[i].snippet.thumbnails.default.url, 
                                date: data[i].snippet.publishedAt,
                            })
                        }  
                    });
                                     
                }     
                e.reply('get-collection-select',videos,playList,channel)
            }).catch((error) =>{
            })
})

ipcMain.on('delete-video-playList-channel',async (e,id)=>{
    const collection = await Collection.findOne({title: titleCollection}); 
    console.log(collection.resource[0].snippet);
    collection.resource.map((element,i) => { 
        if(element.snippet.id == id ){
            collection.resource.splice(i,1);
        }
    })
    await collection.save();
    e.reply('delete-video-playList-channel');
})

ipcMain.on('edit-video-collection', async (e,id,VideoCollection,chosenTags)=>{
    console.log(chosenTags);
    const collection = await Collection.findOne({title: titleCollection}); 
    collection.resource.map((element,i) => { 
        if(element.snippet.id == id ){
            collection.resource[i].snippet.comment = VideoCollection.comment;
            if(VideoCollection.startAt != null){
                collection.resource[i].snippet.startAt = VideoCollection.startAt;
            }
            if(VideoCollection.endAt != null){
                collection.resource[i].snippet.endAt = VideoCollection.endAt;
            }
            collection.resource[i].snippet.tags = chosenTags;         
            console.log(collection.resource[i].snippet.tags)
        }
           
    })
    await collection.save();
    e.reply('edit-video-playlist-channel-collection');
})

ipcMain.on('edit-playlist-collection', async (e,id,playListCollection,chosenTagsEditPlaylist)=>{
    console.log(chosenTagsEditPlaylist);
    const collection = await Collection.findOne({title: titleCollection}); 
    collection.resource.map((element,i) => { 
        if(element.snippet.id == id ){
            collection.resource[i].snippet.comment = playListCollection.comment;
            collection.resource[i].snippet.tags = chosenTagsEditPlaylist;         
            console.log(collection.resource[i].snippet.tags)
        }
           
    })
    await collection.save();
    e.reply('edit-video-playlist-channel-collection');
})

ipcMain.on('edit-channel-collection', async (e,id,channelCollection,chosenTagsEditChannel) =>{
    const collection = await Collection.findOne({title: titleCollection}); 
    collection.resource.map((element,i) => { 
        if(element.snippet.id == id ){
            collection.resource[i].snippet.comment = channelCollection.comment;
            collection.resource[i].snippet.tags = chosenTagsEditChannel;         
            console.log(collection.resource[i].snippet.tags)
        }
           
    })
    await collection.save();
    e.reply('edit-video-playlist-channel-collection');
})