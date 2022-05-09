import React from "react";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

const nutritionUnits = {
    calories: "",
    protein: "g",
    carbs: "g",
    fats: "g",
    fiber: "g"
};

const NutritionItem = (props) => {
    return (
        <Grid item xs={6} sx={{ my: 1 }}>
            <p className="bold">{props.name.capitalize()}</p>
            <p>
                {props.recipe.nutrition[props.name]}
                {nutritionUnits[props.name]}
            </p>
        </Grid>
    );
};

export default NutritionItem;
