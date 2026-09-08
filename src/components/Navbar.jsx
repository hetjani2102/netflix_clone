import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Users,
  Bookmark,
  Sparkles,
  Settings,
} from "lucide-react";
import {
  getActiveProfile,
  getProfiles,
  setActiveProfile,
  resetProfileSession,
} from "../services/storage";
import { showToast } from "./Toast";

function Navbar({ onSwitchProfile }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeProfile, setActiveProfileState] = useState(getActiveProfile());
  const [allProfiles, setAllProfiles] = useState(getProfiles());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setActiveProfileState(getActiveProfile());
      setAllProfiles(getProfiles());
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("profilesChanged", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("profilesChanged", handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSelectOtherProfile = (p) => {
    setActiveProfile(p);
    setActiveProfileState(p);
    setProfileOpen(false);
    showToast(`Switched to ${p.name}'s profile`, "success");
  };

  const triggerSwitchProfileScreen = () => {
    resetProfileSession();
    setProfileOpen(false);
    if (onSwitchProfile) {
      onSwitchProfile();
    } else {
      navigate("/home");
    }
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    resetProfileSession();
    showToast("Signed out successfully", "info");
    navigate("/");
  };

  return (
    <nav className={`ott_navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar_left">
        <Link to="/home" className="ott_logo">
          <span className="logo_accent">MOVIES</span>HUB
          <span className="logo_tag">PRO</span>
        </Link>

        <div className="ott_nav_links">
          <NavLink to="/home" className={({ isActive }) => (isActive ? "nav_item active" : "nav_item")}>
            Home
          </NavLink>
          <NavLink to="/tv" className={({ isActive }) => (isActive ? "nav_item active" : "nav_item")}>
            TV Shows
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => (isActive ? "nav_item active" : "nav_item")}>
            Movies
          </NavLink>
          <NavLink to="/popular" className={({ isActive }) => (isActive ? "nav_item active" : "nav_item")}>
            New & Popular
          </NavLink>
          <NavLink to="/watchlist" className={({ isActive }) => (isActive ? "nav_item active" : "nav_item")}>
            My List
          </NavLink>
        </div>
      </div>

      <div className="navbar_right">
        {/* Search Bar */}
        <div className={`ott_search_container ${searchOpen ? "open" : ""}`}>
          <button
            type="button"
            className="search_toggle_btn"
            onClick={() => {
              setSearchOpen(!searchOpen);
              if (!searchOpen) {
                setTimeout(() => searchInputRef.current?.focus(), 150);
              }
            }}
            aria-label="Search"
          >
            <Search size={19} />
          </button>
          <form onSubmit={handleSearchSubmit}>
            <input
              ref={searchInputRef}
              type="text"
              className="search_input"
              placeholder="Titles, people, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery) setSearchOpen(false);
              }}
            />
          </form>
        </div>

        {/* Kids Badge indicator if active profile is kids */}
        {activeProfile.isKids && <span className="navbar_kids_badge">KIDS</span>}

        {/* Notifications */}
        <div className="notif_container" ref={notifRef}>
          <button
            className="icon_btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="notif_badge">3</span>
          </button>

          {notificationsOpen && (
            <div className="notif_dropdown">
              <div className="notif_header">
                <h4>Notifications</h4>
                <span className="notif_pill">New</span>
              </div>
              <div className="notif_list">
                <div
                  className="notif_item"
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate("/popular");
                  }}
                >
                  <img
                    src="https://image.tmdb.org/t/p/w200/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg"
                    alt="New Release"
                  />
                  <div>
                    <p className="notif_title">New Season Dropped!</p>
                    <p className="notif_desc">Check out the latest trending hit show today.</p>
                    <span className="notif_time">2 hours ago</span>
                  </div>
                </div>
                <div
                  className="notif_item"
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate("/movies");
                  }}
                >
                  <img
                    src="https://image.tmdb.org/t/p/w200/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"
                    alt="Trending Movie"
                  />
                  <div>
                    <p className="notif_title">Top 10 in Movies Today</p>
                    <p className="notif_desc">Now streaming in 4K Ultra HD & Dolby Atmos.</p>
                    <span className="notif_time">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="profile_menu_container" ref={profileRef}>
          <div
            className="profile_trigger"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img src={activeProfile.avatar} alt="Profile Avatar" className="profile_avatar_img" />
            <ChevronDown size={15} className={`chevron ${profileOpen ? "rotate" : ""}`} />
          </div>

          {profileOpen && (
            <div className="profile_dropdown">
              {/* Active Profile Info */}
              <div className="profile_info_card">
                <img src={activeProfile.avatar} alt="User Avatar" />
                <div>
                  <p className="user_name">{activeProfile.name}</p>
                  <p className="user_badge">{activeProfile.plan}</p>
                </div>
              </div>

              {/* Other Profiles Switcher */}
              <div className="switch_profiles_list">
                {allProfiles
                  .filter((p) => p.id !== activeProfile.id)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="profile_switch_item"
                      onClick={() => handleSelectOtherProfile(p)}
                    >
                      <img src={p.avatar} alt={p.name} />
                      <span>{p.name}</span>
                      {p.isKids && <span className="mini_kids_tag">KIDS</span>}
                    </div>
                  ))}
              </div>

              <div className="dropdown_divider" />

              <button className="dropdown_link" onClick={triggerSwitchProfileScreen}>
                <Users size={16} /> Manage / Switch Profiles
              </button>

              <Link
                to="/watchlist"
                className="dropdown_link"
                onClick={() => setProfileOpen(false)}
              >
                <Bookmark size={16} /> My Watchlist
              </Link>
              <Link
                to="/popular"
                className="dropdown_link"
                onClick={() => setProfileOpen(false)}
              >
                <Sparkles size={16} /> New & Popular
              </Link>

              <div className="dropdown_divider" />

              <button className="dropdown_logout" onClick={logout}>
                <LogOut size={16} /> Sign Out of MoviesHub
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile_hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile_nav_drawer">
          <NavLink to="/home" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/tv" onClick={() => setMobileMenuOpen(false)}>TV Shows</NavLink>
          <NavLink to="/movies" onClick={() => setMobileMenuOpen(false)}>Movies</NavLink>
          <NavLink to="/popular" onClick={() => setMobileMenuOpen(false)}>New & Popular</NavLink>
          <NavLink to="/watchlist" onClick={() => setMobileMenuOpen(false)}>My List</NavLink>
          <button className="mobile_link_btn" onClick={triggerSwitchProfileScreen}>Switch Profile</button>
          <button className="mobile_logout" onClick={logout}>Sign Out</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;