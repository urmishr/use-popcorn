import { useState } from "react";
import PropTypes from "prop-types";

const containerStyle = {
    display: "flex",
    gap: "16px",
    alignItems: "center",
};
const starContainerStyle = {
    display: "flex",
};

StarRating.propTypes = {
    maxStar: PropTypes.number,
    defaultRatings: PropTypes.number,
    color: PropTypes.string,
    size: PropTypes.number,
    messages: PropTypes.array,
};

export default function StarRating({
    maxStar = 5,
    color = "#fcc419",
    size = 48,
    messages = [],
    defaultRatings = 0,
    className = "",
}) {
    const [ratings, setRatings] = useState(defaultRatings);
    const [tempRatings, setTempRatings] = useState(0);
    const textStyle = {
        lineHeight: "1",
        margin: "0",
        fontSize: `${size / 1.5}px`,
        color: color,
    };
    return (
        <div style={containerStyle} className={className}>
            <div style={starContainerStyle}>
                {Array.from({ length: maxStar }, (_, i) => (
                    <Star
                        key={i}
                        onClick={() => setRatings(i + 1)}
                        full={tempRatings ? tempRatings >= i + 1 : ratings >= i + 1}
                        onHoverIn={() => setTempRatings(i + 1)}
                        onHoverOut={() => setTempRatings(0)}
                        color={color}
                        size={size}
                    />
                ))}
            </div>
            <p style={textStyle}>
                {messages.length === maxStar
                    ? messages[tempRatings ? tempRatings - 1 : ratings - 1]
                    : tempRatings || ratings || ""}
            </p>
        </div>
    );
}

function Star({ onClick, full, onHoverIn, onHoverOut, size, color }) {
    const starStyle = {
        height: `${size}px`,
        width: `${size}px`,
        display: "block",
        cursor: "pointer",
    };
    return (
        <span
            style={starStyle}
            role="button"
            onClick={onClick}
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
        >
            {full ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={color}
                    stroke={color}
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={color}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="{2}"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            )}
        </span>
    );
}
