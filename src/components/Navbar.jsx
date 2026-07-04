import React from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(
      "isLoggedIn"
    );

    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        MOVIES HUB
      </div>

      <div className="nav_links">
        <Link to="/home">
          Home
        </Link>

        <Link to="/search">
          Search
        </Link>

        <Link to="/watchlist">
          Watchlist
        </Link>

        <button
          className="logout_btn"
          onClick={logout}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;