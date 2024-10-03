import React from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import { LeftPane } from './components/LeftPane/LeftPane';
import { RightPane } from './components/RightPane/RightPane';

const App: React.FC = () => {
  return (
    <AppProvider>
      <main>
        <div className='grid'>
          <h1>Rock-paper-scissors</h1>
          <div className='content'>
            <LeftPane />
            <RightPane />
          </div>
        </div>
      </main>
    </AppProvider>
  );
}

export default App;
