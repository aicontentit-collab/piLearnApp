import { Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { RxHamburgerMenu } from "react-icons/rx";
import { PiPiBold } from "react-icons/pi";

/* ================= Styles ================= */

const SafeSticky = styled(Navbar)`
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: saturate(180%) blur(14px);
  padding-top: max(env(safe-area-inset-top), 6px);
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const Bar = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Center = styled.div`
  justify-self: center;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const IconBtn = styled.button`
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 12px;
  transition: transform 120ms ease, background 120ms ease;
  &:active {
    transform: scale(0.96);
  }
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const Logo = styled(Link)`
  padding: 10px 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px; /* space between icon and text */
`;

const LogoMark = styled(PiPiBold)`
  border-radius: 5px;
  background-color: black;
  width: 35px;
  height: 30px;
  flex: 0 0 28px;
  color: white; /* keep high contrast; adjust to your brand */
  padding: 1px;
`;

const LogoText = styled.div`
  font-size: 30px;
  font-family: "BBH Sans Hegarty", sans-serif;
  font-weight: 600;
  background: black;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent; /* fallback */
  -webkit-text-fill-color: transparent; /* webkit */
  letter-spacing: 0.2px;
  line-height: 1;
`;

/* ================= Component ================= */

export default function Topbar() {
  const handleToggle = () => {
    console.log("Toggled theme");
  };

  return (
    <div className="topbar-wrapper">
      {/* Mobile-only top bar */}
      <SafeSticky className="shadow-sm d-lg-none">
        <Container fluid className="px-3">
          <Bar>
            <Left>
              <Logo to="/pilearn/" aria-label="Go to home">
                <div>
                  <LogoMark aria-hidden="true" />
                </div>
                <LogoText>Learn</LogoText>
              </Logo>
            </Left>

            <Center />

            <Right>
              <IconBtn type="button" onClick={handleToggle} aria-label="Toggle">
                <RxHamburgerMenu size={20} />
              </IconBtn>
            </Right>
          </Bar>
        </Container>
      </SafeSticky>
    </div>
  );
}
