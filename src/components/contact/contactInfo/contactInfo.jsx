import React from "react";
import "./contactInfo.scss";

import ContactInfoBox from "../contactInfo/contactInfoBox";


import ContactInfoIcon1 from '../../../assets/contact/contact-info-icon1.svg';
import ContactInfoIcon2 from "../../../assets/contact/contact-info-icon2.svg";
import ContactInfoIcon3 from "../../../assets/contact/contact-info-icon3.svg";


const contactInfo = () => (
  <div className="row">
    <div className="col-12">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-3 contact__info">
          <ContactInfoBox
            icon={ContactInfoIcon1}
            textLine1="1211 Awesome Avenue,"
            textLine2="NY USD"
          />
        </div>
        <div className="col-12 col-lg-3 contact__info">
          <ContactInfoBox
            icon={ContactInfoIcon2}
            textLine1="+00 123 - 456 -78"
            textLine2="+00 987 - 654 -32"
          />
        </div>
        <div className="col-12 col-lg-3 contact__info">
          <ContactInfoBox
            icon={ContactInfoIcon3}
            textLine1="mint@mintmail.com"
            textLine2=""
          />
        </div>
      </div>
    </div>
  </div>
);

export default contactInfo;
