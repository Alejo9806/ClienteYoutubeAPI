const {ipcRenderer} = require('electron');
const login = document.querySelector('#logginbtn');

login.addEventListener('click',e=>{
    ipcRenderer.send('login');
});

ipcRenderer.on('logged',(e,userInfo,succes,userToken)=>{
    console.log(succes);
    console.log(userInfo);
    console.log(userToken);
    ipcRenderer.send('user',userToken,userInfo);
    window.location.href = "./home.ejs";
});
