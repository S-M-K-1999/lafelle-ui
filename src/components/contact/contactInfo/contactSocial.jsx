import React from "react";
import "./contactSocial.scss";

import FacebookIcon from "../../../assets/contact/facebook.png";
import InstagramIcon from "../../../assets/contact/insta.png";
import EmailIcon from "../../../assets/contact/email.png";

const ContactSocial = () => (
  <div className="row">
    <div className="col-12">
      <div className="row justify-content-around">
        {/* Facebook */}
        <div className="col-12 col-lg-1 contact__social">
          <a
            href="https://www.facebook.com/lafelle.ae/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={FacebookIcon} alt="Facebook" />
          </a>
        </div>

        {/* Instagram */}
        <div className="col-12 col-lg-1 contact__social">
          <a
            href="https://www.instagram.com/lafelle.ae/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={InstagramIcon} alt="Instagram" />
          </a>
        </div>

        {/* Email */}
        <div className="col-12 col-lg-1 contact__social">
          <a
            href="mailto:info@lafelle.ae?subject=Contact&body=Hello,%0D%0A%0D%0ALorem ipsum dolor sit amet, consectetur adipiscing elit.%0D%0A%0D%0AThanks."
          >
            <img src={EmailIcon} alt="Email" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default ContactSocial;
