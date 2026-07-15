// Global Variables
reelContents = [];

totalWinnings = localStorage.getItem('totalWinnings'); // Total amount of winnings on machine's lifetime
if(totalWinnings == null){totalWinnings = 0; localStorage.setItem('totalWinnings', totalWinnings);}

totalEarnings = localStorage.getItem('totalEarnings'); // Total amount of money put into machine lifetime
if(totalEarnings == null){totalEarnings = 0; localStorage.setItem('totalEarnings', totalEarnings);}

// Setup UI
document.getElementById('totalWinnedCreditsDisplay').innerHTML = "$" + formatNumber(totalWinnings/creditToDollar);
document.getElementById('creditsDisplay').innerHTML ="🪙" +  gameCredits + " credits";
document.getElementById('userConsole').innerHTML = "Getting game ready...";
document.getElementById('costToPlayDisplay').innerHTML = "▶️ 1 Play = "+gameCost+" Credits";


// Setup Reels
const reelContainer = document.getElementById('reelContainer');

    for(i=0;i<5;i++){
        // Create the reel HTML element
        reelContainer.innerHTML += "<div class='column'><div class='reel' id='reel-"+i+"'></div></div>";

        // Populate the reel's pool of symbols
        const reel = buildReel();
        shuffle(reel);
        reelContents.push(reel);

        // Populate the reel with its symbols
        for(k=0; k<reel.length; k++){
            document.getElementById('reel-'+i).innerHTML += "<div class='reelItem' id='reel-"+i+"-line-"+k+"'><img src='graphics/symbols/"+reel[k]+".png'></div>";
        }
    }

// Setup the size and scale for the game window
function resizeGame() {
    const scale = Math.min(
        window.innerWidth / 1080,
        window.innerHeight / 1920
    );

    const game = document.getElementById("gamePageContainer");
    game.style.transform = `scale(${scale})`;
}

// Setup CATHOUSE Graphics
let catHouseGraphic = document.getElementById('catHouseGraphics');

for(i=0; i<4*10; i++){
    let rando = Math.floor(Math.random() * 10); // random number between 0 and 9
    if(rando == 0 || rando == 9){catHouseGraphic.innerHTML += "<div><img src='graphics/realisticCats/gingy.png'></div>";}
    else if(rando == 1 || rando == 8){catHouseGraphic.innerHTML += "<div><img src='graphics/realisticCats/remy.png'></div>";}
    else if(rando == 2 || rando == 7){catHouseGraphic.innerHTML += "<div><img src='graphics/realisticCats/kitty.png'></div>";}
    else if(rando == 3 || rando == 6){catHouseGraphic.innerHTML += "<div><img src='graphics/realisticCats/dancingCat.gif'></div>";}
    else{catHouseGraphic.innerHTML += "<div></div>";}

}
//<div><img src='graphics/realisticCats/gingy.png'></div><div><img src='graphics/realisticCats/remy.png'></div>
window.addEventListener("resize", resizeGame);
resizeGame();

// Finish Setup
userConsole.innerHTML = 'Ready to SPIN';