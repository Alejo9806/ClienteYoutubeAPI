//environment variables
require('dotenv').config({ path: '.env' });
'use strict';

//requires 
const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
require('ejs-electron');

//global variables
let userInfo;
let mainWindow;

// if (process.env.NODE_ENV != "production") {
//     require('electron-reload')(__dirname)
   
// }

//Init 
require('./database');
//controllers
require('./controllers/auth.controller');//Authenticate
require('./controllers/search.controller');//Search Videos
require('./controllers/playlist.controller');//PlayList and items of each of the playlists
require('./controllers/video.controller');//Home video list and specific video for the reporter window
require('./controllers/collection.controller');//
require('./controllers/channel.controller')//

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

//get user information and token
ipcMain.on('user',(e,token,info)=>{
    userInfo = info;
 
});

//Send userInfo to the client
ipcMain.on('userInfo', (e) => {
    e.reply('userInfo', userInfo);
});

//Close all windows and terminate the application
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})