import React from 'react';
import './App.css';

import logo from './assets/logo.svg';

import RoutesComponent from './routes';

function App() {

  return (
    <div className="mx-auto mt-20 max-w-md w-full flex flex-col items-center">
      <img src={logo} alt="Aircnc Logo" />
      <div className="w-full bg-white mt-12 rounded-sm p-8">
        <RoutesComponent />
      </div>
    </div>
  );
}

export default App;
