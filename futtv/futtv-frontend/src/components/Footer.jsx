import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          ⚽ <strong>FutTV</strong> - Onde assistir jogos do Brasileirão
        </p>
        <p className="footer-copy">
          © 2025 FutTV. Feito com ❤️ para os fãs de futebol. Disponível em{' '}
          <a href="https://futtv.hserver.pro" target="_blank" rel="noopener noreferrer">
            futtv.hserver.pro
          </a>.
        </p>
      </div>
    </footer>
  );
}

export default Footer;