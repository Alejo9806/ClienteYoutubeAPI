//* Importación de metodos para los tags
const { transformTime } = require('../../src/libs/time');
const {keyPressValue,selectionTag,deletedTag,saveTag} = require('../../src/libs/tags');

//* variables globales 
const newVideoCollection = document.getElementById("newVideoCollection");
let chosenTags = [];
let videoId;
let videoDate;

//* Cargar el modal y hacer una llamada para recuperar la información de las colecciones.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('collection');

})

//* Recuperar la información de las colecciones y hacer una lista con las colecciones.
ipcRenderer.on('collection', (e, collections) => {
    let selectedCollection = document.getElementById("selectedCollection");
    selectedCollection.innerHTML = '<option selected value="" >Open this select menu</option>';
    collections.forEach((collection) => {
        selectedCollection.innerHTML += `
        <option value="${collection.title}">${collection.title}</option>
        `
    });

});

//* Se obtiene la informacion del video que se quiere agregar a una colección con el tiempo para cambiar la barra del tiempo.
ipcRenderer.on('video-collection-modal', (e, id, date, timeDuration) => {
    document.getElementById("startAt").value = 0;
    document.getElementById("endAt").value = 0;
    document.getElementById("startAtOutput").innerHTML = "0";
    document.getElementById("endAtOutput").innerHTML = "0";
    let time = transformTime(timeDuration);
    videoId = id;
    videoDate = date;
    document.getElementById("startAt").setAttribute("max", time);
    document.getElementById("endAt").setAttribute("max", time);
});

//* Los datos del formulario para añadir el video a la colección se registran y los datos se envían para entrar en la base de datos.
newVideoCollection.addEventListener('submit', (e) => {
    let collection = document.getElementById("selectedCollection").value;
    const video = {
        type: 'VIDEO',
        startAt: document.getElementById("startAt").value,
        endAt: document.getElementById("endAt").value,
        date: videoDate,
        id: videoId,
        comment: document.getElementById("comment").value
    };
    ipcRenderer.send('new-video-collection', video, collection, chosenTags);
    newVideoCollection.reset();
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


ipcRenderer.on('new-video-collection', (e, mss) => {

})