"use strict";
let players = [];
let activePlayer = 0;
let dealHitStayMode = false;
let bettingMode = false;
let multiPlayerMode = false;
let endGame = false;
let win = false;

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
  dealHitStayMode = false;
  bettingMode = false;
  multiPlayerMode = false;
  win = false;
};
const cashStatus = function (playerCash, playerWin, playerBet) {
  if (playerWin == true) {
    playerCash += playerBet;
    players[1].cash -= playerBet;
  } else {
    playerCash -= playerBet;
    players[1].cash += playerBet;
  }
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
  console.log(players[activePlayer].totalCardValue);
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

const dealHitStay = (input) => {
  let currentPlayer = players[activePlayer].name;
  let myOutputValue = "";
  if (input == "d") {
    myOutputValue = dealCardsOneRound();
    myOutputValue += "<br/>";
    myOutputValue += dealCardsOneRound();
    myOutputValue += `<br/>Player 1, Hit or Stay ?`;
  } else if (input == "h") {
    myOutputValue = drawACardUpdateAndDisplay();
    myOutputValue = myOutputValue + intermittentCardValueDisplay();
    activePlayer += 1;
    `${players[activePlayer].name}, please decide Hit or Stay.`;
  } else if (input == "s") {
    myOutputValue = `${currentPlayer} chose to stay.<br/>`;
    activePlayer += 1;
    myOutputValue = `${players[activePlayer].name}, please decide to Hit or Stay.`;
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
  console.log(currentPlayerObject);
  console.log(currentPlayerObject.cash);
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
  let myOutputValue = "";
  let i = 1;

  while (players[activePlayer].totalCardValue < 17 && i < 21) {
    myOutputValue = `${drawACardUpdateAndDisplay()} <br/>`;
    myOutputValue += `${intermittentCardValueDisplay()}<br/>`;
    i++;
  }
  return myOutputValue + "<br />" + " Dealer has enough.<br/>";
};

const endGameWinLossLoopCheck = function () {
  let myOutputValue = "";
  let totalHand = 0;
  let dealerTotalHand = 0;

  for (let counter = 0; counter < players.length - 1; counter += 1) {
    totalHand = players[counter].totalCardValue;
    dealerTotalHand = players[players.length - 1].totalCardValue;
    myOutputValue += `${winLossChecker(totalHand, dealerTotalHand)}<br>`;
  }

  return myOutputValue;
};

const winLossChecker = function (human, dealer) {
  let myOutputValue = "";
  let cleanHuman = Number(human);
  let cleanDealer = Number(dealer);

  if (cleanHuman === cleanDealer) {
    myOutputValue = `It is a tie.`;
  } else if (
    (cleanHuman <= 21 && cleanHuman > cleanDealer) ||
    cleanDealer > 21
  ) {
    myOutputValue = `You win. Dealer loses.`;
  } else if (cleanHuman === 21 && cleanDealer !== 21) {
    myOutputValue = `You have BlackJack. You win. Dealer loses.`;
  } else {
    myOutputValue = `You lose. Dealer wins.`;
  }

  return myOutputValue;
};

const main = function (input) {
  let myOutputValue = "Error. Invalid response !";
  if (input === "") {
    myOutputValue = `Input number of Players`;
    multiPlayerMode = true;
  } else if (
    multiPlayerMode === true &&
    Number.isNaN(Number(input)) === false
  ) {
    let playerNumbers = input;
    multiPlayerCreate(playerNumbers);
    bettingMode = true;
    multiPlayerMode = false;
    myOutputValue = `Excluding the Dealer, ${playerNumbers} players created. Please input your bets now. Start with Player--1.<br/>`;
  } else if (
    bettingMode === true &&
    activePlayer < players.length - 1 &&
    Number.isInteger(Number(input))
  ) {
    let bet = input;
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
    console.log("I went in line 262");
    myOutputValue = dealHitStay(input); //line 172
    console.log(myOutputValue);
    if (activePlayer >= players.length - 1) {
      myOutputValue += `<br/>All players are done.<br> Dealer's turn.<br><br>`;
      myOutputValue += dealerPickCard();
      dealHitStayMode = false;
      activePlayer = 0;
      endGame = true;
    }
  }
  if (endGame === true) {
    myOutputValue += endGameWinLossLoopCheck();
    endGame = false;
  }

  return myOutputValue;
};
