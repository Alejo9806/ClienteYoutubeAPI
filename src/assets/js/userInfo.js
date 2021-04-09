const {ipcRenderer} = require('electron');

let searchVideo= document.getElementById("search-video")
let searchbutton= document.getElementById("search-button")

document.addEventListener('DOMContentLoaded',e=>{
    let listOfVideos=document.getElementById("list-of-videos")

    //lista videos 
    let videos=['https://www.youtube.com/embed/0BWzZ6c8z-g',
                'https://www.youtube.com/embed/1rTs-tSqqv8',
                'https://www.youtube.com/embed/chPhlsHoEPo',
                'https://www.youtube.com/embed/BhvLIzVL8_o',
                'https://www.youtube.com/embed/HiXLkL42tMU'];

    listOfVideos.innerHTML=''
for(let i=0; i< videos.length;i++){
    console.log(videos[i])
    listOfVideos.innerHTML+='<div class="col-lg-4 col-md-6 col-sm-12 col-12"> <iframe  class="embed-responsive-item" width="100%" height="315" src='+videos[i]+'  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </div>'
}

    ipcRenderer.send('userInfo');
});

ipcRenderer.on('userInfo',(e,userInfo,listVideos )=>{
    
    console.log(listVideos);
    let name = document.getElementById("name")
    document.getElementById("imgProfile").setAttribute("src", userInfo.picture )
    name.innerHTML='Bienvenido '+ userInfo.given_name+ ' <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-laughing-fill" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5c0 .501-.164.396-.415.235C6.42 6.629 6.218 6.5 6 6.5c-.218 0-.42.13-.585.235C5.164 6.896 5 7 5 6.5 5 5.672 5.448 5 6 5s1 .672 1 1.5zm5.331 3a1 1 0 0 1 0 1A4.998 4.998 0 0 1 8 13a4.998 4.998 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5zm-1.746-2.765C10.42 6.629 10.218 6.5 10 6.5c-.218 0-.42.13-.585.235C9.164 6.896 9 7 9 6.5c0-.828.448-1.5 1-1.5s1 .672 1 1.5c0 .501-.164.396-.415.235z"/></svg>';
})

searchVideo.addEventListener('keypress',(e)=>{
    search(e)
})
searchbutton.addEventListener('click',(e)=>{
    search(e)
})

function search(e){
    if (e.key=='Enter' || e.type=='click' ){
        ipcRenderer.sendSync('searchVideo',searchVideo.value);
    }
}

