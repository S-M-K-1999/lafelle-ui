import React from "react";
import "./about.scss";
// Components
import TeamBox from './teamBox';
import TeamInfo from "./teamInfo";
import Title from "../ui-components/title/title";
// Assets
import shop1 from "../../assets/shop/shop1.jpeg";

const about = () => (
  <div id="about">
    <div className="wrapper">
      <Title title="ABOUT US." />
      <p className="font15" style={{fontSize: '1.2rem'}}>
        We bring joy to every moment with beautifully crafted floral arrangements and irresistible chocolates made with love.<br></br> 
        Our passion is creating thoughtful gifts that speak from the heart and make every occasion unforgettable.
      </p>
      <div className="row">
        <div className="col-12 col-lg-4">
          <TeamBox avatar={shop1} name="Lafelle Flowers" job="alain" />
        </div>
        <div className="col-12 col-lg-4">
          <TeamInfo />
        </div>
      </div>
    </div>
  </div>
);

export default about;
