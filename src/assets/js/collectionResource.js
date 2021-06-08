
const editPlayListCollection = document.getElementById("editPlayListCollection");
const editVideoCollection= document.getElementById("editVideoCollection");
const tagInput = document.getElementById("tag");
const tagInputEditPlaylist = document.getElementById("tagEditPlaylist");
const saveTag = document.getElementById("saveTag");
const save = document.getElementById("save");
const noSave = document.getElementById("noSave");
const saveTagEditPlaylist = document.getElementById("saveTagEditPlaylist");
const saveEditPlaylist = document.getElementById("saveEditPlaylist");
const noSaveEditPlaylist = document.getElementById("noSaveEditPlaylist");
const labelTags = document.getElementById("labelTags");
const slectTag = document.getElementById("slectTag");
const slectTagEditPlaylist = document.getElementById("slectTagEditPlaylist");
const labelTagsEditPlaylist = document.getElementById("labelTagsEditPlaylist");
let idVideo;
let idPlaylist;
let chosenTags =[];
let chosenTagsEditPlaylist =[];

document.addEventListener('DOMContentLoaded', (e)=>{
    ipcRenderer.send('get-collection-select');
})

ipcRenderer.on('get-collection-select', (e,videos,playList)=>{
    const videosCollection = document.getElementById('videosCollection');
    const playListCollection = document.getElementById('playListCollection');
    playListCollection.innerHTML='';
    videosCollection.innerHTML='';
    videos.forEach(element => {
            videosCollection.innerHTML+= `
                <div class="card col-lg-10 col-md-10 col-sm-10 col-10 bg-card border-0 mt-4" > 
                    <img class="card-img-top img-fluid border border-secondary" src="${element.image.url}" alt="Card image cap" onClick="video('${element.videoId}','${element.startAt}','${element.endAt}','${element.date}')">
                    <div class="card-body border  border-secondary" onClick="video('${element.videoId}')"> 
                        <h6 class="card-title text-dark overflow" title="${element.title}">${element.title}</h6> 
                        <p class="channel-color">${element.channelTitle}</p>
                        <p class="channel-color">Publicacion: ${element.date.slice(0,10)}</p>           
                    </div>  
                    <div class="card-footer border  border-secondary">
                    <a class="btn btn-danger" onClick="deleteVideoOrPlayList('${element.videoId}')">Borrar de la colección<a/>
                    <a class="btn btn-primary" data-toggle="modal" data-target="#modalCollectionEdit" onClick="editVideo('${element.videoId}','${element.comment}','${element.startAt}','${element.endAt}','${element.tags}')">Editar tags<a/>
                    </div> 
                </div>` 
    });
    playList.forEach(element => {
        playListCollection.innerHTML+= `
                <div class="card col-lg-10 col-md-10 col-sm-10 col-10 bg-card border-0 mt-4" > 
                    <img class="card-img-top img-fluid border border-secondary" src="${element.image.url}" alt="Card image cap" onClick="getItems('${element.id}')">
                    <div class="card-body border  border-secondary"> 
                        <h6 class="card-title text-dark overflow" title="${element.title}">${element.title}</h6> 
                        <p class="channel-color">${element.channelTitle}</p>
                        <p class="channel-color">Publicacion: ${element.date.slice(0,10)}</p>           
                    </div>  
                    <div class="card-footer border  border-secondary">
                    <a class="btn btn-danger" onClick="deleteVideoOrPlayList('${element.id}')">Borrar de la colección<a/>
                    <a class="btn btn-primary" data-toggle="modal" data-target="#modalCollectionPlaylistEdit" onClick="editPlaylist('${element.id}','${element.comment}','${element.tags}')">Editar tags<a/>
                    </div> 
                </div>` 
    })
   
})

//* Get video
function video(string,startAt,endAt,date) {
    console.log("hola");
    ipcRenderer.send('video',string,startAt,endAt,date);
    window.location.href = "./video.ejs";
  
}

//* Get items playlist
function getItems(string) {
    console.log("hola");
    ipcRenderer.send('playlisId',string);
    window.location.href = "./playListItems.ejs";
  
}

//* Delete video or playlist
function deleteVideoOrPlayList(id) {
    ipcRenderer.send('delete-video-playList',id);
}

ipcRenderer.on('delete-video-playList',(e)=>{
    location.reload();
})

//* funcitions edit video

