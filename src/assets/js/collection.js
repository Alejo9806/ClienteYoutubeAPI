//* Importación de metodos para los tags
const {keyPressValue,selectionTag,deletedTag,saveTag} = require('../../src/libs/tags');

//* variables globales 
const newCollection = document.getElementById("newCollection");
const editCollection = document.getElementById("editCollection");
const tagInputEdit = document.getElementById("tagEdit");
const selectTagD = document.getElementById("selectTag");
const selectTagEditD = document.getElementById("selectTagEdit");
let chosenTags = [];
let chosenTagsEdit = [];

//* Cargar la página colección y hacer una llamada para recuperar la información de las colecciones a partir de la base de datos.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('collection');

})

//* Mostrar la información recuperada en una tabla de las colecciones.

ipcRenderer.on('collection', (e, collections) => {
    let listOfCollection = document.getElementById("tableCollection");
    listOfCollection.innerHTML = '';
    collections.forEach((collection, i) => {
        listOfCollection.innerHTML += `
        <tr>
        <th scope="row">${i}</th>
        <td><a onClick="getCollection('${collection.title}')" class="titleCollection">${collection.title}</a></td>
        <td>${collection.description}</td>
        <td><a style="cursor:pointer" data-toggle="modal" data-target="#modalEditCollection" onClick="getEditCollection('${collection.title}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
        |</svg></a></td>
        <td><a style="cursor:pointer" onClick="deleteCollection('${collection.title}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg></a></td>
      </tr>
        `
    });
});


//* Acceso a la colección seleccionada enviando titulo de la colección.
function getCollection(title) {
    ipcRenderer.send('get-collection', title);
    window.location.href = './collectionResource.ejs';
}



//*  La respuesta se obtiene del back end y los tag que se obtienen se mostraran al cliente en una lista.
ipcRenderer.on('search-tag', (e, tags,selectTag) => {
    document.getElementById(selectTag).innerHTML = '';
    if(selectTag == 'selectTag'){
        tags.forEach(tag_user => {
            document.getElementById(selectTag).innerHTML += `
            <a class="btn btn-danger" onClick="sendDataSelectTag('${tag_user._doc.tag}','labelTags')">${tag_user._doc.tag}</a>
            `;
        });
    }else{
        tags.forEach(tag_user => {
            document.getElementById(selectTag).innerHTML += `
            <a class="btn btn-danger" onClick="sendDataSelectTag('${tag_user._doc.tag}','labelTagsEdit')">${tag_user._doc.tag}</a>
            `;
        });
    }
   
});

//* Fución para enviar datos a la función selectionTag de la libreria del tag como tenemos un modal para editar preguntamos que tipo de modal vamos a utlizar.
function sendDataSelectTag(tag,labelTags) {
    if (labelTags == 'labelTags') {
        chosenTags = selectionTag(tag,labelTags,chosenTags);
    }else{
        chosenTagsEdit = selectionTag(tag,labelTags,chosenTagsEdit);
    }
}

//* Fución para enviar datos a la función deletedTag de la libreria del tag como tenemos un modal para editar preguntamos que tipo de modal vamos a utlizar. 
function sendDataDeletedTag(tag,labelTags) {
    if (labelTags == 'labelTags') {
        chosenTags = deletedTag(tag,labelTags,chosenTags);
    }else{
        chosenTagsEdit = deletedTag(tag,labelTags,chosenTagsEdit);
    }
}


//* Fución para enviar datos a la función saveTag de la libreria del tag como tenemos un modal para editar preguntamos que tipo de modal vamos a utlizar. 
function SelectSaveTag(tagInput,noSave,save) {
    if (tagInput == 'tag') {
        chosenTags = saveTag(tagInput,noSave,save,'labelTags',chosenTags);
    }else{
        chosenTagsEdit = saveTag(tagInput,noSave,save,'labelTagsEdit',chosenTagsEdit);
    }
}




//* Enviar los datos para guardar una nueva colección en la base de datos.

newCollection.addEventListener('submit', (e) => {
    e.preventDefault();
    const collection = {
        title: document.getElementById("titleCollection").value,
        description: document.getElementById("description").value,
    };
    ipcRenderer.send('new-collection', collection, chosenTags);
    ipcRenderer.on('new-collection',(e,mss)=>{
        if (mss) {
            document.getElementById('mssError').innerHTML=mss;
        }else{
            newCollection.reset();
            window.location.reload();
        }

    })
    
});

function deleteMss() {
    document.getElementById('mssError').innerHTML='';
}

//* Función para llenar los datos del formulario del modal de editar colección.
function getEditCollection(title) {
    ipcRenderer.send('get-collection', title);
    ipcRenderer.send('get-edit-collection', title);
    ipcRenderer.on('get-edit-collection', (e, collection) => {
        chosenTagsEdit = [];
        tagInputEdit.value = "";
        selectTagD.innerHTML = ``;
        selectTagEditD.innerHTML = ``;
        document.getElementById('titleCollectionEdit').value = collection._doc.title;
        document.getElementById('descriptionEdit').value = collection._doc.description;
        document.getElementById('labelTagsEdit').innerHTML = '';
        document.getElementById('mssErrorEdit').innerHTML='';
        collection._doc.tags.forEach(tag => {
            chosenTagsEdit.push(tag);
            document.getElementById('labelTagsEdit').innerHTML += `
            <label for="description">${tag} </label>
            <a onClick="sendDataDeletedTag('${tag}','labelTagsEdit')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg></a>
        `;
        })
    })
}

//* Funcion para borrar la coleccion de la base de datos
function deleteCollection(title) {
    ipcRenderer.send('delete-collection',title);
}

//*
ipcRenderer.on('delete-collection',(e)=>{
    window.location.reload();
})
//* Enviar los datos para actualizar la colección que se escogio para editar en la base de datos.
editCollection.addEventListener('submit', (e) => {
    e.preventDefault();
    const collection = {
        title: document.getElementById("titleCollectionEdit").value,
        description: document.getElementById("descriptionEdit").value,
    };
    ipcRenderer.send('edit-collection', collection, chosenTagsEdit);
    ipcRenderer.on('edit-collection',(e,mss)=>{
        if (mss) {
            document.getElementById('mssErrorEdit').innerHTML=mss;
        }else{
            editCollection.reset();
            window.location.reload();
        }

    })
})

