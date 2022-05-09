import React from "react";
import "./styles.css";

const Input = (props) => {
    return (
        <div className="input-container">
            <p className="heading4 mb-1">{props.name}</p>
            {/* <input
                className="custom-inputbox"
                onChange={props.handleChange}
            ></input> */}

            <input className="custom-inputbox" onChange={props.handleChange}></input>
        </div>
    );
};

export default Input;