function editVideo(id,comment,startAt,endAt,tags) {
    let tagsCadena = [];
    chosenTags = [];
    idVideo = id;
    if(startAt != null){
        document.getElementById("startAt").value = startAt;
    }
    if(endAt != null){
        document.getElementById("endAt").value = endAt;
    } 
    document.getElementById("comment").value = comment;
    labelTags.innerHTML = ``;
    tagsCadena = tags.split(",");
    tagsCadena.forEach(tag =>{
        chosenTags.push(tag);
        labelTags.innerHTML+= `
        <label for="description">${tag} </label>
        <a onClick="deletedTag('${tag}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg></a>
    `;
    })
}


editVideoCollection.addEventListener('submit',(e)=>{
    const VideoCollection = {
        startAt: document.getElementById("startAt").value,
        endAt: document.getElementById("endAt").value,
        comment:document.getElementById("comment").value,
    };
    ipcRenderer.send('edit-video-collection',idVideo,VideoCollection,chosenTags);
    editVideoCollection.reset();
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
    slectTagEditPlaylist.innerHTML='';
    tags.forEach(tag_user => {
        slectTag.innerHTML+= `
        <a class="btn btn-danger" onClick="selectionTag('${tag_user._doc.tag}')">${tag_user._doc.tag}</a>
        `;
        slectTagEditPlaylist.innerHTML+= `
        <a class="btn btn-danger" onClick="selectionTagEditPlaylist('${tag_user._doc.tag}')">${tag_user._doc.tag}</a>
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

//* Functions playlists
function editPlaylist(id,comment,tags) {
    let tagsCadenaEditPlaylist = [];
    chosenTagsEditPlaylist = [];
    idPlaylist = id;
    document.getElementById("commentPlaylist").value = comment;
    labelTagsEditPlaylist.innerHTML = ``;
    tagsCadenaEditPlaylist = tags.split(",");
    tagsCadenaEditPlaylist.forEach(tag =>{
        chosenTagsEditPlaylist.push(tag);
        labelTagsEditPlaylist.innerHTML+= `
        <label for="description">${tag} </label>
        <a onClick="deletedTagEditPlaylist('${tag}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg></a>
    `;
    })
}

editPlayListCollection.addEventListener('submit',(e)=>{
    const playListCollection = {
        comment: document.getElementById("commentPlaylist").value,
    };
    ipcRenderer.send('edit-playlist-collection',idPlaylist,playListCollection,chosenTagsEditPlaylist);
    editPlayListCollection.reset();
})

function selectionTagEditPlaylist(tag) {

    let someTag = chosenTagsEditPlaylist.filter(choseTag => { return choseTag == tag});
    if (someTag.length ===0) {
        chosenTagsEditPlaylist.push(tag);
    }

    labelTagsEditPlaylist.innerHTML = "";
    chosenTagsEditPlaylist.forEach(tagSelected=> {
        labelTagsEditPlaylist.innerHTML+= `
        <label for="description">${tagSelected} </label>
        <a onClick="deletedTagEditPlaylist('${tagSelected}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
      </svg></a>
        `
    });
}

function keyPressValueEditPlaylist(){
    const searchTag = tagInputEditPlaylist.value;
    console.log(searchTag);
    ipcRenderer.send('search-tag',searchTag);
}

saveTagEditPlaylist.addEventListener('click',(e)=>{
    const tags = tagInputEditPlaylist.value;
    if(tags != ""){
        ipcRenderer.send('new-tag',tags);
        ipcRenderer.on('new-tag',(e,mss)=>{
            saveEditPlaylist.innerHTML = mss;
            tagInputEditPlaylist.value = ""; 
            selectionTagEditPlaylist(tags);
        });      
    }else{
        noSaveEditPlaylist.innerHTML = "Ingrese un tag para guardar"; 
        saveEditPlaylist.innerHTML = "";
        tagInputEditPlaylist.value = ""; 
    }
});


function deletedTagEditPlaylist(tag) {
    console.log(chosenTagsEditPlaylist)
    chosenTagsEditPlaylist.map((value,i)=>{
        if (value === tag)  {
            chosenTagsEditPlaylist.splice(i,1);
        }
    })
    if (!chosenTagsEditPlaylist.length) {
        labelTagsEditPlaylist.innerHTML ="";
    }else{ 
        labelTagsEditPlaylist.innerHTML ="";
        chosenTagsEditPlaylist.forEach(tagSelected=> {
            console.log(tagSelected);
            labelTagsEditPlaylist.innerHTML+= `
            <label for="description">${tagSelected} </label>
            <a onClick="deletedTagEditPlaylist('${tagSelected}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg></a>
        `;
        });
    }
}

ipcRenderer.on('edit-video-playlist-collection',(e)=>{
    location.reload();
})
