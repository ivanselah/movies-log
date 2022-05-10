import React, { Fragment, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getMovies, GetMoviesResult } from '../apt';
import { makeImagePath } from '../utilities';

const rowVariants = {
  hidden: {
    x: 1000,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -1000,
  },
};

function Home() {
  const { data, isLoading } = useQuery<GetMoviesResult>(['movies', 'nowPlaying'], getMovies);
  const [initialData, setInitialData] = useState({
    title: '',
    overview: '',
    backdrop_path: '',
  });

  const [index, setIndex] = useState(0);

  useEffect(() => {
    data &&
      setInitialData({
        title: data.results[2].title,
        overview: data.results[2].overview,
        backdrop_path: data.results[2].backdrop_path,
      });
  }, [data]);

  const increaseIndex = () => setIndex((index) => index + 1);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Fragment>
          <Banner onClick={increaseIndex} bgPhoto={makeImagePath(initialData.backdrop_path)}>
            <Title>{initialData.title}</Title>
            <Overview>{initialData.overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence>
              <Row variants={rowVariants} initial='hidden' animate='visible' exit='exit' key={index}>
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
              </Row>
            </AnimatePresence>
          </Slider>
        </Fragment>
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

const Slider = styled.div`
  position: relative;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  height: 200px;
`;

export default Home;
