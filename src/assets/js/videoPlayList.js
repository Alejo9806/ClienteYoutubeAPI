let idVideo;
let idElement = [];

document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('playList');

})

ipcRenderer.on('video-playlist-modal',(e,id)=>{
    console.log(id)
    idVideo = id;
});


ipcRenderer.on('playList',(e,playList)=>{
    console.log(playList);
    let listOfPlaylist = document.getElementById("myPlayLists");
    listOfPlaylist.innerHTML ="";
    for (let i = 0; i < playList.length; i++) {
        listOfPlaylist.innerHTML += `
        <div class="form-check">
        <input class="form-check-input" type="checkbox" value="${playList[i].id}" id="flexCheckDefault${i}" onchange="addPlayList('${playList[i].id}','flexCheckDefault${i}')">
        <label class="form-check-label" for="flexCheckDefault${i}">
            ${playList[i].title}
        </label>
        </div>    
     `;
        
    }
});

function addPlayList(id,box) {
  
    if (document.getElementById(box).checked) {
        console.log(id,"si")
        ipcRenderer.send('add-video-to-playlist',id,idVideo,box)
    }else{
        console.log(id,"no", idElement)
        idElement.forEach(element => {
            if (element.box == box) {
                ipcRenderer.send('delete-video-from-playlist', element.idElementPlaylist)
            }
        });
       
        
    }
}

document.getElementById("newPlayList").addEventListener('submit',(e)=>{
    let newPlayList = {
        title : document.getElementById("titlePlaylist").value,
        description: document.getElementById("descriptionPlaylist").value,
        status : document.getElementById("status").value
    }
    ipcRenderer.send('new-playlist-with-video',newPlayList,idVideo);
    location.reload();
})

ipcRenderer.on('add-video-to-playlist',(e,mss,idElementPlaylist,box)=>{
    document.getElementById("mssPlaylist").innerHTML = mss;
    idElement.push({idElementPlaylist:idElementPlaylist,box:box});
})

ipcRenderer.on('delete-video-from-playlist',(e,mss)=>{
    document.getElementById("mssPlaylist").innerHTML = mss;
})

document.getElementById("newPlaylistVideo").addEventListener('click',(e)=>{
    $('.hide').css({
        "overflow": "visible",
        "display": "flex"
    })
    
})
document.getElementById("hidePlaylist").addEventListener('click',(e)=>{
    $('.hide').css({
        "overflow": "hidden",
        "display": "none"
    })
})