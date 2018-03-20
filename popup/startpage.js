/**
--------TODO LIST-------
TODO:
- add debounce to certain eventLIsteners
- in background image handle if same image is added twice,
no need to delete
- in background image use lastmodififeddate in IMage obkect to remove
oldest image stored
- ability to add own icon image.
- add ability to load backup.
- disable left & right favourite list if only single list currently exists
- In edit mode and you click the left and right arrows, stay in edit mode on
next List.
- Handle special characters in export data backup
- Stop Duplicate Lists being created, Do check on list name
**/

var currentListSelection = document.querySelector('.current-favourite-list');
var inputTitle = document.querySelector('.new-note input');
var inputBody = document.querySelector('.new-note textarea');
var global_id = "10";
var idToEdit;
var noteContainer = document.querySelector('.note-container');
var favouritesContainer = document.querySelector('.startpage-favourites-container');
var dateTimeContainer = document.querySelector('.timeDateValue');
var settingsContainer = document.querySelector('.settings-container');
var favouriteListContainer = document.querySelector('.favourite-lists-container');
var favouriteList = document.querySelector('.favourite-lists');
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
var createNewFavouriteListBtn = document.querySelector('.favourite-lists-new');
var createNewFavouriteListCloseBtn = document.querySelector('.new-list-overlay-box-close');
var renameFavouriteListCloseBtn = document.querySelector('.rename-list-overlay-box-close');
var welcomeContainer = document.querySelector('.welcome-container');
var welcomeMainContainer = document.querySelector('.welcome-main-container');
var editModeTitleContainer = document.querySelector('.edit-mode-title-container');
var newFavouriteOverlayContainer = document.querySelector('.add-overlay-container');
var newFavouriteOverlayCloseContainerBtn = document.querySelector('.add-overlay-box-close');
var editCurrentFavouriteOverlayContainer = document.querySelector('.edit-overlay-container');
var editCurrentFavouriteOverlayCloseContainerBtn = document.querySelector('.edit-overlay-box-close');
var newListOverlayContainer = document.querySelector('.new-list-overlay-container');
var renameListOverlayContainer = document.querySelector('.rename-list-overlay-container');

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
var renameFavouriteListTitleTextField = document.querySelector('input[name="RenameListTitle"]');
var addNewFavouriteBtn = document.querySelector('input[id="AddNewFavouriteBtn"]');
var editUpdateFavouriteBtn = document.querySelector('input[id="EditCurrentFavouriteBtn"]');
var iconColourExampleDiv = document.querySelector('.icon-colour-example-add');
var NewListTitleTextField = document.querySelector('input[name="NewListTitle"]');
var addNewListBtn = document.querySelector('input[id="AddNewListBtn"]');
var renameListBtn = document.querySelector('input[id="RenamedListBtn"]');
var newFavouriteListTitleErrorMessageDiv = document.querySelector('.favourite-new-list-error-message-block');
var newFavouriteListTitleErrorMessageText = document.querySelector('.favourite-new-list-error-message-block-text');
var switchIconOrText = document.querySelector('.checkbox-useTextNotIcon');
var switchIconOrTextUpdateFavourite = document.querySelector('.checkbox-useTextNotIcon-update');

var iconInfomationIcon = document.querySelector('#IconInfo');

var clearBtn = document.querySelector('.clear');
var favouriteListSelectorLeft = document.querySelector('.change-selected-favourite-list-left');
var favouriteListSelectorRight = document.querySelector('.change-selected-favourite-list-right');
var addBtn = document.querySelector('.add');
var editModeBtn = document.querySelector('.edit-icon');
var favouriteListBtn = document.querySelector('.favourite-list');
var settingsBtn = document.querySelector('.settings-icon');
var editModeWelcomeBtn = document.querySelector('.welcome-edit-icon');
var settingsWelcomeBtn = document.querySelector('.welcome-settings-icon');
var favouriteListWelcomeBtn = document.querySelector('.welcome-favourite-list');
var howToUseIconWelcomeBtn = document.querySelector('.welcome-icon-how-to');
var settingsMode = false;
var inEditMode = false;
var FavouriteListsViewMode = false;
var currentCssClassSize = "grid-25 tablet-grid-25 mobile-grid-25";
var changeLinksToHttps = true;
var NoCurrentFavourites = false;
var settingsBackgroundImageLimit = "6";
var settingsRowCountLimit = "4";
var settingsCurrentSelectedBackground;
var currentBackgroudnBlobUrl;
var currentOrderPosition = 0;
var currentDefaultList = "Favourite list 1";
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
  backgroundImageInfoBlockText.textContent = message;
}

function onNewFavouriteListScreenError(message) {
  newFavouriteListTitleErrorMessageDiv.setAttribute("style", "display: flex;");
  newFavouriteListTitleErrorMessageText.textContent = message;
}


function defaultEventListener() {
  editModeBtn.addEventListener('click', EditOverlay);
  settingsBtn.addEventListener('click', OpenSettings);
  favouriteListBtn.addEventListener('click', openFavouriteList);
  settingsUpdateRowCountBtn.addEventListener('click', updateRowCountAndUiWithSettings);
  settingsUpdateStoredBackgroundImageCountBtn.addEventListener('click', updateBackgroundWithSettings);
  backgroundImageDropZone.addEventListener("dragend", processImageDragEndDropZone, false);
  backgroundImageDropZone.addEventListener("dragover", processImageDragOverDropZone, false);
  backgroundImageDropZone.addEventListener("drop", processImageDropZone, false);
  favouriteListSelectorLeft.addEventListener("click", changeSelectionLeft);
  favouriteListSelectorRight.addEventListener('click', changeSelectionRight);
  //newFavouriteIconColourTextField.addEventListener('keyup', updateIconColourExampleDiv);
}

function changeSelectionLeft() {
  var FavouriteListGet = browser.storage.local.get("FavouriteList");
  FavouriteListGet.then((results) => {
    var favouriteListKeys = Object.keys(results["FavouriteList"]);
    if(results["FavouriteList"]["FavouriteList"].length != 1){
      var currentInUseList = currentListSelection.textContent;
      var currentPosition = results["FavouriteList"]["FavouriteList"].indexOf(currentInUseList);
      var movingToPosition = --currentPosition;
      console.log("movingToPosition: "+ movingToPosition);
      console.log("length: "+ results["FavouriteList"]["FavouriteList"].length);
      if(movingToPosition < 0){
        movingToPosition = --results["FavouriteList"]["FavouriteList"].length;
        getAndDisplayNewList(movingToPosition);
      } else {
        getAndDisplayNewList(movingToPosition);
      }
    }
  }, onError);
}

