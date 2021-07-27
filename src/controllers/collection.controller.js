//Variables de ambiente
const { YOUTUBE_API_KEY  } = require('../config/keys');

//importaciones de librerias electron y de los modelos de la base de datos mongo.
const Collection = require('../model/collection');
const Tag = require('../model/tag');
const User = require('../model/user');
const { ipcMain } = require('electron');
// const { YOUTUBE_API_KEY } = process.env;
const Axios = require('axios');


//variables globales
let titleCollection;
let userInfo;
let userToken;

//Se obtiene el token y la informacion del usuario y se guarda.
ipcMain.on('user', (e, token, info) => {
    userToken = token;
    userInfo = info;
});

//* Se escucha un evento para devolver las colecciones del usuario logeado se hace una peticion a la base de datos para que devuelva los datos que se necesitan devolver al cliente.
ipcMain.on('collection', async(e) => {
    const user = await User.findOne({ email: userInfo.email });
    const collection = await Collection.aggregate([{ $match: { id_user: "" + user._id } }, { $project: { 'title': 1, 'description': 1 } }])
    e.reply('collection', collection);
});

//* Se escucha un evento donde se envia datos para crear una nueva coleccion y guardarla en la base datos.
ipcMain.on('new-collection', async(e, newCollection, chosenTags) => { 
    const user = await User.findOne({ email: userInfo.email });
    const collectionExist = await Collection.findOne({title:newCollection.title,id_user: user._id })
    if (collectionExist) {
        const mss = "la nombre de la coleccion ya existe, por favor intenta poner un nombre nuevo"
        e.reply('new-collection',mss)
    } else {
        let collection = new Collection();
        collection.title = newCollection.title;
        collection.description = newCollection.description;
        collection.id_user = user._id;
        chosenTags.forEach(chosenTag => {
            collection.tags.push(chosenTag);
        });
        collection = await collection.save();
        e.reply('new-collection')
    }
   
});

//* Se guarda en la base de datos un nuevo tag cuando se escucha el evento con el tag enviado desde el cliente 
ipcMain.on('new-tag', async(e, newTag) => {
    let mss;
    let tag = new Tag();
    const user = await User.findOne({ email: userInfo.email });
    const existsTag = await Tag.findOne({ tag: newTag, id_user: user._id });
    if (!existsTag) {
        tag.id_user = user._id;
        tag.tag = newTag;
        tag = await tag.save();
        mss = "Guardado correctamente"
        e.reply('new-tag', mss);
    } else {
        mss = "El tag ya existe lo hemos seleccionado."
        e.reply('new-tag', mss);
    }
});

//* Se hace una busqueda en la base datos a partir de una expresion regular para devolver tags relacionados con el string.
ipcMain.on('search-tag', async(e, searchTag,selectTag) => {
    const regularExpr = new RegExp(searchTag);
    const user = await User.findOne({ email: userInfo.email });
    const tags = await Tag.find({ tag: { $regex: regularExpr, $options: 'i' }, id_user: user._id }).limit(5);
    e.reply('search-tag', tags,selectTag);
});

//* Se obtienen datos de un recurso y estos son devueltos al cliente.
ipcMain.on('video-collection-modal', (e, id, date, time) => {
    e.reply('video-collection-modal', id, date, time);
})

//* Se obtienen datos de un recurso y estos son devueltos al cliente.
ipcMain.on('playList-collection-modal', (e, id, date) => {
    e.reply('playList-collection-modal', id, date);
})

//* Se escucha el evento para agregar un nuevo video en la coleccion, se busca la coleccion en la que se quiere guardar el video y se envian los nuevos datos a la base de datos.
ipcMain.on('new-video-collection', async(e, video, collectionTitle, chosenTags) => {
    let mss;
    const user = await User.findOne({ email: userInfo.email });
    let collection = await Collection.findOne({ title: collectionTitle, id_user: user._id });
    collection.resource.push({
        type: video.type,
        snippet: {
            date: video.date,
            id: video.id,
            startAt: video.startAt,
            endAt: video.endAt,
            comment: video.comment,
            tags: chosenTags
        }
    });

    try {
        mss = "Video guardado correctamente"
        collection = await collection.save();
        e.reply('new-video-collection', mss);
    } catch (error) {
        mss = "Ocurrio un error no se pudo guardar el video"
        e.reply('new-video-collection', mss);
    }
})

