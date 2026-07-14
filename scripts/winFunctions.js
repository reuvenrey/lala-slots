var enablePackage = false; // set to true when there's a common or premium win

// Game UI Elements
//const userConsole = document.getElementById('userConsole');
//const creditsDisplay = document.getElementById('creditsDisplay');

// 1. Check for common wins
function checkCommonWins(){
    enablePackage = false; // reset package chance
    var delayTime = 0;

    for(i=0; i<animationQueue.length; i++){
        let thisWin = animationQueue[i];
        if(thisWin.type == 'common'){ // check if type matches this function
            let thisWinningIndexes = thisWin.indexes;
            for(k=0;k<thisWinningIndexes.length;k++){ // number of winning indexes in this row
                document.getElementById('reel-'+thisWinningIndexes[k]+'-line-'+thisWin.row).classList.add('commonWin');
            }
            delayTime = 1;
            commonSound.currentTime = 0; commonSound.play();
            creditsAdd += Math.round(thisWin.payout*thisWinningIndexes.length*gameCost);
            enablePackage = true;
        }
    }

    setTimeout(() => {checkPremiumWins()}, delayTime*1000);
}

// 2. Check for Premium Wins
function checkPremiumWins(){
    var delayTime = 0;

    for(i=0; i<animationQueue.length; i++){
        let thisWin = animationQueue[i];
        if(thisWin.type == 'premium'){ // check if type matches this function
            let thisWinningIndexes = thisWin.indexes;
            for(k=0;k<thisWinningIndexes.length;k++){ // number of winning indexes in this row
                document.getElementById('reel-'+thisWinningIndexes[k]+'-line-'+thisWin.row).classList.add('premiumWin');
            }
            if(thisWin.symbol == 'skull'){
                let skullWinEffect = document.getElementById('skullWinGraphics');
                delayTime = 4;
                skullWin.currentTime = 0; skullWin.play();
                skullWinEffect.style.display = 'block'; //show skull win effect
                setTimeout(() => {skullWinEffect.style.display = 'none';}, 6000); // hide skull win effect
            }else{
                delayTime = 1;
                premiumWin.currentTime = 0; premiumWin.play();
            }
            creditsAdd += Math.round(thisWin.payout*thisWinningIndexes.length*gameCost);
            enablePackage = true;
        }
    }

    setTimeout(() => {checkForPackage()}, delayTime*1000);
}

// 3. Check for packages (to unlock added bonus)
function checkForPackage(){
    if(enablePackage){
        var delayTime = 0;
        var packageCount = [];

        for(i=0; i<reelContents.length; i++){
            let firstFour = reelContents[i].slice(0,visibleCount);
            for(k=0; k<visibleCount; k++){
                let temp = firstFour[k];
                if(temp == 'mysteryPackage'){
                    packageCount.push({col: i, row: k});
                }
            }
        }

        if(packageCount.length > 0){
            runPackageWin(packageCount);
        }else{
            setTimeout(() => {checkCathouseWins()}, delayTime*1000);
        }
    }else{
        setTimeout(() => {checkCathouseWins()}, 0);
    }
}

// 4. Check for CatHouse Wins
function checkCathouseWins(){
    var delayTime = 0;

    for(i=0; i<animationQueue.length; i++){
        let thisWin = animationQueue[i];
        if(thisWin.type == 'catHouse'){ // check if type matches this function
            let thisWinningIndexes = thisWin.indexes;
            /* Set initial cats
            for(k=0;k<thisWinningIndexes.length;k++){
                document.getElementById('reel-'+thisWinningIndexes[k]+'-line-'+thisWin.row).classList.add('catHouse ');
            }*/

            // Regenerate the winned rows
            let winnedRows = [];
            for(i=0; i<visibleCount;i++){
                let genRow = [];
                for(k=0;k<reelContents.length;k++){
                    let reel = reelContents[k];
                    genRow.push(reel[i]);
                }
                winnedRows.push(genRow);
            }

            // Count all cats on the board
            for(c=0; c<winnedRows.length;c++){
                let thisArray = winnedRows[c]; // get the row's symbols
                for(p=0;p<thisArray.length;p++){
                    let thisItem = itemSettings.find(symbol => symbol.name === thisArray[p]); // get this symbols winType
                    if(thisItem.winType == 'catHouse'){ // see if this symbol is a cat
                        document.getElementById('reel-'+p+'-line-'+c).classList.add('catHouse');
                        creditsAdd += Math.round(thisItem.payout*gameCost);
                    }
                }
            }

            delayTime = 1;
            catHouseWin.currentTime = 0; catHouseWin.play();
            premiumWin.currentTime = 0; premiumWin.play();
        }
    }

    setTimeout(() => {checkPuzzle()}, delayTime*1000);
}


