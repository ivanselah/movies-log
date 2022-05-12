import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getMovies, GetMoviesResult, MovieProps } from '../apt';
import { makeImagePath } from '../utilities';
import { PathMatch, useMatch, useNavigate } from 'react-router-dom';

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

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      type: 'tween',
      delay: 0.3,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 0.3,
    },
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
  const navigator = useNavigate();
  const movieMatch: PathMatch<string> | null = useMatch('/movies/:movieId');
  const [isVisibleMovieModal, setIsVisibleMovieModal] = useState(false);
  const [selectedMovieInfo, setSelectedMovieInfo] = useState<MovieProps | undefined>(undefined);

  useEffect(() => {
    data &&
      setInitialData({
        title: data.results[0].title,
        overview: data.results[0].overview,
        backdrop_path: data.results[0].backdrop_path,
      });
  }, [data]);

  useEffect(() => {
    if (movieMatch) {
      setIsVisibleMovieModal(true);
      const clickMovieInfo =
        movieMatch?.params.movieId &&
        data?.results.find((movie) => String(movie.id) === String(movieMatch.params.movieId));
      clickMovieInfo && setSelectedMovieInfo(clickMovieInfo as MovieProps);
    }
  }, [movieMatch, data?.results]);

  const increaseIndex = () => {
    if (leaving || !data) return;
    toggleLeaving();
    const totalMovies = data.results.length - 1;
    const maxIndex = Math.floor(totalMovies / OFF_SET) - 1;
    setIndex((index) => (index === maxIndex ? 0 : index + 1));
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClick = (movieId: number) => {
    navigator(`movies/${movieId}`);
  };

  const onCloseModal = () => {
    if (isVisibleMovieModal) {
      navigator('/', { replace: true });
      setIsVisibleMovieModal(false);
    }
  };

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
                  .map((movie) => {
                    return (
                      <Box
                        key={movie.id}
                        layoutId={String(movie.id)}
                        onClick={() => onBoxClick(movie.id)}
                        variants={boxVariants}
                        bgphoto={makeImagePath(movie.backdrop_path, 'w500')} //
                        initial='normal'
                        transition={{ type: 'tween' }}
                        whileHover='hover'
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    );
                  })}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {movieMatch && (
              <>
                (
                <Overlay onClick={onCloseModal} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MovieModal layoutId={String(movieMatch?.params.movieId)}>
                    {selectedMovieInfo && (
                      <>
                        <ModalInnerBox bgPhoto={makeImagePath(selectedMovieInfo.backdrop_path, 'w500')}>
                          <div />
                          <h2>{selectedMovieInfo.title}</h2>
                          <p>{selectedMovieInfo.overview}</p>
                        </ModalInnerBox>
                      </>
                    )}
                  </MovieModal>
                </Overlay>
                ) : null
              </>
            )}
          </AnimatePresence>
        </Fragment>
      )}
    </Wrapper>
  );
}

const ModalInnerBox = styled(motion.div)<{ bgPhoto: string }>`
  div {
    width: 100%;
    height: 500px;
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent), url(${(props) => props.bgPhoto});
    background-size: cover;
  }
  h2 {
    width: 100%;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, 30%);
    text-align: center;
    font-size: 23px;
    font-weight: bold;
  }
  p {
    padding: 10px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 200vh;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

const MovieModal = styled(motion.div)`
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  top: 100px;
  left: 30%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.5);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.5);
  -moz-box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.5);
`;

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

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  height: 200px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
    margin-left: 20px;
  }
  &:last-child {
    transform-origin: center right;
    margin-right: 20px;
  }
  box-shadow: 10px 10px 5px 0px rgba(255, 255, 255, 0.2);
  -webkit-box-shadow: 0px 2px 3px 0px rgba(255, 255, 255, 0.1);
  -moz-box-shadow: 10px 10px 5px 0px rgba(255, 255, 255, 0.2);
`;

const Info = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  h4 {
    padding: 10px;
    text-align: center;
    font-size: 13px;
  }
`;

export default Home;
