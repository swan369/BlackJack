"use strict";
let players = [];
let activePlayer = 0;
let multiPlayerMode = false;
let bettingMode = false;
let dealHitStayMode = false;
let hitStay = false;
let hitStayRound = 1;
let dealerTurn = false;
let endGame = false;
let playingContinue = false;
let continueMode = true;

const output = document.querySelector("#output-div");
const dealBtn = document.querySelector("#deal-button");
const stayBtn = document.querySelector("#stay-button");
const hitBtn = document.querySelector("#hit-button");
const restartBtn = document.querySelector("#restart-button");

// Deal button click --> function
dealBtn.addEventListener("click", function () {
  let result = main("d");
  output.innerHTML = result;
});
// Stay button click --> function
stayBtn.addEventListener("click", function () {
  let result = main("s");
  output.innerHTML = result;
});
// Hit button click --> function
hitBtn.addEventListener("click", function () {
  let result = main("h");
  output.innerHTML = result;
});
// Restart button click --> function
restartBtn.addEventListener("click", function () {
  let result = main("");
  output.innerHTML = result;
});

// //Create makeDeckF function
const makeDeck = function () {
  const deckCards = [];
  // console.log(deckCards);
  const suits = ["diamonds", "clubs", "hearts", "spades"];
  const faces = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"];
  for (let suitsIndex = 0; suitsIndex < suits.length; suitsIndex += 1) {
    let suit = suits[suitsIndex];

    for (let facesIndex = 0; facesIndex < faces.length; facesIndex++) {
      let face = faces[facesIndex];
      let rank;

      if (face == "ace") {
        rank = 11;
      } else if (face == "jack" || face == "queen" || face == "king") {
        rank = 10;
      } else {
        rank = face;
      }
      // object created for cardFaceObject

      const cardObject = {
        faces: face,
        suits: suit,
        ranks: rank,
      };
      // add new card to deckCards
      deckCards.push(cardObject);
    }
  }
  // console.log(deckCards);
  return deckCards;
};

//  shuffle cards
const shuffleDeck = () => {
  const randomNumber = function (dice) {
    return Math.trunc(Math.random() * dice) + 1;
  };
  let deck = makeDeck();
  for (let currentIndex = 0; currentIndex < deck.length; currentIndex += 1) {
    let currentCard = deck[currentIndex];
    let randomIndex = randomNumber(deck.length - 1);

    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = currentCard;
  }

  return deck;
};

// const shuffledCards = shuffleDeck();
// console.log(shuffledCards);

// create multiplayers
const multiPlayerCreate = function (numPlayers) {
  const cardsArray = [];
  let dealerNum = Number(numPlayers) + 1;
  for (let counter = 1; counter <= dealerNum; counter += 1) {
    if (counter === dealerNum) {
      const playerObject = {
        name: "Dealer",
        cardsHeld: cardsArray,
        cash: 1000,
        totalCardValue: 0,
        bet: 0,
      };
      players.push(playerObject);
    } else {
      const playerObject = {
        name: `player--${counter}`,
        cardsHeld: cardsArray,
        cash: 100,
        totalCardValue: 0,
        bet: 0,
        playing: true,
        win: "",
      };
      players.push(playerObject);
    }
    // players.push(playerObject);
  }
};

// multiPlayerCreate(5);
// console.log(players);

const initGame = function () {
  players = [];
  activePlayer = 0;
  multiPlayerMode = false;
  bettingMode = false;
  dealHitStayMode = false;
  hitStay = false;
  hitStayRound = 1;
  dealerTurn = false;
  endGame = false;
  // win = false;
  playingContinue = false;
};

