import React from "react";
import "./contact.scss";
import * as emailjs from "emailjs-com";
import Title from "../ui-components/title/title";
import ContactInfo from './contactInfo/contactInfo';
import ContactSocial from './contactInfo/contactSocial';
import Modal from '../contact-modal/Modal';

import ContactBackground from '../../assets/contact/bg.png';

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
      sending: false,
      successModal: false,
      errorModal: false,
    };
  }

  inputHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
  
    const { name, email, message } = this.state;
  
    // Format WhatsApp message
    const text = `New Contact Form Submission:%0A
    Name: ${name}%0A
    Email: ${email}%0A
    Message: ${message}`;
  
    // Open WhatsApp chat
    window.open(`https://wa.me/918943694548?text=${text}`, "_blank");
    
    // Optional: reset form
    this.resetForm();
  };

  // SUCCESS MODAL
  showSuccessModal = () => {
    this.setState({ successModal: true, sending: false });
    this.resetForm();
  };
  // ERROR MODAL
  showErrorModal = () => {
    this.setState({ errorModal: true, sending: false });
    this.resetForm();
  };
  // RESET CONTACT FORM
  resetForm() {
    this.setState({ name: "", email: "", message: "" });
  }
  // CLOSE ALL MODALS
  closeModal = () => {
    this.setState({ successModal: false, errorModal: false });
  };


  render() {
    let submitButtonRender = (
      <div className="small__button">
        <button aria-label="send message" type="submit" value="Send Message">
          Send Message
        </button>
      </div>
    );
    if (this.state.sending) {
      submitButtonRender = (
        <div className="small__button sending-btn">
          <div className="flex-center">
            <div className="sbl-circ"></div>
          </div>
        </div>
      );
    }
    let modalRender = null;
    if (this.state.successModal) {
      modalRender = <Modal closeModal={this.closeModal} status="success" />;
    } else if (this.state.errorModal) {
      modalRender = <Modal closeModal={this.closeModal} status="error" />;
    }
    return (
      <div id="contact">
        {modalRender}
        <div className="wrapper">
          <Title title="CONTACT US." />

          <div className="row padding40">
            <div className="col-12 col-lg-6">
              <form id="contact-form" onSubmit={this.handleSubmit}>
                <h4 className="font30 weight800 padding30">Send Us Message.</h4>
                <input type="text" placeholder="Name" required name="name" value={this.state.name} onChange={this.inputHandler} />
                <input type="email" placeholder="Email" required name="email" value={this.state.email} onChange={this.inputHandler} />
                <textarea
                  rows="6"
                  cols="50"
                  placeholder="Message..."
                  required
                  name="message"
                  value={this.state.message}
                  onChange={this.inputHandler}
                ></textarea>
                {submitButtonRender}
              </form>
            </div>
            <div className="col-12 col-lg-6">
              <div className="map-container">
                <iframe
                  title="Google Map Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227.31364631401573!2d55.78091431747451!3d24.27608991239806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8ab5793b00a803%3A0x9ef688bf98da9402!2zbGFmZWxsZSBmbG93ZXJzIGFsYWluINmE2KfZgdmK2YTZiiDYstmH2YjYsSDYp9mE2YfYr9in2YrYpyDZhdiv2YrZhtipINin2YTYudmK2YYg2KfZhNmH2YrZhNmK!5e0!3m2!1sen!2sin!4v1760180752521!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
          {/* <ContactInfo /> */}
          <ContactSocial />
        </div>
      </div>
    );
  }
};

export default Contact;
