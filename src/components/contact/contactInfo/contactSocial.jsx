import React from "react";
import "./contactSocial.scss";


import FacebookIcon from "../../../assets/contact/facebook.svg";
import TwitterIcons from "../../../assets/contact/twitter.svg";
import DribbleIcon from "../../../assets/contact/dribble.svg";


const contactSocial = () => (
  <div className="row">
    <div className="col-12">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-1 contact__social">
          <img src={FacebookIcon} alt="facebook" />
        </div>
        <div className="col-12 col-lg-1 contact__social">
          <img src={TwitterIcons} alt="Twitter" />
        </div>
        <div className="col-12 col-lg-1 contact__social">
          <img src={DribbleIcon} alt="Dribble" />
        </div>
      </div>
    </div>
  </div>
);

export default contactSocial;
