//Variables de ambiente
const { YOUTUBE_API_KEY  } = require('../config/keys');
require('dotenv').config({ path: '.env' });
'use strict';

//importaciones de librerias electron
const { ipcMain } = require('electron');
// const { YOUTUBE_API_KEY } = process.env;
const Axios = require('axios');

//variables globales
let userToken;
let search;

//Se obtiene el token y la informacion del usuario y se guarda.
ipcMain.on('user', (e, token, info) => {
    userToken = token;
});

//Obtener información de búsqueda
ipcMain.on('searchVideo', (e, data) => {
    search = data;
});

//Hacer una solicitud de búsqueda en la api de youtube
ipcMain.on('search', (e) => {
    let apiSearch = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&order=relevance&q=' + search + '&key='
    let results = [];
    Axios.get(apiSearch + YOUTUBE_API_KEY, {
        headers: {
            Host: 'www.googleapis.com',
            Authorization: 'Bearer ' + userToken.access_token,
            Accept: 'application/json'
        }
    }).then((res) => {
        let data = res.data.items;
        for (let i = 0; i < data.length; i++) {
            results[i] = {
                title: data[i].snippet.title,
                image: data[i].snippet.thumbnails.medium,
                channelTitle: data[i].snippet.channelTitle,
                videoId: data[i].id.videoId,
                date: data[i].snippet.publishedAt,
                description: data[i].snippet.description,
                channelId: data[i].snippet.channelId,
            }
        }
        e.reply('search', results);
    });
});