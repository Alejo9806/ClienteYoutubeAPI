const { ipcRenderer } = require('electron');
const login = document.querySelector('#logginbtn');

//* Login button with google 
login.addEventListener('click', e => {
    ipcRenderer.send('login');
});

//* Retrieve user information and send it to the main screen of the application.
ipcRenderer.on('logged', (e, userInfo, succes, userToken) => {
    ipcRenderer.send('user', userToken, userInfo);
    window.location.href = "./home.ejs";
});