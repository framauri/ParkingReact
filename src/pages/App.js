// src/App.js
import React from 'react';
import UserProfile from './userProfile';
import '../style.css';  // Importa il file CSS

const App = () => {
  // Sostituisci con un ID utente che esiste nel tuo database
  const userId = '1'; // Cambia questo con un userId reale presente nel tuo database

  return (
    <div className="App">
      <UserProfile userId={userId} />
    </div>
  );
};

export default App;