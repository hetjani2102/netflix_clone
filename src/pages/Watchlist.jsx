import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Film, Tv, Sparkles, Trash2, ArrowUpDown } from "lucide-react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MediaModal from "../components/MediaModal";
import Footer from "../components/Footer";
import ToastContainer, { showToast } from "../components/Toast";
import { getWatchlist, removeFromWatchlist } from "../services/storage";

function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("all"); // all, movie, tv
  const [sortBy, setSortBy] = useState("recent"); // recent, rating, title
  const [selectedMedia, setSelectedMedia] = useState(null);

  const loadList = () => {
    setMovies(getWatchlist());
  };

  useEffect(() => {
    loadList();
    const handleUpdate = () => loadList();
    window.addEventListener("watchlistUpdated", handleUpdate);
    return () => window.removeEventListener("watchlistUpdated", handleUpdate);
  }, []);

  const handleRemove = (id) => {
    removeFromWatchlist(id);
    loadList();
    showToast("Removed from My List", "info");
  };

  // Filter
  const filtered = movies.filter((m) => {
    if (filter === "all") return true;
    const type = m.first_air_date || m.media_type === "tv" ? "tv" : "movie";
    return type === filter;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") {
      return (b.vote_average || 0) - (a.vote_average || 0);
    }
    if (sortBy === "title") {
      const titleA = a.title || a.name || "";
      const titleB = b.title || b.name || "";
      return titleA.localeCompare(titleB);
    }
    return 0; // recent (stored order)
  });

  return (
    <div className="ott_watchlist_page">
      <Navbar />
      <ToastContainer />

      <div className="watchlist_header">
        <div className="watchlist_title_group">
          <h1>My List</h1>
          <span className="watchlist_count_badge">{movies.length} titles</span>
        </div>

        {movies.length > 0 && (
          <div className="watchlist_controls">
            {/* Filter Tabs */}
            <div className="watchlist_filter_pills">
              <button
                className={`filter_pill ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`filter_pill ${filter === "movie" ? "active" : ""}`}
                onClick={() => setFilter("movie")}
              >
                Movies
              </button>
              <button
                className={`filter_pill ${filter === "tv" ? "active" : ""}`}
                onClick={() => setFilter("tv")}
              >
                TV Shows
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="sort_dropdown_wrapper">
              <ArrowUpDown size={15} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="watchlist_sort_select"
              >
                <option value="recent">Recently Added</option>
                <option value="rating">Top Rated</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="ott_empty_watchlist">
          <div className="empty_icon_box">
            <Bookmark size={48} />
          </div>
          <h2>Your List is empty</h2>
          <p>
            Explore movies and TV shows and click the <strong>+</strong> button to add them to your watchlist.
          </p>
          <Link to="/popular" className="browse_cta_btn">
            <Sparkles size={18} /> Browse Trending Titles
          </Link>
        </div>
      ) : (
        <div className="watchlist_media_grid">
          {sorted.map((movie) => (
            <div key={movie.id} className="watchlist_card_item">
              <MovieCard
                movie={movie}
                onOpenModal={setSelectedMedia}
              />
            </div>
          ))}
        </div>
      )}

      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onSelectMedia={(item) => setSelectedMedia(item)}
        />
      )}

      <Footer />
    </div>
  );
}

export default Watchlist;