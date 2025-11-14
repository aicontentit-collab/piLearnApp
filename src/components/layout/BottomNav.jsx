import { Nav } from "react-bootstrap";
import { FiHome, FiBookOpen, FiUser } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();
  const navItems = [
    ["/pilearn/", <FiHome />],
    ["/pilearn/teacher", <FaChalkboardTeacher />],
    ["/pilearn/library", <FiBookOpen />],
    ["/pilearn/profile", <FiUser />],
  ];

  return (
    <>
      <style>{`
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .bottom-nav {
          border-top: 1px solid rgba(255,255,255,0.1);
          background: rgba(0, 0, 0, 0.85);
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(8px);
        }

        .nav-link {
          position: relative;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .nav-link.active {
          color: #00F5FF !important;
          transform: scale(1.1);
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 3px;
          border-radius: 2px;
          background-color: #00F5FF;
          box-shadow: 0 0 6px #00F5FF;
          animation: shine 4s linear infinite;
          background: linear-gradient(90deg, #00F5FF, #0088FF, #00F5FF);
          background-size: 200% 200%;
        }
      `}</style>

      <Nav className="bottom-nav fixed-bottom d-flex justify-content-around py-2 d-lg-none">
        {navItems.map(([path, icon]) => (
          <Link
            key={path}
            to={path}
            className={`nav-link fs-4 text-white ${pathname === path ? "active" : ""}`}
          >
            {icon}
          </Link>
        ))}
      </Nav>
    </>
  );
}
