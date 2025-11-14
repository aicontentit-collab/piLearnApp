import { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Feed from "./pages/Feed.jsx";
import InstalearnApp from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import Topbar from "./components/layout/Topbar.jsx";
import SidebarLeft from "./components/layout/SidebarLeft.jsx";
import SidebarRight from "./components/layout/SidebarRight.jsx";
import BottomNav from "./components/layout/BottomNav.jsx";
import TeacherProfile from "./pages/TeacherProfile.jsx";



// Styled Components
const AppWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--color-light, #f5f5f5);
`;

const LeftSidebar = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    width: 280px; /* left sidebar true width */
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }
`;

const MainLayout = styled.div`
  flex: 1;
  display: flex;
  width: 100%;

  @media (min-width: 1024px) {
    /* match LeftSidebar width exactly to avoid layout jump */
    margin-left: 246px;
  }
`;

/* Main content always reserves space for the (always-open) right sidebar */
const MainContent = styled.main`
  flex: 1;
  width: 100%;
  padding-bottom: 60px;
  transition: ${(props) => (props.$isResizing ? "none" : "margin-right 0.2s ease")};
  will-change: margin-right;

  @media (min-width: 1024px) {
    padding-bottom: 0;
    margin-right: ${(props) => `${props.$sidebarWidth}px`};
  }
`;

/* Sidebar is docked and always open on desktop */
const RightSidebar = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    width: ${(props) => props.$width}px;
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    background: #fff;
    z-index: 50;
    box-shadow: -2px 0 8px rgba(0,0,0,0.08);
    /* It's always open; keep transform at 0 to avoid sliding out */
    transform: translateX(0);
    transition: ${(props) => (props.$isResizing ? "none" : "width 0.1s ease")};
    will-change: width;
    contain: layout;
  }
`;

/* Resize handle inside the sidebar (always visible on desktop) */
const ResizeHandle = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    position: absolute;
    left: 0;   /* sits at the inner left edge of the right sidebar */
    top: 0;
    bottom: 0;
    width: 8px;
    cursor: ew-resize;
    z-index: 52;

    &:hover::before,
    &.active::before {
      content: '';
      position: absolute;
      left: 2px;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #0066cc;
      border-radius: 2px;
    }
  }
`;

const MobileTopbar = styled.div`
  display: block;
  margin-bottom: 60px;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileBottomNav = styled.div`
  display: block;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export default function App() {
  // Always-open on desktop; width is adjustable.
  const [sidebarWidth, setSidebarWidth] = useState(360);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);

  const MIN_WIDTH = 350;
  const MAX_WIDTH = 600;

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = { startX: e.clientX, startWidth: sidebarWidth };
  };

  useEffect(() => {
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const handleMouseMove = (e) => {
      if (!isResizing || !resizeRef.current) return;
      const { startX, startWidth } = resizeRef.current;
      const deltaX = startX - e.clientX; // dragging left increases width
      const newWidth = clamp(startWidth + deltaX, MIN_WIDTH, MAX_WIDTH);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        resizeRef.current = null;
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return (
    <AppWrapper>
      <LeftSidebar>
        <SidebarLeft />
      </LeftSidebar>

      <MainLayout>
        <MainContent $sidebarWidth={sidebarWidth} $isResizing={isResizing}>
          <MobileTopbar>
            <Topbar />
          </MobileTopbar>

          <Routes>
            <Route path="/" element={<InstalearnApp />} />
            <Route path="/teacher" element={ <TeacherProfile />} />
            <Route path="/library" element={<Feed />} />
            <Route path="/notifications" element={<ComingSoon />} />
            <Route path="/more" element={<ComingSoon />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </MainContent>

        <RightSidebar $width={sidebarWidth} $isResizing={isResizing}>
          <ResizeHandle
            className={isResizing ? "active" : ""}
            onMouseDown={startResizing}
            aria-label="Resize sidebar"
          />
          <SidebarRight />
        </RightSidebar>
      </MainLayout>

      <MobileBottomNav>
        <BottomNav />
      </MobileBottomNav>
    </AppWrapper>
  );
}