//* Se escucha el evento para agregar un nuevo canal en la coleccion, se busca la coleccion en la que se quiere guardar el canal y se envian los nuevos datos a la base de datos.
ipcMain.on('new-channel-collection', async(e, channel, collectionTitle, chosenTags) => {
    let mss
    const user = await User.findOne({ email: userInfo.email });
    let collection = await Collection.findOne({ title: collectionTitle, id_user: user._id });
    collection.resource.push({
        type: channel.type,
        snippet: {
            date: channel.date,
            id: channel.id,
            comment: channel.comment,
            tags: chosenTags
        }
    });

    try {
        mss = "Playlist guardada correctamente"
        collection = await collection.save();
        e.reply('new-channel-collection', mss);
    } catch (error) {
        mss = "Ocurrio un error no se pudo guardar el video"
        e.reply('new-channel-collection', mss);
    }
})

//* Se escucha el evento para agregar una nueva playlist en la coleccion, se busca la coleccion en la que se quiere guardar la playlist y se envian los nuevos datos a la base de datos.
ipcMain.on('new-playList-collection', async(e, playList, collectionTitle, chosenTags) => {
    let mss;
    const user = await User.findOne({ email: userInfo.email });
    let collection = await Collection.findOne({ title: collectionTitle, id_user: user._id });
    collection.resource.push({
        type: playList.type,
        snippet: {
            date: playList.date,
            id: playList.id,
            comment: playList.comment,
            tags: chosenTags
        }
    });
    try {
        mss = "Playlist guardada correctamente"
        collection = await collection.save();
        e.reply('new-playList-collection', mss);
    } catch (error) {
        mss = "Ocurrio un error no se pudo guardar la playList"
        e.reply('new-playList-collection', mss);
    }

})

//* Se buscan los datos de la coleccion que se envio desde cliente para editar y se envian los datos de la coleccion al cliente.
ipcMain.on('get-edit-collection', async(e, title) => {
    const user = await User.findOne({ email: userInfo.email });
    const getCollection = await Collection.findOne({ title: title, id_user: user._id }, { 'title': 1, 'tags': 1, 'description': 1, '_id': 1 });
    e.reply('get-edit-collection', getCollection);
})

//* Se buscan los datos de la coleccion que se envio desde cliente para borrar de la base de datos.
ipcMain.on('delete-collection',async (e,title)=>{
    const user = await User.findOne({ email: userInfo.email });
    await Collection.findOneAndDelete({ title: title, id_user: user._id });
    e.reply('delete-collection');
})

//* Se obtiene el titulo de una coleccion seleccionada y se guarda.
ipcMain.on('get-collection', (e, title) => {
    titleCollection = title;

});

//* Se obtienen los nuevos datos que se quieren actualizar en la coleccion y se guardan en la base de datos reemplazando los anteriores.
ipcMain.on('edit-collection', async(e, editCollection, chosenTagsEdit) => {
    const user = await User.findOne({ email: userInfo.email });
    const collectionExist = await Collection.findOne({title: editCollection.title, id_user: user._id })
    if (collectionExist) {
        const mss = "la nombre de la coleccion ya existe, por favor intenta poner un nombre nuevo"
        e.reply('edit-collection',mss)
    } else {
        let collection = await Collection.findOne({ title: titleCollection, id_user: user._id });
        collection.title = editCollection.title;
        collection.description = editCollection.description;
        collection.tags = chosenTagsEdit;
        try {
            collection = await collection.save();
            e.reply('edit-collection')
        } catch (error) {}
        
    }
    
});

