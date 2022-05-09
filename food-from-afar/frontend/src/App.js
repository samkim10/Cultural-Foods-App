import { Route, Routes, BrowserRouter, useParams } from "react-router-dom";
import React, { useState } from "react";
// Import components used for switching pages
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Search from "./components/Search";
import RecipePage from "./components/RecipePage";
import CultureHub from "./components/CultureHub";
import CulturePage from "./components/CulturePage";
import NavBar from "./components/NavBar";
import AboutUs from "./components/AboutUs";
// import UserProfile from "./components/UserProfile";
import UserSubmission from "./components/UserSubmission";
import UserProfileOverview from "./components/UserProfileOverview";
import UserProfileMyAccount from "./components/UserProfileMyAccount";
import UserSubscription from "./components/UserSubscription";
import UserProfileMyReviews from "./components/UserProfileMyReviews";
import UserSavedDishes from "./components/UserSavedDishes";
import UserUpload from "./components/UserUpload";

const ActiveUserContext = React.createContext(""); //store data

const UserStateProvider = ({ children }) => {
    const [activeUser, changeActiveUser] = useState("");
    return (
        <ActiveUserContext.Provider value={{ activeUser, changeActiveUser }}>
            {children}
        </ActiveUserContext.Provider>
    );
};

const App = () => {
    // Determine which culture page to show based on path
    const GetCulturePage = () => {
        const { culture } = useParams();
        return <CulturePage culture={culture}></CulturePage>;
    };

    // Determine which recipe page to show based on path
    const GetRecipePage = () => {
        const { id } = useParams();
        return <RecipePage id={id}></RecipePage>;
    };

    // Determine which part of user profile page to show based on path
    const GetUserProfilePage = () => {
        const { section } = useParams();
        if (section === "Overview") {
            return <UserProfileOverview></UserProfileOverview>;
        }
        if (section === "MyAccount") {
            return <UserProfileMyAccount></UserProfileMyAccount>;
        }
        if (section === "MySubscription") {
            return <UserSubscription></UserSubscription>;
        }
        if (section === "MyReviews") {
            return <UserProfileMyReviews></UserProfileMyReviews>;
        }
        if (section === "SavedDishes") {
            return <UserSavedDishes></UserSavedDishes>;
        }
        if (section === "MyUploads") {
            return <UserUpload></UserUpload>;
        }
        return <UserProfileOverview></UserProfileOverview>;
    };

    return (
        <div>
            {/* Switch component being rendered based on URL path */}
            <UserStateProvider>
                <BrowserRouter>
                    <NavBar></NavBar>
                    <Routes>
                        <Route path="/" element={<Home></Home>} />
                        {/*<Route path="/auth" element={<Auth></Auth>} />*/}

                        <Route
                            path="/Register"
                            element={<Register></Register>}
                        />
                        <Route path="/Search" element={<Search></Search>} />
                        <Route
                            path="/Recipe/:id"
                            element={<GetRecipePage></GetRecipePage>}
                        />
                        <Route path="/Login" element={<Login></Login>} />
                        <Route
                            path="/CultureHub"
                            element={<CultureHub></CultureHub>}
                        />
                        <Route
                            path="/CultureHub/:culture"
                            element={<GetCulturePage />}
                        />
                        {/* <Route
                            path="/UserProfile"
                            element={<UserProfile></UserProfile>}
                        /> */}
                        <Route
                            path="/UserProfile/:section"
                            element={<GetUserProfilePage></GetUserProfilePage>}
                        />
                        <Route
                            path="/UserSubmission"
                            element={<UserSubmission></UserSubmission>}
                        />
                        <Route path="/AboutUs" element={<AboutUs></AboutUs>} />
                    </Routes>
                </BrowserRouter>
            </UserStateProvider>
        </div>
    );
};

export default App;
export { ActiveUserContext };
