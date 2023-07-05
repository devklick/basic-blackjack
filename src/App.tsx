import React from "react";
import "./App.scss";
import Table from "./components/Table";
import { useGameSettingsStore } from "./stores/gameSettingsStore";
import GameSettings from "./components/GameSettings";

const App: React.FC = () => {
  const { settingsModalOpen } = useGameSettingsStore();

  return (
    <div className="App">
      <div className="Content">
        {settingsModalOpen && <GameSettings />}
        {/* 
          Rather than conditionally rendering the table, 
          pass through a boolean to toggle whether it's displayed or not. 
          This preserves the state of the game, if settings accessed mid-hand. 
          Could consider moving the entire game state into a store
        */}
        <Table hide={settingsModalOpen} />
      </div>
    </div>
  );
};

export default App;
