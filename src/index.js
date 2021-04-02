const { app, BrowserWindow } = require('electron')
const path = require('path')
const ejse = require('ejs-electron')



function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./views/index.ejs')
  win.setMenuBarVisibility(true)
}

app.whenReady().then(() => {
  createWindow()
  app.on('ready', () => {
    mainWindow = new BrowserWindow()
    mainWindow.loadURL('file://' + __dirname + './views/index.ejs')
})
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})