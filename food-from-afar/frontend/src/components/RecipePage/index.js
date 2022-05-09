import React, { useState, useEffect } from "react";
import "./styles.css";
import Grid from "@mui/material/Grid";
import {
    Alert,
    Avatar,
    AlertTitle,
    Checkbox,
    Chip,
    Rating,
    Snackbar
} from "@mui/material";

import Input from "../Input";

import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
// import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

//import FajitaImage from "./static/Chicken-Fajitas.jpg";
import ProfileImage from "./static/lisa.png";
import NutritionItem from "../NutritionItem";
import IngredientItem from "../IngredientItem";
import Review from "../Review";
import axios from "axios";
import { ActiveUserContext } from "../../App.js";
let isLoaded = false;

Object.defineProperty(String.prototype, "capitalize", {
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

const RecipePage = (props) => {
    const { activeUser, changeActiveUser } =
        React.useContext(ActiveUserContext);
    const [recipe, setRecipe] = React.useState({
        tags: [],
        nutrition: [],
        tools: [],
        ingredients: [],
        instructions: []
        //rating: 0,
    });
    const [servings, setServings] = React.useState(3);
    const [user, setUser] = React.useState(""); //the recipe poster user.
    const [myUser, setMyUser] = useState(""); //the active user.
    const [reviews, setReviews] = useState([]);
    const [myReview, setMyReview] = useState("");
    const [myRating, setMyRating] = useState();
    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkErrorOpen, setBookmarkErrorOpen] = useState(false);

    //upload : reviews
    const initiateUpload = () => {
        const review = {
            creator: myUser._id,
            name: myUser.name,
            recipe: props.id,
            rating: myRating,
            content: myReview
        };

        axios.post(`/reviews/add`, review).then(async (response) => {
            const newReviews = [];
            for (let i = 0; i < reviews.length; i++) {
                newReviews.push(reviews[i]);
            }
            newReviews.push(review);
            setReviews(newReviews);
            await updateRatingAndReviewNum(
                (recipe.rating * recipe.numReviews + myRating) /
                    (recipe.numReviews + 1),
                recipe.numReviews + 1
            );
        });
    };

    function updateRatingAndReviewNum(rating, numReviews) {
        const findAndUpdate = {
            id: props.id,
            update: {
                rating: rating,
                numReviews: numReviews
            }
        };

        axios.post(`/recipes/find/update`, findAndUpdate).then((response) => {
            axios.get(`/recipes/${props.id}`).then(async (response) => {
                const res = response.data;
                const myStr = JSON.stringify(res);
                const myObj = JSON.parse(myStr);
                const resRecipe = {
                    _id: myObj["_id"],
                    name: myObj["name"],
                    creator: myObj["creator"],
                    rating: myObj["rating"],
                    numReviews: myObj["numReviews"],
                    tags: myObj["tags"],
                    time: myObj["time"],
                    nutrition: myObj["nutrition"],
                    tools: myObj["tools"],
                    ingredients: myObj["ingredients"],
                    instructions: myObj["instructions"],
                    circumstances: myObj["circumstances"],
                    reasoning: myObj["reasoning"],
                    image: myObj["url"]
                };

                setRecipe(resRecipe);
            });
        });
    }

    useEffect(() => {
        // get recipe with ID from DB
        axios
            .get(`/recipes/${props.id}`)
            .then(async (response) => {
                const res = response.data;
                const myStr = JSON.stringify(res);
                const myObj = JSON.parse(myStr);
                const resRecipe = {
                    _id: myObj["_id"],
                    name: myObj["name"],
                    creator: myObj["creator"],
                    rating: myObj["rating"],
                    numReviews: myObj["numReviews"],
                    tags: myObj["tags"],
                    time: myObj["time"],
                    nutrition: myObj["nutrition"],
                    tools: myObj["tools"],
                    ingredients: myObj["ingredients"],
                    instructions: myObj["instructions"],
                    circumstances: myObj["circumstances"],
                    reasoning: myObj["reasoning"],
                    image: myObj["url"]
                };

                setRecipe(resRecipe);

                await axios
                    .get(`/users/${resRecipe.creator}`)
                    .then((response) => {
                        const res = response.data;
                        const myStr = JSON.stringify(res);
                        const myObj = JSON.parse(myStr);
                        const resUser = {
                            _id: myObj["_id"],
                            name: myObj["name"]
                        };
                        setUser(resUser);
                        isLoaded = true;
                    });
            })
            .then(() => {
                axios
                    .get(`/reviews/recipe/${props.id}`)
                    .then(async (response) => {
                        const res = response.data;
                        const reviewAry = [];
                        let totalRatings = 0;
                        const totalReviews = res.length;
                        for (let i = 0; i < res.length; i++) {
                            const myStr = JSON.stringify(res[i]);
                            const myObj = JSON.parse(myStr);
                            const resUser = { name: "", _id: "" };
                            await axios
                                .get(`/users/${myObj["creator"]}`)
                                .then((response) => {
                                    const res = response.data;
                                    const myStr = JSON.stringify(res);
                                    const myObj = JSON.parse(myStr);
                                    resUser.name = myObj["name"];
                                    resUser._id = myObj["_id"];
                                });
                            const resReview = {
                                name: resUser.name,
                                creator: resUser._id,
                                content: myObj["content"],
                                rating: myObj["rating"]
                            };
                            totalRatings += Number(myObj["rating"]);
                            reviewAry.push(resReview);
                        }
                        setReviews(reviewAry);
                        totalRatings = totalRatings / Number(totalReviews);
                        updateRatingAndReviewNum(totalRatings, totalReviews);
                    });
            })
            // Getting logged in user
            .then(() => {
                axios
                    .get(`/users/name/${activeUser}`)
                    .then((response) => {
                        const res = response.data;
                        const myStr = JSON.stringify(res);
                        const myObj = JSON.parse(myStr);

                        // Save entire user object -- needed for PATCH calls
                        setMyUser(myObj);

                        // Set initial bookmark status
                        setBookmarked(myObj.savedRecipes.includes(props.id));
                    })
                    .catch((error) => {
                        console.log("user ERROR: " + error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Add or revove this recipe to the logged in user's bookmarks
    const updateBookmark = () => {
        // Do nothing if no user is logged in
        if (!myUser) return;

        // Create new User object to save in PATCH request
        const updatedUser = {
            ...myUser
        };

        // Modify bookmark by adding or deleting
        if (!updatedUser.savedRecipes.includes(props.id)) {
            updatedUser.savedRecipes.push(props.id);
        } else {
            // Keep all recipes with different IDs -- filter out this recipe
            updatedUser.savedRecipes = updatedUser.savedRecipes.filter(
                (recipeID) => recipeID !== props.id
            );
        }
        setBookmarked(!bookmarked);

        // Update user data stored in state variable
        setMyUser(updatedUser);

        // Save new user to database
        axios
            .patch(`/users/username/${updatedUser.name}`, updatedUser)
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="recipe-page">
            <Grid container>
                {/* Left Gutter */}
                <Grid item xs={1}></Grid>

                {/* Page Content */}
                <Grid item xs={10}>
                    {/* Top container for recipe information */}
                    <Grid
                        container
                        spacing={2}
                        marginTop={4}
                        marginBottom={4}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        className="recipe-top-container"
                    >
                        {/* Image */}
                        <Grid item xs={12} md={6}>
                            <img
                                src={"" + recipe.image}
                                alt={recipe.name}
                                className="recipe-image"
                            />
                        </Grid>

                        {/* Recipe details*/}
                        <Grid container item xs={12} md={6}>
                            {/* First Row - Dish Title */}
                            <Grid
                                container
                                spacing={2}
                                justifyContent="space-between"
                                alignItems="flex-start"
                            >
                                <Grid item xs={6}>
                                    <p className="heading1">{recipe.name}</p>
                                </Grid>
                                <Grid container item xs={3}>
                                    <Grid item sx={{ mt: 4 }}>
                                        <p className="heading3">Done</p>
                                        <CheckBoxOutlinedIcon />
                                    </Grid>
                                    {/* <Grid item sx={{ mt: 4.5, ml: 1 }}></Grid> */}
                                    {/* <Grid item sx={{ mt: 3.5, ml: 4 }}> */}

                                    {/* </Grid> */}
                                </Grid>
                                <Grid item xs={3} className="bookmark">
                                    {!bookmarked && (
                                        <BookmarkAddOutlinedIcon
                                            fontSize="large"
                                            onClick={() => {
                                                // Only set bookmark if a user is actively logged in
                                                if (activeUser)
                                                    updateBookmark();
                                                else setBookmarkErrorOpen(true);
                                            }}
                                        />
                                    )}
                                    {bookmarked && (
                                        <BookmarkIcon
                                            fontSize="large"
                                            onClick={() => {
                                                // Only remove bookmark if a user is actively logged in
                                                if (activeUser)
                                                    updateBookmark();
                                                else setBookmarkErrorOpen(true);
                                            }}
                                        />
                                    )}
                                </Grid>
                            </Grid>

                            {/* Second Row - Avatar, Name, Rating, Review Count */}
                            <Grid container spacing={2} alignItems="flex-start">
                                <Grid item>
                                    <Avatar alt="Lisa" src={ProfileImage} />
                                </Grid>
                                <Grid item xs={3}>
                                    <p className="heading4">{user.name}</p>
                                </Grid>
                                <Grid item>
                                    <Rating
                                        name="recipe-rating"
                                        value={recipe.rating || "0"}
                                        size="large"
                                        precision={0.25}
                                        readOnly
                                    />
                                </Grid>
                                <Grid item>
                                    <p>{recipe.numReviews} Reviews</p>
                                </Grid>
                            </Grid>

                            {/* Third Row - Tags */}
                            <Grid
                                container
                                spacing={1}
                                marginTop={2}
                                alignItems="flex-start"
                            >
                                <Grid item>
                                    <Chip
                                        label={String(recipe.time) + " min"}
                                        variant="outlined"
                                        icon={<QueryBuilderIcon />}
                                    />
                                </Grid>
                                {recipe.tags.map((tag) => (
                                    <Grid item>
                                        <Chip label={tag} variant="outlined" />
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Fourth Row - Nutrition Information, Required Tools */}
                            <Grid
                                container
                                spacing={2}
                                marginTop={2}
                                alignItems="flex-start"
                            >
                                {/* Nutrition Info */}
                                <Grid item xs={6}>
                                    <p className="heading4">
                                        Nutrition Information
                                    </p>
                                    <Grid container>
                                        {Object.keys(recipe.nutrition).map(
                                            (name) => (
                                                <NutritionItem
                                                    name={name}
                                                    recipe={recipe}
                                                ></NutritionItem>
                                            )
                                        )}
                                    </Grid>
                                </Grid>

                                {/* Tools */}
                                <Grid item xs={6}>
                                    <p className="heading4">Required Tools</p>
                                    <ul>
                                        {recipe.tools.map((tool) => (
                                            <li>
                                                <p>{tool.capitalize()}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Ingredients Container */}
                    <Grid
                        container
                        item
                        xs={12}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        className="ingredients-container"
                    >
                        {/* First Row - Ingredients Title, Servings */}
                        <Grid
                            container
                            spacing={2}
                            marginTop={2}
                            alignItems="flex-start"
                        >
                            <Grid item xs={12}>
                                <p className="heading2">Ingredients</p>
                                <p className="heading4">
                                    {servings} Serving
                                    {servings === 1 ? "" : "s"}
                                </p>
                            </Grid>
                        </Grid>

                        {/* Second Row - Ingredients */}
                        <Grid
                            container
                            spacing={1}
                            marginTop={2}
                            justifyContent="flex-start"
                            alignItems="center"
                        >
                            {Object.keys(recipe.ingredients).map(
                                (ingredient) => (
                                    <IngredientItem
                                        name={ingredient}
                                        amount={recipe.ingredients[ingredient]}
                                    ></IngredientItem>
                                )
                            )}
                        </Grid>
                    </Grid>

                    {/* Instructions Container */}
                    <Grid
                        container
                        spacing={2}
                        marginTop={3}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        className="instructions-container"
                    >
                        {/* First Row - Instructions Title */}
                        <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs={12}>
                                <p className="heading2">Instructions</p>
                            </Grid>
                            {recipe.instructions.map((instruction) => (
                                <Grid container spacing={2} item xs={12}>
                                    <Grid item xs={11}>
                                        {instruction}
                                    </Grid>
                                    <Grid item>
                                        <Checkbox color="success" />
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* Cultural Information Container */}
                    <Grid
                        container
                        spacing={2}
                        marginTop={3}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        className="instructions-container"
                    >
                        {/* First Container - Title */}
                        <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs={12}>
                                <p className="heading2">Cultural Information</p>
                            </Grid>
                        </Grid>

                        {/* Second Container - Circumstances of creation */}
                        <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs={12}>
                                <p className="heading3">
                                    Circumstances of Creation
                                </p>
                                <p>{recipe.circumstances}</p>
                            </Grid>
                        </Grid>

                        {/* Third Row - Reasoning Behind Ingredients */}
                        <Grid
                            container
                            spacing={2}
                            marginTop={2}
                            alignItems="flex-start"
                        >
                            <Grid item xs={12}>
                                <p className="heading3">
                                    Reasoning Behind Ingredients
                                </p>
                                <p>{recipe.reasoning}</p>
                            </Grid>
                        </Grid>

                        {/* Fourth Row - Text */}
                        {/* <Grid
                            container
                            spacing={2}
                            marginTop={2}
                            alignItems="flex-start"
                        >
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>
                                    Text
                                </Typography>
                                <Typography variant="body" gutterBottom>
                                    {recipe.reasoning}
                                </Typography>
                            </Grid>
                        </Grid> */}
                    </Grid>

                    {/* Reviews Container*/}
                    <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        className="reviews-container"
                    >
                        {/* First Container - Title and Add Review Button*/}
                        <Grid
                            container
                            spacing={2}
                            marginTop={4}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <p className="heading2">
                                    Reviews ({recipe.numReviews})
                                </p>
                            </Grid>
                            <Grid item>
                                <button
                                    className="primary-btn"
                                    onClick={initiateUpload}
                                >
                                    Add Review
                                </button>
                            </Grid>
                        </Grid>

                        {/* Submissions Container*/}
                        <Grid
                            container
                            spacing={2}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <Input
                                    name="Rating (1 ~ 5)"
                                    handleChange={(e) =>
                                        setMyRating(Number(e.target.value))
                                    }
                                />
                                <Input
                                    name="Review goes here"
                                    handleChange={(e) =>
                                        setMyReview(e.target.value)
                                    }
                                />
                            </Grid>
                        </Grid>

                        {/* Second Container - Reviews */}
                        <Grid
                            container
                            spacing={2}
                            marginBottom={2}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            {reviews.map((review) => (
                                <Review
                                    user={review.name}
                                    body={review.content}
                                    rating={review.rating}
                                ></Review>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                {/* Right Gutter */}
                <Grid item xs={1}></Grid>
            </Grid>

            {/* Bookmarking error */}
            <Snackbar
                open={bookmarkErrorOpen}
                autoHideDuration={3000}
                onClose={() => {
                    setBookmarkErrorOpen(false);
                }}
            >
                <Alert variant="filled" severity="error">
                    <AlertTitle> Bookmark Failed </AlertTitle>
                    You cannot use bookmarks with recipes without being logged
                    in.
                </Alert>
            </Snackbar>
        </div>
    );
};

export default RecipePage;
