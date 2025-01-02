function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const toggleIcon = document.querySelector('.toggle-icon');
  const toggleText = document.querySelector('.dark-mode-switch span');
  if (document.body.classList.contains('dark-mode')) {
    toggleIcon.textContent = '🌙';
    toggleText.textContent = 'Dark Mode';
    localStorage.setItem('darkMode', 'enabled');
    console.log("dark mode")
  } else {
    toggleIcon.textContent = '☀️';
    toggleText.textContent = 'Light Mode';
    localStorage.setItem('darkMode', 'disabled');
    console.log("light mode")
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.add('hidden');
}

function initializePage() {
  hideLoadingScreen();
  const darkMode = localStorage.getItem('darkMode');
}

function CheckDarkMode() { //Runs every few seconds and updatss the page with the new mode if its changed. 
    if (localStorage.getItem('darkMode') === "enabled") {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    //Check if the user has clicked a button to redirect
    if (localStorage.getItem('Redirect')) {
        window.location.href = "C:/Users/hush3/Documents/Websites/FortniteLocker/" + localStorage.getItem('Redirect') + ".html";
        localStorage.setItem("Redirect", "")
    }
}

setInterval(CheckDarkMode, 200); //Adjusting the second value changes the wait time of the function.
