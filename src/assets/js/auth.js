const {ipcRenderer} = require('electron');
const login = document.querySelector('#logginbtn');

login.addEventListener('click',e=>{
    ipcRenderer.send('login');
});

ipcRenderer.on('logged',(e,userInfo,succes)=>{
    console.log(succes);
    console.log(userInfo.picture);
    window.location.href = "./home.ejs";
});

