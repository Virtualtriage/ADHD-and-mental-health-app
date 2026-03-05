import React, { useState, useRef, useEffect} from "react";
import { FaCaretDown } from 'react-icons/fa';
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sidePanelRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const toggleMenu = () => {
    if (!isMenuOpen) {
      // When opening the menu, close all dropdowns first
      setIsInfoOpen(false);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Defer event listener setup to avoid blocking initial render
    let cleanup = null;
    const timeoutId = setTimeout(() => {
      const handleOutsideClick = (event) => {
        if (
          sidePanelRef.current &&
          !sidePanelRef.current.contains(event.target) &&
          hamburgerRef.current &&
          !hamburgerRef.current.contains(event.target)
        ) {
          setIsMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      cleanup = () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      setIsInfoOpen(false);
    }
  }, [isMenuOpen]);

  // Nav links content for reuse
  const navLinks = (
    <div className="nav-links">
      <Link to="https://virtualtriage.ai/">
        <button className="nav-button">Home</button>
      </Link>

      <Link to="https://virtualtriage.ai/practitioners">
        <button className="nav-button">Practitioners</button>
      </Link>

      <div
        className="nav-dropdown"
        onMouseEnter={() => !isMenuOpen && setIsInfoOpen(true)}
        onMouseLeave={() => !isMenuOpen && setIsInfoOpen(false)}
      >
        <button
          onClick={() => setIsInfoOpen((prev) => !prev)}
          className="nav-button"
        >
          Company
          <FaCaretDown />
        </button>
        {isInfoOpen && (
          <div className="nav-dropdown-menu">
            <Link to="https://virtualtriage.ai/contact" onClick={() => setIsMenuOpen(false)}>
              <button className="nav-dropdown-item">Contact Us</button>
            </Link>
            <Link to="https://virtualtriage.ai/about" onClick={() => setIsMenuOpen(false)}>
              <button className="nav-dropdown-item">About Us</button>
            </Link>
            <Link to="https://virtualtriage.ai/blogs" onClick={() => setIsMenuOpen(false)}>
              <button className="nav-dropdown-item">Blogs</button>
            </Link>
            <Link to="https://virtualtriage.ai/compliance" onClick={() => setIsMenuOpen(false)}>
              <button className="nav-dropdown-item">Compliance</button>
            </Link>
            <Link to="https://virtualtriage.ai/pricing" onClick={() => setIsMenuOpen(false)}>
              <button className="nav-dropdown-item">Pricing</button>
            </Link>
          </div>
        )}
      </div>

      <Link to="https://virtualtriage.ai/find-practitioners">
        <button className="find-practitioner-nav-btn">
          Find Doctors
        </button>
      </Link>
      <button
        className="button-button-login"
        onClick={() => window.location.href = "https://patient.virtualtriage.ai/login"}
        target="_blank"
        rel="noreferrer"
      >
        Login
      </button>
    </div>
  );

  return (
    <nav className="nav">
      <div className="nav-desktop-row">
        <div className="Nav-logo">
          <Link to="https://virtualtriage.ai/">
            <img src={`${process.env.PUBLIC_URL}/assets/logo512.webp`} alt="VirtualTriage" />
          </Link>
        </div>
        {navLinks}
      </div>
      <div className="navbar-hamburger" ref={hamburgerRef} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      {/* Mobile side panel nav links */}
      <div
        className={`side-panel ${isMenuOpen ? "open" : ""}`}
        ref={sidePanelRef}
      >
        {navLinks}
      </div>
    </nav>
  );
}

export default Navbar;
