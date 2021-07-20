//* Importación de metodos para los tags y para transformar el tiempo de los videos en segundos.
const { transformTime } = require('../../src/libs/time');
const {keyPressValue,selectionTag,deletedTag,saveTag} = require('../../src/libs/tags');

//* variables globales 
//*Video
const editVideoCollection = document.getElementById("editVideoCollection");
const labelTags = document.getElementById("labelTags");
let chosenTags = [];
let idVideo;


//*Playlist
const editPlayListCollection = document.getElementById("editPlayListCollection");
const labelTagsEditPlaylist = document.getElementById("labelTagsEditPlaylist");
let chosenTagsEditPlaylist = [];
let idPlaylist;

//*Channel
const editChannelCollection = document.getElementById("editChannelCollection");
const labelTagsEditChannel = document.getElementById("labelTagsEditChannel");
let chosenTagsEditChannel = [];
let idChannel;



//*  Realiza una llamada al back end al cargar la ventana de recursos de las colecciones.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('get-collection-select');
})

//* Los datos de la colección se obtienen y se muestran en la pantalla, divididos en listas de reproducción, canales, vídeos y colecciones recomendadas.
ipcRenderer.on('get-collection-select', (e, videos, playList, channel, relatedCollections) => {
    const videosCollection = document.getElementById('videosCollection');
    const playListCollection = document.getElementById('playListCollection');
    const channelsCollection = document.getElementById('channelsCollection');
    const collectionRelated = document.getElementById('collectionRelated');
    playListCollection.innerHTML = '';
    videosCollection.innerHTML = '';
    channelsCollection.innerHTML = '';
    collectionRelated.innerHTML = '';
    //* Se recorre los videos de la colección y se pintan en pantalla uno por uno.
    videos.forEach(element => {
        videosCollection.innerHTML += `
                <div class="card col-lg-10 col-md-10 col-sm-10 col-10 bg-card border-0 mt-4" > 
                    <img class="card-img-top img-fluid border border-secondary" src="${element.image.url}" alt="Card image cap" onClick="video('${element.videoId}','${element.startAt}','${element.endAt}')">
                    <div class="card-body border  border-secondary" > 
                        <h6 class="card-title text-dark overflow" title="${element.title}" onClick="video('${element.videoId},'${element.startAt}','${element.endAt}')">${element.title}</h6> 
                        <p class="channel-color" onClick="getChannel('${element.channelId}')">${element.channelTitle}</p>
                        <p class="channel-color">Publicacion: ${element.date.slice(0,10)}</p>           
                    </div>  
                    <div class="card-footer border  border-secondary">
                    <a class="btn btn-danger" onClick="deleteVideoOrPlayListOrChannel('${element.videoId}')">Borrar de la colección<a/>
                    <a class="btn btn-primary" data-toggle="modal" data-target="#modalCollectionEdit" onClick="editVideo('${element.videoId}','${element.comment}','${element.startAt}','${element.endAt}','${element.tags}','${element.duration}')">Editar tags<a/>
                    </div> 
                </div>`
    });
    //* Se recorre las playlists de la colección y se pintan en pantalla una por una
    playList.forEach(element => {
        playListCollection.innerHTML += `
                <div class="card col-lg-10 col-md-10 col-sm-10 col-10 bg-card border-0 mt-4" > 
                    <img class="card-img-top img-fluid border border-secondary" src="${element.image.url}" alt="Card image cap" onClick="getItems('${element.id}')">
                    <div class="card-body border  border-secondary"> 
                        <h6 class="card-title text-dark overflow" title="${element.title}">${element.title}</h6> 
                        <p class="channel-color">${element.channelTitle}</p>
                        <p class="channel-color">Publicacion: ${element.date.slice(0,10)}</p>           
                    </div>  
                    <div class="card-footer border  border-secondary">
                    <a class="btn btn-danger" onClick="deleteVideoOrPlayListOrChannel('${element.id}')">Borrar de la colección<a/>
                    <a class="btn btn-primary" data-toggle="modal" data-target="#modalCollectionPlaylistEdit" onClick="editPlaylist('${element.id}','${element.comment}','${element.tags}')">Editar tags<a/>
                    </div> 
                </div>`
    });
    //* Se recorre los canales de la colección y se pintan en pantalla uno por uno.
    channel.forEach(element => {
        channelsCollection.innerHTML += `
            <img src="${element.image}" alt="${element.title}" class="img-circle border rounded-circle d-inline mt-4" onClick="getChannel('${element.id}')">
            <div class="d-inline">
                <h6 class="text-dark d-inline" onClick="getChannel('${element.id}')">${element.title}</h6>
            </div>
            <div class="card-footer border  border-secondary">
            <a class="btn btn-danger" onClick="deleteVideoOrPlayListOrChannel('${element.id}')">Borrar de la colección<a/>
            <a class="btn btn-primary" data-toggle="modal" data-target="#modalCollectionChannelEdit" onClick="editChannel('${element.id}','${element.comment}','${element.tags}')">Editar tags<a/>
            </div> 
        `
    });
    //* Se recorre las colecciones relacionadas que hay con la coleccion seleccionada se pintan en pantalla uno por uno en una tabla.
    relatedCollections.forEach((element, i) => {
        collectionRelated.innerHTML += `
        <tr>
        <th scope="row">${i}</th>
        <td><a onClick="getCollection('${element.title}')" style="cursor:pointer">${element.title}</a></td>
        <td>${element.description}</td>
      </tr> `
    });
})

