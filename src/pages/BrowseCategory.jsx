import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Row from "../components/Row";
import Banner from "../components/Banner";
import MovieCard from "../components/MovieCard";
import MediaModal from "../components/MediaModal";
import Footer from "../components/Footer";
import ToastContainer from "../components/Toast";
import api from "../services/api";
import { API_KEY } from "../services/requests";

const MOVIE_GENRES = [
  { id: "all", name: "All Genres" },
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 878, name: "Sci-Fi" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 16, name: "Animation" },
  { id: 99, name: "Documentary" },
  { id: 53, name: "Thriller" },
];

const TV_GENRES = [
  { id: "all", name: "All Genres" },
  { id: 10759, name: "Action & Adventure" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 9648, name: "Mystery" },
  { id: 16, name: "Animation" },
  { id: 80, name: "Crime" },
  { id: 10768, name: "War & Politics" },
];

function BrowseCategory({ type = "movie", pageTitle = "Movies" }) {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [gridItems, setGridItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const genres = type === "tv" ? TV_GENRES : MOVIE_GENRES;

  useEffect(() => {
    async function loadGenreItems() {
      setLoading(true);
      try {
        let endpoint = `/${type}/popular?api_key=${API_KEY}&page=1`;
        if (selectedGenre !== "all") {
          endpoint = `/discover/${type}?api_key=${API_KEY}&with_genres=${selectedGenre}&sort_by=popularity.desc`;
        }
        const res = await api.get(endpoint);
        setGridItems(res.data.results || []);
      } catch (err) {
        console.error("Failed to load category items", err);
      } finally {
        setLoading(false);
      }
    }

    loadGenreItems();
  }, [type, selectedGenre]);

  return (
    <div className="ott_category_page">
      <Navbar />
      <ToastContainer />

      {/* Category Header */}
      <div className="category_header_bar">
        <div className="category_title_group">
          <h1>{pageTitle}</h1>
          <div className="genre_dropdown_wrapper">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="genre_select_dropdown"
            >
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Genre Pills */}
        <div className="genre_pills_bar">
          {genres.slice(0, 7).map((g) => (
            <button
              key={g.id}
              className={`genre_pill_btn ${selectedGenre == g.id ? "active" : ""}`}
              onClick={() => setSelectedGenre(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="category_grid_section">
        {loading ? (
          <div className="category_loading">
            <div className="ott_spinner" />
            <p>Loading {pageTitle}...</p>
          </div>
        ) : (
          <div className="category_media_grid">
            {gridItems.map((item) => (
              <MovieCard
                key={item.id}
                movie={{ ...item, media_type: type }}
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

      <Footer />
    </div>
  );
}

export default BrowseCategory;
