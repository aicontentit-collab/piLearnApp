// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, createGlobalStyle, css } from "styled-components";

import IntroMobile from "../components/pilearn/IntroMobile";
import GradeSelectorMobile from "../components/pilearn/GradeSelectorMobile";
import SubjectSelectionMobile from "../components/pilearn/SubjectSelectionMobile";
import TeacherSelectionMobile from "../components/pilearn/TeacherSelectionMobile";
import { grades } from "../data/gradeData";
import Cookies from "js-cookie";

/** neutral UI tokens (no gradients, light gray accents) */
const ui = {
  bg: "#ffffff",
  text: "#0f172a",
  subtext: "#475569",
  border: "#e5e7eb",
  card: "#ffffff",
  soft: "#f3f4f6",
  soft2: "#f8fafc",
  focus: "#d1d5db",
  btn: "#e5e7eb",
  btnText: "#0f172a",
};

/* ---------- global resets + animations ---------- */
const GlobalStyle = createGlobalStyle`
  * { -webkit-tap-highlight-color: transparent; }
  :root { color-scheme: light; }
  body {
    margin: 0;
    background: ${ui.bg};
    color: ${ui.text};
    font-family: Roboto, system-ui, -apple-system, Segoe UI, Inter, Roboto, sans-serif;
  }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pop = keyframes`
  0% { transform: scale(.96); }
  100% { transform: scale(1); }
`;

/* ---------- layout ---------- */
const Page = styled.div`
  min-height: 90svh;
  display: flex;
  align-items: ${({ $alignTop }) => ($alignTop ? "flex-start" : "center")};
  justify-content: center;
  padding: ${({ $alignTop }) => ($alignTop ? "32px 16px 16px" : "16px")};
  background: ${ui.bg};
  animation: ${fadeUp} 0.42s ease-out both;
`;

const Shell = styled.div`
  width: 100%;
  max-width: 720px;
`;

const Card = styled.div`
  background: ${ui.card};
  border: ${({ $step }) => ($step === 3 ? "none" : `1px solid ${ui.border}`)};
  border-radius: 16px;
  padding: 16px;
  box-shadow: ${({ $step }) =>
    $step === 3 ? "none" : "0 8px 24px rgba(0,0,0,0.05)"};
  transition: transform 0.12s ease;
  animation: ${pop} 0.18s ease-out both;
`;

/* ---------- step indicator ---------- */
const StepIndicator = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 12px;
  animation: ${slideIn} 0.4s ease-out both;
`;

const Dot = styled.div`
  height: 8px;
  width: 12px;
  border-radius: 999px;
  background: ${ui.border};
  transition: width 180ms, background-color 180ms;

  ${({ $active }) =>
    $active &&
    css`
      width: 32px;
      background: ${ui.focus};
    `}
`;

/* ---------- storage helpers ---------- */
const WIZARD_KEY = "pilearn:wizard";

function saveWizardState(state) {
  try {
    sessionStorage.setItem(WIZARD_KEY, JSON.stringify(state));
  } catch {
    console.error("Failed to save wizard state");
  }
}

