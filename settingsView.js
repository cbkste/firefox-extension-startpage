// var importDataIcon = document.querySelector('.import-data-icon');
// var exportDataIcon = document.querySelector('.export-data-icon');
// var importDataOverlay = document.querySelector('.import-list-overlay-container');
// var importDataOverlayClose = document.querySelector('.import-list-overlay-box-close');
// var importDataBtn = document.querySelector('input[id="ImportListBtn"]');
//
//         var showImportFileSelector = function () {
//           importDataOverlay.setAttribute("style","display:block");
//         };
//
//         var closeImportOverlay = function () {
//           importDataOverlay.setAttribute("style","display:none");
//         };
//
//         var exportData = async function () {
//           var settingsData = await getSettings();
//           //var favouritesData = await getFavouritesData();
//           download(settingsData, 'filename.txt');
//         };
//
//         var getSettings = function (){
//           return new Promise(resolve => {
//              var settingsAray = [];
//              var gettingSettingsItem = browser.storage.local.get("startpagesettings");
//             gettingSettingsItem.then(async (result) => {
//               var objTest = Object.keys(result);
//                 if(objTest.length < 1) {
//                   console.log("Settings Not Found");
//                   //storeSettings("10", "4","6","","1");
//                 } else {
//                   var myString = "2";
//                   //settingsAray.push("##**SETTINGS**##");
//                   settingsAray.push("ID:"+result.startpagesettings.id);
//                   settingsAray.push("storedBackgroundImageCount:"+result.startpagesettings.storedBackgroundImageCount);
//                   settingsAray.push("RowCount:"+result.startpagesettings.RowCount);
//                   settingsAray.push("SelectedBackgroundImage:"+result.startpagesettings.SelectedBackgroundImage);
//                   settingsAray.push("Order:"+result.startpagesettings.Order);
//                 }
//                 console.log("Returning array");
//                 resolve(settingsAray);
//             });
//           });
//         }
//
//
//         var download = function (settingsAray, favouritesArray, strFileName) {
//           	var csvContent = "data:text/csv;charset=utf-8,";
//
//             for (var i = 0; i < settingsAray.length; i++) {
//               dataString = settingsAray[i];
//               csvContent += dataString+ "\r\n";
//             }
//
//             for (var i = 0; i < favouritesArray.length; i++) {
//               dataString = favouritesArray[i];
//               csvContent += dataString+ "\r\n";
//             }
//
//         //TODO: Handle other special characters
//           csvContent = csvContent.replace(/\#/g, "%23")
//           var encodedUri = encodeURI(csvContent);
//           window.open(encodedUri);
//         }
//
//         var importFromFileSelector = function (){
//           var selectedFile = document.getElementById('importFileSelector').files[0];
//           console.log(selectedFile);
//           var reader = new FileReader();
//           reader.readAsText(selectedFile);
//           reader.onload = function(event) {
//             var listOfEntries = [];
//             var settings = [];
//             var listOfFavourites = [];
//             arrayOfLines = event.target.result.match(/[^\r\n]+/g);
//             for (var i = 0; i < arrayOfLines.length; i++) {
//               console.log("LINE: "+arrayOfLines[i]);
//             }
//           };
//         };
//
//         var bindEventListeners = function () {
//             importDataIcon.addEventListener('click', showImportFileSelector);
//             importDataOverlayClose.addEventListener('click', closeImportOverlay);
//             importDataBtn.addEventListener('click', importFromFileSelector);
//             exportDataIcon.addEventListener('click', exportData);
//         };
//
//         return {
//             showImportFileSelector: showImportFileSelector,
//             closeImportOverlay: closeImportOverlay,
//             importFromFileSelector: importFromFileSelector,
//             exportData: exportData,
//             getSettings: getSettings,
//             download: download,
//             bindEventListeners: bindEventListeners
//         };
