import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/*import DrawBoard from './App';*/
import * as ap from './App'
import reportWebVitals from './reportWebVitals';

/* 
  Current State

  - Wager buttons work and change player class attributes ie.
    increase/decrease wager by 10, confirm wager.
  - Wager buttons will show when player is active and wager has not 
    been placed. Options buttons will show when player is active and
    wager has been placed.

    ============

  Need To

  - Update values on table and change state when button are pressed
    class attributes are changing as they should but nothing happens on screen!!

*/


class BlackJack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPlayer: 0,
      game: new ap.Game(),
      intro: false,
      placeWagerPrompt: true,
      playerCount: 4,

      // need to use these to update board somehow
      cards: [],
      values: [],
      extraCards: [],
      wagers: [],
      banks: []
    };
  }
  setGameState(currentGame) {
    this.setState({
      game: currentGame
    });
  }
  
  
  render() {
    /*let game = this.state.game;*/
    let game = new ap.Game()
    console.log(game.players)
    game.createPlayerList(this.state.playerCount);
    game.deck.shuffleDeck();
    game.deal();
    game.getAllPlayerCards();
    game.setOptions();
    /*game.players[0].placeWager(10);*/
    game.players[0].active = true;
    if (this.state.intro === true) {
      return (
        ap.DrawIntro(game)
      );
    } else {
      return(
        ap.DrawBoard(game)
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

/*function RefreshBoard(game){
  ReactDOM.render(
    <React.StrictMode>
      <DrawBoard  Game={game} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}*/


/*game.createPlayerList(4);
game.deck.shuffleDeck();
game.deal();
game.getAllPlayerCards();
game.setOptions();
RefreshBoard(game);*/

/*ReactDOM.render(
  <React.StrictMode>
    <DrawBoard  Game={game} />
  </React.StrictMode>,
  document.getElementById('root')
);*/

/*while (game.checkRoundStatus()) {
  if (game.deck.cardCount > 25) {
    game.deck.shuffleDeck();
  }

}*/


// want to deal card to player, refresh, deal to next, refresh, etc.

/*game.players[0].dealPlayer(game.deck);*/




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
