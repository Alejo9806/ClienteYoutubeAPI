//environment variables
require('dotenv').config({ path: '.env' });
'use strict';

//requires 
const { ipcMain } = require('electron');
const { YOUTUBE_API_KEY } = process.env;
const Axios = require('axios');

//global variables
let userToken;
let search;

//get user information and token
ipcMain.on('user',(e,token,info)=>{
    userToken = token; 
});

//Get search information
ipcMain.on('searchVideo', (e, data) => {
    console.log(data)
    search = data;
});

//Make a search request
ipcMain.on('search',(e)=>{
    let apiSearch ='https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&order=relevance&q='+search+'&key='
    let results = [];
    Axios.get(apiSearch+YOUTUBE_API_KEY,{
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json'
        } 
    }).then((res)=>{
        let data = res.data.items;
        for (let i = 0; i < data.length; i++) {
            results[i] = { 
                title: data[i].snippet.title,
                image: data[i].snippet.thumbnails.medium, 
                channelTitle: data[i].snippet.channelTitle, 
                videoId: data[i].id.videoId, 
                date: data[i].snippet.publishedAt,
                description:data[i].snippet.description
            }
        }
        e.reply('search', results);
    });
});
