// src/components/pilearn/GradeSelectorMobile.jsx
import React from "react";
import styled from "styled-components";
import {ChevronLeft,ChevronRight} from "lucide-react";

const Container = styled.div`
padding: 35px;
position: relative;
overflow: visible;
`;

// Top-left back icon
const BackIconButton = styled.button`
  position: absolute;
  top: -38px;  /* Moves it outside the card's top padding */
  left: -20px; /* Moves it slightly outside the left edge */
  background: #ffffff;
  border: 2px solid #e2e8f0;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;
  z-index: 10;

  &:hover {
    background: #f1f5f9;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;


const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  animation: slideIn 0.6s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
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
  margin: 0;
  color: #64748b;
  font-size: 15px;
  font-weight: 500;
`;

const PickerContainer = styled.div`
  display: grid;
  place-items: center;
  margin-bottom: 16px;
  animation: fadeUp 0.6s ease 0.2s both;

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

const WheelWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
  height: 240px;
  overflow-y: auto;
  background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 50%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  scroll-snap-type: y mandatory;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);

  &::-webkit-scrollbar {
    width: 0;
  }
`;



const FadeOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(to bottom,
    rgba(248, 250, 252, 0.95) 0%,
    transparent 25%,
    transparent 75%,
    rgba(248, 250, 252, 0.95) 100%
  );
`;

const OptionsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const OptionItem = styled.li`
  height: ${props => props.$height}px;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #64748b;
  scroll-snap-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeUp 0.5s ease;
  animation-delay: ${props => props.$delay};
  animation-fill-mode: both;
  user-select: none;
  font-size: 16px;

  ${props => props.$isSelected && `
    color: #323536;
    font-size: 20px;
    font-weight: 900;
    transform: scale(1.05);
  `}

  &:hover {
    color: #2c2f30;
    transform: scale(1.02);
  }
`;

const Spacer = styled.li`
  height: ${props => props.$height};
`;

const ButtonGroup = styled.div`
  position: sticky;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
  padding-top: 8px;
  animation: fadeUp 0.6s ease 0.4s both;
`;

const Button = styled.button`
  padding: 14px 16px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;


const ContinueButton = styled(Button)`
  border: 2px solid transparent;
  background: #374151;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #4b5563;
  }
`;


function WheelPicker({ options, value, onChange, onNext }) {
  const ITEM_H = 48;
  const ref = React.useRef(null);

  const handleItemClick = (option) => {
    const idx = options.indexOf(option);
    if (idx === -1) return;

    const pad = ref.current.clientHeight / 2 - ITEM_H / 2;
    ref.current.scrollTo({
      top: pad + idx * ITEM_H,
      behavior: "smooth",
    });

    onChange(option);
    if (onNext) onNext(); // 👈 Automatically go next on selection
  };

  const padStyle = { height: `calc(50% - ${ITEM_H / 2}px)` };

  return (
    <PickerContainer>
      <WheelWrapper ref={ref}>
        <FadeOverlay />
        <OptionsList>
          <Spacer $height={padStyle.height} />
          {options.map((opt, i) => (
            <OptionItem
              key={opt}
              $height={ITEM_H}
              $delay={`${i * 0.02}s`}
              $isSelected={opt === value}
              onClick={() => handleItemClick(opt)}
            >
              {opt}
            </OptionItem>
          ))}
          <Spacer $height={padStyle.height} />
        </OptionsList>
      </WheelWrapper>
    </PickerContainer>
  );
}

export default function GradeSelectorMobile({ grades, selectedGrade, onSelect, onBack, onNext }) {
  const options = Object.keys(grades);

  React.useEffect(() => {
    if (!selectedGrade && options.length > 0) onSelect(options[0]);
  }, [selectedGrade, options, onSelect]);

  return (
    <Container>
      <BackIconButton onClick={onBack} aria-label="Go back">
        <ChevronLeft size={24} />
      </BackIconButton>
      <Header>
        <Title>Choose your Grade</Title>
        <Subtitle>Swipe or tap to select a grade.</Subtitle>
      </Header>

      <WheelPicker
        options={options}
        value={selectedGrade || options[0]}
        onChange={onSelect}
        onNext={onNext} // 👈 Pass down the onNext handler
      />
    </Container>
  );
}
