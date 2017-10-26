/* global IDBFiles */
/* initialise variables */

var inputTitle = document.querySelector('.new-note input');
var inputBody = document.querySelector('.new-note textarea');
var global_id = "1";
var noteContainer = document.querySelector('.note-container');
var favouritesContainer = document.querySelector('.startpage-favourites-container');
var dateTimeContainer = document.querySelector('.timeDateValue');
var settingsContainer = document.querySelector('.settings-container');
var settingsRowCountLabel = document.querySelector('#ItemsPerRowCountLabel');
var settingsRowCountTextField = document.querySelector('input[name="ItemsPerRowCountTextBox"]');
var settingsUpdateBtn = document.querySelector('input[id="UpdateSettingsBtn"]');
var itemsPerRowRadio = document.querySelector('input[name="itemsPerRowRadio"]:checked');
var backgroundImageDropZone = document.querySelector('.image-drop-zone');
var backgroundImageDisplayZone = document.querySelector('.image-display-zone');
var startpageContainerHTML = document.querySelector('.startpage-container');

var clearBtn = document.querySelector('.clear');
var addBtn = document.querySelector('.add');
var editModeBtn = document.querySelector('.edit-icon');
var settingsBtn = document.querySelector('.settings-icon');
var settingsMode = false;
var currentCssClassSize = "grid-25";
var changeLinksToHttps = true;

var settingsBackgroundImageLimit = "6";
var settingsRowCountLimit = "4";
var settingsCurrentSelectedBackground;

imageStores = {
  collectedBlobs: [],
  lastMessage: undefined,
};

/* generic error handler */
function onError(error) {
  console.log(error);
}

function defaultEventListener() {
  addBtn.addEventListener('click', addFavourite);
  clearBtn.addEventListener('click', clearAll);
  editModeBtn.addEventListener('click', EditOverlay);
  settingsBtn.addEventListener('click', OpenSettings);
  settingsUpdateBtn.addEventListener('click', updateUiWithSettings);
  backgroundImageDropZone.addEventListener("dragend", processImageDragEndDropZone, false);
  backgroundImageDropZone.addEventListener("dragover", processImageDragOverDropZone, false);
  backgroundImageDropZone.addEventListener("drop", processImageDropZone, false);
}

/* display previously-saved stored notes on startup */

initialize();

async function initialize() {
  //createAndSaveImageStore("background-images",imageStores.collectedBlobs,"init");
  await setupBackgroundImages();
  var gettingSettingsItem = browser.storage.local.get("startpagesettings");
  console.log("Checking if Settings are in keys");
  gettingSettingsItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1) {
      console.log("Settings Not Found");
      storeSettings("1", "4","6","");
    } else {
      settingsBackgroundImageLimit = result.startpagesettings.storedBackgroundImageCount;
      settingsRowCountLimit = result.startpagesettings.RowCount;
      console.log(result.startpagesettings.SelectedBackgroundImage);
      settingsCurrentSelectedBackground = result.startpagesettings.SelectedBackgroundImage;
    }
    console.log("getNewCssClass"+settingsRowCountLimit);
    getNewCssClass(settingsRowCountLimit);
  }, onError);

  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var noteKeys = Object.keys(results);
    for (let noteKey of noteKeys) {
        if(noteKey !== "startpagesettings"){
          //console.log("KEY: "+noteKey);
          var id = results[noteKey].ref;
          var text = results[noteKey].text;
          var url = results[noteKey].url;
          var icon = results[noteKey].icon;
          //console.log(results[noteKey]);
          displayFavourite("2",noteKey,url,icon);
        }
      }
  }, onError);
  defaultEventListener();
  //dateTimeContainer.textContent = getDateTime();
}

function OpenSettings() {
  if(settingsMode){
    settingsContainer.setAttribute("style", "display: none;");
    settingsMode = false;
  } else {
    // var gettingSettingsItem = browser.storage.local.get("startpagesettings");
    // console.log("Checking if Settings are in keys");
    // gettingSettingsItem.then((result) => {
    //   var objTest = Object.keys(result);
    //   if(objTest.length < 1) {
    //     storeSettings("1","4","6");
    //     settingsRowCountTextField.value = "Items Per Row: 4";
    //   } else {
    //     settingsRowCountTextField.value = result.startpagesettings.RowCount;
    //   }
    // }, onError);
       if(!settingsRowCountLimit) {
         storeSettings("1","4","6","");
         settingsRowCountTextField.value = "4";
       } else {
         settingsRowCountTextField.value = settingsRowCountLimit;
       }
    settingsContainer.setAttribute("style", "display: block;");
    settingsMode = true;
  }
}

