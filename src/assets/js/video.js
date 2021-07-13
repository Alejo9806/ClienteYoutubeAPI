let id;
let date;

document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('getVideo');
});

ipcRenderer.on('getVideo', (e, video,startAt,endAt,relatedVideos) => {
    console.log(video,startAt,endAt,relatedVideos);
    document.getElementById("video").setAttribute("src", "https://www.youtube.com/embed/" + video.id+'?start='+startAt+'&end='+endAt);
    document.getElementById("title").innerHTML = video.title;
    document.getElementById("likes").innerHTML = video.likeCount;
    document.getElementById("dislikes").innerHTML = video.dislikeCount;
    document.getElementById("description").innerHTML = video.description;
    document.getElementById("commentCount").innerHTML = video.commentCount + " comentarios";
    let videosRelated = document.getElementById("related");
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