const displayTotalCardValueAllPlayers = function () {
  let playerScore = "";
  let playerName = "";
  let myOutputValue = "";

  for (let counter = 0; counter < players.length; counter += 1) {
    console.log(counter);
    playerScore = players[counter].totalCardValue;
    playerName = players[counter].name;
    myOutputValue += `${playerName} total card value is ${playerScore}<br>`;
  }
  return myOutputValue;
};
// draw, update cardsHeld, totalCardValue and display
const drawACardUpdateAndDisplay = function () {
  let shuffledCards = shuffleDeck();
  let cardDrawn = shuffledCards.pop();
  let cardAceCleared = aceCheck(cardDrawn);
  let cardSuit = cardAceCleared.suits;
  let cardFace = cardAceCleared.faces;
  let myOutputValue = "";
  let currentPlayer = players[activePlayer].name;
  players[activePlayer].cardsHeld.push(cardAceCleared);
  players[activePlayer].totalCardValue += cardAceCleared.ranks;
  myOutputValue = `${currentPlayer} drew ${cardFace} of ${cardSuit}.<br/>`;
  // console.log(players[activePlayer].totalCardValue);
  return myOutputValue;
};

const intermittentCardValueDisplay = function () {
  let myOutputValue = "";
  let cardPlayer = players[activePlayer].name;
  let cardValue = players[activePlayer].totalCardValue;
  myOutputValue = `${cardPlayer} total current card value is ${cardValue}.<br/>`;
  return myOutputValue;
};

const dealCardsOneRound = function () {
  let myOutputValue = "";
  for (let counter = 0; counter < players.length; counter += 1) {
    // let gambler = players[counter];
    myOutputValue += drawACardUpdateAndDisplay() + "<br/>";
    myOutputValue += intermittentCardValueDisplay() + "<br/>";
    // console.log(myOutputValue);
    activePlayer += 1;
  }
  activePlayer = 0;
  return myOutputValue;
};

const dealBlackjackCheckLoop = function () {
  let myOutputValue = "";
  for (let counter = 0; counter < players.length; counter += 1) {
    myOutputValue += `${winLossChecker()}<br>`;
    activePlayer += 1;
  }
  return myOutputValue;
};

const playingLoopCheck = function () {
  for (let i = 0; i < players.lenghth - 1; i++) {
    if (players[i].playing === true) {
      playingContinue = true;
    }
  }
};

