/* initialise variables */

var inputTitle = document.querySelector('.new-note input');
var inputBody = document.querySelector('.new-note textarea');
var global_id = "1";
var noteContainer = document.querySelector('.note-container');
var favouritesContainer = document.querySelector('.startpage-favourites-container');

var clearBtn = document.querySelector('.clear');
var addBtn = document.querySelector('.add');
var editModeBtn = document.querySelector('.edit-icon');

/* generic error handler */
function onError(error) {
  console.log(error);
}

function defaultEventListener() {
  addBtn.addEventListener('click', addNote);
  clearBtn.addEventListener('click', clearAll);
  editModeBtn.addEventListener('click', EditOverlay);
}

/* display previously-saved stored notes on startup */

initialize();

function initialize() {
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var noteKeys = Object.keys(results);
    for (let noteKey of noteKeys) {
        if(noteKey !== "startpage-settings"){
          console.log("KEY: "+noteKey);
          var id = results[noteKey].ref;
          var text = results[noteKey].text;
          displayNote("2",noteKey,text);
        }
      }
  }, onError);
  var gettingSettingsItem = browser.storage.local.get("startpage-settings");
  console.log("Checking if Settings are in keys");
  gettingSettingsItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1) {
      console.log("Settings Not Found");
      storeSettings("1");
    }
  }, onError);
  defaultEventListener();
}

function EditOverlay() {
  var startpageContainerHTML = document.querySelector('.startpage-container');
  var bool = startpageContainerHTML.classList.contains('edit-mode');
  if(bool){
    removeEditOverlay();
    switchIconsToLogo();
  } else {
    startpageContainerHTML.setAttribute("style", "background-color: grey;");
    startpageContainerHTML.setAttribute('class','startpage-container edit-mode');
    displayAddNewFavourite();
    console.log("switchIconsToEditAndDelete");
    switchIconsToEditAndDelete();
  }
}

function removeEditOverlay() {
  var startpageContainerHTML = document.querySelector('.startpage-container');
  startpageContainerHTML.setAttribute("style", "background-color: white;");
  startpageContainerHTML.setAttribute('class','startpage-container');
  var newFavouriteContainerHTML = document.querySelector('.new-favourite-container');
  newFavouriteContainerHTML.parentNode.removeChild(newFavouriteContainerHTML);
}

function switchIconsToEditAndDelete() {
  var editDeleteIconDivs = document.querySelectorAll('.edit-delete-icons');
  for (i = 0; i < editDeleteIconDivs.length; ++i) {
    console.log(i);
    editDeleteIconDivs[i].setAttribute('style','display: inline-block');
  }
  var FavouritesIconDivs = document.querySelectorAll('.favourite-icon');
  for (i = 0; i < FavouritesIconDivs.length; ++i) {
    console.log(i);
    FavouritesIconDivs[i].setAttribute('style','display: none');
  }

}

function switchIconsToLogo() {
  var editDeleteIconDivs = document.querySelectorAll('.edit-delete-icons');
  for (i = 0; i < editDeleteIconDivs.length; ++i) {
    editDeleteIconDivs[i].setAttribute('style','display: none');
  }
  var FavouritesIconDivs = document.querySelectorAll('.favourite-icon');
  for (i = 0; i < FavouritesIconDivs.length; ++i) {
    FavouritesIconDivs[i].setAttribute('style','display: inline-block');
  }
}

function displayAddNewFavourite() {
  var newfavouritecontainer = document.createElement('div');
  var newfavouritebox = document.createElement('div');
  var favouriteboximage = document.createElement('div');
  var favouriteIconbox = document.createElement('i');
  var favouriteHiddenImageUrl = document.createElement('input');
  var favouriteboxtitle = document.createElement('div');
  newfavouritecontainer.setAttribute('class','grid-25 tablet-grid-33 new-favourite-container');
  newfavouritebox.setAttribute('class','new-favourite-box');
  //newfavouritebox.setAttribute('href', "#");
  favouriteboximage.setAttribute('class','grid-100 new-favourite-box-image');
  favouriteIconbox.setAttribute('class','fa fa-5x fa-plus');
  favouriteIconbox.setAttribute('aria-hidden','true');
  favouriteHiddenImageUrl.setAttribute('type','hidden');
  favouriteHiddenImageUrl.setAttribute('aria-hidden','hidden');
  favouriteHiddenImageUrl.setAttribute('name','hiddenField');
  favouriteHiddenImageUrl.setAttribute('value','');
  favouriteHiddenImageUrl.setAttribute('class','hiddenField');

  favouriteboxtitle.setAttribute('class','grid-100 new-favourite-box-title');

  favouriteboximage.appendChild(favouriteHiddenImageUrl);
  favouriteboximage.appendChild(favouriteIconbox);
  newfavouritebox.appendChild(favouriteboximage);
  newfavouritebox.appendChild(favouriteboxtitle);
  newfavouritecontainer.appendChild(newfavouritebox);
  favouritesContainer.appendChild(newfavouritecontainer);

  newfavouritecontainer.addEventListener('click',(e) => {
    const evtTgt = e.target;
    console.log("NEW Favourite Box Selected"+evtTgt);
  })
}

