//Set at the top of the script to make the value global
var SetItems = [];
var OnScreen = [];

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const toggleIcon = document.querySelector('.toggle-icon');
  const toggleText = document.querySelector('.dark-mode-switch span');
  if (document.body.classList.contains('dark-mode')) {
    toggleIcon.textContent = '🌙';
    toggleText.textContent = 'Dark Mode';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    toggleIcon.textContent = '☀️';
    toggleText.textContent = 'Light Mode';
    localStorage.setItem('darkMode', 'disabled');
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.add('hidden');
}

function initializePage(Page="index") {
  //Determine Theme(mode) for site
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    const toggleIcon = document.querySelector('.toggle-icon');
    const toggleText = document.querySelector('.dark-mode-switch span');
    toggleIcon.textContent = '🌙';
    toggleText.textContent = 'Dark Mode';
  }
  
  //Generate locker items
  const APIkey = "52f20fd0-d9c2-4cd0-8362-80d95cc2bfff"
  ValidImgs = [];
  
  if (Page == "Locker") {
    //Get items from shop (for now this is how random generation is done)
    //!! SAVED FOR FUTURE REFERNCE "https://fnbr.co/api/images?search="+value+"&type=outfit"
    fetch("https://fnbr.co/api/shop", {method: "GET", headers: {"x-api-key": APIkey}}) //, "search":"ghoul trooper" | &type=outfit
    .then(function(response) { return response.json(); })
    .then(function(json) {
      json["data"]["featured"].forEach(function(item) { //Go through all the items in the shop
        if (item["images"]["gallery"] !== false) { //if the item has a gallery image
          ValidImgs.push({"id":item["id"], "image":item["images"]["gallery"], "price":item["price"]});
        } 
      });
      
      for (let i = 1; i < 7;) { //Repeat 6 times to create the locker.
        if (i % 2 !== 0) {var container = document.querySelector("#Row"+String(i))} //If the item is an odd number (i = 1, 3, 5)

        var item = ValidImgs[Math.floor(Math.random()*ValidImgs.length)];
        if (OnScreen.indexOf(item["id"]) == -1) { //If item not on screen
          CreateImg("Locker"+String(i), item["image"], item["id"], container);
          OnScreen.push(item["id"])
          i++;
        }
      }
    })
  }
  hideLoadingScreen();
}

//
function Select(event) {
  event.target.setAttribute("class", "locked");
  
  OnScreen = []; //Refreshing items so these lists become the same briefly
  for (let i = 1; i < 7;) {
    if (i % 2 !== 0) {var container = document.querySelector("#Row"+String(i))} //If the item is an odd number (i = 1, 3, 5)|This is still important, in the event a new image is selected but is in use.
    
    container.childNodes.forEach(function(btn){ //Iterate through all the buttons.
      if (btn.id !== undefined){ //If child is actualy a button and not the div
        if (btn.classList["value"] == ""){//if child isn't "locked"
          var NewImg = ValidImgs[Math.floor(Math.random()*ValidImgs.length)]; //Select a new image
          if (OnScreen.indexOf(btn.alt) == -1) {//If new image isn't already on screen
            btn.setAttribute("src", NewImg["image"]) //Change the image displayed to a new one.
            i++ //Proceed to next child (increase by 1 because 2 per row)
          } //else loop and retry with new image, do not change i (the loop number)
        } else {//If child has the "locked" class, skip it
          i++ //increase by one as there are 2 items in each row
        }
        OnScreen.push(btn.alt) //Always add child to the list of items on screen
      }
    });
  }
}

function CreateImg(id, img, alt, container){
  //Display the image as a button
  var btn = document.createElement("input");
  btn.setAttribute("type", "image");
  btn.setAttribute("src", img); //The images that's displayed
  btn.setAttribute("alt", alt) //The ID of the image that's used by the API
  btn.setAttribute("name", "saveForm");
  btn.setAttribute("id", id); //The ID used by this backend
  btn.setAttribute("width", "40%") //Changing this changes the size of the widgets
  btn.addEventListener('click', Select)
  container.appendChild(btn);

}