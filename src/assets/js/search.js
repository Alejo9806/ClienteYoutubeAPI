let newChannelCollection = document.getElementById("newChannelCollection");
let chosenTagsChannel = [];
let chosenTagsPlaylist = [];
let idChannel;
let dateChannel;
let playListId;
let playListDate;

//* Cargar la página de búsqueda y hacer una llamada para recuperar la información del canal.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('search');
})

//* Recuperar la información de la búsqueda y pintarla en la pantalla.
ipcRenderer.on('search', (e, results) => {
    let listResult = document.getElementById("result");
    listResult.innerHTML = '';
    for (let i = 0; i < results.length; i++) {
        if (results[i].id.kind == 'youtube#channel') {
            listResult.innerHTML += `
     
            <div class="col-lg-12 col-md-12 col-sm-12 col-12 " > 
            <hr> 
                <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4 col-12">
                        <img class="img-circle rounded-circle ml-5 w-50" src="${results[i].image.url}" style="cursor:pointer;" alt="Card image cap"  style="cursor:pointer; onClick="getChannel('${results[i].channelId}')">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-12 mt-5"> 
                        <h6 class="card-title text-dark overflow" title="${results[i].title}" style="cursor:pointer;" onClick="getChannel('${results[i].channelId}')">${results[i].title}</h6> 
                        <p class="channel-color">${results[i].description}</p>
                        <p class="channel-color">Fecha de creación: ${results[i].date.slice(0,10)}</p>
                        
                    </div>  
                    <div class="col-lg-4 col-md-4 col-sm-4 col-12 mt-5 text-center">
                        <button type="button" class="btn btn-dark mb-1 w-50 mt-5" data-toggle="modal" data-target="#modalCollectionChannel" onClick="channelCollectionModal('${results[i].channelId}','${results[i].date}')">Agregar a colección</button>
                    </div>  
                </div>
                <hr>
            </div>
        `
        }else if(results[i].id.kind == 'youtube#playlist'){
            listResult.innerHTML += `
            <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-3" > 
                <div class="row">
                 <div class="col-lg-4 col-md-4 col-sm-4 col-4 image-icons">
                     <img class="img-fluid w-100 " src="${results[i].image.url}" style="cursor:pointer;" alt="Card image cap" onClick="getItems('${results[i].id.playlistId}')">
                     <section class="icon-playlist-playlist h-100 text-center" >
                     <h5 class="text-white text-center text-uppercase mt-5">Lista <br> de reproducción</h5>
                     </section>                  
                     <a class="d-block m-1 icon-coleccion-search  border border-white" data-toggle="modal" data-target="#modalCollectionPlaylist" onClick="playListCollectionModal('${results[i].id.playlistId}','${results[i].date}')"><span class="m-2 text-coleccion">AGREGAR A COLECCIÓN</span><svg class="m-2 icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                            </svg>
                        </a>
                 </div>
                 <div class="col-lg-7 col-md-7 col-sm-7 col-7"> 
                     <h6 class="card-title text-dark overflow" title="${results[i].title}" style="cursor:pointer;" onClick="getItems('${results[i].id.playlistId}')">${results[i].title}</h6> 
                     <p class="channel-color">Fecha de publicación: ${results[i].date.slice(0,10)}</p>
                     <p class="channel-color channel" title =${results[i].channelTitle}" style="cursor:pointer;" onClick="getChannel('${results[i].channelId}')">${results[i].channelTitle}</p>
                     <p class="channel-color">${results[i].description}</p>                      
                 </div>  
                </div> 
            </div>`
        }
        else{
            listResult.innerHTML += ` 
            <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-3" > 
                <div class="row">
                 <div class="col-lg-4 col-md-4 col-sm-4 col-4 image-icons">
                     <img class="img-fluid w-100" src="${results[i].image.url}" style="cursor:pointer;" alt="Card image cap" onClick="video('${results[i].id.videoId}')">
                     <a class="d-block m-1 icon-coleccion-search  border border-white" data-toggle="modal" data-target="#modalCollection" onClick="videoCollectionModal('${results[i].id.videoId}','${results[i].date}')"><span class="m-2 text-coleccion">AGREGAR A COLECCIÓN</span><svg class="m-2 icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                         <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                         </svg>
                     </a>
                     <a class="d-block m-1 icon-playlist-search border border-white"  data-toggle="modal" data-target="#modalPlaylist" onClick="videoPlaylistModal('${results[i].id.videoId}')"><span class="m-2 text-playlist">LISTA DE REPRODUCCIÓN</span><svg class="m-2 icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-collection-play-fill" viewBox="0 0 16 16">
                         <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm6.258-6.437a.5.5 0 0 1 .507.013l4 2.5a.5.5 0 0 1 0 .848l-4 2.5A.5.5 0 0 1 6 12V7a.5.5 0 0 1 .258-.437z"/>
                         </svg>
                     </a>
                 </div>
                 <div class="col-lg-7 col-md-7 col-sm-7 col-7"> 
                     <h6 class="card-title text-dark overflow" title="${results[i].title}" style="cursor:pointer;" onClick="video('${results[i].id.videoId}')">${results[i].title}</h6> 
                     <p class="channel-color">Fecha de publicación: ${results[i].date.slice(0,10)}</p>
                     <p class="channel-color channel" title =${results[i].channelTitle}" style="cursor:pointer;" onClick="getChannel('${results[i].channelId}')">${results[i].channelTitle}</p>
                     <p class="channel-color">${results[i].description}</p>                      
                 </div>  
                </div> 
            </div>`
        }        
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

//* Envía la id del playlist seleccionado y carga la ventana de los items del playlist.
function getItems(string) {
    ipcRenderer.send('playlisId', string);
    window.location.href = "./playListItems.ejs";

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

//* Al abrir el modal para añadir a la colección, se envía el id del canal y la fecha de creación.
function channelCollectionModal(id, date) {
    idChannel = id;
    dateChannel = date;
}

//*  Al abrir el modal para añadir a la colección, se envía el id del playlist y la fecha de creación.
function playListCollectionModal(id, date) {
    ipcRenderer.send('playList-collection-modal', id, date);
}

//* Se obtienen datos de la lista de reproducción para añadirlos a la colección.
ipcRenderer.on('playList-collection-modal', (e, id, date) => {
    playListId = id;
    playListDate = date;
});

//* Recuperar información de las colecciones para crear una lista de la que elegir.
ipcRenderer.on('collection', (e, collections) => {
    let selectedCollectionChannel = document.getElementById("selectedCollectionChannel");
    selectedCollectionChannel.innerHTML = '<option selected value="" >Open this select menu</option>';
    collections.forEach((collection) => {
        selectedCollectionChannel.innerHTML += `
        <option value="${collection.title}">${collection.title}</option>
        `
    });
    let selectedCollectionPlaylist = document.getElementById("selectedCollectionPlaylist");
    selectedCollectionPlaylist.innerHTML = '<option selected value="" >Open this select menu</option>';
    collections.forEach((collection) => {
        selectedCollectionPlaylist.innerHTML += `
        <option value="${collection.title}">${collection.title}</option>
        `
    });
});


//* Los datos del formulario para añadir el canal a la colección se registran y los datos se envían para entrar en la base de datos.
newChannelCollection.addEventListener('submit', (e) => {
    let collection = document.getElementById("selectedCollectionChannel").value;
    const channel = {
        type: 'CHANNEL',
        date: dateChannel,
        id: idChannel,
        comment: document.getElementById("comment-channel").value
    };
    ipcRenderer.send('new-channel-collection', channel, collection, chosenTagsChannel);
    newChannelCollection.reset();
});

//* Se obtienen los datos del formulario para añadir la lista de reproducción a la colección se registran y los datos se envían para entrar en la base de datos.
newPlayListCollection.addEventListener('submit', (e) => {
    let collection = document.getElementById("selectedCollectionPlaylist").value;
    const playList = {
        type: 'PLAYLIST',
        date: playListDate,
        id: playListId,
        comment: document.getElementById("comment-playlist").value
    };
    ipcRenderer.send('new-playList-collection', playList, collection, chosenTagsPlaylist);
    newPlayListCollection.reset();
});


