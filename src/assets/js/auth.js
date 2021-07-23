const { ipcRenderer } = require('electron');
const login = document.querySelector('#logginbtn');

//* Botón de inicio de sesión con google 
login.addEventListener('click', e => {
    ipcRenderer.send('login');
});

//* Recuperar la información del usuario a partir del token y se envia para que se use en el resto de la aplicación.
ipcRenderer.on('logged', (e, userInfo, succes, userToken) => {
    ipcRenderer.send('user', userToken, userInfo);
    window.location.href = "./home.ejs";
});

//* Deshabilitar la funcion de volver atras.
window.location.hash="no-back-button";
window.location.hash="Again-No-back-button";//again because google chrome don't insert first hash into history
window.onhashchange=function(){window.location.hash="no-back-button";}