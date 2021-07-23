//* Importación de metodos para los tags y para transformar el tiempo de los videos en segundos.
const { transformTime } = require('../../src/libs/time');
const {keyPressValue,selectionTag,deletedTag,saveTag} = require('../../src/libs/tags');

//* variables globales 
//*Video
const editVideoCollection = document.getElementById("editVideoCollection");
const labelTags = document.getElementById("labelTags");
let chosenTags = [];
let idVideo;


//*Playlist
const editPlayListCollection = document.getElementById("editPlayListCollection");
const labelTagsEditPlaylist = document.getElementById("labelTagsEditPlaylist");
let chosenTagsEditPlaylist = [];
let idPlaylist;

//*Channel
const editChannelCollection = document.getElementById("editChannelCollection");
const labelTagsEditChannel = document.getElementById("labelTagsEditChannel");
let chosenTagsEditChannel = [];
let idChannel;



//*  Realiza una llamada al back end al cargar la ventana de recursos de las colecciones.
document.addEventListener('DOMContentLoaded', (e) => {
    ipcRenderer.send('get-collection-select');
})

//* Los datos de la colección se obtienen y se muestran en la pantalla, divididos en listas de reproducción, canales, vídeos y colecciones recomendadas.
ipcRenderer.on('get-collection-select', (e, videos, playList, channel, relatedCollections) => {
    console.log(relatedCollections)
    const collectionRelated = document.getElementById('collectionRelated');
    const carousel = document.getElementById('carousel');
    const active = document.getElementById('carousel-item');
    active.innerHTML = ''; 
    const carouselPlaylist = document.getElementById('carousel-playlist');
    const activePlaylist = document.getElementById('carousel-item-playlist');
    activePlaylist.innerHTML = ''; 
    const carouselChannel = document.getElementById('carousel-channel');
    const activeChannel = document.getElementById('carousel-item-channel');
    activeChannel.innerHTML = ''; 

    const list = Math.ceil((videos.length/3)-1);
    for (let index = 0; index < list; index++) {
        document.getElementById('list').innerHTML += `<li data-target="#multi-item-example" data-slide-to="${index+1}"></li>`
        
    }
    const listPlaylist = Math.ceil((playList.length/2)-1);
    for (let index = 0; index < listPlaylist; index++) {
        document.getElementById('list-playlist').innerHTML += `<li data-target="#multi-item-example-playlist" data-slide-to="${index+1}"></li>`
        
    }
    
    const listChannel = Math.ceil((channel.length/2)-1);
    for (let index = 0; index < listChannel ; index++) {
        document.getElementById('list-channel').innerHTML += `<li data-target="#multi-item-example-channel" data-slide-to="${index+1}"></li>`
        
    }
    
    let aux =1;
    let aux2=0;
    //* Se recorre los videos de la colección y se pintan en pantalla uno por uno.
    videos.forEach((element,index) => {
        if (index < 3) {
            active.innerHTML += `
                <div class="card col-lg-4 col-md-4 col-sm-4 col-4 bg-card border-0 mt-4" > 
                    <img class="card-img-top img-fluid border border-secondary" src="${element.image.url}" alt="Card image cap" onClick="video('${element.videoId}','${element.startAt}','${element.endAt}')">
                    <div class="card-body border  border-secondary" > 
                        <h6 class="card-title text-dark overflow" style="cursor:pointer;" title="${element.title}" onClick="video('${element.videoId},'${element.startAt}','${element.endAt}')">${element.title}</h6> 
                        <p class="channel-color channel" style="cursor:pointer;" onClick="getChannel('${element.channelId}')">${element.channelTitle}</p>
                        <p class="channel-color">Publicacion: ${element.date.slice(0,10)}</p>  
                        <a class="btn btn-secondary" title="EDITAR METADATOS" data-toggle="modal" data-target="#modalCollectionEdit" onClick="editVideo('${element.videoId}','${element.comment}','${element.startAt}','${element.endAt}','${element.tags}','${element.duration}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg><a/>   
                        <a class="btn btn-danger" title="BORRAR DE LA COLECCIÓN" onClick="deleteVideoOrPlayListOrChannel('${element.videoId}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                       <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg><a/>      
                    </div>  
                </div>`           
        }
        console.log(index)
        if (index == (aux*3)) {
            console.log((aux*3))
            aux2++;
            carousel.innerHTML += `<div class="carousel-item">
            <div class="row" id= "carousel-item-${aux2}">
            </div>
            </div>`
            aux++;
        }
        if (index >= 3) {
            document.getElementById('carousel-item-'+aux2).innerHTML +=  `
            <div class="card col-lg-4 col-md-4 col-sm-4 col-4 bg-card border-0 mt-4" > 
                    <img class="card-img-top img-fluid border border-secondary" src="${element.image.url}" alt="Card image cap" onClick="video('${element.videoId}','${element.startAt}','${element.endAt}')">
                    <div class="card-body border  border-secondary" > 
                        <h6 class="card-title text-dark overflow" style="cursor:pointer;" title="${element.title}" onClick="video('${element.videoId},'${element.startAt}','${element.endAt}')">${element.title}</h6> 
                        <p class="channel-color channel" style="cursor:pointer;" onClick="getChannel('${element.channelId}')">${element.channelTitle}</p>
                        <p class="channel-color">Publicacion: ${element.date.slice(0,10)}</p>  
                        <a class="btn btn-secondary" title="EDITAR METADATOS" data-toggle="modal" data-target="#modalCollectionEdit" onClick="editVideo('${element.videoId}','${element.comment}','${element.startAt}','${element.endAt}','${element.tags}','${element.duration}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg><a/>   
                        <a class="btn btn-danger" title="BORRAR DE LA COLECCIÓN" onClick="deleteVideoOrPlayListOrChannel('${element.videoId}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                       <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg><a/>      
                    </div>  
            </div>`  
        }
                         
    });
    aux =1;
    aux2=0;
    //* Se recorre las playlists de la colección y se pintan en pantalla una por una
    playList.forEach((element,index) => {
        if (index < 2) {
            activePlaylist.innerHTML += `
            <div class="col-lg-6 col-md-6 col-sm-6 col-6 mt-4" > 
                <div class="row">
                    <div class="col-lg-8 col-md-8 col-sm-8 col-8">
                    <img class="h-100 w-100 img-fluid border border-secondary" src="${element.image.url}" style="cursor:pointer;" alt="Card image cap" onClick="getItems('${element.id}')">
                    <section class="icon-playlist-p text-center " onClick="getItems('${element.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"  fill="currentColor" class="bi bi-collection-play-fill m-2 icon-playlist-collection mt-5" viewBox="0 0 16 16">
                            <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm6.258-6.437a.5.5 0 0 1 .507.013l4 2.5a.5.5 0 0 1 0 .848l-4 2.5A.5.5 0 0 1 6 12V7a.5.5 0 0 1 .258-.437z"/>
                        </svg> <br>
                        <h6 class="text-white text-center">${element.itemsCount}</h6>
                    </section>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-4"> 
                        <h6 class="card-title text-dark overflow" title="${element.title}"  onClick="getItems('${element.id}')" style="cursor:pointer;">${element.title}</h6> 
                        <p class="channel-color channel" style="cursor:pointer;" onClick="getChannel('${element.channelId}')">${element.channelTitle}</p>
                        <p class="channel-color">${element.date.slice(0,10)}</p>   
                        <a class="btn btn-secondary" data-toggle="modal" title="EDITAR METADATOS" data-target="#modalCollectionChannelEdit" onClick="editChannel('${element.id}','${element.comment}','${element.tags}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg><a/>
                        <a class="btn btn-danger" title="BORRAR DE LA COLECCIÓN" onClick="deleteVideoOrPlayListOrChannel('${element.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg><a/>                
                    </div>  
                </div>
            `         
        }
        console.log(index)
        if (index == (aux*2)) {
            console.log((aux*2))
            aux2++;
            carouselPlaylist.innerHTML += `<div class="carousel-item">
            <div class="row" id= "carousel-item-playlist-${aux2}">
            </div>
            </div>`
            aux++;
        }
        if (index >= 2) {
            document.getElementById('carousel-item-playlist-'+aux2).innerHTML +=  `
            <div class="col-lg-6 col-md-6 col-sm-6 col-6 mt-4" > 
                <div class="row">
                    <div class="col-lg-8 col-md-8 col-sm-8 col-8">
                    <img class="h-100 w-100 img-fluid border border-secondary" src="${element.image.url}" style="cursor:pointer;" alt="Card image cap" onClick="getItems('${element.id}')">
                    <section class="icon-playlist-p text-center " onClick="getItems('${element.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"  fill="currentColor" class="bi bi-collection-play-fill m-2 icon-playlist-collection mt-5" viewBox="0 0 16 16">
                            <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm6.258-6.437a.5.5 0 0 1 .507.013l4 2.5a.5.5 0 0 1 0 .848l-4 2.5A.5.5 0 0 1 6 12V7a.5.5 0 0 1 .258-.437z"/>
                        </svg> <br>
                        <h6 class="text-white text-center">${element.itemsCount}</h6>
                    </section>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 col-4"> 
                        <h6 class="card-title text-dark overflow" title="${element.title}"  onClick="getItems('${element.id}')" style="cursor:pointer;">${element.title}</h6> 
                        <p class="channel-color channel" style="cursor:pointer;" onClick="getChannel('${element.channelId}')">${element.channelTitle}</p>
                        <p class="channel-color">${element.date.slice(0,10)}</p>   
                        <a class="btn btn-secondary" data-toggle="modal" title="EDITAR METADATOS" data-target="#modalCollectionChannelEdit" onClick="editChannel('${element.id}','${element.comment}','${element.tags}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg><a/>
                        <a class="btn btn-danger" title="BORRAR DE LA COLECCIÓN" onClick="deleteVideoOrPlayListOrChannel('${element.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg><a/>                
                    </div>  
                </div>`
        }
    });

    aux =1;
    aux2=0;
    //* Se recorre los canales de la colección y se pintan en pantalla uno por uno.
    channel.forEach((element,index) => {
        if (index < 2) {
            activeChannel.innerHTML += `
            <div class="card col-lg-6 col-md-6 col-sm-6 col-6 bg-card mt-4 border border-secondary card-channel">
                <div class="card-body border-right-secondary">
                <img src="${element.image}" alt="${element.title}" style="cursor:pointer;" class="img-circle border rounded-circle d-inline mt-4" onClick="getChannel('${element.id}')">
                <div class="">
                    <h6 class="text-dark d-inline" style="cursor:pointer;"  onClick="getChannel('${element.id}')">${element.title}</h6>
                    <br>
                    <a class="btn btn-secondary" title="EDITAR METADATOS" data-toggle="modal" data-target="#modalCollectionChannelEdit" onClick="editChannel('${element.id}','${element.comment}','${element.tags}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg><a/>
                    <a class="btn btn-danger" title="BORRAR DE LA COLECCIÓN" onClick="deleteVideoOrPlayListOrChannel('${element.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg><a/>
                
                </div>
            </div>
        `       
        }
        console.log(index)
        if (index == (aux*2)) {
            console.log((aux*3))
            aux2++;
            carouselChannel.innerHTML += `<div class="carousel-item">
            <div class="row" id= "carousel-item-channel-${aux2}">
            </div>
            </div>`
            aux++;
        }
        if (index >= 2) {
            document.getElementById('carousel-item-channel-'+aux2).innerHTML +=  `
            <div class="card col-lg-6 col-md-6 col-sm-6 col-6 bg-card mt-4 border border-secondary card-channel">
                <div class="card-body ">
                <img src="${element.image}" alt="${element.title}" style="cursor:pointer;" class="img-circle border rounded-circle d-inline mt-4" onClick="getChannel('${element.id}')">
                <div class="">
                    <h6 class="text-dark d-inline" style="cursor:pointer;" onClick="getChannel('${element.id}')">${element.title}</h6>
                    <br>
                    <a class="btn btn-secondary" title="EDITAR METADATOS" data-toggle="modal" data-target="#modalCollectionChannelEdit" onClick="editChannel('${element.id}','${element.comment}','${element.tags}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg><a/>
                    <a class="btn btn-danger" title="BORRAR DE LA COLECCIÓN" onClick="deleteVideoOrPlayListOrChannel('${element.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg><a/>
                
                </div>
            </div>
        `
        }
    });

    if(videos.length === 0 && playList.length=== 0 && channel.length=== 0){
        document.getElementById("void").innerHTML = ` <h1 class="text-center mt-5"">LA COLECCIÓN ESTA VACIA</h1>`
    }
    if(relatedCollections.length === 0 ){
        document.getElementById("void-recomend").innerHTML = `<h5 class="text-center mt-5">NO HAY COLECCIÓNES RELACIONADAS</h5>`
    }else{
        //* Se recorre las colecciones relacionadas que hay con la coleccion seleccionada se pintan en pantalla uno por uno en una tabla.
        relatedCollections.forEach((element, i) => {
            collectionRelated.innerHTML += `
            <tr>
            <th scope="row">${i}</th>
            <td><a onClick="getCollection('${element.title}')" style="cursor:pointer">${element.title}</a></td>
            <td>${element.description}</td>
        </tr> `
        });
    }
    


})

