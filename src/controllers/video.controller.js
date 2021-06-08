//environment variables
require('dotenv').config({ path: '.env' });
'use strict';

//requires 
const { ipcMain } = require('electron');
const { YOUTUBE_API_KEY } = process.env;
const Axios = require('axios');

//global variables
let idVideo;
let starAtVideo;
let endAtVideo;
let date;

//Use api to get list of most popular videos
ipcMain.on('listVideos', (e) => {
    let apicall = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=60&key="
    let listVideos = [];
    Axios.get(apicall + YOUTUBE_API_KEY).then((res) => {
        let data = res.data.items
        for (let i = 0; i < data.length; i++) {
            listVideos[i] = { 
                title: data[i].snippet.title,
                image: data[i].snippet.thumbnails.medium, 
                channelTitle: data[i].snippet.channelTitle, 
                videoId: data[i].id, 
                date: data[i].snippet.publishedAt, 
                channelId: data[i].snippet.channelId
            }
        }
        e.reply('listVideos', listVideos);
    });
});


//Get id of the specific video
ipcMain.on('video', (e, id , starAt, endAt, dates) => {
    console.log(id , starAt, endAt, dates)
    idVideo = id;
    starAtVideo = starAt;
    endAtVideo = endAt;
    date = dates;
});

//Send the id of the specific video to the customer
ipcMain.on('getVideo', (e) => {
    e.reply('getVideo', idVideo,starAtVideo,endAtVideo,date);
});
