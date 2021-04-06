const login = document.querySelector('#logginbtn');
const {ipcRenderer} = require('electron');

login.addEventListener('click',e=>{
    ipcRenderer.send('login');
});

ipcRenderer.on('isLogged',(e,succes)=>{
    console.log(succes);
    window.location.href = "./home.ejs";
});