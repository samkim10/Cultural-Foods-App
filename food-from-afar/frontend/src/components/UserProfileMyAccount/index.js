import React from "react";
import "./styles.css";
import UserProfileSidebar from "../UserProfileSidebar";
import { Grid, IconButton, Snackbar, Alert } from "@mui/material";
import ProfileImage from "./static/lisa.png";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditOffOutlinedIcon from "@mui/icons-material/EditOffOutlined";
import { ActiveUserContext } from "../../App.js";
import axios from "axios";
/*
// Hardcoded user, to be removed once model and API are updated
const hardcodedUser = {
    username: "user123",
    email: "user123@gmail.com",
    birth_date: "2000/12/21",
    city: "Toronto",
    country: "Canada",
    profilePic: ProfileImage
};
*/
/* Component for the My Account Section of Profile Page */
const UserProfileMyAccount = () => {
    const [user, setUser] = React.useState();
    const [username, setUsername] = React.useState();
    const [email, setEmail] = React.useState();
    const [birthDate, setBirthDate] = React.useState(0);
    const [city, setCity] = React.useState();
    const [country, setCountry] = React.useState();
    const [editSuccess, setEditSuccess] = React.useState(false);
    const [dateFailed, setDateFailed] = React.useState(false);
    const [passwordFailed, setPasswordFailed] = React.useState(false);

    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [currentlyEditing, setCurrentlyEditing] = React.useState(false);

    const {activeUser, changeActiveUser} = React.useContext(ActiveUserContext)
    React.useEffect(
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
                            console.log("got:")
                            console.log(response.data)
                            setUser(response.data);
                            setupState(response.data);
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
    
    // fills up the state with user info to be displayed
    const setupState = (user) => {
        setUsername(user.name);
        setEmail(user.email);
        setCity(user.city);
        setCountry(user.country);
        setBirthDate(formatISODate(user.birthdate));
    }

    const handleChange = (setFunction, e) => {
        setFunction(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleEditButton = (e) => {
        setCurrentlyEditing(!currentlyEditing);
        console.log(currentlyEditing);
    };

    const formatISODate = (date) => {
        return date.substring(0, 10);
    }

    const openSuccessSnackbar = () => {
        clearSnackbars();
        setEditSuccess(true);
        setTimeout(() => { setEditSuccess(false) }, 3000);
    }

    const openDateFailSnackbar = () => {
        clearSnackbars();
        setDateFailed(true);
        setTimeout(() => { setDateFailed(false) }, 3000);
    }

    const openPasswordFailSnackbar = () => {
        clearSnackbars();
        setPasswordFailed(true);
        setTimeout(() => { setPasswordFailed(false) }, 3000);
    }

    const clearSnackbars = () => {
        setEditSuccess(false);
        setDateFailed(false);
        setPasswordFailed(false);
    }
    
    const handleSaveInfo = (email, birthDate, city, country, newPassword, confirmPassword) => {
        // setup data which doesn't need checks
        const newUserData = {
            email: email,
            city: city,
            country: country
        }
        
        // check on birth date
        const parsedBirthDate = Date.parse(birthDate);
        let newBirthDate = new Date();
        if (isNaN(parsedBirthDate)) {
            console.log("invalid bday");
            openDateFailSnackbar()
            return;
        }
        else{
            newBirthDate = new Date(birthDate);
            newUserData["birthdate"] = newBirthDate;
            console.log("valid bday");
            console.log(newBirthDate);
        }

        // check on matching passwords
        if (newPassword !== confirmPassword){
            console.log("passwords don't match")
            openPasswordFailSnackbar();
            return;
        }
        // passwords equal and not empty, change password
        else if (newPassword !== ""){
            newUserData["password"] = newPassword;
            console.log("matching passwords")
        }

        // all checks passed, send patch request
        const res = axios
            .patch(`/users/username/${username}`, newUserData)
            .catch((error) => {
                console.log(error);
            });

        openSuccessSnackbar();
    }

    console.log(user)
    if (user !== undefined){ // so we don't try and use data we don't have yet
        return (
            <div className="user-profile-grid"> 
                <Snackbar open={editSuccess}>
                    <Alert variant="filled" severity="success" sx={{ width: '100%' }}>
                        Successfully saved changes!
                    </Alert>
                </Snackbar>
                <Snackbar open={dateFailed}>
                    <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
                        Date format is incorrect!
                    </Alert>
                </Snackbar>
                <Snackbar open={passwordFailed}>
                    <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
                        Passwords do not match!
                    </Alert>
                </Snackbar>
                <UserProfileSidebar></UserProfileSidebar>
                <Grid container spacing={2}>
                    <Grid item xs={12} mb={4}>
                        <p className="heading3">My Account</p>
                    </Grid>
                    <Grid container item xs={12} md={3}>
                        <Grid item xs={12}>
                            <img
                                className="profile-picture"
                                src={"" + user.profilePic}
                                alt="User profile"
                            />
                        </Grid>
                    </Grid>

                    {/* Container for displaying user info */}
                    <Grid container item xs={12} md={8} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <p className="heading4">Username</p>
                            <p>{username}</p>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <p className="heading4">Email Address</p>
                            {currentlyEditing ? (
                                <input
                                    onChange={(e) => handleChange(setEmail, e)}
                                    className="inputbox-myaccount"
                                ></input>
                            ) : (
                                <p>{email}</p>
                            )}
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <IconButton
                                aria-label="edit info"
                                component="span"
                                size="large"
                                edge="end"
                                onClick={handleEditButton}
                            >
                                {currentlyEditing ? (
                                    <EditOffOutlinedIcon />
                                ) : (
                                    <EditOutlinedIcon />
                                )}
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <p className="heading4">Birth Date</p>
                            {currentlyEditing ? (
                                <input
                                    onChange={(e) => handleChange(setBirthDate, e)}
                                    className="inputbox-myaccount"
                                ></input>
                            ) : (
                                <p>{birthDate}</p>
                            )}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <p className="heading4">City</p>
                            {currentlyEditing ? (
                                <input
                                    onChange={(e) => handleChange(setCity, e)}
                                    className="inputbox-myaccount"
                                ></input>
                            ) : (
                                <p>{city}</p>
                            )}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <p className="heading4">Country</p>
                            {currentlyEditing ? (
                                <input
                                    onChange={(e) => handleChange(setCountry, e)}
                                    className="inputbox-myaccount"
                                ></input>
                            ) : (
                                <p>{country}</p>
                            )}
                        </Grid>
                    </Grid>

                    {/* Container for Change Password */}
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        item
                        xs={12}
                        mt={14}
                    >
                        <Grid item xs={12}>
                            <p className="heading3">Change my password</p>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <div className="input-container">
                                <p className="heading4 mb-1">New password</p>
                                <input
                                    type="password"
                                    onChange={handleNewPasswordChange}
                                    className="custom-inputbox"
                                ></input>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <div className="input-container">
                                <p className="heading4 mb-1">Confirm password</p>
                                <input
                                    type="password"
                                    onChange={handleConfirmPasswordChange}
                                    className="custom-inputbox"
                                ></input>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={2}></Grid>
                        <Grid item xs={12}>
                            <button
                                className="primary-btn"
                                onClick={() => handleSaveInfo(email, birthDate, city, country, newPassword, confirmPassword)}
                            >
                                Save
                            </button>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }else{
        return null
    }
};


export default UserProfileMyAccount;
