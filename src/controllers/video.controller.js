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
ipcMain.on('video', (e, id , starAt, endAt) => {
    console.log(id , starAt, endAt)
    idVideo = id;
    starAtVideo = starAt;
    endAtVideo = endAt;
});

//Send the id of the specific video to the customer
ipcMain.on('getVideo', (e) => {
    apiCallVideo = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics%2Cstatus&id="+idVideo+"&key=";
    let relatedVideos = [];
    let video;
    Axios.get(apiCallVideo + YOUTUBE_API_KEY).then((res) =>{
        let data = res.data.items[0];
        video = {
            id : data.id,
            publishedAt : data.snippet.publishedAt,
            title : data.snippet.title,
            description : data.snippet.description,
            channelId : data.snippet.channelId,
            channelTitle : data.snippet.channelTitle,
            tags : data.snippet.tags,
            categoryId : data.snippet.categoryId,
            duration : data.contentDetails.duration,
            publicStatsViewable : data.status.publicStatsViewable,
            viewCount : data.statistics.viewCount,
            likeCount : data.statistics.likeCount,
            dislikeCount : data.statistics.dislikeCount,
            commentCount : data.statistics.commentCount
        }
        //* related video
        apiRelatedVideo = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=60&order=viewCount&q="+video.title+"&safeSearch=moderate&key=";
        Axios.get(apiRelatedVideo + YOUTUBE_API_KEY).then((res)=>{
            let dataRelated = res.data.items;
            for (let i = 0; i < dataRelated.length; i++) {
                relatedVideos[i] = { 
                    title: dataRelated[i].snippet.title,
                    image: dataRelated[i].snippet.thumbnails.medium, 
                    channelTitle: dataRelated[i].snippet.channelTitle, 
                    videoId: dataRelated[i].id.videoId, 
                    date: dataRelated[i].snippet.publishedAt,
                    description: dataRelated[i].snippet.description,
                    channelId: dataRelated[i].snippet.channelId, 
                }
            }
            e.reply('getVideo', video,starAtVideo,endAtVideo,relatedVideos);
        })
        
    })
   
});
