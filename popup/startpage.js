/**
--------TODO LIST-------
TODO:
- add debounce to certain eventLIsteners
- in background image handle if same image is added twice,
no need to delete
- in background image use lastmodififeddate in IMage obkect to remove
oldest image stored
- ability to create and change between multiple favourit lists.
- ability to add own icon image.
**/

var currentListSelection = document.querySelector('.current-favourite-list');
var inputTitle = document.querySelector('.new-note input');
var inputBody = document.querySelector('.new-note textarea');
var global_id = "1";
var noteContainer = document.querySelector('.note-container');
var favouritesContainer = document.querySelector('.startpage-favourites-container');
var dateTimeContainer = document.querySelector('.timeDateValue');
var settingsContainer = document.querySelector('.settings-container');
var settingsRowCountLabel = document.querySelector('#ItemsPerRowCountLabel');
var settingsRowCountTextField = document.querySelector('input[name="ItemsPerRowCountTextBox"]');
var settingsUpdateRowCountBtn = document.querySelector('input[id="UpdateSettingsRowCountBtn"]');
var settingsUpdateStoredBackgroundImageCountBtn = document.querySelector('input[id="UpdateStoredBackgroundImagesBtn"]');
var settingsUpdateStoredBackgroundImageCountTextField = document.querySelector('input[name="StoredBackgroundImagesCountTextBox"]');
var itemsPerRowRadio = document.querySelector('input[name="itemsPerRowRadio"]:checked');
var backgroundImageDropZone = document.querySelector('.image-drop-zone');
var backgroundImageDisplayZone = document.querySelector('.image-display-zone');
var startpageContainerHTML = document.querySelector('.startpage-container');
var startpageImageContainerHTML = document.body;
var backgroundImageInfoBlock = document.querySelector('.background-image-info-block');
var backgroundImageInfoBlockText = document.querySelector('.background-image-info-block-text');
var welcomeContainer = document.querySelector('.welcome-container');
var welcomeMainContainer = document.querySelector('.welcome-main-container');
var editModeTitleContainer = document.querySelector('.edit-mode-title-container');
var newFavouriteOverlayContainer = document.querySelector('.add-overlay-container');
var newFavouriteOverlayCloseContainerBtn = document.querySelector('.add-overlay-box-close');
var editCurrentFavouriteOverlayContainer = document.querySelector('.edit-overlay-container');
var editCurrentFavouriteOverlayCloseContainerBtn = document.querySelector('.edit-overlay-box-close');

/** Edit/Update Favourite Box Preview Selectors **/
//input
var editCurrentFavouriteTitleTextField = document.querySelector('input[name="EditCurrentFavouriteTitle"]');
var editCurrentFavouriteUrlTextField = document.querySelector('input[name="EditCurrentFavouriteUrl"]');
var editCurrentFavouriteIconTextField = document.querySelector('input[name="EditCurrentFavouriteIcon"]');
var editCurrentFavouriteIconColourTextField = document.querySelector('input[name="EditCurrentFavouriteIconColour"]');
var editCurrentFavouriteBackgroundColourTextField = document.querySelector('input[name="EditCurrentFavouriteBackgroundColour"]');
//Preview
var previewTitle = document.querySelector('.preview-favourite-box-title');
var previewIcon = document.querySelector('.preview-favourite-icon');
var previewUrl = document.querySelector('.preview-favourite-box');
//input
var newFavouriteTitleTextField = document.querySelector('input[name="NewFavouriteTitle"]');
var NewFavouriteIconTextField = document.querySelector('input[name="NewFavouriteIcon"]');
var newFavouriteIconColourTextField = document.querySelector('input[name="NewFavouriteIconColour"]');
var newFavouriteBackgroundColourTextField = document.querySelector('input[name="NewFavouriteBackgroundColour"]');
//NewFavouritePreview
var newFavouritePreviewTitle = document.querySelector('.new-preview-favourite-box-title');
var newFavouritePreviewIcon = document.querySelector('.new-preview-favourite-icon');
var newFavouritePreviewUrl = document.querySelector('.new-preview-favourite-box');

var BrowsingHistoryList = document.getElementById('browsing-history-container');
var newFavouriteUrlTextField = document.querySelector('input[name="NewFavouriteUrl"]');
var addNewFavouriteBtn = document.querySelector('input[id="AddNewFavouriteBtn"]');
var editUpdateFavouriteBtn = document.querySelector('input[id="EditCurrentFavouriteBtn"]');
var iconColourExampleDiv = document.querySelector('.icon-colour-example-add');

var clearBtn = document.querySelector('.clear');
var favouriteListSelectorLeft = document.querySelector('.change-selected-favourite-list-left');
var favouriteListSelectorRight = document.querySelector('.change-selected-favourite-list-right');
var addBtn = document.querySelector('.add');
var editModeBtn = document.querySelector('.edit-icon');
var settingsBtn = document.querySelector('.settings-icon');
var editModeWelcomeBtn = document.querySelector('.welcome-edit-icon');
var settingsWelcomeBtn = document.querySelector('.welcome-settings-icon');
var settingsMode = false;
var inEditMode = false;
var currentCssClassSize = "grid-25 tablet-grid-25 mobile-grid-25";
var changeLinksToHttps = true;
var NoCurrentFavourites = false;
var settingsBackgroundImageLimit = "6";
var settingsRowCountLimit = "4";
var settingsCurrentSelectedBackground;
var currentBackgroudnBlobUrl;
var currentOrderPosition = 0;
var InWelcomeMode = false;
var favourtieArrayList = document.querySelectorAll('.favourite-container');
var dragSrcEl = null;

/* generic error handler */
function onError(error) {
  console.log(error);
}

function onSettingsScreenSuccess(message) {
  backgroundImageInfoBlock.setAttribute("style", "display: flex;");
  backgroundImageInfoBlockText.textContent = message;
}

function onSettingsScreenError(message) {
  backgroundImageInfoBlock.setAttribute("style", "display: flex;");
  backgroundImageInfoBlockText.text = message;
}

