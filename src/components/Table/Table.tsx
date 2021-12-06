import React, { useEffect, useState } from 'react';
import { calculateBestScore, DeckType, generateDeck } from '../../utilities/deckUtilities';
import Card, { CardObject, Facing } from '../Card/Card';
import CardRow from '../CardRow/CardRow';
import InfoHud from '../InfoHud/InfoHud';
import styles from './Table.module.scss';

export enum GameState {
  WaitingForStart,
  DealingCards,
  PlayerRound,
  DealerRound,
  Result
}

const Table = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.WaitingForStart);
  const [deckCards, setDeckCards] = useState<CardObject[]>([]);
  const [playerCards, setPlayerCards] = useState<CardObject[]>([]);
  const [dealerCards, setDealerCards] = useState<CardObject[]>([]);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [dealerScore, setDealerScore] = useState<number>(0);
  const [outcome, setOutcome] = useState<string | undefined>();
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showDealerScore, setShowDealerScore] = useState<boolean>(false);

  /**
   * When a change to the dealerCars happens, this effect
   * will calculate the dealers score and whether or not 
   * the player is bust or hits a five card trick
   * @todo //TODO: Need to determine winner properly.
   */
  useEffect(() => {
    const setResult = (_outcome: string): void => {
      setGameState(GameState.Result);
      setOutcome(_outcome);
      setGameOver(true);
    }

    const _playerScore = calculateBestScore(playerCards);
    setPlayerScore(_playerScore);

    if (_playerScore > 21) {
      return setResult("Player bust, dealer wins!");
    }
    if (playerCards.length === 5 && _playerScore <= 21) {
      return setResult("Five card trick, player wins!");
    }

    const _dealerScore = calculateBestScore(dealerCards);
    setDealerScore(_dealerScore);

    if (_dealerScore > 21) {
      return setResult("Dealer bust, player wins!");
    }
    if (dealerCards.length === 5 && _dealerScore <= 21) {
      return setResult("Five card trick, dealer wins!");
    }

    if (gameState === GameState.Result) {
      if (_playerScore > _dealerScore) {
        return setResult("Player beats dealer!");
      }
      return setResult('Dealer beats player!');
    }

  }, [playerCards, dealerCards, gameState])

  /**
   * Handles the onClickStart event and starts a new game. 
   * Deals a card facing up to player, a card facing up to dealer, 
   * another card facing up to player, and finally a card cafing down to dealer
   */
  const clickStartHandler = (): void => {
    if (gameState !== GameState.WaitingForStart && !gameOver) {
      return;
    }
    setShowDealerScore(false);
    setGameOver(false);
    setPlayerCards([]);
    setDealerCards([]);
    setGameState(GameState.DealingCards);

    let _deck = generateDeck(DeckType.Standard);

    const _playerCards: CardObject[] = [];
    const _dealerCards: CardObject[] = [];

    let cardToDeal: CardObject = _deck[_deck.length - 1];
    _deck = _deck.slice(0, _deck.length - 1);
    setDeckCards(_deck);
    _playerCards.push(cardToDeal);
    setPlayerCards(_playerCards);

    cardToDeal = _deck[_deck.length - 1];
    _deck = _deck.slice(0, _deck.length - 1);
    setDeckCards(_deck);
    _dealerCards.push(cardToDeal);
    setDealerCards(_dealerCards);

    cardToDeal = _deck[_deck.length - 1];
    _deck = _deck.slice(0, _deck.length - 1);
    setDeckCards(_deck);
    _playerCards.push(cardToDeal);
    setPlayerCards(_playerCards);

    cardToDeal = _deck[_deck.length - 1];
    cardToDeal.facing = Facing.Down;
    _deck = _deck.slice(0, _deck.length - 1);
    setDeckCards(_deck);
    _dealerCards.push(cardToDeal);
    setDealerCards(_dealerCards);

    setGameState(GameState.PlayerRound);
  };

  /**
   * Handles the onClickHit event, taking a card from
   * the deck and giving it to the player
   */
  const clickHitHandler = () => {
    if (gameState !== GameState.PlayerRound) {
      return;
    }
    const card = deckCards[deckCards.length - 1];
    const updatedDeck = deckCards.slice(0, deckCards.length - 1);

    setDeckCards(updatedDeck);
    const updatedPlayerCards = [...playerCards];
    updatedPlayerCards.push(card);
    setPlayerCards(updatedPlayerCards);
  };

  /**
   * Handles the onClickStick event and performs the dealers betting.
   */
  const clickStickHandler = () => {
    if (gameState !== GameState.PlayerRound) {
      return;
    }
    setGameState(GameState.DealerRound);

    const _dealerCards = [...dealerCards];
    _dealerCards.forEach(card => card.facing = Facing.Up);
    setShowDealerScore(true);

    let updatedDeck = [...deckCards];

    let score = calculateBestScore(_dealerCards);

    while (_dealerCards.length < 5) {
      if (score >= 16 && score > playerScore) {
        break;
      }
      _dealerCards.push(updatedDeck[updatedDeck.length - 1]);
      updatedDeck = updatedDeck.slice(0, updatedDeck.length - 1);
      setDeckCards(updatedDeck);
      setDealerCards(_dealerCards);

      score = calculateBestScore(_dealerCards);
    }
    setGameState(GameState.Result);
  };

  return (
    <div className={styles.Table}>
      <CardRow cardOwner='Dealer' cards={dealerCards} />
      <CardRow cardOwner='Player' cards={playerCards} />
      <InfoHud
        gameOver={gameOver}
        gameState={gameState}
        outcome={outcome}
        clickStartHandler={clickStartHandler}
        clickHitHandler={clickHitHandler}
        clickStickHandler={clickStickHandler}
        scoreBoardRows={[
          { participant: 'Player', score: playerScore, displayScore: true },
          { participant: 'Dealer', score: dealerScore, displayScore: showDealerScore },
        ]} />
    </div>
  );
}

export default Table;
