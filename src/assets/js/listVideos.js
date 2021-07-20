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
        listOfVideos.innerHTML += `
        <div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4" > 
            <img class="card-img-top img-fluid border border-secondary" src="${listVideos[i].image.url}" alt="Card image cap" onClick="video('${listVideos[i].videoId}')">
            <div class="card-body border  border-secondary"> 
                <h6 class="card-title text-dark overflow" title="${listVideos[i].title}" onClick="video('${listVideos[i].videoId}')">${listVideos[i].title}</h6> 
                <p class="channel-color" onClick="getChannel('${listVideos[i].channelId}')">${listVideos[i].channelTitle}</p>
                <p class="channel-color">Publicacion: ${listVideos[i].date.slice(0,10)}</p>           
            </div>  
            <div class="card-footer border  border-secondary">
            <button type="button" class="btn btn-dark mb-1 w-100" data-toggle="modal" data-target="#modalCollection" onClick="videoCollectionModal('${listVideos[i].videoId}','${listVideos[i].date}','${listVideos[i].duration}')">Agregar a colección</button>
            <button type="button" class="btn btn-dark w-100" data-toggle="modal" data-target="#modalPlaylist" onClick="videoPlaylistModal('${listVideos[i].videoId}')">Agregar a playlist </button>
            </div> 
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