function updateUiWithSettings(){
  console.log("updateUiWithSettings");
  var newCountValue = settingsRowCountTextField.value;
  updateSettings(newCountValue);
}

function updateUi(newCssClass){
  var allFavouritesDivs = document.querySelectorAll('.favourite-container');
  var cssClass = newCssClass + " tablet-grid-33 favourite-container";
  for (i = 0; i < allFavouritesDivs.length; ++i) {
    allFavouritesDivs[i].setAttribute('class',cssClass);
  }
}

function EditOverlay() {
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
  startpageContainerHTML.setAttribute("style", "background-color: white;");
  startpageContainerHTML.setAttribute('class','startpage-container');
  var newFavouriteContainerHTML = document.querySelector('.new-favourite-container');
  newFavouriteContainerHTML.parentNode.removeChild(newFavouriteContainerHTML);
}

function switchIconsToEditAndDelete() {
  var editDeleteIconDivs = document.querySelectorAll('.edit-delete-icons');
  for (i = 0; i < editDeleteIconDivs.length; ++i) {
    editDeleteIconDivs[i].setAttribute('style','display: inline-block');
  }
  var FavouritesIconDivs = document.querySelectorAll('.favourite-icon');
  for (i = 0; i < FavouritesIconDivs.length; ++i) {
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

function getDateTime(){
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      return dateTime = date+' '+time;
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

function addFavourite() {
  var noteTitle = inputTitle.value;
  var noteBody = inputBody.value;
  var icon = "fa-steam-square";
  var gettingItem = browser.storage.local.get(noteTitle);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && noteTitle !== '' && noteBody !== '') {
      inputTitle.value = '';
      inputBody.value = '';
      storeFavourite("1",noteTitle,noteBody,icon);
    }
  }, onError);
}

/* function to store a new favourite in storage */
function storeFavourite(id, title, url, icon) {
  var storingNote = browser.storage.local.set({ [title] : { "id" : id, "title" : title, "url" : url, "icon" : icon} });
  storingNote.then(() => {
    displayFavourite(id, title,url, icon);
  }, onError);
}

function storeSettings(id, rowCount, backgroundCount, backgroundImage) {
  console.log("storeSettings: "+ id + ", RowCount: " +rowCount + ", BackgroundImageCount: " +backgroundCount);
  var storingNote = browser.storage.local.set({ ["startpagesettings"] : { "id" : id, "RowCount" : rowCount, "storedBackgroundImageCount" : backgroundCount,"SelectedBackgroundImage" : backgroundImage } });
  settingsBackgroundImageLimit = backgroundCount;
  settingsRowCountLimit = rowCount;
  settingsCurrentSelectedBackground = backgroundImage;
}

function generateValidUrl(url) {
  var createCorrectUrl;
  if(typeof url !== "undefined"){
    if(url.startsWith('www.')){
      createCorrectUrl = "https://" + url;
      return createCorrectUrl;
    } else if (!url.startsWith('http') && !url.startsWith('https') && !url.startsWith('www.')) {
      createCorrectUrl = "https://www." + url;
      return createCorrectUrl;
    } else {
      return url;
    }
  } else {
    return url;
  }
}

/* function to display a note in the note box */