function changeSelectionRight(){
  var FavouriteListGet = browser.storage.local.get("FavouriteList");
  FavouriteListGet.then((results) => {
    var favouriteListKeys = Object.keys(results["FavouriteList"]);
      if(results["FavouriteList"]["FavouriteList"].length != 1){
        var currentInUseList = currentListSelection.textContent;
        var currentPosition = results["FavouriteList"]["FavouriteList"].indexOf(currentInUseList);
        var movingToPosition = ++currentPosition;
        console.log("currentPosition: "+ currentPosition);
        console.log("movingToPosition: "+ movingToPosition);
        console.log("length: "+ results["FavouriteList"]["FavouriteList"].length);
        if(movingToPosition >= results["FavouriteList"]["FavouriteList"].length){
          movingToPosition = 0;
          getAndDisplayNewList(movingToPosition);
        } else {
          getAndDisplayNewList(movingToPosition);
        }
      }
    }, onError);
}

function changeSelection(){
  var FavouriteListGet = browser.storage.local.get("FavouriteList");
  FavouriteListGet.then((results) => {
    var favouriteListKeys = Object.keys(results["FavouriteList"]);
      var currentInUseList = currentListSelection.textContent;
      var currentPosition = results["FavouriteList"]["FavouriteList"].indexOf(currentInUseList);
      var movingToPosition = ++currentPosition;
      console.log("currentPosition: "+ currentPosition);
      console.log("movingToPosition: "+ movingToPosition);
      console.log("length: "+ results["FavouriteList"]["FavouriteList"].length);
      if(movingToPosition >= results["FavouriteList"]["FavouriteList"].length){
        movingToPosition = 0;
        getAndDisplayNewList(movingToPosition);
      } else {
        getAndDisplayNewList(movingToPosition);
      }
    }, onError);
}

function getAndDisplayNewList(newPosition){
  console.log("finalPosition: "+ newPosition);
  var removedCurrentFavouriteDivs = document.querySelectorAll('.favourite-container');
  for (i = 0; i < removedCurrentFavouriteDivs.length; ++i) {
    removedCurrentFavouriteDivs[i].remove();
  }

  var FavouriteListGet = browser.storage.local.get("FavouriteList");
  FavouriteListGet.then((results) => {
    var newFavoureiteListInUse = results["FavouriteList"]["FavouriteList"][newPosition];

var newListToDisplayEntries = browser.storage.local.get(newFavoureiteListInUse);
newListToDisplayEntries.then((result) => {
  currentListSelection.textContent = newFavoureiteListInUse;
  for (let dataObject of result[newFavoureiteListInUse]["data"]){
    var getEntry = browser.storage.local.get(dataObject);
    getEntry.then((entry) => {
      if(entry[dataObject] !== undefined){
        var id = entry[dataObject].id;
        var title = entry[dataObject].title;
        var url = entry[dataObject].url;
        var icon = entry[dataObject].icon;
        var iconColour = entry[dataObject].iconColour;
        var backgroundColour = entry[dataObject].backgroundColour;
        var order = entry[dataObject].Order;
        var text = entry[dataObject].text;
        var useTextNotIcon = entry[dataObject].useTextNotIcon;
        displayFavourite(id,title,url,order,icon,iconColour,text,useTextNotIcon,backgroundColour,false);
      }
    }, onError);
  }
}, onError);
  }, onError);
}


function defaultWelcomeEventListener() {
  editModeWelcomeBtn.addEventListener('click', EditOverlay);
  settingsWelcomeBtn.addEventListener('click', OpenSettings);
  favouriteListWelcomeBtn.addEventListener('click', openFavouriteList);
  howToUseIconWelcomeBtn.addEventListener('click', openIconInformationTab);
}

function RemoveDefaultWelcomeEventListener() {
  editModeWelcomeBtn.removeEventListener("click", EditOverlay);
  settingsWelcomeBtn.removeEventListener("click", OpenSettings);
  favouriteListWelcomeBtn.removeEventListener('click', openFavouriteList);
  howToUseIconWelcomeBtn.removeEventListener('click', openIconInformationTab);
}

/* display previously-saved stored notes on startup */

browser.runtime.onInstalled.addListener(handleUpdate);
initialise();

