require('dotenv').config();


'use strict';
// const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,GOOGLE_REDIRECT } = process.env;
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2').default;
let account= new ElectronGoogleOAuth2('415376126316-7elok7eprsmthbt4s4mncteht332v3mc.apps.googleusercontent.com', 'ZSKo0upSkeJj2852Jl4sJSZY', ['https://www.googleapis.com/auth/drive.metadata.readonly']);
const { app, BrowserWindow,ipcMain} = require('electron');
const axios = require('axios');
const url = require('url');
const path = require('path');
const ejse = require('ejs-electron');

if(process.env.NODE_ENV != "production"){
  require('electron-reload')(__dirname,{

  })
}

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        }
  });
  mainWindow.loadURL(url.format({
    pathname:path.join(__dirname,'views/index.ejs'),
    protocol:'file',
    slashes:true
  }))   
  
  mainWindow.setMenuBarVisibility(true);

  mainWindow.on('closed',()=>{
    app.quit();
  })
});

ipcMain.on('login',(e)=>{
    account.openAuthWindowAndGetTokens()
    .then(token => {
      if(token){
        const succes ="Te has logeado correctamente amor <3"
        console.log(succes);
        e.reply('isLogged', succes);
      }
      else{
        const succes ="Hay un error no te pudiste logear"
        console.log(succes);
        e.reply('isNotLogged',succes);
      }
    });
  
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


