import React from 'react';
import './App.css';
import Login from './views/Login';
import SnackBarProvider from './context/SnackBarProvider';

function App() {
  return (
    <SnackBarProvider>
      <div className="App">
        <Login />
      </div>
    </SnackBarProvider>
  );
}

export default App;
