import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./SearchBar.css";

function SearchBar({ isMobileSearchOpen, onMobileSearchClose }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchQuery = new URLSearchParams(search).get("search") || "";
  const [query, setQuery] = useState(searchQuery);

  function handleSearch(evt) {
    evt.preventDefault();
    navigate(`/?search=${encodeURIComponent(query.trim())}`);
    onMobileSearchClose?.();
  }

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  return (
    <>
      {/* Desktop Search */}
      <div className="search-desktop">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="search"
            placeholder="Search..."
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <Search />
          </button>
        </form>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="search-overlay">
          <div className="search-overlay-header">
            <button
              onClick={onMobileSearchClose}
              className="btn-secondary"
              aria-label="Close search"
            >
              <X />
            </button>

            <div className="search-mobile">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="search"
                  placeholder="Search..."
                  className="search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" aria-label="Search">
                  <Search />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBar;
