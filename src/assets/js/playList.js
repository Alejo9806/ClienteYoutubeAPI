
document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('playList');
})

ipcRenderer.on('playList',(e,playList)=>{
    let listOfPlaylist=document.getElementById("playList"); 
    listOfPlaylist.innerHTML=''
    for(let i=0; i< playList.length;i++){
        listOfPlaylist.innerHTML += `<div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4"> 
        <img class="card-img-top img-fluid border border-secondary" src="${playList[i].image.url}" alt="Card image cap" onClick="getItems('${playList[i].id}')">
        <div class="card-body border  border-secondary"  onClick="getItems('${playList[i].id}')"> 
            <h6 class="card-title text-dark overflow" title="${playList[i].title}">${playList[i].title}</h6> 
            <p class="channel-color">${playList[i].channelTitle}</p>
           
        </div>  
        <div class="card-footer border  border-secondary">
            <button type="button" class="btn btn-dark w-100" data-toggle="modal" data-target="#modalLibrary">Agregar</button>
        </div>  
    </div>`
    }
});

function getItems(string) {
    console.log("hola");
    ipcRenderer.send('playlisId',string);
    window.location.href = "./playListItems.ejs";
  
}