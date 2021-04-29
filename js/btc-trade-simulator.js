// Code for menu toggle height switch (should be done in pure css for non-js device compatibility)
// Declare Global Document Variables
let btcUSDLow; let btcUSDHigh; let usdWallet; let btcWallet; let currency = "$";
//transaction history global vars
let transactions;

// Get the currency from stored cookie - if it doesn't exist, create it
if (getCookie("currency") !== "") {
  currency = getCookie("currency");
} else {
  setCookie("currency", currency);
}

//if the fiatwallet is not set, set it and give it £1000
if (getCookie("walletQuantityUSD")) {
  usdWallet = getCookie("walletQuantityUSD");
} else {
  //give the user $1000 to start
  setCookie("walletQuantityUSD", 1000);
}

//if the btc wallet is not set, set it as 0
if (!getCookie("walletQuantityBTC")) {
  usdWallet = setCookie("walletQuantityBTC", 0);
}

// Simple function to add thousands seperator to an int (for money)
function addCentComma(num) {
  //if num does not contain a "." add the ".00"
  if (String(num).indexOf(".") < 0) {
    num=num+".00";
  }
  //split at the "."
  var splitNum = num.toString().split(".");
  //add the comma
  splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //add extra 0 to decimal if it is only 1 number
  if (splitNum[1].length==1) {splitNum[1]+="0"}
  //join back together with the "."
  return splitNum.join(".");
}

//get the currency conversion of the USD -> specific currency
async function usdToCurrency(amount, localCurrency) {
  const apiData = await loadBitcoinAPI();
  //will return the total amount multiplied by conversion rate (i.e 1000 * 1.3 = 1300)
  if (currency == "£") {
    return amount * apiData.result.USDTGBP.a[0];
  } else if (currency == "€") {
    return amount * apiData.result.USDTEUR.a[0];
  } else {
    return amount;
  }
}

//update the wallets with the selected currency
async function updateWallets() {
  //easier access to DOM
  let fiatWalletView = document.getElementById("walletQuantityFiat");
  let btcWalletView = document.getElementById("walletQuantityBTC");
  
  //get the wallet data from the cookies
  usdWallet = getCookie("walletQuantityUSD");
  btcWallet = getCookie("walletQuantityBTC");
  
  fiatWalletView.innerHTML = "$" + addCentComma(usdWallet);
  btcWalletView.innerHTML = "₿ " + btcWallet;
  
}
updateWallets();

//load the json with an async function
async function loadBitcoinAPI() {
  const url = 'https://api.kraken.com/0/public/Ticker?pair=TBTCUSD,USDTGBP,USDTEUR';
	const response = await fetch(url);
	return response.json();
}

//a function to update the bitcoin price
async function updatePrice() {
  //get the api data
  const apiData = await loadBitcoinAPI();
  //set the currency in the view
  document.getElementById("btcPriceCurrency").innerHTML = currency;
  //get usdToCurrency of the setCookie currency
  const btcHigh = await usdToCurrency(apiData.result.TBTCUSD.a[0], currency);
  const btcLow = await usdToCurrency(apiData.result.TBTCUSD.b[0], currency);
  //set the view with the new values 
  document.getElementById("btcPriceHigh").innerHTML = addCentComma(parseFloat(btcHigh).toFixed(2));
  document.getElementById("btcPriceLow").innerHTML = addCentComma(parseFloat(btcLow).toFixed(2));
  //set the usdToBtcConversion variable for other functions
  btcUSDHigh = apiData.result.TBTCUSD.a[0];
  btcUSDLow = apiData.result.TBTCUSD.b[0];
  //update the user's wallets next
  updateWallets();
  updateBuyConversion();
  updateSellConversion();
}
updatePrice();

//listener for mouse up and down of the bitoin refresh button
document.getElementById("btcRefreshContainer").addEventListener("mousedown", () => {
  //visual indicator that the button has been clicked
  let originalBackgroundColour = document.getElementById("btcRefreshContainer").style.background;
  document.getElementById("btcRefreshContainer").style.background = "#99f";
  //returns to original colour after click (mouseup)
  document.getElementById("btcRefreshContainer").addEventListener("mouseup", () => {
    document.getElementById("btcRefreshContainer").style.background = originalBackgroundColour;
  });
  //if use holds and drags cursor, it doesn't get stuck as blue
  document.getElementById("btcRefreshContainer").addEventListener("mouseout", () => {
    document.getElementById("btcRefreshContainer").style.background = originalBackgroundColour;
  });
  updatePrice();
});

