import React from 'react';
import './App.css';
import Deck, { DeckType } from './components/Deck/Deck';

const App: React.FC = () => {
  return (
    <div className="App">
      <Deck type={DeckType.Standard}></Deck>
    </div>
  );
}

export default App;
