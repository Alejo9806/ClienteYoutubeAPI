
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
let idSubscription;



document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('getChannel');
    ipcRenderer.send('collection');
});


ipcRenderer.on('getChannel',(e,channelDetails,channelSubscription,subscriptionId,videoTrailer)=>{
    console.log(channelDetails,channelSubscription,subscriptionId,videoTrailer);
    if(channelSubscription){
        channel.innerHTML =  ` 
        <p id="unsubscribedMss"></p>
        <div class="container" style="background-image: url('${channelDetails.imageBanner}'); height:400px;background-repeat: no-repeat;background-size: 100% 100%; background-position: center center;">
        </div>
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
    }else{
        channel.innerHTML =  ` 
        <p id="unsubscribedMss"></p>
        <div class="container" style="background-image: url('${channelDetails.imageBanner}'); height:400px;background-repeat: no-repeat;background-size: 100% 100%; background-position: center center;">
        </div>
        <div class="container mt-4">
            <img src="${channelDetails.thumbnails}" alt="${channelDetails.title}" class="img-circle border rounded-circle d-inline">
            <div class="d-inline">
                <h3 class="text-dark ml-2 d-inline">${channelDetails.title}</h3>
                <p class="text-muted font-weight-normal h6 d-inline">${channelDetails.subscriberCount} de suscriptores</p>
            </div>
            <div class="float-right" id="subscribed">
                <a class="btn btn-dark" data-toggle="modal" data-target="#subscriptionModal" onClick="subscription('${channelDetails.id}','${channelDetails.publishedAt}')">SUSCRIBIRSE</a>
                <a class="btn btn-dark" data-toggle="modal" data-target="#modalCollectionChannel" onClick="channelCollectionModal('${channelDetails.id}','${channelDetails.publishedAt}')">COLECCIÓN</a>
            </div>
        </div>
        ` 
    }
   document.getElementById("trailer").innerHTML = ` 
        <div class="row" onClick="video('${videoTrailer.videoId}','${videoTrailer.date}')">
        <div class = "col-6">
            <img src="${videoTrailer.image.url}" alt="">
        </div>
        <div class="col-6">
            <h5>${videoTrailer.title}</h5>
            <h6>Publicacion: ${videoTrailer.date.slice(0,10)}</h6>
            <p>
            ${videoTrailer.description}
            </p>
        </div>
        </div>
   ` 
});

function video(string,date) {
    console.log("hola");
    ipcRenderer.send('video',string, null, null, date);
    window.location.href = "./video.ejs";
  
}

function channelCollectionModal(id,date) {
    idChannel= id;
    dateChannel= date;
}

function subscription(id,publishedAt) {
    console.log(id)

    ipcRenderer.send('subscription',id);
    ipcRenderer.on('subscription',(e,mss, subscriptionId)=>{
        document.getElementById("subcriptionMss").innerHTML = `<p>${mss}</p>` 
        if(mss == "Te has suscrito al canal"){
            document.getElementById("subscribed").innerHTML = ` 
            <a class="btn btn-dark" data-toggle="modal" data-target="#unsubscriptionModal" onClick="sendId('${subscriptionId}','${publishedAt}','${id}')">SUSCRITO</a>
            <a class="btn btn-dark" data-toggle="modal" data-target="#modalCollectionChannel" onClick="channelCollectionModal('${id}','${publishedAt}')">COLECCIÓN</a>
            ` 
        }
      
    })
}

function unsubscribe() {
    console.log(idSubscription)
    ipcRenderer.send('unsubscribed',idSubscription);
    ipcRenderer.on('unsubscribed',(e,mss)=>{
        document.getElementById("unsubscribedMss").innerHTML=`${mss}`; 
        if(mss == "Se elimino la suscripcion"){
            document.getElementById("subscribed").innerHTML =` 
            <a class="btn btn-dark" data-toggle="modal" data-target="#subscriptionModal" onClick="subscription('${idChannel}','${dateChannel}')">SUSCRIBIRSE</a>
            <a class="btn btn-dark" data-toggle="modal" data-target="#modalCollectionChannel" onClick="channelCollectionModal('${idChannel}','${dateChannel}')">COLECCIÓN</a>
            ` 
        }
    })
}

function sendId(id,date,idchannels) {
    console.log(id)
    idSubscription = id;
    dateChannel = date;
    idChannel = idchannels;
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