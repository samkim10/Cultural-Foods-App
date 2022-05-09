import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import ProfileImage from "./static/lisa.png";
import axios from "axios";
import { ActiveUserContext } from "../../App.js";
import { Link } from "react-router-dom";
import "./styles.css";
const pages = ["Home", "Culture Hub", "About Us"];
const settings = ["My Profile", "Sign Out"];

const NavBar = () => {
    const [user, setUser] = useState();
    const { activeUser, changeActiveUser } =
        React.useContext(ActiveUserContext);

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const THEME = createTheme({
        typography: {
            fontFamily: `'Poppins', sans-serif`
        }
    });

    return (
        <ThemeProvider theme={THEME}>
            <AppBar
                style={{
                    background: "white",
                    boxShadow: "none",
                    marginBottom: "15px",
                    borderBottom: "1px solid #BABABA"
                }}
                position="static"
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
                        >
                            LOGO
                        </Typography>

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" }
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left"
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left"
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" }
                                }}
                            >
                                {pages.map((page) => (
                                    <Link
                                        to={
                                            page === "Home"
                                                ? "/"
                                                : page.replace(/\s/g, "")
                                        }
                                        style={{
                                            textDecoration: "none",
                                            color: "black"
                                        }}
                                    >
                                        <MenuItem
                                            key={page}
                                            onClick={handleCloseNavMenu}
                                        >
                                            <Typography textAlign="center">
                                                {page}
                                            </Typography>
                                        </MenuItem>
                                    </Link>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" }
                            }}
                        >
                            LOGO
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" }
                            }}
                        >
                            {pages.map((page) => (
                                <Link
                                    to={
                                        page === "Home"
                                            ? "/"
                                            : page.replace(/\s/g, "")
                                    }
                                    style={{ textDecoration: "none" }}
                                >
                                    <Button
                                        key={page}
                                        onClick={handleCloseNavMenu}
                                        sx={{
                                            my: 2,
                                            color: "black",
                                            display: "block"
                                        }}
                                    >
                                        {page}
                                    </Button>
                                </Link>
                            ))}
                        </Box>

                        {user !== undefined ? (
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar
                                            src={user.profilePic}
                                            alt={
                                                "charbase.com/images/glyph/65110"
                                            }
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right"
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right"
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <Link
                                            to={
                                                setting === "My Profile"
                                                    ? "/UserProfile/Overview"
                                                    : "/"
                                            }
                                            style={{
                                                textDecoration: "none",
                                                color: "black"
                                            }}
                                        >
                                            <MenuItem
                                                key={setting}
                                                onClick={() => {
                                                    handleCloseUserMenu();
                                                    if (
                                                        setting === "Sign Out"
                                                    ) {
                                                        changeActiveUser(""); //
                                                        setUser(undefined);
                                                        console.log(activeUser);
                                                    }
                                                }}
                                            >
                                                <Typography textAlign="center">
                                                    {setting}
                                                </Typography>
                                            </MenuItem>
                                        </Link>
                                    ))}
                                </Menu>
                            </Box>
                        ) : (
                            <button
                                className="btn-with-no-styling"
                                component={Link}
                                to="/login"
                            >
                                <Link
                                    className="link sign-in-link"
                                    to="/login"
                                    style={{ textDecoration: "none" }}
                                >
                                    Sign In
                                </Link>
                            </button>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
};
export default NavBar;
