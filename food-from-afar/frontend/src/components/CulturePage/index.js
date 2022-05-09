import React, { useState, useEffect } from 'react';
import { uid } from 'react-uid';
import './styles.css';
import { Alert, AlertTitle, Grid, Snackbar, TextField } from '@mui/material';
import axios from "axios";
import { ActiveUserContext } from "../../App.js"

// Import defined components used on the culture page
import RecipeItem from "../RecipeItem";

// Import methods used to modify culture page state
import { updateViewCategory, updateSelection, filterRecipes } from "./actions";

/* Component for the Culture page */
const CulturePage = (props) => {
    const { activeUser, changeActiveUser } = React.useContext(ActiveUserContext)
    const [user, setUser] = useState("");  // User object from database
    const [dbCulture, setDBCulture] = useState("");
    const { culture } = props;

    /***** RECIPE SECTION INFORMATION *****/
    // Information used in the culture page
    const [cultureName, setCultureName] = useState("");
    const [allRecipes, setAllRecipes] = useState([]);

    // Displayed recipes after filtering
    const [displayedRecipes, setDisplayedRecipes] = useState([]);

    /***** SIDEBAR SECTION INFORMATION *****/
    const [search, setSearch] = useState("");
    const categories = ["View All", "Highly Rated", "Highly Reviewed", "Recently Added"];
    const difficulties = ["Easy", "Medium", "Hard"];
    const cookingTimes = [["Under 30 mins", [0, 29]], ["30 mins - 1 hr", [30, 60]],
    ["1 hr - 2 hr", [60, 120]], ["Over 2 hr", [121, -1]]];

    // The user's currently stored sidebar selections
    // NOTE: the Set for cooking times must use the same Array references as the array above
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [selectedDifficulties, setSelectedDifficulties] = useState(new Set(["Easy", "Medium", "Hard"]));
    const [selectedCookingTimes, setSelectedCookingTimes] = useState(new Set([cookingTimes[0][0], cookingTimes[1][0], cookingTimes[2][0], cookingTimes[3][0]]));

    /* Subscribing information */
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeSuccessOpen, setSubscribeSuccessOpen] = useState(false);
    const [unsubscribeSuccessOpen, setUnsubscribeSuccessOpen] = useState(false);
    const [notLoggedInOpen, setNotLoggedInOpen] = useState(false);

    //subscribe button
    const initiateSubscribe = () => {
        // Do not subscribed if not logged in
        if (!activeUser) {
            setNotLoggedInOpen(true);
            return;
        }

        // Create new subscriptions array
        let newSubs = user.subscribed.slice();

        // Current subscriptions does not have this culture: subscribe
        if (!newSubs.includes(dbCulture._id)) {
            newSubs.push(dbCulture._id);
            setSubscribed(true);
            setSubscribeSuccessOpen(true);
            setUnsubscribeSuccessOpen(false);
        }
        // Otherwise, unsubscribe from this culture 
        else {
            newSubs = newSubs.filter(cultureID => cultureID != dbCulture._id);
            setSubscribed(false);
            setSubscribeSuccessOpen(false);
            setUnsubscribeSuccessOpen(true);
        }

        // Update subscriptions in user stored in this state 
        const updatedUser = {
            ...user
        }
        updatedUser.subscribed = newSubs;
        setUser(updatedUser);       

        // Update subscriptions in database
        const findAndUpdate = {
            id: user._id,
            update: {
                subscribed: newSubs
            }
        }

        axios
            .post(`/users/find/update`, findAndUpdate)
            .then((response) => {
                console.log(response)
            })
    }

    // Initialization on component mount
    useEffect(() => {
        setCultureName(culture);

        // get recipes of DB - currently ALL recipes
        axios
            .get("/recipes/")
            .then((response) => {
                const res = response.data;
                const resRecipes = [];
                for (let i = 0; i < res.length; i++) {
                    const myStr = JSON.stringify(res[i]);
                    const myObj = JSON.parse(myStr);

                    const resRecipe = {
                        _id: myObj["_id"],
                        name: myObj["name"],
                        creator: myObj["creator"],
                        category: myObj["category"],
                        rating: myObj["rating"],
                        numReviews: myObj["numReviews"],
                        tags: myObj["tags"],
                        time: myObj["time"],
                        nutrition: myObj["nutrition"],
                        difficulty: myObj["difficulty"],
                        tools: myObj["tools"],
                        posted: new Date(myObj["posted"]),
                        ingredients: myObj["ingredients"],
                        instructions: myObj["instructions"],
                        circumstances: myObj["circumstances"],
                        reasoning: myObj["reasoning"],
                        image: myObj["url"],
                    };

                    if (resRecipe.category === culture) {
                        resRecipes.push(resRecipe);
                    }
                    else {
                        if (culture === "Others") {//All recipes cateogory.
                            resRecipes.push(resRecipe);
                        }
                    }

                }

                setAllRecipes(resRecipes);
                setDisplayedRecipes(resRecipes);
            })
            .then(() => {
                axios
                    .get(`/categories/content/${culture}`)
                    .then((response) => {
                        const res = response.data;
                        const myStr = JSON.stringify(res);
                        const myObj = JSON.parse(myStr);
                        const resCulture = {
                            _id: myObj["_id"],
                            content: myObj["content"],
                        };
                        setDBCulture(resCulture);
                    })
            })
            .then(() => {
                axios
                    .get(`/users/name/${activeUser}`)
                    .then((response) => {
                        const res = response.data;
                        const myStr = JSON.stringify(res);
                        const myObj = JSON.parse(myStr);
                        const resUser = {
                            _id: myObj["_id"],
                            name: myObj["name"],
                            subscribed: myObj["subscribed"]
                        };
                        setUser(resUser);
                    })
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Filter displayed recipes when selections change
    useEffect(() => {
        filterRecipes(allRecipes, search, selectedDifficulties, selectedCookingTimes,
            cookingTimes, setDisplayedRecipes);
    }, [search, selectedDifficulties, selectedCookingTimes])

    // Update initial subscribed state -- whether user is subscribed to this culture
    useEffect(() => {
        if (!user || !dbCulture) return;
        setSubscribed(user.subscribed.includes(dbCulture._id));
    }, [user, dbCulture]);

    return (
        <div>
            {/* Top header container */}
            <div className="culture-top-container">
                <Grid
                    container
                    spacing={2}
                    justifyContent="left"
                    alignItems="left"
                >
                    <Grid item xs={12} md={6} className="culture-top-text">
                        <p className="heading1">{cultureName}</p>
                        <p className="culture-description-text">
                            Browse recipes of {cultureName} cuisine and
                            experience the culture in a tasty way!
                        </p>
                        <button className="primary-btn" onClick={initiateSubscribe}>
                            {subscribed ? "Unsubscribe" : "Subscribe"}
                        </button>
                    </Grid>
                    {/* <Grid item xs={12} md={6} className="culture-top-image">
                    <img
                        className="culture-page-top-image"
                        src={}
                        alt="culture page top image of food"
                        width="100%"
                    />
                </Grid> */}
                </Grid>
            </div>

            <div className="culture-page-main">
                {/* Left sidebar */}
                <div className="culture-sidebar-container">

                    {/* Search bar */}
                    <h2>Search for a recipe</h2>
                    <div>
                        <TextField
                            id="outlined-name"
                            label="Name of recipe"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); }}
                        />
                    </div>

                    {/* Category buttons */}
                    <h2>View by category</h2>
                    <div className="side-bar-top-options">
                        {categories.map((category) => (
                            <button className="sidebar-btn"
                                onClick={(e) => {
                                    updateViewCategory(e.target, setSelectedCategory, displayedRecipes, setDisplayedRecipes);
                                }}
                                name={category} // used for disabling/enabling buttons
                                disabled={category === selectedCategory ? true : false}
                                key={uid({ category })}>
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Difficulty checkboxes */}
                    <h2>Difficulty</h2>
                    {difficulties.map((difficulty) => (
                        <div key={uid(difficulty)}>
                            <input type="checkbox" defaultChecked onClick={(e) => {
                                updateSelection(e.target.checked, selectedDifficulties,
                                    difficulty, setSelectedDifficulties);

                            }} />
                            <p className="checkbox-text" > {difficulty} </p>
                        </div>
                    ))}

                    {/* Cooking time checkboxes */}
                    <h2>Cooking time</h2>
                    <div className="vertical">
                        {cookingTimes.map((cookingTime) => (
                            <div key={uid(cookingTime[0])}>
                                <input type="checkbox" defaultChecked onClick={(e) => {
                                    updateSelection(e.target.checked, selectedCookingTimes,
                                        cookingTime[0], setSelectedCookingTimes);
                                }} />
                                <p className="checkbox-text"> {cookingTime[0]} </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recipes area */}
                <div className="culture-recipes-container">
                    <h2 className="heading2"> All Recipes </h2>
                    <div className="recipes">
                        <Grid container spacing={4}>
                            {displayedRecipes.map((recipe) => (
                                <Grid item key={uid(recipe)}>
                                    <RecipeItem
                                        recipe={recipe}
                                    ></RecipeItem>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </div>
            </div>

            {/* Not logged in error */}
            <Snackbar
                open={notLoggedInOpen}
                autoHideDuration={3000}
                onClose={() => { setNotLoggedInOpen(false) }}
            >
                <Alert variant="filled" severity="error">
                    <AlertTitle> Not Logged In </AlertTitle>
                    You cannot manipulate subscriptions without being logged in.
                </Alert>
            </Snackbar>

            {/* Subscribe success */}
            <Snackbar
                open={subscribeSuccessOpen}
                autoHideDuration={3000}
                onClose={() => { setSubscribeSuccessOpen(false) }}
            >
                <Alert variant="filled" severity="success">
                    <AlertTitle> Subscribed! </AlertTitle>
                    You have successfully subscribed to {cultureName} culture.
                </Alert>
            </Snackbar>

            {/* Unsubscribe success */}
            <Snackbar
                open={unsubscribeSuccessOpen}
                autoHideDuration={3000}
                onClose={() => { setUnsubscribeSuccessOpen(false) }}
            >
                <Alert variant="filled" severity="success">
                    <AlertTitle> Unsubscribed! </AlertTitle>
                    You have successfully unsubscribed from {cultureName} culture.
                </Alert>
            </Snackbar>

        </div>
    );
};

export default CulturePage;