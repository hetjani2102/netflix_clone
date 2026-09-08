import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import MovieCard from "./MovieCard";

function Row({
  title,
  fetchUrl,
  customItems = null,
  isLarge = false,
  isBackdrop = false,
  isTop10 = false,
  onOpenModal,
}) {
  const [movies, setMovies] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    if (customItems) {
      setMovies(customItems);
      return;
    }

    if (!fetchUrl) return;

    async function fetchMovies() {
      try {
        const res = await api.get(fetchUrl);
        setMovies(res.data?.results || []);
      } catch (err) {
        console.error("Row fetch failed", err);
      }
    }

    fetchMovies();
  }, [fetchUrl, customItems]);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 20);
  };

  const handleScroll = (direction) => {
    if (!rowRef.current) return;
    const { clientWidth } = rowRef.current;
    const scrollDistance = clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollDistance : scrollDistance,
      behavior: "smooth",
    });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className={`ott_row ${isTop10 ? "row_top10" : ""}`}>
      <div className="row_header">
        <h2 className="row_title">{title}</h2>
        <span className="row_explore_link">Explore All ›</span>
      </div>

      <div className="row_slider_wrapper">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            className="row_arrow arrow_left"
            onClick={() => handleScroll("left")}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={34} />
          </button>
        )}

        {/* Carousel Slider */}
        <div
          className="row_slider"
          ref={rowRef}
          onScroll={checkScroll}
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              rank={isTop10 ? index + 1 : undefined}
              isLarge={isLarge}
              isBackdrop={isBackdrop}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            className="row_arrow arrow_right"
            onClick={() => handleScroll("right")}
            aria-label="Scroll Right"
          >
            <ChevronRight size={34} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Row;