function defaultEventListener() {
  addBtn.addEventListener('click', addFavourite);
  clearBtn.addEventListener('click', clearAll);
  editModeBtn.addEventListener('click', EditOverlay);
  settingsBtn.addEventListener('click', OpenSettings);
  settingsUpdateRowCountBtn.addEventListener('click', updateRowCountAndUiWithSettings);
  settingsUpdateStoredBackgroundImageCountBtn.addEventListener('click', updateBackgroundWithSettings);
  backgroundImageDropZone.addEventListener("dragend", processImageDragEndDropZone, false);
  backgroundImageDropZone.addEventListener("dragover", processImageDragOverDropZone, false);
  backgroundImageDropZone.addEventListener("drop", processImageDropZone, false);
  newFavouriteOverlayCloseContainerBtn.addEventListener('click', CloseAddNewFavouritesOverlay);
  favouriteListSelectorLeft.addEventListener("click", changeSelectionLeft);
  favouriteListSelectorRight.addEventListener('click', changeSelectionRight);
  //newFavouriteIconColourTextField.addEventListener('keyup', updateIconColourExampleDiv);
}

function changeSelectionLeft() {
  console.log("Change List CLick RIGHT");
  var FavouriteListGet = browser.storage.local.get("FavouriteList");
  console.log("LIST1 GET");
  FavouriteListGet.then((results) => {
    var favouriteKeys = Object.keys(results);
    console.log(favouriteKeys);
    var favouriteListKeys = Object.keys(results["FavouriteList"]);
    var currentInUseList = currentListSelection.textContent;
    var currentPosition = favouriteListKeys.indexOf(currentInUseList);
    console.log(currentPosition);
    var movingToPosition = --currentPosition;
    console.log("movingToPosition: "+ movingToPosition);
    console.log("length: "+ favouriteListKeys.length);
    if(movingToPosition < 0){
      movingToPosition = --favouriteListKeys.length;
      getAndDisplayNewList(movingToPosition);
    } else {
      getAndDisplayNewList(movingToPosition);
    }
  }, onError);
}

function changeSelectionRight(){
  console.log("Change List CLick RIGHT");
  var FavouriteListGet = browser.storage.local.get("FavouriteList");
  console.log("LIST1 GET");
  FavouriteListGet.then((results) => {
    var favouriteKeys = Object.keys(results);
    console.log(favouriteKeys);
    var favouriteListKeys = Object.keys(results["FavouriteList"]);
    var currentInUseList = currentListSelection.textContent;
    var currentPosition = favouriteListKeys.indexOf(currentInUseList);
    console.log(currentPosition);
    var movingToPosition = ++currentPosition;
    console.log("movingToPosition: "+ movingToPosition);
    console.log("length: "+ favouriteListKeys.length);
    if(movingToPosition >= favouriteListKeys.length){
      movingToPosition = 0;
      getAndDisplayNewList(movingToPosition, currentPosition);
    } else {
      getAndDisplayNewList(movingToPosition, currentPosition);
    }
  }, onError);
}

function getAndDisplayNewList(newPosition){
  console.log("getAndDisplayNewList ** POSITION: "+ newPosition);
  var FavouriteListGet = browser.storage.local.get("FavouriteList");
  FavouriteListGet.then((results) => {
    var favouriteKeys = Object.keys(results);
    var favouriteListKeys = Object.keys(results["FavouriteList"]);
    var removed = favouriteListKeys.splice(newPosition, 1);
    console.log("removed ** removed: "+removed);
    favouriteListKeys.splice(newPosition, 0, removed);
    for (let favListKey of favouriteListKeys) {
    console.log(favListKey);
    console.log(results["FavouriteList"][favListKey]);
    if(favListKey == removed){

      var removedCurrentFavouriteDivs = document.querySelectorAll('.favourite-container');
      for (i = 0; i < removedCurrentFavouriteDivs.length; ++i) {
        removedCurrentFavouriteDivs[i].remove();
      }

      currentListSelection.textContent = favListKey;
      for (let indiKett of results["FavouriteList"][favListKey]) {
      var indiKetObject = Object.keys(indiKett);
        if(indiKetObject != "Settings"){
          console.log("inKey TITLE: "+indiKett[indiKetObject].title);
          console.log("inKeyt ID: "+indiKett[indiKetObject].id);

          var id = indiKett[indiKetObject].ref;
          var title = indiKett[indiKetObject].title;
          var url = indiKett[indiKetObject].url;
          var icon = indiKett[indiKetObject].icon;
          var iconColour = indiKett[indiKetObject].iconColour;
          var backgroundColour = indiKett[indiKetObject].backgroundColour;
          var order = indiKett[indiKetObject].Order;
          displayFavourite("2",title,url,order,icon,iconColour,backgroundColour,false);
        }
      }
    }
      }
  }, onError);
}


function defaultWelcomeEventListener() {
  editModeWelcomeBtn.addEventListener('click', EditOverlay);
  settingsWelcomeBtn.addEventListener('click', OpenSettings);
}

function RemoveDefaultWelcomeEventListener() {
  editModeWelcomeBtn.removeEventListener("click", EditOverlay);
  settingsWelcomeBtn.removeEventListener("click", OpenSettings);
}

/* display previously-saved stored notes on startup */

initialise();