//* Envía la id del vídeo seleccionado y carga la ventana de vídeo.
function video(string, startAt, endAt) {
    ipcRenderer.send('video', string, startAt, endAt);
    window.location.href = "./video.ejs";

}

//*Envía la id del canal seleccionado y carga la ventana del canal.
function getChannel(channelId) {
    ipcRenderer.send('channel', channelId);
    window.location.href = "./channel.ejs";
}

//* Envía la id de la playlist seleccionada y carga la ventana de los items de la playlist.
function getItems(string) {
    ipcRenderer.send('playlisId', string);
    window.location.href = "./playListItems.ejs";

}

//* Acceso a la colección seleccionada
function getCollection(title) {
    ipcRenderer.send('get-collection', title);
    window.location.href = './collectionResource.ejs';
}


//* Se envia la id del recurso seleccionado y se elimina el recurso de la base de datos. (video,canal,playlist)
function deleteVideoOrPlayListOrChannel(id) {
    ipcRenderer.send('delete-video-playList-channel', id);
}

//* Escucha cuando se elimina un vídeo, una lista de reproducción o un canal y refresca la ventana para su actualización
ipcRenderer.on('delete-video-playList-channel', (e) => {
    location.reload();
})


//* Funcionalidades para editar video
//* Se obtienen los datos del vídeo seleccionado para su edición y se rellena el formulario con los datos del vídeo.
function editVideo(id, comment, startAt, endAt, tags, timeDuration) {
    let time = transformTime(timeDuration);
    document.getElementById("startAt").setAttribute("max", time);
    document.getElementById("endAt").setAttribute("max", time);

    let tagsCadena = [];
    chosenTags = [];
    idVideo = id;
    if (startAt != null) {
        document.getElementById("startAt").value = startAt;
    }
    if (endAt != null) {
        document.getElementById("endAt").value = endAt;
    }
    document.getElementById("comment").value = comment;
    labelTags.innerHTML = ``;
    tagsCadena = tags.split(",");
    tagsCadena.forEach(tag => {
        chosenTags.push(tag);
        labelTags.innerHTML += `
        <label for="description">${tag} </label>
        <a onClick="sendDataDeletedTag('${tag}','labelTags')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg></a>
    `;
    })
}


//* Los datos del formulario para añadir el canal a la colección se registran y los datos se envían para entrar en la base de datos de edición de vídeo.
editVideoCollection.addEventListener('submit', (e) => {
    const VideoCollection = {
        startAt: document.getElementById("startAt").value,
        endAt: document.getElementById("endAt").value,
        comment: document.getElementById("comment").value,
    };
    ipcRenderer.send('edit-video-collection', idVideo, VideoCollection, chosenTags);
    editVideoCollection.reset();
});





//* Funciones editar listas de reproducción
//* Se obtienen los datos de la playlist seleccionada para su edición y se rellena el formulario con los datos del playlist.
function editPlaylist(id, comment, tags) {
    let tagsCadenaEditPlaylist = [];
    chosenTagsEditPlaylist = [];
    idPlaylist = id;
    document.getElementById("commentPlaylist").value = comment;
    labelTagsEditPlaylist.innerHTML = ``;
    tagsCadenaEditPlaylist = tags.split(",");
    tagsCadenaEditPlaylist.forEach(tag => {
        chosenTagsEditPlaylist.push(tag);
        labelTagsEditPlaylist.innerHTML += `
        <label for="description">${tag} </label>
        <a onClick="sendDataDeletedTag('${tag}','labelTagsEditPlaylist')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg></a>
    `;
    })
}

