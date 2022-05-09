import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies } from '../apt';

function Home() {
  const { data, isLoading } = useQuery(['movies', 'nowPlaying'], getMovies);
  console.log(data, isLoading);
  return (
    <HomeContainer>
      <p>Home</p>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  background-color: white;
  height: 200vh;
  margin-top: 200px;
`;

export default Home;
