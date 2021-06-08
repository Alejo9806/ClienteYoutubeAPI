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


document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('playList');
    ipcRenderer.send('collection');
})

ipcRenderer.on('playList',(e,playList)=>{
    let listOfPlaylist=document.getElementById("playList"); 
    listOfPlaylist.innerHTML=''
    for(let i=0; i< playList.length;i++){
        listOfPlaylist.innerHTML += `<div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4"> 
        <img class="card-img-top img-fluid border border-secondary" src="${playList[i].image.url}" alt="Card image cap" onClick="getItems('${playList[i].id}')">
        <div class="card-body border  border-secondary"  onClick="getItems('${playList[i].id}')"> 
            <h6 class="card-title text-dark overflow" title="${playList[i].title}">${playList[i].title}</h6> 
            <p class="channel-color">${playList[i].channelTitle}</p>
           
        </div>  
        <div class="card-footer border  border-secondary">
            <button type="button" class="btn btn-dark w-100" data-toggle="modal" data-target="#modalCollectionPlaylist" onClick="playListCollectionModal('${playList[i].id}','${playList[i].date}')">Agregar a coleccion</button>
        </div>  
    </div>`
    }
});

function getItems(string) {
    console.log("hola");
    ipcRenderer.send('playlisId',string);
    window.location.href = "./playListItems.ejs";
  
}

function playListCollectionModal(id,date) {
    ipcRenderer.send('playList-collection-modal',id,date);
}

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

ipcRenderer.on('playList-collection-modal',(e,id,date)=>{
    console.log(id,date)
    playListId = id;
    playListDate = date;
});


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
    tags.forEach(tag_user => {
        slectTag.innerHTML+= `
        <a class="btn btn-danger" onClick="selectionTag('${tag_user._doc.tag}')">${tag_user._doc.tag}</a>
        `
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
