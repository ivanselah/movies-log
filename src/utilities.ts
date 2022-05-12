export function makeImagePath(imagePath: string, imgaeSize?: string) {
  const BASE_URL = 'https://image.tmdb.org/t/p';
  const url = `${BASE_URL}/${imgaeSize ? imgaeSize : 'original'}${imagePath}`;
  return url;
}
