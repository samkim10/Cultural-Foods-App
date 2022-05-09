import React, { useEffect } from "react";
import "./styles.css";
import HomeFoodImage from "./static/home-food-bento.png";
import WorldMapImage from "./static/world-map.png";
import DishesImage from "./static/dishes.png";
import CookAndEnjoyImage from "./static/cook-and-enjoy-2.png";
import HowItWorksItem from "../HowItWorksItem";
import FAQItem from "../FAQItem";
import Grid from "@mui/material/Grid";
import { Chip } from "@mui/material";
import Card from "@mui/material/Card";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import { ActiveUserContext } from "../../App.js";

/* Component for the Home page */
const Home = () => {
    const { activeUser, changeActiveUser } =
        React.useContext(ActiveUserContext);

    const [recipe, setRecipe] = React.useState({
        tags: [],
        nutrition: [],
        tools: [],
        ingredients: [],
        instructions: [],
        rating: 0
    });
    const tempMealDay = "6233808ea9ac94f0e62b94df";

    useEffect(() => {
        // get recipe with ID from DB
        axios
            .get(`/recipes/${tempMealDay}`) //currently hardcoded until signup is implemented

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
                //console.log(resRecipe);
                //console.log(resRecipe.tags);
                console.log("user active: " + activeUser);
                setRecipe(resRecipe);
                //isLoaded = true;
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            {/* Home top section */}
            <div className="home-top-container">
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={12} md={6} className="home-top-text">
                        <p className="heading1">Food from Afar</p>
                        <p className="home-description-text">
                            Travel the world from the comfort of your kitchen
                        </p>
                        <Link to="/CultureHub">
                            <button className="primary-btn">Learn Now</button>
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={6} className="home-top-image">
                        <img
                            className="home-page-top-image"
                            src={HomeFoodImage}
                            alt="Home page food"
                            width="100%"
                        />
                    </Grid>
                </Grid>
            </div>

            {/* How it works */}
            <div className="section-container">
                <p className="heading2">How It Works</p>
                <div className="how-it-works-item-container">
                    {/* world map image referece: https://dribbble.com/shots/6282258-world-map */}
                    <HowItWorksItem
                        image={WorldMapImage}
                        alt="Choose a Culture"
                        heading="Choose a Culture"
                        description="20+ cultures to choose from"
                    />

                    <HowItWorksItem
                        image={DishesImage}
                        alt="Choose a Dish"
                        heading="Choose a Dish"
                        description="Detailed step by step recipe available"
                    />

                    {/* cook and enjoy image reference: https://www.behance.net/gallery/116563019/Food-illustrations?tracking_source=search_projects%7Cdish */}
                    <HowItWorksItem
                        image={CookAndEnjoyImage}
                        alt="Cook & Enjoy"
                        heading="Cook & Enjoy"
                        description="Gain cooking and culture knowledge"
                    />
                </div>
            </div>

            {/* Meal of the day */}
            <div className="section-container">
                <p className="heading2">Meal of the Day</p>
                <Card className="meal-container">
                    <div>
                        <img
                            src={recipe.image}
                            alt="Chicken Fajitas"
                            className="meal-of-the-day-img"
                        />
                    </div>
                    <div className="meal-of-the-day-right-section">
                        <p className="heading3">{recipe.name}</p>
                        <Grid
                            container
                            spacing={1}
                            marginTop={1}
                            alignItems="flex-start"
                            className="tags-container"
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
                                    <Chip
                                        className="mui-chip"
                                        label={tag}
                                        variant="filled"
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <br></br>
                        <p className="heading4 text-align-left">Ingredients</p>
                        <div className="ingredients-container">
                            {Object.keys(recipe.ingredients).map(
                                (ingredient) => (
                                    <p>{ingredient}</p>
                                )
                            )}
                        </div>
                        <div className="btn-bottom-right">
                            <Link
                                to={`/recipe/${tempMealDay}`}
                                className="link"
                            >
                                <button className="btn-with-no-styling">
                                    Read More {">"}
                                </button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>

            {/* FAQ */}
            <div className="section-container">
                <p className="heading2">FAQ</p>
                <div className="faq-item-container">
                    {/* TODO */}
                    <FAQItem
                        question="What is Food from Afar, and how does it work?"
                        answer="Food from Afar is a platform to widen your perspective on the global community and the diverse foods that can be found. Users can choose to explore the foods different cultures have to offer, and add foods from their own culture. Learning diverse ways to cook while also broadening your perspective is where Food from Afar shines, connecting cultures one recipe at a time."
                    />
                    <FAQItem
                        question="Is it free?"
                        answer="Yes, it is completely free!"
                    />
                    <FAQItem
                        question="Can I upload my own recipe?"
                        answer="Yes! You can upload your recipe in your profile page."
                    />
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Home;
