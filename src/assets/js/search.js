
document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('search');
})

ipcRenderer.on('search',(e,results)=>{
    let listResult=document.getElementById("result"); 
    listResult.innerHTML='';
    for(let i=0; i< results.length;i++){
        listResult.innerHTML += `<div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4" > 
        <img class="card-img-top img-fluid border border-secondary" src="${results[i].image.url}" alt="Card image cap" onClick="video('${results[i].videoId}')">
        <div class="card-body border  border-secondary"> 
            <h6 class="card-title text-dark overflow" title="${results[i].title}"  onClick="video('${results[i].videoId}')">${results[i].title}</h6> 
            <p class="channel-color">${results[i].description}</p>
            <p class="channel-color"  onClick="getChannel('${results[i].channelId}')">${results[i].channelTitle}</p>
            <p class="channel-color">Publicacion: ${results[i].date.slice(0,10)}</p>
        </div>  
        <div class="card-footer border  border-secondary">
            <button type="button" class="btn btn-dark mb-1 w-100" data-toggle="modal" data-target="#modalCollection" onClick="videoCollectionModal('${results[i].videoId}','${results[i].date}')">Agregar a colección</button>
            <button type="button" class="btn btn-dark w-100" data-toggle="modal" data-target="#modalPlaylist">Agregar a playlist </button>
        </div>  
    </div>`
    }
});

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


function videoCollectionModal(id,date) {
    ipcRenderer.send('video-collection-modal',id,date);
}