async function initialise() {
  await setupBackgroundImages();
  var gettingSettingsItem = browser.storage.local.get("startpagesettings");
  console.log("Checking if Settings are in keys");
  gettingSettingsItem.then(async (result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1) {
      console.log("Settings Not Found");
      storeSettings("1", "4","6","","1");
    } else {
      settingsBackgroundImageLimit = result.startpagesettings.storedBackgroundImageCount;
      settingsRowCountLimit = result.startpagesettings.RowCount;
      console.log(result.startpagesettings.SelectedBackgroundImage);
      settingsCurrentSelectedBackground = result.startpagesettings.SelectedBackgroundImage;
      currentOrderPosition = result.startpagesettings.Order;
      console.log("INIT:currentOrderPosition"+currentOrderPosition);
      await setupbackgroundInit();
    }
  }, onError);

  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    console.log("Getting CSS CLASS:"+settingsRowCountLimit);
    getNewCssClass(settingsRowCountLimit);
    console.log("INIT:"+currentCssClassSize);
    var noteKeys = Object.keys(results);
    for (let noteKey of noteKeys) {
        if(noteKey !== "startpagesettings"){
          //console.log("KEY: "+noteKey);
          var id = results[noteKey].ref;
          var text = results[noteKey].text;
          var url = results[noteKey].url;
          var icon = results[noteKey].icon;
          var iconColour = results[noteKey].iconColour;
          var backgroundColour = results[noteKey].backgroundColour;
          var order = results[noteKey].Order;
          //console.log(results[noteKey]);
          displayFavourite("2",noteKey,url,order,icon,iconColour,backgroundColour,false);
        }
      }
      if(noteKeys.length == 0 || noteKeys.length == 1){
        if(noteKeys.length == 1){
          if(noteKeys[0] == "startpagesettings"){
            console.log("Empty Favourites");
            NoCurrentFavourites = true;
            InWelcomeMode = true;
            welcomeContainer.setAttribute("style", "display: block;");
            welcomeMainContainer.setAttribute("style", "display: block;");
          }
        }
        if(noteKeys.length == 0){
            console.log("Empty Favourites");
            NoCurrentFavourites = true;
            InWelcomeMode = true;
            welcomeContainer.setAttribute("style", "display: block;");
            welcomeMainContainer.setAttribute("style", "display: block;");
        }
        defaultWelcomeEventListener();
    }
  }, onError);
  defaultEventListener();

  var list1array = [];
  var item1 = { ["list1-1"] : { "id" : "1", "title" : "list1-1", "url" : "url", "Order" : "1", "icon" : "fa-steam", "iconColour" : "#000", "backgroundColour" : "#000" } };
  var item2 = { ["list1-2"] : { "id" : "2", "title" : "TEWST LIST 1 ITEM 2", "url" : "url", "Order" : "2", "icon" : "fa-steam", "iconColour" : "#000", "backgroundColour" : "#000" } };
  var settings = { ["Settings"] : { "default" : "true" } };
  list1array.push(item1);
  list1array.push(item2);
  list1array.push(settings);
  browser.storage.local.set({ ["list1"] : {list1array} });

  var list2array = [];
  var item1 = { ["list2-1"] : { "id" : "1", "title" : "List 2 Item 1 oder 1", "url" : "testURLLLLL", "Order" : "1", "icon" : "fa-steam", "iconColour" : "#fff", "backgroundColour" : "#fff" } };
  var item2 = { ["list2-2"] : { "id" : "2", "title" : "list2-2", "url" : "url", "Order" : "1", "icon" : "fa-steam", "iconColour" : "#fff", "backgroundColour" : "#fff" } };
  var settings = { ["Settings"] : { "default" : "false" } };
  list2array.push(item1);
  list2array.push(item2);
  list2array.push(settings);
  browser.storage.local.set({ ["list2"] : {list2array} });

  browser.storage.local.set({ ["FavouriteList"] : { list1array, list2array } });

var FavouriteListGet = browser.storage.local.get("FavouriteList");
console.log("LIST1 GET");
FavouriteListGet.then((results) => {
  var favouriteKeys = Object.keys(results);
  console.log(favouriteKeys);
  var favouriteListKeys = Object.keys(results["FavouriteList"]);
    for (let favListKey of favouriteListKeys) {
      console.log(favListKey);
      console.log(results["FavouriteList"][favListKey]);
      for (let indiKet of results["FavouriteList"][favListKey]) {
        var indiKetObject = Object.keys(indiKet);
        if(indiKetObject == "Settings"){
          console.log("IS DEFAULT LIST: "+indiKet[indiKetObject].default);
          if(indiKet[indiKetObject].default == "true"){
            currentListSelection.textContent = favListKey;
            for (let indiKett of results["FavouriteList"][favListKey]) {
              var indiKetObject = Object.keys(indiKett);
              if(indiKetObject !== "Settings"){
                console.log("inKey TITLE: "+indiKett[indiKetObject].title);
                console.log("inKeyt ID: "+indiKett[indiKetObject].id);

                var id = indiKett[indiKetObject].ref;
                var title = indiKett[indiKetObject].title;
                var url = indiKett[indiKetObject].url;
                var icon = indiKett[indiKetObject].icon;
                var iconColour = indiKett[indiKetObject].iconColour;
                var backgroundColour = indiKett[indiKetObject].backgroundColour;
                var order = indiKett[indiKetObject].Order;
                displayFavourite("2",title,url,order,icon,iconColour,backgroundColour,false);
              }
            }
          }
        }
      }
  }
}, onError);
}


async function setupbackgroundInit(){
  console.log("Setup Background:"+settingsCurrentSelectedBackground);
  if (settingsCurrentSelectedBackground) {
    console.log("INSIDE:"+settingsCurrentSelectedBackground);
    if(currentBackgroudnBlobUrl){
      console.log("currentBackgroudnBlobUrl:"+currentBackgroudnBlobUrl);
      setBackgroundContainerImage(currentBackgroudnBlobUrl);
    } else {
      console.log("currentBackgroudnBlobUrl2:"+currentBackgroudnBlobUrl)
      var image = await getStoredData(settingsCurrentSelectedBackground);
      var objectURL = URL.createObjectURL(image);
      currentBackgroudnBlobUrl = objectURL;
      setBackgroundContainerImage(objectURL);
    }
  }
}

function CloseAddNewFavouritesOverlay() {
  addNewFavouriteBtn.removeEventListener('click', createNewFavourite);
  newFavouriteTitleTextField.removeEventListener('keyup', updatePreviewForNewFavouriteTitle);
  NewFavouriteIconTextField.removeEventListener('keyup', updatePreviewForNewFavouriteIcon);
  newFavouriteIconColourTextField.removeEventListener('keyup', updatePreviewForNewFavouriteIconColour);
  newFavouriteBackgroundColourTextField.removeEventListener('keyup', updatePreviewForNewFavouriteBackgroundColour);
  newFavouriteOverlayContainer.setAttribute("style", "display: none;");
  BrowsingHistoryList.innerHTML = "";
}

function CloseEditCurrentFavouritesOverlay() {
  editCurrentFavouriteOverlayContainer.setAttribute("style", "display: none;");
}


function getRecentBrowsingHisoty(count){
  var searchingHistory = browser.history.search({text: "", maxResults: count});
    searchingHistory.then((results) => {
    // What to show if there are no results.
    if (results.length < 1) {
      var NoResultsContainer = document.createElement('div');
      NoResultsContainer.setAttribute('class','grid-100');
      NoResultsContainer.textContent = "No Recent History Found";
      BrowsingHistoryList.appendChild(NoResultsContainer);
    } else {
      for (var k in results) {
        createBrowsingHistoryDiv(results[k]);
      }
    }
});
}

