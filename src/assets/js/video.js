//* variables globales 
let id;
let date;
let idSubscription;
let dateChannel;
let idChannel;
let videoTime;
let commentList = document.getElementById("commentsList");

//* Cargar la página del video y hacer una llamada para recuperar la información del canal a partir de la api.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('getVideo');
    ipcRenderer.on('userInfo',(e,userInfo)=>{
        document.getElementById("imgProfileComment").setAttribute("src", userInfo.picture )
    })
    
});

//* Recuperar la información del video en la que se incluye informacion del canal que subio el video videos relacionados y comentarios para pintarla en la pantalla..
ipcRenderer.on('getVideo', (e, video, startAt, endAt, relatedVideos, channelDetails, channelSubscription, subscriptionId, dataComments) => {
    document.getElementById("video").setAttribute("src", "https://www.youtube.com/embed/" + video.id + '?autoplay=1&start=' + startAt + '&end=' + endAt);
    document.getElementById("title").innerHTML = video.title;
    document.getElementById("likes").innerHTML = video.likeCount;
    document.getElementById("viewCount").innerHTML = video.viewCount;
    document.getElementById("date").innerHTML = video.publishedAt.slice(0, 10);
    document.getElementById("dislikes").innerHTML = video.dislikeCount;
    document.getElementById("description").innerHTML = video.description;
    document.getElementById("commentCount").innerHTML = video.commentCount + " comentarios";
    let videosRelated = document.getElementById("related");
    let informationChannel = document.getElementById("informationChannel");
    videosRelated.innerHTML = ``;
    commentList.innerHTML = '';
    //* Se pintan los videos relacionados en patanlla.
    for (let i = 0; i < relatedVideos.length; i++) {
        if (relatedVideos[i]) {
            videosRelated.innerHTML += `
            <div>
                <img class="card-img-top img-fluid border border-secondary" src="${relatedVideos[i].image.url}" alt="Card image cap" onClick="video('${relatedVideos[i].videoId}')">
                <div class="card-body border  border-secondary"> 
                    <h6 class="card-title text-dark overflow" title="${relatedVideos[i].title}" onClick="video('${relatedVideos[i].videoId}')">${relatedVideos[i].title}</h6> 
                    <p class="channel-color" onClick="getChannel('${relatedVideos[i].channelId}')">${relatedVideos[i].channelTitle}</p>
                    <p class="channel-color">Publicacion: ${relatedVideos[i].date.slice(0,10)}</p>           
                </div>  
                <div class="card-footer border  border-secondary">
                <button type="button" class="btn btn-dark mb-1 w-100" data-toggle="modal" data-target="#modalCollection" onClick="videoCollectionModal('${relatedVideos[i].videoId}','${relatedVideos[i].date}')">Agregar a colección</button>
                <button type="button" class="btn btn-dark w-100" data-toggle="modal" data-target="#modalPlaylist" onClick="videoPlaylistModal('${relatedVideos[i].videoId}')">Agregar a playlist </button>
                </div>
            </div>  `
        }
    }
    //* Se pintan la informacion del canal si el usuario esta suscrito al canal se pinta de una si no se pinta de otra manera.
    if (channelSubscription) {
        informationChannel.innerHTML = ` 
        <p id="unsubscribedMss"></p>
        <div class="container">
            <img src="${channelDetails.thumbnails}" alt="${channelDetails.title}" class="img-circle border rounded-circle d-inline">
            <div class="d-inline">
                <h3 class="text-dark ml-2 d-inline">${channelDetails.title}</h3>
                <p class="text-muted font-weight-normal h6 d-inline">${channelDetails.subscriberCount} de suscriptores</p>
            </div>
            <div class="float-right">
                <a class="btn btn-dark" data-toggle="modal" data-target="#unsubscriptionModal" onClick="sendId('${subscriptionId}','${channelDetails.publishedAt}','${channelDetails.id}')"">SUSCRITO</a>
            </div>
        </div>
        `
    } else {
        informationChannel.innerHTML = ` 
        <p id="unsubscribedMss"></p>
        <div class="container">
            <img src="${channelDetails.thumbnails}" alt="${channelDetails.title}" class="img-circle border rounded-circle d-inline">
            <div class="d-inline">
                <h3 class="text-dark ml-2 d-inline">${channelDetails.title}</h3>
                <p class="text-muted font-weight-normal h6 d-inline">${channelDetails.subscriberCount} de suscriptores</p>
            </div>
            <div class="float-right" id="subscribed">
                <a class="btn btn-dark" data-toggle="modal" data-target="#subscriptionModal" onClick="subscription('${channelDetails.id}','${channelDetails.publishedAt}')">SUSCRIBIRSE</a>
            </div>
        </div>
        `
    }
    //* Se pintan los comentarios del canal.
    if (dataComments) { 
        dataComments.forEach(element => {
            commentList.innerHTML += ` 
                <br>
                <br>
                <img src="${element.authorProfileImageUrl}" alt="${element.authorDisplayName}" class="img-circle border rounded-circle d-inline " height="40px">
                <h6 class="d-inline ml-3">${element.authorDisplayName}  ${element.publishedAt.slice(0,10)}</h6>
                <br>
                <br>
                <p>${element.textDisplay}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-hand-thumbs-up d-inline" viewBox="0 0 16 16">
                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                </svg> <h6 class="d-inline">${element.likeCount}</h6>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
            </svg>${element.totalReplyCount} respuesta</h6>
            `;
        });
    }
    
    id = video.id;
    date = video.publishedAt;
    videoTime = video.duration;
});



