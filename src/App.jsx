import { useState, useEffect } from 'react';
import shuffle from './utilities/shuffle';
import Header from './components/Header';
import Card from './components/Card';
import useAppBadge from './hooks/useAppBadge';

//Adding state to the app, the user will need to click two times and we need
//to determine if those two clicks were on the same image.

function App() {
  //incremented by 1, everytime the user finds all the matches on the board.
  const [wins, setWins] = useState(0); //WIN STREAK
  const [cards, setCards] = useState(shuffle); //CARDS ARRAY FROM ASSETS
  //creating 2 different pieces of state here for pickOne and pickTwo
  const [pickOne, setPickOne] = useState(null); //FIRST SELECTION
  const [pickTwo, setPickTwo] = useState(null); //SECOND SELECTION
  //now when determining if we have a match, we want to add a slight delay
  //to the application and disable the UI. So the player can't just go around
  //and click everything to quickly get all the matches
  const [disabled, setDisabled] = useState(false); //DELAY HANDLER
  const [setBadge, clearBadge] = useAppBadge(); //HANDLES APP BADGE

  //HANDLE CARD SELECTION
  const handleClick = (card) => {
    //when a click occurs, we'll first see if clicking is disabled,
    //and if not, we'll either set pickOne(setPickOne) or pickTwo(setPickTwo)
    /* if (!disabled) { */
    if (!disabled && card !== pickOne && !card.matched) {
      //And the way we figure out which one to pick, is to see if pickOne is
      //already been set. If not, then we'll set the value to pickTwo using 'setPickTwo'
      pickOne ? setPickTwo(card) : setPickOne(card);
    }
  };

  //when a turn has happened (2 clicks) and finished, we'll also need to handle it
  const handleTurn = () => {
    setPickOne(null);
    setPickTwo(null);
    setDisabled(false);
  };

  //START OVER
  const handleNewGame = () => {
    setWins(0);
    clearBadge();
    handleTurn();
    setCards(shuffle);
  };

  //to update the state when the user clicks on a card
  //USED FOR SELECTION AND MATCH HANDLING
  useEffect(() => {
    let pickTimer;

    //this effect is been used to handle the match between two cards
    //we only want to run it if  pickOne and pickTwo have been defined
    //TWO CARDS HAVE BEEN CLICKED
    if (pickOne && pickTwo) {
      //Check if the cards the same
      if (pickOne.image === pickTwo.image) {
        //when a match is made, we'll need to update the cards array to put a 'matched' property to 'true' on the two cards that have been matched.
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.image === pickOne.image) {
              //Update card property to reflect match
              return { ...card, matched: true };
            } else {
              //No match
              return card;
            }
          });
        });
        handleTurn();
        //else condition: user pick two cards that do not match
      } else {
        //Prevent new selections until after delay
        setDisabled(true);
        //Add delay between selections
        pickTimer = setTimeout(() => {
          handleTurn();
        }, 1000); //this will delay for calling 'handleTurn()'. That prevents the user from endlessly clicking
      }
    }

    return () => {
      clearTimeout(pickTimer); //to return a function that will clear the timeout to ensure that we don't have any conflicting timeouts between renders.
    };
  }, [cards, pickOne, pickTwo, setBadge, wins]);

  //IF PLAYER HAS FOUND ALL THE MATCHES, we want to reset the game and start over
  useEffect(() => {
    //Check for any remaining card matches
    const checkWin = cards.filter((card) => !card.matched);

    //All matched made, handle win/badge counters
    if (cards.length && checkWin.length < 1) {
      console.log('You win!');
      setWins(wins + 1);
      setBadge();
      handleTurn();
      setCards(shuffle);
    }
  }, [cards, setBadge, wins]);

  return (
    <>
      <Header handleNewGame={handleNewGame} wins={wins} />
      <div className="grid">
        {cards.map((card) => {
          //looping over the cards
          const { image, matched } = card;
          return (
            <Card
              key={image.id}
              card={card}
              image={image}
              onClick={() => handleClick(card)}
              //
              //A card will be considered selected if the card equals 'pickOne' or 'pickTwo' or is been 'matched'
              selected={card === pickOne || card === pickTwo || matched}
              //and when this selected is true, it will add the class to the div and CSS will be executed
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