const winLossChecker = function () {
  let player = players[activePlayer].name;
  let myOutputValue = "";
  // let cleanHuman = 5;
  let cleanHuman = players[activePlayer].totalCardValue;
  // let cleanDealer = 8;
  let cleanDealer = players[players.length - 1].totalCardValue;

  // round: find players/dealer with Blackjack --> playing = false
  if (hitStay === false) {
    //player BlackJack. Player Wins
    console.log("was here");
    if (cleanHuman === 21 && cleanDealer !== 21) {
      console.log("was here");
      myOutputValue = `${players[activePlayer].name} wins with Blackjack.`;
      players[activePlayer].win = "win";
      players[activePlayer].playing = false;
    } // Both Blackjack. Both Tie
    else if (cleanHuman === 21 && cleanDealer === 21) {
      console.log("was here");
      players[activePlayer].playing = false;
      players[activePlayer].win = "tie";
      myOutputValue += `${players[activePlayer].name} has Blackjack, so does the Dealer. It is a tie of Blackjacks.`;
    } // Dealer Blackjack. Player loses
    else if (cleanDealer === 21) {
      console.log("was here");
      console.log(player);
      myOutputValue += `${players[activePlayer].name} loses. Dealer has Blackjack.`;
      for (let i = 0; i < players.length; i++) {
        players[i].playing = false;
        players[i].win = "lose";
      }
      endGame = true;
    } else {
      if (player === "Dealer") {
        console.log(players[activePlayer].name);
        myOutputValue += "***Dealer kneels and prays for your card to flop.***";
      } else if (players[activePlayer].playing === true) {
        myOutputValue += `${players[activePlayer].name}, decide Hit or Stay ?`;
        console.log(players[activePlayer].name);
      }
    }
  }
  // find players when Hit --> lose, hence playing = false
  if (hitStay === true && activePlayer < players.length - 1) {
    // activePlayer += 1;
    console.log(players[activePlayer].name);
    if (cleanHuman > 21) {
      console.log(cleanHuman);
      players[activePlayer].win = "lose";
      myOutputValue = `${players[activePlayer].name} loses.`;
      players[activePlayer].playing = false;
      activePlayer += 1;
      if (activePlayer == players.length - 1) {
        myOutputValue += `<br>Dealer's turn to roll`;
        playingContinue = true;
      } else {
        // activePlayer += 1;
        console.log(players[activePlayer].name);
        console.log("was here you are next, hit or stay ?");
        myOutputValue += `<br>${players[activePlayer].name}, you are next, Hit or Stay?`;
      }
    }
  }
  // endGame = false;
  // endgame comparison who win or lose
  console.log(hitStay);
  console.log(endGame);
  console.log(players[activePlayer].name);
  console.log(activePlayer);
  if (
    hitStay === false &&
    endGame === true
    // activePlayer < players[players.length - 1]
  ) {
    console.log(players[activePlayer].name);
    if (cleanHuman === cleanDealer) {
      console.log(players[activePlayer].name);
      // tie
      players[activePlayer].win = "tie";
      myOutputValue = `${players[activePlayer].name} and dealer have a tie.`;
    } // player wins
    else if (
      (cleanHuman <= 21 && cleanHuman > cleanDealer) ||
      cleanDealer > 21
    ) {
      console.log(players[activePlayer].name);
      myOutputValue = `${players[activePlayer].name} wins. Dealer loses.`;
      players[activePlayer].win = "win";
    } else if (cleanHuman > 21 && cleanDealer > 21) {
      console.log(players[activePlayer].name);
      myOutputValue = `Both died.`;
      players[activePlayer].win = "tie";
    } else {
      myOutputValue = `${players[activePlayer].name} loses. Dealer wins.`;
      players[activePlayer].win = "lose";
      players[activePlayer].playing = false;
    }
  }
  // player loses

  return myOutputValue;
};
const dealHitStay = (input) => {
  let playerStatus = players[activePlayer].playing;
  let currentPlayer = players[activePlayer].name;
  let myOutputValue = "Error !. Invalid click. ";

  if (input === "d" && hitStay === false) {
    // let playerStatus = players[activePlayer].playing;
    // currentPlayer = players[activePlayer].name;
    myOutputValue = "=== 1st round of deal cards === <br>";
    myOutputValue += dealCardsOneRound();
    myOutputValue += "<br/> === 2nd round of deal cards ===<br>";
    myOutputValue += dealCardsOneRound();
    activePlayer = 0;
    myOutputValue += dealBlackjackCheckLoop(); // causes the MULTIPLE hit or stay messages. Uses WinLossCheck for all
    console.log(myOutputValue);
    console.log("was here");
    activePlayer = 0;
    hitStay = true;
    const findFirstPlayer2HitOrStay = () => {
      for (let i = 0; i < players.length; i++) {
        if (players[i].playing == true) {
          myOutputValue += `<br>=== Hit or Stay ===<br>${currentPlayer}. Click Hit or Stay.`;
          return myOutputValue;
        } else {
          return `=== this round is over ===`;
        }
      }
    };
    // find first player to begin hit or stay
    myOutputValue = findFirstPlayer2HitOrStay();
    // myOutputValue += `Begin with ${currentPlayer}. What is your choice ?`;
  } else if (input === "h" && hitStay === true && playerStatus === true) {
    console.log(players[activePlayer].name);
    myOutputValue = drawACardUpdateAndDisplay();
    myOutputValue += intermittentCardValueDisplay();
    myOutputValue += winLossChecker();
    // console.log(hitStay);
    // console.log(players[activePlayer].playing);
    // console.log(players[activePlayer].name);

    if (players[activePlayer].playing == true) {
      // console.log("was...");
      myOutputValue += `${players[activePlayer].name}, please decide to Hit or Stay.`;
    } else {
      // console.log(players[activePlayer].name);
      if (activePlayer < players.length - 2) {
        activePlayer += 1;
        myOutputValue += `${players[activePlayer].name}, please decide to Hit or Stay.`; // issue to fix
      } else {
      }
    }
    // console.log("was here");

    // myOutputValue += `Player, Hit or Stay ?`;
  } else if (input === "s" && hitStay === true && playerStatus === true) {
    playingContinue = true;
    console.log(players[activePlayer].name);
    if (players[activePlayer].playing == true) {
      myOutputValue = `${players[activePlayer].name} chose to stay.<br/>`;
      console.log(players[activePlayer].name);
      players[activePlayer].playing = false;
      activePlayer += 1;
      console.log(players[activePlayer].name);
      if (activePlayer < players.length - 1) {
        console.log(players[activePlayer].name);
        myOutputValue += `${players[activePlayer].name}, please decide to Hit or Stay.`; // issue to fix
      } else {
        console.log(players[activePlayer].name);
        myOutputValue += `***Players are done picking.***`;
      }
    }
  }
  return myOutputValue;
};

