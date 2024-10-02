import React from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import { Left } from './components/Left';
import { Right } from './components/Right';

const URL = 'http://localhost:8080';

const App: React.FC = () => {
  return (
    <AppProvider url={URL}>
      <main>
        <Left />
        <Right />
      </main>
    </AppProvider>
  );
}

export default App;
