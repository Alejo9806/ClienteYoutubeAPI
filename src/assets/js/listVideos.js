//* call to the back when the window is loaded
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('listVideos');

})

//* data is obtained, a list of videos is displayed on the screen.
ipcRenderer.on('listVideos', (e, listVideos) => {
    //lista videos 
    let listOfVideos = document.getElementById("list-of-videos");
    listOfVideos.innerHTML = ''
    for (let i = 0; i < listVideos.length; i++) {
        listOfVideos.innerHTML += `
        <div class="card col-lg-3 col-md-4 col-sm-6 col-6 bg-card border-0 mt-4" > 
            <img class="card-img-top img-fluid border border-secondary" src="${listVideos[i].image.url}" alt="Card image cap" onClick="video('${listVideos[i].videoId}')">
            <div class="card-body border  border-secondary"> 
                <h6 class="card-title text-dark overflow" title="${listVideos[i].title}" onClick="video('${listVideos[i].videoId}')">${listVideos[i].title}</h6> 
                <p class="channel-color" onClick="getChannel('${listVideos[i].channelId}')">${listVideos[i].channelTitle}</p>
                <p class="channel-color">Publicacion: ${listVideos[i].date.slice(0,10)}</p>           
            </div>  
            <div class="card-footer border  border-secondary">
            <button type="button" class="btn btn-dark mb-1 w-100" data-toggle="modal" data-target="#modalCollection" onClick="videoCollectionModal('${listVideos[i].videoId}','${listVideos[i].date}','${listVideos[i].duration}')">Agregar a colección</button>
            <button type="button" class="btn btn-dark w-100" data-toggle="modal" data-target="#modalPlaylist" onClick="videoPlaylistModal('${listVideos[i].videoId}')">Agregar a playlist </button>
            </div> 
        </div>`
    }
});

//* Get video
function video(string) {
    ipcRenderer.send('video', string, null, null);
    window.location.href = "./video.ejs";

}

//* Data are sent for the modal of the video collection
function videoCollectionModal(id, date, time) {
    ipcRenderer.send('video-collection-modal', id, date, time);
}

//* Data are sent for the modal of the video playlist 
function videoPlaylistModal(id) {
    ipcRenderer.send('video-playlist-modal', id);
}

//* Get channel
function getChannel(channelId) {
    ipcRenderer.send('channel', channelId);
    window.location.href = "./channel.ejs";
}