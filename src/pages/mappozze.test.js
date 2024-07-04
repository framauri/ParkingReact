// src/App.js
import React from 'react';
import Mappozze from './mappozze';
import '../mappozze.css';  // Importa il file CSS 

function Maps() {
  return (
    <div className="Mappiamo">
      <h1>Parking lots near you</h1>
      <Mappozze />
    </div>
  );
}

export default Maps;
