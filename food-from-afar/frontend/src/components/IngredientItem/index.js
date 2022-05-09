import React from "react";
import Grid from "@mui/material/Grid";
import { Typography, Card, CardContent } from "@mui/material";

const IngredientItem = (props) => {
    return (
        <Grid item xs={2}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {props.name}
                    </Typography>
                    <Typography variant="body" gutterBottom>
                        {props.amount}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
};

export default IngredientItem;
