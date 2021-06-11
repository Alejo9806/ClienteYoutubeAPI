//environment variables
require('dotenv').config({ path: '.env' });
'use strict';

//requires 
const { ipcMain } = require('electron');
const { YOUTUBE_API_KEY } = process.env;
const Axios = require('axios');

//global variables
let userInfo;
let userToken;
let idChannel;

//get user information and token
ipcMain.on('user',(e,token,info)=>{
    userToken = token; 
    userInfo = info;
});

ipcMain.on('channel',(e,id)=>{
    idChannel = id;
})

ipcMain.on('getChannel',(e)=>{
    let apicall = "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics%2CbrandingSettings&id="+idChannel+"&key=";
    Axios.get(apicall + YOUTUBE_API_KEY,{
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json'
        } 
    }).then((res)=>{
        channelData = res.data.items[0];
        let channelDetails;
        try {
            channelDetails = {
                id:channelData.id,
                title:channelData.snippet.title,
                description:channelData.snippet.description,
                publishedAt:channelData.snippet.publishedAt,
                country:channelData.snippet.country,
                thumbnails:channelData.snippet.thumbnails.default.url,
                viewCount:channelData.statistics.viewCount,
                subscriberCount:channelData.statistics.subscriberCount,
                hiddenSubscriberCoun:channelData.statistics.hiddenSubscriberCoun,
                videoCount:channelData.statistics.videoCount,
                unsubscribedTraile:channelData.brandingSettings.channel.unsubscribedTraile,
                keywords:channelData.brandingSettings.channel.keywords,
                imageBanner: channelData.brandingSettings.image.bannerExternalUrl
            }
        } catch (error) {
               channelDetails = {
                id:channelData.id,
                title:channelData.snippet.title,
                description:channelData.snippet.description,
                publishedAt:channelData.snippet.publishedAt,
                country:channelData.snippet.country,
                thumbnails:channelData.snippet.thumbnails.default.url,
                viewCount:channelData.statistics.viewCount,
                subscriberCount:channelData.statistics.subscriberCount,
                hiddenSubscriberCoun:channelData.statistics.hiddenSubscriberCoun,
                videoCount:channelData.statistics.videoCount,
                unsubscribedTraile:channelData.brandingSettings.channel.unsubscribedTraile,
                keywords:channelData.brandingSettings.channel.keywords,
            }
        }
        
        e.reply('getChannel', channelDetails);
    })
})