//* Se escucha el evento y se devuelven los recursos que hay en la coleccion para esto se usa la api para devolver todos los datos del recurso ya que en la base de datos solo se guarda el id para luego obtenerlo de la api.
ipcMain.on('get-collection-select', async(e) => {
    let videos = [];
    let playList = [];
    let channel = [];
    let elementsVideo = [];
    let elementsPlaylist = [];
    let elementsChannel = [];
    let chainVideo = "";
    let chainPlaylist = "";
    let chainChannel = "";
    const user = await User.findOne({ email: userInfo.email });
    const getCollection = await Collection.findOne({ title: titleCollection, id_user: user._id });
    //*Se obtienen los datos de la base de datos y se crea un string con todos los id de cada recurso para poner esa cadena de ids en la api.
    getCollection.resource.forEach((element, i) => {
            if (element.type == 'VIDEO') {
                elementsVideo.push({
                    id: element.snippet.id,
                    startAt: element.snippet.startAt,
                    endAt: element.snippet.endAt,
                    tags: element.snippet.tags,
                    comment: element.snippet.comment,
                });
                chainVideo += '&id=' + element.snippet.id;
            } else if (element.type == 'PLAYLIST') {
                elementsPlaylist.push({
                    id: element.snippet.id,
                    tags: element.snippet.tags,
                    comment: element.snippet.comment,
                })
                chainPlaylist += '&id=' + element.snippet.id;
            } else if (element.type == 'CHANNEL') {
                elementsChannel.push({
                    id: element.snippet.id,
                    tags: element.snippet.tags,
                    comment: element.snippet.comment,
                })
                chainChannel += '&id=' + element.snippet.id;
            }
        })
    //* Busqueda de colecciones para recomendar en función de etiquetas similares.
    const collections = await Collection.find({ tags: { $in: getCollection.tags }, id_user: user._id });
    let relatedCollections = [];
    collections.forEach((element, index) => {
        if (element.title != getCollection.title) {
            relatedCollections.push({
                title: element.title,
                description: element.description
            })
        }
    })
    
    //*Se hace el llamado a la api con el string de los ids de los videos concatenados
    let apiCallVideo = 'https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics%2Cstatus' + chainVideo + '&key=';
    Axios.get(apiCallVideo + YOUTUBE_API_KEY, {
        headers: {
            Host: 'www.googleapis.com',
            Authorization: 'Bearer ' + userToken.access_token,
            Accept: 'application/json'
        }
    }).then((res) => {
        let data = res.data.items;
        for (let i = 0; i < data.length; i++) {
            elementsVideo.forEach(element => {
                if (element.id == data[i].id) {
                    videos.push({
                        startAt: element.startAt,
                        endAt: element.endAt,
                        tags: element.tags,
                        comment: element.comment,
                        title: data[i].snippet.title,
                        image: data[i].snippet.thumbnails.medium,
                        channelTitle: data[i].snippet.channelTitle,
                        videoId: data[i].id,
                        date: data[i].snippet.publishedAt,
                        channelId: data[i].snippet.channelId,
                        duration: data[i].contentDetails.duration,
                        publicStatsViewable: data[i].status.publicStatsViewable,
                        viewCount: data[i].statistics.viewCount,
                        likeCount: data[i].statistics.likeCount,
                        dislikeCount: data[i].statistics.dislikeCount,
                        commentCount: data[i].statistics.commentCount
                    })
                }
            });
        }
        //*Se hace el llamado a la api con el string de los ids de las playlists concatenados
        let apiCallPlayList = 'https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails' + chainPlaylist + '&key='
        Axios.get(apiCallPlayList + YOUTUBE_API_KEY, {
            headers: {
                Host: 'www.googleapis.com',
                Authorization: 'Bearer ' + userToken.access_token,
                Accept: 'application/json'
            }
        }).then((res) => {
            let data = res.data.items;
            for (let i = 0; i < data.length; i++) {
                elementsPlaylist.forEach(element => {
                    if (element.id == data[i].id) {
                        playList.push({
                            tags: element.tags,
                            comment: element.comment,
                            title: data[i].snippet.title,
                            image: data[i].snippet.thumbnails.medium,
                            channelTitle: data[i].snippet.channelTitle,
                            channelId: data[i].snippet.channelId,
                            id: data[i].id,
                            date: data[i].snippet.publishedAt,
                            itemsCount : data[i].contentDetails.itemCount
                        })
                    }
                });   
            }
            //*Se hace el llamado a la api con el string de los ids de los canales concatenados
            let apiCallChannel = 'https://youtube.googleapis.com/youtube/v3/channels?part=snippet' + chainChannel + '&key='
            Axios.get(apiCallChannel + YOUTUBE_API_KEY, {
                headers: {
                    Host: 'www.googleapis.com',
                    Authorization: 'Bearer ' + userToken.access_token,
                    Accept: 'application/json'
                }
            }).then((res) => {
                let data = res.data.items;
                for (let i = 0; i < data.length; i++) {
                    elementsChannel.forEach(element => {
                        if (element.id == data[i].id) {
                            channel.push({
                                id: element.id,
                                tags: element.tags,
                                comment: element.comment,
                                title: data[i].snippet.title,
                                image: data[i].snippet.thumbnails.default.url,
                                date: data[i].snippet.publishedAt,
                            })
                        }
                    });

                }
                e.reply('get-collection-select', videos, playList, channel, relatedCollections)
            }).catch(error =>{
                e.reply('get-collection-select', videos, playList, channel, relatedCollections)
            });
        }).catch(error =>{
            //*Se hace el llamado a la api con el string de los ids de los canales concatenados
            let apiCallChannel = 'https://youtube.googleapis.com/youtube/v3/channels?part=snippet' + chainChannel + '&key='
            Axios.get(apiCallChannel + YOUTUBE_API_KEY, {
                headers: {
                    Host: 'www.googleapis.com',
                    Authorization: 'Bearer ' + userToken.access_token,
                    Accept: 'application/json'
                }
            }).then((res) => {
                let data = res.data.items;
                for (let i = 0; i < data.length; i++) {
                    elementsChannel.forEach(element => {
                        if (element.id == data[i].id) {
                            channel.push({
                                id: element.id,
                                tags: element.tags,
                                comment: element.comment,
                                title: data[i].snippet.title,
                                image: data[i].snippet.thumbnails.default.url,
                                date: data[i].snippet.publishedAt,
                            })
                        }
                    });

                }
                e.reply('get-collection-select', videos, playList, channel, relatedCollections)
            }).catch(error =>{
                e.reply('get-collection-select', videos, playList, channel, relatedCollections)
            });
        });
    }).catch(error =>{
        //*Se hace el llamado a la api con el string de los ids de las playlists concatenados
        let apiCallPlayList = 'https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails' + chainPlaylist + '&key='
        Axios.get(apiCallPlayList + YOUTUBE_API_KEY, {
            headers: {
                Host: 'www.googleapis.com',
                Authorization: 'Bearer ' + userToken.access_token,
                Accept: 'application/json'
            }
        }).then((res) => {
            let data = res.data.items;
            for (let i = 0; i < data.length; i++) {
                elementsPlaylist.forEach(element => {
                    if (element.id == data[i].id) {
                        playList.push({
                            tags: element.tags,
                            comment: element.comment,
                            title: data[i].snippet.title,
                            image: data[i].snippet.thumbnails.medium,
                            channelTitle: data[i].snippet.channelTitle,
                            channelId: data[i].snippet.channelId,
                            id: data[i].id,
                            date: data[i].snippet.publishedAt,
                            itemsCount : data[i].contentDetails.itemCount
                        })
                    }
                });

            }
            //*Se hace el llamado a la api con el string de los ids de los canales concatenados
            let apiCallChannel = 'https://youtube.googleapis.com/youtube/v3/channels?part=snippet' + chainChannel + '&key='
            Axios.get(apiCallChannel + YOUTUBE_API_KEY, {
                headers: {
                    Host: 'www.googleapis.com',
                    Authorization: 'Bearer ' + userToken.access_token,
                    Accept: 'application/json'
                }
            }).then((res) => {
                let data = res.data.items;
                for (let i = 0; i < data.length; i++) {
                    elementsChannel.forEach(element => {
                        if (element.id == data[i].id) {
                            channel.push({
                                id: element.id,
                                tags: element.tags,
                                comment: element.comment,
                                title: data[i].snippet.title,
                                image: data[i].snippet.thumbnails.default.url,
                                date: data[i].snippet.publishedAt,
                            })
                        }
                    });

                }
                e.reply('get-collection-select', videos, playList, channel, relatedCollections)
            }).catch(error =>{
                e.reply('get-collection-select', videos, playList, channel, relatedCollections)
            });
        }).catch(error =>{
            let apiCallChannel = 'https://youtube.googleapis.com/youtube/v3/channels?part=snippet' + chainChannel + '&key='
            Axios.get(apiCallChannel + YOUTUBE_API_KEY, {
                headers: {
                    Host: 'www.googleapis.com',
                    Authorization: 'Bearer ' + userToken.access_token,
                    Accept: 'application/json'
                }
            }).then((res) => {
                let data = res.data.items;
                for (let i = 0; i < data.length; i++) {
                    elementsChannel.forEach(element => {
                        if (element.id == data[i].id) {
                            channel.push({
                                id: element.id,
                                tags: element.tags,
                                comment: element.comment,
                                title: data[i].snippet.title,
                                image: data[i].snippet.thumbnails.default.url,
                                date: data[i].snippet.publishedAt,
                            })
                        }
                    });

                }
                e.reply('get-collection-select', videos, playList, channel, relatedCollections)
            }).catch(error =>{
                e.reply('get-collection-select', videos, playList, channel, relatedCollections)
            });
        });
    });
})



