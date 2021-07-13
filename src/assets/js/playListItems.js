
document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('playListItems');
})

ipcRenderer.on('playListItems',(e,playListItems)=>{
    let listOfPlaylistItems = document.getElementById("playListItems"); 
    listOfPlaylistItems.innerHTML=''
    for(let i=0; i< playListItems.length;i++){
        listOfPlaylistItems.innerHTML += `<div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4" > 
        <img class="card-img-top img-fluid border border-secondary" src="${playListItems[i].image.url}" alt="Card image cap"  onClick="video('${playListItems[i].videoId}')">
        <div class="card-body border  border-secondary"> 
            <h6 class="card-title text-dark overflow" title="${playListItems[i].title}"  onClick="video('${playListItems[i].videoId}')">${playListItems[i].title}</h6> 
            <p class="channel-color" onClick="getChannel('${playListItems[i].videoOwnerChannelId}')">${playListItems[i].channelVideoTittle}</p>
        </div>  
        <div class="card-footer border  border-secondary">
            <button type="button" class="btn btn-dark mb-1 w-50" data-toggle="modal" data-target="#modalCollection" onClick="videoCollectionModal('${playListItems[i].videoId}','${playListItems[i].date}')">Agregar a coleccion</button>
            <button type="button" class="btn btn-dark mb-1 w-50" onClick="deleteVideofromPlaylist('${playListItems[i].idElementPlaylist}')">Borrar de la playlist</button>
        </div>  
    </div>`
    }
})


function video(string) {
    console.log("hola");
    ipcRenderer.send('video',string,null, null);
    window.location.href = "./video.ejs";
  
}


//* Get channel
function getChannel(channelId) {
    console.log("hola");
    ipcRenderer.send('channel',channelId);
    window.location.href = "./channel.ejs";
}

function videoCollectionModal(id,date) {
    ipcRenderer.send('video-collection-modal',id,date);
}

function deleteVideofromPlaylist(idElement) {
    ipcRenderer.send('delete-video-from-playlist', idElement)
    location.reload();
}

ipcRenderer.on('delete-video-from-playlist',(e,mss)=>{
    document.getElementById("mssDelete").innerHTML = mss;
})