async function initialise() {
  await setupBackgroundImages();
  var gettingSettingsItem = browser.storage.local.get("startpagesettings");
  console.log("Checking if Settings are in keys");
  gettingSettingsItem.then(async (result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1) {
      console.log("Settings Not Found");
      storeSettings("10", "4","6","","1", "Favourite list 1");
    } else {
      console.log("SETTINGS FOUND: ID: "+result.startpagesettings.id);
      console.log("SETTINGS FOUND: BGCOUNT: "+result.startpagesettings.storedBackgroundImageCount);
      global_id = result.startpagesettings.id;
      console.log("SETTINGS FOUND: GLOBALID: "+global_id);
      settingsBackgroundImageLimit = result.startpagesettings.storedBackgroundImageCount;
      settingsRowCountLimit = result.startpagesettings.RowCount;
      getNewCssClass(settingsRowCountLimit);
      console.log(result.startpagesettings.SelectedBackgroundImage);
      settingsCurrentSelectedBackground = result.startpagesettings.SelectedBackgroundImage;
      currentOrderPosition = result.startpagesettings.Order;
      currentDefaultList = result.startpagesettings.CurrentDefaultList;
      //TODO:Verify settings once updated to a new version happenes
      if(currentDefaultList === undefined){
        currentDefaultList = "Favourite list 1";
        updateSettingsForType(currentDefaultList, "currentDefaultList")
      }
      console.log("INIT:currentDefaultList"+currentDefaultList);
      console.log("INIT:currentOrderPosition"+currentOrderPosition);
      await setupbackgroundInit();
    }
  }, onError);

  var FavouriteListGet = browser.storage.local.get("FavouriteList");
  console.log("LIST1 GET");
  FavouriteListGet.then((results) => {
    if(results["FavouriteList"] === undefined){
        var data = [];
        currentDefaultList = "Favourite list 1";
        // data.push("Entry1");
        // data.push("Entry2");
        // data.push("Entry3");
        // browser.storage.local.set({ ["Entry1"] : { "id" : "Entry1", "title" : "list1-1", "url" : "url111111111111", "Order" : "1", "icon" : "fa-github", "iconColour" : "#000", "backgroundColour" : "#000" } });
        // browser.storage.local.set({ ["Entry2"] : { "id" : "Entry2", "title" : "list1-2", "url" : "url222222222222", "Order" : "2", "icon" : "fa-github", "iconColour" : "#000", "backgroundColour" : "#fff" } });
        // browser.storage.local.set({ ["Entry3"] : { "id" : "Entry3", "title" : "list1-3", "url" : "url33", "Order" : "2", "icon" : "fa-github", "iconColour" : "#000", "backgroundColour" : "#000" } });
        browser.storage.local.set({ ["Favourite list 1"] : {data} });

        // var data = [];
        // var Settings = { ["Settings"] : { "default" : "true" } };
        // data.push(Settings);
        // data.push("Entry4");
        // data.push("Entry5");
        // data.push("Entry6");
        // browser.storage.local.set({ ["Entry4"] : { "id" : "Entry4", "title" : "list2-1", "url" : "url111111111111", "Order" : "1", "icon" : "fa-steam", "iconColour" : "#000", "backgroundColour" : "#000" } });
        // browser.storage.local.set({ ["Entry5"] : { "id" : "Entry5", "title" : "list2-2", "url" : "url222222222222", "Order" : "2", "icon" : "fa-steam", "iconColour" : "#000", "backgroundColour" : "#fff" } });
        // browser.storage.local.set({ ["Entry6"] : { "id" : "Entry6", "title" : "list2-3", "url" : "url33", "Order" : "2", "icon" : "fa-steam", "iconColour" : "#000", "backgroundColour" : "#000" } });
        // browser.storage.local.set({ ["Favourite list 2"] : {data} });
        //
        // var data = [];
        // var Settings = { ["Settings"] : { "default" : "false" } };
        // data.push(Settings);
        // data.push("Entry7");
        // data.push("Entry8");
        // data.push("Entry9");
        // browser.storage.local.set({ ["Entry7"] : { "id" : "Entry7", "title" : "list3-1", "url" : "url111111111111", "Order" : "1", "icon" : "fa-bank", "iconColour" : "#000", "backgroundColour" : "#000" } });
        // browser.storage.local.set({ ["Entry8"] : { "id" : "Entry8", "title" : "list3-2", "url" : "url222222222222", "Order" : "2", "icon" : "fa-bank", "iconColour" : "#000", "backgroundColour" : "#fff" } });
        // browser.storage.local.set({ ["Entry9"] : { "id" : "Entry9", "title" : "list3-3", "url" : "url33", "Order" : "2", "icon" : "fa-bank", "iconColour" : "#000", "backgroundColour" : "#000" } });
        // browser.storage.local.set({ ["Favourite list 3"] : {data} });

        var FavouriteList = [];
        FavouriteList.push("Favourite list 1");
        // FavouriteList.push("Favourite list 2");
        // FavouriteList.push("Favourite list 3");
        browser.storage.local.set({ ["FavouriteList"] : { FavouriteList } });

        currentListSelection.textContent = "Favourite list 1";
        var newListToDisplay = browser.storage.local.get("Favourite list 1");
        newListToDisplay.then((result) => {
          for (let dataObject of result["Favourite list 1"]["data"]){
            var getEntry = browser.storage.local.get(dataObject);
            getEntry.then((entry) => {
              if(entry[dataObject] !== undefined){
                var id = entry[dataObject].id;
                var title = entry[dataObject].title;
                var url = entry[dataObject].url;
                var icon = entry[dataObject].icon;
                var iconColour = entry[dataObject].iconColour;
                var backgroundColour = entry[dataObject].backgroundColour;
                var order = entry[dataObject].Order;
                var text = entry[dataObject].text;
                var useTextNotIcon = entry[dataObject].useTextNotIcon;
                displayFavourite(id,title,url,order,icon,iconColour,text, useTextNotIcon,backgroundColour,false);
              }
            }, onError);
          }
       }, onError);
        favouriteListSelectorLeft.setAttribute("style", "color: grey;");
        favouriteListSelectorRight.setAttribute("style", "color: grey;");
        NoCurrentFavourites = true;
        InWelcomeMode = true;
        welcomeContainer.setAttribute("style", "display: block;");
        welcomeMainContainer.setAttribute("style", "display: block;");
        defaultWelcomeEventListener();
    } else {
    var favouriteKeys = Object.keys(results);
    //console.log(favouriteKeys);
    var favouriteListKeys = Object.keys(results["FavouriteList"]);
    if(results["FavouriteList"]["FavouriteList"].length == 1){
      favouriteListSelectorLeft.setAttribute("style", "color: grey;");
      favouriteListSelectorRight.setAttribute("style", "color: grey;");
    }
    console.log(currentDefaultList);
    currentListSelection.textContent = currentDefaultList;
     var getEntriesInList = browser.storage.local.get(currentDefaultList);
     getEntriesInList.then((result) => {
       console.log(result);
       if(result[currentDefaultList]["data"].length !== 1){
        var defaultList = false;
         for (let dataObject of result[currentDefaultList]["data"]){
           var getEntry = browser.storage.local.get(dataObject);
           getEntry.then((entry) => {
             currentListSelection.textContent = currentDefaultList;
             if(entry[dataObject] !== undefined){
               var id = entry[dataObject].id;
               var title = entry[dataObject].title;
               var url = entry[dataObject].url;
               var icon = entry[dataObject].icon;
               var iconColour = entry[dataObject].iconColour;
               var backgroundColour = entry[dataObject].backgroundColour;
               var order = entry[dataObject].Order;
               var text = entry[dataObject].text;
               var useTextNotIcon = entry[dataObject].useTextNotIcon;
               displayFavourite(id,title,url,order,icon,iconColour,text,useTextNotIcon,backgroundColour,false);
             }
           }, onError);
         }
       } else {
         currentListSelection.textContent = currentDefaultList;
       }
    }, onError);
  }
  }, onError);

  defaultEventListener();
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

function getListCount(key) {
  return new Promise(resolve => {
    var count = browser.storage.local.get(key);
    var countAmount;
    count.then(async (results) => {
      console.log(results);
      console.log(key);
      countAmount = results[key]["data"].length;
      resolve(countAmount);
    });
  });
}