// PACKAGE BONUS
function runPackageWin(packageCount){
    let packageWinContainer = document.getElementById('packageWinContainer');

    addMultiplierSound.play();
    packageWinContainer.classList.remove('hidden');

    // Choose the multiplier amount
    let random = Math.floor(Math.random() * 5);  // random number 0,1,2,3,4
    var randomFixed; 
    switch (random) {
        case 2:
            randomFixed = 3;
            break;
        case 3:
            randomFixed = 3;
            break;
        case 4:
            randomFixed = 4;
            break;
        default:
            randomFixed = 2;
            break;
    }
    console.log('Random og = ' +random+'. Random fixed: '+randomFixed);
    creditsAdd = creditsAdd*(randomFixed)*packageCount.length;

    // Play box shaking sounds
    setTimeout(() => {
        boxShaking.play();
    },500)

    // 
    setTimeout(() => {
        boostSound.play();
        packageWinContainer.classList.add('hidden');

        // Change package icons to multiplier
        for(i=0; i<packageCount.length; i++){
            let temp = packageCount[i];
            document.getElementById('reel-'+temp.col+'-line-'+temp.row).innerHTML = "<img src='graphics/multipliers/x"+randomFixed+".png' class='packageImage'>";
        }

    }, 3000);

    // Back to scoring
    setTimeout(() => {checkCathouseWins()}, 3500);
}

// SPECIAL WINS

    // 1. Check for puzzle pieces (and toggle puzzle win if > 9)
    function checkPuzzle(){
        var delayTime = 0;
        var thisCount = 0;

        // Find each puzzle piece, animate, and add sound
        for(i=0;i<specialWinQueue.length;i++){
            let thisItem = specialWinQueue[i];
            if(thisItem.item == 'puzzlePiece'){
                delayTime = 0.5; // add delay time for animation to play
                numPuzzlePiece += 1; // add one to puzzle piece count
                if(numPuzzlePiece <= 9){
                    // Add puzzle piece to tracker
                    setTimeout(() => {
                        document.getElementById('reel-'+thisItem.col+'-line-'+thisItem.row).classList.add('isPuzzlePiece');
                        var puzzleCounterDisp = '';
                        for(p=0; p<numPuzzlePiece; p++){
                            if(p == numPuzzlePiece-1){
                                puzzleCounterDisp += "<img src='graphics/symbols/puzzlePiece.png' class='newPuzzle'>";
                            }else{puzzleCounterDisp += "<img src='graphics/symbols/puzzlePiece.png'>";}
                        }
                        document.getElementById('puzzleCounterDisplay').innerHTML = puzzleCounterDisp;
                        uiBeep.currentTime = 0; uiBeep.play();
                    }, thisCount*200);
                    thisCount += 1; // variable to delay next puzzlePiece animation
                }
            }
        }

        if(numPuzzlePiece >= 9){// collected enough puzzle pieces
            runPuzzleBonus();
        }else{ // No Puzzle BOnus Yet
            if(delayTime != 0){puzzleCollect.currentTime = 0; puzzleCollect.play();}// play puzzlePieceFoundSound
            setTimeout(() => {checkLuckyCat()}, delayTime*1000);
        }  
    }// end of checkPuzzle()

        var puzzleAnim;
        function runPuzzleBonus(){
            // Initiate puzzle win
            numPuzzlePiece = 0;
            document.getElementById('puzzleCounterDisplay').innerHTML = '';
            document.getElementById('puzzleWinInstructions').classList.remove('hidden');
            puzzleStart.play();

            document.getElementById('puzzleWinContainer').classList.remove('hidden');

            // Animate puzzlePieces
            puzzleAnim = setInterval(() => {
                uiBeep.currentTime = 0; uiBeep.play();
                litePuzzle();
            },200);

            setTimeout(() => {gameMode='inPuzzle';},1000);
        }

        function endPuzzleBonus(){
            gameMode = 'waiting';

            // Slow Animation
            clearInterval(puzzleAnim);
            let delayTime = 200;
            let random = Math.floor(Math.random() * 5) + 3;  // random number 3,4,5,6
            for(i=1; i<=random; i++){
                let delay = i*i;

                if(i != random){
                    // Play slower animation
                    setTimeout(() => {
                        uiBeep.currentTime = 0; uiBeep.play();
                        litePuzzle();
                    },delayTime*delay);
                }else{
                    // Stop Animation
                    setTimeout(() => {
                        puzzleEnd.play();
                        // Add the winnings to the user's total winnings
                        creditsAdd += Math.round(puzzleIter*gameCost);
                        // Highlight final multiplier
                        let div = document.getElementById('piecesDiv');
                            div.innerHTML = '';
                        for(l=1; l<=9; l++){
                            let thisMultiplier = l;
                            if(l == puzzleIter){
                                div.innerHTML += "<div><img src='graphics/symbols/puzzlePiece.png' class='isFinal'><h1>x"+thisMultiplier+"</h1></div>";
                            }else{
                                div.innerHTML += "<div><img src='graphics/symbols/puzzlePiece.png'><h1>x"+thisMultiplier+"</h1></div>";
                            }
                        }
                        // Close Puzzle Window, move on to next check
                        setTimeout(() => {
                            checkLuckyCat();
                            document.getElementById('puzzleWinInstructions').classList.add('hidden');
                            document.getElementById('puzzleWinContainer').classList.add('hidden');
                        },3000)
                    }, delayTime*delay);
                }
                
                
            }

        }// end of endPuzzleBonus()

        var puzzleIter = 1;
        function litePuzzle(){
            let div = document.getElementById('piecesDiv');
            div.innerHTML = '';
            for(i=1; i<=9; i++){
                let thisMultiplier = i;
                if(i == puzzleIter){
                    div.innerHTML += "<div><img src='graphics/symbols/puzzlePiece.png' class='isLit'><h1>x"+thisMultiplier+"</h1></div>";
                }else{
                    div.innerHTML += "<div><img src='graphics/symbols/puzzlePiece.png'><h1>x"+thisMultiplier+"</h1></div>";
                }
            }
            puzzleIter += 1; if(puzzleIter > 9){puzzleIter = 1;}
        }// end of litePuzzle

    function checkLuckyCat(){
        var delayTime = 0;
        setTimeout(() => {checkSuperWinner()}, delayTime*1000);
    }




