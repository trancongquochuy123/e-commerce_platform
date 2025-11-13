import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo">
          <h1>ShopLogo</h1>
        </div>

        {/* Search Section */}
        <div className="header-search">
          <input
            type="text"
            placeholder="Search for products..."
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>

        {/* Login and Cart Section */}
        <div className="header-actions">
          <button className="login-button">Login</button>
          <div className="cart-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-count">0</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
