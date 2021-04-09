document.addEventListener('DOMContentLoaded', e => {
    ipcRenderer.send('getVideo');
});

ipcRenderer.on('getVideo', (e, idVideo) => {
    console.log(idVideo);
    document.getElementById("video").setAttribute("src", "https://www.youtube.com/embed/" + idVideo)
})