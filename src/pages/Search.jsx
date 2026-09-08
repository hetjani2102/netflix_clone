import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MediaModal from "../components/MediaModal";
import ToastContainer from "../components/Toast";
import api from "../services/api";
import { API_KEY } from "../services/requests";

const POPULAR_SEARCH_TAGS = [
  "Stranger Things",
  "Breaking Bad",
  "Spider-Man",
  "The Batman",
  "Anime",
  "Action",
  "Cyberpunk",
  "Horror",
];

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [filterType, setFilterType] = useState("all"); // all, movie, tv
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null && q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );
        const filtered = (res.data.results || []).filter(
          (item) =>
            (item.media_type === "movie" || item.media_type === "tv") &&
            (item.poster_path || item.backdrop_path)
        );
        setResults(filtered);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchParams({});
    setResults([]);
  };

  const displayedResults = results.filter((item) => {
    if (filterType === "all") return true;
    return item.media_type === filterType;
  });

  return (
    <div className="ott_search_page">
      <Navbar />
      <ToastContainer />

      <div className="search_header_hero">
        <div className="search_input_box">
          <SearchIcon size={22} className="search_box_icon" />
          <input
            type="text"
            placeholder="Search movies, TV shows, genres, actors..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="search_clear_btn" onClick={clearSearch}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Type Pills */}
        {results.length > 0 && (
          <div className="search_filter_tabs">
            <button
              className={`search_tab ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
            >
              All Results ({results.length})
            </button>
            <button
              className={`search_tab ${filterType === "movie" ? "active" : ""}`}
              onClick={() => setFilterType("movie")}
            >
              Movies
            </button>
            <button
              className={`search_tab ${filterType === "tv" ? "active" : ""}`}
              onClick={() => setFilterType("tv")}
            >
              TV Shows
            </button>
          </div>
        )}
      </div>

      {/* Results or Suggestions */}
      <div className="search_content_area">
        {loading && (
          <div className="search_loading_state">
            <div className="ott_spinner" />
            <p>Searching MoviesHub catalog...</p>
          </div>
        )}

        {!loading && query && displayedResults.length === 0 && (
          <div className="search_empty_state">
            <p className="no_results_text">No matches found for "{query}"</p>
            <p className="suggestions_hint">Suggestions:</p>
            <ul>
              <li>Try different keywords or check spelling</li>
              <li>Looking for a movie or TV show? Try searching by actor or director</li>
              <li>Explore popular trending titles below</li>
            </ul>
          </div>
        )}

        {!query && (
          <div className="search_popular_tags">
            <h3>
              <Sparkles size={18} className="sparkle_icon" /> Popular Searches
            </h3>
            <div className="tags_cloud">
              {POPULAR_SEARCH_TAGS.map((tag, idx) => (
                <button
                  key={idx}
                  className="search_tag_chip"
                  onClick={() => handleQueryChange(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {displayedResults.length > 0 && (
          <div className="search_results_grid">
            {displayedResults.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onOpenModal={setSelectedMedia}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onSelectMedia={(item) => setSelectedMedia(item)}
        />
      )}
    </div>
  );
}

export default Search;