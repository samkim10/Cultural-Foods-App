import React, { useState } from "react";

import { Container, Grid, Paper } from "@mui/material";

import "../Auth/styles.css";
import Input from "../Auth/Input";
//TODO replace styles and input when we get rid of Auth
import axios from "axios";
import useStyles from "../Auth/styles";
import { Link, useNavigate } from "react-router-dom";
import { ActiveUserContext } from "../../App.js";

const createAccount = (username, password1, password2, email) => {
    // email is currently not used here as user doesn't store it
    // When we do store it, the code to add it is below
    console.log("sending register request");
    if (username !== "" && password1 !== "" && email !== "") {
        // Valid configuration to make a user with
        // @ checking is done in the component below somehow, don't know how, ask Xin

        if (password1 !== password2) {
            alert("Passwords are not identical" + password1 + " " + password2);
            return false;
        }
        const user = {
            name: username,
            password: password1,
            email: email
        };
        return axios
            .post("/users/add", user)
            .then((response) => {
                alert("Signup Successful");
                console.log(response);
                //response.redirect('/')
                return true;
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.status === 422) {
                        alert("Username in use. Please choose another");
                    }
                    return false;
                }
            });
    } else {
        alert("Please fill all fields");
        return false;
    }
};

/* Component for the Register page */
const Register = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("");
    const handleShowPassword = () =>
        setShowPassword((prevShowPassword) => !prevShowPassword);
    const { activeUser, changeActiveUser } =
        React.useContext(ActiveUserContext); // USE ME FOR CONTEXT. WIPED ON REFRESH
    const navigate = useNavigate();

    console.log(changeActiveUser);
    //console.log("Rendered with: ", activeUser)
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <p className="auth-heading">Sign Up</p>

                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (
                            createAccount(username, password1, password2, email)
                        ) {
                            changeActiveUser(username);
                            navigate("/");
                        }
                    }}
                >
                    <Grid container spacing={2}>
                        <Input
                            name="userName"
                            label="User Name"
                            handleChange={(e) => setUsername(e.target.value)}
                            autoFocus
                        />

                        <Input
                            name="email"
                            label="Email Address"
                            handleChange={(e) => setEmail(e.target.value)}
                            type="email"
                        />

                        <Input
                            name="password1"
                            label="Password"
                            handleChange={(e) => setPassword1(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            handleShowPassword={handleShowPassword}
                        />

                        <Input
                            name="password2"
                            label="Confirm Password"
                            handleChange={(e) => setPassword2(e.target.value)}
                            type="password"
                            handleShowPassword={handleShowPassword}
                        />
                    </Grid>

                    <div className="auth-submit-btn-container">
                        <input
                            type="submit"
                            value="Sign Up"
                            className="auth-submit-btn"
                        ></input>
                    </div>

                    <Grid container justifyContent="flex-end">
                        <Grid item className="auth-switch-container">
                            <p>Already have an account?</p>
                            <Link to={"/login"} className="auth-switch-btn">
                                Sign In
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Register;