//* Envía la id del vídeo seleccionado y carga la ventana de vídeo.
function video(string, startAt, endAt) {
    ipcRenderer.send('video', string, startAt, endAt);
    window.location.href = "./video.ejs";

}

//*Envía la id del canal seleccionado y carga la ventana del canal.
function getChannel(channelId) {
    ipcRenderer.send('channel', channelId);
    window.location.href = "./channel.ejs";
}

//* Envía la id de la playlist seleccionada y carga la ventana de los items de la playlist.
function getItems(string) {
    ipcRenderer.send('playlisId', string);
    window.location.href = "./playListItems.ejs";

}

//* Acceso a la colección seleccionada
function getCollection(title) {
    ipcRenderer.send('get-collection', title);
    window.location.href = './collectionResource.ejs';
}


//* Se envia la id del recurso seleccionado y se elimina el recurso de la base de datos. (video,canal,playlist)
function deleteVideoOrPlayListOrChannel(id) {
    ipcRenderer.send('delete-video-playList-channel', id);
}

//* Escucha cuando se elimina un vídeo, una lista de reproducción o un canal y refresca la ventana para su actualización
ipcRenderer.on('delete-video-playList-channel', (e) => {
    location.reload();
})


//* Funcionalidades para editar video
//* Se obtienen los datos del vídeo seleccionado para su edición y se rellena el formulario con los datos del vídeo.
function editVideo(id, comment, startAt, endAt, tags, timeDuration) {
    let time = transformTime(timeDuration);
    document.getElementById("startAt").setAttribute("max", time);
    document.getElementById("endAt").setAttribute("max", time);

    let tagsCadena = [];
    chosenTags = [];
    idVideo = id;
    if (startAt != null) {
        document.getElementById("startAt").value = startAt;
    }
    if (endAt != null) {
        document.getElementById("endAt").value = endAt;
    }
    document.getElementById("comment").value = comment;
    labelTags.innerHTML = ``;
    tagsCadena = tags.split(",");
    tagsCadena.forEach(tag => {
        chosenTags.push(tag);
        labelTags.innerHTML += `
        <label for="description">${tag} </label>
        <a onClick="sendDataDeletedTag('${tag}','labelTags')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg></a>
    `;
    })
}


