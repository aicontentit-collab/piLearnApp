// src/components/Stories/StoryCarousel.jsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";

/* -------------------------------- Styled -------------------------------- */

const Wrap = styled.div``;

const CarouselScroller = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const Card = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  scroll-snap-align: start;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ThumbBase = `
  width: 360px;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  user-drag: none;
  -webkit-user-drag: none;
  pointer-events: none;
  margin-left: 10px;
`;

const ThumbImg = styled.img`${ThumbBase}`;
const ThumbVideo = styled.video`${ThumbBase}`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.96);
  backdrop-filter: blur(20px);
  display: grid;
  place-items: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

const Lightbox = styled.div`
  position: relative;
  width: 96vw;
  max-width: 1400px;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr auto auto;
  gap: 10px;
  overflow: hidden;
`;

const Rail = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 32px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  scroll-behavior: smooth;
`;

const Slide = styled.div`
  flex: 0 0 100%;
  height: 100%;
  display: grid;
  place-items: center;
  scroll-snap-align: center;
  background: transparent;
`;

const mediaCommon = `
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 15px;
  user-select: none;
  -webkit-user-drag: none;
  cursor: default;
  touch-action: pan-x pan-y;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease;
`;

const SlideImg = styled.img`${mediaCommon}`;
const SlideVideo = styled.video`${mediaCommon}`;

const IconButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  color: white;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(p) => (p.$show ? 1 : 0)};
  pointer-events: ${(p) => (p.$show ? "auto" : "none")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover { background: rgba(255, 255, 255, 0.15); transform: scale(1.05); }
  &:active { transform: scale(0.95); }
`;

const ScrubberWrap = styled.div`
  width: 100%;
  padding: 0 16px 8px;
  display: grid;
  align-items: center;
  opacity: ${(p) => (p.$show ? 1 : 0)};
  pointer-events: ${(p) => (p.$show ? "auto" : "none")};
  transition: opacity 0.3s ease;
`;

const Scrubber = styled.input.attrs({ type: "range" })`
  width: 100%;
  appearance: none;
  background: transparent;
  margin: 0;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.9) 0 var(--filled, 0%),
      rgba(255, 255, 255, 0.2) var(--filled, 0%) 100%
    );
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    margin-top: -6px;
    cursor: grab;
    transition: transform 0.2s ease;
  }

  &::-webkit-slider-thumb:hover { transform: scale(1.2); }
  &::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.1); }

  &::-moz-range-track {
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.9) 0 var(--filled, 0%),
      rgba(255, 255, 255, 0.2) var(--filled, 0%) 100%
    );
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border: none;
    cursor: grab;
  }
`;

const MiniStrip = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0 16px 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  opacity: ${(p) => (p.$show ? 1 : 0)};
  pointer-events: ${(p) => (p.$show ? "auto" : "none")};
  transition: opacity 0.3s ease;
`;

const MiniBtn = styled.button`
  position: relative;
  border: 2px solid ${(p) =>
    p.$active ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.2)"};
  border-radius: 10px;
  background: transparent;
  padding: 0;
  cursor: pointer;
  flex: 0 0 auto;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover { border-color: rgba(255, 255, 255, 0.6); transform: scale(1.05); }
  &:active { transform: scale(0.95); }

  ${(p) => p.$active && `box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);`}
`;

const MiniImg = styled.img`
  width: 80px;
  height: 54px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  transition: opacity 0.2s ease;

  ${MiniBtn}:hover & { opacity: 0.8; }
`;

const MiniVideo = styled.video`
  width: 80px;
  height: 54px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
