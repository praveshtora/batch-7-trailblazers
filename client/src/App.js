import React from 'react';
import './App.css';
import Login from './views/Login';
import SnackBarProvider from './context/SnackBarProvider';
import MemberList from './components/Board/Settings/MembersList';

function App() {
  return (
    <SnackBarProvider>
      <div className="App">
        {/* <Login /> */}
        <MemberList />
      </div>
    </SnackBarProvider>
  );
}

export default App;
