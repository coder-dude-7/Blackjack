

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
function extractCardInfo(cards) {
	let value, suit = "";
	let output = [];
	for (let i = 0; i < cards.length; i++){
		value = cards[i].slice(0, cards[i].search(" "));
		suit = cards[i][cards[i].length -1];
		output.push([value, suit])
	}
	return output

}

class Game {
	constructor() {
		this.deck = new Deck();
		this.players = [];
	}
	deal() {
		let playerCount = this.players.length;
		for (let i =0; i < playerCount*2; i++){
			this.players[i%playerCount].dealPlayer(this.deck);
		}
	}
	printPlayers() {
		for (let i = 0; i < this.players.length; i++) {
			console.log(this.players[i]);
			console.log("======");
		}
	}
	createPlayerList(numberOfPlayers) {
		let dealer = new Player(numberOfPlayers);
		dealer.dealer = true;
		this.players.push(dealer);

		for (let i = numberOfPlayers-1; i > -1; i--) {
			
			let newPlayer = new Player(i);
			this.players.unshift(newPlayer);
		}
	}
	setOptions(){
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].dealer == false) {
				if (typeof(this.players[i].cardsValue) !== "number") {
					console.log("made it")
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
	}

}



class Deck {
	constructor() {
		this.deck = ['A H', '2 H', '3 H', '4 H', '5 H', '6 H', '7 H', '8 H', '9 H', '10 H', 'J H', 'Q H', 'K H', 'A D', '2 D', '3 D', '4 D', '5 D', '6 D', '7 D', '8 D', '9 D', '10 D', 'J D', 'Q D', 'K D', 'A S', '2 S', '3 S', '4 S', '5 S', '6 S', '7 S', '8 S', '9 S', '10 S', 'J S', 'Q S', 'K S', 'A C', '2 C', '3 C', '4 C', '5 C', '6 C', '7 C', '8 C', '9 C', '10 C', 'J C', 'Q C', 'K C'];
		this.cardCount = 0;
	}

	printDeck() {
		let outputString = "";
		for (let i = 0; i < this.deck.length; i++) {
			outputString += this.deck[i] + "\n";
		}
		console.log(outputString);
	}

	shuffleDeck() {
		let currentIndex = this.deck.length, randomIndex
		while(currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			// And swap it with the current element.
	    	[this.deck[currentIndex], this.deck[randomIndex]] = [this.deck[randomIndex], this.deck[currentIndex]];
		}
	}

	dealCard() {
		this.cardCount += 1;
		return this.deck.shift()
	}
}

class Player {
	static valueDict = {
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
	constructor(number) {
		this.number = number;
		this.cards = [];
		this.cardsValue = 0;
		this.wager = 0;
		this.bank = 50;
		this.options = [];
		this.playing = true;
		this.dealer = false;
		this.human = false;
	}
	printPlayer() {
		let optionString = ""
		for (let i = 0; i < this.options.length; i++) {
			optionString += this.options[i];
		}
		console.log(String(this.number) +  "\n" + "Money: " + String(this.bank) + "\n" + String(this.cards) + " = " + String(this.cardsValue) + "\n" + optionString + "\nWager: " + String(this.wager))
	}
	dealPlayer(deck) {
		this.cards.push(deck.dealCard());
		this.calculateValue()
	}
	calculateValue() {
		this.cardsValue = 0;
		let currentCard, value = ""

		if (this.cards.length < 2){
			return
		}
		for (let i = 0; i < this.cards.length; i++){
			currentCard = this.cards[i]
			value = currentCard.slice(0, currentCard.search(" "))
			
			if (value != "A" && typeof(this.cardsValue) === "number"){
				this.cardsValue += this.valueDict[value]
			}
			
			else if (typeof(this.cardsValue) != "number"){
				for (let j = 0; j < this.cardsValue.length; j++){
					if (value == "A") {
						for (let k = 0; k < 2; k++){
							if ([1,11][k] + this.cardsValue[j] <= 21) {
								this.cardsValue[j] += [1,11][k];
								this.cardsValue[(j+1)%2] += [1,11][(k+1)%2];
							}
						}
					} else {
						this.cardsValue[j] += this.valueDict[value];
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
		this.wager += amount;
		this.bank -= amount;
	}

}




