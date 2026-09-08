const API_KEY = "314205789404a1f60b41ca52c8496820";

const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}`,
  fetchTrendingMovies: `/trending/movie/week?api_key=${API_KEY}`,
  fetchTrendingTV: `/trending/tv/week?api_key=${API_KEY}`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}`,
  fetchTopRatedTV: `/tv/top_rated?api_key=${API_KEY}`,
  fetchPopular: `/movie/popular?api_key=${API_KEY}`,
  fetchPopularTV: `/tv/popular?api_key=${API_KEY}`,
  fetchUpcoming: `/movie/upcoming?api_key=${API_KEY}`,
  fetchOnTheAirTV: `/tv/on_the_air?api_key=${API_KEY}`,
  
  // Genres - Movies
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchSciFiMovies: `/discover/movie?api_key=${API_KEY}&with_genres=878`,
  fetchAnimationMovies: `/discover/movie?api_key=${API_KEY}&with_genres=16`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchThrillerMovies: `/discover/movie?api_key=${API_KEY}&with_genres=53`,

  // Genres - TV Series
  fetchActionTV: `/discover/tv?api_key=${API_KEY}&with_genres=10759`,
  fetchComedyTV: `/discover/tv?api_key=${API_KEY}&with_genres=35`,
  fetchDramaTV: `/discover/tv?api_key=${API_KEY}&with_genres=18`,
  fetchSciFiTV: `/discover/tv?api_key=${API_KEY}&with_genres=10765`,
  fetchMysteryTV: `/discover/tv?api_key=${API_KEY}&with_genres=9648`,
  fetchAnimationTV: `/discover/tv?api_key=${API_KEY}&with_genres=16`,
};

export default requests;
export { API_KEY };