//listener for mouse up and down of the currency changing button on the high/low prices
document.getElementById("btcPriceContainer").addEventListener("mousedown", () => {
  //visual indicator that the button has been clicked
  let originalBackgroundColour = document.getElementById("btcPriceContainer").style.background;
  document.getElementById("btcPriceContainer").style.background = "#99f";
  //returns to original colour after click (mouseup)
  document.getElementById("btcPriceContainer").addEventListener("mouseup", () => {
    document.getElementById("btcPriceContainer").style.background = originalBackgroundColour;
  });
  //if use holds and drags cursor, it doesn't get stuck as blue
  document.getElementById("btcPriceContainer").addEventListener("mouseout", () => {
    document.getElementById("btcPriceContainer").style.background = originalBackgroundColour;
  });
});

//onclick event for looping through the different currencies
document.getElementById("btcPriceContainer").addEventListener("click", () => {
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
function countdownLoop() {
  window.setTimeout(function() {
    if (refreshVal == 0) {
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
    countdownLoop();
  }, 1000);
}
countdownLoop();

//event listener for sending max usd to buy btc input
document.getElementById("addMaxBuy").addEventListener("click", async () => {
  //calculate the max usd the user can use with their usdWallet
  document.getElementById("inputBtcTransactionBuy").value = usdWallet;
  updateBuyConversion();
});

//event listener for sending max bitcoin to sell btc input
document.getElementById("addMaxSell").addEventListener("click", async () => {
  //calculate the max btc the user can sell with their btcWallet
  document.getElementById("inputBtcTransactionSell").value = btcWallet;
  updateSellConversion();
});

//sets the DOM input as a Float Only - use with a text inputs "input" event listener
function floatOnly(domObj) {
  let input = domObj;
  //set the allowed characters
  let allowedChars = "1234567890.";
  //loop through all the input's value characters...
  for (i=0;i < input.value.length;i++) {
    let allowed = false;
    //...loop through all the characters in the allowedChars...
    for (j=0;j < allowedChars.length;j++) {
      //...compare the input characters to the allowed characters to determine if it's an integer or a "."
      if (input.value[i] == allowedChars[j]) {
        //set the allowed var to true if the character is an int or "."
        allowed = true;
      }
    }
    //if the character wasn't an int or "." then remove it from the input
    if (!allowed) {
      input.value = input.value.substring(0, [i]);
    }
  }
}

//event listener for buying bitcoin
document.getElementById("buyBtcButton").addEventListener("click", async () => {
  let btcBuy = document.getElementById("inputBtcTransactionBuy").value;
  //check that the value entered is not empty, less than 0, or more than the usd wallet
  if (btcBuy == "" || btcBuy < 0 || btcBuy > usdWallet) {
    document.getElementById("instantBuyBtcErrorText").innerHTML = "Amount must not be empty, less than 0, or more than your wallet amount.";
    document.getElementById("instantBuyBtcError").classList.remove("novisible");
  } else {
    buyBtc(btcBuy);
  }
});

//event listener for selling bitcoin
document.getElementById("sellBtcButton").addEventListener("click", async () => {
  let btcSell = document.getElementById("inputBtcTransactionSell").value;
  //check that the value entered is not empty, less than 0, or more than the btc wallet
  if (btcSell == "" || btcSell < 0 || btcSell > btcWallet) {
    document.getElementById("instantSellBtcErrorText").innerHTML = "Amount must not be empty, less than 0, or more than your wallet amount.";
    document.getElementById("instantSellBtcError").classList.remove("novisible");
  } else {
    sellBtc(btcSell);
  }
});

let closeButtonList = document.getElementsByClassName("closeButton");
for (i=0;i < closeButtonList.length;i++) {
  closeButtonList[i].addEventListener("click", function() {
    this.parentElement.classList.add("novisible");
  });
}

document.getElementById("inputBtcTransactionBuy").addEventListener("input", function(e) {
  floatOnly(e.target);
  updateBuyConversion();
});

document.getElementById("inputBtcTransactionSell").addEventListener("input", function(e) {
  floatOnly(e.target);
  updateSellConversion();
});

async function updateBuyConversion() {
  let amountToConvertBuy = document.getElementById("inputBtcTransactionBuy").value;
  if (amountToConvertBuy == "") {amountToConvertBuy = 0}
  let btcBuyAmount = (amountToConvertBuy / btcUSDHigh).toFixed(8);
  document.getElementById("btcBuyConversionRate").innerHTML = `$${addCentComma(amountToConvertBuy)} = Aprox ₿ ${btcBuyAmount}`;
}

async function updateSellConversion() {
  let amountToConvertSell = document.getElementById("inputBtcTransactionSell").value;
  if (amountToConvertSell == "") {amountToConvertSell = 0}
  let btcSellAmount = (amountToConvertSell * btcUSDLow).toFixed(8);
  document.getElementById("btcSellConversionRate").innerHTML = `₿ ${amountToConvertSell} = Aprox $${addCentComma(parseFloat(btcSellAmount).toFixed(2))}`;
}

function buyBtc(usd) {
  if (usd <= usdWallet) {
    btcWallet = parseFloat(btcWallet) + parseFloat(usd / btcUSDHigh);
    usdWallet = usdWallet - usd;
    setCookie("walletQuantityUSD", usdWallet.toFixed(2));
    setCookie("walletQuantityBTC", btcWallet.toFixed(8));
    addToTransactionHistory(parseFloat(usd / btcUSDHigh), btcUSDHigh, "Buy");
    loadTransactionsTable();
    updateWallets();
  }
}

function sellBtc(btcToSell) {
  if (btcToSell <= btcWallet) {
    usdWallet = parseFloat(usdWallet) + parseFloat(btcToSell * btcUSDLow);
    btcWallet = btcWallet - btcToSell;
    setCookie("walletQuantityUSD", usdWallet.toFixed(2));
    setCookie("walletQuantityBTC", btcWallet.toFixed(8));
    addToTransactionHistory(btcToSell, btcUSDLow, "Sell");
    loadTransactionsTable();
    updateWallets();
  }
}

//Add details of each transaction to the transaction cookie
function addToTransactionHistory(quantity, price, type) {
  //create a new json object for the cookie
  let newTransaction = {"timestamp": Date.now(), "quantity": quantity, "price": price, "type": type};
  //declare cookie and set it as existing cookie data (only if cookie is previously set)
  let cookie = Array();
  if (getCookie("transactionHistory").length > 0) {
    cookie = JSON.parse(getCookie("transactionHistory"));
  }
  cookie.push(newTransaction);
  setCookie("transactionHistory", JSON.stringify(cookie));
  console.log(JSON.parse(getCookie("transactionHistory")));
}

//Load the transaction history and add to the DOM
function loadTransactionHistory() {
  if (getCookie("transactionHistory")!=="") {
    transactions = JSON.parse(getCookie("transactionHistory"));
  }
}

function loadTransactionsTable() {
  loadTransactionHistory();
  let tableContainer = document.getElementById("transactionsTableContainer");
  //clear the container inner html
  tableContainer.innerHTML = "";
  //generate the new table
  let table = document.createElement("table");
    table.className = "transactionsTable";
    table.setAttribute("cellspacing", "0");
  let tr = document.createElement("tr");
  //create an array with names of the headings to create th tags faster
  let headings = ["Timestamp", "Quant.", "BTC Price", "Type"];
  for (i=0;i<headings.length;i++) {
    let th = document.createElement("th");
    th.textContent = headings[i];
    tr.appendChild(th);
  }
  table.appendChild(tr);
  
  loadTransactionHistory();
  let reversedTransactions = "";
  if (transactions) {
    reversedTransactions = transactions.reverse();
  }
  for (i=0;i<reversedTransactions.length;i++) {
    let date = new Date(reversedTransactions[i]['timestamp'])
    let timestamp = document.createElement("td");
      timestamp.textContent = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let quantity = document.createElement("td");
      quantity.textContent = parseFloat(reversedTransactions[i]['quantity']).toFixed(6);
    let price = document.createElement("td");
      price.textContent = "$" + parseFloat(reversedTransactions[i]['price']).toFixed(2);
    let type = document.createElement("td");
      type.textContent = reversedTransactions[i]['type'];
    let row = document.createElement("tr");
      row.className = reversedTransactions[i]['type'].toLowerCase();
    row.appendChild(timestamp);
    row.appendChild(quantity);
    row.appendChild(price);
    row.appendChild(type);
    table.appendChild(row);
  }
  
  //add the table to the container
  tableContainer.appendChild(table);
}
loadTransactionsTable();

//expand and retract the transaction history table container
let expandTableButton = document.getElementById("transactionTableDropdownButton");
let tableContainer = document.getElementById("transactionsTableContainer");
expandTableButton.addEventListener("click", () => {
  if (tableContainer.classList == "") {
    tableContainer.classList.add("closed");
    expandTableButton.innerHTML = "► Expand Transaction Table";
  } else {
    tableContainer.classList.remove("closed");
    expandTableButton.innerHTML = "▼ Close Transaction Table";
  }
});


