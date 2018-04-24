import React from "react";
// import PropTypes from "prop-types";
import style from "./legend.css";

const Legend = () => (
    <div className={style.container}>
        <div className={style.distance}>100m</div>
        <div className={style.meter}/>
    </div>
);

export default Legend;
