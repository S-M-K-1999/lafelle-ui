import React from "react";
import { Link } from "react-scroll";
import "./footer.scss";

import Logo from './logo-white.png';
import Arrow from '../../assets/footer/arrow.svg';

const partnerBox = () => (
  <div className="footer">
    <div className="wrapper">
      <div className="row">
        <div className="col-12 col-sm-6 col-md-6">
          <div className="footer-box">
            <img src={Logo} alt="logo" style={{maxWidth: "15rem"}}/>
            <p>© 2025 - Lafelle,All Right Reserved</p>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-6">
          <Link to="hero" spy={true} smooth={true} offset={0} duration={500}>
            <div className="footer-box back-to-top">
              <p>BACK TO TOP</p>
              <img src={Arrow} alt="arrow" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  </div>
);
export default partnerBox;
