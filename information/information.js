function insertExampleIconUse(beastURLgen) {
  let iconContainer = document.querySelector('.icon-image-container');
  let iconImage = document.createElement("img");
  let beastURL = browser.extension.getURL(beastURLgen);
  iconImage.setAttribute("src", beastURL);
  iconImage.className = "icon-example-use grid-50";
  iconContainer.appendChild(iconImage);
}

insertExampleIconUse("information/icon-example-id.jpg");
insertExampleIconUse("information/icon-example.jpg");
