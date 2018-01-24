var backgroundImageDropZone = document.querySelector('.image-drop-zone');
var backgroundImageDisplayZone = document.querySelector('.image-display-zone');
var backgroundImageInfoBlock = document.querySelector('.background-image-info-block');
var backgroundImageInfoBlockText = document.querySelector('.background-image-info-block-text');

var currentBackgroudnBlobUrl;
var settingsCurrentSelectedBackground;
var settingsBackgroundImageLimit = "6";
var settingsRowCountLimit = "4";
var currentOrderPosition = 0;

var settingsRowCountTextField = document.querySelector('input[name="ItemsPerRowCountTextBox"]');
var settingsUpdateStoredBackgroundImageCountTextField = document.querySelector('input[name="StoredBackgroundImagesCountTextBox"]');
var settingsUpdateStoredBackgroundImageCountBtn = document.querySelector('input[id="UpdateStoredBackgroundImagesBtn"]');
var settingsUpdateRowCountBtn = document.querySelector('input[id="UpdateSettingsRowCountBtn"]');

//import/export button selectors
var importDataIcon = document.querySelector('.import-data-icon');
var exportDataIcon = document.querySelector('.export-data-icon');
var importDataOverlay = document.querySelector('.import-list-overlay-container');
var importDataOverlayClose = document.querySelector('.import-list-overlay-box-close');

initialise();


async function initialise() {
  defaultEventListener();
  var gettingSettingsItem = browser.storage.local.get("startpagesettings");
  console.log("Checking if Settings are in keys");
  gettingSettingsItem.then(async (result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1) {
      console.log("Settings Not Found");
      storeSettings("1", "4","6","","1");
      settingsRowCountTextField.value = settingsRowCountLimit;
      settingsUpdateStoredBackgroundImageCountTextField.value = settingsBackgroundImageLimit;
    } else {
      console.log("SETTINGS:"+ result.startpagesettings.RowCount);
      settingsBackgroundImageLimit = result.startpagesettings.storedBackgroundImageCount;
      settingsRowCountLimit = result.startpagesettings.RowCount;
      console.log(result.startpagesettings.SelectedBackgroundImage);
      settingsCurrentSelectedBackground = result.startpagesettings.SelectedBackgroundImage;
      currentOrderPosition = result.startpagesettings.Order;
      console.log("INIT:currentOrderPosition"+currentOrderPosition);
      settingsRowCountTextField.value = result.startpagesettings.RowCount;
      settingsUpdateStoredBackgroundImageCountTextField.value = result.startpagesettings.storedBackgroundImageCount;
      await setupBackgroundImages();
      await setupbackgroundInit();
    }
  }, onError);
}

function defaultEventListener() {
  backgroundImageDropZone.addEventListener("dragend", processImageDragEndDropZone, false);
  backgroundImageDropZone.addEventListener("dragover", processImageDragOverDropZone, false);
  backgroundImageDropZone.addEventListener("drop", processImageDropZone, false);
  settingsUpdateRowCountBtn.addEventListener('click', updateRowCountWithSettings);
  settingsUpdateStoredBackgroundImageCountBtn.addEventListener('click', updateBackgroundWithSettings);
  importDataIcon.addEventListener('click', importData);
  exportDataIcon.addEventListener('click', exportData);
}

function updateRowCountWithSettings(){
  updateSettings("rowCount");
}


function updateBackgroundWithSettings(){
  updateSettings("backgroundImageCount");
}


function importData(){
  console.log("importData");
  importDataOverlay.setAttribute("style","display:block");
  importDataOverlayClose.addEventListener('click', closeImportOverlay);
}

function closeImportOverlay(){
  importDataOverlay.setAttribute("style","display:none");
  importDataOverlayClose.removeEventListener('click', closeImportOverlay);
}

async function exportData(){
  console.log("exportData");
  var settingsData = await getSettings();
  var favouritesData = await getFavouritesData();
  download(settingsData,favouritesData, 'filename.txt');
}

function getSettings(){
  return new Promise(resolve => {
     var settingsAray = [];
     var gettingSettingsItem = browser.storage.local.get("startpagesettings");
    gettingSettingsItem.then(async (result) => {
      var objTest = Object.keys(result);
        if(objTest.length < 1) {
          console.log("Settings Not Found");
          storeSettings("10", "4","6","","1");
        } else {
          var myString = "2";
          //settingsAray.push("##**SETTINGS**##");
          settingsAray.push("ID:"+result.startpagesettings.id);
          settingsAray.push("storedBackgroundImageCount:"+result.startpagesettings.storedBackgroundImageCount);
          settingsAray.push("RowCount:"+result.startpagesettings.RowCount);
          settingsAray.push("SelectedBackgroundImage:"+result.startpagesettings.SelectedBackgroundImage);
          settingsAray.push("Order:"+result.startpagesettings.Order);
        }
        console.log("Returning array");
        resolve(settingsAray);
    });
  });
}