// LAST CHECK - superrrr winahhhhhh (over x2 multiplier)
function checkSuperWinner(){
    var delayTime = 0;

    //Check multipler, super winner = multiplier > 2
    if(creditsAdd > 2*gameCost){
        // SUPPPERRRR WINNAHHHHHH
    }

    setTimeout(() => {finishAnimations()}, delayTime*1000);
}


//FINAL. Reset interface once animations are done
function finishAnimations(){
    allowInput = true;
    gameMode = 'idle';
    
    // Super Winner
    if(creditsAdd >= 1000){
        superWinSfx.play();
        document.getElementById('userConsole').innerHTML = "Super Winner!! 🤯";
        document.getElementById('superWinnerGraphic').style.display = 'block';
        setTimeout(() => {document.getElementById('superWinnerGraphic').style.display = 'none';},1000);
    }

    // Add winnings to users credits
    if(creditsAdd != 0){
        document.getElementById('userConsole').innerHTML = "Congrats! 🥳";
        let winMultipler = (creditsAdd/gameCost);
        gameCredits += creditsAdd;
        totalWinnings = +totalWinnings + +creditsAdd; localStorage.setItem('totalWinnings', totalWinnings); //+ operator converts string to number
        document.getElementById('lastWinDisplay').innerHTML = "🌟 Last Win: +" + creditsAdd + " (x"+winMultipler+")";
        document.getElementById('creditsDisplay').innerHTML = "🪙" + gameCredits + " credits";
        
        // Play the winCoin animation (total earnings display)
        winCoins(creditsAdd);

    }else{// User wins nothing
        userConsole.innerHTML = "Better luck next time";
        allowInput = true;
        gameMode = 'idle';
        roundsSinceLastWin += 1; console.log('Rounds since last win = '+roundsSinceLastWin);
        if(autoSpin){spinReels();}
    }
}