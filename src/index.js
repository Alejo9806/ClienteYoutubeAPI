require('dotenv').config({path:'.env'});
'use strict';
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,GOOGLE_REDIRECT } = process.env;
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2').default;
let account= new ElectronGoogleOAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, [GOOGLE_REDIRECT]);
const { app, BrowserWindow,ipcMain} = require('electron');
const Axios = require('axios');
const url = require('url');
const path = require('path');
const ejse = require('ejs-electron');
let userToken;
let userInfo;
let mainWindow;



if(process.env.NODE_ENV != "production"){
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
    pathname:path.join(__dirname,'views/index.ejs'),
    protocol:'file',
    slashes:true
  }))   
  
  mainWindow.setMenuBarVisibility(true);
  

  mainWindow.on('closed',()=>{
    app.quit();
  })
});

function createHomeWindow() {
  homeWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
    homeWindow.loadURL(url.format({
      pathname:path.join(__dirname,'views/home.ejs'),
      protocol:'file',
      slashes:true
    })); 
    mainWindow.setMenuBarVisibility(true);
  

    mainWindow.on('closed',()=>{
      app.quit();
    }); 
}


ipcMain.on('login',(e)=>{
    account.openAuthWindowAndGetTokens()
    .then(token => {
      if(token){
        userToken = token;       
        Axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+userToken.access_token)
        .then((res)=>{
            userInfo = res.data;
            const succes = "Te has logeado correctamente amor <3";
            console.log(succes);
            console.log(res.data);
            e.reply('logged', userInfo,succes);
        })     
      }
      else{
        const succes ="Hay un error no te pudiste logear"
        console.log(succes);
        e.reply('isNotLogged',succes);
      }
    });
});

ipcMain.on('userInfo',(e)=>{
  e.reply('userInfo', userInfo);
});   

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


