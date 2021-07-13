let id;
let date;
let idSubscription;
let dateChannel;
let idChannel;

document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('getVideo');
});

ipcRenderer.on('getVideo', (e, video,startAt,endAt,relatedVideos,channelDetails,channelSubscription,subscriptionId) => {
    console.log(video,startAt,endAt,relatedVideos,channelDetails,channelSubscription,subscriptionId);
    document.getElementById("video").setAttribute("src", "https://www.youtube.com/embed/" + video.id+'?start='+startAt+'&end='+endAt);
    document.getElementById("title").innerHTML = video.title;
    document.getElementById("likes").innerHTML = video.likeCount;
    document.getElementById("viewCount").innerHTML = video.viewCount;
    document.getElementById("date").innerHTML = video.publishedAt.slice(0,10);
    document.getElementById("dislikes").innerHTML = video.dislikeCount;
    document.getElementById("description").innerHTML = video.description;
    document.getElementById("commentCount").innerHTML = video.commentCount + " comentarios";
    let videosRelated = document.getElementById("related");
    let informationChannel = document.getElementById("informationChannel");
    videosRelated.innerHTML =  ``;
    for(let i=0; i< relatedVideos.length;i++){
        if(relatedVideos[i]){
            videosRelated.innerHTML+= `
            <div>
                <img class="card-img-top img-fluid border border-secondary" src="${relatedVideos[i].image.url}" alt="Card image cap" onClick="video('${relatedVideos[i].videoId}')">
                <div class="card-body border  border-secondary"> 
                    <h6 class="card-title text-dark overflow" title="${relatedVideos[i].title}" onClick="video('${relatedVideos[i].videoId}')">${relatedVideos[i].title}</h6> 
                    <p class="channel-color" onClick="getChannel('${relatedVideos[i].channelId}')">${relatedVideos[i].channelTitle}</p>
                    <p class="channel-color">Publicacion: ${relatedVideos[i].date.slice(0,10)}</p>           
                </div>  
                <div class="card-footer border  border-secondary">
                <button type="button" class="btn btn-dark mb-1 w-100" data-toggle="modal" data-target="#modalCollection" onClick="videoCollectionModal('${relatedVideos[i].videoId}','${relatedVideos[i].date}')">Agregar a colección</button>
                <button type="button" class="btn btn-dark w-100" data-toggle="modal" data-target="#modalPlaylist" onClick="videoPlaylistModal('${relatedVideos[i].videoId}')">Agregar a playlist </button>
                </div>
            </div>  ` 
        }
    }
    if(channelSubscription){
        informationChannel.innerHTML =  ` 
        <p id="unsubscribedMss"></p>
        <div class="container">
            <img src="${channelDetails.thumbnails}" alt="${channelDetails.title}" class="img-circle border rounded-circle d-inline">
            <div class="d-inline">
                <h3 class="text-dark ml-2 d-inline">${channelDetails.title}</h3>
                <p class="text-muted font-weight-normal h6 d-inline">${channelDetails.subscriberCount} de suscriptores</p>
            </div>
            <div class="float-right">
                <a class="btn btn-dark" data-toggle="modal" data-target="#unsubscriptionModal" onClick="sendId('${subscriptionId}','${channelDetails.publishedAt}','${channelDetails.id}')"">SUSCRITO</a>
            </div>
        </div>
        ` 
    }else{
        informationChannel.innerHTML =  ` 
        <p id="unsubscribedMss"></p>
        <div class="container">
            <img src="${channelDetails.thumbnails}" alt="${channelDetails.title}" class="img-circle border rounded-circle d-inline">
            <div class="d-inline">
                <h3 class="text-dark ml-2 d-inline">${channelDetails.title}</h3>
                <p class="text-muted font-weight-normal h6 d-inline">${channelDetails.subscriberCount} de suscriptores</p>
            </div>
            <div class="float-right" id="subscribed">
                <a class="btn btn-dark" data-toggle="modal" data-target="#subscriptionModal" onClick="subscription('${channelDetails.id}','${channelDetails.publishedAt}')">SUSCRIBIRSE</a>
            </div>
        </div>
        ` 
    }

    id = video.id;
    date = video.publishedAt;

});


document.getElementById("collectionButton").addEventListener('click',e=>{
    ipcRenderer.send('video-collection-modal',id,date);
});

document.getElementById("playlistButton").addEventListener('click',e=>{
    ipcRenderer.send('video-playlist-modal',id);
});

function videoCollectionModal(id,date) {
    ipcRenderer.send('video-collection-modal',id,date);
}

function videoPlaylistModal(id) {
    
    ipcRenderer.send('video-playlist-modal',id);
}


function video(string) {
    console.log("hola");
    ipcRenderer.send('video',string, null, null);
    window.location.href = "./video.ejs";
  
}

//* Get channel
function getChannel(channelId) {
    console.log("hola");
    ipcRenderer.send('channel',channelId);
    window.location.href = "./channel.ejs";
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
