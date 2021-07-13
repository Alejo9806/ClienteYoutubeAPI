//environment variables
require('dotenv').config({ path: '.env' });
'use strict';

//requires 
const { ipcMain } = require('electron');
const { YOUTUBE_API_KEY } = process.env;
const Axios = require('axios');

//global variables
let userToken;
let idPlaylist;

//get user information and token
ipcMain.on('user',(e,token,info)=>{
    userToken = token; 
});

//Request to get all the user's playlists
ipcMain.on('playList',(e)=>{
    
    let apiPlayList = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&key="
    let playList = [];
    Axios.get(apiPlayList + YOUTUBE_API_KEY,{
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json'
        } 
    }).then((res)=>{
        let data = res.data.items;
        for(let i =0; i<data.length;i++){
            playList[i] = {
                title:data[i].snippet.title,
                image:data[i].snippet.thumbnails.medium,
                id:data[i].id,
                channelId:data[i].snippet.channelId,
                channelTitle:data[i].snippet.channelTitle,
                date:data[i].snippet.publishedAt
            }
        }
        e.reply('playList', playList);
    });
});

//Get specific playlist id
ipcMain.on('playlisId',(e,id)=>{
    idPlaylist = id;
    e.reply('playlisId',id);
});

//Consume api to get all items in the playlist
ipcMain.on('playListItems',(e,id)=>{
    let apiPLaylistItems = 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&part=contentDetails&playlistId='+idPlaylist+'&key='
    let playListItems = [];
    Axios.get(apiPLaylistItems + YOUTUBE_API_KEY,{
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json'
        } 
    }).then((res)=>{
        let data = res.data.items
        for(let i =0; i<data.length;i++){
            playListItems[i] = {
                title: data[i].snippet.title, 
                image: data[i].snippet.thumbnails.medium, 
                channelTitle: data[i].snippet.channelTitle, 
                idElementPlaylist: data[i].id, 
                date: data[i].snippet.publishedAt,
                playListId:data[i].snippet.playlistId,
                channelVideoTittle: data[i].snippet.videoOwnerChannelTitle,
                videoId:data[i].snippet.resourceId.videoId,
                videoOwnerChannelId: data[i].snippet.videoOwnerChannelId,
                channelId:data[i].snippet.channelId
            }
        }
        e.reply('playListItems', playListItems);
    });
});

//* New playlist
ipcMain.on('new-playList',(e,newPlaylist)=>{
    let apiCallAddPlaylist = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2C%20status&key="
    console.log(newPlaylist)
    let resource ={
        snippet: {
            title: newPlaylist.title,
            description: newPlaylist.description
        },
        status: {
            privacyStatus: newPlaylist.status
        }
    };
    Axios.post(apiCallAddPlaylist + YOUTUBE_API_KEY,resource,{  
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json',  
        }
    }).then((res)=>{
        console.log(res)
        mss = "Se creo la playlist correctamente"
        e.reply('new-playList',mss)
    },(error)=>{
        console.log(error)
        mss = "Ocurrio un error no se pudo crear la playlist, itentalo mas tarde."
        e.reply('new-playList',mss)
    }) 
})

//*Delete playlist

ipcMain.on('delete-playList',(e,id)=>{
    let apiCallDeletePlaylist = "https://youtube.googleapis.com/youtube/v3/playlists?id="+id+"&key="
    Axios.delete(apiCallDeletePlaylist + YOUTUBE_API_KEY, {  
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json',  
        }
    }).then((res)=>{
        mss = "Borrado"
        e.reply('delete-playList',mss)
    },(error)=>{
        console.log(error);
        mss = "Ocurrio un error no se pudo borrar la playlist, itentalo mas tarde."
        e.reply('delete-playList',mss)
    })  
})

//*Information to add video to playlist

ipcMain.on('video-playlist-modal',(e,id,date)=>{
    e.reply('video-playlist-modal',id,date);
})

ipcMain.on('new-playlist-with-video',(e,newPlaylist,id) =>{
    let apiCallAddPlaylist = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2C%20status&key="
    let apiCallAddVideo = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&key="; 
    console.log(newPlaylist,id)
    let resource ={
        snippet: {
            title: newPlaylist.title,
            description: newPlaylist.description
        },
        status: {
            privacyStatus: newPlaylist.status
        }
    };
    
    //* Create playlist and add video
    Axios.post(apiCallAddPlaylist + YOUTUBE_API_KEY,resource,{  
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json',  
        }
    }).then((res)=>{
        mss = "Se creo la playlist correctamente"
        let resourceVideoPlaylist= {
            snippet: {
                playlistId: res.data.id,
                resourceId: {
                  "videoId": id,
                  "kind": "youtube#video"
                },
                "position": 0
              }
        }
        Axios.post(apiCallAddVideo+ YOUTUBE_API_KEY,resourceVideoPlaylist,{  
            headers: {
                Host:'www.googleapis.com',
                Authorization: 'Bearer '+userToken.access_token,
                Accept:'application/json',  
            }
        }).then((res)=>{
            e.reply('new-playlist-with-video',mss)
        },(error)=>{
            console.log(error);
            mss = "Ocurrio un error no se pudo añadir el video a la playlist, itentalo mas tarde."
            e.reply('new-playlist-with-video',mss)
        })  
    },(error)=>{
        console.log(error)
        mss = "Ocurrio un error no se pudo crear la playlist, itentalo mas tarde."
        e.reply('new-playlist-with-video',mss)
    }) 
})

//* add video to playlist 

ipcMain.on('add-video-to-playlist',(e,id,idVideo,box)=>{
    let apiCallAddVideo = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&key="; 
    let resourceVideoPlaylist= {
        snippet: {
            playlistId: id,
            resourceId: {
              "videoId": idVideo,
              "kind": "youtube#video"
            },
            "position": 0
          }
    }
    Axios.post(apiCallAddVideo+ YOUTUBE_API_KEY,resourceVideoPlaylist,{  
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json',  
        }
    }).then((res)=>{
        mss = "Video añadido a playlist"
        let idElementPlaylist = res.data.id;
        e.reply('add-video-to-playlist',mss,idElementPlaylist,box)
    },(error)=>{
        console.log(error);
        mss = "Ocurrio un error no se pudo añadir el video a la playlist, itentalo mas tarde."
        e.reply('add-video-to-playlist',mss)
    })  
})

//* delete video from playlist

ipcMain.on('delete-video-from-playlist',(e,id)=>{
    let apiCallDeleteVideoplayList = "https://youtube.googleapis.com/youtube/v3/playlistItems?id="+id+"&key="
    Axios.delete(apiCallDeleteVideoplayList + YOUTUBE_API_KEY, {  
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json',  
        }
    }).then((res)=>{
        mss = "Borrado"
        e.reply('delete-video-from-playlist',mss)
    },(error)=>{
        console.log(error);
        mss = "Ocurrio un error no se pudo borrar el video de la playlist, itentalo mas tarde."
        e.reply('delete-video-from-playlist',mss)
    })  
    
})
