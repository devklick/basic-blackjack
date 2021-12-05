import React, { useEffect, useState } from 'react';
import { calculateBestScore, DeckType, generateDeck } from '../../utilities/deckUtilities';
import Card, { CardObject } from '../Card/Card';
import styles from './Table.module.scss';

export interface TableProps {

}

export enum GameState {
  WaitingForStart,
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



  /**
   * When a change to the dealerCars happens, this effect
   * will calculate the dealers score and whether or not 
   * the player is bust or hits a five card trick
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
   * Handles the onClickStart event and starts a new game
   */
  const clickStartHandler = (): void => {
    if (gameState !== GameState.WaitingForStart && !gameOver) {
      return;
    }
    setGameOver(false);
    setPlayerCards([]);
    setDealerCards([]);
    const _deck = generateDeck(DeckType.Standard);

    setGameState(GameState.PlayerRound);

    const cardsToDeal: CardObject[] = _deck.slice(_deck.length - 2);
    const updatedDeck: CardObject[] = _deck.slice(0, _deck.length - 2);

    setDeckCards(updatedDeck);
    setPlayerCards(cardsToDeal);
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

    const cardsToDeal = deckCards.slice(deckCards.length - 2);
    let updatedDeck = deckCards.slice(0, deckCards.length - 2);

    setDeckCards(updatedDeck);
    setDealerCards(cardsToDeal);

    let score = calculateBestScore(cardsToDeal);

    while (score < 18 || cardsToDeal.length === 5) {
      cardsToDeal.push(updatedDeck[updatedDeck.length - 1]);
      updatedDeck = updatedDeck.slice(0, updatedDeck.length - 1);
      setDeckCards(updatedDeck);
      setDealerCards(cardsToDeal);

      score = calculateBestScore(cardsToDeal);
    }
    setGameState(GameState.Result);
  };

  const playerCardsToRender = playerCards.map(c => Card(c));
  const dealerCardsToRender = dealerCards.map(c => Card(c));

  return (
    <div className={styles.Table}>
      {playerCards.length > 0 ?
        <>
          <div className={styles.CardOwner}>
            Players Cards
          </div>
        </>
        : null}
      <div className={styles.PlayerCards}>
        {playerCardsToRender}
      </div>
      {dealerCards.length > 0 ?
        <>
          <div className={styles.CardOwner}>
            Dealers Cards
          </div>
        </>
        : null}
      <div className={styles.DealerCards}>
        {dealerCardsToRender}
      </div>
      <div className={styles.InfoHud}>
        {gameOver ? <div className={styles.Outcome}>{outcome}</div> : null}
        {gameState !== GameState.WaitingForStart ?
          <>
            <table className={styles.ScoreTable}>
              <tr>
                <td>Player Score</td>
                <td>{playerScore}</td>
              </tr>
              <tr>
                <td>Dealer Score</td>
                <td>{dealerScore}</td>
              </tr>
            </table>
          </>
          : null}
        <div className={styles.ButtonContainer}>
          {gameState === GameState.WaitingForStart || gameOver
            ? <button className={styles.StartButton} onClick={clickStartHandler}>{gameOver ? 'Restart' : 'Start'}</button>
            : null}
          {gameState === GameState.PlayerRound && !gameOver
            ? <>
              <button className={styles.HitButton} onClick={clickHitHandler}>Hit</button>
              <button className={styles.StickButton} onClick={clickStickHandler}>Stick</button>
            </>
            : null}
        </div>

      </div>
    </div>
  );
}

export default Table;