`;

/* -------------------------------- Helpers -------------------------------- */

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/** Normalize items and keep backward compatibility with {imgSrc, videoClipSrc} */
function normalizeItem(it) {
  const type = (it.type || "img").toLowerCase(); // "img" | "gif" | "video"
  const src = it.src || it.imgSrc || it.videoClipSrc; // prefer unified src
  const poster = it.poster || it.thumb || it.thumbnail; // optional
  const name = it.name || it.title || "";
  return { type, src, poster, name, id: it.id };
}

/* ------------------------------- Error Boundary ------------------------------- */
// (kept inside this file so you only need two files total)
class CarouselErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { console.error("Carousel error:", err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "#fff", padding: 16, textAlign: "center" }}>
          Something went wrong while rendering the carousel.
        </div>
      );
    }
    return this.props.children;
  }
}

/* -------------------------------- Component -------------------------------- */

function CarouselInner({ items = [], className }) {
  const scrollerRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const startLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const [isOpen, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showChrome, setShowChrome] = useState(true);

  const railRef = useRef(null);

  // Normalize and drop invalid sources early to prevent runtime errors
  const normalized = useMemo(
    () => (items || []).map(normalizeItem).filter((it) => Boolean(it.src)),
    [items]
  );

  const slideRefs = useRef([]);
  if (slideRefs.current.length !== normalized.length) {
    slideRefs.current = normalized.map((_, i) => slideRefs.current[i] ?? React.createRef());
  }

  const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

  // lock body scroll
  useEffect(() => {
    if (!isBrowser) return;
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev || ""; };
  }, [isOpen, isBrowser]);

  // ensure correct slide visible on open
  useEffect(() => {
    if (!isOpen) return;
    slideRefs.current[activeIndex]?.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "auto",
    });
    setShowChrome(true);
  }, [isOpen, activeIndex]);

  // keyboard nav
  useEffect(() => {
    if (!isOpen || !isBrowser) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndexClamped(activeIndex + 1);
      if (e.key === "ArrowLeft") setIndexClamped(activeIndex - 1);
      if (e.key.toLowerCase() === "h") setShowChrome((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, activeIndex, isBrowser]);

  // step size = viewport width + gap (since each slide is 100% basis)
  const stepSize = useMemo(() => {
    if (typeof window === "undefined" || !railRef.current) return 0;
    const cs = window.getComputedStyle(railRef.current);
    const gap = parseFloat(cs.gap) || 0;
    const w = railRef.current.clientWidth || 0;
    return w + gap;
  }, [isOpen]);

  const onRailScroll = () => {
    if (!railRef.current || stepSize === 0) return;
    const { scrollLeft } = railRef.current;
    const idx = Math.round(scrollLeft / stepSize);
    const clamped = clamp(idx, 0, normalized.length - 1);
    if (clamped !== activeIndex) setActiveIndex(clamped);
  };

  const setIndexClamped = (i) => {
    const next = clamp(i, 0, Math.max(0, normalized.length - 1));
    setActiveIndex(next);
    if (!railRef.current) return;
    const targetLeft = stepSize * next;
    railRef.current.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  const onScrub = (e) => {
    const idx = Number(e.target.value);
    setIndexClamped(idx);
  };
  const filledPct = normalized.length > 1 ? (activeIndex / (normalized.length - 1)) * 100 : 0;
  const scrubberStyle = { "--filled": `${filledPct}%` };

  // Drag-to-scroll for thumbnail scroller (mouse-only to avoid touch chaos)
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    if (!scrollerRef.current) return;
    isDownRef.current = true;
    dragDistanceRef.current = 0;
    startXRef.current = e.clientX;
    startLeftRef.current = scrollerRef.current.scrollLeft || 0;
    try { scrollerRef.current.setPointerCapture?.(e.pointerId); } catch {console.log("error")}
  };
  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    if (!isDownRef.current || !scrollerRef.current) return;
    const dx = e.clientX - startXRef.current;
    dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(dx));
    scrollerRef.current.scrollLeft = startLeftRef.current - dx;
  };
  const onPointerUp = () => { isDownRef.current = false; };
  const CLICK_DRAG_THRESHOLD = 6;

  const onCardClick = (idx) => {
    if (dragDistanceRef.current > CLICK_DRAG_THRESHOLD) return;
    setActiveIndex(idx);
    setShowChrome(true);
    setOpen(true);
  };

  // Toggle chrome by clicking non-interactive area
  const onLightboxClick = (e) => {
    const t = e.target;
    const tag = t.tagName && t.tagName.toLowerCase();
    const isMedia = tag === "img" || tag === "video";
    const isInteractive = t.closest?.('[data-interactive="true"]');
    if (isMedia || isInteractive) return;
    setShowChrome((s) => !s);
  };

  // Autoplay active video, pause others
  useEffect(() => {
    if (!isOpen) return;
    const videos = railRef.current?.querySelectorAll("video[data-slide-video='true']") || [];
    videos.forEach((v, idx) => {
      if (idx === activeIndex) {
        v.muted = true;
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [isOpen, activeIndex]);

  if (!normalized || normalized.length === 0) return null;

  return (
    <Wrap className={className}>
      {/* Thumbnail scroller */}
      <CarouselScroller
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {normalized.map((item, idx) => (
          <Card key={item.id ?? idx} onClick={() => onCardClick(idx)}>
            {item.type === "video" ? (
              <ThumbVideo
                src={item.src}
                poster={item.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={item.name || `Video ${idx + 1}`}
              />
            ) : (
              <ThumbImg
                src={item.src}
                alt={item.name ?? `Item ${idx + 1}`}
                draggable={false}
              />
            )}
          </Card>
        ))}
      </CarouselScroller>

      {/* Lightbox */}
      {isOpen && (
        <Overlay role="dialog" aria-modal="true" aria-label="Media lightbox">
          <Lightbox onClick={onLightboxClick}>
            <Counter $show={showChrome}>
              {activeIndex + 1} / {normalized.length}
            </Counter>

            <IconButton
              $show={showChrome}
              onClick={() => setOpen(false)}
              aria-label="Close"
              data-interactive="true"
            >
              <FiX />
            </IconButton>

            <Rail ref={railRef} onScroll={onRailScroll}>
              {normalized.map((it, i) => (
                <Slide key={it.id ?? i} ref={slideRefs.current[i]}>
                  {it.type === "video" ? (
                    <SlideVideo
                      data-slide-video="true"
                      src={it.src}
                      poster={it.poster}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      aria-label={it.name ?? `Video ${i + 1}`}
                      // If you want auto-advance when a clip (non-loop) ends, remove loop above and uncomment:
                      // onEnded={() => setIndexClamped(activeIndex + 1)}
                    />
                  ) : (
                    <SlideImg
                      src={it.src}
                      alt={it.name ?? `Image ${i + 1}`}
                    />
                  )}
                </Slide>
              ))}
            </Rail>

            <ScrubberWrap $show={showChrome} data-interactive="true">
              <Scrubber
                min={0}
                max={Math.max(0, normalized.length - 1)}
                step={1}
                value={activeIndex}
                onChange={onScrub}
                style={scrubberStyle}
                aria-label="Media scrubber"
              />
            </ScrubberWrap>

            <MiniStrip $show={showChrome} aria-label="Thumbnails" data-interactive="true">
              {normalized.map((it, i) => (
                <MiniBtn
                  key={it.id ?? i}
                  $active={i === activeIndex}
                  onClick={() => setIndexClamped(i)}
                  aria-label={`Go to item ${i + 1}`}
                >
                  {it.type === "video" ? (
                    <MiniVideo
                      src={it.src}
                      poster={it.poster}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <MiniImg src={it.src} alt={it.name ?? `Thumbnail ${i + 1}`} />
                  )}
                </MiniBtn>
              ))}
            </MiniStrip>
          </Lightbox>
        </Overlay>
      )}
    </Wrap>
  );
}

/* ------------------------------- Public API ------------------------------- */
// Export wrapped with an inline Error Boundary, so you don't need a third file.
export default function Carousel(props) {
  return (
    <CarouselErrorBoundary>
      <CarouselInner {...props} />
    </CarouselErrorBoundary>
  );
}

// Small counter badge (declared after usage for clarity)
const Counter = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 16px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  opacity: ${(p) => (p.$show ? 1 : 0)};
  pointer-events: none;
  transition: opacity 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;
