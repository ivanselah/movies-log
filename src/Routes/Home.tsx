import React, { Fragment, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getMovies, GetMoviesResult } from '../apt';
import { makeImagePath } from '../utilities';

const rowVariants = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};

const OFF_SET = 6;

function Home() {
  const { data, isLoading } = useQuery<GetMoviesResult>(['movies', 'nowPlaying'], getMovies);
  const [initialData, setInitialData] = useState({
    title: '',
    overview: '',
    backdrop_path: '',
  });

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    data &&
      setInitialData({
        title: data.results[0].title,
        overview: data.results[0].overview,
        backdrop_path: data.results[0].backdrop_path,
      });
  }, [data]);

  const increaseIndex = () => {
    if (leaving || !data) return;
    toggleLeaving();
    const totalMovies = data.results.length - 1;
    const maxIndex = Math.floor(totalMovies / OFF_SET) - 1;
    setIndex((index) => (index === maxIndex ? 0 : index + 1));
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

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
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                transition={{ type: 'tween', duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(OFF_SET * index, OFF_SET * index + OFF_SET)
                  .map((item) => {
                    return <Box bgPhoto={makeImagePath(item.backdrop_path, 'w500')}>{item.title}</Box>;
                  })}
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
  top: -300px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  height: 250px;
`;

export default Home;
