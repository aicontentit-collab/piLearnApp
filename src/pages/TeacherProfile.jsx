import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { BookOpen, Grid, Bookmark, X, Check, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { teacherData as teacherDataSource } from "../data/teacherData.js";
import { RotatingLines } from "react-loader-spinner";
import Highlights from "../components/Highlights/Highlights";

/* ===== Storage Keys ===== */
const PROFILE_KEY = "studentProfile";

/* --------------------------- Styled Components --------------------------- */

const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  background: #fff;
  min-height: 100vh;
`;

const ProfileSection = styled.div`
  padding: 1rem 1.5rem;
  @media (min-width: 768px) {
    padding: 1.5rem 2rem;
  }
  @media (min-width: 1024px) {
    padding: 2rem 3rem;
  }
`;

const ProfileTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  @media (min-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
`;
const Avatar = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  @media (min-width: 768px) {
    width: 8rem;
    height: 8rem;
  }
  @media (min-width: 1024px) {
    width: 10rem;
    height: 10rem;
  }
`;

const LockRibbon = styled.div`
  position: absolute;
  top: -6px;
  left: -6px;
  background: #111827;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.4rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const StatsMobile = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-around;
  text-align: center;
  @media (min-width: 768px) {
    display: none;
  }
`;
const StatsDesktop = styled.div`
  display: none;
  gap: 2rem;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    display: flex;
  }
`;
const Stat = styled.div`
  font-weight: 600;
  font-size: 1.125rem;
  span {
    font-weight: 400;
    margin-left: 0.25rem;
    color: #6b7280;
  }
`;

const ProfileContent = styled.div`
  flex: 1;
`;
const Name = styled.div`
  font-weight: 600;
  font-size: 1rem;
  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;
const Subject = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;
const Bio = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;
const Experience = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: #6b7280;
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;
const ButtonPrimary = styled.button`
  flex: 1;
  background: #3b82f6;
  color: #fff;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  @media (min-width: 768px) {
    flex: initial;
    padding: 0.5rem 2rem;
    font-size: 1rem;
  }
`;
const ButtonSecondary = styled.button`
  flex: 1;
  border: 1px solid #d1d5db;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  position: relative;
  @media (min-width: 768px) {
    flex: initial;
    padding: 0.5rem 2rem;
    font-size: 1rem;
  }
  &[data-joined="true"] {
    background: #10b9810f;
    border-color: #10b981;
    color: #065f46;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const ButtonDropdown = styled.button`
  border: 1px solid #d1d5db;
  padding: 0.25rem 1rem;
  border-radius: 0.5rem;
`;
const DropdownWrap = styled.div`
  position: relative;
  display: inline-block;
`;
const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  min-width: 200px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  z-index: 10;
  overflow: hidden;
`;
const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.625rem 0.75rem;
  background: #fff;
  border: 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #111827;
  &:hover {
    background: #f9fafb;
  }
  &[data-danger="true"] {
    color: #b91c1c;
  }
`;

const Banner = styled.div`
  display: ${({ hidden }) => (hidden ? "none" : "flex")};
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
  color: #111827;
  margin-bottom: 1rem;
`;
const BannerText = styled.div`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  svg {
    flex-shrink: 0;
  }
`;
const BannerBtn = styled.button`
  border: 1px solid #111827;
  background: #111827;
  color: #fff;
  border-radius: 10px;
  padding: 0.5rem 0.85rem;
  font-weight: 700;
  font-size: 0.875rem;
`;

/* ===== Learns & Bookmarks ===== */
const Tabs = styled.div`
  display: flex;
  border-top: 1px solid #e5e7eb;
  margin-top: 8px;