//* Escucha el evento submit del formulario de comentario obtiene el string y lo envia junto al id del video para ser tratado en la api.
document.getElementById("commentForm").addEventListener('submit', e => {
    let comment = document.getElementById("commentText").value;
    ipcRenderer.send('sendComment', id, comment);
    e.preventDefault();
});

//* Al abrir el modal para añadir a la colección, se envía el id del video y la fecha de creación.
document.getElementById("collectionButton").addEventListener('click', e => {
    ipcRenderer.send('video-collection-modal', id, date, videoTime);
});

//* Los datos se envían al modal de la lista de reproducción de vídeo para poder agregar el video a una o varias listas de reproducción. 
document.getElementById("playlistButton").addEventListener('click', e => {
    ipcRenderer.send('video-playlist-modal', id);
});

//* Al abrir el modal para añadir a la colección, se envía el id del video y la fecha de creación.
function videoCollectionModal(id, date, time) {
    ipcRenderer.send('video-details', id);
    ipcRenderer.on('video-details', (e, videoDetails) => {
        ipcRenderer.send('video-collection-modal', id, date, videoDetails.duration);
    })
}

//* Los datos se envían al modal de la lista de reproducción de vídeo para poder agregar el video a una o varias listas de reproducción. 
function videoPlaylistModal(id) {

    ipcRenderer.send('video-playlist-modal', id);
}

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


//* La función para suscribirse envia el id del canal para que la api haga una peticion tipo post para hacer la subscripcion, al canal también cambia la vista para actualizar el botón por suscriptor por eso escucha el envento desde el back end.
function subscription(id, publishedAt) {

    ipcRenderer.send('subscription', id);
    ipcRenderer.on('subscription', (e, mss, subscriptionId) => {
        document.getElementById("subcriptionMss").innerHTML = `<p>${mss}</p>`
        if (mss == "Te has suscrito al canal") {
            document.getElementById("subscribed").innerHTML = ` 
            <a class="btn btn-dark" data-toggle="modal" data-target="#unsubscriptionModal" onClick="sendId('${subscriptionId}','${publishedAt}','${id}')">SUSCRITO</a>
            <a class="btn btn-dark" data-toggle="modal" data-target="#modalCollectionChannel" onClick="channelCollectionModal('${id}','${publishedAt}')">COLECCIÓN</a>
            `
        }

    })
}

//* Función para cancelar la suscripción al canal y también cambiar la vista para actualizar el botón de suscripción.
function unsubscribe() {
    ipcRenderer.send('unsubscribed', idSubscription);
    ipcRenderer.on('unsubscribed', (e, mss) => {
        document.getElementById("unsubscribedMss").innerHTML = `${mss}`;
        if (mss == "Se elimino la suscripcion") {
            document.getElementById("subscribed").innerHTML = ` 
            <a class="btn btn-dark" data-toggle="modal" data-target="#subscriptionModal" onClick="subscription('${idChannel}','${dateChannel}')">SUSCRIBIRSE</a>
            <a class="btn btn-dark" data-toggle="modal" data-target="#modalCollectionChannel" onClick="channelCollectionModal('${idChannel}','${dateChannel}')">COLECCIÓN</a>
            `
        }
    })
}

//* La información del canal se envía para poder utilizar la función de cancelación de la suscripción.
function sendId(id, date, idchannels) {
    idSubscription = id;
    dateChannel = date;
    idChannel = idchannels;
}

//* Se escucha el evento desde el back en de enviar comentario y se pinta el nuevo comentario en la pantalla.
ipcRenderer.on('sendComment', (e, mss, comment) => {

    if (comment) {
        commentList.innerHTML += ` 
        <img src="${comment.authorProfileImageUrl}" alt="${comment.authorDisplayName}" class="img-circle border rounded-circle d-inline " height="40px">
        <h6 class="d-inline ml-3">${comment.authorDisplayName}  ${comment.publishedAt}</h6>
        <br>
        <br>
        <p>${comment.textDisplay}</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-hand-thumbs-up d-inline" viewBox="0 0 16 16">
            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
        </svg> <h6 class="d-inline">${comment.likeCount}</h6>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>${comment.totalReplyCount} respuestas</h6>
        `;
    } else {
        document.getElementById("commentFail").innerHTML = mss;
    }
})