function createBrowsingHistoryDiv(history) {
  var divContainer = document.createElement('div');
  var divIcon = document.createElement('div');
  var addIcon = document.createElement('i');
  var divLink = document.createElement('div');
  divContainer.setAttribute('class','grid-50 tablet-grid-100 mobile-grid-50 browsing-history-item-container');
  divIcon.setAttribute('class','grid-10 tablet-grid-10 mobile-grid-10 browsing-history-item-icon-container');
  addIcon.setAttribute('class','fa fa-check-circle browsing-history-item-icon');
  addIcon.setAttribute('aria-hidden','true');
  divLink.setAttribute('class','grid-90 tablet-grid-90 mobile-grid-90 browsing-history-item-url-link');
  var li = document.createElement('p');
  var a = document.createElement('a');
  var url = document.createTextNode(history.url);
  a.href = history.url;
  a.target = '_blank';
  a.appendChild(url);
  li.appendChild(a);
  divLink.appendChild(li);
  divIcon.appendChild(addIcon);
  divContainer.appendChild(divIcon);
  divContainer.appendChild(divIcon);
  divContainer.appendChild(divLink);
  BrowsingHistoryList.appendChild(divContainer);

  divIcon.addEventListener('click',(e) => {
    var browsingHistoryDiv = document.querySelectorAll('.browsing-history-item-icon-container');
    for (i = 0; i < browsingHistoryDiv.length; ++i) {
      browsingHistoryDiv[i].setAttribute('style','color: black;');
    }
     newFavouriteUrlTextField.value = history.url;
     newFavouriteTitleTextField.value = a.hostname;
     updatePreviewForNewFavouriteTitle();
     var correctNode = e.target.classList.contains('browsing-history-item-icon');

     if(correctNode) {
       e.target.parentNode.setAttribute('style','color: green;');
     } else {
       e.target.setAttribute('style','color: green;');
     }
  });
}

async function OpenSettings() {
  var inEditMode = startpageContainerHTML.classList.contains('edit-mode');

  if(inEditMode){
    await removeEditOverlay();
    switchIconsToLogo();
  }

  if(settingsMode){
    settingsContainer.setAttribute("style", "display: none;");
    settingsMode = false;
  } else {
       if(!settingsRowCountLimit) {
         storeSettings("1","4","6","","1");
         settingsRowCountTextField.value = "4";
       } else {
         settingsRowCountTextField.value = settingsRowCountLimit;
         settingsUpdateStoredBackgroundImageCountTextField.value = settingsBackgroundImageLimit;
       }
    settingsContainer.setAttribute("style", "display: block;");
    settingsMode = true;
  }
}

function updateRowCountAndUiWithSettings(){
  updateSettings("rowCount");
}

function updateBackgroundWithSettings(){
  updateSettings("backgroundImageCount");
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

function updateDivOrderCount(){
  updateSettingsForType(currentOrderPosition, "DivOrderUpdate");
}

function updateUi(newCssClass){
  var allFavouritesDivs = document.querySelectorAll('.favourite-container');
  var cssClass = newCssClass + " favourite-container";
  for (i = 0; i < allFavouritesDivs.length; ++i) {
    allFavouritesDivs[i].setAttribute('class',cssClass);
  }
}

async function EditOverlay() {
  var hasEditModeClass = startpageContainerHTML.classList.contains('edit-mode');

  if(NoCurrentFavourites){
    welcomeContainer.setAttribute("style", "display: none;");
    NoCurrentFavourites = false;
  }

if(settingsMode){
  settingsContainer.setAttribute("style", "display: none;");
  settingsMode = false;
}

  if(hasEditModeClass){
    await removeEditOverlay();
    switchIconsToLogo();
    inEditMode = false;
  } else {
    editModeTitleContainer.setAttribute("style", "display: block;");
    //startpageContainerHTML.setAttribute("style", "background-color: rgba(192,192,192, 0.2);");
    startpageContainerHTML.setAttribute('class','startpage-container edit-mode');
    displayAddNewFavourite();
    console.log("switchIconsToEditAndDelete");
    switchIconsToEditAndDelete();
    inEditMode = true;
  }
}

async function removeEditOverlay() {
  if (settingsCurrentSelectedBackground) {
    await setupbackgroundInit();
  } else {
    startpageImageContainerHTML.setAttribute("style", "background-color: white;");
  }
  editModeTitleContainer.setAttribute("style", "display: none;");
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
    var iconcolour = FavouritesIconDivs[i].getAttribute("style").split("color:")[1].split(";")[0];
    FavouritesIconDivs[i].setAttribute('style',"color:"+iconcolour+"; display: none");
  }
}

function switchIconsToLogo() {
  var editDeleteIconDivs = document.querySelectorAll('.edit-delete-icons');
  for (i = 0; i < editDeleteIconDivs.length; ++i) {
    editDeleteIconDivs[i].setAttribute('style','display: none');
  }
  var FavouritesIconDivs = document.querySelectorAll('.favourite-icon');
  for (i = 0; i < FavouritesIconDivs.length; ++i) {
    var iconcolour = FavouritesIconDivs[i].getAttribute("style").split("color:")[1].split(";")[0];
    FavouritesIconDivs[i].setAttribute('style',"color:"+iconcolour+"; display: inline-block");
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
  var favouriteboxtitle = document.createElement('div');
  var cssClass = currentCssClassSize + " new-favourite-container";
  newfavouritecontainer.setAttribute('class',cssClass);
  newfavouritecontainer.setAttribute('style',"order:999");
  newfavouritebox.setAttribute('class','new-favourite-box');
  //newfavouritebox.setAttribute('href', "#");
  favouriteboximage.setAttribute('class','grid-100 new-favourite-box-image');
  favouriteboximage.setAttribute('style','background-color: white');
  favouriteIconbox.setAttribute('class','fa fa-5x fa-plus');
  favouriteIconbox.setAttribute('aria-hidden','true');

  favouriteboxtitle.setAttribute('class','grid-100 new-favourite-box-title');
  favouriteboxtitle.setAttribute('style','background-color: white');

  favouriteboximage.appendChild(favouriteIconbox);
  newfavouritebox.appendChild(favouriteboximage);
  newfavouritebox.appendChild(favouriteboxtitle);
  newfavouritecontainer.appendChild(newfavouritebox);
  favouritesContainer.appendChild(newfavouritecontainer);

  newfavouritecontainer.addEventListener('click',(e) => {
    const evtTgt = e.target;
    console.log("NEW Favourite Box Selected"+evtTgt);
    getRecentBrowsingHisoty(16);
    newFavouriteOverlayContainer.setAttribute("style","display:block");
    addNewFavouriteBtn.addEventListener('click', createNewFavourite);
    newFavouriteTitleTextField.addEventListener('keyup', updatePreviewForNewFavouriteTitle);
    NewFavouriteIconTextField.addEventListener('keyup', updatePreviewForNewFavouriteIcon);
    newFavouriteIconColourTextField.addEventListener('keyup', updatePreviewForNewFavouriteIconColour);
    newFavouriteBackgroundColourTextField.addEventListener('keyup', updatePreviewForNewFavouriteBackgroundColour);
  })
}

/* Add a note to the display, and storage */
/*TODO: Remove me once addNewFavourite is Complete **/
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
      storeFavourite("1",noteTitle,noteBody,"1",icon, "#000000", "#fff", false);
    }
  }, onError);
}

