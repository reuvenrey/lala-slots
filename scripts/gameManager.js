// Game UI Elements
const userConsole = document.getElementById('userConsole');
const creditsDisplay = document.getElementById('creditsDisplay');

// Game Manager Specific Variables

// Game Global Variables
allowInput = true; // if False -> System will not react to user input (except for addCoin)
gameMode = 'idle'; // Idle = waiting for spin, animation = animation is playing
debugMode = false; // If true, then the results of this spin will be predetermined
    debugValues = []; // this holds the requested debug values
playStyle = 1; // 1 -> playing horizontal lines only, 2 = horizontal & vertical lines
animationQueue = []; // Array of objects, animations queued to play {type: 'common', indexes:[1,2,3,]}
    specialWinQueue = []; // Array of SPECIAL wins in a round
creditsAdd = 0; // Amount of credits to add at the end of win calculations
visibleCount = 4; // number of rows that are visible in a reel
roundsSinceLastWin = 0; // how many games the user plays without a win being outputed.
autoSpin = false;
numPuzzlePiece = 0; // Counts how many puzzle pieces the user has collected


/* Other variables:
    gameCredits -> amount of remaining credits
    itemSettings -> name and frequency of each item
    reelContents -> all symbols on each reel (5 array objects)
*/

// MAIN GAMEPLAY - REELS
function spinReels(){
    if(allowCoins != true && gameCredits < gameCost){gameCredits = gameCost;} // if free play enabled, ensure there is enough coins
    if(allowInput == true && gameMode == 'idle' && gameCredits >= gameCost){ // Ensure game is ready for new spin
        // Credits
        gameCredits -= gameCost; 
        totalEarnings = +totalEarnings + +gameCost; localStorage.setItem('totalEarnings', totalEarnings);
        creditsDisplay.innerHTML ="🪙" +  gameCredits + " credits";
        userConsole.innerHTML = "-"+gameCost+" Credits, Spinning... ⌛";

        allowInput = false;
        gameMode = 'spinning';
        setupLineIndicators(); // reset the line indicators

        // Play background audio
        if(playAmbiance){ // Casino Ambiance SFX
            if(ambianceSound.paused){
                ambianceSound.volume = 0.5;
                ambianceSound.play();
            }
        }
        if(playMusic){ // Play Background Music

        }

        // Setup final results of each reel
        for(i=0;i<reelContents.length;i++){

            // Get current state of the reel
            const reel = reelContents[i];

            // Build a fresh deck to choose from
            const deck = buildReel();
            shuffle(deck);

            // 1. Pick 4 random items from this reel's deck
            const selectedItems = [];


            for (let k = 0; k < visibleCount; k++) {
                if(debugMode && k == debugValues.row){ // this row has a specific value predetermined
                    let tempArray = debugValues.setItem;
                    selectedItems.push(tempArray[i]);
                }else{
                    const randIndex = Math.floor(Math.random() * deck.length);
                    selectedItems.push(deck[randIndex]);
                }
            }

            // 2. Build the new reel (4 selected + rest of reel + 4 selected duplicated)
             const newStrip = [
                ...selectedItems,
                ...reel.slice(0, reel.length - 8),
                ...selectedItems
            ];

            // 3. Replace the old reel with the new one (only in code, not yet doing the HTML)
            reelContents[i] = newStrip;

            // 4. Initiate the reel's spin
            const index = i;
            setTimeout(() => spinReel(index), index * 200);

        }// end of for loop

        //5. reset debug
        debugMode = false;

        reelSpinning.play();

        var thisSpinTime = spinTime;
        if(autoSpin){thisSpinTime = thisSpinTime*spinTimeDecrease;} // shorten the spin time for autoSpins
        setTimeout(() => finishSpinning(), thisSpinTime*1000 + 200*5);

    }else if(gameCredits < gameCost){
        userConsole.innerHTML = "Not enough credits 💸";
    }
}// end of function spinReels()

    // Spin reel (starts spinning animation)
    function spinReel(index){
        var thisSpinTime = spinTime;
        if(autoSpin){thisSpinTime = thisSpinTime*spinTimeDecrease;} // shorten the spin time for autoSpins
        const thisReel = document.getElementById('reel-'+index);
        const reelParent = thisReel.parentElement;
        const reelHeight = thisReel.offsetHeight; // total height of reel
        const parentHeight = reelParent.clientHeight; // height of parent not including borders
        let travelDistance = reelHeight - parentHeight; // distance to travel
        // Reset position before animating
        thisReel.style.transition = "none";
        thisReel.style.transform = "translateY(0%)";
        //force reflow (important so animation triggers)
        thisReel.offsetHeight;
        //spin animation
        const itemHeight = thisReel.querySelector(".reelItem").offsetHeight;
        const totalShift = itemHeight * 4; // show next 4 items
        thisReel.style.transition = "transform "+thisSpinTime+"s ease-in-out";
        thisReel.style.transform = `translateY(${travelDistance}px)`;

        let ind = index;
        setTimeout(() => repopulateReel(ind), (thisSpinTime*1000)/2);
    }

    // Sets up the final results of the reel (call once it is already spinning)
    function repopulateReel(index){
        const thisReel = document.getElementById('reel-'+index);
        const reel = reelContents[index];
        thisReel.innerHTML = ""; // clear out the reel
        for(p=0;p<reel.length;p++){
            thisReel.innerHTML += "<div class='reelItem' id='reel-"+index+"-line-"+p+"'><img src='graphics/symbols/"+reel[p]+".png'></div>";
        }
    }

    // Once all reels are done spinning - check for wins, then play animations
    function finishSpinning(){
        reelSpinning.pause(); reelSpinning.currentTime = 0;
        animationQueue = []; // reset the animations queue
        specialWinQueue = []; // reset queue for special wins

        // CALCULATE WINS - NOTE: this is currently only setup for horizontal lines, possibly gonna add vertical lines in the future
            userConsole.innerHTML = "Calculating wins...";

            // 1. Setup the rows
            let winnedRows = [];
            for(i=0; i<visibleCount;i++){
                let genRow = [];
                for(k=0;k<reelContents.length;k++){
                    let reel = reelContents[k];
                    genRow.push(reel[i]);
                }
                winnedRows.push(genRow);
            }

            // 2. Check for wins
            for(i=0; i<winnedRows.length;i++){
                let result = getWinningRow(winnedRows[i]);
                if(result != null){
                    //console.log('Win in row ' + i);
                    let winningItem = itemSettings.find(symbol => symbol.name === result.symbol);
                    let thisWin = {row: i, type: winningItem.winType, symbol: result.symbol, indexes: result.indexes, payout: winningItem.payout};
                    
                    // Special wins don't score the same as common / premium
                    if(thisWin.type != 'special'){
                        animationQueue.push(thisWin);

                        // Activate this row's "line" so user can see where the win is
                        document.getElementById('indicator-'+thisWin.row).innerHTML = "<div></div>";

                        //console.log(thisWin);
                    }
                    
                }
            }

            //4. Check for SPECIAL wins! (not including mysteryPackage)
            for(i=0; i<reelContents.length;i++){
                let tempArray = reelContents[i].slice(0,visibleCount);
                for(k=0; k<tempArray.length; k++){
                    if(tempArray[k] == 'puzzlePiece'){
                        specialWinQueue.push({col: i, row: k, item: tempArray[k]});
                    }else if(tempArray[k] == 'luckyCat'){
                        specialWinQueue.push({col: i, row: k, item: tempArray[k]});
                    }
                }
            }

            // 3. if there are wins, send to scoring functions, otherwise end spin.
            if(animationQueue.length > 0){
                creditsAdd = 0; roundsSinceLastWin = 0;
                checkCommonWins(); // start with common wins (will cascade into other wins)
            }else {
                creditsAdd = 0; roundsSinceLastWin = 0;
                checkPuzzle(); // skip common wins, go straight to puzzle check
            }
    }


// Finish Setup
userConsole.innerHTML = 'Ready to SPIN';