//Variables de ambiente
require('dotenv').config({ path: '.env' });
'use strict';

//importaciones de librerias electron
const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
require('ejs-electron');

//variables globales
let userInfo;
let mainWindow;

if (process.env.NODE_ENV != "production") {
    require('electron-reload')(__dirname)
   
}

//Init 
require('./database');
//controllers
require('./controllers/auth.controller');//Autentificar
require('./controllers/search.controller');//Buscar vídeos
require('./controllers/playlist.controller');//Lista de reproducción y elementos de cada una de las listas de reproducción
require('./controllers/video.controller');//Lista de vídeos de inicio y vídeo específico.
require('./controllers/collection.controller');//Manejo de las colecciones y sus recursos
require('./controllers/channel.controller')//Recuperar informacion de un canal

//Init mainWindow 
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 900,
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

//obtener la información del usuario y el token
ipcMain.on('user',(e,token,info)=>{
    userInfo = info;
 
});

//Enviar userInfo al cliente
ipcMain.on('userInfo', (e) => {
    e.reply('userInfo', userInfo);
});


//Cerrar todas las ventanas y terminar la aplicación
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})