function addNewFavourite(title,url,icon,iconColour,backgroundColour) {
  var gettingItem = browser.storage.local.get(title);
  console.log(icon);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && title !== '' && url !== '') {
      newFavouriteTitleTextField.value = '';
      newFavouriteUrlTextField.value = '';
      currentOrderPosition++;
      console.log("addNewFavourite Updaed Order Position"+currentOrderPosition);
      storeFavourite("1",title,url,currentOrderPosition,icon,iconColour, backgroundColour,true);
      updateDivOrderCount();

      if(InWelcomeMode){
        welcomeMainContainer.setAttribute("style","display:none");
        InWelcomeMode = false;
      }
    }
  }, onError);
}

function createNewFavourite(){
  var title = newFavouriteTitleTextField.value;
  var url = newFavouriteUrlTextField.value;
  var icon = NewFavouriteIconTextField.value;
  var iconColour = newFavouriteIconColourTextField.value;
  var backgroundColour = newFavouriteBackgroundColourTextField.value;

  if(iconColour != ''){
    if(!iconColour.startsWith('#')){
      iconColour = '#'+iconColour;
    }
  } else {
    iconColour = '#000000'
  }

  if(backgroundColour != ''){
    if(!backgroundColour.startsWith('#')){
      backgroundColour = '#'+backgroundColour;
    }
  } else {
    backgroundColour = '#fff'
  }

  addNewFavourite(title,url,icon,iconColour,backgroundColour)
}

/* TODO: Add Debouce */
function updateIconColourExampleDiv(){
  // var divColour = newFavouriteIconColourTextField.value;
  // if(!divColour.startsWith('#')){
  //   divColour = '#'+divColour;
  // }
  //iconColourExampleDiv.setAttribute('style', "background-color:"+divColour);
}

/* function to store a new favourite in storage */
function storeFavourite(id, title, url, order, icon, iconColour, backgroundColour, inEditMode) {
  var storingNote = browser.storage.local.set({ [title] : { "id" : id, "title" : title, "url" : url, "Order" : order, "icon" : icon, "iconColour" : iconColour, "backgroundColour" : backgroundColour } });
  storingNote.then(() => {
    displayFavourite(id, title,url,order,icon,iconColour,backgroundColour,inEditMode);
  }, onError);
}

