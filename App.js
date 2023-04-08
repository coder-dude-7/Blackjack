import './App.css';
import './CSS-Playing-Cards/cards.css'
import './blackjackFunctions.js'


function getMax(arr) {
  let max = 0;
  for (let i = 0; i < arr.length; i++){
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}
function getMin(arr) {
  let min = 1000;
  for (let i = 0; i < arr.length; i++){
    if (arr[i] < min) {
      min = arr[i];
    }
  }
  return min
}
/*function extractCardInfo(cards) {
  let info = []
  let infoDict = {}
  let value, suit, suitHTML, suitBasic, rank, className = "";
  let output = [];
  if (cards.length === 0){
    return [{
      "value": 0,
      "suit": "",
      "suitBasic": "",
      "suitHTML": "",
      "rank": "",
      "className": ""
    }];
  }
  for (let i = 0; i < cards.length; i++){
    value = cards[i].slice(0, cards[i].search(" "));
    suitBasic = cards[i][cards[i].length -1];
    if (suitBasic === "H") {
      suitHTML = "&hearts;";
      suit = "hearts";
    } else if (suitBasic === "S") {
      suitHTML = "&spades;";
      suit = "spades";
    } else if (suitBasic === "C"){
      suitHTML = "&clubs;"
      suit = "clubs";
    } else if (suitBasic === "D"){
      suitHTML = "&diams;"
      suit = "diams";
    }
    
    rank = "rank-" + value.toLowerCase();
    className = "card " + rank + " " + suit
    

    infoDict = {
      "value": value,
      "suit": suit,
      "suitBasic": suitBasic,
      "suitHTML": suitHTML,
      "rank": rank,
      "className": className
    };
    info.push(infoDict);
  }
  return info

}*/

class Game {
  constructor() {
    this.deck = new Deck();
    this.players = [];
    this.cards = [];
    this.playerCount = 0
  }
  deal() {
    let playerCount = this.players.length;
    for (let i =0; i < playerCount*2; i++){
      this.players[i%playerCount].dealPlayer(this.deck);
    }
    this.getAllPlayerCards()
  }
  /*deal() {
    let playerCount = this.players.length;
    for (let i = 0; i < playerCount; i++){
      console.log(i)
      this.players[i].dealPlayer(this.deck);
    }
    this.getAllPlayerCards()
    console.log(this.cards[1])
  }*/
  printPlayers() {
    for (let i = 0; i < this.players.length; i++) {
      console.log(this.players[i]);
      console.log("======");
    }
  }
  createPlayerList(numberOfPlayers) {
    this.playerCount = numberOfPlayers;
    let dealer = new Player(numberOfPlayers);
    dealer.dealer = true;
    dealer.bank = 10000;
    this.players.push(dealer);

    for (let i = numberOfPlayers-1; i > -1; i--) {
      
      let newPlayer = new Player(i);
      this.players.unshift(newPlayer);
    }
  }
  setOptions(){
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].dealer === false) {
        if (typeof(this.players[i].cardsValue) !== "number") {
          
          let maxiumum = getMax(this.players[i].cardsValue);
          if (maxiumum === 21){
            this.players[i].options = ["BLACKJACK"];
            this.players[i].playing = false;
          }
          else if (maxiumum < 21) {
            this.players[i].options = ["HIT", "STICK"];
          }
          else if (maxiumum > 21) {
            this.players[i].options = ["HIT", "STICK"];
            let minimum = getMin(this.players[i].cardsValue);
            if (minimum === 21) {
              this.players[i].options = ["BLACKJACK"];
              this.players[i].playing = false;
            }
            else if (minimum > 21) {
              this.players[i].options = ["BUST"];
              this.players[i].playing = false;
            } 
            else {
              this.players[i].cardsValue = minimum
            } 
          }
        }
        else {
          if (this.players[i].cardsValue === 21) {
            this.players[i].options = ["BLACKJACK"];
            this.players[i].playing = false;
          }
          else if (this.players[i].cardsValue > 21){
            this.players[i].options = ["BUST"];
            this.players[i].playing = false;
          }
          else {
            this.players[i].options = ["HIT", "STICK"];
          }  
        }
      }
    }
    if (this.checkAllPlayersPlaying() === false) {
      return true
    } else {
      return false
    }
  }

  checkAllPlayersPlaying() {
    // check if there any players that are still playing 
    let players = this.players
    for (let i = 0; i < players.length -1; i++) {
      if (players[i]["playing"] === true) {
        return true
      }
    }
    return false
  }

  getAllPlayerCards() {
    let output = []
    for (let i = 0; i < this.players.length; i++){
      output.push(this.players[i].cards)
    }
    this.cards = output
  }

}

