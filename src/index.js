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


ipcMain.on('login',async (e)=>{
    account.openAuthWindowAndGetTokens()
    .then(token => {
      if(token){
        userToken=token
        const succes ="Te has logeado correctamente amor <3"
        console.log(succes);
        e.reply('isLogged', succes);
        
         Axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+userToken.access_token)
        .then((res)=>{
          userInfo= res.data
          console.log(res.data)
          console.log(userInfo)
          mainWindow.webContents.send('userInfo', {userInfo})
        })
    
      }
      else{
        const succes ="Hay un error no te pudiste logear"
        console.log(succes);
        e.reply('isLogged',succes);
      }
    });
    
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


