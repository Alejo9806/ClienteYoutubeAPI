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
    let apicallChannel = "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics%2CbrandingSettings&id="+idChannel+"&key=";
    let apicallsubscription = "https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&forChannelId="+idChannel+"&mine=true&key=";
    let videoTrailer;
    Axios.get(apicallChannel + YOUTUBE_API_KEY,{
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
                unsubscribedTrailer:channelData.brandingSettings.channel.unsubscribedTrailer,
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
                unsubscribedTrailer:channelData.brandingSettings.channel.unsubscribedTrailer,
                keywords:channelData.brandingSettings.channel.keywords,
            }
        
        }
        if (typeof channelDetails.unsubscribedTrailer != "undefined") {
            console.log(channelDetails.unsubscribedTrailer)
            let apiCallVideo = 'https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id='+channelDetails.unsubscribedTrailer+'&maxResults=1&key=';
            Axios.get(apiCallVideo + YOUTUBE_API_KEY,{
            headers: {
                Host:'www.googleapis.com',
                Authorization: 'Bearer '+userToken.access_token,
                Accept:'application/json'
            } 
            }).then((res)=>{
                let data = res.data.items;
                for (let i = 0; i < data.length; i++) {
                    videoTrailer = {
                        title: data[i].snippet.title,
                        image: data[i].snippet.thumbnails.medium, 
                        channelTitle: data[i].snippet.channelTitle, 
                        videoId: data[i].id, 
                        date: data[i].snippet.publishedAt,
                        channelId: data[i].snippet.channelId,
                        description:data[i].snippet.description,
                    }
                }
            }).catch((error) =>{
                console.log(error);
            })
        }
        Axios.get(apicallsubscription + YOUTUBE_API_KEY,{
            headers: {
                Host:'www.googleapis.com',
                Authorization: 'Bearer '+userToken.access_token,
                Accept:'application/json'
            } 
        }).then((res)=>{
            let channelSubscription = true;
            let dataSubscription = res.data.items;
            let idSubscription;
            console.log(dataSubscription);
            if(!dataSubscription.length){
                channelSubscription = false;
                
            }else{
                idSubscription = dataSubscription[0].id
                console.log(idSubscription);
            }   
            e.reply('getChannel', channelDetails,channelSubscription,idSubscription,videoTrailer);
        })
    })
   
})

ipcMain.on('subscription',(e,channelId)=>{
    let apicallsubscription = "https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&key="
    let mss;
    let resource ={
        snippet: {
          resourceId: {
            kind: 'youtube#channel',
            channelId: channelId
          }
        }
    };
    Axios.post(apicallsubscription + YOUTUBE_API_KEY,resource,{  
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer'+userToken.access_token,
            Accept:'application/json',
            
            
        }
    }).then((res)=>{
        console.log(res.data.id)
        mss = "Te has suscrito al canal"
        e.reply('subscription',mss,res.data.id)
    },(error)=>{
        mss = "Ocurrio un error no te pudiste suscribir al canal itentalo mas tarde."
        e.reply('subscription',mss)
    }) 
});

ipcMain.on('unsubscribed',(e,id)=>{
    let apicallunsubscription = " https://youtube.googleapis.com/youtube/v3/subscriptions?id="+id+"&key="
    let mss;
    Axios.delete(apicallunsubscription + YOUTUBE_API_KEY,{  
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json',  
        }
    });
    try {
        mss = "Se elimino la suscripcion"
        e.reply('unsubscribed',mss)  
    } catch (error) {
        mss = "Ocurrio un error no se pudo eliminar suscripcion."
        e.reply('unsubscribed',mss)
    }
    
})