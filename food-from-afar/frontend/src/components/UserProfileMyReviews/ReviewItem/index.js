import React from "react";
import { Grid, Card, Rating, IconButton } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlined from "@mui/icons-material/EditOutlined";
import Delete from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

const formatISODate = (date) => {
    return date.substring(0, 10);
}

/* Component for the My Reviews Section of Profile Page */
const ReviewItem = (props) => {
    return (
        <Grid container xs={10}>

            {/* Left side of Card*/}
            <Grid container item xs={12} md={6} spacing={2} justifyContent="flex-start">
                <Grid item>
                    <h className="heading4">{formatISODate(props.review.createdAt)}</h>
                </Grid>
                <Grid item>
                    <Rating
                        name="recipe-rating"
                        value={props.review.rating}
                        size="medium"
                        precision={0.25}
                        readOnly
                    />
                </Grid>
            </Grid>

            {/* Right side of Card */}
            <Grid container item xs={12} md={6} spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
                <Grid item>
                    <Link to={`/recipe/${props.review.recipe}`}>
                        <button className="primary-btn-no-margin">See Recipe</button>
                    </Link>
                </Grid>
                <Grid item>
                    <IconButton aria-label="edit review" component="span" size="large" edge="end">
                        <EditOutlined />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton aria-label="delete review" component="span" size="large" edge="end">
                        <Delete />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item>
                    <p>{props.review.content}</p>
                </Grid>
            </Grid>
        </Grid>
    );
}


export default ReviewItem;
