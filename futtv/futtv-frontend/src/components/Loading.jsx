import React from 'react';
import '../styles/Loading.css';

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="ball"></div>
        <p className="loading-text">Carregando jogos...</p>
      </div>
    </div>
  );
}

export default Loading;