function storeSettings(id, rowCount, backgroundCount, backgroundImage, order) {
  console.log("storeSettings: "+ id + ", RowCount: " +rowCount + ", BackgroundImageCount: " +backgroundCount+ ", Order: " +order);
  var storingNote = browser.storage.local.set({ ["startpagesettings"] : { "id" : id, "RowCount" : rowCount, "storedBackgroundImageCount" : backgroundCount, "SelectedBackgroundImage" : backgroundImage, "Order" : order } });
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


function displayEditCurrentFavouriteOverlay(currentTitle) {
  var item = browser.storage.local.get(currentTitle);
  item.then((results) => {
    var objectKeys = Object.keys(results);
    //currentTitle = results[objectKeys].title;
    var currentUrl = results[objectKeys].url;
    var currentIcon = results[objectKeys].icon;
    var currentIconColour = results[objectKeys].iconColour;
    var currentBackgroundColour = results[objectKeys].backgroundColour;
    var currentOrder = results[objectKeys].Order;
    // console.log(currentTitle);
    // console.log(currentUrl);
    // console.log(currentIcon);
    // console.log(currentIconColour);
    createEditCurrentFavouriteDivOverlay(currentTitle, currentUrl, currentOrder, currentIcon, currentIconColour, currentBackgroundColour);
  }, onError);
}

function createEditCurrentFavouriteDivOverlay(title, url, order, icon, iconColour, backgroundColour) {
  editCurrentFavouriteTitleTextField.value = title;
  editCurrentFavouriteUrlTextField.value = url;
  editCurrentFavouriteIconTextField.value = icon;
  editCurrentFavouriteIconColourTextField.value = iconColour;
  editCurrentFavouriteBackgroundColourTextField.value = backgroundColour;
  previewTitle.textContent = title;
  previewIcon.setAttribute('class',"preview-favourite-icon fa fa-5x "+icon);
  previewIcon.setAttribute('style',"display: inline-block; color: "+iconColour);
  previewTitle.setAttribute('style',"background-color: "+backgroundColour);

  editCurrentFavouriteOverlayCloseContainerBtn.addEventListener('click',(e) => {
    CloseEditCurrentFavouritesOverlay();
    editCurrentFavouriteTitleTextField.removeEventListener("keyup", updatePreviewInEditFavouriteTitle);
    editCurrentFavouriteUrlTextField.removeEventListener("keyup", updatePreviewInEditFavouriteUrl);
    editCurrentFavouriteIconTextField.removeEventListener("keyup", updatePreviewInEditFavouriteIcon);
    editCurrentFavouriteIconColourTextField.removeEventListener("keyup", updatePreviewInEditFavouriteIconColour);
    editCurrentFavouriteBackgroundColourTextField.removeEventListener("keyup", updatePreviewInEditFavouriteBackgroundColour);
    editUpdateFavouriteBtn.removeEventListener('click',ProcessUpdateFavourite, false);
  })

  editCurrentFavouriteTitleTextField.addEventListener('keyup',updatePreviewInEditFavouriteTitle);
  editCurrentFavouriteUrlTextField.addEventListener('keyup',updatePreviewInEditFavouriteUrl);
  editCurrentFavouriteIconTextField.addEventListener('keyup',updatePreviewInEditFavouriteIcon);
  editCurrentFavouriteIconColourTextField.addEventListener('keyup',updatePreviewInEditFavouriteIconColour);
  editCurrentFavouriteBackgroundColourTextField.addEventListener("keyup", updatePreviewInEditFavouriteBackgroundColour);

  editUpdateFavouriteBtn.title = title;
  editUpdateFavouriteBtn.order = order;
  editUpdateFavouriteBtn.addEventListener('click',ProcessUpdateFavourite, false);
  editCurrentFavouriteOverlayContainer.setAttribute("style","display:block");
}

function ProcessUpdateFavourite(evt)
{
  console.log("Div to inital Remove: TITLE: "+evt.target.title )
  console.log("Div Order: "+evt.target.order )
  var updatedIconColour = editCurrentFavouriteIconColourTextField.value;
  var updatedBackgroundColour = editCurrentFavouriteBackgroundColourTextField.value;
  if(!updatedIconColour.startsWith('#')){
    updatedIconColour = '#'+updatedIconColour;
  }
  if(!updatedBackgroundColour.startsWith('#')){
    updatedBackgroundColour = '#'+updatedBackgroundColour;
  }
  console.log(document.getElementById(evt.target.title));
  document.getElementById(evt.target.title).remove();
  updateFavourite(evt.target.title, editCurrentFavouriteTitleTextField.value, editCurrentFavouriteUrlTextField.value, evt.target.order, editCurrentFavouriteIconTextField.value, updatedIconColour, updatedBackgroundColour);
  editUpdateFavouriteBtn.removeEventListener('click',ProcessUpdateFavourite, false);
  console.log("ProcessUpdateFavourite")
  eventListnerForNewUpdateDiv(evt.target.order);
}

function eventListnerForNewUpdateDiv(order){
  editUpdateFavouriteBtn.title = editCurrentFavouriteTitleTextField.value;
  editUpdateFavouriteBtn.order = order;
  editUpdateFavouriteBtn.addEventListener('click',ProcessUpdateFavourite, false);
}

/* function to display a note in the note box */

function displayFavourite(id, title, url,order, icon, iconColour, backgroundColour, inEditMode) {
  var createCorrectUrl = generateValidUrl(url);
  console.log("displayFavourite: "+currentCssClassSize);
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
  var favouriteboxtitle = document.createElement('div');
  favouritecontainer.setAttribute('id',title);
  var classList = currentCssClassSize + " favourite-container";
  favouritecontainer.setAttribute('class',classList);
  favouritecontainer.setAttribute('style',"order: "+order);
  favouritecontainer.setAttribute('draggable',"true");
  favouritecontainer.addEventListener('dragstart', dragstart_handler, false);
  favouritecontainer.addEventListener('dragenter', handleDragEnter, false);
  favouritecontainer.addEventListener('dragover', handleDragOver, false);
  favouritecontainer.addEventListener('dragleave', handleDragLeave, false);
  favouritecontainer.addEventListener('drop', handleDrop, false);

  favouritebox.setAttribute('class','favourite-box');
  favouritebox.setAttribute('href', createCorrectUrl);
  editdeleteiconfavouritebox.setAttribute('class','grid-100 tablet-grid-100 mobile-grid-100 edit-delete-icons');
  //editdeleteiconfavouritebox.setAttribute('style','display: none');
  editiconfavouritebox.setAttribute('class','grid-50 tablet-grid-50 mobile-grid-50 edit-favourite-icon');
  editiconfavouritebox.setAttribute('style','justify-content: center; align-items: center; display: flex;');
  deleteiconfavouritebox.setAttribute('class','grid-50 delete-favourite-icon');
  deleteiconfavouritebox.setAttribute('style','justify-content: center; align-items: center; display: flex;');
  favouriteboximage.setAttribute('class','grid-100 favourite-box-image');
  var iconClass = "favourite-icon fa fa-5x "+ icon;
  favouriteIconbox.setAttribute('class',iconClass);
  if(inEditMode){
    favouriteIconbox.setAttribute('style',"color: "+iconColour+"; display: none");
    editdeleteiconfavouritebox.setAttribute('style','display: inline-block');
  } else {
    favouriteIconbox.setAttribute('style',"color: "+iconColour+"; display: inline-block");
    editdeleteiconfavouritebox.setAttribute('style','display: none');
  }

  console.log(iconColour);
  favouriteIconbox.setAttribute('aria-hidden','true');
  editIconbox.setAttribute('class','fa fa-4x fa-pencil-square-o');
  editIconbox.setAttribute('aria-hidden','true');
  deleteIconbox.setAttribute('class','fa fa-4x fa-trash-o');
  deleteIconbox.setAttribute('aria-hidden','true');

  favouriteboxtitle.setAttribute('class','grid-100 favourite-box-title');
  favouriteboxtitle.setAttribute('style',"background-color: "+backgroundColour);
  favouriteboxtitle.textContent = title;

  editiconfavouritebox.appendChild(editIconbox);
  deleteiconfavouritebox.appendChild(deleteIconbox);
  editdeleteiconfavouritebox.appendChild(editiconfavouritebox);
  editdeleteiconfavouritebox.appendChild(deleteiconfavouritebox);
  favouriteboximage.appendChild(favouriteIconbox);
  favouriteboximage.appendChild(editdeleteiconfavouritebox);
  favouritebox.appendChild(favouriteboximage);
  favouritebox.appendChild(favouriteboxtitle);
  favouritecontainer.appendChild(favouritebox);
  //**TODO: Remove if, Not Needed due to flexbox order, keep else part of statment**//
  if(inEditMode){
    favouritesContainer.insertBefore(favouritecontainer, favouritesContainer.lastChild);
  } else {
    favouritesContainer.appendChild(favouritecontainer);
  }

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
    displayEditCurrentFavouriteOverlay(title);
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
    if(order === currentOrderPosition) {
      console.log("Last Div Removed, reduce current order Position");
      currentOrderPosition--;
      storeSettings("1",settingsRowCountLimit, settingsBackgroundImageLimit,settingsCurrentSelectedBackground,currentOrderPosition);
    }
    browser.storage.local.remove(title);
  })

  favouritebox.addEventListener('mouseenter',(e) => {
    const evtTgt = e.target;
    var checkIfInEditMode = startpageContainerHTML.classList.contains('edit-mode');
    if(!checkIfInEditMode){
      var backgroundImgBox = evtTgt.firstChild;
      backgroundImgBox.setAttribute("style", 'background-color: white');
    }
  });

  favouritebox.addEventListener('mouseleave',(e) => {
    const evtTgt = e.target;
    var backgroundImgBox = evtTgt.firstChild;
    backgroundImgBox.setAttribute("style", "background-color: none");
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
}


/* function to update notes */

function updateFavourite(delNote,title, url, order, icon, iconColour, backgroundColour) {
  //var storingFavourite = browser.storage.local.set({ [newTitle] : newBody });
  var storingFavourite = browser.storage.local.set({ [title] : { "id" : "1", "title" : title, "url" : url, "Order" : order, "icon" : icon, "iconColour" : iconColour, "backgroundColour" : backgroundColour } });
  storingFavourite.then(() => {
    if(delNote !== title) {
      var removingNote = browser.storage.local.remove(delNote);
      removingNote.then(() => {
        displayFavourite("1",title, url, order,icon,iconColour,backgroundColour,true);
      }, onError);
    } else {
      displayFavourite("1",title, url, order,icon,iconColour,backgroundColour,true);
    }
  }, onError);
}

/**TODO: Add Debounce**/
function updatePreviewForNewFavouriteTitle() {
  var updatedTitle = newFavouriteTitleTextField.value;
  console.log(updatedTitle);
  newFavouritePreviewTitle.textContent = updatedTitle;
}

/**TODO: Add Debounce**/
function updatePreviewForNewFavouriteUrl() {

}

/**TODO: Add Debounce**/
function updatePreviewForNewFavouriteIcon() {
  var updatedIcon = NewFavouriteIconTextField.value;
  console.log(updatedIcon);
  newFavouritePreviewIcon.setAttribute('class',"preview-favourite-icon fa fa-5x "+updatedIcon);
}

/**TODO: Add Debounce**/
function updatePreviewForNewFavouriteIconColour() {
  var updatedIconColour = newFavouriteIconColourTextField.value;
  console.log(updatedIconColour);
  if(!updatedIconColour.startsWith('#')){
    updatedIconColour = '#'+updatedIconColour;
  }
  newFavouritePreviewIcon.setAttribute('style',"display: inline-block; color: "+updatedIconColour);
}

/**TODO: Add Debounce**/
function updatePreviewForNewFavouriteBackgroundColour() {
  var updatedBackgroundColour = newFavouriteBackgroundColourTextField.value;
  console.log(updatedBackgroundColour);
  if(!updatedBackgroundColour.startsWith('#')){
    updatedBackgroundColour = '#'+updatedBackgroundColour;
  }
  newFavouritePreviewTitle.setAttribute('style',"background-color: "+updatedBackgroundColour);
}




/**TODO: Add Debounce**/
function updatePreviewInEditFavouriteTitle() {
  var updatedTitle = editCurrentFavouriteTitleTextField.value;
  console.log(updatedTitle);
  previewTitle.textContent = updatedTitle;
}

/**TODO: Add Debounce**/
function updatePreviewInEditFavouriteUrl() {

}

/**TODO: Add Debounce**/
function updatePreviewInEditFavouriteIcon() {
  var updatedIcon = editCurrentFavouriteIconTextField.value;
  console.log(updatedIcon);
  previewIcon.setAttribute('class',"preview-favourite-icon fa fa-5x "+updatedIcon);
}

/**TODO: Add Debounce**/
function updatePreviewInEditFavouriteIconColour() {
  var updatedIconColour = editCurrentFavouriteIconColourTextField.value;
  console.log(updatedIconColour);
  if(!updatedIconColour.startsWith('#')){
    updatedIconColour = '#'+updatedIconColour;
  }
  previewIcon.setAttribute('style',"display: inline-block; color: "+updatedIconColour);
}

/**TODO: Add Debounce**/
function updatePreviewInEditFavouriteBackgroundColour() {
  var updatedBackgroundColour = editCurrentFavouriteBackgroundColourTextField.value;
  console.log(updatedBackgroundColour);
  if(!updatedBackgroundColour.startsWith('#')){
    updatedBackgroundColour = '#'+updatedBackgroundColour;
  }
  previewTitle.setAttribute('style',"background-color: "+updatedBackgroundColour);
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
          case "DivOrderUpdate":
              storeSettings("1", settingsRowCountLimit, settingsBackgroundImageLimit, settingsCurrentSelectedBackground, updatedValue);
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
                updateUi(getNewCssClass(updatedValue));
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
          case "DivOrderUpdate":
              if(result.startpagesettings.Order !== updatedValue)
              {
                console.log("Updated Order");
                storeSettings("1",settingsRowCountLimit, settingsBackgroundImageLimit,settingsCurrentSelectedBackground,updatedValue);
                onSettingsScreenSuccess("Updated Order to "+updatedValue);
              }
              break;
      }
    }
  }, onSettingsScreenError);
}


