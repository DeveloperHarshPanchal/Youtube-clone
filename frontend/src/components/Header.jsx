import { Menu, Search, Bell } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import User from "./User";
import SearchBar from "./SearchBar";
import Logo from "./Logo";
import "./Header.css";

function Header({ toggleSideBar }) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <button
          onClick={toggleSideBar}
          className="sidebar-toggle btn-secondary"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <Logo />
      </div>

      {/* Desktop Search Bar */}
      <SearchBar
        isMobileSearchOpen={isMobileSearchOpen}
        onMobileSearchClose={() => setIsMobileSearchOpen(false)}
      />

      <div className="header-right">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="mobile-search-btn btn-secondary"
          aria-label="Open search"
        >
          <Search size={24} />
        </button>
        {/* Notifications */}
        <button
          className="notification-btn btn-secondary"
          aria-label="Notifications"
        >
          <Bell size={22} />
          {/* Optional badge */}
          <span className="notification-badge">3</span>
        </button>

        <ThemeToggle />
        <User />
      </div>
    </header>
  );
}

export default Header;