function getFavouritesData(){
  return new Promise(resolve => {
     var favouritesAray = [];
     var joinedFavouritesAray = [];
     var completeArray = [];
     var gettingFavoutieItem = browser.storage.local.get("FavouriteList");
    gettingFavoutieItem.then(async (results) => {
      var favouriteKeys = Object.keys(results);
      var favouriteListKeys = Object.keys(results["FavouriteList"]);
      //favouritesAray.push("##**FAVOURITE LIST**##");
        for (let favListKey of favouriteListKeys) {
          for (let indiKet of results["FavouriteList"][favListKey]) {
              favouritesAray.push("KEY:"+indiKet);
              var entriesList = await getEntrriesInList(indiKet);
              var list = favouritesAray.concat(entriesList);
              favouritesAray.pop();
              joinedFavouritesAray = joinedFavouritesAray.concat(list);
            }
          }
           completeArray = joinedFavouritesAray;
           console.log(completeArray);
            resolve(completeArray);
         });
  });
}

function getEntrriesInList(listName){
    return new Promise(resolve => {
     var entriesListArray = [];
     var list = [];
     var joinedEntryArray = [];
     var getEntriesInList = browser.storage.local.get(listName);
     getEntriesInList.then(async (result) => {
         for (let dataObject of result[listName]["data"]){
           if(dataObject["Settings"] !== undefined){
              console.log("Settings");
           } else {
            entriesListArray.push("ENTRY:"+dataObject);
            var entry = await getEntryData(dataObject);
            console.log("ENTRY")
            console.log(entry)
            var list = entriesListArray.concat(entry);
            entriesListArray.pop();
            joinedEntryArray = joinedEntryArray.concat(list);
           }
         }
      resolve(joinedEntryArray);
    });
  });
}

function getEntryData(entryName){
    return new Promise(resolve => {
     var entryData = [];
     var getEntry = browser.storage.local.get(entryName);
     getEntry.then(async (entry) => {
       entryData.push("ID:"+entry[entryName].id);
       entryData.push("title:"+entry[entryName].title);
       entryData.push("url:"+entry[entryName].url);
       entryData.push("icon:"+entry[entryName].icon);
       entryData.push("iconColour:"+entry[entryName].iconColour);
       entryData.push("backgroundColour:"+entry[entryName].backgroundColour);
       entryData.push("Order:"+entry[entryName].Order);
      resolve(entryData);
    });
  });
}

function download(settingsAray, favouritesArray, strFileName) {
  	var csvContent = "data:text/csv;charset=utf-8,";

    for (var i = 0; i < settingsAray.length; i++) {
      dataString = settingsAray[i];
      csvContent += dataString+ "\r\n";
    }

    for (var i = 0; i < favouritesArray.length; i++) {
      dataString = favouritesArray[i];
      csvContent += dataString+ "\r\n";
    }

//TODO: Handle other special characters
  csvContent = csvContent.replace(/\#/g, "%23")
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}


function updateSettings(updatedSettingsType){
  if(updatedSettingsType == "rowCount"){
      var newRowCountValue = settingsRowCountTextField.value;
      updateSettingsForType(newRowCountValue, updatedSettingsType);
  }

  if(updatedSettingsType == "backgroundImageCount"){
    var newBackgroundCountValue = settingsUpdateStoredBackgroundImageCountTextField.value;
    updateSettingsForType(newBackgroundCountValue, updatedSettingsType);
  }
}

function updateSettingsForType(updatedValue, settingsType) {
  console.log("updateSettingsForType")
  var gettingSettingsItem = browser.storage.local.get("startpagesettings");
  gettingSettingsItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1) {
      switch (settingsType) {
          case "rowCount":
              storeSettings("1", updatedValue, settingsBackgroundImageLimit, settingsCurrentSelectedBackground,currentOrderPosition);
              settingsRowCountTextField.value = newRowCount;
              break;
          case "backgroundImageCount":
              storeSettings("1", settingsRowCountLimit, updatedValue, settingsCurrentSelectedBackground,currentOrderPosition);
              settingsUpdateStoredBackgroundImageCountTextField.value = updatedValue;
              break;
      }
    } else {
      switch (settingsType) {
          case "rowCount":
              if(result.startpagesettings.RowCount !== updatedValue)
              {
                console.log("Updated Row Count Settings");
                storeSettings("1",updatedValue, settingsBackgroundImageLimit,settingsCurrentSelectedBackground,currentOrderPosition);
                settingsRowCountTextField.value = updatedValue;
                onSettingsScreenSuccess("Items Per Row Updated to "+updatedValue);
              }
              break;
          case "backgroundImageCount":
              if(result.startpagesettings.storedBackgroundImageCount !== updatedValue)
              {
                console.log("Updated BackgrondImage Count Settings");
                storeSettings("1",settingsRowCountLimit, updatedValue,settingsCurrentSelectedBackground,currentOrderPosition);
                settingsUpdateStoredBackgroundImageCountTextField.value = updatedValue;
                onSettingsScreenSuccess("Stored Background Image Count Updated to "+updatedValue);
              }
              break;
      }
    }
  }, onSettingsScreenError);
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

