// Function that shuffles a given array -> shuffle(arrayName)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// This creates an array with the same length as itemSettings using the designated frequencies:
function buildReel() {
    const reel = [];

    for (let i = 0; i < itemSettings.length; i++) {
        for (let j = 0; j < itemSettings[i].frequency; j++) {
            reel.push(itemSettings[i].name); // store index of symbol
        }
    }

    return reel;
}

// Function that runs when the user wins credits
var startValue;
function winCoins(amount) {
    startValue = totalWinnings - amount;
    console.log("Adding " + amount + '\nCredits end value = ' + startValue);

    var divAmount;

    if(amount >= 1000){
        divAmount = 50;
    } else if (amount > 500) {
        divAmount = 30;
    } else if (amount > 200) {
        divAmount = 20;
    } else if (amount > 100) {
        divAmount = 10;
    } else {
        divAmount = 1;
    }

    const chunk = Math.floor(amount / divAmount);
    startValue += amount - (chunk * divAmount); // add remainder

    for (let i = 0; i < divAmount; i++) {
        let index = i;
        setTimeout(() => {addCoinIndividual(chunk);}, index*100);
    }
}

    function addCoinIndividual(addNumber) {
        startValue += addNumber;
        document.getElementById('totalWinnedCreditsDisplay').innerHTML = "$" + formatNumber(startValue/creditToDollar);
        insertCoinSound.currentTime = 0;
        insertCoinSound.play();
    }

// Formats numbers in 000,000.00 format.
function formatNumber(number) {
    return number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// WIN CALCULATIONS

    // Run this function to read each row and find if there's any winning symbols - outputs {symbol: 'name', indexes:[]}
    // This is run at the end of finishSpinning()
    function getWinningRow(row) {
        const positions = {};

        for (let i = 0; i < row.length; i++) {
            const symbol = row[i];

            if (!positions[symbol]) {
                positions[symbol] = [];
            }

            positions[symbol].push(i);
        }

        // Find the first symbol that appears 3 or more times
        for (const symbol in positions) {
            if (positions[symbol].length >= 3) {
                return {
                    symbol: symbol,
                    indexes: positions[symbol]
                };
            }
        }

        // Output: {symbol: 'name', indexes:[1,2,3]} 
        // If nothing:
        return null;
    }

// Function that runs when the debug menu is opened
function openDebugMenu(){
    let lProfit = (totalEarnings-totalWinnings)/creditToDollar;
    document.getElementById('inOutData').innerHTML = "<li>Lifetime Gross Earnings: <span style='color:lime'>$"+ totalEarnings/creditToDollar + "</span></li>\
        <li>Lifetime Gross Payout: <span style='color:orange'>$"+ totalWinnings/creditToDollar + "</span></li>\
        <li>Lifetime Profit: <b>$"+lProfit.toFixed(2)+"</b></li>\
        <li>Payout/Win Ratio: <b>"+ ((totalWinnings/totalEarnings)*100).toFixed(2) + "%</b> ($1 earnings = $"+(totalWinnings/totalEarnings).toFixed(2)+" paid out)</li>";
    
    // Setup dropdown to select which row to apply debug to
    let selectRowNum = document.getElementById('selectRowNumDiv'); selectRowNum.innerHTML = '';
    for(i=0; i<visibleCount; i++){
        let seeAm = i+1;
        selectRowNum.innerHTML += "<option value='"+i+"'>Row "+seeAm+"</option>";
    }

    // Setup inputs to select items for debug
    let debugRow = document.getElementById('setRowDiv'); debugRow.innerHTML = '';
    for(i=0; i<reelContents.length; i++){
        debugRow.innerHTML += "<select id='column-"+i+"'></select>";
        let thisCol = document.getElementById('column-'+i);
        for(k=0; k<itemSettings.length; k++){
            let thisItem = itemSettings[k];
            thisCol.innerHTML += "<option value='"+thisItem.name+"'>"+thisItem.name+"</option>";
        }
    }

    document.getElementById('debugMenu').style.display = 'flex';
}

    function applyDebugRow(){
        let setItemArray = [];
        for(i=0; i<5; i++){
            let thisCol = document.getElementById('column-'+i);
            setItemArray[i] = thisCol.value;
        }

        debugValues = {
            row: document.getElementById('selectRowNumDiv').value,
            setItem: setItemArray
        }

        debugMode = true;
        console.log('Set Debug Spin: ');
        console.log(debugValues);
        document.getElementById('userConsole').innerHTML = "🛠️ Debug Spin Active";
    }

// Setsup (or resets) the sparkling line indicators
function setupLineIndicators(){
    let indicatorWindow = document.getElementById('lineIndicators');
    indicatorWindow.innerHTML  = ''; // reset

    for(i=0;i<visibleCount;i++){ // add indicator to each row
        indicatorWindow.innerHTML += "<div id='indicator-"+i+"' class='lineIndicatorRow'></div>";
    }
}