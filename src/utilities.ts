export function makeImagePath(imagePath: string, imgaeSize?: string) {
  const BASE_URL = 'https://image.tmdb.org/t/p';
  const temp = `${BASE_URL}/${imgaeSize ? imgaeSize : 'original'}${imagePath}`;
  console.log(temp);
  return temp;
}
