import React from "react";
import { Row, Col } from "react-flexbox-grid";
// SCSS
import "./hero.scss";
//Assets
import HeroImage from '../../assets/hero/hero-image.jpg';
//Components
import Button from '../ui-components/button/button';

const hero = () => (
  <div className="hero" id="hero">
    <div className="wrapper">
      <Row>
        <Col md={12} lg={6}>
          <div className="hero-info">
            <h1 className="weight800 font60">
              Beautiful Blooms, Delivered to Your Door.
            </h1>
            <p className="font12">
              Discover our curated collection of fresh, seasonal flowers. We source the finest blooms to create stunning, hand-crafted arrangements that are perfect for any occasion, or just to brighten your day.
            </p>
            <Button label="SHOP NOW" target={"contact"} />
          </div>
        </Col>
        <Col md={12} lg={6}>
          <div className="hero-image">
            <img src={HeroImage} alt="hero" />
          </div>
        </Col>
      </Row>
    </div>
  </div>
);

export default hero;
