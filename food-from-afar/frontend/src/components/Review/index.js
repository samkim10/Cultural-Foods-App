import React from "react";
import Grid from "@mui/material/Grid";
import { Typography, Rating } from "@mui/material";

const Review = (props) => {
    return (
        <Grid
            container
            spacing={2}
            item
            xs={12}
            sx={{ mb: 2 }}
            alignItems="center"
        >
            <Grid item>
                <Typography variant="h5" gutterBottom>
                    {props.user}
                </Typography>
            </Grid>
            <Grid item>
                <Rating
                    name="review-rating"
                    defaultValue={props.rating}
                    size="medium"
                    precision={0.25}
                    readOnly
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body" gutterBottom>
                    {props.body}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Review;
