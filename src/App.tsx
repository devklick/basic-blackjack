import React from 'react';
import './App.scss';
import Table from './components/Table/Table';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className='Content'>
        <Table />
      </div>
    </div>
  );
}

export default App;
