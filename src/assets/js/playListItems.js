//* Cargar la página playListItems y hacer una llamada para recuperar la información del canal.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('playListItems');
})

//* Recuperar la información de la playListItems y pintarla en la pantalla
ipcRenderer.on('playListItems', (e, playListItems) => {
    let listOfPlaylistItems = document.getElementById("playListItems");
    listOfPlaylistItems.innerHTML = ''
    for (let i = 0; i < playListItems.length; i++) {
        listOfPlaylistItems.innerHTML += `<div class="col-lg-12 col-md-12 col-sm-12 col-12 bg-card border-0 mt-4" > 
        <div class="row">
            <div class="col-lg-1 col-md-1 col-sm-4 col-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
            </div> 
            <div class="col-lg-4 col-md-4 col-sm-4 col-4 image-icons">
                <img class="card-img-top img-fluid " src="${playListItems[i].image.url}" alt="Card image cap"  onClick="video('${playListItems[i].videoId}')">
            </div> 
            
            <div class="col-lg-7 col-md-7 col-sm-7 col-7 "> 
                <h6 class="card-title text-dark overflow" title="${playListItems[i].title}"  onClick="video('${playListItems[i].videoId}')">${playListItems[i].title}</h6> 
                <p class="channel-color channel" onClick="getChannel('${playListItems[i].videoOwnerChannelId}')">${playListItems[i].channelVideoTittle}</p>
                <br>
                <a class="btn btn-dark" data-toggle="modal"  title="AGREGAR A COLECCIÓN"  data-target="#modalCollection" onClick="videoCollectionModal('${playListItems[i].videoId}','${playListItems[i].date}')"><svg  xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                    </svg>
                </a>
                <a class="btn btn-danger" title="Borrar DE LA LISTA DE REPRODUCCION" onClick="deleteVideofromPlaylist('${playListItems[i].idElementPlaylist}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                <a/> 
            </div>
        </div>
        <hr>    
    </div>`
    }
})

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


//* Al abrir el modal para añadir a la colección, se envía el id del video y la fecha de creación.
function videoCollectionModal(id, date) {
    ipcRenderer.send('video-details', id);
    ipcRenderer.on('video-details', (e, videoDetails) => {
        ipcRenderer.send('video-collection-modal', id, date, videoDetails.duration);
    })

}
//* Se envia el id del item de la playlist para borrarlo.
function deleteVideofromPlaylist(idElement) {
    ipcRenderer.send('delete-video-from-playlist', idElement)
    location.reload();
}

//*Se muestra un mensaje si se ha producido un borrado correcto o un error.
ipcRenderer.on('delete-video-from-playlist', (e, mss) => {
    document.getElementById("mssDelete").innerHTML = mss;
})