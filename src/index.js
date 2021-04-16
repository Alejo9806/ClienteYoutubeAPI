require('dotenv').config({ path: '.env' });
'use strict';
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT, YOUTUBE_API_KEY } = process.env;
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2').default;
let account = new ElectronGoogleOAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, [GOOGLE_REDIRECT]);
const { app, BrowserWindow, ipcMain } = require('electron');
const Axios = require('axios');
const url = require('url');
const path = require('path');
const ejse = require('ejs-electron');
let userToken;
let userInfo;
let mainWindow;
let idVideo;
let idPlaylist;
let search;


if (process.env.NODE_ENV != "production") {
    require('electron-reload')(__dirname)
   
}


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.ejs'),
        protocol: 'file',
        slashes: true
    }))

    
    mainWindow.setMenuBarVisibility(true);

    mainWindow.on('closed', () => {
        app.quit();
    })
});



ipcMain.on('login', (e) => {
    account.openAuthWindowAndGetTokens()
        .then(token => {
            if (token) {
                userToken = token;
                console.log(token);
                Axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + userToken.access_token)
                    .then((res) => {
                        userInfo = res.data;
                        const succes = "Te has logeado correctamente amor <3";

                        console.log(res.data);
                        e.reply('logged', userInfo, succes);
                    })
            } else {
                const succes = "Hay un error no te pudiste logear"
                console.log(succes);
                e.reply('isNotLogged', succes);
            }
        });
});

ipcMain.on('searchVideo', (e, data) => {
    console.log(data)
    search = data;
});

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


ipcMain.on('userInfo', (e) => {
    e.reply('userInfo', userInfo);
});

ipcMain.on('listVideos', (e) => {
    let apicall = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=60&key="
    let listVideos = [];
    Axios.get(apicall + YOUTUBE_API_KEY,{
        headers: {
            Host:'www.googleapis.com',
            Authorization: 'Bearer '+userToken.access_token,
            Accept:'application/json'
        } 
    }).then((res) => {
        let data = res.data.items
        for (let i = 0; i < data.length; i++) {
            listVideos[i] = { 
                title: data[i].snippet.title,
                image: data[i].snippet.thumbnails.medium, 
                channelTitle: data[i].snippet.channelTitle, 
                videoId: data[i].id, 
                date: data[i].snippet.publishedAt 
            }
        }
        e.reply('listVideos', listVideos);
    });
});

ipcMain.on('video', (e, id) => {

    idVideo = id;
    e.reply('video', id);
});
ipcMain.on('getVideo', (e) => {
    e.reply('getVideo', idVideo);
});

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

ipcMain.on('playlisId',(e,id)=>{
    idPlaylist = id;
    e.reply('playlisId',id);
});

ipcMain.on('playListItems',(e,id)=>{
    let apiPLaylistItems = 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId='+idPlaylist+'&key='
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
        }
        e.reply('playListItems', playListItems);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})