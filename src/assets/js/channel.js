//* global variables 
let channel = document.getElementById("channel");
let newChannelCollection = document.getElementById("newChannelCollection");
const tagInput = document.getElementById("tag");
const saveTag = document.getElementById("saveTag");
const save = document.getElementById("save");
const noSave = document.getElementById("noSave");
const labelTags = document.getElementById("labelTags");
const slectTag = document.getElementById("slectTag");
let chosenTags = [];
let idChannel;
let dateChannel;
let idSubscription;


//* Load channel page and make a call to retrieve the channel information.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('getChannel');
    ipcRenderer.send('collection');
});

//* Retrieving information from the channel and painting it on the screen
ipcRenderer.on('getChannel', (e, channelDetails, channelSubscription, subscriptionId, videoTrailer) => {
    //* If the user is a subscriber to the channel entered, it will paint one way otherwise it will paint another way.
    if (channelSubscription) {
        channel.innerHTML = ` 
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
    } else {
        channel.innerHTML = ` 
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
    //* Video trailer of the channel not all channels have a trailer that's why you are wondering if you have one.
    if (videoTrailer) {
        document.getElementById("trailer").innerHTML = ` 
                <div class="row" onClick="video('${videoTrailer.videoId}')">
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
    }
});

//* Send id of selected video and load video window.
function video(string) {
    ipcRenderer.send('video', string, null, null);
    window.location.href = "./video.ejs";

}

//* When opening the modal to add to the collection, the channel id and creation date are sent.
function channelCollectionModal(id, date) {
    idChannel = id;
    dateChannel = date;
}
//* Function to subscribe to the channel also changes the view to update the button per subscriber.
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

//* Channel information is sent in order to use the unsubscribe function.
function sendId(id, date, idchannels) {
    idSubscription = id;
    dateChannel = date;
    idChannel = idchannels;
}


//* Function to unsubscribe to the channel and also change the view to update the subscribe button.
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

//* Retrieve information from the collections to create a list to choose from.
ipcRenderer.on('collection', (e, collections) => {
    let selectedCollection = document.getElementById("selectedCollectionChannel");
    selectedCollection.innerHTML = '<option selected value="" >Open this select menu</option>';
    collections.forEach((collection) => {
        selectedCollection.innerHTML += `
        <option value="${collection.title}">${collection.title}</option>
        `
    });
});


//* The data of the form to add the channel to the collection are registered and the data are sent to enter the database.
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

//* A search for the tag is performed each time a key is pressed in the input.
function keyPressValue() {
    const searchTag = tagInput.value;
    ipcRenderer.send('search-tag', searchTag);
}

//* The tag is sent to be saved in the database and verified if it is a valid tag to be entered.
saveTag.addEventListener('click', (e) => {
    const tags = tagInput.value;
    if (tags != "") {
        ipcRenderer.send('new-tag', tags);
        ipcRenderer.on('new-tag', (e, mss) => {
            save.innerHTML = mss;
            tagInput.value = "";
            selectionTag(tags);
        });
    } else {
        noSave.innerHTML = "Ingrese un tag para guardar";
        save.innerHTML = "";
        tagInput.value = "";
    }
});

//*  The response is obtained from the back in and the tag is set to select if it was in the database.
ipcRenderer.on('search-tag', (e, tags) => {
    slectTag.innerHTML = '';
    tags.forEach(tag_user => {
        slectTag.innerHTML += `
        <a class="btn btn-danger" onClick="selectionTag('${tag_user._doc.tag}')">${tag_user._doc.tag}</a>
        `
    });
});


//* The tag is added to an array to be stored in the collection. 
function selectionTag(tag) {

    let someTag = chosenTags.filter(choseTag => { return choseTag == tag });
    if (someTag.length === 0) {
        chosenTags.push(tag);
    }

    labelTags.innerHTML = "";
    chosenTags.forEach(tagSelected => {
        labelTags.innerHTML += `
        <label for="description">${tagSelected} </label>
        <a onClick="deletedTag('${tagSelected}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
      </svg></a>
        `
    });
}

//* The tag is deleted from the array if the tag is not wanted.
function deletedTag(tag) {
    chosenTags.map((value, i) => {
        if (value === tag) {
            chosenTags.splice(i, 1);
        }
    })
    if (!chosenTags.length) {
        labelTags.innerHTML = "";
    } else {
        labelTags.innerHTML = "";
        chosenTags.forEach(tagSelected => {
            labelTags.innerHTML += `
            <label for="description">${tagSelected} </label>
            <a onClick="deletedTag('${tagSelected}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg></a>
        `;
        });
    }
}