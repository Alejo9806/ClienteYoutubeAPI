let channel = document.getElementById("channel");
let newChannelCollection = document.getElementById("newChannelCollection");
const tagInput = document.getElementById("tag");
const saveTag = document.getElementById("saveTag");
const save = document.getElementById("save");
const noSave = document.getElementById("noSave");
const labelTags = document.getElementById("labelTags");
const slectTag = document.getElementById("slectTag");
let chosenTags =[];
let idChannel;
let dateChannel;


document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('getChannel');
    ipcRenderer.send('collection');
});


ipcRenderer.on('getChannel',(e,channelDetails)=>{
    console.log(channelDetails);
    channel.innerHTML =  ` 
    <div class="container" style="background-image: url('${channelDetails.imageBanner}'); height:400px;background-repeat: no-repeat;background-size: 100% 100%; background-position: center center;">
    </div>
    <div class="container mt-4">
        <img src="${channelDetails.thumbnails}" alt="${channelDetails.title}" class="img-circle border rounded-circle d-inline">
        <div class="d-inline">
            <h3 class="text-dark ml-2 d-inline">${channelDetails.title}</h3>
            <p class="text-muted font-weight-normal h6 d-inline">${channelDetails.subscriberCount} de suscriptores</p>
        </div>
        <div class="float-right">
            <a class="btn btn-dark">SUSCRITO</a>
            <a class="btn btn-dark" data-toggle="modal" data-target="#modalCollectionChannel" onClick="channelCollectionModal('${channelDetails.id}','${channelDetails.publishedAt}')">COLECCIÓN</a>
        </div>
    </div>
    ` 
});

function channelCollectionModal(id,date) {
    idChannel= id;
    dateChannel= date;
}

ipcRenderer.on('collection',(e,collections)=>{
    console.log(collections);
    let selectedCollection = document.getElementById("selectedCollectionChannel");
    selectedCollection.innerHTML ='<option selected value="" >Open this select menu</option>';
    collections.forEach( (collection) => {
        selectedCollection.innerHTML+=`
        <option value="${collection.title}">${collection.title}</option>
        `
    });
});

newChannelCollection.addEventListener('submit',(e)=>{
    let collection = document.getElementById("selectedCollectionChannel").value;
    const channel= {
        type:'CHANNEL',
        date:dateChannel,
        id:idChannel,
        comment:document.getElementById("comment").value
    };
    console.log(collection,channel)
    ipcRenderer.send('new-channel-collection',channel,collection,chosenTags);
    newChannelCollection.reset();
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