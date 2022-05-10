import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies, GetMoviesResult } from '../apt';
import { makeImagePath } from '../utilities';

function Home() {
  const { data, isLoading } = useQuery<GetMoviesResult>(['movies', 'nowPlaying'], getMovies);
  const [initialData, setInitialData] = useState({
    title: '',
    overview: '',
    backdrop_path: '',
  });

  useEffect(() => {
    data &&
      setInitialData({
        title: data.results[2].title,
        overview: data.results[2].overview,
        backdrop_path: data.results[2].backdrop_path,
      });
  }, [data]);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Banner bgPhoto={makeImagePath(initialData.backdrop_path)}>
          <Title>{initialData.title}</Title>
          <Overview>{initialData.overview}</Overview>
        </Banner>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 70%;
`;

export default Home;
