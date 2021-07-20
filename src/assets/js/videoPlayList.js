//* variables globales 
let idVideo;
let idElement = [];

//* Cargar el modal y hacer una llamada para recuperar la información de las playlist.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('playList');

})

//* Cuando escucha el evento para abrir el modal se reinicia unos datos que se utilizan para agregar un video a una playlist.
ipcRenderer.on('video-playlist-modal', (e, id) => {
    idElement.forEach(element=>{
        document.getElementById(element.box).checked = 0;
    })
    idElement = [];
    idVideo = id;

});

//* Recuperar la información de las playlist y hace una lista con las playlist.
ipcRenderer.on('playList', (e, playList) => {
    let listOfPlaylist = document.getElementById("myPlayLists");
    listOfPlaylist.innerHTML = "";
    for (let i = 0; i < playList.length; i++) {
        listOfPlaylist.innerHTML += `
        <div class="form-check">
        <input class="form-check-input" type="checkbox" value="${playList[i].id}" id="flexCheckDefault${i}" onchange="addPlayList('${playList[i].id}','flexCheckDefault${i}')">
        <label class="form-check-label" for="flexCheckDefault${i}">
            ${playList[i].title}
        </label>
        </div>    
     `;

    }
});

//* Cuando el estado del input cambia a seleccionado se agrega el video a la playlit del input seleccionado cuando cambia el estado se elimina el video de la playlist.
function addPlayList(id, box) {

    if (document.getElementById(box).checked) {
        ipcRenderer.send('add-video-to-playlist', id, idVideo, box)
    } else {
        idElement.forEach((element, index) => {
            if (element.box == box) {
                ipcRenderer.send('delete-video-from-playlist', element.idElementPlaylist)
                idElement.splice(index, 1);
            }
        });


    }
}
 
//*  Se obtienen los datos del formulario para crear la playlist y se añade el video con la creacion de la playlist.
document.getElementById("newPlayList").addEventListener('submit', (e) => {
    let newPlayList = {
        title: document.getElementById("titlePlaylist").value,
        description: document.getElementById("descriptionPlaylist").value,
        status: document.getElementById("status").value
    }
    ipcRenderer.send('new-playlist-with-video', newPlayList, idVideo);
    location.reload();
})

//* Cuando se escucha el envento se muestra en pantalla un mensaje con la respuesta del back end
ipcRenderer.on('add-video-to-playlist', (e, mss, idElementPlaylist, box) => {
    document.getElementById("mssPlaylist").innerHTML = mss;
    idElement.push({ idElementPlaylist: idElementPlaylist, box: box });
})

//* Cuando se escucha el envento se muestra en pantalla un mensaje con la respuesta del back end
ipcRenderer.on('delete-video-from-playlist', (e, mss) => {
    document.getElementById("mssPlaylist").innerHTML = mss;
})

//* Estilos para esconder o mostrar el formulario de crear playlist.
document.getElementById("newPlaylistVideo").addEventListener('click', (e) => {
    $('.hide').css({
        "overflow": "visible",
        "display": "flex"
    })

})

//* Estilos para esconder o mostrar el formulario de crear playlist.
document.getElementById("hidePlaylist").addEventListener('click', (e) => {
    $('.hide').css({
        "overflow": "hidden",
        "display": "none"
    })
})