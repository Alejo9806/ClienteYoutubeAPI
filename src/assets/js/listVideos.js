
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
        <div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4" onClick="video('${listVideos[i].videoId}')"> 
            <img class="card-img-top img-fluid border border-secondary" src="${listVideos[i].image.url}" alt="Card image cap">
            <div class="card-body border  border-secondary"> 
                <h6 class="card-title text-dark overflow" title="${listVideos[i].title}">${listVideos[i].title}</h6> 
                <p class="channel-color">${listVideos[i].channelTitle}</p>
                <p class="channel-color">Publicacion: ${listVideos[i].date.slice(0,10)}</p>
            </div>  
        </div>` 
    }
});

function video(string) {
    console.log("hola");
    ipcRenderer.send('video',string);
    window.location.href = "./video.ejs";
  
}