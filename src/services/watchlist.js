export const getWatchlist = () => {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
};

export const addToWatchlist = (movie) => {
  const list = getWatchlist();

  const exists = list.find((item) => item.id === movie.id);

  if (!exists) {
    localStorage.setItem(
      "watchlist",
      JSON.stringify([...list, movie])
    );
  }
};

export const removeFromWatchlist = (id) => {
  const list = getWatchlist();

  const updated = list.filter((movie) => movie.id !== id);

  localStorage.setItem(
    "watchlist",
    JSON.stringify(updated)
  );
};