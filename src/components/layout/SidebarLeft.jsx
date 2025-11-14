import { FiHome, FiBookOpen, FiUser, FiMenu, FiHeart } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { PiPiBold } from "react-icons/pi";

const shine = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const SidebarContainer = styled.aside`
  width: 245px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #dbdbdb;
  padding: 8px 0 20px;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  transition: width 200ms ease, padding 200ms ease;
`;

const Logo = styled(Link)`
  padding: 25px 12px 16px 12px;
  margin-bottom: 19px;
  margin-left: 20px;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: padding 200ms ease, margin 200ms ease;
  gap: 5px;
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
  font-size: 28px;
  font-family: "BBH Sans Hegarty", sans-serif;
  font-weight: 700;
  color: black;
  letter-spacing: 0.2px;
  line-height: 1;
`;

const NavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const activeStyles = css`
  color: #00dbe4;
  font-weight: 700;
  transform: translateX(2px) scale(1.02);
  svg {
    stroke-width: 2.5;
  }

  /* Glowing animated bar on the left */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 3px;
    border-radius: 3px;
    background: linear-gradient(90deg, #00f5ff, #0088ff, #00f5ff);
    background-size: 200% 200%;
    animation: ${shine} 4s linear infinite;
    box-shadow: 0 0 8px rgba(0, 245, 255, 0.8);
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 12px 12px 16px;
  margin: 4px 8px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? "700" : "400")};
  color: #262626;
  background: transparent;
  transition: background-color 150ms ease, transform 200ms ease,
    color 150ms ease;
  position: relative;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #fafafa;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(0, 245, 255, 0.3);
    border-radius: 10px;
  }

  svg {
    font-size: 26px;
    stroke-width: ${(props) => (props.$active ? "2.5" : "2")};
    min-width: 26px;
    margin-left: 8px;
    flex-shrink: 0;
    transition: stroke-width 150ms ease;
  }

  ${(props) => props.$active && activeStyles}
`;

const BottomSection = styled.div`
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid #dbdbdb;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LabelText = styled.span`
  white-space: nowrap;
  transition: opacity 120ms ease, width 200ms ease;
`;

export default function InstagramSidebar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/", icon: <FiHome />, label: "Home" },
    {
      to: "/teacher",
      icon: <FaChalkboardTeacher />,
      label: "Teacher",
    },
    {
      to: "/library",
      icon: <FiBookOpen />,
      label: "Library",
      hasNotification: true,
    },
    {
      to: "/alakhsirnotes",
      icon: <FiHeart />,
      label: "Notifications",
    },
    { to: "/profile", icon: <FiUser />, label: "Profile" },
  ];

  return (
    <SidebarContainer>
      <Logo to="/">
        <div>
          <LogoMark aria-hidden="true" />
        </div>
        <LogoText>Learn</LogoText>
      </Logo>

      <NavLinks>
        {links.slice(0, -1).map((link) => (
          <NavLink key={link.to} to={link.to} $active={pathname === link.to}>
            <IconWrapper>{link.icon}</IconWrapper>
            <LabelText>{link.label}</LabelText>
            {link.hasNotification}
          </NavLink>
        ))}

        <NavLink
          to={links[links.length - 1].to}
          $active={pathname === links[links.length - 1].to}
        >
          <IconWrapper>{links[links.length - 1].icon}</IconWrapper>
          <LabelText>{links[links.length - 1].label}</LabelText>
        </NavLink>
      </NavLinks>

      <BottomSection>
        <NavLink
          to="/more"
          $active={pathname === "/more"}
        >
          <IconWrapper>
            <FiMenu />
          </IconWrapper>
          <LabelText>More</LabelText>
        </NavLink>
      </BottomSection>
    </SidebarContainer>
  );
}
