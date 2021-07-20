//* Cargar la página de búsqueda y hacer una llamada para recuperar la información del canal.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('search');
})

//* Recuperar la información de la búsqueda y pintarla en la pantalla.
ipcRenderer.on('search', (e, results) => {
    let listResult = document.getElementById("result");
    listResult.innerHTML = '';
    for (let i = 0; i < results.length; i++) {
        listResult.innerHTML += `<div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4" > 
        <img class="card-img-top img-fluid border border-secondary" src="${results[i].image.url}" alt="Card image cap" onClick="video('${results[i].videoId}')">
        <div class="card-body border  border-secondary"> 
            <h6 class="card-title text-dark overflow" title="${results[i].title}"  onClick="video('${results[i].videoId}')">${results[i].title}</h6> 
            <p class="channel-color">${results[i].description}</p>
            <p class="channel-color"  onClick="getChannel('${results[i].channelId}')">${results[i].channelTitle}</p>
            <p class="channel-color">Publicacion: ${results[i].date.slice(0,10)}</p>
        </div>  
        <div class="card-footer border  border-secondary">
            <button type="button" class="btn btn-dark mb-1 w-100" data-toggle="modal" data-target="#modalCollection" onClick="videoCollectionModal('${results[i].videoId}','${results[i].date}')">Agregar a colección</button>
            <button type="button" class="btn btn-dark w-100" data-toggle="modal" data-target="#modalPlaylist" onClick="videoPlaylistModal('${results[i].videoId}')">Agregar a playlist </button>
        </div>  
    </div>`
    }
});

//* Envía la id del vídeo seleccionado y carga la ventana de vídeo.
function video(string) {
    ipcRenderer.send('video', string, null, null);
    window.location.href = "./video.ejs";

}

//* Envía la id del canal seleccionado y carga la ventana del canal.
function getChannel(channelId) {
    ipcRenderer.send('channel', channelId);
    window.location.href = "./channel.ejs";
}

//*Al abrir el modal para añadir a la colección, se envía el id del video y la fecha de creación.
function videoCollectionModal(id, date) {
    ipcRenderer.send('video-details', id);
    ipcRenderer.on('video-details', (e, videoDetails) => {
        ipcRenderer.send('video-collection-modal', id, date, videoDetails.duration);
    })
}

//* Los datos se envían al modal de la lista de reproducción de vídeo para poder agregar el video a una o varias listas de reproducción. 
function videoPlaylistModal(id) {
    ipcRenderer.send('video-playlist-modal', id);
}