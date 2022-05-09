import React from "react";
import "./styles.css";
import UserProfileSidebar from "../UserProfileSidebar";
import ReviewItem from "./ReviewItem"
import { Grid, IconButton } from "@mui/material";
import { ActiveUserContext } from "../../App.js";
import axios from "axios";

/* Component for the My Reviews Section of Profile Page */
const UserProfileMyReviews = () => {
    const [user, setUser] = React.useState({});
    const [reviews, setReviews] = React.useState([]);

    const { activeUser, changeActiveUser } = React.useContext(ActiveUserContext)
    React.useEffect(
        () => {
            // what this should do is make an API call when this component is mounted, and store the acquired user into the state above
            let mounted = true; // important in case the user unloads the profle overview while API call is still running
            if (activeUser !== "") {
                if (mounted) {
                    axios
                        .get(`/users/username/${activeUser}`)
                        .then(async (response) => {
                            const user = response.data;
                            setUser(user);

                            // get reviews from user
                            await axios
                                .get(`/reviews/creator/${user._id}`)
                                .then((response) => {
                                    setReviews(response.data);
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
        },
        [activeUser]
    );
    return (
        <div className="user-profile-grid">
            <UserProfileSidebar></UserProfileSidebar>
            <Grid container spacing={2}>
            {/* <button onClick={() => changeActiveUser("waffle")}> */}
                {/* Debug: set active user to waffle */}
            {/* </button> */}
                <Grid item xs={12} mb={4}>
                    <p className="heading3">My Reviews ({reviews.length})</p>
                </Grid>
                {reviews.map((review) => (
                    <Grid item xs={12} my={2}>
                        <ReviewItem review={review}></ReviewItem>
                    </Grid>
                    
                ))}
            </Grid>
        </div>
    );
}


export default UserProfileMyReviews;