async function createAndSaveImageStore(newFilename, newFile) {
  var imageToRemove;
    try {
      const tmpFiles = await IDBFiles.getFileStorage({
        name: "tmpFiles"
      });
      /*
      TODO: If Image added is already in Store will
      still delete image if over limit
      */
      await tmpFiles.put(newFilename, newFile);
      const storedFiles = await tmpFiles.list();
      const storedFilesCount = storedFiles.length;

      /*
      TODO: Add date added to File Object, sort and remove oldest
      not first found in list which isnt current background or new file name
      */
      newFile.added = getDateTime();
      console.log(newFile);

      if(storedFilesCount > settingsBackgroundImageLimit){
        for (const filename of storedFiles) {
          if(!imageToRemove){
            if(filename != settingsCurrentSelectedBackground && filename != newFilename){
            imageToRemove = filename;
          }
        }
        }
        if(imageToRemove){
          await deletedStoredBackgroundImageData(imageToRemove);
        } else {
          onSettingsScreenError("Error Occured When Finding Image To Remove due to Background Image Limit in Settings.");
        }
      }
      await displayBackgroundImage(newFilename);
      onSettingsScreenSuccess("Image Successfully Added.");
    } catch (err) {
      console.error("File storing error", err);
      throw err;
    }
}

function getDateTime(){
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      return dateTime = date+' '+time;
}

async function deletedStoredBackgroundImageData(filename){
  try {
    console.log(filename)
      const tmpFiles = await IDBFiles.getFileStorage({name: "tmpFiles"});
      await tmpFiles.remove(filename);
      console.log("stored file has been removed.");
      deletedStoredBackgroundImageDiv(filename);
    } catch (err) {
      console.log("ERROR: exception raised while clearing the stored file");
      console.log(err);
    }
}

function onSettingsScreenSuccess(message) {
  backgroundImageInfoBlock.setAttribute("style", "display: flex;");
  backgroundImageInfoBlockText.textContent = message;
}

