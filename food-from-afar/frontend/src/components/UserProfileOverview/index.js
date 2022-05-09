import React, { useState, useEffect } from "react";
import "./styles.css";
import UserProfileSidebar from "../UserProfileSidebar";
import axios from "axios";
import { ActiveUserContext } from "../../App.js";

const UserProfileOverview = () => {
    const [user, setUser] = useState();
    const { activeUser, changeActiveUser } =
        React.useContext(ActiveUserContext);
    //console.log(user)
    //console.log(activeUser)
    useEffect(
        () => {
            // what this should do is make an API call when this component is mounted, and store the acquired user into the state above
            let mounted = true; // important in case the user unloads the profle overview while API call is still running
            if (activeUser !== "") {
                if (mounted) {
                    axios
                        .get(`/users/username/${activeUser}`, {
                            name: activeUser
                        })
                        .then((response) => {
                            setUser(response.data);
                        })
                        .catch(function (error) {
                            if (error.response) {
                                if (error.response.status === 422) {
                                    alert(
                                        "Error. Could not find active user in database"
                                    );
                                }
                            }
                        });
                }
            }
            return () => {
                mounted = false;
            };
        },
        [activeUser] // if you ever want the user object to be updated based on some data in the component, put its var name in the brackets
        // the use effect will run again when it detects a change there. be wary of inifnite loops
    );

    /* DEBUG FUNCTIONALITY THAT CAN BE ADDED TO RETURN BELOW 
                <button
                onClick={
                    () =>
                        console.log(
                            activeUser
                        )
                    }
                    >
                        Debug: Log active user
                    </button>
                    <button onClick={() => changeActiveUser("waffle")}>
                        Debug: set active user to waffle
                    </button>
    */

    return (
        <div className="user-profile-grid">
            <UserProfileSidebar></UserProfileSidebar>
            <div className="user-profile-main-container">
                <p className="heading3">My Progress</p>
                <p>30 out of 47 cultures left to try!</p>
                <div className="progress-bar-container">
                    <p>Chinese 50/100</p>
                    <div className="bar-outline">
                        <div
                            className="bar-inside"
                            style={{ width: "50%" }}
                        ></div>
                    </div>
                </div>

                <div className="progress-bar-container">
                    <p>Korean 30/100</p>
                    <div className="bar-outline">
                        <div
                            className="bar-inside"
                            style={{ width: "30%" }}
                        ></div>
                    </div>
                </div>

                <div className="progress-bar-container">
                    <p>American 50/100</p>
                    <div className="bar-outline">
                        <div
                            className="bar-inside"
                            style={{ width: "50%" }}
                        ></div>
                    </div>
                </div>

                <button className="btn-with-no-styling view-more-btn">
                    View 44 More
                </button>
            </div>
        </div>
    );
};

export default UserProfileOverview;