/* Add a note to the display, and storage */

function addNote() {
  var noteTitle = inputTitle.value;
  var noteBody = inputBody.value;
  var gettingItem = browser.storage.local.get(noteTitle);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && noteTitle !== '' && noteBody !== '') {
      inputTitle.value = '';
      inputBody.value = '';
      storeNote("1",noteTitle,noteBody);
    }
  }, onError);
}

/* function to store a new note in storage */

function storeNote(id, title, url) {
  var storingNote = browser.storage.local.set({ [title] : { "id" : id, "title" : title, "url" : url} });
  storingNote.then(() => {
    displayNote(id, title,url);
  }, onError);
}

function storeSettings(id) {
  console.log("storeSettings: "+ id);
  var storingSettings = browser.storage.local.set({ ["startpage-settings"] : { "id" : id} });
}


/* function to display a note in the note box */

function displayNote(id, title, url) {
  /* create note display box */
  var note = document.createElement('div');
  var noteDisplay = document.createElement('div');
  var noteH = document.createElement('h2');
  var notePara = document.createElement('p');
  var notePid = document.createElement('p');
  var deleteBtn = document.createElement('button');
  var clearFix = document.createElement('div');

  var favouritecontainer = document.createElement('div');
  var favouritebox = document.createElement('a');
  var favouriteboximage = document.createElement('div');
  var editdeleteiconfavouritebox = document.createElement('div');
  var editiconfavouritebox = document.createElement('div');
  var deleteiconfavouritebox = document.createElement('div');
  var favouriteIconbox = document.createElement('i');
  var editIconbox = document.createElement('i');
  var deleteIconbox = document.createElement('i');
  var favouriteHiddenImageUrl = document.createElement('input');
  var favouriteboxtitle = document.createElement('div');
  favouritecontainer.setAttribute('id',title);
  favouritecontainer.setAttribute('class','grid-25 tablet-grid-33 favourite-container');
  favouritebox.setAttribute('class','favourite-box');
  favouritebox.setAttribute('href', "http://google.com");
  editdeleteiconfavouritebox.setAttribute('class','grid-100 edit-delete-icons');
  editdeleteiconfavouritebox.setAttribute('style','display: none');
  editiconfavouritebox.setAttribute('class','grid-50 edit-favourite-icon');
  editiconfavouritebox.setAttribute('style','justify-content: center; align-items: center; display: flex;');
  deleteiconfavouritebox.setAttribute('class','grid-50 delete-favourite-icon');
  deleteiconfavouritebox.setAttribute('style','justify-content: center; align-items: center; display: flex;');
  favouriteboximage.setAttribute('class','grid-100 favourite-box-image');
  favouriteIconbox.setAttribute('class','favourite-icon fa fa-5x fa-youtube');
  favouriteIconbox.setAttribute('aria-hidden','true');
  editIconbox.setAttribute('class','fa fa-4x fa-pencil-square-o');
  editIconbox.setAttribute('aria-hidden','true');
  deleteIconbox.setAttribute('class','fa fa-4x fa-trash-o');
  deleteIconbox.setAttribute('aria-hidden','true');
  favouriteHiddenImageUrl.setAttribute('type','hidden');
  favouriteHiddenImageUrl.setAttribute('aria-hidden','hidden');
  favouriteHiddenImageUrl.setAttribute('id','label'+title);
  favouriteHiddenImageUrl.setAttribute('name','hiddenField');
  favouriteHiddenImageUrl.setAttribute('value','images/paris.jpg');
  favouriteHiddenImageUrl.setAttribute('class','hiddenField');

  favouriteboxtitle.setAttribute('class','grid-100 favourite-box-title');
  favouriteboxtitle.textContent = title;

  editiconfavouritebox.appendChild(editIconbox);
  deleteiconfavouritebox.appendChild(deleteIconbox);
  editdeleteiconfavouritebox.appendChild(editiconfavouritebox);
  editdeleteiconfavouritebox.appendChild(deleteiconfavouritebox);
  favouriteboximage.appendChild(favouriteHiddenImageUrl);
  favouriteboximage.appendChild(favouriteIconbox);
  favouriteboximage.appendChild(editdeleteiconfavouritebox);
  favouritebox.appendChild(favouriteboximage);
  favouritebox.appendChild(favouriteboxtitle);
  favouritecontainer.appendChild(favouritebox);
  favouritesContainer.appendChild(favouritecontainer);

  note.setAttribute('class','note');

  noteH.textContent = title;
  notePara.textContent = url;
  notePid.textContent = id;
  deleteBtn.setAttribute('class','delete');
  deleteBtn.textContent = 'Delete note';
  clearFix.setAttribute('class','clearfix');

  noteDisplay.appendChild(noteH);
  noteDisplay.appendChild(notePara);
  noteDisplay.appendChild(notePid);
  noteDisplay.appendChild(deleteBtn);
  noteDisplay.appendChild(clearFix);

  note.appendChild(noteDisplay);

  /* set up listener for the delete functionality */

  deleteBtn.addEventListener('click',(e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    browser.storage.local.remove(title);
  })

  favouritebox.addEventListener('click',(e) => {
    const evtTgt = e.target;
    console.log("Favourites Box"+evtTgt);
    var startpageContainerHTML = document.querySelector('.startpage-container');
    var bool = startpageContainerHTML.classList.contains('edit-mode');
    if(bool){
      e.preventDefault();
      alert("Edit mode");
    }
  })


  favouritebox.addEventListener('mouseenter',(e) => {
    const evtTgt = e.target;
    var startpageContainerHTML = document.querySelector('.startpage-container');
    var bool = startpageContainerHTML.classList.contains('edit-mode');
    if(bool){

    } else {
      var backgroundImgBox = evtTgt.firstChild;
      var backgroundImgBoxUrl = evtTgt.firstChild.firstChild.value;
      backgroundImgBox.setAttribute("style", "background-image: url("+"/"+backgroundImgBoxUrl+')');
      //backgroundImgBox.setAttribute("style", "background-color: red");
    }
  });

  favouritebox.addEventListener('mouseleave',(e) => {
    const evtTgt = e.target;
    var backgroundImgBox = evtTgt.firstChild;
    backgroundImgBox.setAttribute("style", "background-image: none");
  });

  /* create note edit box */
  var noteEdit = document.createElement('div');
  var noteTitleEdit = document.createElement('input');
  var noteBodyEdit = document.createElement('textarea');
  var clearFix2 = document.createElement('div');

  var updateBtn = document.createElement('button');
  var cancelBtn = document.createElement('button');

  updateBtn.setAttribute('class','update');
  updateBtn.textContent = 'Update note';
  cancelBtn.setAttribute('class','cancel');
  cancelBtn.textContent = 'Cancel update';

  noteEdit.appendChild(noteTitleEdit);
  noteTitleEdit.value = title;
  noteEdit.appendChild(noteBodyEdit);
  noteBodyEdit.textContent = url;
  noteEdit.appendChild(updateBtn);
  noteEdit.appendChild(cancelBtn);

  noteEdit.appendChild(clearFix2);
  clearFix2.setAttribute('class','clearfix');

  note.appendChild(noteEdit);

  noteContainer.appendChild(note);
  noteEdit.style.display = 'none';

  /* set up listeners for the update functionality */

  noteH.addEventListener('click',() => {
    noteDisplay.style.display = 'none';
    noteEdit.style.display = 'block';
  })

  notePara.addEventListener('click',() => {
    noteDisplay.style.display = 'none';
    noteEdit.style.display = 'block';
  })

  cancelBtn.addEventListener('click',() => {
    noteDisplay.style.display = 'block';
    noteEdit.style.display = 'none';
    noteTitleEdit.value = title;
    noteBodyEdit.value = url;
  })

  updateBtn.addEventListener('click',() => {
    if(noteTitleEdit.value !== title || noteBodyEdit.value !== url) {
      updateNote(title,noteTitleEdit.value,noteBodyEdit.value);
      note.parentNode.removeChild(note);
    }
  });
}


/* function to update notes */

function updateNote(delNote,newTitle,newBody) {
  var storingNote = browser.storage.local.set({ [newTitle] : newBody });
  storingNote.then(() => {
    if(delNote !== newTitle) {
      var removingNote = browser.storage.local.remove(delNote);
      removingNote.then(() => {
        displayNote(newTitle, newBody);
      }, onError);
    } else {
      displayNote(newTitle, newBody);
    }
  }, onError);
}

/* Clear all notes from the display/storage */

function clearAll() {
  while (noteContainer.firstChild) {
      noteContainer.removeChild(noteContainer.firstChild);
  }
  browser.storage.local.clear();
}
