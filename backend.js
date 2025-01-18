//Set at the top of the script to make the value global
var SetItems = [];
const ValidImgs = [];

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
  
  if (Page == "Locker") {
    //Get items from shop (for now this is how random generation is done)
    //!! SAVED FOR FUTURE REFERNCE "https://fnbr.co/api/images?search="+value+"&type=outfit"
    var OnScreen = [];
    fetch("https://fnbr.co/api/shop", {method: "GET", headers: {"x-api-key": APIkey}}) //, "search":"ghoul trooper" | &type=outfit
    .then(function(response) { return response.json(); })
    .then(function(json) {
      json["data"]["featured"].forEach(function(item) { //Go through all the items in the shop
        if (item["images"]["gallery"] !== false) {ValidImgs.push({"id":item["id"], "image":item["images"]["gallery"], "price":item["price"]})}; //if the item has a gallery image
      });
      if (ValidImgs.length < 7){console.warn("Only "+ValidImgs.length+" Valid Images gotten from shop.")}
      
      for (let i = 1; i < 7;) { //Repeat 6 times to create the locker (1, 2, 3, 4, 5, 6, exits because i is no longer less then 7)
        if (i % 2 !== 0) {var container = document.querySelector("#Row"+String(i))}; //If the item is an odd number (i = 1, 3, 5)
        
        var item = ValidImgs[Math.floor(Math.random()*ValidImgs.length)];
        if (OnScreen.indexOf(item["id"]) == -1) { //If item not on screen
          var btn = document.createElement("input");
          btn = SetImg(btn, "Locker"+String(i), item["image"], item["id"]);
          container.appendChild(btn);
          OnScreen.push(item["id"])
          i++;
        }
      }
    })
  }
  hideLoadingScreen();
  console.log("Page Created")
}

//Functions runs when the images are selected
function Select(event) {
  if (event.target.classList["value"] == "") {//If the button triggering the event isn't locked
    event.target.setAttribute("class", "locked");//Lock the item 
    var OnScreen = []; //Reset items at the start of every loop
    var UnsetBtns = []; //^^

    console.log("---Locked Items:---") //Debugging Purposes
    for (let i = 1; i < 7;i+=2) {//Increasing by 2 because the rows are ordered by odd numbers
      var container = document.querySelector("#Row"+String(i)) //Get Div for that row
      container.childNodes.forEach(function(btn){ //Iterate through all the buttons.
        if (btn.id !== undefined){ //If child is actualy a button and not the div
          if (btn.classList["value"] == "") {UnsetBtns.push(btn)} //If child isn't "locked"
          else {
            console.log(btn.id, btn.src, btn.alt) //Debuggin Purposes
            OnScreen.push(btn.alt)} //If child has the "locked" class
        }
      });
    }

    console.log("---Unlocked Items:---") //Debugging Purposes
    UnsetBtns.forEach(function(btn){//Iterate through UnsetBtns and set them (must be done seperatly to avoid duplicates with locked items)
      ImgPicked = false; //New image for hte button isn't found 
      while (ImgPicked == !1) { //Loop until a new image is found
        var NewImg = ValidImgs[Math.floor(Math.random()*ValidImgs.length)]; //Select a new image
        if (OnScreen.indexOf(NewImg["id"]) == -1) {//If new image isn't already on screen
          console.log(btn.id, NewImg["image"], NewImg["id"]) //Debuggin Purposes
          SetImg(btn, btn.id, NewImg["image"], NewImg["id"]) //Change all the attributes of the image to match the new image
          OnScreen.push(btn.alt) //Add child to the list of items on screen
          ImgPicked = true; //Exit the loop because an unused image has been found
        }
      }
    });
    console.log("---END---\n") //Debuggin Puroses
  }
}
function SetImg(btn, id, img, alt){
  btn.setAttribute("type", "image");
  btn.setAttribute("src", img); //The images that's displayed
  btn.setAttribute("alt", alt) //The ID of the image that's used by the API
  btn.setAttribute("id", id); //The ID used by this backend
  btn.setAttribute("width", "40%") //Changing this changes the size of the widgets
  btn.addEventListener('click', Select)
  return btn
}