//* Los datos del formulario para añadir el canal a la colección se registran y los datos se envían para entrar en la base de datos de edición de vídeo.
editVideoCollection.addEventListener('submit', (e) => {
    const VideoCollection = {
        startAt: document.getElementById("startAt").value,
        endAt: document.getElementById("endAt").value,
        comment: document.getElementById("comment").value,
    };
    ipcRenderer.send('edit-video-collection', idVideo, VideoCollection, chosenTags);
    editVideoCollection.reset();
});





//* Funciones editar listas de reproducción
//* Se obtienen los datos de la playlist seleccionada para su edición y se rellena el formulario con los datos del playlist.
function editPlaylist(id, comment, tags) {
    let tagsCadenaEditPlaylist = [];
    chosenTagsEditPlaylist = [];
    idPlaylist = id;
    document.getElementById("commentPlaylist").value = comment;
    labelTagsEditPlaylist.innerHTML = ``;
    tagsCadenaEditPlaylist = tags.split(",");
    tagsCadenaEditPlaylist.forEach(tag => {
        chosenTagsEditPlaylist.push(tag);
        labelTagsEditPlaylist.innerHTML += `
        <label for="description">${tag} </label>
        <a onClick="sendDataDeletedTag('${tag}','labelTagsEditPlaylist')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg></a>
    `;
    })
}

