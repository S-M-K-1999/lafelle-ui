import React from 'react';
import { Link } from "react-scroll";
import { useNavigate } from 'react-router-dom';
 // SCSS
import './navbar.scss';
// Assets
import LogoImg from '../../assets/navbar/logo.png';
import MobileMenuIcon from '../../assets/navbar/mobile-menu.svg';

const DesktopNav = (props) => {
  const navigate = useNavigate();
  return (
  <nav className={`Navbar ${!props.userIsScrolled ? "extraLargeNavbar" : ""}`}>
    <div className="wrapper flex-s-between">
      <div>
        <Link to="hero" spy={true} smooth={true} offset={0} duration={500}>
          <img src={LogoImg} alt="logo" className="pointer" style={{ width: '150px', height: 'auto' }} />
        </Link>
      </div>
      <div className="mobile__menu" onClick={props.mobileMenuOpen}>
        <img src={MobileMenuIcon} alt="menu" />
      </div>
      <div className="desktop__menu">
        <ul className="flex-s-between">
          <li>
            <Link activeClass="active-link" to="portfolio" spy={true} smooth={true} offset={-70} duration={500}>
              WORK
            </Link>
          </li>
          <li>
            <Link activeClass="active-link" to="about" spy={true} smooth={true} offset={-70} duration={500}>
              ABOUT
            </Link>
          </li>
          <li>
            <Link activeClass="active-link" to="contact" spy={true} smooth={true} offset={-70} duration={500}>
              CONTACT
            </Link>
          </li>
          <li>
            <Link activeClass="active-link" onClick={() => navigate('/shop')} spy={true} smooth={true} offset={-70} duration={500}>
              SHOP
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  );
  }

export default DesktopNav;