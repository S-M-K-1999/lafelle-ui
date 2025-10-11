import React from 'react';
import '../style/App.scss';

// Components
import DesktopNav from './navbar/desktop-nav';
import MobileNav from './navbar/mobile-nav';
import Backdrop from "./navbar/backdrop";
import Hero from './hero/hero';
import Portfolio from './portfolio/portfolio';
import Partners from "./partners/partners";
import About from "./about/about";
import Contact from "./contact/contact";
import Footer from "./footer/footer";

class LandingPage extends React.Component {
  state = {
    userIsScrolled: false,
    mobileNavbarOpen: false,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.userIsScrolled);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.userIsScrolled);
  }

  // Detect if user is scorlled down (used for add/disable extra large navbar)
  userIsScrolled = () => {
    if (window.pageYOffset > 80) {
      this.setState({ userIsScrolled: true });
    } else {
      this.setState({ userIsScrolled: false });
    }
  };
  // On closeMobileMenu click close navbar
  closeMobileMenu = () => {
    this.setState({ mobileNavbarOpen: false });
  };
  // Mobile menu handler
  mobileMenuOpen = () => {
    this.setState({ mobileNavbarOpen: true });
  };

  render() {
    // BACKDROP RENDER
    let backdrop = <Backdrop closeMobileMenu={this.closeMobileMenu} />;
    if (this.state.mobileNavbarOpen) {
      backdrop = (
        <Backdrop closeMobileMenu={this.closeMobileMenu} isOpen={true} />
      );
    }
    // MOBILE NAVBAR RENDER
    let mobileNavbar = <MobileNav />;
    if (this.state.mobileNavbarOpen) {
      mobileNavbar = (
        <MobileNav isOpen={true} closeMobileMenu={this.closeMobileMenu} />
      );
    }

    return (
      <div className="LandingPage">
        {mobileNavbar}
        {backdrop}
        <DesktopNav
          userIsScrolled={this.state.userIsScrolled}
          mobileMenuOpen={this.mobileMenuOpen}
        />
        <Hero />
        <Portfolio />
        <About />
        <Contact />
        <Footer />
      </div>
    );
  }
}

export default LandingPage;
