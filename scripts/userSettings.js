gameCredits = 0; // Starting amount of credits; 1 credits = 1 cent; Default = 0

creditToDollar = 100; // Number of credits to a single dollar (e.g. 100 -> 100 credits = 1 dollar); Default = 100

creditPerCoin = 100; // Number of credits to add when user enters a coin; Default = 25;

allowCoins = true; // false = free play; Default = true;

playMusic = true; // Allow background music during game play; Default = true;

playAmbiance = true; // Allow casino ambiance SFX during gameplay; Default = true;

spinTime = 2; // How long (in seconds) the reels will spin for; Default = 2;    

spinTimeDecrease = 0.75; // When AutoSpin enabled, the spinTime is decreased by this factor; Default = 0.75

stopOnWin = false; // True = autoSpin is not toggled when there's a win (but will resume after); Default = true;

gameCost = 100; // Cost of each spin (in credits); Default = 100

beNice = true; // Will increase chances of winning; Default = true;

// Item Settings -> Adjust settings for each item
/* 
    name -> name of the items png image file (name.png) remove .png
    frequency -> how many of these items are available in each reel (determines probabiltiy)
    winType -> common = standard multiplier bonus, premium = extra animation, special = bonus items (DO NOT ADJUST THESE)
    payout -> for common and premium items, determines the multiplier payout (PER item -> 3 bananas at 0.5 payout = 1.5 payout)
        ! Payout should not be less than .01 to prevent decimal credits
*/
itemSettings = [
    { name: "bananas", frequency: 5, winType: 'common', payout: 0.20  },
    { name: "strawberries", frequency: 6, winType: 'common', payout: 0.20  },
    { name: "rainbow", frequency: 6, winType: 'common', payout: 0.25  },
    { name: "coffeeMug", frequency: 5, winType: 'common', payout: 0.25 },
    { name: "cheeseFries", frequency: 4, winType: 'common', payout: 0.25},
    { name: "icecream", frequency: 4, winType: 'premium', payout: 0.6  },
    { name: "puppy", frequency: 3, winType: 'premium', payout: 0.6  },
    { name: "skull", frequency: 3, winType: 'premium', payout: 1  },
    { name: "remy", frequency: 3, winType: 'catHouse', payout: 0.7  },
    { name: "gingy", frequency: 3, winType: 'catHouse', payout: 0.8  },
    { name: "kitty", frequency: 2, winType: 'catHouse', payout: 1  },
    //{ name: "luckyCat", frequency: 2, winType: 'special' },
    { name: "mysteryPackage", frequency: 1, winType: 'special' },
    { name: "puzzlePiece", frequency: 1, winType: 'special' }
];