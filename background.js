/*
Open a new tab, and load "my-page.html" into it.
*/
//import {getFileStorage} from 'idb-file-storage/src/idb-file-storage';

function openMyPage() {
  console.log("injecting");
   browser.tabs.create({
     "url": "popup/startpage.html"
   });
}


/*
Add openMyPage() as a listener to clicks on the browser action.
*/
browser.browserAction.onClicked.addListener(openMyPage);
