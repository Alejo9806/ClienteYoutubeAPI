//* llamada a la parte trasera cuando se carga la ventana.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('listVideos');

})

//* se obtienen datos, se muestra una lista de vídeos en la pantalla.
ipcRenderer.on('listVideos', (e, listVideos) => {
    //lista de videos 
    let listOfVideos = document.getElementById("list-of-videos");
    listOfVideos.innerHTML = ''
    for (let i = 0; i < listVideos.length; i++) {
        listOfVideos.innerHTML +=   `
        <div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4 card-icons" > 
        <img class="card-img-top img-fluid" src="${listVideos[i].image.url}" alt="Card image cap" onClick="video('${listVideos[i].videoId}')">
        <div class="card-body "> 
            <h6 class="card-title text-dark overflow" title="${listVideos[i].title}" onClick="video('${listVideos[i].videoId}')" >${listVideos[i].title}</h6> 
            <p class="channel-color channel" onClick="getChannel('${listVideos[i].channelId}')" title ="${listVideos[i].channelTitle}" >${listVideos[i].channelTitle}</p>
            <p class="channel-color">${listVideos[i].viewCount} de vistas • ${listVideos[i].date.slice(0,10)}
            </p>            
        </div>
        <a class="d-block m-1 icon-coleccion " data-toggle="modal"  data-target="#modalCollection" onClick="videoCollectionModal('${listVideos[i].videoId}','${listVideos[i].date}','${listVideos[i].duration}')"><span class="m-2 text-coleccion">AGREGAR A COLECCIÓN</span><svg class="m-2 icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
            </svg>
        </a>
        <a class="d-block m-1 icon-playlist" data-toggle="modal" data-target="#modalPlaylist" onClick="videoPlaylistModal('${listVideos[i].videoId}')"><span class="m-2 text-playlist">LISTA DE REPRODUCCIÓN</span><svg class="m-2 icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-collection-play-fill" viewBox="0 0 16 16">
            <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm6.258-6.437a.5.5 0 0 1 .507.013l4 2.5a.5.5 0 0 1 0 .848l-4 2.5A.5.5 0 0 1 6 12V7a.5.5 0 0 1 .258-.437z"/>
            </svg>
        </a>
    </div>`
      
    }
});

//* Envía la id del vídeo seleccionado y carga la ventana de vídeo.
function video(string) {
    ipcRenderer.send('video', string, null, null);
    window.location.href = "./video.ejs";

}

//* Al abrir el modal para añadir a la colección, se envía el id del video y la fecha de creación.
function videoCollectionModal(id, date, time) {
    ipcRenderer.send('video-collection-modal', id, date, time);
}

//* Los datos se envían al modal de la lista de reproducción de vídeo para poder agregar el video a una o varias listas de reproducción. 
function videoPlaylistModal(id) {
    ipcRenderer.send('video-playlist-modal', id);
}

//* Envía la id del canal seleccionado y carga la ventana del canal.
function getChannel(channelId) {
    ipcRenderer.send('channel', channelId);
    window.location.href = "./channel.ejs";
}