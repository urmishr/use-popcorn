import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
        {/* <StarRating maxStar={10} />
        <StarRating maxStar={5} size={24} color="red" defaultRatings={3} />
        <StarRating maxStar={5} size={24} color="blue" messages={["Worst", "Bad", "Okay", "Good", "Awesome"]} defaultRatings={2} /> */}
    </React.StrictMode>
);
