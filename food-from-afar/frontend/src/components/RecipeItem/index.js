import React from "react";
import { uid } from 'react-uid';
import "./styles.css";
import { Link } from "react-router-dom";
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    Grid
} from "@mui/material";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";

/* Component for displaying a recipe */
const RecipeItem = (props) => {
    return (
        <Link to={`/recipe/${props.recipe._id}`} style={{ textDecoration: 'none' }}>
            <Card sx={{ maxWidth: 270 }}>
                <CardActionArea>
                    {/* Display culture image */}
                    <CardMedia
                        component="img"
                        height="200"
                        image={""+props.recipe.image}
                        alt={`${props.recipe.name}`}
                    />
                    <CardContent>
                        {/* Recipe name */}
                        <p className="heading3">{props.recipe.name}</p>                    

                        {/* Tags for recipe */}
                        <Grid
                            container
                            spacing={1}
                            marginTop={1}
                            alignItems="flex-start"
                        >
                            {/* Time */}
                            <Grid item>
                                <Chip
                                    variant="outlined"
                                    label={String(props.recipe.time) + " min"}
                                    icon={<QueryBuilderIcon />}
                                    color="warning"
                                />
                            </Grid>
                            {/* Difficulty */}
                            <Grid item>
                                <Chip
                                    variant="outlined"
                                    label={props.recipe.difficulty}
                                    color="error"
                                />
                            </Grid>

                            {/* Description tags */}
                            {props.recipe.tags.map((tag) => (
                                <Grid item key={uid(tag)}>
                                    <Chip
                                        className="mui-chip"
                                        variant="filled"
                                        label={tag}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Grid to position ratings and reviews vertically */}
                        <Grid container direction="column" marginTop={2}>
                            {/* Rating */}
                            <Grid item>
                                <p>{props.recipe.rating} Rating</p>
                            </Grid>

                            {/* Reviews */}
                            <Grid item>
                                <p>{props.recipe.numReviews} Reviews</p>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );
};

export default RecipeItem;