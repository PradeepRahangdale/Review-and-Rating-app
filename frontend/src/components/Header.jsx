import { Link } from 'react-router-dom';
import { SearchIcon } from './Icons';

export default function Header({ search = '', onSearchChange, onSearchSubmit }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon" aria-hidden="true">
            ★
          </span>
          <span className="logo-text">
            Review<span className="logo-amp">&amp;</span>
            <span className="logo-rate">RATE</span>
          </span>
        </Link>

        <form
          className="header-search"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit?.();
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        <nav className="header-nav">
          <a href="#signup">SignUp</a>
          <a href="#login">Login</a>
        </nav>
      </div>
    </header>
  );
}
