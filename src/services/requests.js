const API_KEY = "314205789404a1f60b41ca52c8496820";

const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}`,

  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}`,

  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,

  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,

  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,

  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,

  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,

  fetchPopular: `/movie/popular?api_key=${API_KEY}`,

  fetchUpcoming: `/movie/upcoming?api_key=${API_KEY}`,
};

export default requests;

export { API_KEY };