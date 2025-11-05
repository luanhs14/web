import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">Fut<strong>TV</strong></span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Próximos Jogos</Link>
          <Link to="/rodada/1" className="nav-link">Rodadas</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;