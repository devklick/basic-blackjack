import React from "react";
import "./App.scss";
import Table from "./components/Table/Table";
import { useGameSettingsStore } from "./stores/gameSettingsStore";
import GameSettings from "./components/GameSettings/GameSettings";
import CheckBox from "./components/CheckBox/CheckBox";

const App: React.FC = () => {
  const { settingsModalOpen, setSettingsModelOpen } = useGameSettingsStore();

  return (
    <div className="App">
      <div className="Content">
        <CheckBox
          className="ToggleSettings"
          checked={settingsModalOpen}
          onChanged={(open) => setSettingsModelOpen(open)}
          symbol="☰"
        />
        {settingsModalOpen && <GameSettings />}
        <Table hide={settingsModalOpen} />
      </div>
    </div>
  );
};

export default App;
