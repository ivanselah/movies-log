const API_KEY = '5b42baf14b999aeb69e9bef0f88d55da';
const BASE_PATH = 'https://api.themoviedb.org/3';

export async function getMovies() {
  return await (await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&page=1`)).json();
}
