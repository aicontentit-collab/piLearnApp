import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { X, Volume2, VolumeX } from "lucide-react";

/* ======================= mobile-first styles ======================= */

const Row = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px 0 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const Bubble = styled.button`
  display: grid;
  grid-template-rows: auto auto;
  gap: 6px;
  border: 0;
  background: transparent;
  cursor: pointer;
  min-width: 72px;
  justify-items: center;
  outline: none;
  padding: 0;

  &:focus-visible { outline: 2px solid #111827; outline-offset: 2px; }
`;

const Ring = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 999px;
  padding: 2px;
  background: linear-gradient(135deg, #a78bfa, #f472b6, #fb923c);
  @media (min-width: 768px) {
    width: 76px;
    height: 76px;
  }
`;

const RingInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: #fff;
  display: grid;
  place-items: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Title = styled.div`
  font-size: 11px;
  color: #374151;
  max-width: 72px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 12px;
    max-width: 84px;
  }
`;

/* ======== Fullscreen lightbox (mobile-first) ======== */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 1000;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
`;

const Stage = styled.div`
  /* Fill the screen, respect safe-area on iOS */
  width: 100vw;
  height: 100svh; /* modern mobile viewport unit */
  display: grid;
  grid-template-rows: auto 1fr auto;
  user-select: none;
  touch-action: none; /* prevent double-tap zoom and browser gestures */
`;

const TopBar = styled.div`
  position: relative;
  padding: calc(env(safe-area-inset-top, 0) + 10px) 12px 8px;
  background: linear-gradient(180deg, rgba(0,0,0,.75), rgba(0,0,0,0));
`;

const Segments = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 5px;
  align-items: center;
`;

const SegmentWrap = styled.div`
  height: 3px;
  background: rgba(255,255,255,.25);
  border-radius: 999px;
  overflow: hidden;

  @media (min-width: 768px) {
    height: 4px;
  }
`;

const grow = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

const SegmentFill = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  transform-origin: left;
  animation: ${grow} linear forwards;
  animation-duration: ${({ durationMs }) => `${durationMs}ms`};
  animation-play-state: ${({ paused }) => (paused ? "paused" : "running")};
`;

const Head = styled.div`
  margin-top: 10px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2px;
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChromeBtn = styled.button`
  border: 1px solid rgba(255,255,255,.28);
  background: rgba(0,0,0,.35);
  color: #fff;
  border-radius: 10px;
  padding: 8px;
  display: grid;
  place-items: center;
  touch-action: manipulation;
`;

const MediaArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #000;
`;

const MediaImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  /* Improve mobile decode/render */
  content-visibility: auto;
  contain-intrinsic-size: 800px 1200px;
`;

const TapZone = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  width: ${({ side }) => (side === "middle" ? "28%" : "36%")};
  background: transparent;
  border: 0;
  cursor: pointer;
  touch-action: manipulation;

  ${({ side }) =>
    side === "left"
      ? "left: 0;"
      : side === "right"
      ? "right: 0;"
      : "left: 36%; right: 36%;"};
`;

const BottomBar = styled.div`
  padding: 10px 12px calc(env(safe-area-inset-bottom, 0) + 12px);
  background: linear-gradient(0deg, rgba(0,0,0,.75), rgba(0,0,0,0));
  color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  text-align: center;
  font-size: 13px;
  line-height: 1.3;
`;

/* ======================= component ======================= */

/**
 * highlights: [
 *  { id, title, cover, items: [
 *     { id, type: 'image', src, caption, durationMs? } // default 5000
 *  ] }
 * ]
 */