const bettingStoreDisplay = function (betAmt) {
  let myOutputValue = "";
  let currentPlayerObject = players[activePlayer];
  let currentPlayerName = currentPlayerObject.name;
  currentPlayerObject.bet = betAmt;
  myOutputValue += `${currentPlayerName} bets ${betAmt} dollars.<br>`;

  return myOutputValue;
};

const betDeductNDisplay = function (betAmt) {
  let currentPlayerObject = players[activePlayer];
  let currentPlayerName = currentPlayerObject.name;
  players[activePlayer].cash -= betAmt;
  let currentPlayerCash = currentPlayerObject.cash;
  return `${currentPlayerName} has ${currentPlayerCash} dollars left.`;
};

const aceCheck = function (card) {
  let cardRank = card.ranks;
  let nameCard = card.faces;
  let currentTotalC = players[activePlayer].totalCardValue;
  let totalWithCard = currentTotalC + cardRank;

  if (nameCard === "ace") {
    if (totalWithCard >= 21) {
      card.ranks = 1;
    } else {
      card.ranks = 11;
    }
  }
  return card;
};

const dealerPickCard = function () {
  let myOutputValue = `Dealer's total hand ${
    players[players.length - 1].totalCardValue
  }<br>`;
  let i = 1;

  while (players[activePlayer].totalCardValue < 17 && i < 21) {
    myOutputValue += `${drawACardUpdateAndDisplay()} <br/>`;
    myOutputValue += `${intermittentCardValueDisplay()}<br/>`;
    i++;
    if (players[activePlayer].totalCardValue > 21) {
      myOutputValue += `Dealer died/lose.<br>`;
    } else {
      myOutputValue += `Dealer has enough cards. Total hand ${
        players[players.length - 1].totalCardValue
      } <br/>`;
    }
  }
  console.log(myOutputValue);
  return myOutputValue;
  // endGame = true
};

const endGameWinLossLoopCheck = function () {
  let myOutputValue = "";
  for (let counter = 0; counter < players.length - 1; counter += 1) {
    myOutputValue += `${winLossChecker()}<br>`;
    activePlayer += 1;
  }
  return myOutputValue;
};

