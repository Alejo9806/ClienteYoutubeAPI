//* global variables 
const newPlayListCollection = document.getElementById("newPlayListCollection");
const tagInput = document.getElementById("tag");
const saveTag = document.getElementById("saveTag");
const save = document.getElementById("save");
const noSave = document.getElementById("noSave");
const labelTags = document.getElementById("labelTags");
const slectTag = document.getElementById("slectTag");
let chosenTags =[];
let playListId;
let playListDate;

//* Load channel page and make a call to retrieve the playlist information.
document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('playList');
    ipcRenderer.send('collection');
})

//* Retrieving information from the playlist and painting it on the screen
ipcRenderer.on('playList',(e,playList)=>{
    let listOfPlaylist=document.getElementById("playList"); 
    listOfPlaylist.innerHTML=''
    for(let i=0; i< playList.length;i++){
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

//* Get items
function getItems(string) {
    console.log("hola");
    ipcRenderer.send('playlisId',string);
    window.location.href = "./playListItems.ejs";
  
}
//* Get channel
function getChannel(channelId) {
    console.log("hola");
    ipcRenderer.send('channel',channelId);
    window.location.href = "./channel.ejs";
}

//* Data are sent for the modal of the playlist collection
function playListCollectionModal(id,date) {
    ipcRenderer.send('playList-collection-modal',id,date);
}

//* Retrieve information from the collections to create a list to choose from.
ipcRenderer.on('collection',(e,collections)=>{
    console.log(collections);
    let selectedCollection = document.getElementById("selectedCollectionPlaylist");
    selectedCollection.innerHTML ='<option selected>Open this select menu</option>';
    collections.forEach( (collection) => {
        selectedCollection.innerHTML+=`
        <option value="${collection.title}">${collection.title}</option>
        `
    });
});

//* Playlist data is obtained to add to the collection.
ipcRenderer.on('playList-collection-modal',(e,id,date)=>{
    console.log(id,date)
    playListId = id;
    playListDate = date;
});

//* The data of the form to add the playlist to the collection are registered and the data are sent to enter the database.
newPlayListCollection.addEventListener('submit',(e)=>{
    let collection = document.getElementById("selectedCollectionPlaylist").value;
    const playList= {
        type:'PLAYLIST',
        date:playListDate,
        id:playListId,
        comment:document.getElementById("comment").value
    };
    console.log(collection,playList,chosenTags)
    ipcRenderer.send('new-playList-collection',playList,collection,chosenTags);
    newPlayListCollection.reset();
});

//* A search for the tag is performed each time a key is pressed in the input.
function keyPressValue(){
    const searchTag = tagInput.value;
    console.log(searchTag);
    ipcRenderer.send('search-tag',searchTag);
}

//* The tag is sent to be saved in the database and verified if it is a valid tag to be entered.
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

//*  The response is obtained from the back in and the tag is set to select if it was in the database.
ipcRenderer.on('search-tag',(e,tags)=>{
    console.log(tags);
    slectTag.innerHTML='';
    tags.forEach(tag_user => {
        slectTag.innerHTML+= `
        <a class="btn btn-danger" onClick="selectionTag('${tag_user._doc.tag}')">${tag_user._doc.tag}</a>
        `
    });
});

//* The tag is added to an array to be stored in the collection. 
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

//* The tag is deleted from the array if the tag is not wanted.
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

//* New playList 

document.getElementById("newPlayList").addEventListener('submit',(e)=>{
    let newPlayList = {
        title : document.getElementById("titlePlaylist").value,
        description: document.getElementById("descriptionPlaylist").value,
        status : document.getElementById("status").value
    }
    ipcRenderer.send('new-playList',newPlayList);
    location.reload();
})

//* Delete playlist 

function deletePlaylist(id) {
    ipcRenderer.send('delete-playList',id);
    location.reload();
}

ipcRenderer.on('delete-playList',(e,mss)=>{
    document.getElementById("mssDeletePlaylist").innerHTML = mss;
})