//* Se registran los datos del formulario para añadir el canal a la colección y se envían los datos para entrar en la base de datos de edición de la lista de reproducción.
editPlayListCollection.addEventListener('submit', (e) => {
    const playListCollection = {
        comment: document.getElementById("commentPlaylist").value,
    };
    ipcRenderer.send('edit-playlist-collection', idPlaylist, playListCollection, chosenTagsEditPlaylist);
    editPlayListCollection.reset();
})

//* Funciones editar canal
//* Se obtienen los datos del canal seleccionado para su edición y se rellena el formulario con los datos del canal.
function editChannel(id, comment, tags) {
    let tagsCadenaEditChannel = [];
    chosenTagsEditChannel = [];
    idChannel = id;
    document.getElementById("commentChannel").value = comment;
    labelTagsEditChannel.innerHTML = ``;
    tagsCadenaEditChannel = tags.split(",");
    tagsCadenaEditChannel.forEach(tag => {
        chosenTagsEditChannel.push(tag);
        labelTagsEditChannel.innerHTML += `
        <label for="description">${tag} </label>
        <a onClick="sendDataDeletedTag('${tag}','labelTagsEditChannel')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg></a>
    `;
    })
}


//* Los datos del formulario para añadir el canal a la colección se registran y los datos se envían para entrar en la base de datos.
editChannelCollection.addEventListener('submit', (e) => {
    const channelCollection = {
        comment: document.getElementById("commentChannel").value,
    };
    ipcRenderer.send('edit-channel-collection', idChannel, channelCollection, chosenTagsEditChannel);
    editChannelCollection.reset();
})


