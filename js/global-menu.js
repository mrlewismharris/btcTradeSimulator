let menuToggle = false;

function toggleMenu() {
  if (menuToggle == false) {
    menuToggle = true;
    document.getElementById("menuOpenButton").style.opacity = 0;
    document.getElementById("menuCloseButton").style.opacity = 1;
    document.getElementById("hiddenMenu").style.left = "0%";
    document.getElementById("bodyBlocker").classList.remove("novisible");
  } else {
    menuToggle = false;
    document.getElementById("menuOpenButton").style.opacity = 1;
    document.getElementById("menuCloseButton").style.opacity = 0;
    document.getElementById("hiddenMenu").style.left = "-100%";
    document.getElementById("bodyBlocker").classList.add("novisible");
  }
}

// Event Listeners
document.getElementById("menuToggleContainer").addEventListener("click", function() {
  toggleMenu();
});

//clicking the body blocker element should close the menu
document.getElementById("bodyBlocker").addEventListener("click", function() {
  if (menuToggle == true) {
    toggleMenu();
  }
});