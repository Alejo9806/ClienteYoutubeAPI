let id;
let date;

document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('getVideo');
});

ipcRenderer.on('getVideo', (e, idVideo,startAt,endAt,dates) => {
    console.log(idVideo,startAt,endAt,dates);
    document.getElementById("video").setAttribute("src", "https://www.youtube.com/embed/" + idVideo+'?start='+startAt+'&end='+endAt);
    id = idVideo;
    date = dates;

});


document.getElementById("collectionButton").addEventListener('click',e=>{
    ipcRenderer.send('video-collection-modal',id,date);
});