function CloseAddNewFavouritesOverlay() {
  addNewFavouriteBtn.removeEventListener('click', createNewFavourite)
  newFavouriteTitleTextField.removeEventListener('keyup', updatePreviewForNewFavouriteTitle);
  NewFavouriteIconTextField.removeEventListener('keyup', updatePreviewForNewFavouriteIcon);
  newFavouriteIconColourTextField.removeEventListener('keyup', updatePreviewForNewFavouriteIconColour);
  newFavouriteBackgroundColourTextField.removeEventListener('keyup', updatePreviewForNewFavouriteBackgroundColour);
  switchIconOrText.removeEventListener('click', useTextNotIconSwitch);
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

  if(FavouriteListsViewMode){
      favouriteListContainer.setAttribute("style", "display: none;");
      FavouriteListsViewMode = false;
      createNewFavouriteListBtn.removeEventListener('click', createNewFavouriteListOverlay);
  }

  if(settingsMode){
    settingsContainer.setAttribute("style", "display: none;");
    settingsMode = false;
  } else {
       if(!settingsRowCountLimit) {
         storeSettings(global_id,"4","6","","1","Favourite List 1");
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

  if(FavouriteListsViewMode){
      favouriteListContainer.setAttribute("style", "display: none;");
      FavouriteListsViewMode = false;
      createNewFavouriteListBtn.removeEventListener('click', createNewFavouriteListOverlay);
  }

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

function createNewFavouriteList(){
  var newListTitle = NewListTitleTextField.value;

  var checkIfListExists = browser.storage.local.get(newListTitle);
  checkIfListExists.then((list) => {
    console.log(list);
if(Object.keys(list).length === 0) {
  if(newListTitle !== ""){
    var data = [];
    browser.storage.local.set({ [newListTitle] : {data} });
    var listOfFavourites = browser.storage.local.get("FavouriteList");
    listOfFavourites.then((result) => {
      if(result["FavouriteList"]["FavouriteList"].length == 1){
        favouriteListSelectorLeft.setAttribute("style", "color: black;");
        favouriteListSelectorRight.setAttribute("style", "color: black;");
      }
      var FavouriteList = [];
      var FavouriteList = result["FavouriteList"]["FavouriteList"];
      FavouriteList.push(newListTitle);
      browser.storage.local.set({ ["FavouriteList"] : {FavouriteList} });
      renderFavouritListDivWithInfo(newListTitle);
    }, onError);
  }
} else {
  onNewFavouriteListScreenError("List with alrerady exists!");
}
}, onError);
}

function createNewFavouriteListOverlay(){
  newListOverlayContainer.setAttribute("style", "display: block;");
  addNewListBtn.addEventListener('click', createNewFavouriteList);

  createNewFavouriteListCloseBtn.addEventListener('click',(e) => {
    newListOverlayContainer.setAttribute("style", "display: none;");
  })
}

async function openFavouriteList() {
  var hasEditModeClass = startpageContainerHTML.classList.contains('edit-mode');
  var inEditMode = startpageContainerHTML.classList.contains('edit-mode');

  if(inEditMode){
    await removeEditOverlay();
    switchIconsToLogo();
  }

  if(settingsMode){
    settingsContainer.setAttribute("style", "display: none;");
    settingsMode = false;
  }

  if(FavouriteListsViewMode){
    favouriteListContainer.setAttribute("style", "display: none;");
    FavouriteListsViewMode = false;
    createNewFavouriteListBtn.removeEventListener('click', createNewFavouriteListOverlay);
    addNewListBtn.removeEventListener('click', createNewFavouriteList);
  } else {
    createNewFavouriteListBtn.addEventListener('click', createNewFavouriteListOverlay);

    favouriteList.textContent = "";
    var FavouriteListGet = browser.storage.local.get("FavouriteList");
      FavouriteListGet.then(async (results) => {
        var favouriteListKeys = Object.keys(results["FavouriteList"]);
        for (let favListKey of favouriteListKeys) {
          console.log(favouriteListKeys);
          for (let indiKet of results["FavouriteList"][favListKey]) {
            renderFavouritListDivWithInfo(indiKet);
          }
        }
        favouriteListContainer.setAttribute("style", "display: block;");
        FavouriteListsViewMode = true;
    }, onError);
  }
}

async function renderFavouritListDivWithInfo(listKey){
var favouriteListDivContainer = document.createElement('div');
var favouriteListDiv = document.createElement('div');
var favouriteListInfoDiv = document.createElement('div');
var favouriteListInfoNumberDiv = document.createElement('div');
var favouriteListInfoEntriesTextDiv = document.createElement('div');
var editdeleteicontainer = document.createElement('div');
var editIconbox = document.createElement('div');
var deleteIconbox = document.createElement('div');


favouriteListDivContainer.setAttribute("class", "grid-33 favourite-list-main-container");
favouriteListDivContainer.setAttribute("id", listKey);
editdeleteicontainer.setAttribute("class", "grid-100 icon-favourite-list-container");
favouriteListDiv.setAttribute("class", "grid-100 favourite-list-main");
favouriteListInfoDiv.setAttribute("class", "grid-100 favourite-list-main-info");
favouriteListInfoNumberDiv.setAttribute("class", "grid-100 favourite-list-main-info-number");
favouriteListInfoEntriesTextDiv.setAttribute("class", "grid-100 favourite-list-main-info-entries-text");
editIconbox.setAttribute("class", "grid-50 edit-icon-favourite-list");
deleteIconbox.setAttribute("class", "grid-50 delete-icon-favourite-list");
editIconbox.setAttribute("style", "justify-content: center; align-items: center; display: flex;");
deleteIconbox.setAttribute("style", "justify-content: center; align-items: center; display: flex;");
favouriteListDiv.setAttribute("style", "justify-content: center; align-items: center; display: flex;");
favouriteListInfoDiv.setAttribute("style", "justify-content: center; align-items: center; display: flex;");
favouriteListInfoNumberDiv.setAttribute("style", "justify-content: center; align-items: center; display: flex;");
favouriteListInfoEntriesTextDiv.setAttribute("style", "justify-content: center; align-items: center; display: flex;");

var count = await getListCount(listKey);
favouriteListInfoNumberDiv.textContent = count;

favouriteListDiv.textContent = listKey;
favouriteListInfoDiv.textContent = "Contains";
favouriteListInfoEntriesTextDiv.textContent = "Entries";
//favouriteListInfoNumberDiv.textContent = count;
editIconbox.textContent = "Rename List";
deleteIconbox.textContent = "Delete List";
editdeleteicontainer.appendChild(editIconbox);
editdeleteicontainer.appendChild(deleteIconbox);
favouriteListDivContainer.appendChild(favouriteListDiv);
favouriteListDivContainer.appendChild(favouriteListInfoDiv);
favouriteListDivContainer.appendChild(favouriteListInfoNumberDiv);
favouriteListDivContainer.appendChild(favouriteListInfoEntriesTextDiv);
favouriteListDivContainer.appendChild(editdeleteicontainer);
favouriteList.appendChild(favouriteListDivContainer);

editIconbox.addEventListener('click',(e) => {
  console.log("RENAMEING");
  renameListOverlayContainer.setAttribute("style", "display: block");
  renameFavouriteListCloseBtn.addEventListener('click', removeRenameOverlay);
  renameListBtn.addEventListener('click',(e) => {
    // Remove and rerende Div
    var newListTitle = renameFavouriteListTitleTextField.value;
    console.log(listKey);
    console.log(newListTitle);
    var currentListData = browser.storage.local.get(listKey);
      currentListData.then(async (results) => {
        console.log(results);
        var data = results[listKey]["data"];
        browser.storage.local.set({ [newListTitle] : {data} });
        browser.storage.local.remove(listKey);
      }, onError);

      var newListWithData = browser.storage.local.get(newListTitle);
      newListWithData.then(async (results) => {
        console.log(results);
      }, onError);

    var FavouriteListGet = browser.storage.local.get("FavouriteList");
      FavouriteListGet.then(async (results) => {
        var listPositionInFavourites = results["FavouriteList"]["FavouriteList"].indexOf(listKey);
        results["FavouriteList"]["FavouriteList"].splice(listPositionInFavourites, 1, newListTitle);
        var FavouriteList = results["FavouriteList"]["FavouriteList"];
        console.log(FavouriteList);
        browser.storage.local.set({ ["FavouriteList"] : { FavouriteList } });
      }, onError);

      if(currentListSelection.textContent == listKey){
        currentListSelection.textContent = newListTitle;
      }
      document.getElementById(listKey).remove();
      // Handle Rerender.
      //renderFavouritListDivWithInfo(newListTitle);
});
});

deleteIconbox.addEventListener('click',(e) => {
  var lastList = false;
  var currentInUseList = currentListSelection.textContent;
    if(currentInUseList == listKey) {
      var removedCurrentFavouriteDivs = document.querySelectorAll('.favourite-container');
      for (i = 0; i < removedCurrentFavouriteDivs.length; ++i) {
        removedCurrentFavouriteDivs[i].remove();
      }
    }
  console.log(listKey);

  var FavouriteListGet = browser.storage.local.get("FavouriteList");
  FavouriteListGet.then((results) => {
    var listPositionInFavourites = results["FavouriteList"]["FavouriteList"].indexOf(listKey);
    console.log(listPositionInFavourites);
    var removed = results["FavouriteList"]["FavouriteList"].splice(listPositionInFavourites, 1);
    var FavouriteList = results["FavouriteList"]["FavouriteList"];
    console.log(FavouriteList);
    browser.storage.local.set({ ["FavouriteList"] : { FavouriteList } });
  }, onError);
  const evtTgt = e.target;
  evtTgt.parentNode.parentNode.remove();

  var listDataToRemove = browser.storage.local.get(listKey);
  listDataToRemove.then(async (result) => {
    for (let dataObject of result[listKey]["data"]){
      var getEntry = browser.storage.local.get(dataObject);
      getEntry.then(async (entry) => {
        if(entry[dataObject] !== undefined){
          console.log("Removing Entry:"+ dataObject);
          browser.storage.local.remove(dataObject);
        }
      }, onError);
    }
    if(currentDefaultList == listKey){
        setNewDefaultList(0);
      } else {
        changeSelection();
      }
    console.log("Removing List:"+ listKey);
    browser.storage.local.remove(listKey);
    console.log("Removal of list:"+ listKey+" complete.");
  }, onError);
});
}


function removeRenameOverlay(){
  renameListOverlayContainer.setAttribute("style", "display: none;");
  renameFavouriteListCloseBtn.removeEventListener('click', removeRenameOverlay);
}

function setNewDefaultList(position){
  var FavouriteListGet = browser.storage.local.get("FavouriteList");
    FavouriteListGet.then((results) => {
      if(results["FavouriteList"]["FavouriteList"].length <= 0){
        var data = [];
        currentDefaultList = "Favourite list 1";
        currentListSelection.textContent = currentDefaultList;
        data.push("Entry1");
        browser.storage.local.set({ ["Entry1"] : { "id" : "Entry1", "title" : "NEW LIST", "url" : "url111111111111", "Order" : "1", "icon" : "fa-steam", "iconColour" : "#000", "backgroundColour" : "#000" } });
        browser.storage.local.set({ ["Favourite list 1"] : {data} });
        var FavouriteList = [];
        FavouriteList.push("Favourite list 1");
        browser.storage.local.set({ ["FavouriteList"] : { FavouriteList } });
      } else {
      console.log(newDefaultListName);
      var newDefaultListName = results["FavouriteList"]["FavouriteList"][position];
      currentDefaultList = newDefaultListName;
      currentListSelection.textContent = newDefaultListName;
      updateSettingsForType(newDefaultListName, "currentDefaultList")
  }
  }, onError);
  changeSelectionRight();
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

  var FavouritesIconDivs = document.querySelectorAll('.active-text-or-icon');
  for (i = 0; i < FavouritesIconDivs.length; ++i) {
    var iconOrTextClass = FavouritesIconDivs[i].getAttribute("class");
    var iconcolour = FavouritesIconDivs[i].getAttribute("style").split("color:")[1].split(";")[0];
    if(iconOrTextClass.includes('text-only-icon-box')){
      console.log("Icon");
      FavouritesIconDivs[i].setAttribute('style',"color:"+iconcolour+"; display: none");
    } else {
    FavouritesIconDivs[i].setAttribute('style',"color:"+iconcolour+"; display: none");
    }
  }
}

function switchIconsToLogo() {
  var editDeleteIconDivs = document.querySelectorAll('.edit-delete-icons');
  for (i = 0; i < editDeleteIconDivs.length; ++i) {
    editDeleteIconDivs[i].setAttribute('style','display: none');
  }

  var FavouritesIconDivs = document.querySelectorAll('.active-text-or-icon');
  for (i = 0; i < FavouritesIconDivs.length; ++i) {
    var iconOrTextClass = FavouritesIconDivs[i].getAttribute("class");
    var iconcolour = FavouritesIconDivs[i].getAttribute("style").split("color:")[1].split(";")[0];
    if(iconOrTextClass.includes('text-only-icon-box')){
      console.log("Icon");
      FavouritesIconDivs[i].setAttribute('style',"color:"+iconcolour+"; display: inline-block");
    } else {
      FavouritesIconDivs[i].setAttribute('style',"color:"+iconcolour+"; display: inline-block");
    }
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
    iconInfomationIcon.addEventListener('click', openIconInformationTab);
    newFavouriteOverlayCloseContainerBtn.addEventListener('click', CloseAddNewFavouritesOverlay);
    switchIconOrText.addEventListener('click', useTextNotIconSwitch);
  })
}

function useTextNotIconSwitch(){
  var useTextNotIcon = document.getElementsByClassName("checkbox-useTextNotIcon")[0].checked ? true : false
  var textP = document.querySelector('#NewFavouriteIcon');
  var iconP = document.querySelector('#NewFavouriteIconColour');

  console.log(useTextNotIcon);
  if(useTextNotIcon){
    textP.textContent = "Favourite Icon(Text):";
    iconP.textContent = "Text Colour #:";
  } else {
    textP.textContent = "Favourite Icon:";
    iconP.textContent = "Icon Colour #:";
  }
}

function openIconInformationTab(){
  console.log('Open Tab');
  var creating = browser.tabs.create({
     url:"../information/updateInformation.html"
   });
   creating.then(onCreated, onError);
}

function handleUpdate() {
  browser.tabs.create({
    url: "../information/updateInformation.html"
  });
}


function openIconInformationTab(){
  console.log('Open Tab');
  var creating = browser.tabs.create({
     url:"../information/information.html"
   });
   creating.then(onCreated, onError);
}

function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`)
}

function addNewFavourite(id, title,url,icon,iconColour,text,useTextNotIcon,backgroundColour) {
  var gettingItem = browser.storage.local.get(title);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && title !== '' && url !== '') {
      newFavouriteTitleTextField.value = '';
      newFavouriteUrlTextField.value = '';
      currentOrderPosition++;
      console.log("addNewFavourite Updaed Order Position"+currentOrderPosition);
      storeFavourite(id,title,url,currentOrderPosition,icon,iconColour,text,useTextNotIcon,backgroundColour,true);
      updateDivOrderCount();

      if(InWelcomeMode){
        welcomeMainContainer.setAttribute("style","display:none");
        InWelcomeMode = false;
      }
    }
  }, onError);
}

function createNewFavourite(){
  console.log(global_id);
  var title = newFavouriteTitleTextField.value;
  var url = newFavouriteUrlTextField.value;
  var icon = NewFavouriteIconTextField.value;
  var iconColour = newFavouriteIconColourTextField.value;
  var backgroundColour = newFavouriteBackgroundColourTextField.value;
  var id = ++global_id;
  console.log(id);

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
  url = url.trim();

  text = icon;
  var useTextNotIcon = document.getElementsByClassName("checkbox-useTextNotIcon")[0].checked ? true : false

  addNewFavourite(id, title,url,icon,iconColour,text,useTextNotIcon,backgroundColour)
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
function storeFavourite(id, title, url, order, icon, iconColour, text, useTextNotIcon, backgroundColour, inEditMode) {
  var entryTitle = "Entry"+id;
  console.log("storeFavourite: "+id);
  browser.storage.local.set({ [entryTitle] : { "id" : id, "title" : title, "url" : url, "Order" : order, "icon" : icon, "iconColour" : iconColour, "text" : text, "useTextNotIcon" : useTextNotIcon, "backgroundColour" : backgroundColour } });

  var currentInUseList = currentListSelection.textContent;
  var currentInUseListArrayName = currentInUseList;

  var storingNewFavourite = browser.storage.local.get(currentInUseListArrayName);
  storingNewFavourite.then((results) => {
    var data = results[currentInUseListArrayName]["data"];
    data.push(entryTitle);
    browser.storage.local.set({ [currentInUseList] : {data} });
  }, onError);
  displayFavourite(id, title,url,order,icon,iconColour,text,useTextNotIcon,backgroundColour,inEditMode);
}

function storeSettings(id, rowCount, backgroundCount, backgroundImage, order, defaultList) {
  console.log("storeSettings: "+ id + ", RowCount: " +rowCount + ", BackgroundImageCount: " +backgroundCount+ ", Order: " +order+ ", Default List: " + defaultList);
  browser.storage.local.set({ ["startpagesettings"] : { "id" : id, "RowCount" : rowCount, "storedBackgroundImageCount" : backgroundCount, "SelectedBackgroundImage" : backgroundImage, "Order" : order, "CurrentDefaultList" : defaultList } });
  settingsBackgroundImageLimit = backgroundCount;
  settingsRowCountLimit = rowCount;
  settingsCurrentSelectedBackground = backgroundImage;
  currentDefaultList = defaultList;
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


function displayEditCurrentFavouriteOverlay(id) {
  console.log(id);
  var searchID = "Entry"+id;
  var entry = browser.storage.local.get(id);
  entry.then((results) => {
    console.log(results)
    var objectKeys = Object.keys(results);
    var currentTitle = results[objectKeys].title;
    var currentUrl = results[objectKeys].url;
    var currentIcon = results[objectKeys].icon;
    var currentIconColour = results[objectKeys].iconColour;
    var currentBackgroundColour = results[objectKeys].backgroundColour;
    var currentOrder = results[objectKeys].Order;
    var useTextNotIcon = results[objectKeys].useTextNotIcon;
    createEditCurrentFavouriteDivOverlay(id, currentTitle, currentUrl, currentOrder, currentIcon, currentIconColour, currentBackgroundColour,useTextNotIcon);
  }, onError);
}

function createEditCurrentFavouriteDivOverlay(id, title, url, order, icon, iconColour, backgroundColour,useTextNotIcon) {
  var iconP = document.querySelector('#EditCurrentFavouriteIconColour');

  useTextNotIcon ? document.getElementsByClassName("checkbox-useTextNotIcon-update")[0].checked = true
                 : document.getElementsByClassName("checkbox-useTextNotIcon-update")[0].checked = false;

   var previewTextOnlyIconBox = document.querySelector('.preview-text-only-icon-box');
   var previewTextOnlyIconBoxH1 = document.querySelector('.preview-text-only-icon-box-h1');
   var previewIconBox = document.querySelector('.preview-favourite-icon');

  if(useTextNotIcon){
    console.log(previewIconBox)
    previewIconBox.setAttribute("style", "display: none");
    previewTextOnlyIconBox.setAttribute("style", "display: block");
    previewTextOnlyIconBoxH1.textContent = icon;
    iconP.textContent = "Text Colour #:";
  } else {
    previewIconBox.setAttribute("style", "display: block");
    previewTextOnlyIconBox.setAttribute("style", "display: none");
    iconP.textContent = "Icon Colour #:";
  }

  editCurrentFavouriteTitleTextField.value = title;
  editCurrentFavouriteUrlTextField.value = url;
  editCurrentFavouriteIconTextField.value = icon;
  editCurrentFavouriteIconColourTextField.value = iconColour;
  editCurrentFavouriteBackgroundColourTextField.value = backgroundColour;
  previewTitle.textContent = title;
  previewIcon.setAttribute('class',"preview-favourite-icon fa fa-5x "+icon);
  previewTitle.setAttribute('style',"background-color: "+backgroundColour);
  editCurrentFavouriteOverlayCloseContainerBtn.addEventListener('click',(e) => {
    CloseEditCurrentFavouritesOverlay();
    editCurrentFavouriteTitleTextField.removeEventListener("keyup", updatePreviewInEditFavouriteTitle);
    editCurrentFavouriteUrlTextField.removeEventListener("keyup", updatePreviewInEditFavouriteUrl);
    editCurrentFavouriteIconTextField.removeEventListener("keyup", updatePreviewInEditFavouriteIcon);
    editCurrentFavouriteIconColourTextField.removeEventListener("keyup", updatePreviewInEditFavouriteIconColour);
    editCurrentFavouriteBackgroundColourTextField.removeEventListener("keyup", updatePreviewInEditFavouriteBackgroundColour);
    editUpdateFavouriteBtn.removeEventListener('click',ProcessUpdateFavourite, false);
    switchIconOrTextUpdateFavourite.removeEventListener('click', useTextNotIconSwitchUpdateFavourite);
  })

  switchIconOrTextUpdateFavourite.addEventListener('click', useTextNotIconSwitchUpdateFavourite);
  editCurrentFavouriteTitleTextField.addEventListener('keyup',updatePreviewInEditFavouriteTitle);
  editCurrentFavouriteUrlTextField.addEventListener('keyup',updatePreviewInEditFavouriteUrl);
  editCurrentFavouriteIconTextField.addEventListener('keyup',updatePreviewInEditFavouriteIcon);
  editCurrentFavouriteIconColourTextField.addEventListener('keyup',updatePreviewInEditFavouriteIconColour);
  editCurrentFavouriteBackgroundColourTextField.addEventListener("keyup", updatePreviewInEditFavouriteBackgroundColour);

  editUpdateFavouriteBtn.title = title;
  editUpdateFavouriteBtn.order = order;
  idToEdit = id;
  editUpdateFavouriteBtn.addEventListener('click',ProcessUpdateFavourite, false);
  editCurrentFavouriteOverlayContainer.setAttribute("style","display:block");
}

function useTextNotIconSwitchUpdateFavourite(){
  var useTextNotIcon = document.getElementsByClassName("checkbox-useTextNotIcon-update")[0].checked ? true : false
  var textP = document.querySelector('#EditCurrentFavouriteIcon');
  var iconP = document.querySelector('#EditCurrentFavouriteIconColour');
  var previewTextOnlyIconBox = document.querySelector('.preview-text-only-icon-box');
  var previewIconBox = document.querySelector('.preview-favourite-icon');

  if(useTextNotIcon){
    textP.textContent = "Favourite Icon(Text):";
    iconP.textContent = "Text Colour #:";
    previewIconBox.setAttribute("style", "display: none");
    previewTextOnlyIconBox.setAttribute("style", "display: block");
    var previewIconTextyBox = document.querySelector('.preview-text-only-icon-box-h1');
    previewIconTextyBox.textContent = editCurrentFavouriteIconTextField.value;
  } else {
    textP.textContent = "Favourite Icon:";
    iconP.textContent = "Icon Colour #:";
    previewIconBox.setAttribute("style", "display: block");
    previewTextOnlyIconBox.setAttribute("style", "display: none");
  }
}

function ProcessUpdateFavourite(evt)
{
  console.log(idToEdit);
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
  document.getElementById(idToEdit).remove();
  var url = editCurrentFavouriteUrlTextField.value
  url = url.trim();
  console.log(url);
  var useTextNotIcon = document.getElementsByClassName("checkbox-useTextNotIcon-update")[0].checked ? true : false
  var text = useTextNotIcon ? editCurrentFavouriteIconTextField.value : "";
  updateFavourite(idToEdit,evt.target.title, editCurrentFavouriteTitleTextField.value, url, evt.target.order, editCurrentFavouriteIconTextField.value, updatedIconColour, updatedBackgroundColour,text,useTextNotIcon);
  editUpdateFavouriteBtn.removeEventListener('click',ProcessUpdateFavourite, false);
  console.log("ProcessUpdateFavourite")
  eventListnerForNewUpdateDiv(evt.target.order);
}

function eventListnerForNewUpdateDiv(order){
  editUpdateFavouriteBtn.title = editCurrentFavouriteTitleTextField.value;
  editUpdateFavouriteBtn.order = order;
  editUpdateFavouriteBtn.addEventListener('click',ProcessUpdateFavourite, false);
}

/* function to display a favourite */
function displayFavourite(id, title, url,order, icon, iconColour, text, useTextNotIcon, backgroundColour, inEditMode) {
  var createCorrectUrl = generateValidUrl(url);
  var favouritecontainer = document.createElement('div');
  var favouritebox = document.createElement('a');
  var favouriteboximage = document.createElement('div');
  var editdeleteiconfavouritebox = document.createElement('div');
  var favouriteTextOnlyBox = document.createElement('div');
  var editiconfavouritebox = document.createElement('div');
  var deleteiconfavouritebox = document.createElement('div');
  var favouriteIconbox = document.createElement('i');
  var editIconbox = document.createElement('i');
  var deleteIconbox = document.createElement('i');
  var favouriteboxtitle = document.createElement('div');
  var textIconH1 = document.createElement('h1');
  var newID = id.toString();
  if(newID.startsWith('Entry')){
      var divID = newID;
  } else {
      var divID = "Entry"+id;
  }

  favouritecontainer.setAttribute('id',divID);
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
  editiconfavouritebox.setAttribute('class','grid-50 tablet-grid-50 mobile-grid-50 edit-favourite-icon');
  editiconfavouritebox.setAttribute('style','justify-content: center; align-items: center; display: flex;');
  deleteiconfavouritebox.setAttribute('class','grid-50 delete-favourite-icon');
  deleteiconfavouritebox.setAttribute('style','justify-content: center; align-items: center; display: flex;');
  favouriteboximage.setAttribute('class','grid-100 favourite-box-image');
  textIconH1.textContent = text;

  var iconClass = "favourite-icon fa fa-5x "+ icon;
  var iconClassTextOnly = "favourite-icon text-only-icon-box";
  favouriteIconbox.setAttribute('class',iconClass);
  favouriteTextOnlyBox.setAttribute('class',iconClassTextOnly);

  if(useTextNotIcon){
    if(inEditMode){
      favouriteIconbox.setAttribute('style',"color: "+iconColour+"; display: none");
      favouriteTextOnlyBox.setAttribute('class',iconClassTextOnly+" active-text-or-icon");
      favouriteTextOnlyBox.setAttribute('style','display: none; color: '+iconColour);
      editdeleteiconfavouritebox.setAttribute('style','display: inline-block');
    } else {
      favouriteIconbox.setAttribute('style',"color: "+iconColour+"; display: none");
      favouriteTextOnlyBox.setAttribute('class',iconClassTextOnly+" active-text-or-icon");
      favouriteTextOnlyBox.setAttribute('style','display: inline-block; color: '+iconColour);
      editdeleteiconfavouritebox.setAttribute('style','display: none');
    }
  } else {
    if(inEditMode){
      favouriteIconbox.setAttribute('style',"color: "+iconColour+"; display: none");
      favouriteIconbox.setAttribute('class',iconClass+ " active-text-or-icon");
      favouriteTextOnlyBox.setAttribute('style','display: none');
      editdeleteiconfavouritebox.setAttribute('style','display: inline-block');
    } else {
      favouriteIconbox.setAttribute('class',iconClass+ " active-text-or-icon");
      favouriteIconbox.setAttribute('style',"color: "+iconColour+"; display: inline-block");
      favouriteTextOnlyBox.setAttribute('style','display: none');
      editdeleteiconfavouritebox.setAttribute('style','display: none');
    }
  }

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
  favouriteTextOnlyBox.appendChild(textIconH1);
  favouriteboximage.appendChild(favouriteIconbox);
  favouriteboximage.appendChild(favouriteTextOnlyBox);
  favouriteboximage.appendChild(editdeleteiconfavouritebox);
  favouritebox.appendChild(favouriteboximage);
  favouritebox.appendChild(favouriteboxtitle);
  favouritecontainer.appendChild(favouritebox);

  favouritesContainer.appendChild(favouritecontainer);

  favouritebox.addEventListener('click',(e) => {
    const evtTgt = e.target;
    console.log("Favourites Box"+evtTgt);
    var bool = startpageContainerHTML.classList.contains('edit-mode');
    if(bool){
      e.preventDefault();
    }
  })

  editiconfavouritebox.addEventListener('click',(e) => {
    const evtTgt = e.target;
    displayEditCurrentFavouriteOverlay(divID);
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
      storeSettings(global_id,settingsRowCountLimit, settingsBackgroundImageLimit,settingsCurrentSelectedBackground,currentOrderPosition,currentDefaultList);
    }
    //browser.storage.local.remove(title);
    var currentInUseList = currentListSelection.textContent;
    var listFavouriteIsOnToBeRemoved = browser.storage.local.get(currentInUseList);
    listFavouriteIsOnToBeRemoved.then((entry) => {
      var entryToRemove = "Entry"+id;
      var entryPositionInFavouriteList = entry[currentInUseList]["data"].indexOf(id);
      console.log(entry[currentInUseList]["data"]);
      var removed = entry[currentInUseList]["data"].splice(entryPositionInFavouriteList, 1);
      var data = entry[currentInUseList]["data"];
      console.log(data);
      browser.storage.local.set({ [currentInUseList] : { data } });
      var allData = browser.storage.local.get(null);
      allData.then((entry) => {
        }, onError);
      console.log(entryToRemove);
      browser.storage.local.remove(entryToRemove);
      var allData2 = browser.storage.local.get(null);
      allData2.then((entry) => {

      }, onError);
      }, onError);
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
}


/* function to update notes */

function updateFavourite(id, delNote,title, url, order, icon, iconColour, backgroundColour, text, useTextNotIcon) {
  console.log(id);
  console.log(delNote);
  console.log(text);
  console.log(useTextNotIcon);
  var storingFavourite = browser.storage.local.set({ [id] : { "id" : id, "title" : title, "url" : url, "Order" : order, "icon" : icon, "iconColour" : iconColour, "text" : text, "useTextNotIcon" : useTextNotIcon, "backgroundColour" : backgroundColour } });
  storingFavourite.then(() => {
    console.log("INSIDE");
      displayFavourite(id,title, url, order,icon, iconColour, text, useTextNotIcon, backgroundColour,true);
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
  var previewTextOnlyIconBox = document.querySelector('.preview-text-only-icon-box-h1');
  previewTextOnlyIconBox.textContent = updatedIcon;
}

/**TODO: Add Debounce**/
function updatePreviewInEditFavouriteIconColour() {
  var updatedIconColour = editCurrentFavouriteIconColourTextField.value;
  var previewTextOnlyIconBox = document.querySelector('.preview-text-only-icon-box-h1');
  console.log(updatedIconColour);
  if(!updatedIconColour.startsWith('#')){
    updatedIconColour = '#'+updatedIconColour;
  }
  previewIcon.setAttribute('style',"display: inline-block; color: "+updatedIconColour);
  previewTextOnlyIconBox.setAttribute('style',"color: "+updatedIconColour);
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
              storeSettings(global_id, updatedValue, settingsBackgroundImageLimit, settingsCurrentSelectedBackground,currentOrderPosition, currentDefaultList);
              settingsRowCountTextField.value = newRowCount;
              break;
          case "backgroundImageCount":
              storeSettings(global_id, settingsRowCountLimit, updatedValue, settingsCurrentSelectedBackground,currentOrderPosition, currentDefaultList);
              settingsUpdateStoredBackgroundImageCountTextField.value = updatedValue;
              break;
          case "currentDefaultList":
              storeSettings(global_id, settingsRowCountLimit, settingsBackgroundImageLimit, settingsCurrentSelectedBackground,currentOrderPosition, updatedValue);
              break;
          case "DivOrderUpdate":
              storeSettings(global_id, settingsRowCountLimit, settingsBackgroundImageLimit, settingsCurrentSelectedBackground, updatedValue, currentDefaultList);
              break;
      }
    } else {
      switch (settingsType) {
          case "rowCount":
              if(result.startpagesettings.RowCount !== updatedValue)
              {
                console.log("Updated Row Count Settings");
                storeSettings(global_id,updatedValue, settingsBackgroundImageLimit,settingsCurrentSelectedBackground,currentOrderPosition,currentDefaultList);
                settingsRowCountTextField.value = updatedValue;
                updateUi(getNewCssClass(updatedValue));
                onSettingsScreenSuccess("Items Per Row Updated to "+updatedValue);
              }
              break;
          case "backgroundImageCount":
              if(result.startpagesettings.storedBackgroundImageCount !== updatedValue)
              {
                console.log("Updated BackgrondImage Count Settings");
                storeSettings(global_id,settingsRowCountLimit, updatedValue,settingsCurrentSelectedBackground,currentOrderPosition,currentDefaultList);
                settingsUpdateStoredBackgroundImageCountTextField.value = updatedValue;
                onSettingsScreenSuccess("Stored Background Image Count Updated to "+updatedValue);
              }
              break;
          case "DivOrderUpdate":
              if(result.startpagesettings.Order !== updatedValue)
              {
                console.log("Updated Order");
                storeSettings(global_id,settingsRowCountLimit, settingsBackgroundImageLimit,settingsCurrentSelectedBackground,updatedValue,currentDefaultList);
                onSettingsScreenSuccess("Updated Order to "+updatedValue);
              }
              break;
          case "currentDefaultList":
              if(result.startpagesettings.CurrentDefaultList !== updatedValue)
              {
                console.log("Updated DefaultList");
                storeSettings(global_id,settingsRowCountLimit, settingsBackgroundImageLimit,settingsCurrentSelectedBackground,currentOrderPosition,updatedValue);
                onSettingsScreenSuccess("Updated DefaultList to "+updatedValue);
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
    storeSettings(global_id, settingsRowCountLimit,settingsBackgroundImageLimit,settingsCurrentSelectedBackground,currentOrderPosition,currentDefaultList);
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
     storeSettings(global_id, settingsRowCountLimit,settingsBackgroundImageLimit,filename,currentOrderPosition,currentDefaultList);
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
      console.log(favouriteId);
      console.log(this.id);
      console.log(newPosition);
      var gettingFirstItem = browser.storage.local.get(favouriteId);
      gettingFirstItem.then((result) => {
        var objTest = Object.keys(result);
        document.getElementById(favouriteId).remove();
        console.log(result);
        console.log("URL: "+result.url);
        var id = result[favouriteId].id;
        var title = result[favouriteId].title;
        var url = result[favouriteId].url;
        var icon = result[favouriteId].icon;
        var iconColour = result[favouriteId].iconColour;
        var backgroundColour = result[favouriteId].backgroundColour;
        var text = result[favouriteId].text;
        var useTextNotIcon = result[favouriteId].useTextNotIcon;
        oldPosition = result[favouriteId].Order;
        updateFavourite(favouriteId,favouriteId,title,url,newPosition,icon,iconColour,backgroundColour,text,useTextNotIcon);
      }, onError);

      var gettingSecondItem = browser.storage.local.get(this.id);
      gettingSecondItem.then((result) => {
        var objTest = Object.keys(result);
        document.getElementById(this.id).remove();
        var id = result[this.id].id;
        var title = result[this.id].title;
        var url = result[this.id].url;
        var icon = result[this.id].icon;
        var iconColour = result[this.id].iconColour;
        var backgroundColour = result[this.id].backgroundColour;
        var text = result[this.id].text;
        var useTextNotIcon = result[this.id].useTextNotIcon;
        updateFavourite(this.id,this.id,title,url,oldPosition,icon,iconColour,backgroundColour,text,useTextNotIcon);
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