function displayFavourite(id, title, url, icon) {
  var createCorrectUrl = generateValidUrl(url);

  //console.log(itemsPerRowRadio.value);
  //console.log("Correct URL: "+createCorrectUrl+ " OLD URL: "+ url);
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
  var classList = currentCssClassSize + " tablet-grid-33 favourite-container";
  favouritecontainer.setAttribute('class',classList);
  favouritebox.setAttribute('class','favourite-box');
  favouritebox.setAttribute('href', createCorrectUrl);
  editdeleteiconfavouritebox.setAttribute('class','grid-100 edit-delete-icons');
  editdeleteiconfavouritebox.setAttribute('style','display: none');
  editiconfavouritebox.setAttribute('class','grid-50 edit-favourite-icon');
  editiconfavouritebox.setAttribute('style','justify-content: center; align-items: center; display: flex;');
  deleteiconfavouritebox.setAttribute('class','grid-50 delete-favourite-icon');
  deleteiconfavouritebox.setAttribute('style','justify-content: center; align-items: center; display: flex;');
  favouriteboximage.setAttribute('class','grid-100 favourite-box-image');
  var iconClass = "favourite-icon fa fa-5x "+ icon;
  //console.log(iconClass);
  favouriteIconbox.setAttribute('class',iconClass);
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
    var bool = startpageContainerHTML.classList.contains('edit-mode');
    if(bool){
      e.preventDefault();
      //alert("Edit mode");
    }
  })

  editiconfavouritebox.addEventListener('click',(e) => {
    const evtTgt = e.target;
    alert("editiconfavouritebox");
  })

  deleteiconfavouritebox.addEventListener('click',(e) => {
    console.log("deleteiconfavouritebox");
    const evtTgt = e.target;
    var option1 = evtTgt.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    var option2 = evtTgt.parentNode.parentNode.parentNode.parentNode.parentNode;
    var bool = option2.classList.contains('favourite-container');
    console.log(bool)
    if(bool){
      option1.removeChild(evtTgt.parentNode.parentNode.parentNode.parentNode.parentNode);
    } else {
      option2.removeChild(evtTgt.parentNode.parentNode.parentNode.parentNode);
    }
    browser.storage.local.remove(title);
  })

  favouritebox.addEventListener('mouseenter',(e) => {
    const evtTgt = e.target;
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
      updateFavourite(title,noteTitleEdit.value,noteBodyEdit.value,icon);
      note.parentNode.removeChild(note);
    }
  });
}


/* function to update notes */

function updateFavourite(delNote,newTitle,newBody,icon) {
  var storingNote = browser.storage.local.set({ [newTitle] : newBody });
  storingNote.then(() => {
    if(delNote !== newTitle) {
      var removingNote = browser.storage.local.remove(delNote);
      removingNote.then(() => {
        displayFavourite(newTitle, newBody, icon);
      }, onError);
    } else {
      displayFavourite(newTitle, newBody, icon);
    }
  }, onError);
}

function updateSettings(newRowCount) {
  console.log()
  var gettingSettingsItem = browser.storage.local.get("startpagesettings");
  gettingSettingsItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1) {
      storeSettings("1", newRowCount, "6","");
    } else {
      if(result.startpagesettings.RowCount !== newRowCount)
      {
        console.log("Updated Settings");
        storeSettings("1",newRowCount, "6","");
        settingsRowCountTextField.value = newRowCount;
        updateUi(getNewCssClass(newRowCount));
      }
    }
  }, onError);
}

function getNewCssClass(rowCountRequired) {
  //console.log(rowCountRequired);
    switch(rowCountRequired) {
      case "1":
        currentCssClassSize = "grid-100";
        return "grid-100";
      case "2":
        currentCssClassSize = "grid-50";
        return "grid-50";
      case "3":
        currentCssClassSize = "grid-33";
        return "grid-33";
      case "4":
        currentCssClassSize = "grid-25";
        return "grid-25";
      case "5":
        currentCssClassSize = "grid-20";
        return "grid-20";
      default:
        currentCssClassSize = "grid-25";
        return "grid-25";
      }
}

function processImageDropZone(ev){
  console.log("Drop");
  ev.preventDefault();
  // If dropped items aren't files, reject them
  var dt = ev.dataTransfer;
  if (dt.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i=0; i < dt.items.length; i++) {
      if (dt.items[i].kind == "file") {
        var f = dt.items[i].getAsFile();
        console.log("... file[" + i + "].name = " + f.name);
        createAndSaveImageStore(dt.files[i].name,dt.files[i]);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i=0; i < dt.files.length; i++) {
      console.log("... file[" + i + "].name = " + dt.files[i].name);
      createAndSaveImageStore("background-images", dt.files[i].name,dt.files[i]);
    }
  }
}

