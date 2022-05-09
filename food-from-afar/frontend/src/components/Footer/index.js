import React from "react";
import "./styles.css";
// import SvgIcons from "../SvgIcons";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-left">
                <p className="heading3">Food from Afar</p>
            </div>
            <div>
                <div className="footer-title">
                    {/* <p className="heading3">Ready to Get Started</p> */}
                </div>
                <div className="footer-request-demo">
                    <input
                        className="footer-input"
                        type="email"
                        placeholder="Your Email"
                    ></input>
                    <button className="primary-btn">Request a Demo</button>
                </div>
            </div>
        </div>
    );
};

export default Footer;
