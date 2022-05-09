import React from "react";
import "./styles.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { makeStyles } from "@material-ui/core/styles";

const HowItWorksItem = (props) => {
    const useStyles = makeStyles({
        root: {
            minWidth: 260,
            boxShadow: "#E3E4E5 0px 7px 29px 0px",
        },
    });

    const classes = useStyles();

    return (
        <Card className={classes.root} sx={{ maxWidth: 400 }}>
            <CardMedia
                component="img"
                height="160"
                image={props.image}
                alt={props.alt}
            />
            <CardContent>
                <p className="how-it-works-heading">{props.heading}</p>
                <p className="how-it-works-description">{props.description}</p>
            </CardContent>
        </Card>
    );
};

export default HowItWorksItem;