function processImageDragEndDropZone(ev){
  console.log("dragEnd");
    // Remove all of the drag data
    var dt = ev.dataTransfer;
    if (dt.items) {
      // Use DataTransferItemList interface to remove the drag data
      for (var i = 0; i < dt.items.length; i++) {
        dt.items.remove(i);
      }
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
}

function processImageDragOverDropZone(ev){
  console.log("dragOver");
  // Prevent default select and drag behavior
  ev.preventDefault();
}

async function createAndSaveImageStore(filename, file) {
  console.log(filename);
  console.log(file);
    try {
      const tmpFiles = await IDBFiles.getFileStorage({
        name: "tmpFiles"
      });
      await tmpFiles.put(filename, file);
      const storedFiles = await tmpFiles.list();
      const storedFilesCount = storedFiles.length;
      console.log(storedFilesCount);
      if(storedFilesCount > settingsRowCountLimit){
        console.log("Count Excedded Deleting last image");
        //await deletedStoredBackgroundImageData();
      }
      await displayBackgroundImage(filename);

    } catch (err) {
      console.error("File storing error", err);
      throw err;
    }
}

async function getStoredData(filename) {
    try {
      const tmpFiles = await IDBFiles.getFileStorage({
     name: "tmpFiles"
   });
   // filtered count...
  //  console.log("getStoredData:TempData");
  //  console.log(tmpFiles);
   const storedData = await tmpFiles.get(filename);

   if (!storedData) {
     // No data stored with the specified filename.
   } else if (storedData instanceof Blob) {
     //console.log("storedData instanceof Blob");
     return storedData;
   } else if (storedData instanceof File) {
     //console.log("storedData instanceof File");
     return storedData;
   } else if (storedData instanceof IDBFiles.IDBPromisedMutableFile) {
     //console.log("storedData instanceof IDBFiles.IDBPromisedMutableFile");
     return storedData;
   }
  } catch (err) {
   console.error("Get stored data", err);
   throw err;
  }
}

async function setupBackgroundImages() {
  console.log("setupBackgroundImages: INIT");
  try {
      const tmpFiles = await IDBFiles.getFileStorage({name: "tmpFiles"});
      const storedFiles = await tmpFiles.list();
      if (storedFiles.length === 0) {
        console.log("No files stored.\n");
      } else {
        console.log("files stored.\n\n");
        for (const filename of storedFiles) {
          displayBackgroundImage(filename);
        }
      }
 } catch (err) {
  console.log("ERROR: exception raised while listing all the stored files:\n");
 }
}

async function deletedStoredBackgroundImageData(filename){
  try {
      const tmpFiles = await IDBFiles.getFileStorage({name: "tmpFiles"});
      await tmpFiles.remove(filename);
      console.log("All stored files have been removed.");
    } catch (err) {
      console.log("ERROR: exception raised while clearing the stored file");
    }
}

async function displayBackgroundImage(filename){
 var image = await getStoredData(filename);
 var objectURL = URL.createObjectURL(image);
 //console.log(image);
 //console.log(filename);
 //console.log(objectURL);
 var imageBoxBackground = document.createElement('div');
 var imageBoxBackgroundSelected = document.createElement('div');
 var selectedIconBox = document.createElement('i');
 imageBoxBackground.setAttribute("class", "grid-33 single-image-zone");
 imageBoxBackground.setAttribute("style", "background-image: url("+objectURL+')');
 if(settingsCurrentSelectedBackground == filename){
   imageBoxBackgroundSelected.setAttribute("style", "display: block");
 } else {
   imageBoxBackgroundSelected.setAttribute("style", "display: none");
 }

 imageBoxBackgroundSelected.setAttribute('class','single-image-zone-icon');
 selectedIconBox.setAttribute('aria-hidden','true');
 selectedIconBox.setAttribute('class','fa fa-2x fa-check-circle');
 selectedIconBox.setAttribute("style", "color: green");
 imageBoxBackgroundSelected.appendChild(selectedIconBox);
 imageBoxBackground.appendChild(imageBoxBackgroundSelected);
 backgroundImageDisplayZone.appendChild(imageBoxBackground);


 imageBoxBackground.addEventListener('click',() => {
   console.log("CLick imageBoxBackground");
   var backgroundImageDivs = document.querySelectorAll('.single-image-zone-icon');
   console.log(backgroundImageDivs);
   for (i = 0; i < backgroundImageDivs.length; ++i) {
     backgroundImageDivs[i].setAttribute("style", "display: none;");
   }
   imageBoxBackgroundSelected.setAttribute("style", "display: block;");
   startpageContainerHTML.setAttribute("style", "background-image: url("+objectURL+')');
   settingsCurrentSelectedBackground = filename;
   storeSettings("1", settingsRowCountLimit,settingsBackgroundImageLimit,filename);
 });
}
/* Clear all notes from the display/storage */
function clearAll() {
  while (noteContainer.firstChild) {
      noteContainer.removeChild(noteContainer.firstChild);
  }
  browser.storage.local.clear();
}
