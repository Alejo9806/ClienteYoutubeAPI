
const newCollection = document.getElementById("newCollection");
const editCollection = document.getElementById("editCollection");
const tagInput = document.getElementById("tag");
const tagInputEdit = document.getElementById("tagEdit");
const saveTag = document.getElementById("saveTag");
const save = document.getElementById("save");
const noSave = document.getElementById("noSave");
const saveTagEdit = document.getElementById("saveTagEdit");
const saveEdit = document.getElementById("saveEdit");
const noSaveEdit = document.getElementById("noSaveEdit");
const labelTags = document.getElementById("labelTags");
const slectTag = document.getElementById("slectTag");
const slectTagEdit = document.getElementById("slectTagEdit");
const labelTagsEdit = document.getElementById("labelTagsEdit");
let chosenTags =[];
let chosenTagsEdit =[];

document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('collection');

})

//* Mostrar la informacion en una tabla de las colleciones.

ipcRenderer.on('collection',(e,collections)=>{
    console.log(collections);
    let listOfCollection=document.getElementById("tableCollection");
    listOfCollection.innerHTML='';
    collections.forEach( (collection,i) => {
        listOfCollection.innerHTML+= `
        <tr>
        <th scope="row">${i}</th>
        <td><a onClick="getCollection('${collection.title}')" style="cursor:pointer">${collection.title}</a></td>
        <td>${collection.description}</td>
        <td><a style="cursor:pointer" data-toggle="modal" data-target="#modalEditCollection" onClick="getEditCollection('${collection.title}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
        |</svg></a></td>
      </tr>
        `
    });
});

//* Nueva collecion funciones 

newCollection.addEventListener('submit',(e)=>{
    const collection = {
        title: document.getElementById("titleCollection").value,
        description: document.getElementById("description").value,
    };
    ipcRenderer.send('new-collection',collection,chosenTags);
    newCollection.reset();
});



function keyPressValue(){
    const searchTag = tagInput.value;
    console.log(searchTag);
    ipcRenderer.send('search-tag',searchTag);
}

saveTag.addEventListener('click',(e)=>{
    const tags = tagInput.value;
    if(tags != ""){
        ipcRenderer.send('new-tag',tags);
        ipcRenderer.on('new-tag',(e,mss)=>{
            save.innerHTML = mss;
            tagInput.value = ""; 
            selectionTag(tags);
        });      
    }else{
        noSave.innerHTML = "Ingrese un tag para guardar"; 
        save.innerHTML = "";
        tagInput.value = ""; 
    }
});

ipcRenderer.on('search-tag',(e,tags)=>{
    console.log(tags);
    slectTag.innerHTML='';
    slectTagEdit.innerHTML='';
    tags.forEach(tag_user => {
        slectTag.innerHTML+= `
        <a class="btn btn-danger" onClick="selectionTag('${tag_user._doc.tag}')">${tag_user._doc.tag}</a>
        `;
        slectTagEdit.innerHTML+= `
        <a class="btn btn-danger" onClick="selectionTagEdit('${tag_user._doc.tag}')">${tag_user._doc.tag}</a>
        `;
    });
});

function selectionTag(tag) {

    let someTag = chosenTags.filter(choseTag => { return choseTag == tag});
    if (someTag.length ===0) {
        chosenTags.push(tag);
    }

    labelTags.innerHTML = "";
    chosenTags.forEach(tagSelected=> {
        labelTags.innerHTML+= `
        <label for="description">${tagSelected} </label>
        <a onClick="deletedTag('${tagSelected}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
      </svg></a>
        `
    });
}

function deletedTag(tag) {
    chosenTags.map((value,i)=>{
        if (value === tag)  {
            chosenTags.splice(i,1);
        }
    })
    if (!chosenTags.length) {
        labelTags.innerHTML ="";
    }else{ 
        labelTags.innerHTML ="";
        chosenTags.forEach(tagSelected=> {
            console.log(tagSelected);
            labelTags.innerHTML+= `
            <label for="description">${tagSelected} </label>
            <a onClick="deletedTag('${tagSelected}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg></a>
        `;
        });
    }
}

//* Acceder a la collecion selecionada 
function getCollection(title) {
    console.log(title);
    ipcRenderer.send('get-collection',title);
    window.location.href = './collectionResource.ejs';
}


//* Funciones para editar una collecion.
function getEditCollection(title) {
    console.log(title);
    ipcRenderer.send('get-collection',title);
    ipcRenderer.send('get-edit-collection',title);
    ipcRenderer.on('get-edit-collection',(e,collection)=>{
        chosenTagsEdit = [];
        tagInputEdit.value = "";
        slectTag.innerHTML = ``;
        slectTagEdit.innerHTML = ``;
        console.log(collection._doc);
        document.getElementById('titleCollectionEdit').value = collection._doc.title;
        document.getElementById('descriptionEdit').value = collection._doc.description;
        document.getElementById('labelTagsEdit').innerHTML = '';
        collection._doc.tags.forEach(tag =>{
            chosenTagsEdit.push(tag);
            document.getElementById('labelTagsEdit').innerHTML+= `
            <label for="description">${tag} </label>
            <a onClick="deletedTagEdit('${tag}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg></a>
        `;
        })
    })
}

editCollection.addEventListener('submit',(e)=>{
    const collection = {
        title: document.getElementById("titleCollectionEdit").value,
        description: document.getElementById("descriptionEdit").value,
    };
    ipcRenderer.send('edit-collection',collection,chosenTagsEdit);
    editCollection.reset();
})

function selectionTagEdit(tag) {

    let someTag = chosenTagsEdit.filter(choseTag => { return choseTag == tag});
    if (someTag.length ===0) {
        chosenTagsEdit.push(tag);
    }

    labelTagsEdit.innerHTML = "";
    chosenTagsEdit.forEach(tagSelected=> {
        labelTagsEdit.innerHTML+= `
        <label for="description">${tagSelected} </label>
        <a onClick="deletedTagEdit('${tagSelected}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
      </svg></a>
        `
    });
}

function keyPressValueEdit(){
    const searchTag = tagInputEdit.value;
    console.log(searchTag);
    ipcRenderer.send('search-tag',searchTag);
}

saveTagEdit.addEventListener('click',(e)=>{
    const tags = tagInputEdit.value;
    if(tags != ""){
        ipcRenderer.send('new-tag',tags);
        ipcRenderer.on('new-tag',(e,mss)=>{
            saveEdit.innerHTML = mss;
            tagInputEdit.value = ""; 
            selectionTagEdit(tags);
        });      
    }else{
        noSaveEdit.innerHTML = "Ingrese un tag para guardar"; 
        saveEdit.innerHTML = "";
        tagInputEdit.value = ""; 
    }
});


function deletedTagEdit(tag) {
    console.log(chosenTagsEdit)
    chosenTagsEdit.map((value,i)=>{
        if (value === tag)  {
            chosenTagsEdit.splice(i,1);
        }
    })
    if (!chosenTagsEdit.length) {
        labelTagsEdit.innerHTML ="";
    }else{ 
        labelTagsEdit.innerHTML ="";
        chosenTagsEdit.forEach(tagSelected=> {
            console.log(tagSelected);
            labelTagsEdit.innerHTML+= `
            <label for="description">${tagSelected} </label>
            <a onClick="deletedTagEdit('${tagSelected}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg></a>
        `;
        });
    }
}