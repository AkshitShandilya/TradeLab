import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <img src="/src/assets/Logo.png" alt="App Logo" className="navbar-logo" />
          <span className="navbar-title">TradeLab</span>
        </div>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/rsi">RSI</Link>
          <Link to="/moving-average">Moving Average</Link>
          <Link to="/stock-game">Guess the stock!</Link>
        </nav>
      </div>
    </header>
  );
}
