/* Key press functions (simple functions to run on key press). 
More complex functions (like spinning reels) take place in the game manager but
are called in the event listener below */

// Event Listener - add 'else if' when needing a new key
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "k") {
        console.log ('User pressed K -> Add Coin');
        addCoin();
    }else if(event.key.toLowerCase() === " "){
        console.log ('Space bar pressed');
        if(gameMode == 'idle'){
            spinReels();
        }else if(gameMode == 'inPuzzle'){
            endPuzzleBonus();
        }

    }
    else if(event.key.toLowerCase() === "m"){ // Open debug window
        console.log ('User pressed m -> debug window');
        if(document.getElementById('debugMenu').style.display == 'flex'){
            document.getElementById('debugMenu').style.display = 'none';
            shortBeep.play();
        }else{
            openDebugMenu();
            shortBeep.play();
        }
    }else if(event.key.toLowerCase() === "a"){ // Autospin toggle
        if(autoSpin){
            autoSpin = false;
            document.getElementById('userConsole').innerHTML = '🔂✖️ Auto Spin Disabled';
        }else{
            autoSpin = true;
            document.getElementById('userConsole').innerHTML = '🔂 Auto Spin Enabled';
        }
        shortBeep.play();
       
    }else if(event.key.toLowerCase() === "s"){ // DEBUG - set credits value
        creditsAdd = +prompt('Enter a credits value (integers only)','0');
        finishAnimations();
    }else if(event.key.toLowerCase() === "0"){ // Toggle ON-SCREEN controls
        let oscDiv = document.getElementById('oscDiv');
        if(oscDiv.style.display == 'block'){
            oscDiv.style.display = 'none';
        }else{
            oscDiv.style.display = 'block';
        }
    }
});

// This is the function that runs when k is pressed (or when a quarter is inserted)
function addCoin(){
    gameCredits += 25;
    document.getElementById('creditsDisplay').innerHTML = "🪙" + gameCredits + " credits";
    insertCoinSound.currentTime = 0;
    insertCoinSound.play();
}
