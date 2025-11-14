// src/components/pilearn/IntroMobile.jsx
import React from "react";
import styled from "styled-components";
import { ArrowRight } from "lucide-react";

const Container = styled.div`
  padding: 35px;
  text-align: center;
  display: grid;
  gap: 16px;
  animation: fadeUp 0.5s ease;

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const IconWrapper = styled.div`
  height: 88px;
  width: 88px;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  place-items: center;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
  background: transparent;
  animation: pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes pop {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const LogoImg = styled.img`
  height: 70%;
  width: 70%;
  object-fit: cover; /* ensures it fills the circle */
  border-radius: 50%; /* ensures circular clipping */
`;

const Header = styled.div`
  animation: slideIn 0.5s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: clamp(22px, 5vw, 28px);
  font-weight: 900;
  background: #374151;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: Roboto, system-ui, -apple-system, Segoe UI, Inter, Roboto, sans-serif;
`;

const Subtitle = styled.p`
  margin: 6px 0 0 0;
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #374151;
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  animation: fadeUp 0.5s ease;
  animation-delay: 0.15s;
  animation-fill-mode: both;

  &:hover {
    background: #4b5563;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function IntroMobile({ onStart }) {
  return (
    <Container>
      <IconWrapper>
        <LogoImg
          src="https://th.bing.com/th/id/OIP.uSFDPMfkxTDmRZEJvOe_lAHaHa?w=108&h=108&c=1&bgcl=e66538&r=0&o=7&dpr=1.1&pid=ImgRC&rm=3"
          alt="PW Logo"
        />
      </IconWrapper>

      <Header>
        <Title>Welcome to Pi learn</Title>
        <Subtitle>
          Your personalized learning journey starts here. Connect with expert teachers and unlock your full potential.
        </Subtitle>
      </Header>

      <StartButton onClick={onStart} aria-label="Get started">
        Get Started <ArrowRight size={18} />
      </StartButton>
    </Container>
  );
}
