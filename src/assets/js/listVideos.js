
document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('listVideos');
   
})

ipcRenderer.on('listVideos',(e,listVideos)=>{
    //lista videos 
    console.log(listVideos);
    let listOfVideos=document.getElementById("list-of-videos"); 
    listOfVideos.innerHTML=''
    for(let i=0; i< listVideos.length;i++){
        listOfVideos.innerHTML+= `
        <div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4" > 
            <img class="card-img-top img-fluid border border-secondary" src="${listVideos[i].image.url}" alt="Card image cap" onClick="video('${listVideos[i].videoId}')">
            <div class="card-body border  border-secondary"> 
                <h6 class="card-title text-dark overflow" title="${listVideos[i].title}" onClick="video('${listVideos[i].videoId}')">${listVideos[i].title}</h6> 
                <p class="channel-color" onClick="getChannel('${listVideos[i].channelId}')">${listVideos[i].channelTitle}</p>
                <p class="channel-color">Publicacion: ${listVideos[i].date.slice(0,10)}</p>           
            </div>  
            <div class="card-footer border  border-secondary">
            <button type="button" class="btn btn-dark mb-1 w-100" data-toggle="modal" data-target="#modalCollection" onClick="videoCollectionModal('${listVideos[i].videoId}','${listVideos[i].date}')">Agregar a colección</button>
            <button type="button" class="btn btn-dark w-100" data-toggle="modal" data-target="#modalPlaylist" onClick="videoPlaylistModal('${listVideos[i].videoId}')">Agregar a playlist </button>
            </div> 
        </div>` 
    }
});

function video(string) {
    console.log("hola");
    ipcRenderer.send('video',string,null, null);
    window.location.href = "./video.ejs";
  
}
function videoCollectionModal(id,date) {
    ipcRenderer.send('video-collection-modal',id,date);
}

function videoPlaylistModal(id) {
    ipcRenderer.send('video-playlist-modal',id);
}


function getChannel(channelId) {
    console.log("hola");
    ipcRenderer.send('channel',channelId);
    window.location.href = "./channel.ejs";
}