function loadWizardState() {
  try {
    const raw = sessionStorage.getItem(WIZARD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearWizardState() {
  try {
    sessionStorage.removeItem(WIZARD_KEY);
  } catch {
    console.error("Failed to clear wizard state");
  }
}

function isReloadNavigation() {
  // Navigation Timing Level 2
  const [nav] = performance.getEntriesByType("navigation");
  if (nav && "type" in nav) {
    return nav.type === "reload";
  }
  // Fallback (older browsers)
  // performance.navigation.type === 1 means reload
  // @ts-ignore
  if (performance && performance.navigation) {
    // @ts-ignore
    return performance.navigation.type === 1;
  }
  return false;
}

/* ---------- component ---------- */
export default function Home() {
  const navigate = useNavigate();

  // Init state
  const [step, setStep] = useState(0); // 0:intro 1:grade 2:subject 3:teacher
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null); // teacher object

  const hasHydratedRef = useRef(false);

  // Hydrate from sessionStorage unless this is a full page reload
  useEffect(() => {
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    if (isReloadNavigation()) {
      // On a real page refresh, reset to step 0 (also first time open).
      clearWizardState();
      setStep(0);
      setSelectedGrade("");
      setSelectedSubject("");
      setSelectedTeacher(null);
      return;
    }

    const saved = loadWizardState();
    if (saved && typeof saved === "object") {
      setStep(Number(saved.step) || 0);
      setSelectedGrade(saved.selectedGrade || "");
      setSelectedSubject(saved.selectedSubject || "");
      setSelectedTeacher(saved.selectedTeacher || null);
    } else {
      // first time open
      setStep(0);
    }
  }, []);

  // Persist to sessionStorage on any relevant change (for in-app navigation)
  useEffect(() => {
    saveWizardState({
      step,
      selectedGrade,
      selectedSubject,
      selectedTeacher,
    });
  }, [step, selectedGrade, selectedSubject, selectedTeacher]);

  const resolveTeacherObject = () => {
    if (
      selectedTeacher &&
      typeof selectedTeacher === "object" &&
      selectedTeacher.id
    ) {
      return selectedTeacher;
    }
    const list =
      (selectedGrade &&
        selectedSubject &&
        grades[selectedGrade]?.subjects?.[selectedSubject]) ||
      [];
    return list[0] || null;
  };

  const onTeacherConfirm = (maybeTeacherObj) => {
    const teacher = maybeTeacherObj || resolveTeacherObject();
    if (!selectedGrade || !selectedSubject || !teacher || !teacher.id) return;

    // Set cookie with selected teacher's id
    const piLearnData = {
      teacherId: teacher.id,
    };
    Cookies.set("piLearnData", JSON.stringify(piLearnData), {
      expires: 30,
      sameSite: "lax",
      // secure: true, // enable on HTTPS
    });

    navigate("/teacher", {
      state: {
        grade: selectedGrade,
        subject: selectedSubject,
        teacherId: teacher.id,
      },
    });
  };

  return (
    <>
      <GlobalStyle />
      <Page $alignTop={step === 3}>
        <Shell>
          <Card $step={step}>
            <StepIndicator>
              {[1, 2, 3].map((s) => (
                <Dot key={s} $active={step === s} />
              ))}
            </StepIndicator>

            {step === 0 && <IntroMobile onStart={() => setStep(1)} ui={ui} />}

            {step === 1 && (
              <GradeSelectorMobile
                ui={ui}
                grades={grades}
                selectedGrade={selectedGrade}
                onSelect={(g) => {
                  setSelectedGrade(g);
                  setSelectedSubject("");
                  setSelectedTeacher(null); // reset to null
                }}
                onBack={() => setStep(0)}
                onNext={() => selectedGrade && setStep(2)}
              />
            )}

            {step === 2 && (
              <SubjectSelectionMobile
                ui={ui}
                grades={grades}
                selectedGrade={selectedGrade}
                selectedSubject={selectedSubject}
                onSelectSubject={(s) => {
                  setSelectedSubject(s);
                  setSelectedTeacher(null); // reset to null
                }}
                onBack={() => setStep(1)}
                onNext={() => selectedSubject && setStep(3)}
              />
            )}

            {step === 3 && (
              <TeacherSelectionMobile
                ui={ui}
                grades={grades}
                selectedGrade={selectedGrade}
                selectedSubject={selectedSubject}
                selectedTeacher={selectedTeacher} // object
                onSelectTeacher={(t) => {
                  setSelectedTeacher(t); // persist via effect
                }}
                onBack={() => setStep(2)}
                onConfirm={onTeacherConfirm}
              />
            )}
          </Card>
        </Shell>
      </Page>
    </>
  );
}