//*  La respuesta se obtiene del back end y los tag que se obtienen se mostraran al cliente en una lista.
ipcRenderer.on('search-tag', (e, tags,selectTag) => {
    console.log(selectTag)
    document.getElementById(selectTag).innerHTML = '';
    if(selectTag == 'selectTag'){
        tags.forEach(tag_user => {
            document.getElementById(selectTag).innerHTML += `
            <a class="btn btn-danger" onClick="sendDataSelectTag('${tag_user._doc.tag}','labelTags')">${tag_user._doc.tag}</a>
            `;
        });
    }else if(selectTag == 'selectTagEditPlaylist'){
        tags.forEach(tag_user => {
            document.getElementById(selectTag).innerHTML += `
            <a class="btn btn-danger" onClick="sendDataSelectTag('${tag_user._doc.tag}','labelTagsEditPlaylist')">${tag_user._doc.tag}</a>
            `;
        });
    }else {
        tags.forEach(tag_user => {
            document.getElementById(selectTag).innerHTML += `
            <a class="btn btn-danger" onClick="sendDataSelectTag('${tag_user._doc.tag}','labelTagsEditChannel')">${tag_user._doc.tag}</a>
            `;
        });
    }
   
});

//* Fución para enviar datos a la función selectionTag de la libreria del tag.
function sendDataSelectTag(tag,labelTags) {
    if (labelTags == 'labelTags') {
        chosenTags = selectionTag(tag,labelTags,chosenTags);
    }else if(labelTags == 'labelTagsEditPlaylist'){
        chosenTagsEditPlaylist = selectionTag(tag,labelTags,chosenTagsEditPlaylist );
    }else{
        chosenTagsEditChannel = selectionTag(tag,labelTags,chosenTagsEditChannel);
    }
}

//* Fución para enviar datos a la función deletedTag de la libreria del tag.
function sendDataDeletedTag(tag,labelTags) {
    if (labelTags == 'labelTags') {
        chosenTags = deletedTag(tag,labelTags,chosenTags);
    }else if(labelTags == 'labelTagsEditPlaylist'){
        chosenTagsEditPlaylist = deletedTag(tag,labelTags,chosenTagsEditPlaylist );
    }else{
        chosenTagsEditChannel = deletedTag(tag,labelTags,chosenTagsEditChannel);
    }
}

//* Fución para enviar datos a la función saveTag de la libreria del tag. 
function SelectSaveTag(tagInput,noSave,save) {
    if (tagInput == 'tag') {
        chosenTags = saveTag(tagInput,noSave,save,'labelTags',chosenTags);
    }else if(tagInput == 'tagEditPlaylist'){
        chosenTagsEditPlaylist = saveTag(tagInput,noSave,save,'labelTagsEditPlaylist',chosenTagsEditPlaylist);
    }else{
        chosenTagsEditChannel = saveTag(tagInput,noSave,save,'labelTagsEditChannel',chosenTagsEditChannel);
    }
}

//* La ventana se recarga al editar un recurso de la colección.
ipcRenderer.on('edit-video-playlist-channel-collection', (e) => {
    location.reload();
})