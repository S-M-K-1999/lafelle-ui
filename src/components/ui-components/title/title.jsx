import React from "react";

import "./title.scss";

const title = (props) => (
  <div className="row">
    <div className="col-12 big__title">
      <h2 className="weight800 font60 padding40">{props.title}</h2>
    </div>
  </div>
);

export default title;