export default function Highlights({
  highlights = [],
  defaultDurationMs = 5000,
  onOpen,
  onClose,
}) {
  const [openId, setOpenId] = useState(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true); // reserved for future video support

  const active = useMemo(
    () => highlights.find((h) => h.id === openId) || null,
    [highlights, openId]
  );
  const current = useMemo(() => {
    if (!active) return null;
    return active.items?.[index] || null;
  }, [active, index]);

  const durationMs = current?.durationMs ?? defaultDurationMs;

  /* --------- Body scroll lock while overlay open (mobile) --------- */
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  /* --------- Auto-advance timer --------- */
  const timerRef = useRef(null);
  const clearTimer = () => timerRef.current && clearTimeout(timerRef.current);

  useEffect(() => {
    clearTimer();
    if (!active || !current || paused) return;
    timerRef.current = setTimeout(() => {
      goNext();
    }, durationMs);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, current, paused, durationMs]);

  /* --------- Visibility pause (user switches apps) --------- */
  useEffect(() => {
    const onVis = () => {
      if (!active) return;
      setPaused(document.hidden || paused);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [active, paused]);

  /* --------- Swipe navigation (mobile) --------- */
  const touchStart = useRef(null);
  const touchDelta = useRef({ x: 0, y: 0 });

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    touchDelta.current = { x: 0, y: 0 };
  };

  const onTouchMove = (e) => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    touchDelta.current = {
      x: t.clientX - touchStart.current.x,
      y: t.clientY - touchStart.current.y,
    };
  };

  const onTouchEnd = () => {
    if (!touchStart.current) return;
    const { x, y } = touchDelta.current;
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    // Horizontal swipe wins if dominant and above threshold
    if (absX > 40 && absX > absY) {
      if (x < 0) goNext();
      else goPrev();
    }
    touchStart.current = null;
    touchDelta.current = { x: 0, y: 0 };
  };

  /* --------- Navigation helpers --------- */
  const goPrev = useCallback(() => {
    if (!active) return;
    setIndex((i) => Math.max(i - 1, 0));
  }, [active]);

  const goNext = useCallback(() => {
    if (!active) return;
    const last = (active.items?.length || 1) - 1;
    if (index < last) {
      setIndex((i) => i + 1);
    } else {
      const idx = highlights.findIndex((h) => h.id === active.id);
      const nextH = highlights[idx + 1];
      if (nextH) {
        setOpenId(nextH.id);
        setIndex(0);
      } else {
        handleClose();
      }
    }
  }, [active, index, highlights]);

  const handleOpen = (id) => {
    setOpenId(id);
    setIndex(0);
    setPaused(false);
    onOpen?.(id);
  };

  const handleClose = () => {
    setOpenId(null);
    setIndex(0);
    setPaused(false);
    onClose?.();
  };

  /* --------- Keyboard (desktop) --------- */
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") {
        setPaused(true);
        goNext();
      }
      if (e.key === "ArrowLeft") {
        setPaused(true);
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goNext, goPrev]);

  return (
    <>
      {/* Highlights bubbles row */}
      <Row aria-label="Highlights">
        {highlights.map((h) => (
          <Bubble key={h.id} onClick={() => handleOpen(h.id)} aria-label={`Open ${h.title}`}>
            <Ring>
              <RingInner>
                <img src={h.cover} alt={h.title} loading="lazy" decoding="async" />
              </RingInner>
            </Ring>
            <Title>{h.title}</Title>
          </Bubble>
        ))}
      </Row>

      {/* Fullscreen lightbox */}
      {active && current && (
        <Overlay
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => {
            // prevent passive scroll underlay
            if (e.cancelable) e.preventDefault();
          }}
        >
          <Stage>
            <TopBar>
              {/* Progress segments */}
              <Segments
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={active.items.length}
                aria-valuenow={index + 1}
              >
                {active.items.map((it, i) => (
                  <SegmentWrap key={it.id || i}>
                    {i < index ? (
                      <div style={{ width: "100%", height: "100%", background: "#fff" }} />
                    ) : i === index ? (
                      <SegmentFill durationMs={durationMs} paused={paused} />
                    ) : null}
                  </SegmentWrap>
                ))}
              </Segments>

              <Head>
                <Name>{active.title}</Name>
                <Controls>
                  <ChromeBtn
                    onClick={() => setMuted((m) => !m)}
                    title={muted ? "Unmute (videos)" : "Mute"}
                    aria-label={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </ChromeBtn>
                  <ChromeBtn onClick={handleClose} aria-label="Close">
                    <X size={18} />
                  </ChromeBtn>
                </Controls>
              </Head>
            </TopBar>

            <MediaArea
              onPointerDown={() => setPaused(true)}
              onPointerUp={() => setPaused(false)}
              onPointerCancel={() => setPaused(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {current.type === "image" && (
                <MediaImg
                  src={current.src}
                  alt={current.caption || active.title}
                  loading="eager"
                  decoding="async"
                />
              )}

              {/* Tap zones (left / middle / right) */}
              <TapZone side="left" onClick={goPrev} aria-label="Previous" />
              <TapZone
                side="middle"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Play" : "Pause"}
              />
              <TapZone side="right" onClick={goNext} aria-label="Next" />
            </MediaArea>

            <BottomBar>{current.caption || ""}</BottomBar>
          </Stage>
        </Overlay>
      )}
    </>
  );
}
