// src/components/pilearn/TeacherSelectionMobile.jsx
import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { ChevronLeft, Search } from "lucide-react";
import { ClipLoader } from "react-spinners"; // React spinner

const Container = styled.div`
  padding: 3px;
  position: relative;
`;

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
  &:hover { background: #f1f5f9; transform: scale(1.05); }
  &:active { transform: scale(0.95); }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 12px;
  animation: slideIn 0.5s ease;
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
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

const SearchWrap = styled.div`
  position: relative;
  margin-bottom: 10px;
`;
const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
`;
const SearchBar = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  font-size: 15px;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #4b5563;
    box-shadow: 0 0 0 3px rgba(75, 85, 99, 0.1);
  }
  &::placeholder { color: #9ca3af; }
`;

const TeachersGrid = styled.div`
  display: flex;
  gap: 12px;
  padding: 2px 0 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(10px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const TeacherCard = styled.button`
  min-width: 100%;
  max-width: 184px;
  aspect-ratio: 1 / 1;
  border-radius: 18px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  scroll-snap-align: center;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, outline-offset 0.18s ease;
  animation: ${fadeUp} 0.35s ease both;
  animation-delay: ${(p) => p.$delay || "0s"};
  outline: ${(p) => (p.$isSelected ? "3px solid rgba(0, 0, 0, 0.65)" : "0 solid transparent")};
  &:hover { transform: translateY(-4px) scale(1.012); }
  &:active { transform: translateY(-1px) scale(0.99); }
  &:focus-visible { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.28); }
`;

const TeacherIconWrapper = styled.div`
  position: absolute;
  inset: 0;
  background: #e5e7eb;
  display: grid;
  place-items: center;
  img {
    width: 100%; height: 100%; object-fit: cover; display: block; background: #f9fafb;
  }
`;

// Avatar loader w/ minimum delay
function TeacherImage({ primary, fallback, alt, minDelayMs = 800 }) {
  const [src, setSrc] = useState(primary || fallback);
  const [loaded, setLoaded] = useState(false);
  const triedFallback = useRef(false);
  const startRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    startRef.current = Date.now();
    setLoaded(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [src]);

  const revealWithMinDelay = () => {
    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(0, minDelayMs - elapsed);
    timerRef.current = setTimeout(() => setLoaded(true), remaining);
  };

  return (
    <>
      {!loaded && <ClipLoader color="#6b7280" size={38} speedMultiplier={0.8} />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={revealWithMinDelay}
        onError={() => {
          if (!triedFallback.current && fallback && src !== fallback) {
            triedFallback.current = true;
            setSrc(fallback);
            return;
          }
          revealWithMinDelay();
        }}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 300ms ease",
          position: loaded ? "relative" : "absolute",
        }}
      />
    </>
  );
}

export default function TeacherSelectionMobile({
  grades,
  selectedGrade,
  selectedSubject,
  selectedTeacher,     // now an OBJECT (or null)
  onSelectTeacher,      // will be called with OBJECT
  onBack,
  onConfirm,            // will be called with OBJECT
  autoScrollMs = 2400,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const rawTeachers =
    selectedGrade && selectedSubject
      ? grades?.[selectedGrade]?.subjects?.[selectedSubject] ?? []
      : [];

  // Ensure each teacher is an object with id/name/img
  const teachers = rawTeachers.map((t) =>
    typeof t === "string" ? { id: t, name: t, img: undefined } : t
  );

  const avatarFor = (name) =>
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      name
    )}&backgroundType=gradientLinear&fontFamily=Verdana&bold=true`;

  const filteredTeachers = teachers.filter((t) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const gridRef = useRef(null);
  const isUserInteractingRef = useRef(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const onDown = () => (isUserInteractingRef.current = true);
    const onUp = () => window.setTimeout(() => (isUserInteractingRef.current = false), 500);

    grid.addEventListener("touchstart", onDown, { passive: true });
    grid.addEventListener("mousedown", onDown);
    grid.addEventListener("touchend", onUp);
    grid.addEventListener("mouseup", onUp);
    grid.addEventListener("mouseleave", onUp);

    return () => {
      grid.removeEventListener("touchstart", onDown);
      grid.removeEventListener("mousedown", onDown);
      grid.removeEventListener("touchend", onUp);
      grid.removeEventListener("mouseup", onUp);
      grid.removeEventListener("mouseleave", onUp);
    };
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || filteredTeachers.length === 0) return;

    const cards = Array.from(grid.querySelectorAll("[data-card='teacher']"));
    if (cards.length === 0) return;

    const interval = setInterval(() => {
      if (isUserInteractingRef.current) return;
      indexRef.current = (indexRef.current + 1) % cards.length;
      const target = cards[indexRef.current];
      if (target) {
        target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }, Math.max(1200, autoScrollMs));

    return () => clearInterval(interval);
  }, [filteredTeachers.length, autoScrollMs]);

  return (
    <Container>
      <BackIconButton onClick={onBack} aria-label="Go back">
        <ChevronLeft size={24} />
      </BackIconButton>

      <Header>
        <Title>Choose Your Teacher</Title>
        <Subtitle>
          {selectedSubject ? `${selectedSubject} • Swipe to explore` : "Pick a subject first."}
        </Subtitle>
      </Header>

      <SearchWrap>
        <SearchIcon size={18} />
        <SearchBar
          type="text"
          placeholder="Search teacher name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search teachers"
        />
      </SearchWrap>

      <TeachersGrid ref={gridRef}>
        {filteredTeachers.map((t, i) => {
          const isSelected = selectedTeacher?.id === t.id; // compare by id
          return (
            <TeacherCard
              key={t.id || t.name || i}
              data-card="teacher"
              $isSelected={isSelected}
              $delay={`${i * 0.05}s`}
              aria-pressed={isSelected}
              aria-label={`Choose ${t.name}`}
              onClick={() => {
                // IMPORTANT: pass the FULL OBJECT upstream
                onSelectTeacher(t);
                // Optional: confirm immediately on tap (kept from your code)
                setTimeout(() => onConfirm(t), 100);
              }}
            >
              <TeacherIconWrapper>
                <TeacherImage
                  primary={t.img}
                  fallback={avatarFor(t.name)}
                  alt={t.name}
                  minDelayMs={800}
                />
              </TeacherIconWrapper>
            </TeacherCard>
          );
        })}
      </TeachersGrid>
    </Container>
  );
}
