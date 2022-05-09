import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";

/* Component for the Home page */
const UserProfileSidebar = () => {
    return (
        <div className="side-bar-container">
            <Link to={`/UserProfile/Overview`}>
                <button className="btn-with-no-styling">Overview</button>
            </Link>
            <Link to={`/UserProfile/MyAccount`}>
                <button className="btn-with-no-styling">My Account</button>
            </Link>
            <Link to={`/UserProfile/MySubscription`}>
                <button className="btn-with-no-styling">My Subscription</button>
            </Link>
            <Link to={`/UserProfile/SavedDishes`}>
                <button className="btn-with-no-styling">Saved Dishes</button>
            </Link>
            <Link to={`/UserProfile/MyReviews`}>
                <button className="btn-with-no-styling">My Reviews</button>
            </Link>
            <Link to={`/UserProfile/MyUploads`}>
                <button className="btn-with-no-styling">My Uploads</button>
            </Link>
        </div>
    );
};

export default UserProfileSidebar;
