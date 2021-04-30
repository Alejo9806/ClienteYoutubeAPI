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
                channelTitle:data[i].snippet.channelTitle
            }
        }
        e.reply('playList', playList);
        console.log(playList);
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
                videoId: data[i].id, 
                date: data[i].snippet.publishedAt,
                playListId:data[i].snippet.playlistId,
                channelVideoTittle: data[i].snippet.videoOwnerChannelTitle,
                videoId:data[i].snippet.resourceId.videoId
            }
            console.log(data[i].contentDetails);
        }
        e.reply('playListItems', playListItems);
    });
});
