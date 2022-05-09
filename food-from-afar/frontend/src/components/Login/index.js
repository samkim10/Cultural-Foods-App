import React, { useState } from "react";

import { Container, Grid, Paper } from "@mui/material";

import "../Auth/styles.css";
import Input from "../Auth/Input";
//TODO replace styles and input when we get rid of Auth
import axios from "axios";
import useStyles from "../Auth/styles";
import { Link, useNavigate } from "react-router-dom";
import { ActiveUserContext } from "../../App.js";

const checkLogin = async (username, password) => {
    console.log("sending login request");

    // email is currently not used here as user doesn't store it
    // When we do store it, the code to add it is below
    if (username !== "" && password !== "") {
        // Valid user/pass
        const user = { name: username, password: password };

        const result = await axios
            .post("/users/check", user)
            .then((response) => {
                if (response.data === false) {
                    alert("Incorrect Credentials");
                    return false;
                } else {
                    // alert("Login Successful");
                    return true;
                }
            })
            .catch((error) => {
                alert("Login Error");
                console.log(error);
                return false;
            });
        return result;
    } else {
        alert("Please fill all fields");
        return false;
    }
};

/* Component for the Register page */
const Login = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { activeUser, changeActiveUser } =
        React.useContext(ActiveUserContext); // USE ME FOR CONTEXT. WIPED ON REFRESH
    //console.log("Rendered with: ", activeUser)
    const handleShowPassword = () =>
        setShowPassword((prevShowPassword) => !prevShowPassword);
    const navigate = useNavigate();
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <p className="auth-heading">Sign In</p>

                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (checkLogin(username, password)) {
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
                            name="password"
                            label="Password"
                            handleChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            handleShowPassword={handleShowPassword}
                        />
                    </Grid>

                    <div className="auth-submit-btn-container">
                        <input
                            type="submit"
                            value="Log In"
                            className="auth-submit-btn"
                        ></input>
                    </div>

                    <Grid container justifyContent="flex-end">
                        <Grid item className="auth-switch-container">
                            <p>Don't have an account?</p>
                            <Link to={"/register"} className="auth-switch-btn">
                                Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
