//* Importación de metodos para los tags
const {keyPressValue,selectionTag,deletedTag} = require('../../src/libs/tags');

//* variables globales 
const newPlayListCollection = document.getElementById("newPlayListCollection");
let chosenTags = [];
let playListId;
let playListDate;

//* Cargar la página del playlist y hacer una llamada para recuperar la información de la lista de reproducción.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('playList');
    ipcRenderer.send('collection');
})

//* Recuperar información de la lista de reproducción y pintarla en la pantalla
ipcRenderer.on('playList', (e, playList) => {
    let listOfPlaylist = document.getElementById("playList");
    listOfPlaylist.innerHTML = ''
    for (let i = 0; i < playList.length; i++) {
        listOfPlaylist.innerHTML += `
        <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-3" > 
                <div class="row">
                 <div class="col-lg-4 col-md-4 col-sm-4 col-4 image-icons">
                     <img class="img-fluid w-100 h-100" src="${playList[i].image.url}" style="cursor:pointer;" alt="Card image cap" onClick="getItems('${playList[i].id}')">
                     <section class="icon-playlist-playlist h-100 text-center " onClick="getItems('${playList[i].id}')">
                     <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"  fill="currentColor" class="bi bi-collection-play-fill m-2 icon-playlist-collection mt-5" viewBox="0 0 16 16">
                         <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm6.258-6.437a.5.5 0 0 1 .507.013l4 2.5a.5.5 0 0 1 0 .848l-4 2.5A.5.5 0 0 1 6 12V7a.5.5 0 0 1 .258-.437z"/>
                     </svg> <br>
                     <h6 class="text-white text-center">${playList[i].itemCount}</h6>
                    </section>                 
                     <a class="d-block m-1 icon-coleccion-search  border border-white" data-toggle="modal" data-target="#modalCollectionPlaylist" onClick="playListCollectionModal('${playList[i].id}','${playList[i].date}')"><span class="m-2 text-coleccion">AGREGAR A COLECCIÓN</span><svg class="m-2 icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                            </svg>
                        </a>
                 </div>
                 <div class="col-lg-7 col-md-7 col-sm-7 col-7"> 
                     <h6 class="card-title text-dark overflow" title="${playList[i].title}" style="cursor:pointer;" onClick="getItems('${playList[i].id}')">${playList[i].title}</h6> 
                     <p class="channel-color">Fecha de publicación: ${playList[i].date.slice(0,10)}</p>
                     <p class="channel-color channel" title =${playList[i].channelTitle}" style="cursor:pointer;" onClick="getChannel('${playList[i].channelId}')">${playList[i].channelTitle}</p>
                     <p class="channel-color">${playList[i].description}</p>     
                     <a class="btn btn-danger" title="Borrar playlist" onClick="deletePlaylist('${playList[i].id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg><a/> 
                 </div>  
                </div> 
            </div>
    `
    }
});

//* Envía la id del playlist seleccionado y carga la ventana de los items del playlist.
function getItems(string) {
    ipcRenderer.send('playlisId', string);
    window.location.href = "./playListItems.ejs";

}
//* Envía la id del canal seleccionado y carga la ventana del canal.
function getChannel(channelId) {
    ipcRenderer.send('channel', channelId);
    window.location.href = "./channel.ejs";
}

//*  Al abrir el modal para añadir a la colección, se envía el id del playlist y la fecha de creación.
function playListCollectionModal(id, date) {
    ipcRenderer.send('playList-collection-modal', id, date);
}

//* Recuperar información de las colecciones para crear una lista de la que elegir.
ipcRenderer.on('collection', (e, collections) => {
    let selectedCollection = document.getElementById("selectedCollectionPlaylist");
    selectedCollection.innerHTML = '<option selected value="">Open this select menu</option>';
    collections.forEach((collection) => {
        selectedCollection.innerHTML += `
        <option value="${collection.title}">${collection.title}</option>
        `
    });
});

//* Se obtienen datos de la lista de reproducción para añadirlos a la colección.
ipcRenderer.on('playList-collection-modal', (e, id, date) => {
    playListId = id;
    playListDate = date;
});

//* Se obtienen los datos del formulario para añadir la lista de reproducción a la colección se registran y los datos se envían para entrar en la base de datos.
newPlayListCollection.addEventListener('submit', (e) => {
    let collection = document.getElementById("selectedCollectionPlaylist").value;
    const playList = {
        type: 'PLAYLIST',
        date: playListDate,
        id: playListId,
        comment: document.getElementById("comment").value
    };
    ipcRenderer.send('new-playList-collection', playList, collection, chosenTags);
    newPlayListCollection.reset();
});


//*  La respuesta se obtiene del back end y los tag que se obtienen se mostraran al cliente en una lista.
ipcRenderer.on('search-tag', (e, tags,selectTag) => {
    document.getElementById(selectTag).innerHTML = '';
    tags.forEach(tag_user => {
        document.getElementById(selectTag).innerHTML += `
        <a class="btn btn-danger" onClick="sendDataSelectTag('${tag_user._doc.tag}','labelTags')">${tag_user._doc.tag}</a>
        `
    });
});

//* Fución para enviar datos a la función saveTag de la libreria del tag. 
function SelectSaveTag(tagInput,noSave,save) {
    if (tagInput == 'tag') {
        chosenTags = saveTag(tagInput,noSave,save,'labelTags',chosenTags);
    }
}

//* Fución para enviar datos a la función selectionTag de la libreria del tag. 
function sendDataSelectTag(tag,labelTags) {
    if (labelTags == 'labelTags') {
        chosenTags = selectionTag(tag,labelTags,chosenTags);
    }
}

//* Fución para enviar datos a la función deletedTag de la libreria del tag. 
function sendDataDeletedTag(tag,labelTags) {
    if (labelTags == 'labelTags') {
        chosenTags = deletedTag(tag,labelTags,chosenTags);
    }
}

//* Se envian los datos a la api que se ingresaron en el formulario para crear una nueva playlist.

document.getElementById("newPlayList").addEventListener('submit', (e) => {
    let newPlayList = {
        title: document.getElementById("titlePlaylist").value,
        description: document.getElementById("descriptionPlaylist").value,
        status: document.getElementById("status").value
    }
    ipcRenderer.send('new-playList', newPlayList);
    location.reload();
})

//* Se envia el id de la playlist seleccionada para borrarla
function deletePlaylist(id) {
    ipcRenderer.send('delete-playList', id);
    location.reload();
}

//* Se escucha un evento de que se elimino una playlist y se pone un mss en pantalla de que se elimino la playlist.
ipcRenderer.on('delete-playList', (e, mss) => {
    document.getElementById("mssDeletePlaylist").innerHTML = mss;
})