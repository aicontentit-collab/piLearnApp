import React, { useMemo, useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsChat, BsBookmark, BsBookmarkFill, BsStars } from "react-icons/bs";
import { FiSend, FiChevronUp } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import * as BI from "react-icons/bi";
import * as BS from "react-icons/bs";
import * as FI from "react-icons/fi";

/** ---------- Card & basic styles ---------- */
const Card = styled.article`
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(2, 6, 23, 0.08);
`;

const HeaderWraper = styled.div`
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 0px 10px;
`;

const HeaderLeft = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
  align-items: center;
`;

const AvatarImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #eef2ff;
`;

const AvatarIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #eef2ff;
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.08);
`;

const UserBlock = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.15;
`;

const Title = styled.span`
  font-weight: 600;
  color: #0f172a;
`;
const Subtitle = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const AskAIBtn = styled.button.withConfig({ shouldForwardProp: (p) => p !== "$variant" })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  padding: 0 14px;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
  border-radius: 999px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.35s ease-in-out;
  z-index: 1;
  backdrop-filter: blur(4px);

  ${(p) =>
    p.$variant === "primary"
      ? `
    color: #0f172a;
    background: linear-gradient(135deg, #f8fafc, #e0f2fe);
    border: 1px solid rgba(99,102,241,0.35);
    box-shadow: 0 0 12px rgba(99,102,241,0.25), inset 0 0 8px rgba(255,255,255,0.25);

    &:before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(135deg, #93c5fd, #c084fc, #22d3ee);
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
      pointer-events: none;
      transition: all 0.5s ease;
    }

    &:hover {
      background: linear-gradient(135deg, #e0f2fe, #fdf4ff);
      box-shadow: 0 0 18px rgba(147,197,253,0.5);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(1px);
      filter: brightness(0.95);
    }
  `
      : `
    background: #ffffff;
    color: #0f172a;
    border: 1px solid rgba(15,23,42,0.14);
    &:hover { background: rgba(15,23,42,0.03); }
  `}
`;


const DescriptionWrap = styled.div`
  padding: 0px 15px 10px 10px;
  display: flex;
  align-items: flex-start;
`;

const SeeMoreBtn = styled.button`
  font-size: 12px;
  color: #334155;
  background: transparent;
  border: none;
  margin-left: 6px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 500;
`;

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
`;

const ActionsLeft = styled.div`
  display: flex;
  gap: 12px;
`;

const IconBtn = styled.button`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #0f172a;
  cursor: pointer;
  &:hover { background: rgba(15, 23, 42, 0.06); }
  &:active { transform: scale(0.98); }
`;

/* ======= Chat UI ======= */
const ChatArea = styled.div`
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  min-height: 280px;
  display: flex;
  flex-direction: column;
`;

const ChatScroll = styled.div`
  flex: 1;
  padding: 14px;
  overflow-y: auto;
`;

const ChatRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: ${(p) => (p.$role === "user" ? "flex-end" : "flex-start")};
`;

const Bubble = styled.div`
  max-width: 78%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.35;
  color: #0f172a;
  background: ${(p) => (p.$role === "user" ? "#dbeafe" : "#e0f2fe")};
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
`;

const ChatFooter = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 12px 12px 14px 12px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const ChatInput = styled.input`
  height: 38px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  &:focus { border-color: #94a3b8; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
`;

const SendBtn = styled.button`
  display: inline-grid;
  place-items: center;
  height: 35px;
  width: 35px;
  border-radius: 9999px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: #fff;
  cursor: pointer;
`;

const typing = keyframes` 0%{opacity:.2;} 50%{opacity:1;} 100%{opacity:.2;} `;
const TypingDots = styled.div`
  display: inline-flex; gap: 4px; align-items: center;
  span { width: 6px; height: 6px; background: #0ea5e9; border-radius: 50%; animation: ${typing} 1.2s infinite; }
  span:nth-child(2){ animation-delay: .15s; }
  span:nth-child(3){ animation-delay: .3s; }
`;

const clampStyle = (lines = 1) => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: lines,
});

function DetailedDescription({ expanded = false, lines = 1, children, innerRef }) {
  const baseStyle = {
    fontSize: "13px",
    color: "#334155",
    margin: 0,
    whiteSpace: "pre-wrap",
    ...(expanded ? {} : clampStyle(lines)),
  };
  return <p style={baseStyle} ref={innerRef}>{children}</p>;
}

/* ======= Media (image/video) wrappers ======= */
const MediaWrap = styled.div`
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #eef2ff, #e0f7fa);
`;
const Img = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;
const Video = styled.video`
  width: 100%;
  height: auto;
  display: block;
  background: #000;
`;

/* ======= Helpers: Icon avatar resolver ======= */
const ICON_PACKS = { BI, BS, FI };
function resolveIconComponent(name) {
  if (!name) return null;
  for (const pack of Object.values(ICON_PACKS)) {
    if (pack[name]) return pack[name];
  }
  return null;
}

/* ========== Main Component ========== */
export default function InfographicCard({
  icon, // string like "BsHeartPulse" OR a React element <BS.BsHeartPulse />
  data,
  onLikeChange,
  onBookmarkChange,
  onShare,
}) {
  const {
    type = "infografic", // 'infografic' | 'videoClip'
    title = "infografic Title",
    subtitle = "",
    detailedDescription = "",
    carouselMetaData = [],
    imgSrc,
    videoClipSrc,
  } = data || {};

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]); // {role:'user'|'ai', content:string}
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const descRef = useRef(null);
  const scrollRef = useRef(null);

  // Detect overflow
  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    if (expanded) { setIsOverflowing(true); return; }
    requestAnimationFrame(() => {
      if (!el) return;
      const needsClamp = el.scrollHeight - el.clientHeight > 1;
      setIsOverflowing(needsClamp);
    });
  }, [detailedDescription, expanded]);

  // Auto-scroll chat
  useEffect(() => {
    const el = scrollRef.current; if (!el) return; el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const toggleLike = () => { const next = !liked; setLiked(next); onLikeChange && onLikeChange(next); };
  const toggleSave = () => { const next = !saved; setSaved(next); onBookmarkChange && onBookmarkChange(next); };

  const shareData = useMemo(() => ({ title, text: `${title}`, url: typeof window !== "undefined" ? window.location.href : "" }), [title]);
  const handleShare = async () => { try { if (navigator.share) { await navigator.share(shareData); } else if (navigator.clipboard) { await navigator.clipboard.writeText(shareData.url); alert("Link copied to clipboard"); } onShare && onShare(shareData); } catch (e) { console.error("Share failed:", e); } };

  const aiPrompt = useMemo(() => {
    const count = carouselMetaData.length; if (count === 0) return "";
    const layout = `A split image with ${count} panel${count > 1 ? "s" : ""} arranged in a 1x${count} layout, aspect ratio 1.78:1.`;
    const frames = carouselMetaData.map((item, i) => `Frame ${i + 1} shows ${item.alt || "a themed visual scene"}.`).join(" ");
    const footer = "All illustrations should follow a clean 2.5D art style with soft shadows and depth, set against a background of hex code #3d0f96. No text should appear in the image.";
    return `${layout} ${frames} ${footer}`;
  }, [carouselMetaData]);

  // Chat open/close with auto "hii" + typing + details answer
  const onToggleChat = () => {
    setShowChat((prev) => {
      const next = !prev;
      if (next) {
        const seed = [{ role: "user", content: "hii" }];
        setMessages(seed); setIsTyping(true);
        const answer = detailedDescription || aiPrompt || "I don't have more details yet.";
        setTimeout(() => { setIsTyping(false); setMessages((m) => [...m, { role: "ai", content: answer }]); }, 1100);
      } else { setIsTyping(false); setInput(""); }
      return next;
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim(); if (!text) return;
    setMessages((m) => [...m, { role: "user", content: text }]); setInput(""); setIsTyping(true);
    const answer = detailedDescription || aiPrompt || "I don't have more details yet.";
    setTimeout(() => { setIsTyping(false); setMessages((m) => [...m, { role: "ai", content: answer }]); }, 1000);
  };

  if (type === "infografic" && !imgSrc) return null;
  if (type === "videoClip" && !videoClipSrc) return null;

  // Resolve icon avatar: supports string name or direct element
  const IconComp = typeof icon === "string" ? resolveIconComponent(icon) : null;
  const iconElement = IconComp ? <IconComp size={22} /> : (icon && typeof icon === "object" ? icon : null);

  return (
    <Card role="article" aria-label={`${title} – post`}>
      <HeaderWraper>
        <Header>
          <HeaderLeft>
            {iconElement ? (
              <AvatarIcon aria-hidden="true">{iconElement}</AvatarIcon>
            ) : (
              <AvatarImg src="" alt="avatar" />
            )}
            <UserBlock>
              <Title>{title}</Title>
              <Subtitle>{subtitle}</Subtitle>
            </UserBlock>
          </HeaderLeft>
          <AskAIBtn
            $variant={showChat ? "ghost" : "primary"}
            onClick={onToggleChat}
            aria-label={showChat ? "Close Ask AI" : "Open Ask AI"}
            title={showChat ? "Close Ask AI" : "Ask AI about this"}
          >
            {showChat ? (<><IoClose size={16} /> Close</>) : (<><BsStars size={16} /> Ask AI</>)}
          </AskAIBtn>
        </Header>

        {detailedDescription && (
                  <DescriptionWrap>
                    <DetailedDescription
                      expanded={expanded}
                      lines={1}
                      innerRef={descRef}
                    >
                      {detailedDescription}
                    </DetailedDescription>
                    {(isOverflowing || expanded) && (
                      <SeeMoreBtn type="button" onClick={() => setExpanded((v) => !v)}>
                        {expanded ? <FiChevronUp size={14} /> : "more"}
                      </SeeMoreBtn>
                    )}
                  </DescriptionWrap>
                )}
      </HeaderWraper>

      {/* Swap media with chat just like the carousel implementation */}
      {!showChat ? (
        <MediaWrap>
          {type === "infografic" && imgSrc && <Img src={imgSrc} alt={title} />}
          {type === "videoClip" && videoClipSrc && (
            <Video src={videoClipSrc} controls playsInline />
          )}
        </MediaWrap>
      ) : (
        <ChatArea>
          <ChatScroll ref={scrollRef}>
            {messages.map((m, idx) => (
              <ChatRow key={idx} $role={m.role}>
                <Bubble $role={m.role}>{m.content}</Bubble>
              </ChatRow>
            ))}
            {isTyping && (
              <ChatRow $role="ai">
                <Bubble $role="ai">
                  <TypingDots>
                    <span />
                    <span />
                    <span />
                  </TypingDots>
                </Bubble>
              </ChatRow>
            )}
          </ChatScroll>
          <ChatFooter onSubmit={handleSend}>
            <ChatInput value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something about this…" aria-label="Chat input" />
            <SendBtn type="submit" aria-label="Send message"><IoMdSend size={18} /></SendBtn>
          </ChatFooter>
        </ChatArea>
      )}

      <ActionsBar>
        <ActionsLeft>
          <IconBtn onClick={toggleLike}>{liked ? <AiFillHeart size={22} /> : <AiOutlineHeart size={22} />}</IconBtn>
          <IconBtn><BsChat size={20} /></IconBtn>
          <IconBtn onClick={handleShare}><FiSend size={20} /></IconBtn>
        </ActionsLeft>
        <IconBtn onClick={toggleSave}>{saved ? <BsBookmarkFill size={20} /> : <BsBookmark size={20} />}</IconBtn>
      </ActionsBar>
    </Card>
  );
}