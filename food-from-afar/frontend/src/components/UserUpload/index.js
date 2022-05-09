import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { uid } from 'react-uid';
import { Grid } from "@mui/material";
import "./styles.css";
import axios from "axios";

// Context for getting currently logged in user
import { ActiveUserContext } from "../../App.js";

// Other components used in the MyUploads page
import UserProfileSidebar from "../UserProfileSidebar";
import RecipeItem from "../RecipeItem";

/* Component for the My Uploads Section of Profile Page */
const UserUpload = () => {
    /****** COMPONENT INFORMATION  ******/
    // User information
    const [user, setUser] = React.useState({});  //  User object for active user
    const { activeUser, changeActiveUser } = React.useContext(ActiveUserContext); // activeUser stores username

    // Recipes uploaded by this user
    const [myRecipes, setMyRecipes] = useState([]);

    /****** COMPONENT INITIALIZATION  ******/
    useEffect(() => {
        // mounted flag is important in case the user unloads the profle overview while API call is still running
        let mounted = true; 
        if (activeUser !== "") {
            if (mounted) {
                // Get the user based on active user
                axios
                    .get(`/users/username/${activeUser}`)
                    .then(async (response) => {
                        const user = response.data;
                        setUser(user);

                        // Get recipes uploaded by this user
                        await axios
                            .get(`/recipes?creator=${user._id}`)
                            .then((response) => {
                                setMyRecipes(response.data);
                            })
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
    }, [activeUser]);

    return (
        <div>
            <div className="user-profile-grid">
                <UserProfileSidebar></UserProfileSidebar>
                <div className="user-profile-main-container">
                    <p className="heading3 mb-2">My Uploads</p>
                    {/* Recipes that the user has uploaded */}
                    <Grid container spacing={4}>
                        {myRecipes.map((recipe) => (
                            <Grid item key={uid(recipe)}>
                                <RecipeItem recipe={recipe}></RecipeItem>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Upload button */}
                    <div className="culture-hub-item-container">
                        <Link to={`/UserSubmission`}>
                            <button className="primary-btn">Upload</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserUpload;
