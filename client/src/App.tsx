import React from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import { OptionsPane } from './components/OptionsPane/OptionsPane';
import { InfoPane } from './components/InfoPane/InfoPane';
import { Footer } from './components/Footer/Footer'

const App: React.FC = () => {
  return (
    <AppProvider>
      <main>
        <div className='content'>
          <div className='grid'>
            <h1>Rock-paper-scissors</h1>
            <div className='panes'>
              <InfoPane />
              <OptionsPane />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </AppProvider>
  );
}

export default App;
