//* Importación de metodos para los tags
const {keyPressValue,selectionTag,deletedTag, saveTag} = require('../../src/libs/tags');

//* variables globales 
let channel = document.getElementById("channel");
let banner = document.getElementById("banner");
let newChannelCollection = document.getElementById("newChannelCollection");
let chosenTags = [];
let idChannel;
let dateChannel;
let idSubscription;


//* Cargar la página del canal y hacer una llamada para recuperar la información del canal a partir de la api.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('getChannel');
    ipcRenderer.send('collection');
});

//* Recuperar la información del canal y pintarla en la pantalla.
ipcRenderer.on('getChannel', (e, channelDetails, channelSubscription, subscriptionId, videoTrailer) => {
    //* Si el canal tiene un banner se le monstrara en pantalla.
    if (channelDetails.imageBanner) {
        banner.innerHTML = `  <div class="container" style="background-image: url('${channelDetails.imageBanner}'); height:400px;background-repeat: no-repeat;background-size: 100% 100%; background-position: center center;">
        </div>` 
    }
    //* Si el usuario es suscriptor del canal introducido, pintará de una manera, de lo contrario pintará de otra.
    if (channelSubscription) {
        channel.innerHTML = ` 
        <p id="unsubscribedMss"></p>
        
        <div class="container mt-4">
            <img src="${channelDetails.thumbnails}" alt="${channelDetails.title}" class="img-circle border rounded-circle d-inline">
            <div class="d-inline">
                <h3 class="text-dark ml-2 d-inline">${channelDetails.title}</h3>
                <p class="text-muted font-weight-normal h6 d-inline">${channelDetails.subscriberCount} de suscriptores</p>
            </div>
            <div class="float-right">
                <a class="btn btn-dark" data-toggle="modal" data-target="#unsubscriptionModal" onClick="sendId('${subscriptionId}','${channelDetails.publishedAt}','${channelDetails.id}')"">SUSCRITO</a>
                <a class="btn btn-dark" data-toggle="modal" data-target="#modalCollectionChannel" onClick="channelCollectionModal('${channelDetails.id}','${channelDetails.publishedAt}')">COLECCIÓN</a>
            </div>
        </div>
        `
    } else {
        channel.innerHTML = ` 
        <p id="unsubscribedMss"></p>
        <div class="container mt-4">
            <img src="${channelDetails.thumbnails}" alt="${channelDetails.title}" class="img-circle border rounded-circle d-inline">
            <div class="d-inline">
                <h3 class="text-dark ml-2 d-inline">${channelDetails.title}</h3>
                <p class="text-muted font-weight-normal h6 d-inline">${channelDetails.subscriberCount} de suscriptores</p>
            </div>
            <div class="float-right" id="subscribed">
                <a class="btn btn-danger" data-toggle="modal" data-target="#subscriptionModal" onClick="subscription('${channelDetails.id}','${channelDetails.publishedAt}')">SUSCRIBIRSE</a>
                <a class="btn btn-dark" data-toggle="modal" data-target="#modalCollectionChannel" onClick="channelCollectionModal('${channelDetails.id}','${channelDetails.publishedAt}')">COLECCIÓN</a>
            </div>
        </div>
        `
    }
    //* Video trailer del canal no todos los canales tienen un trailer por eso se oregunta si tienes uno.
    if (videoTrailer) {
        document.getElementById("trailer").innerHTML = ` 
                <div class="row" >
                <div class = "col-6">
                    <img src="${videoTrailer.image.url}" onClick="video('${videoTrailer.videoId}')"alt="">
                </div>
                <div class="col-6">
                    <h5 onClick="video('${videoTrailer.videoId}')">${videoTrailer.title}</h5>
                    <h6>Publicacion: ${videoTrailer.date.slice(0,10)}</h6>
                    <p id="descriptionC" class="description">${videoTrailer.description} </p>
                    <a class="more text-dark" id="moreC">MOSTRAR MÁS</a>
                    <a class="less text-dark" id="lessC">MOSTRAR MENOS</a>
                </div>
                </div>
                `
        //* Estilos para la descripcion del video

        document.getElementById("moreC").addEventListener('click', (e) => {
            $('#descriptionC').css({
                "display": "-webkit-box",
                "-webkit-line-clamp": "60",
                "-webkit-box-orient": "vertical",
                "overflow": "visible",
            });
            $('#moreC').css({
                "overflow": "hidden",
                "display": "none"
            });
            $('#lessC').css({
                "display": "block",
                "cursor": "pointer"
            });
        
        })

        document.getElementById("lessC").addEventListener('click',(e)=>{
            $('#descriptionC').css({
                "display": "-webkit-box",
                "-webkit-line-clamp": "2",
                "-webkit-box-orient": "vertical",
                "overflow": "hidden",
            " text-overflow": "ellipsis"
            });
            $('#lessC').css({
                "overflow": "hidden",
                "display": "none"
            });
            $('#moreC').css({
                "display": "block",
                "text-decoration": "none !important"
            });
        })
    }

});

//* Envía la id del vídeo seleccionado y carga la ventana de vídeo.
function video(string) {
    ipcRenderer.send('video', string, null, null);
    window.location.href = "./video.ejs";

}

//* Al abrir el modal para añadir a la colección, se envía el id del canal y la fecha de creación.
function channelCollectionModal(id, date) {
    idChannel = id;
    dateChannel = date;
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

//* La información del canal se envía para poder utilizar la función de cancelación de la suscripción.
function sendId(id, date, idchannels) {
    idSubscription = id;
    dateChannel = date;
    idChannel = idchannels;
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

//* Recuperar información de las colecciones para crear una lista de la que elegir.
ipcRenderer.on('collection', (e, collections) => {
    let selectedCollection = document.getElementById("selectedCollectionChannel");
    selectedCollection.innerHTML = '<option selected value="" >Open this select menu</option>';
    collections.forEach((collection) => {
        selectedCollection.innerHTML += `
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
        comment: document.getElementById("comment").value
    };
    ipcRenderer.send('new-channel-collection', channel, collection, chosenTags);
    newChannelCollection.reset();
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



