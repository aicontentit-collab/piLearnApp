import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const progress = keyframes`
  0% {
    width: 0%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 0%;
  }
`;

const Wrapper = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const BackgroundAnimation = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: ${float} 20s infinite ease-in-out;

  &:nth-child(1) {
    width: 300px;
    height: 300px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 200px;
    height: 200px;
    top: 60%;
    right: 15%;
    animation-delay: 3s;
  }

  &:nth-child(3) {
    width: 150px;
    height: 150px;
    bottom: 20%;
    left: 20%;
    animation-delay: 6s;
  }
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  animation: ${slideUp} 0.8s ease-out;

  @media (max-width: 600px) {
    margin: 20px;
    padding: 20px 20px;
  }
`;

const IconContainer = styled.div`
  margin-bottom: 0px;
  position: relative;
`;

const ConstructionIcon = styled.div`
  font-size: 70px;
  animation: ${bounce} 2s infinite;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #2d3748;
  margin-bottom: 10px;
  font-weight: 700;

  @media (max-width: 600px) {
    font-size: 2em;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2em;
  color: #718096;
  margin-bottom: 25px;
  line-height: 1.6;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  animation: ${progress} 3s ease-in-out infinite;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Feature = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size:30px;
  margin-bottom: 10px;
`;

const FeatureText = styled.div`
  font-size: 14px;
  color: #4a5568;
  font-weight: 600;
`;

const NotifyButton = styled.button`
  margin-top: 30px;
  padding: 15px 40px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: ${props => props.$notified 
    ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function ComingSoon() {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    setTimeout(() => {
      setNotified(false);
    }, 2000);
  };

  return (
    <Wrapper>
      <BackgroundAnimation>
        <Circle />
        <Circle />
        <Circle />
      </BackgroundAnimation>

      <Container>
        <IconContainer>
          <ConstructionIcon>🚧</ConstructionIcon>
        </IconContainer>

        <Title>Building Something Amazing</Title>
        <Subtitle>We're working hard to bring you an incredible new feature. Stay tuned!</Subtitle>

        <ProgressContainer>
          <ProgressBar />
        </ProgressContainer>

        <Features>
          <Feature>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureText>Lightning Fast</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>🎨</FeatureIcon>
            <FeatureText>Beautiful Design</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureText>Secure & Private</FeatureText>
          </Feature>
        </Features>

        <NotifyButton onClick={handleNotify} $notified={notified}>
          {notified ? "✓ You'll be notified!" : "Notify Me When Ready"}
        </NotifyButton>
      </Container>
    </Wrapper>
  );
}