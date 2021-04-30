
document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('playListItems');
})

ipcRenderer.on('playListItems',(e,playListItems)=>{
    let listOfPlaylistItems = document.getElementById("playListItems"); 
    listOfPlaylistItems.innerHTML=''
    for(let i=0; i< playListItems.length;i++){
        listOfPlaylistItems.innerHTML += `<div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4" > 
        <img class="card-img-top img-fluid border border-secondary" src="${playListItems[i].image.url}" alt="Card image cap"  onClick="video('${playListItems[i].videoId}')">
        <div class="card-body border  border-secondary" onClick="video('${playListItems[i].videoId}')"> 
            <h6 class="card-title text-dark overflow" title="${playListItems[i].title}">${playListItems[i].title}</h6> 
            <p class="channel-color">${playListItems[i].channelVideoTittle}</p>
        </div>  
        <div class="card-footer border  border-secondary">
            <button type="button" class="btn btn-dark mb-1 w-100" data-toggle="modal" data-target="#modalLibrary">Agregar</button>
        </div>  
    </div>`
    }
})


function video(string) {
    console.log("hola");
    ipcRenderer.send('video',string);
    window.location.href = "./video.ejs";
  
}