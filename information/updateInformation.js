var iconInfomationIconNewFavourite = document.querySelector('#useIcons');

init()

function init(){
  createEventListner()
  console.log('GHELL')
}

function createEventListner(){
  iconInfomationIconNewFavourite.addEventListener('click', openIconInformationTab);
}

function openIconInformationTab(){
  console.log('Open Tab');
  var creating = browser.tabs.create({
     url:"../information/information.html"
   });
   creating.then(onCreated, onError);
}
