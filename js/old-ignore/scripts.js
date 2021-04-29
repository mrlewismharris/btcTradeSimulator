console.log("hello");


// Code for menu toggle height switch (should be done in pure css for non-js device compatibility)
// Declare Global Document Variables
let menuToggle = false; let btcUSD; let usdWallet; let btcWallet; let currency = "$"; let json;

if (getCookie("fiatWallet")) {
  fiatWallet = getCookie("fiatWallet");
} else {
  setCookie("fiatWallet", 1000);
}

// Event Listeners
document.getElementById("menuToggleContainer").addEventListener("click", function() {
  toggleMenu()
});

document.getElementById("pageContent").addEventListener("click", function() {
  if (menuToggle == true) {
    toggleMenu()
  }
});

//function for getting the JSON data with the XMLHttpRequest Javascript object
function getJSON(url){
    let http = new XMLHttpRequest();
    http.open("GET", url, false);
    http.send(null);
    return http.responseText;
}


// Get the currency from stored cookie - if it doesn't exist, create it
if (getCookie("currency") !== "") {
  currency = getCookie("currency");
} else {
  setCookie("currency", currency);
}

// Simple function to add thousands seperator to an int (for money)
function addCentComma(num) {
  //split at the "."
  var splitNum = num.toString().split(".");
  //add the comma
  splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //join back together with the "."
  return splitNum.join(".");
}

function getJsonData() {
  return JSON.parse(getJSON("https://api.kraken.com/0/public/Ticker?pair=TBTCUSD,USDTGBP,USDTEUR"));
}
json = getJsonData();

//a function to update the bitcoin price
function updatePrice() {
  
  document.getElementById("btcPriceCurrency").innerHTML = currency;
  
  let btcUsdHigh = json.result.TBTCUSD.a[0];
  let btcUsdlow = json.result.TBTCUSD.b[0];
  let usdGbp = json.result.USDTGBP.a[0];
  let usdEur = json.result.USDTEUR.a[0];
  
  let btcGbpHigh = btcUsdHigh * usdGbp;
  let btcGbpLow = btcUsdlow * usdGbp;
  let btcEurHigh = btcUsdHigh * usdEur;
  let btcEurLow = btcUsdlow * usdEur;
  
  let elBtcHigh = document.getElementById("btcPriceHigh");
  let elBtcLow = document.getElementById("btcPriceLow");
  let price = "";
  switch (currency) {
    case "£":
      elBtcHigh.innerHTML = addCentComma(btcGbpHigh.toFixed(2));
      elBtcLow.innerHTML = addCentComma(btcGbpLow.toFixed(2));
      break;
    case "$":
      elBtcHigh.innerHTML = addCentComma(parseInt(btcUsdHigh).toFixed(2));
      elBtcLow.innerHTML = addCentComma(parseInt(btcUsdlow).toFixed(2));
      break;
    case "€":
      elBtcHigh.innerHTML = addCentComma(btcEurHigh.toFixed(2));
      elBtcLow.innerHTML = addCentComma(btcEurLow.toFixed(2));
      break;
  }
}

updatePrice();

document.getElementById("btcPriceContainer").addEventListener("click", function() {
  switch (currency) {
    case "$":
      currency = "£";
      setCookie("currency", "£");
      updatePrice();
      break;
    case "£":
      currency = "€";
      setCookie("currency", "€");
      updatePrice();
      break;
    case "€":
      currency = "$";
      setCookie("currency", "$");
      updatePrice();
      break;
  }
});

let refreshVal = 100; let lastHighValue; let lastLowValue;
// Refresh Countdown Bar loop
function loop() {
  window.setTimeout(function() {
    if (refreshVal == 0) {
      json = getJsonData();
      updatePrice();
      refreshVal = 100;
      //do a flash when there's an update (only on change)
      if (document.getElementById("btcPriceHigh").innerHTML !== lastHighValue) {
        let originalColor = document.getElementById("btcPriceHigh").style.color;
        document.getElementById("btcPriceHigh").style.color = "#fff";
        window.setTimeout(function() {document.getElementById("btcPriceHigh").style.color = originalColor;}, 500);
      }
      if (document.getElementById("btcPriceLow").innerHTML !== lastLowValue) {
        let originalColor = document.getElementById("btcPriceLow").style.color;
        document.getElementById("btcPriceLow").style.color = "#fff";
        window.setTimeout(function() {document.getElementById("btcPriceLow").style.color = originalColor;}, 500);
      }
    } else {
      lastLowValue = document.getElementById("btcPriceLow").innerHTML;
      lastHighValue = document.getElementById("btcPriceHigh").innerHTML;
      refreshVal = refreshVal - 10;
    }
    document.getElementById("refreshBar").style.width = refreshVal + "%";
    document.getElementById("refreshCountdown").innerHTML = refreshVal / 10;
    loop();
  }, 1000);
}
loop();

// Global Functions
function toggleMenu() {
  if (menuToggle == false) {
    menuToggle = true;
    document.getElementById("menuOpenButton").style.opacity = 0;
    document.getElementById("menuCloseButton").style.opacity = 1;
    document.getElementById("hiddenMenu").style.left = "0%";
  } else {
    menuToggle = false;
    document.getElementById("menuOpenButton").style.opacity = 1;
    document.getElementById("menuCloseButton").style.opacity = 0;
    document.getElementById("hiddenMenu").style.left = "-100%";
  }
}