//* Se escucha el envento borrar desde el cliente se busca en la base de datos el id del recurso que se quiere eliminar, se extrae y luego se actualiza la base de datos.
ipcMain.on('delete-video-playList-channel', async(e, id) => {
    const user = await User.findOne({ email: userInfo.email });
    const collection = await Collection.findOne({ title: titleCollection, id_user: user._id });
    collection.resource.map((element, i) => {
        if (element.snippet.id == id) {
            collection.resource.splice(i, 1);
        }
    })
    await collection.save();
    e.reply('delete-video-playList-channel');
})

//* Se escucha el evento de editar el recurso del video se obtienen los datos que se quieren actualizar y se modifica la base de datos.
ipcMain.on('edit-video-collection', async(e, id, VideoCollection, chosenTags) => {
    const user = await User.findOne({ email: userInfo.email });
    const collection = await Collection.findOne({ title: titleCollection, id_user: user._id });
    collection.resource.map((element, i) => {
        if (element.snippet.id == id) {
            collection.resource[i].snippet.comment = VideoCollection.comment;
            if (VideoCollection.startAt != null) {
                collection.resource[i].snippet.startAt = VideoCollection.startAt;
            }
            if (VideoCollection.endAt != null) {
                collection.resource[i].snippet.endAt = VideoCollection.endAt;
            }
            collection.resource[i].snippet.tags = chosenTags;
        }

    })
    await collection.save();
    e.reply('edit-video-playlist-channel-collection');
})