class Deck {

  constructor() {
    this.deck = ['A H', '2 H', '3 H', '4 H', '5 H', '6 H', '7 H', '8 H', '9 H', '10 H', 'J H', 'Q H', 'K H', 'A D', '2 D', '3 D', '4 D', '5 D', '6 D', '7 D', '8 D', '9 D', '10 D', 'J D', 'Q D', 'K D', 'A S', '2 S', '3 S', '4 S', '5 S', '6 S', '7 S', '8 S', '9 S', '10 S', 'J S', 'Q S', 'K S', 'A C', '2 C', '3 C', '4 C', '5 C', '6 C', '7 C', '8 C', '9 C', '10 C', 'J C', 'Q C', 'K C'];
    this.cardCount = 0;
    this.dealCard = this.dealCard.bind(this);
  }

  printDeck() {
    let outputString = "";
    console.log(this.deck.length)
    for (let i = 0; i < this.deck.length; i++) {
      outputString += this.deck[i] + "\n";
    }
    console.log(outputString);
  }

  shuffleDeck() {
    let currentIndex = this.deck.length, randomIndex
    while(currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
        [this.deck[currentIndex], this.deck[randomIndex]] = [this.deck[randomIndex], this.deck[currentIndex]];
    }
  }

  dealCard() {
    this.cardCount += 1;
    let card = this.deck.shift()
    return card
  }
}

class Player {
  
  constructor(number) {
    this.dead = false;
    this.number = number;
    this.cards = [];
    this.extraCards = [];
    this.cardsValue = 0;
    this.wager = 0;
    this.wagerPlaced = false;
    this.bank = 200;
    this.options = [];
    this.playing = true;
    this.dealer = false;
    this.dealerReveal = false;
    this.human = false;
    this.active = true;
    this.played = false;
    this.dealPlayer = this.dealPlayer.bind(this);
    this.handsPlayed = 0;
    this.handsWon = 0;
    this.handsLost = 0;
    this.handsDrawn = 0;
  }
  
  /*printPlayer() {
    let optionString = ""
    for (let i = 0; i < this.options.length; i++) {
      optionString += this.options[i];
    }
    console.log(String(this.number) +  "\n" + "Money: " + String(this.bank) + "\n" + String(this.cards) + " = " + String(this.cardsValue) + "\n" + optionString + "\nWager: " + String(this.wager))
  }*/
  dealPlayer(deck) {
    let card = deck.dealCard();
    /*deck.printDeck();*/
    /*console.log("dealer.dealPlayer(deck):",card)*/
    this.cards.push(card);
    if (this.cards.length > 2){
      this.extraCards.push(card);
    }
    this.calculateValue()
  }
  calculateValue() {
    const valueDict = {
      "A": [1,11],
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      "10": 10,
      "J": 10,
      "Q": 10,
      "K": 10
    };
    this.cardsValue = 0;
    let currentCard, value = ""

    if (this.cards.length < 2){
      return
    }
    for (let i = 0; i < this.cards.length; i++){
      currentCard = this.cards[i]
      value = currentCard.slice(0, currentCard.search(" "))
      
      if (value !== "A" && typeof(this.cardsValue) === "number"){
        this.cardsValue += valueDict[value]
      }
      
      else if (typeof(this.cardsValue) != "number"){
        for (let j = 0; j < this.cardsValue.length; j++){
          if (value === "A") {
            for (let k = 0; k < 2; k++){
              if ([1,11][k] + this.cardsValue[j] <= 21) {
                this.cardsValue[j] += [1,11][k];
                this.cardsValue[(j+1)%2] += [1,11][(k+1)%2];
              }
            }
          } else {
            this.cardsValue[j] += valueDict[value];
          }
        }
      }
      else if (value === "A" && typeof(this.cardsValue) === "number"){
        this.cardsValue = [this.cardsValue + 1, this.cardsValue + 11];
      }
    }
    /*return this.cardsValue*/
  }
  addToBank(value){
    this.bank += value;
  }
  placeWager(amount) {
    if (amount > this.bank){
      amount = 0;
    } 
    if ((this.wager + amount) < 0) {
      amount = 0;
    }
    this.wager += amount;
    this.bank -= amount;
  }

  confirmWager() {
    this.wagerPlaced = true;
  }

}

export {Game, Deck}
