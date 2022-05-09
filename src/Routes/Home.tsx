import styled from 'styled-components';

function Home() {
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
