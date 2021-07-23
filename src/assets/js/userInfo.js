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
   
    name.innerHTML='Bienvenido '+ userInfo.given_name;
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

