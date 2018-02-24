function insertExampleIconUse() {
  let iconImage = document.createElement("img");
  let beastURL = browser.extension.getURL("information/icon-example.jpg");
  iconImage.setAttribute("src", beastURL);
  iconImage.className = "icon-example-use grid-100";
  document.body.appendChild(iconImage);
}

insertExampleIconUse();