//* Se registran los datos del formulario para añadir el canal a la colección y se envían los datos para entrar en la base de datos de edición de la lista de reproducción.
editPlayListCollection.addEventListener('submit', (e) => {
    const playListCollection = {
        comment: document.getElementById("commentPlaylist").value,
    };
    ipcRenderer.send('edit-playlist-collection', idPlaylist, playListCollection, chosenTagsEditPlaylist);
    editPlayListCollection.reset();
})

//* Funciones editar canal
//* Se obtienen los datos del canal seleccionado para su edición y se rellena el formulario con los datos del canal.
function editChannel(id, comment, tags) {
    let tagsCadenaEditChannel = [];
    chosenTagsEditChannel = [];
    idChannel = id;
    document.getElementById("commentChannel").value = comment;
    labelTagsEditChannel.innerHTML = ``;
    tagsCadenaEditChannel = tags.split(",");
    tagsCadenaEditChannel.forEach(tag => {
        chosenTagsEditChannel.push(tag);
        labelTagsEditChannel.innerHTML += `
        <label for="description">${tag} </label>
        <a onClick="sendDataDeletedTag('${tag}','labelTagsEditChannel')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg></a>
    `;
    })
}


//* Los datos del formulario para añadir el canal a la colección se registran y los datos se envían para entrar en la base de datos.
editChannelCollection.addEventListener('submit', (e) => {
    const channelCollection = {
        comment: document.getElementById("commentChannel").value,
    };
    ipcRenderer.send('edit-channel-collection', idChannel, channelCollection, chosenTagsEditChannel);
    editChannelCollection.reset();
})


//*  La respuesta se obtiene del back end y los tag que se obtienen se mostraran al cliente en una lista.
ipcRenderer.on('search-tag', (e, tags,selectTag) => {
    console.log(selectTag)
    document.getElementById(selectTag).innerHTML = '';
    if(selectTag == 'selectTag'){
        tags.forEach(tag_user => {
            document.getElementById(selectTag).innerHTML += `
            <a class="btn btn-danger" onClick="sendDataSelectTag('${tag_user._doc.tag}','labelTags')">${tag_user._doc.tag}</a>
            `;
        });
    }else if(selectTag == 'selectTagEditPlaylist'){
        tags.forEach(tag_user => {
            document.getElementById(selectTag).innerHTML += `
            <a class="btn btn-danger" onClick="sendDataSelectTag('${tag_user._doc.tag}','labelTagsEditPlaylist')">${tag_user._doc.tag}</a>
            `;
        });
    }else {
        tags.forEach(tag_user => {
            document.getElementById(selectTag).innerHTML += `
            <a class="btn btn-danger" onClick="sendDataSelectTag('${tag_user._doc.tag}','labelTagsEditChannel')">${tag_user._doc.tag}</a>
            `;
        });
    }
   
});

//* Fución para enviar datos a la función selectionTag de la libreria del tag.
function sendDataSelectTag(tag,labelTags) {
    if (labelTags == 'labelTags') {
        chosenTags = selectionTag(tag,labelTags,chosenTags);
    }else if(labelTags == 'labelTagsEditPlaylist'){
        chosenTagsEditPlaylist = selectionTag(tag,labelTags,chosenTagsEditPlaylist );
    }else{
        chosenTagsEditChannel = selectionTag(tag,labelTags,chosenTagsEditChannel);
    }
}

//* Fución para enviar datos a la función deletedTag de la libreria del tag.
function sendDataDeletedTag(tag,labelTags) {
    if (labelTags == 'labelTags') {
        chosenTags = deletedTag(tag,labelTags,chosenTags);
    }else if(labelTags == 'labelTagsEditPlaylist'){
        chosenTagsEditPlaylist = deletedTag(tag,labelTags,chosenTagsEditPlaylist );
    }else{
        chosenTagsEditChannel = deletedTag(tag,labelTags,chosenTagsEditChannel);
    }
}

//* Fución para enviar datos a la función saveTag de la libreria del tag. 
function SelectSaveTag(tagInput,noSave,save) {
    if (tagInput == 'tag') {
        chosenTags = saveTag(tagInput,noSave,save,'labelTags',chosenTags);
    }else if(tagInput == 'tagEditPlaylist'){
        chosenTagsEditPlaylist = saveTag(tagInput,noSave,save,'labelTagsEditPlaylist',chosenTagsEditPlaylist);
    }else{
        chosenTagsEditChannel = saveTag(tagInput,noSave,save,'labelTagsEditChannel',chosenTagsEditChannel);
    }
}

//* La ventana se recarga al editar un recurso de la colección.
ipcRenderer.on('edit-video-playlist-channel-collection', (e) => {
    location.reload();
})