function onSettingsScreenError(message) {
  backgroundImageInfoBlock.setAttribute("style", "display: flex;");
  backgroundImageInfoBlockText.text = message;
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


async function displayBackgroundImage(filename){
 var image = await getStoredData(filename);
 console.log(image);
 var objectURL = URL.createObjectURL(image);
 //console.log(image);
 //console.log(filename);
 //console.log(objectURL);
 var imageBoxBackground = document.createElement('div');
 var imageBoxBackgroundSelected = document.createElement('div');
 var selectedIconBox = document.createElement('i');
 imageBoxBackground.setAttribute("class", "grid-50 tablet-grid-33 mobile-grid-33 single-image-zone");
 imageBoxBackground.setAttribute("id", filename);
 imageBoxBackground.setAttribute("style", "background-image: url("+objectURL+')');
 if(settingsCurrentSelectedBackground == filename){
   imageBoxBackgroundSelected.setAttribute("style", "display: block");
 } else {
   imageBoxBackgroundSelected.setAttribute("style", "display: none");
 }

 imageBoxBackgroundSelected.setAttribute('class','grid-100 single-image-zone-icon');
 selectedIconBox.setAttribute('aria-hidden','true');
 selectedIconBox.setAttribute('class','fa fa-2x fa-check-circle');
 selectedIconBox.setAttribute("style", "color: green");
 imageBoxBackgroundSelected.appendChild(selectedIconBox);
 imageBoxBackground.appendChild(imageBoxBackgroundSelected);

  //Context menu
  var divContextMenuContainer = document.createElement('div');
  divContextMenuContainer.setAttribute('class','grid-15 dropdown');
  divContextMenuContainer.setAttribute('style','display: none');
  var divContextMenuButton = document.createElement('button');
  divContextMenuButton.textContent= ". . .";
  divContextMenuButton.setAttribute('class','dropbtn');
  var divContextMenu = document.createElement('div');
  divContextMenu.setAttribute('class','dropdown-content');
  var menuItem1 = document.createElement('a');
  menuItem1.setAttribute('class','remove-image-from-image-store');
  menuItem1.href = "#";
  menuItem1.textContent = "Delete Image";
  var menuItem2 = document.createElement('a');
  menuItem1.setAttribute('class','set-image-as-background');
  menuItem2.href = "#";
  menuItem2.textContent = "Set Image as Background";
  // var menuItem3 = document.createElement('a');
  // menuItem3.href = "#";
  // menuItem3.textContent = "Link 3";

  divContextMenu.appendChild(menuItem1);
  divContextMenu.appendChild(menuItem2);
  divContextMenuContainer.appendChild(divContextMenuButton);
  divContextMenuContainer.appendChild(divContextMenu);

  imageBoxBackground.appendChild(divContextMenuContainer);

  backgroundImageDisplayZone.appendChild(imageBoxBackground);


 imageBoxBackground.addEventListener('mouseenter',(e) => {
   divContextMenuContainer.setAttribute('style','display: flex');
 });

 imageBoxBackground.addEventListener('mouseleave',(e) => {
   divContextMenuContainer.setAttribute('style','display: none');
 });

menuItem1.addEventListener('click',(e) => {
  deletedStoredBackgroundImageData(filename);
});

menuItem2.addEventListener('click',(e) => {
    if(settingsCurrentSelectedBackground == filename){
        onSettingsScreenSuccess("Background Deselected, Background Set back to default");
      } else {
        var backgroundImageDivs = document.querySelectorAll('.single-image-zone-icon');
        console.log(backgroundImageDivs);
        for (i = 0; i < backgroundImageDivs.length; ++i) {
        backgroundImageDivs[i].setAttribute("style", "display: none;");
      }
        imageBoxBackgroundSelected.setAttribute("style", "display: block;");
        //setBackgroundContainerImage(objectURL);
        settingsCurrentSelectedBackground = filename;
        currentBackgroudnBlobUrl = objectURL;
        storeSettings("1", settingsRowCountLimit,settingsBackgroundImageLimit,filename,currentOrderPosition);
        onSettingsScreenSuccess("Background Set as "+filename);
    }
  });
}

async function deletedStoredBackgroundImageData(filename){
  try {
    console.log(filename)
      const tmpFiles = await IDBFiles.getFileStorage({name: "tmpFiles"});
      await tmpFiles.remove(filename);
      console.log("stored file has been removed.");
      deletedStoredBackgroundImageDiv(filename);
      onSettingsScreenSuccess("Image Successfully Removed "+filename);
      if(settingsCurrentSelectedBackground == filename){
        settingsCurrentSelectedBackground = void 0;
        storeSettings("1", settingsRowCountLimit,settingsBackgroundImageLimit,settingsCurrentSelectedBackground,currentOrderPosition);
      }
    } catch (err) {
      onSettingsScreenError("Failed to Delete Image"+filename);
      console.log("ERROR: exception raised while clearing the stored file");
      console.log(err);
    }
}

async function setupbackgroundInit(){
  console.log("Setup Background:"+settingsCurrentSelectedBackground);
  if (settingsCurrentSelectedBackground) {
    console.log("INSIDE:"+settingsCurrentSelectedBackground);
    if(currentBackgroudnBlobUrl){
      console.log("currentBackgroudnBlobUrl:"+currentBackgroudnBlobUrl);
      //setBackgroundContainerImage(currentBackgroudnBlobUrl);
    } else {
      console.log("currentBackgroudnBlobUrl2:"+currentBackgroudnBlobUrl)
      var image = await getStoredData(settingsCurrentSelectedBackground);
      var objectURL = URL.createObjectURL(image);
      currentBackgroudnBlobUrl = objectURL;
      //setBackgroundContainerImage(objectURL);
    }
  }
}

function deletedStoredBackgroundImageDiv(filename){
  console.log(filename);
  document.getElementById(filename).remove();
}

function onError(error) {
  console.log(error);
}

function storeSettings(id, rowCount, backgroundCount, backgroundImage, order) {
  console.log("storeSettings: "+ id + ", RowCount: " +rowCount + ", BackgroundImageCount: " +backgroundCount+ ", Order: " +order);
  var storingNote = browser.storage.local.set({ ["startpagesettings"] : { "id" : id, "RowCount" : rowCount, "storedBackgroundImageCount" : backgroundCount, "SelectedBackgroundImage" : backgroundImage, "Order" : order } });
  settingsBackgroundImageLimit = backgroundCount;
  settingsRowCountLimit = rowCount;
  settingsCurrentSelectedBackground = backgroundImage;
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
