// reference: https://www.youtube.com/watch?v=LKlO8vLvUao&list=WL&index=2&t=5101s
import React, { useState } from "react";
import "./styles.css";
import { Container, Grid, Paper } from "@mui/material";
import Input from "./Input";
import useStyles from "./styles";

const Auth = () => {
    const classes = useStyles();
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {};

    const handleChange = () => {};

    const handleShowPassword = () =>
        setShowPassword((prevShowPassword) => !prevShowPassword);

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
        handleShowPassword(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <p className="auth-heading">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </p>

                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Input
                            name="userName"
                            label="User Name"
                            handleChange={handleChange}
                            autoFocus
                        />

                        {isSignUp && (
                            <Input
                                name="email"
                                label="Email Address"
                                handleChange={handleChange}
                                type="email"
                            />
                        )}

                        <Input
                            name="password"
                            label="Password"
                            handleChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            handleShowPassword={handleShowPassword}
                        />

                        {isSignUp && (
                            <Input
                                name="confirmPassword"
                                label="Confirm Password"
                                handleChange={handleChange}
                                type="password"
                            />
                        )}
                    </Grid>

                    <div className="auth-submit-btn-container">
                        <button className="auth-submit-btn" fullWidth>
                            {isSignUp ? "Sign Up" : "Sign In"}
                        </button>
                    </div>

                    <Grid container justifyContent="flex-end">
                        <Grid iten>
                            <button
                                className="auth-switch-btn"
                                onClick={switchMode}
                            >
                                {isSignUp
                                    ? "Already have an account? Sign In"
                                    : "Don't have an account? Sign Up"}
                            </button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Auth;
