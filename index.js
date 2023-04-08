import React from 'react';
import ReactDOM from 'react-dom';
import './CSS-Playing-Cards/cards.css'
import './index.css';
import * as ap from './App'
import reportWebVitals from './reportWebVitals';

/* 
  Current State
    ============

  Need To

  - Sort dealer out. 
    
    > If dealer has 10, or face card, or ace. Second card is shown on next to deal - check for natural blackjack
    > if dealer has natural, dealer takes all players chips who do not have natural
    > each player plays starting left of the dealer and hit/stick till bust or stuck
    
    

  - add Splitting Pairs
  - add Doubling Down
  - insurance
  - change wgaer from number to chip reresentation
  - show dealer bank balance 
  - fix card showing wrong suit (small icon). need a way of calling eg. &diams; for each suit
  - add ability for player to leave table (at wager stage)
  - make look nicer

*/

class BlackJack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPlayer: 0,
      game: new ap.Game(),
      intro: true,
      gameOver: false,
      placeWagerPrompt: true,
      playerCount: 0,
      roundEnd: false
    };
  }
  extractCardInfo(cards) {
    let info = []
    let infoDict = {}
    let value, suit, suitHTML, suitBasic, rank, className = "";
    
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

  }

  drawCards(cards, player) {

    let cardInfo = this.extractCardInfo(cards);
    
    if (cards.length === 1 || (cards.length > 0 && player.dealer === true && player.dealerReveal === false) ){
      
      return (
        <div className="cardHolder">
          <div className="playingCards">
            <div className={cardInfo[0]["className"]}>
              <div className="rank">{cardInfo[0]["value"]}</div>
              <div className="suit">&diams;</div>
            </div>
          </div>
          <div className="playingCards">
            <div className="card back">*</div>
          </div>
        </div>
      );
    } 
    else if (cards.length === 0){
      return
    }

    else {
      return (
        <div className="cardHolder">
          <div className="playingCards">
            <div className={cardInfo[0]["className"]}>
              <div className="rank">{cardInfo[0]["value"]}</div>
              <div className="suit">&clubs;</div>
            </div>
          </div>
          <div className="playingCards">
            <div className={cardInfo[1]["className"]}>
              <div className="rank">{cardInfo[1]["value"]}</div>
              <div className="suit">&spades;</div>
            </div>
          </div>
        </div>
      );
    }
  }

  DrawExtraCards(player) {
    let cards = player.extraCards
    let cardInfo = this.extractCardInfo(cards);
    let cardPile = []
    if (cards.length > 0) {
      for (let i = 0; i < cardInfo.length; i++) {
        cardPile.push(
          <div className="extraCard">
            <div className="playingCards">
              <div className={cardInfo[i]["className"]}>
                <div className="rank">{cardInfo[i]["value"]}</div>
                <div className="suit">&spades;</div>
              </div>
            </div>
          </div> 
        );
      }
      if (player.dealer === true) {
        return (
          <div className="extraCardsHolderDealer">
            {cardPile}
          </div>
        );
      }
      else {
        return (
          <div className="extraCardsHolder">
            {cardPile}
          </div>
        );
      }
    }
    else {
      if (player.dealer === true) {
        return (
          <div className="extraCardsHolderDealer">
          </div>
        );
      }
      return (
        <div className="extraCardsHolder">
        </div>
      );
    }
  }
  checkAllPlayersDead(game) {
    // check if there any players that are still playing 
    let players = game.players
    for (let i = 0; i < players.length -1; i++) {
      if (players[i]["dead"] === false) {
        return false
      }
    }
    return true
  }
  checkAllPlayersPlaying(game) {
    // check if there any players that are still playing 
    let players = game.players
    for (let i = 0; i < players.length -1; i++) {
      if (players[i]["playing"] === true && players[i]["dead"] === false) {
        return true
      }
    }
    return false
  }
  getMax(arr) {
    let max = 0;
    for (let i = 0; i < arr.length; i++){
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
  }
  settleBets(game){

    let dealer = game.players[game.players.length-1];
    let players = game.players

    for (let i = 0; i < players.length-1; i++){
      let player = players[i];
      if (player.dead === false){
        player.handsPlayed += 1;
      
      
        if (typeof(player.cardsValue) === "object"){
          player.cardsValue = this.getMax([player.cardsValue[0],player.cardsValue[1]]);
        }
        // bust
        if (player.cardsValue > 21) {
          dealer.bank += player.wager;
          player.wager = 0;
          player.handsLost += 1;
        }
        else if (dealer.cardsValue > 21){
          // dealer bust win (if player not bust)
          dealer.bank -= player.wager;
          player.bank += player.wager * 2;
          player.wager = 0;
          player.handsWon += 1;
        }
        else if (player.cardsValue === 21){
          if (player.extraCards.length === 0) {
            // natural (1.5*wager+wager)
            dealer.bank -= player.wager * 1.5;
            player.bank += (player.wager + (player.wager * 1.5));
            player.wager = 0;
            player.handsWon += 1;
          }
          else if (dealer.cardsValue === 21) {
            // 21 with dealer (wager)
            player.bank += player.wager;
            player.wager = 0;
            player.handsDrawn += 1;
          }
          else {
            // 21 (2*wager)
            dealer.bank -= player.wager;
            player.bank += player.wager * 2;
            player.wager = 0;
            player.handsWon += 1;
          }
        }
        else {
          // high card win (2*wager)
          if (player.cardsValue > dealer.cardsValue) {
            dealer.bank -= player.wager;
            player.bank += player.wager * 2;
            player.wager = 0;
            player.handsWon += 1;
          }
          else if (player.cardsValue === dealer.cardsValue){
            player.bank += player.wager;
            player.wager = 0;
            player.handsDrawn += 1;
          }
          else {
            dealer.bank += player.wager;
            player.wager = 0;
            player.handsLost += 1;
          }
        }
      }
    }
    this.setState({
        game: game,
        roundEnd: true
    });
  }
  playDealer(game) {
    let dealer = game.players[game.players.length-1];
    if (game.deck.cardCount > 25) {
      console.log("shuffling");
      game.deck = new ap.Deck();
      game.deck.shuffleDeck();
    }
    while (dealer.playing){
      if (typeof dealer.cardsValue === "object"){
        dealer.cardsValue = this.getMax([dealer.cardsValue[0],dealer.cardsValue[1]]);
      }
      if (dealer.cardsValue >= 17){
        dealer.playing = false;
        this.settleBets(game);
      }
      else {
        dealer.dealPlayer(game.deck);
        game.getAllPlayerCards();
      }
    }
  }

  hit(game, playerNumber) {
    if (game.deck.cardCount > 25) {
      console.log("shuffling");
      game.deck = new ap.Deck();
      game.deck.shuffleDeck();
    }
    let dealer = game.players[game.players.length-1]
    if (game.players[playerNumber].playing === true){
      game.players[playerNumber].dealPlayer(game.deck);
      game.getAllPlayerCards();
      game.setOptions();
      this.setState({
        game: game
      });
    }
    if (this.checkAllPlayersPlaying(game) === false){
      // turn dealer card and play dealer
      dealer.dealerReveal = true
      this.setState({
        game: game
      });
      this.playDealer(game);
    }
  }  
  
  stick(game, playerNumber) {
    let dealer = game.players[game.players.length-1]
    game.players[playerNumber].playing = false;
    game.players[playerNumber].active = false;
    this.setState({
        game: game
      });
    if (this.checkAllPlayersPlaying(game) === false){
      // turn dealer card and play dealer
      dealer.dealerReveal = true
      this.setState({
        game: game
      });
      this.playDealer(game);
    }
  }

  DrawOptions(player, deck) {
    if (player.active === false || player.wagerPlaced === false){
      return
    } else { 
      let options = player.options
      if (options.length > 1){
        return (
          <div className="optionHolder">
            <button className="optionButton" onClick={() => this.hit(this.state.game, player.number)}>
              {options[0]}
            </button>
            <button className="optionButton" onClick={() => this.stick(this.state.game, player.number)}>
              {options[1]}
            </button>
          </div>
        );
      }
      else {
        return (
          <div className="optionHolder">
            <div className="option">
              {options[0]}
            </div>
          </div>
        );
      }
    }
  }
  DrawBankBalance(player){
    return(
      <div className="bankBalance">
        {player.bank}
      </div>
    );
  }

  DrawCardValue(player) { 
    let cardsValue = player.cardsValue 
    let or = "/"

    if (player.dealer === true && player.dealerReveal === false) {
      return
    }

    if (typeof(cardsValue) != "number") {
      return (
        <div className="valueHolder">
          <div className="value">
            {cardsValue[0]}
          </div>
          <div className="value">
             {or}
          </div>
          <div className="value">
          {cardsValue[1]}
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="valueHolder">
          <div className="value">
            {cardsValue}
          </div>
        </div>
      );
    }
  }

  checkAllPlayersWagered(game) {
    let players = game.players
    for (let i = 0; i < players.length -1; i++) {
      if (players[i]["wagerPlaced"] === false && players[i]["dead"] === false) {
        return false
      }
    }
    return true
  }

  incrementWager(amount, player) {
    let game = this.state.game;
    game.players[player.number].placeWager(amount);
    this.setState({
      game: game
    });
  }

  allIn(player) {
    let game = this.state.game;
    game.players[player.number].placeWager(player.bank);
    this.setState({
      game: game
    });
  }

  confirmWager(player){
    let game = this.state.game;
    if (player.wager > 0) {
      game.players[player.number].wagerPlaced = true;
      this.setState({
        game: game
      });
    }
    if (this.checkAllPlayersWagered(game) === true) {
      this.deal(game)
    } 
  }

  DrawPlaceWagerPrompt(player){

    if (player.active === true && player.wagerPlaced === false) {
      return (
        <div className="placeWagerPrompt">
          <div className="incrementWagerHolder">
            <button className="incrementButton minus" onClick={() => this.incrementWager(-10, player)}>-</button>
            <button className="incrementButton" onClick={() => this.incrementWager(10, player)}>+</button>
          </div>
          <button onClick={() => this.allIn(player)} className="allInButton">ALL IN</button>
          <button onClick={() => this.confirmWager(player)} className="placeWagerButton">
            Place Wager
          </button>
        </div>
      );
    }
    else {
      return
    }
  }
  startGame(game){
    if (this.state.playerCount !== 0) {
      game.createPlayerList(this.state.playerCount);
      game.deck.shuffleDeck();

      this.setState({
        game: game,
        intro: false
      });
    }
    
  }
  setPlayerCount = event => {
    this.setState({
      playerCount: parseInt(event.target.value)
    });
  }
  DrawIntro(game) {

    return(
      <div className="page">
        <div className="titleHolder">
          <div className="title">BLACKJACK</div>
        </div>
        <div className="userInput">
          <div className="playerNumberInput">
            <h4>Number of players:</h4>
            <input
              className="playerCount" 
              type="text"
              name="playerCount"
              onChange={this.setPlayerCount}
            />
          </div>
          <button className="startButton" onClick={() => this.startGame(this.state.game)}>START GAME</button>
        </div>
      </div>
    );
    
  }

  DrawDealer(game){
    let dealer = game.players[game.players.length-1]

    return(
      <div className="dealerHolder">
        <h2>Dealer</h2>
        {this.drawCards(dealer.cards, dealer)}
        {this.DrawCardValue(dealer)}
        {this.DrawExtraCards(dealer)}
      </div>
    );
  }

  deal(game) {
    if (game.deck.cardCount > 25) {
      console.log("shuffling");
      game.deck = new ap.Deck();
      game.deck.shuffleDeck();
    }
    game.deal()
    game.getAllPlayerCards();
    let dealer = game.players[game.players.length-1]
    if (game.setOptions() === true){
      dealer.dealerReveal = true
      this.playDealer(game)
    }
    this.setState({
      game: game
    });
    
  }
  DrawPlayer(game){
    let players = game.players;
    let playerHTML = [];
    let ids = ["one", "two", "three", "four"];

    for (let i = 0; i < players.length-1; i++) {
      if (players[i].dead === false){
        playerHTML.push(
          <div id={ids[i]} className="player">
            {this.DrawExtraCards(players[i])}
            <div className="wager">
              {players[i].wager}
            </div>
            <h3>Player {players[i].number + 1}</h3>
            {this.drawCards(players[i].cards, players[i])}
            {this.DrawCardValue(players[i])}
            {this.DrawOptions(players[i], game.deck)}
            {this.DrawPlaceWagerPrompt(players[i])}
            {this.DrawBankBalance(players[i])}
          </div>
        );
      }
      
    }
    return(playerHTML)
  }

  goToMainMenu(){
    
    this.setState({
      intro: true,
      gameOver: false,
      placeWagerPrompt: true,
      playerCount: 0,
      roundEnd: false,
      game: new ap.Game()
    });
  }
  startNewGame(game){

    game.deck = new ap.Deck()
    game.deck.shuffleDeck()

    let players = game.players;
    let dealer = players[players.length-1];
    for (let i = 0; i < players.length -1; i++) {
      let player = players[i];
      player.dead = false;
      player.cards = [];
      player.extraCards = [];
      player.cardsValue = 0;
      player.wager = 0;
      player.wagerPlaced = false;
      player.bank = 200;
      player.options = [];
      player.playing = true;
      player.dealerReveal = false;
      player.human = false;
      player.active = true;
      player.played = false;
      player.handsPlayed = 0;
      player.handsWon = 0;
      player.handsLost = 0;
      player.handsDrawn = 0;
    }
    dealer.dealer = true;
    dealer.bank = 10000;

    this.setState({
      game: game,
      intro: false,
      gameOver: false,
      placeWagerPrompt: true
    });
  }

  startNewRound(game){
    let players = game.players;

    for (let i = 0; i < players.length; i++) {
      let player = players[i];
      if (player.bank <= 0) {
        players[i].dead = true;
      }
      player.cards = [];
      player.extraCards = [];
      player.cardsValue = 0;
      player.wager = 0;
      player.wagerPlaced = false;
      player.options = [];
      player.dealerReveal = false;
      player.active = true;
      player.playing = true;
      player.played = false;
    }
    this.setState({
      game: game,
      roundEnd: false
    });
    if (this.checkAllPlayersDead(game) === true) {
      this.setState({
        gameOver: true
      });
    }
  }

  DrawNextRoundButton(game){
    if (this.state.roundEnd === false) {
      return 
    }
    else {
      return (
        <button className="nextRoundButton" onClick={() => this.startNewRound(game)}>next round</button>
      );
    }
  }

  DrawEndScreen(game) {
    let players = game.players;
    let dealer = players[players.length-1];
    let playerStats = []
    for (let i = 0; i < players.length-1; i++){
      let player = players[i];
      playerStats.push(
        <div className="playerStats">
          <h2>Player {player.number + 1}</h2>
          <div className="stat">Bank Balance: {player.bank}</div>
          <div className="stat">Hands Played: {player.handsPlayed}</div>
          <div className="stat">Hands Won: {player.handsWon}</div>
          <div className="stat">Hands Lost: {player.handsLost}</div>
          <div className="stat">Hands Drawn: {player.handsDrawn}</div>
        </div>
      );
    }
    return(
      <div className="page">
        <div className="gameOver">
          <h1> GAME OVER </h1>
        </div>
        <div className="playerStatsHolder">
          <div className="playerStats">
            <h2>Dealer</h2>
            <div className="stat">Bank Balance: {dealer.bank}</div>
          </div>
        </div>
        <div className="playerStatsHolder">
          {playerStats}
        </div>
        <div className="endScreenButtonHolder">
          <button id="playAgain" onClick={() => this.startNewGame(game)} className="endScreenButton">Play Again</button>
          <button id="mainMenu" onClick={() => this.goToMainMenu()} className="endScreenButton">Main Menu</button>
        </div>
      </div>
    );
  }

  DrawBoard(Game) {
    let game = Game;
    
    return (
      <div className="page">
        <div className="titleHolder">
          <div className="title">BLACKJACK</div>
        </div>
        
        {this.DrawDealer(this.state.game)}
        <div className="playerHolder">
          {this.DrawPlayer(game)}
        </div>
        {this.DrawNextRoundButton(game)}
      </div>
    );
  }

  render() {
    
    if (this.state.intro === true) {
      return (
        this.DrawIntro(this.state.game)
      );
    } 
    else if (this.state.gameOver === true){
      return (
        this.DrawEndScreen(this.state.game)
      );
    }
    else {
      return(
        this.DrawBoard(this.state.game)
      );
    }
  }
}

ReactDOM.render(
  <React.StrictMode>
    <BlackJack />
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
