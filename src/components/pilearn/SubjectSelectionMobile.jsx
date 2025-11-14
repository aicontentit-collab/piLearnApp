// src/components/pilearn/SubjectSelectionMobile.jsx
import React, { useMemo, useEffect } from "react";
import styled from "styled-components";
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Atom,
  Globe,
  Languages,
  Code,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const subjectIcons = {
  English: BookOpen,
  Mathematics: Calculator,
  Science: FlaskConical,
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Globe,
  "Social Studies": Globe,
  Hindi: Languages,
  "Computer Science": Code,
};

const Container = styled.div`
  padding: 3px;
  position: relative;
  overflow: visible;
`;

// Top-left back icon
const BackIconButton = styled.button`
  position: absolute;
  top: -38px;
  left: -20px;
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
  margin-bottom: 12px;
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

const Title = styled.h2`
  margin: 0 0 6px 0;
  font-size: clamp(20px, 5vw, 24px);
  font-weight: 900;
  color: #1f2937;
  font-family: Roboto, system-ui, -apple-system, Segoe UI, Inter, Roboto, sans-serif;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

const SubjectsGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
`;

const SubjectCard = styled.button`
  text-align: left;
  border-radius: 12px;
  padding: 12px;
  background: ${(props) => (props.$isSelected ? "#f3f4f6" : "#ffffff")};
  border: 2px solid ${(props) => (props.$isSelected ? "#4b5563" : "#e5e7eb")};
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.2s ease;
  animation: fadeUp 0.5s ease;
  animation-delay: ${(props) => props.$delay};
  animation-fill-mode: both;

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

  &:hover {
    border-color: ${(props) => (props.$isSelected ? "#4b5563" : "#d1d5db")};
    background: ${(props) => (props.$isSelected ? "#f3f4f6" : "#f9fafb")};
  }

  &:active {
    transform: scale(0.99);
  }
`;

const SubjectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SubjectName = styled.span`
  font-weight: 800;
  letter-spacing: -0.01em;
  font-size: 16px;
  color: #1f2937;
`;

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f6f7f9;
  border: 1px solid #e5e7eb;
  display: grid;
  place-items: center;
  color: #374151;
`;

export default function SubjectSelectionMobile({
  grades,
  selectedGrade,
  selectedSubject,
  onSelectSubject,
  onBack,
  onNext,
}) {
  const currentSubjects = useMemo(() => {
    const subjects =
      selectedGrade && grades?.[selectedGrade]?.subjects
        ? Object.keys(grades[selectedGrade].subjects)
        : [];
    return subjects;
  }, [grades, selectedGrade]);

  // 🔸 Auto-select "English" by default if nothing is selected yet
  useEffect(() => {
    if (!selectedSubject && currentSubjects.includes("English")) {
      onSelectSubject?.("English");
    }
  }, [selectedSubject, currentSubjects, onSelectSubject]);

  const handleSelect = (subject) => {
    // Select the subject and proceed
    onSelectSubject?.(subject);
    onNext?.();
  };

  return (
    <Container>
      <BackIconButton onClick={onBack} aria-label="Go back">
        <ChevronLeft size={24} />
      </BackIconButton>

      <Header>
        <Title>Pick a Subject</Title>
        <Subtitle>
          {selectedGrade
            ? `You chose ${selectedGrade}. Now select a subject.`
            : "Choose a grade first."}
        </Subtitle>
      </Header>

      <SubjectsGrid>
        {currentSubjects.map((subject, i) => {
          const IconC = subjectIcons[subject] || BookOpen;
          const isSelected =
            selectedSubject === subject ||
            (!selectedSubject && subject === "English");

          return (
            <SubjectCard
              key={subject}
              $isSelected={isSelected}
              $delay={`${i * 0.03}s`}
              aria-pressed={isSelected}
              onClick={() => handleSelect(subject)}
            >
              <SubjectInfo>
                <IconWrapper>
                  <IconC size={18} aria-hidden="true" />
                </IconWrapper>
                <SubjectName>{subject}</SubjectName>
              </SubjectInfo>
              <ChevronRight size={18} aria-hidden="true" />
            </SubjectCard>
          );
        })}
      </SubjectsGrid>
    </Container>
  );
}
