//* Cuando se presiona una tecla en el input se hace un llamado a la base de datos para obtener resultados similares.
function keyPressValue(tagInput,selectTag) {
    const searchTag = document.getElementById(tagInput).value;
    console.log(searchTag)
    ipcRenderer.send('search-tag', searchTag,selectTag);
}

//* Cuando se selecciona un tag se verfica si el tag no ha sido seleccionado anteriormente se agrega al array y se pinta en pantalla ademas se devuelve el array con los nuevos datos.
function selectionTag(tag,labelTags,chosenTags) {
    console.log(chosenTags,tag,labelTags)
    let someTag = chosenTags.filter(choseTag => { return choseTag == tag });
    if (someTag.length === 0) {
        chosenTags.push(tag);
    }

    document.getElementById(labelTags).innerHTML = "";
    chosenTags.forEach(tagSelected => {
        document.getElementById(labelTags).innerHTML += `
        <label for="description">${tagSelected} </label>
        <a onClick="sendDataDeletedTag('${tagSelected}','${labelTags}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
      </svg></a>
        `
    });
    return chosenTags;
}

//* La etiqueta se envía para ser guardada en la base de datos y se verifica si es una etiqueta válida para ser introducida se agrega el tag al array y se devuelve el array nuevo.
function saveTag(tagInput,noSave,save,labelTags,chosenTags) {
    console.log(tagInput,noSave,save,labelTags,chosenTags)
    const tags = document.getElementById(tagInput).value;
    if (tags != "") {
        ipcRenderer.send('new-tag', tags);
        ipcRenderer.on('new-tag', (e, mss) => {
            document.getElementById(save).innerHTML = mss;
            document.getElementById(tagInput).value = "";
            chosenTags = selectionTag(tags,labelTags,chosenTags);
        });
    } else {
        document.getElementById(noSave).innerHTML = "Ingrese un tag para guardar";
        document.getElementById(save).innerHTML = "";
        document.getElementById(tagInput).value = "";
    }
    return chosenTags;
}

//* Se elimina el tag seleccionado del array se pinta en pantalla el nuevo array y se devuelve el array.
function deletedTag(tag,labelTags,chosenTags) {
    console.log(chosenTags)
    chosenTags.map((value, i) => {
        if (value === tag) {
            chosenTags.splice(i, 1);
        }
    })
    if (!chosenTags.length) {
        document.getElementById(labelTags).innerHTML = "";
    } else {
        document.getElementById(labelTags).innerHTML = "";
        chosenTags.forEach(tagSelected => {
            document.getElementById(labelTags).innerHTML += `
            <label for="description">${tagSelected} </label>
            <a onClick="sendDataDeletedTag('${tagSelected}','${labelTags}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg></a>
        `;
        });
    }
    return chosenTags;
}

module.exports = {keyPressValue,selectionTag,deletedTag,saveTag};