const payOut = function () {
  let myOutputValue = "";
  console.log(players[activePlayer].win);
  console.log(players[activePlayer].name);
  for (let i = 0; i < players.length - 1; i++) {
    let betAmt = Number(players[i].bet);
    console.log(players[activePlayer].name);
    if (players[i].win === "win") {
      console.log("code 330");
      players[i].cash += betAmt;
      players[i].cash += betAmt;
      players[players.length - 1].cash -= betAmt;

      myOutputValue += `${players[activePlayer].name} wins ${betAmt}, cash at ${
        players[i].cash
      } dollars. Dealer cash now at ${
        players[players.length - 1].cash
      } dollars.<br>`;
    } else if (players[i].win === "lose") {
      console.log(players[activePlayer].name);
      players[players.length - 1].cash += betAmt;
      myOutputValue += "<br>" + "=== Payout ===" + "<br>";
      myOutputValue += `${
        players[activePlayer].name
      } loses ${betAmt} dollars, cash at ${
        players[i].cash
      } dollars. Dealer gains ${betAmt} dollars, cash at ${
        players[players.length - 1].cash
      } dollars.<br>`;
    } else if (players[i].win === "tie") {
      myOutputValue += `It is a tie. No one loses any cash.`;
    }
    activePlayer += 1;
    players[i].bet = 0;
  }
  return myOutputValue;
};
const gameContinue = function () {
  activePlayer = 0;
  bettingMode = false;
  dealHitStayMode = false;
  hitStay = false;
  dealerTurn = false;
  endGame = false;
  playingContinue = false;
  continueMode = false;
};
const main = function (input) {
  let myOutputValue = "Error. Invalid response !";
  if (input === "") {
    initGame();
    myOutputValue = `Input number of Players`;
    multiPlayerMode = true;
  } else if (
    multiPlayerMode === true &&
    Number.isNaN(Number(input)) === false
  ) {
    let playerNumbers = input;
    multiPlayerCreate(playerNumbers);
    multiPlayerMode = false;
    bettingMode = true;
    myOutputValue = `Excluding the Dealer, ${playerNumbers} players were created.<br> Please input your bets now.<br>Start with Player--1.<br/>`;
  }
  // to configure later. continue mode of game.
  // else if (
  //   continueMode === true &&
  //   input === "d"
  //   ) {
  //   myOutputValue = `Input your bets starting from ${players[activePlayer].name}`;
  //   if (Number.isInteger(Number(input))) {
  //     bet = Number(input);
  //     myOutputValue = bettingStoreDisplay(bet);
  //     myOutputValue += betDeductNDisplay(bet);
  //     activePlayer += 1;

  //     if (activePlayer >= players.length - 1) {
  //       myOutputValue += `<br/>Bets done! Dealing cards now.<br> Click Deal now.`;
  //       bettingMode = false;
  //       dealHitStayMode = true;
  //       activePlayer = 0;
  //     }
  //   }
  // }
  else if (
    bettingMode === true &&
    activePlayer < players.length - 1 &&
    Number.isInteger(Number(input))
  ) {
    let bet = Number(input);
    myOutputValue = bettingStoreDisplay(bet);
    myOutputValue += betDeductNDisplay(bet);
    activePlayer += 1;
    if (activePlayer >= players.length - 1) {
      myOutputValue += `<br/>Bets done! Dealing cards now.<br> Click Deal now.`;
      bettingMode = false;
      dealHitStayMode = true;
      activePlayer = 0;
    }
  } else if (
    dealHitStayMode === true &&
    (input === "d" || input === "h" || input === "s")
  ) {
    // deal cards to everyone AND after, hit or stay
    myOutputValue = dealHitStay(input); //line 172
    playingLoopCheck();

    // Dealer to pick cards
    if (playingContinue && activePlayer >= players.length - 1) {
      myOutputValue += `<br/>All players are done.<br> Dealer's turn.<br>`;
      myOutputValue += dealerPickCard();
      console.log(myOutputValue);
      dealHitStayMode = false;
      console.log(players[activePlayer].name);
      activePlayer = 0;
      endGame = true;
    }
    console.log(myOutputValue);
  }
  if (endGame === true) {
    console.log(players[activePlayer].name);
    hitStay = false;
    activePlayer = 0;
    myOutputValue += endGameWinLossLoopCheck();
    console.log(myOutputValue);
    activePlayer = 0;
    console.log(players[activePlayer].name);
    myOutputValue += payOut(); // need to fix. issues.
    console.log(myOutputValue);
    console.log("went in");
    // console.log(players[0].cash += 10)
    console.log(players[1].bet);
    console.log(players[1].cash);
    console.log(players[players.length - 1].cash);
    activePlayer = 0;
    myOutputValue += `<br>restart by clicking Restart or Submit.`;

    // gameContinue();

    console.log(activePlayer);
  }

  return myOutputValue;
};
