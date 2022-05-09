import React, { useState } from "react";
import "./styles.css";
import SvgIcons from "../SvgIcons";

const FAQItem = (props) => {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <div>
            <div
                className="faq-question"
                onClick={() => setShowAnswer(!showAnswer)}
            >
                <p>{props.question}</p>
                {showAnswer ? (
                    <SvgIcons icon="upArrow" />
                ) : (
                    <SvgIcons icon="downArrow" />
                )}
            </div>

            {showAnswer && <div className="faq-answer">{props.answer}</div>}
        </div>
    );
};

export default FAQItem;
