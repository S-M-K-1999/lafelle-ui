import React from "react";
import "./WhatsAppButton.scss";
import WhatsAppIcon from "../../assets/icons/whatsapp.png"; // update path if needed

const WhatsAppButton = () => {
  const phoneNumber = process.env.REACT_APP_WHATSAPP_NUMBER; // your WhatsApp number with country code
  const message = "Hi, I'm interested in your products!";
  
  const handleClick = () => {
    console.log("phone number--->", phoneNumber)
    console.log("=--->", process.env.REACT_APP_API_URL)

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="whatsapp-button" onClick={handleClick} title="Chat with us on WhatsApp">
      <img src={WhatsAppIcon} alt="WhatsApp" />
    </div>
  );
};

export default WhatsAppButton;
