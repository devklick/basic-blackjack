# Blackjack (but not really)

This is an over-simplified, crude version of Blackjack.
It's actually more along the lines of the classic card games Twenty-One or Pontoon,
but doesnt really follow the rules of any one of these games.


<details>
<summary>Click to see screenshots!</summary>>

![Initial Round](/docs/InitialRound.png)
![Dealer Bust](/docs/DealerBust.png)
![Five Card Trick](/docs/FiveCardTrick.png)
![Confirm *stick*](/docs/ConfirmStick.png)
![Confirm *hit*](/docs/ConfirmHit.png)
</details>
<details>
<summary>Click to see gameplay!</summary>

![Confirm *hit*](/docs/Gameplay.gif)
</details>

---

## Play the game
You can play the game directly in your browser or download the desktop app for your operating system. 

### Browser
https://devklick.github.io/basic-blackjack/

### Desktop
Download the relevant installer from the [releases page](https://github.com/devklick/basic-blackjack/releases).
Note that at this time, only Windows and Linux operating systems are supported.
Note that the installers are not currently signed and likely never will be. Your operating system will likely throw up all sorts of warnigs and installing an unknown application. The risk is yours.

---
## Working with the repo
This game is a React app packaged as a desktop app using Electron. To run the react app, simply run `npm start`. To run the desktop app, run `npm dev`. To run the tests, write them first.

---
## Objective
The idea is to end up with between 2 and 5 cards who's rank total 21 or less. The winner will be determined based on the hand rank, the numer of cards in the hand, and the highest card. See the [Ways to win](#ways-to-win) section.

---
## Overview
The game contains two players; the player (you) and the dealer (computer). The dealer will start by dealing four cards:

1. Deal 1 card to player, facing up
2. Deal 1 card to dealer, facing up
3. Deal 1 card to player, facing up
4. Deal 1 card to dealer, facing *down*

### Player Round
The player will then have a chance to decide whether they want to *hit* (receive another card, face up) or *stick* (stick with their current cards). If they decide to *hit*, their cards will either total 21 or less, in which case they get to decide whether to *hit* or *stick* again (up to a total of 3 times), or they will be **bust** (their cards total exceed 21), in which case they loose and the dealer automatically wins.
### Dealer Round
If the player decides to *stick*, it's over to the dealer (computer). First, their second card, which was facing down until this point, will be turned face up. The dealer (computer) then decides whether they want to *hit* or *stick*, just like the player. The only differences are that:

- The dealer must *hit* if their score is less than 16
- The dealer must *hit* if their score is less than the players score

### Result
At the end of the dealers round, either the player or dealer will have won. 

---

## <a name="WaysToWin"></a> Ways to win
There's a few ways in which a result is reached:

### As cards are dealt:

- Player's hand exceeds 21, dealer automatically wins (or vis versa)
- Player's hand is less than or equal to 21 and contains 5 cards, winner automatically wins (or vis versa)

### After player and dealer have decided to *stick*:
- Player's hand value exceeds dealers hand value, player wins (or vis versa)
- Player's hand value and dealers hand value are the same but player has more cards, player wins (or vis versa)
- Player's hand value and dealers hand value are the same and both have the same number of cards, but player has a higher card, player wins (or vis versa)
- Player's hand value and dealers hand value are the same and both have the same number of cards and neither has a highest card, game reaches a draw.

---

## Sanity Checks
Selecting *stick* when your hand totals 10 or less will cause a popup to will appear asking to if you're sure you want to *stick* with your current score. You can select *yes* or *no*.

Likewise, selecting *hit* when your hand totals 18 or more will cause the same popup to appear, asking if you're sure you want another card. You can select *yes* or *no*.

---

## Score Tracking
The "current best hand score" is updated every time a card is dealt. As an Ace can be treated as a 1 or 11, the relevant value is selected to get the hand as close to 21 as possible without exceeding it. 

The total wins are also tracked, so you will see how many times the dealer has whooped your ass (at least in my case). This information is not preserved between screen refreshes.

---

## Possible Future Enhancements
- [x] Improve card dealing animation (delay between each card being dealt)
- [x] Have an option to disable popups entirely.
- [x] Store total wins (history) in cache so it's preserved between refreshes.
- [ ] Introduce betting.
