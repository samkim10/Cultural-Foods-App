import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import { Card, CardActionArea, CardContent, CardMedia } from "@mui/material";

const CultureHubItem = (props) => {
    return (
        <div>
            <Link
                to={`/CultureHub/${props.content}`}
                style={{ textDecoration: "none" }}
            >
                <Card sx={{ maxWidth: 270 }}>
                    <CardActionArea>
                        {/* Display culture image */}
                        <CardMedia
                            component="img"
                            height="200"
                            image={"" + props.image}
                            alt={props.alt}
                        />
                        {/* Display culture name */}
                        <CardContent className="mui-card-content">
                            <p className="culture-hub-item-content">
                                {props.content}
                            </p>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Link>
        </div>
    );
};

export default CultureHubItem;