`;
const TabButton = styled.button`
  flex: 1;
  padding: 0.75rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-top: 2px solid
    ${({ $active }) => ($active ? "#111827" : "transparent")};
  color: ${({ $active }) => ($active ? "#111827" : "#9ca3af")};
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  @media (min-width: 1280px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;
const BookCell = styled.button`
  aspect-ratio: 1/1;
  position: relative;
  border: 0;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  display: grid;
  place-items: center;
  &:focus-visible {
    outline: 2px solid #111827;
    outline-offset: 2px;
  }
`;
const BookThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
const BookFallback = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
`;

const PostLock = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 24, 39, 0.45);
  color: #fff;
  font-weight: 800;
  font-size: 0.8rem;
`;

const EmptyNote = styled.div`
  padding: 1rem;
  text-align: center;
  color: #6b7280;
`;

/* --------------------------- Loader (1s minimum) --------------------------- */
const LoaderWrap = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoaderText = styled.div`
  color: #6b7280;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
`;

/* -------------------------------- Component ------------------------------ */

export default function TeacherProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const teacherList = useMemo(
    () =>
      Array.isArray(teacherDataSource)
        ? teacherDataSource
        : [teacherDataSource],
    []
  );

  const [teacher, setTeacher] = useState(null);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | notfound

  useEffect(() => {
    const MIN_DELAY = 1000;
    const startedAt = Date.now();

    const resolve = () => {
      const cookieValue = Cookies.get("piLearnData");
      const cookieId = JSON.parse(cookieValue)["teacherId"];
      const stateTeacher =
        location?.state?.teacher && location.state.teacher.id
          ? location.state.teacher
          : null;

      let selected = null;
      if (cookieId)
        selected = teacherList.find((t) => t.id === cookieId) || null;
      if (!selected && stateTeacher?.id)
        selected = teacherList.find((t) => t.id === stateTeacher.id) || null;
      if (!selected && teacherList.length > 0) selected = teacherList[0];

      const finish = () => {
        if (selected) {
          setTeacher(selected);
          setLoadState("ready");
        } else {
          setLoadState("notfound");
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      };

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(MIN_DELAY - elapsed, 0);
      setTimeout(finish, remaining);
    };

    resolve();
  }, [location?.state, teacherList]);

  // UI state
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [isPaying, setIsPaying] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("books"); // "books" | "bookmarks"

  // Profile form modal (after payment)
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const BOOKS_VISIBLE = 3;
  const joinedKey = useMemo(
    () => `joined:${teacher?.id || teacher?.name || "teacher"}`,
    [teacher]
  );

  useEffect(() => {
    if (!teacher) return;
    const joined = localStorage.getItem(joinedKey) === "true";
    setIsJoined(joined);
    const existing = localStorage.getItem(PROFILE_KEY);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        setProfileForm({
          name: parsed.name || "",
          email: parsed.email || "",
          avatar: parsed.avatar || "",
        });
      } catch {
        console.error("Failed to parse profile from storage.");
      }
    }
  }, [teacher, joinedKey]);

  useEffect(() => {
    if (!teacher) return;
    localStorage.setItem(joinedKey, isJoined ? "true" : "false");
  }, [isJoined, joinedKey, teacher]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => {
      const t = e.target;
      if (
        !(
          t.closest &&
          (t.closest('[aria-haspopup="menu"]') || t.closest('[role="menu"]'))
        )
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpen]);

  const handleBookClick = (bookId, index) => {
    if (!isJoined && index >= BOOKS_VISIBLE) {
      setShowPricing(true);
      return;
    }

    // ✅ Get existing cookie
    const existingCookie = Cookies.get("piLearnData");
    let learnData = {};

    // ✅ Parse old cookie if present
    if (existingCookie) {
      try {
        learnData = JSON.parse(existingCookie);
      } catch {
        console.warn("Cookie parse failed, resetting piLearnData");
        learnData = {};
      }
    }

    // ✅ Update / add new data
    const updatedData = {
      ...learnData,
      bookId, // add or update selected book
    };

    // ✅ Save back as JSON
    Cookies.set("piLearnData", JSON.stringify(updatedData), {
      expires: 30,
      sameSite: "lax",
      // secure: true, // enable on HTTPS
    });

    console.log("Updated piLearnData:", updatedData);

    // Continue navigation
    navigate("/pilearn/library");
  };
  const handleJoinClick = () => {
    if (!isJoined) setShowPricing(true);
  };

  const handleDemoPay = async () => {
    setIsPaying(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsPaying(false);
    setShowPricing(false);
    setShowProfileForm(true);
  };

  const handleProfileSubmit = () => {
    const trimmed = {
      name: profileForm.name?.trim(),
      email: profileForm.email?.trim(),
      avatar: profileForm.avatar?.trim(),
      createdAt: new Date().toISOString(),
      plan: selectedPlan,
      isPro: true,
    };
    if (!trimmed.name || !trimmed.email) {
      alert("Please fill Name and Email to continue.");
      return;
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(trimmed));
    setIsJoined(true);
    setShowProfileForm(false);
  };

  const handleCancelMembership = () => {
    localStorage.removeItem(joinedKey);
    localStorage.removeItem(PROFILE_KEY);
    setIsJoined(false);
    setMenuOpen(false);
  };

  const lockedBannerHidden = isJoined;

  if (loadState === "loading") {
    return (
      <LoaderWrap>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <RotatingLines
            visible
            height="48"
            width="48"
            strokeColor="#111827"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="teacher-loading"
          />
          <LoaderText style={{ marginTop: 12 }}>
            Finding your teacher…
          </LoaderText>
        </div>
      </LoaderWrap>
    );
  }

  if (loadState === "notfound" || !teacher) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: 12 }}>We couldn't find that teacher.</p>
          <button
            onClick={() => navigate("/pilearn/")}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const books = Array.isArray(teacher.bookList) ? teacher.bookList : [];
  const bookmarks = Array.isArray(teacher.bookMarks) ? teacher.bookMarks : [];
  const highlights = Array.isArray(teacher.helights) ? teacher.helights : [];

  return (
    <Container>
      <ProfileSection>
        <ProfileTop>
          <AvatarSection>
            <AvatarWrapper>
              <Avatar src={teacher.avatar} alt={teacher.name} />
              {!isJoined && (
                <LockRibbon aria-hidden="true" title="Pro library locked">
                  <Lock size={12} /> LOCKED
                </LockRibbon>
              )}
            </AvatarWrapper>
            <StatsMobile>
              <Stat>
                {teacher.concepts} <span>concepts</span>
              </Stat>
              <Stat>
                {teacher.students} <span>students</span>
              </Stat>
              <Stat>
                {books.length} <span>learns</span>
              </Stat>
            </StatsMobile>
          </AvatarSection>

          <ProfileContent>
            <StatsDesktop>
              <Stat>
                {teacher.concepts} <span>concepts</span>
              </Stat>
              <Stat>
                {teacher.students} <span>students</span>
              </Stat>
              <Stat>
                {teacher.learns} <span>learns</span>
              </Stat>
            </StatsDesktop>

            <Name>{teacher.name}</Name>
            <Subject>{teacher.subject}</Subject>
            <Bio>{teacher.bio}</Bio>
            <Experience>🎓 {teacher.experience} years experience</Experience>

            <Actions>
              <ButtonPrimary
                onClick={() => console.log("Now you are following")}
              >
                Follow
              </ButtonPrimary>

              <ButtonSecondary
                onClick={handleJoinClick}
                disabled={isPaying}
                data-joined={isJoined}
                aria-pressed={isJoined}
                aria-label={isJoined ? "Joined" : "Join"}
                title={isJoined ? "You're in!" : "Join this teacher"}
              >
                {isJoined ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Check size={18} /> Joined
                  </span>
                ) : isPaying ? (
                  "Processing…"
                ) : (
                  "Join"
                )}
              </ButtonSecondary>

              <DropdownWrap>
                <ButtonDropdown
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="More options"
                  onClick={() => setMenuOpen((v) => !v)}
                  title="More options"
                >
                  ▼
                </ButtonDropdown>
                {menuOpen && (
                  <DropdownMenu role="menu">
                    {isJoined && (
                      <DropdownItem
                        role="menuitem"
                        data-danger="true"
                        onClick={handleCancelMembership}
                        title="Cancel your membership"
                      >
                        <X size={16} /> Cancel membership
                      </DropdownItem>
                    )}
                    <DropdownItem
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      Close
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </DropdownWrap>
            </Actions>

            <Banner hidden={lockedBannerHidden} role="note" aria-live="polite">
              <BannerText>
                <Lock size={18} /> Pro library locked — get full access to all
                concepts & posts.
              </BannerText>
              <BannerBtn
                onClick={() => setShowPricing(true)}
                aria-label="Unlock full library"
              >
                Unlock
              </BannerBtn>
            </Banner>
          </ProfileContent>
        </ProfileTop>

        {/* ===== Instagram-like Highlights ===== */}
        {highlights.length > 0 && (
          <Highlights
            highlights={highlights}
            defaultDurationMs={5000}
            onOpen={(id) => console.log("highlight open:", id)}
            onClose={() => console.log("highlight close")}
          />
        )}

        {/* ===== Tabs: Books | Bookmarks ===== */}
        <Tabs>
          <TabButton
            $active={activeTab === "books"}
            onClick={() => setActiveTab("books")}
            aria-pressed={activeTab === "books"}
          >
            <Grid size={20} /> Learns
          </TabButton>
          <TabButton
            $active={activeTab === "bookmarks"}
            onClick={() => setActiveTab("bookmarks")}
            aria-pressed={activeTab === "bookmarks"}
          >
            <Bookmark size={20} /> Bookmarks
          </TabButton>
        </Tabs>

        {/* ===== Tab Panels ===== */}
        {activeTab === "books" ? (
          books.length === 0 ? (
            <EmptyNote>No learns available</EmptyNote>
          ) : (
            <BooksGrid aria-label="Teacher books">
              {books.map((book, i) => {
                const locked = !isJoined && i >= BOOKS_VISIBLE;
                const thumb = book?.thumbnail || "";
                return (
                  <BookCell
                    key={book.bookId ?? i}
                    onClick={() => handleBookClick(book.bookId, i)}
                    aria-disabled={locked}
                    title={
                      locked
                        ? "Join to unlock"
                        : `Open ${book?.title || "Book"}`
                    }
                  >
                    {thumb ? (
                      <BookThumb
                        src={thumb}
                        alt={book?.title || "Book thumbnail"}
                      />
                    ) : (
                      <BookFallback>
                        <BookOpen size={24} />
                      </BookFallback>
                    )}
                    {locked && (
                      <PostLock>
                        <Lock size={16} style={{ marginRight: 6 }} /> Join to
                        view
                      </PostLock>
                    )}
                  </BookCell>
                );
              })}
            </BooksGrid>
          )
        ) : // Bookmarks tab
        bookmarks.length === 0 ? (
          <EmptyNote>No bookmarks yet</EmptyNote>
        ) : (
          <BooksGrid aria-label="Bookmarks">
            {bookmarks.map((bm, i) => (
              <BookCell
                key={bm.id ?? i}
                onClick={() => console.log("open bookmark", bm)}
                title={bm.title || "Bookmark"}
              >
                {bm.thumbnail ? (
                  <BookThumb src={bm.thumbnail} alt={bm.title || "Bookmark"} />
                ) : (
                  <BookFallback>
                    <Bookmark size={22} />
                  </BookFallback>
                )}
              </BookCell>
            ))}
          </BooksGrid>
        )}
      </ProfileSection>

      {/* ----------------------------- Pricing Modal ----------------------------- */}
      {showPricing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pricing-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17,24,39,.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "min(96vw, 720px)",
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 20px 48px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <h3
                id="pricing-title"
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Choose your plan
              </h3>
              <button
                onClick={() => setShowPricing(false)}
                aria-label="Close pricing"
                style={{
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  borderRadius: 8,
                  padding: 4,
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
              {[
                {
                  key: "basic",
                  name: "Basic",
                  price: "₹0",
                  desc: "Demo access: 3 lessons",
                },
                {
                  key: "pro",
                  name: "Pro",
                  price: "₹99",
                  desc: "Monthly: full library",
                },
                {
                  key: "team",
                  name: "Team",
                  price: "₹1,99",
                  desc: "Up to 10 students",
                },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPlan(p.key)}
                  aria-pressed={selectedPlan === p.key}
                  style={{
                    border: `1px solid ${
                      selectedPlan === p.key ? "#2563eb" : "#e5e7eb"
                    }`,
                    borderRadius: 14,
                    padding: "1rem",
                    textAlign: "left",
                    background: selectedPlan === p.key ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {p.name}
                  </h4>
                  <strong style={{ fontSize: "1.25rem" }}>{p.price}</strong>
                  <p
                    style={{
                      margin: 0,
                      color: "#6b7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    {p.desc}
                  </p>
                </button>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid #f3f4f6",
                padding: "0.75rem 1.25rem",
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowPricing(false)}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 10,
                  padding: "0.6rem 1rem",
                  fontWeight: 600,
                  background: "#fff",
                }}
              >
                Not now
              </button>
              <button
                onClick={handleDemoPay}
                disabled={isPaying}
                style={{
                  background: "#111827",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "0.6rem 1rem",
                  fontWeight: 700,
                  opacity: isPaying ? 0.6 : 1,
                }}
              >
                {isPaying ? "Processing payment…" : "Demo Pay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------ Profile Form Modal (after pay) ------------------------ */}
      {showProfileForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-form-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17,24,39,.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "min(96vw, 720px)",
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 20px 48px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <h3
                id="profile-form-title"
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Create your student profile
              </h3>
              <button
                onClick={() => setShowProfileForm(false)}
                aria-label="Close profile form"
                style={{
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  borderRadius: 8,
                  padding: 4,
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                padding: "1rem 1.25rem",
                display: "grid",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "grid", gap: "0.25rem" }}>
                <label
                  htmlFor="pf-name"
                  style={{ fontSize: "0.85rem", color: "#374151" }}
                >
                  Full Name
                </label>
                <input
                  id="pf-name"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g., Priya Sharma"
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: 10,
                    padding: "0.6rem 0.75rem",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
              <div style={{ display: "grid", gap: "0.25rem" }}>
                <label
                  htmlFor="pf-email"
                  style={{ fontSize: "0.85rem", color: "#374151" }}
                >
                  Email
                </label>
                <input
                  id="pf-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: 10,
                    padding: "0.6rem 0.75rem",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
              <div style={{ display: "grid", gap: "0.25rem" }}>
                <label
                  htmlFor="pf-avatar"
                  style={{ fontSize: "0.85rem", color: "#374151" }}
                >
                  Avatar initials (optional)
                </label>
                <input
                  id="pf-avatar"
                  value={profileForm.avatar}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, avatar: e.target.value }))
                  }
                  placeholder="PS"
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: 10,
                    padding: "0.6rem 0.75rem",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem 1rem",
              }}
            >
              <button
                onClick={() => setShowProfileForm(false)}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 10,
                  padding: "0.6rem 1rem",
                  fontWeight: 600,
                  background: "#fff",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleProfileSubmit}
                style={{
                  background: "#111827",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "0.6rem 1rem",
                  fontWeight: 700,
                }}
              >
                Save & Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
