import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import "./styles.css";
import XW from "./static/XW.jpeg";
import JRC from "./static/JRC.jpg";
import BG from "./static/BG.jpg";
import JT from "./static/JT.jpg";
import TT from "./static/TT.jpg";

export default function AboutUs() {
    return (
        <div className="about-us-container">
            <ImageList cols={3} gap={25} sx={{ width: 900, height: 600 }}>
                {itemData.map((item) => (
                    <ImageListItem key={item.img}>
                        <img
                            src={`${item.img}?w=248&fit=crop&auto=format`}
                            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={item.title}
                            subtitle={<span>{item.intro}</span>}
                            position="below"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    );
}

const itemData = [
    {
        img: JRC,
        title: "Joseph (Robbie) Chung",
        intro: "UofT CS & Math | linkedin.com/in/robbie-chung/ "
    },
    {
        img: BG,
        title: "Blake Gigiolio",
        intro: "3rd Year University of Toronto Computer Science Student"
    },
    {
        img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
        title: "Sang Won Kim",
        intro: "University of Toronto. Computer Science Specialist."
    },
    {
        img: JT,
        title: "Jeremy Truong",
        intro: "UofT CS Specialist | linkedin.com/in/jeremytruong/"
    },
    {
        img: TT,
        title: "Tiffanie Truong",
        intro: "UofT CS & Math | linkedin.com/in/tiffanie-truong-967834210/"
    },
    {
        img: XW,
        title: "Xinmeng Wang",
        intro: "UofT CS & Linguistics | linkedin.com/in/xinmeng-wang"
    }
];
