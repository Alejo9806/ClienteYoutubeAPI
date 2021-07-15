const newVideoCollection = document.getElementById("newVideoCollection");
const tagInput = document.getElementById("tag");
const saveTag = document.getElementById("saveTag");
const save = document.getElementById("save");
const noSave = document.getElementById("noSave");
const labelTags = document.getElementById("labelTags");
const slectTag = document.getElementById("slectTag");
let chosenTags =[];
let videoId;
let videoDate;

document.addEventListener('DOMContentLoaded',(e)=>{
    ipcRenderer.send('collection');

})


ipcRenderer.on('collection',(e,collections)=>{
    console.log(collections);
    let selectedCollection = document.getElementById("selectedCollection");
    selectedCollection.innerHTML ='<option selected value="" >Open this select menu</option>';
    collections.forEach( (collection) => {
        selectedCollection.innerHTML+=`
        <option value="${collection.title}">${collection.title}</option>
        `
    });

});

ipcRenderer.on('video-collection-modal',(e,id,date,timeDuration)=>{
    console.log(id,date,timeDuration)
    let duration = timeDuration.split("");
    let timeS= '';
    let numero1 = '';
    let timeH= '';
    let timeM= '';
    for (let index = 2; index < duration.length; index++) {
            if (duration[index] == "H" || duration[index] == "M" || duration[index] == "S") {
                if(duration[index] == "H"){
                    timeH = numero1;
                    numero1 = '';
                }else if(duration[index] == "M"){
                    timeM =  numero1;
                    numero1 = '';
                }else if(duration[index] == "S"){
                    timeS =  numero1;
                    numero1 = '';
                }
            }
            if (!isNaN(duration[index])) {
                numero1 += duration[index];
            }
            
    }
    timeH = timeH*3600 
    timeM = timeM*60 
    let time = parseInt(timeH)+parseInt(timeM)+parseInt(timeS);
    videoId = id;
    videoDate = date;
    document.getElementById("startAt").setAttribute("max", time);
    document.getElementById("endAt").setAttribute("max",time);
});

newVideoCollection.addEventListener('submit',(e)=>{
    let collection = document.getElementById("selectedCollection").value;
    const video= {
        type:'VIDEO',
        startAt: document.getElementById("startAt").value,
        endAt: document.getElementById("endAt").value,
        date:videoDate,
        id:videoId,
        comment:document.getElementById("comment").value
    };
    console.log(collection,video)
    ipcRenderer.send('new-video-collection',video,collection,chosenTags);
    newVideoCollection.reset();
});

function keyPressValue(){
    const searchTag = tagInput.value;
    console.log(searchTag);
    ipcRenderer.send('search-tag',searchTag);
}

saveTag.addEventListener('click',(e)=>{
    const tags = tagInput.value;
    if(tags != ""){
        ipcRenderer.send('new-tag',tags);
        ipcRenderer.on('new-tag',(e,mss)=>{
            save.innerHTML = mss;
            tagInput.value = ""; 
            selectionTag(tags);
        });      
    }else{
        noSave.innerHTML = "Ingrese un tag para guardar"; 
        save.innerHTML = "";
        tagInput.value = ""; 
    }
});

ipcRenderer.on('search-tag',(e,tags)=>{
    console.log(tags);
    slectTag.innerHTML='';
    tags.forEach(tag_user => {
        slectTag.innerHTML+= `
        <a class="btn btn-danger" onClick="selectionTag('${tag_user._doc.tag}')">${tag_user._doc.tag}</a>
        `
    });
});

function selectionTag(tag) {

    let someTag = chosenTags.filter(choseTag => { return choseTag == tag});
    if (someTag.length ===0) {
        chosenTags.push(tag);
    }

    labelTags.innerHTML = "";
    chosenTags.forEach(tagSelected=> {
        labelTags.innerHTML+= `
        <label for="description">${tagSelected} </label>
        <a onClick="deletedTag('${tagSelected}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
      </svg></a>
        `
    });
}

function deletedTag(tag) {
    chosenTags.map((value,i)=>{
        if (value === tag)  {
            chosenTags.splice(i,1);
        }
    })
    if (!chosenTags.length) {
        labelTags.innerHTML ="";
    }else{ 
        labelTags.innerHTML ="";
        chosenTags.forEach(tagSelected=> {
            console.log(tagSelected);
            labelTags.innerHTML+= `
            <label for="description">${tagSelected} </label>
            <a onClick="deletedTag('${tagSelected}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg></a>
        `;
        });
    }
}

ipcRenderer.on('new-video-collection',(e,mss)=>{

})