const { app, BrowserWindow, remote} = require('electron');
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
          preload: path.join(__dirname, 'preload.js')
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


// function createWindow () {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js')
//     }
//   })

//   win.loadFile('./views/index.ejs')
//   win.setMenuBarVisibility(true);
// }

// app.whenReady().then(() => {
 
// })


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