//* Se escucha el evento de editar el recurso del playlist se obtienen los datos que se quieren actualizar y se modifica la base de datos.
ipcMain.on('edit-playlist-collection', async(e, id, playListCollection, chosenTagsEditPlaylist) => {
    const user = await User.findOne({ email: userInfo.email });
    const collection = await Collection.findOne({ title: titleCollection, id_user: user._id });
    collection.resource.map((element, i) => {
        if (element.snippet.id == id) {
            collection.resource[i].snippet.comment = playListCollection.comment;
            collection.resource[i].snippet.tags = chosenTagsEditPlaylist;
        }

    })
    await collection.save();
    e.reply('edit-video-playlist-channel-collection');
})

//* Se escucha el evento de editar el recurso del canal se obtienen los datos que se quieren actualizar y se modifica la base de datos.
ipcMain.on('edit-channel-collection', async(e, id, channelCollection, chosenTagsEditChannel) => {
    const user = await User.findOne({ email: userInfo.email });
    const collection = await Collection.findOne({ title: titleCollection, id_user: user._id });
    collection.resource.map((element, i) => {
        if (element.snippet.id == id) {
            collection.resource[i].snippet.comment = channelCollection.comment;
            collection.resource[i].snippet.tags = chosenTagsEditChannel;
        }

    })
    await collection.save();
    e.reply('edit-video-playlist-channel-collection');
})
