//* Importacion de electron que se va a utlizar a lo largo de todo el proyecto.
const {ipcRenderer} = require('electron');

//* variables globales 
let searchVideo= document.getElementById("search-video")
let searchbutton= document.getElementById("search-button")

//*Cuando carga la pagina principal se envia una solicitud.
document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('userInfo');
});

//* Se escucha la respuesta con la informacion del usario y se pinta la imagen y el nombre.
ipcRenderer.on('userInfo',(e,userInfo)=>{
    let name = document.getElementById("name")
    document.getElementById("imgProfile").setAttribute("src", userInfo.picture )
   
    name.innerHTML='Bienvenido '+ userInfo.given_name+ ' <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-laughing-fill" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5c0 .501-.164.396-.415.235C6.42 6.629 6.218 6.5 6 6.5c-.218 0-.42.13-.585.235C5.164 6.896 5 7 5 6.5 5 5.672 5.448 5 6 5s1 .672 1 1.5zm5.331 3a1 1 0 0 1 0 1A4.998 4.998 0 0 1 8 13a4.998 4.998 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5zm-1.746-2.765C10.42 6.629 10.218 6.5 10 6.5c-.218 0-.42.13-.585.235C9.164 6.896 9 7 9 6.5c0-.828.448-1.5 1-1.5s1 .672 1 1.5c0 .501-.164.396-.415.235z"/></svg>';
})



//* Se escucha el evento presionar una tecla y se lleva a la funcion search.
searchVideo.addEventListener('keyup',(e)=>{
    search(e)
})

//* Se escucha el evento click y se lleva a la funcion search.
searchbutton.addEventListener('click',(e)=>{
    search(e)
})

//*Cuando se le da click o se oprime la tecla enter se envia el string y se hace la busca con la api.
function search(e){
    if (e.key === 'Enter' || e.keyCode === 13 || e.type=='click' ){
        console.log(searchVideo.value)
        ipcRenderer.send('searchVideo',searchVideo.value);
        window.location.href = "./search.ejs";
    }
}

