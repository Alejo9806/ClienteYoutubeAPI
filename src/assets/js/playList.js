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
        listOfPlaylist.innerHTML += `<div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4"> 
        <img class="card-img-top img-fluid border border-secondary" src="${playList[i].image.url}" alt="Card image cap" onClick="getItems('${playList[i].id}')">
        <div class="card-body border  border-secondary"  > 
            <h6 class="card-title text-dark overflow" title="${playList[i].title}" onClick="getItems('${playList[i].id}')">${playList[i].title}</h6> 
            <p class="channel-color" onClick="getChannel('${playList[i].channelId}')">${playList[i].channelTitle}</p>
           
        </div>  
        <div class="card-footer border  border-secondary">
            <button type="button" class="btn btn-dark w-100" data-toggle="modal" data-target="#modalCollectionPlaylist" onClick="playListCollectionModal('${playList[i].id}','${playList[i].date}')">Agregar a coleccion</button>
            <button type="button" class="btn btn-dark w-100" onClick="deletePlaylist('${playList[i].id}')">Borrar playlist</button>
        </div>  
    </div>`
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