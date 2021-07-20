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
let idPlaylist;

//Se obtiene el token y la informacion del usuario y se guarda.
ipcMain.on('user', (e, token, info) => {
    userToken = token;
});

//Solicitud para obtener todas las listas de reproducción del usuario
ipcMain.on('playList', (e) => {

    let apiPlayList = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=20&mine=true&key="
    let playList = [];
    Axios.get(apiPlayList + YOUTUBE_API_KEY, {
        headers: {
            Host: 'www.googleapis.com',
            Authorization: 'Bearer ' + userToken.access_token,
            Accept: 'application/json'
        }
    }).then((res) => {
        let data = res.data.items;
        for (let i = 0; i < data.length; i++) {
            playList[i] = {
                title: data[i].snippet.title,
                image: data[i].snippet.thumbnails.medium,
                id: data[i].id,
                channelId: data[i].snippet.channelId,
                channelTitle: data[i].snippet.channelTitle,
                date: data[i].snippet.publishedAt
            }
        }
        e.reply('playList', playList);
    });
});

//Obtener el id de la lista de reproducción
ipcMain.on('playlisId', (e, id) => {
    idPlaylist = id;
    e.reply('playlisId', id);
});

//Consumir api para obtener todos los elementos de la lista de reproducción
ipcMain.on('playListItems', (e, id) => {
    let apiPLaylistItems = 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&part=contentDetails&playlistId=' + idPlaylist + '&key='
    let playListItems = [];
    Axios.get(apiPLaylistItems + YOUTUBE_API_KEY, {
        headers: {
            Host: 'www.googleapis.com',
            Authorization: 'Bearer ' + userToken.access_token,
            Accept: 'application/json'
        }
    }).then((res) => {
        let data = res.data.items
        for (let i = 0; i < data.length; i++) {
            playListItems[i] = {
                title: data[i].snippet.title,
                image: data[i].snippet.thumbnails.medium,
                channelTitle: data[i].snippet.channelTitle,
                idElementPlaylist: data[i].id,
                date: data[i].snippet.publishedAt,
                playListId: data[i].snippet.playlistId,
                channelVideoTittle: data[i].snippet.videoOwnerChannelTitle,
                videoId: data[i].snippet.resourceId.videoId,
                videoOwnerChannelId: data[i].snippet.videoOwnerChannelId,
                channelId: data[i].snippet.channelId
            }
        }
        e.reply('playListItems', playListItems);
    });
});

//* Nueva lista de reproducción
ipcMain.on('new-playList', (e, newPlaylist) => {
    let apiCallAddPlaylist = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2C%20status&key="
    let resource = {
        snippet: {
            title: newPlaylist.title,
            description: newPlaylist.description
        },
        status: {
            privacyStatus: newPlaylist.status
        }
    };
    Axios.post(apiCallAddPlaylist + YOUTUBE_API_KEY, resource, {
        headers: {
            Host: 'www.googleapis.com',
            Authorization: 'Bearer ' + userToken.access_token,
            Accept: 'application/json',
        }
    }).then((res) => {
        mss = "Se creo la playlist correctamente"
        e.reply('new-playList', mss)
    }, (error) => {
        mss = "Ocurrio un error no se pudo crear la playlist, itentalo mas tarde."
        e.reply('new-playList', mss)
    })
})

//* Eliminar la lista de reproducción

ipcMain.on('delete-playList', (e, id) => {
    let apiCallDeletePlaylist = "https://youtube.googleapis.com/youtube/v3/playlists?id=" + id + "&key="
    Axios.delete(apiCallDeletePlaylist + YOUTUBE_API_KEY, {
        headers: {
            Host: 'www.googleapis.com',
            Authorization: 'Bearer ' + userToken.access_token,
            Accept: 'application/json',
        }
    }).then((res) => {
        mss = "Borrado"
        e.reply('delete-playList', mss)
    }, (error) => {
        mss = "Ocurrio un error no se pudo borrar la playlist, itentalo mas tarde."
        e.reply('delete-playList', mss)
    })
})

//* Información para añadir un vídeo a la lista de reproducción

ipcMain.on('video-playlist-modal', (e, id, date) => {
    e.reply('video-playlist-modal', id, date);
})

ipcMain.on('new-playlist-with-video', (e, newPlaylist, id) => {
    let apiCallAddPlaylist = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2C%20status&key="
    let apiCallAddVideo = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&key=";
    let resource = {
        snippet: {
            title: newPlaylist.title,
            description: newPlaylist.description
        },
        status: {
            privacyStatus: newPlaylist.status
        }
    };

    //* Crear una lista de reproducción y añadir un vídeo
    Axios.post(apiCallAddPlaylist + YOUTUBE_API_KEY, resource, {
        headers: {
            Host: 'www.googleapis.com',
            Authorization: 'Bearer ' + userToken.access_token,
            Accept: 'application/json',
        }
    }).then((res) => {
        mss = "Se creo la playlist correctamente"
        let resourceVideoPlaylist = {
            snippet: {
                playlistId: res.data.id,
                resourceId: {
                    "videoId": id,
                    "kind": "youtube#video"
                },
                "position": 0
            }
        }
        Axios.post(apiCallAddVideo + YOUTUBE_API_KEY, resourceVideoPlaylist, {
            headers: {
                Host: 'www.googleapis.com',
                Authorization: 'Bearer ' + userToken.access_token,
                Accept: 'application/json',
            }
        }).then((res) => {
            e.reply('new-playlist-with-video', mss)
        }, (error) => {
            mss = "Ocurrio un error no se pudo añadir el video a la playlist, itentalo mas tarde."
            e.reply('new-playlist-with-video', mss)
        })
    }, (error) => {
        mss = "Ocurrio un error no se pudo crear la playlist, itentalo mas tarde."
        e.reply('new-playlist-with-video', mss)
    })
})

//* añadir vídeo a la lista de reproducción 

ipcMain.on('add-video-to-playlist', (e, id, idVideo, box) => {
    let apiCallAddVideo = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&key=";
    let resourceVideoPlaylist = {
        snippet: {
            playlistId: id,
            resourceId: {
                "videoId": idVideo,
                "kind": "youtube#video"
            },
            "position": 0
        }
    }
    Axios.post(apiCallAddVideo + YOUTUBE_API_KEY, resourceVideoPlaylist, {
        headers: {
            Host: 'www.googleapis.com',
            Authorization: 'Bearer ' + userToken.access_token,
            Accept: 'application/json',
        }
    }).then((res) => {
        mss = "Video añadido a playlist"
        let idElementPlaylist = res.data.id;
        e.reply('add-video-to-playlist', mss, idElementPlaylist, box)
    }, (error) => {
        mss = "Ocurrio un error no se pudo añadir el video a la playlist, itentalo mas tarde."
        e.reply('add-video-to-playlist', mss)
    })
})

//* eliminar el vídeo de la lista de reproducción

ipcMain.on('delete-video-from-playlist', (e, id) => {
    let apiCallDeleteVideoplayList = "https://youtube.googleapis.com/youtube/v3/playlistItems?id=" + id + "&key="
    Axios.delete(apiCallDeleteVideoplayList + YOUTUBE_API_KEY, {
        headers: {
            Host: 'www.googleapis.com',
            Authorization: 'Bearer ' + userToken.access_token,
            Accept: 'application/json',
        }
    }).then((res) => {
        mss = "Borrado"
        e.reply('delete-video-from-playlist', mss)
    }, (error) => {
        mss = "Ocurrio un error no se pudo borrar el video de la playlist, itentalo mas tarde."
        e.reply('delete-video-from-playlist', mss)
    })

})