function getNewCssClass(rowCountRequired) {
  console.log("getNewCssClass(rowCountRequired)"+rowCountRequired);
    switch(rowCountRequired) {
      case "1":
        currentCssClassSize = "grid-100 tablet-grid-100 mobile-grid-100";
        return "grid-100 tablet-grid-100 mobile-grid-100";
      case "2":
        currentCssClassSize = "grid-50 tablet-grid-50 mobile-grid-50";
        return "grid-50 tablet-grid-50 mobile-grid-50";
      case "3":
        currentCssClassSize = "grid-33 tablet-grid-33 mobile-grid-33";
        return "grid-33 tablet-grid-33 mobile-grid-33";
      case "4":
        currentCssClassSize = "grid-25 tablet-grid-25 mobile-grid-25";
        return "grid-25 tablet-grid-25 mobile-grid-25";
      case "5":
        currentCssClassSize = "grid-20 tablet-grid-20 mobile-grid-20";
        return "grid-20 tablet-grid-20 mobile-grid-20";
      default:
        currentCssClassSize = "grid-25 tablet-grid-25 mobile-grid-25";
        return "grid-25 tablet-grid-25 mobile-grid-25";
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

function deletedStoredBackgroundImageDiv(filename){
  console.log(filename);
  document.getElementById(filename).remove();
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

 imageBoxBackgroundSelected.setAttribute('class','single-image-zone-icon');
 selectedIconBox.setAttribute('aria-hidden','true');
 selectedIconBox.setAttribute('class','fa fa-2x fa-check-circle');
 selectedIconBox.setAttribute("style", "color: green");
 imageBoxBackgroundSelected.appendChild(selectedIconBox);
 imageBoxBackground.appendChild(imageBoxBackgroundSelected);
 backgroundImageDisplayZone.appendChild(imageBoxBackground);


 imageBoxBackground.addEventListener('click',(e) => {
   console.log("CLick imageBoxBackground");
   console.log(e);
   var display = e.target.children[0];
   console.log(e.target.children[0]);
   if(display.style.display === 'block'){
     startpageImageContainerHTML.setAttribute("style", "background-image: url('')");
     display.setAttribute("style", "display: none;");
     // REmove blobl and current backgroudn filename
    // currentBackgroudnBlobUrl = objectURL;
    // storeSettings("1", settingsRowCountLimit,settingsBackgroundImageLimit,"",currentOrderPosition)
    settingsCurrentSelectedBackground = void 0;
    storeSettings("1", settingsRowCountLimit,settingsBackgroundImageLimit,settingsCurrentSelectedBackground,currentOrderPosition);
   } else {
     var backgroundImageDivs = document.querySelectorAll('.single-image-zone-icon');
     console.log(backgroundImageDivs);
     for (i = 0; i < backgroundImageDivs.length; ++i) {
       backgroundImageDivs[i].setAttribute("style", "display: none;");
     }
     imageBoxBackgroundSelected.setAttribute("style", "display: block;");
     setBackgroundContainerImage(objectURL);
     settingsCurrentSelectedBackground = filename;
     currentBackgroudnBlobUrl = objectURL;
     storeSettings("1", settingsRowCountLimit,settingsBackgroundImageLimit,filename,currentOrderPosition);
   }
 });
}

function setBackgroundContainerImage(url) {
  startpageImageContainerHTML.setAttribute("style", "background: url("+url+'); background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed;');
}

/**
JS SECTION FOR
DRAG AND DROP FAVOURITE CONTAINER FOR REORDERING
**/

function dragstart_handler(e) {
  console.log("IN EDIT MODE: "+inEditMode)
  if(inEditMode){
    console.log("dragStart");
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text', this.id);
    console.log(this);
  }
}

function handleDragOver(e) {
  if(inEditMode){
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    return false;
  }
}

function handleDragEnter(e) {
  if(inEditMode){
    this.classList.add('over');
  }
}

function handleDragLeave(e) {
  if(inEditMode){
    this.classList.remove('over');
  }
}

function handleDrop(e) {
  if(inEditMode){
    e.preventDefault();
    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
      var newPosition = this.getAttribute("style").split("order: ")[1].split(";")[0];
      var oldPosition = currentOrderPosition;

      var favouriteId = e.dataTransfer.getData('text');
      console.log(this.id);
      console.log(newPosition);
      console.log(favouriteId);
      var gettingFirstItem = browser.storage.local.get(favouriteId);
      gettingFirstItem.then((result) => {
        var objTest = Object.keys(result);
        document.getElementById(favouriteId).remove();
        console.log(result);
        console.log("URL: "+result.url);
        var url = result[favouriteId].url;
        var icon = result[favouriteId].icon;
        var iconColour = result[favouriteId].iconColour;
        var backgroundColour = result[favouriteId].backgroundColour;
        oldPosition = result[favouriteId].Order;
        updateFavourite(favouriteId, favouriteId, url, newPosition, icon, iconColour, backgroundColour);
      }, onError);

      var gettingSecondItem = browser.storage.local.get(this.id);
      gettingSecondItem.then((result) => {
        var objTest = Object.keys(result);
        document.getElementById(this.id).remove();
        var url = result[this.id].url;
        var icon = result[this.id].icon;
        var iconColour = result[this.id].iconColour;
        var backgroundColour = result[this.id].backgroundColour;
        updateFavourite(this.id, this.id, url, oldPosition, icon, iconColour, backgroundColour);
      }, onError);
     }
    handleDragEnd();
    return false;
  }
}

function handleDragEnd(e) {
  if(inEditMode){
    // this/e.target is the source node.
    console.log("handleDragEnd");
    favourtieArrayList = document.querySelectorAll('.favourite-container');
    console.log(favourtieArrayList);
      [].forEach.call(favourtieArrayList, function (favourtieList) {
        favourtieList.classList.remove('over');
      });
    }
}

// Return the week day name
function weekdayToString(weekDay){
    switch(weekDay){
        case 1:
            return "Monday";
            break;
        case 2:
            return "Tuesday";
            break;
        case 3:
            return "Wednesday";
            break;
        case 4:
            return "Thursday";
            break;
        case 5:
            return "Friday";
            break;
        case 6:
            return "Saturday";
            break;
        case 0:
            return "Sunday";
            break;
        default:
            return "Error: weekday number "+today.getDay();
    }
}

//Return the month name
function monthToString(month){
    switch(month){
        case 0:
            return "January";
            break;
        case 1:
            return "February";
            break;
        case 2:
            return "March";
            break;
        case 3:
            return "April";
            break;
        case 4:
            return "May";
            break;
        case 5:
            return "June";
            break;
        case 6:
            return "July";
            break;
        case 7:
            return "August";
            break;
        case 8:
            return "September";
            break;
        case 9:
            return "October";
            break;
        case 10:
            return "November";
            break;
        case 11:
            return "December";
            break;
        default:
            return "Error in month conversion, number="+month;
    }
}
//Return a properly formatted day number, like 1st, 3rd ...
function dayToString(day){
    switch(day){
        case 1:
        case 21:
        case 31:
            return day+"st";
            break;
        case 2:
            return day+"nd";
            break;
        case 3:
            return day+"rd";
            break;
        default:
            return day+"th";
    }
}


/* Clear all notes from the display/storage */
function clearAll() {
  while (noteContainer.firstChild) {
      noteContainer.removeChild(noteContainer.firstChild);
  }
  browser.storage.local.clear();
}
