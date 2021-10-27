"use strict";
let players = [];
let activePlayer = 0;
let playing = false;
// let roundFirst = true;
let userNameRound = false;
let dealHitStayMode = false;
// let dealRound = 1;
let bettingMode = false;
let multiPlayerMode = false;

const output = document.querySelector("#output-div");
const dealBtn = document.querySelector("#deal-button");
const stayBtn = document.querySelector("#stay-button");
const hitBtn = document.querySelector("#hit-button");
const restartBtn = document.querySelector("#restart-button");

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

// create multiplayers that contains *** method called deck () ==> picks card ==> pushes to cardsHeld array ; auto updates playersScore
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
  // players[activePlayer].totalCardValue = [0, 0];
  players = [];
  activePlayer = 0;
  playing = false;
  roundFirst = true;
  userNameRound = false;
  dealRound = 1;
  shuffleDeck();
  // console.log(shuffleDeck());
  multiPlayerCreate(2);
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
  let cardSuit = cardDrawn.suits;
  let cardFace = cardDrawn.faces;
  let myOutputValue = "";
  let currentPlayer = players[activePlayer].name;
  players[activePlayer].cardsHeld.push(cardDrawn);
  players[activePlayer].totalCardValue += cardDrawn.ranks;
  myOutputValue = `${currentPlayer} drew ${cardFace} of ${cardSuit}.`;
  return myOutputValue;
};

const intermittentCardValueDisplay = function () {
  let cardPlayer = players[activePlayer].name;
  let cardValue = players[activePlayer].totalCardValue;
  return `${cardPlayer} total current card value is ${cardValue}`;
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
  } else if (input == "s") {
    activePlayer += 1;
    myOutputValue = `${currentPlayer} chose to stay. Next player.`;
  }
  return myOutputValue;
};

const promptHitOrStay = function () {};

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
  return `${currentPlayerName} has ${currentPlayerCash} left.`;
};

const main = function (input) {
  let myOutputValue = "Error. Invalid response !";
  if (input === "") {
    myOutputValue = `Input number of Players`;
    multiPlayerMode = true;
  } else if (multiPlayerMode === true) {
    let playerNumbers = input;
    multiPlayerCreate(playerNumbers);
    bettingMode = true;
    multiPlayerMode = false;
    myOutputValue = `Excluding the Dealer, ${playerNumbers} players created. Please input your bets now. Start with Player--0`;
  } else if (bettingMode === true && activePlayer < players.length - 1) {
    // console.log("was here");
    let bet = input;
    myOutputValue = bettingStoreDisplay(bet);
    myOutputValue += betDeductNDisplay(bet);
    activePlayer += 1;
    // console.log(myOutputValue);
    if (activePlayer >= players.length - 1) {
      // console.log("was here bets done");
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
    // dealHitStayMode = false;
  }

  // console.log(myOutputValue);
  return myOutputValue;
};
