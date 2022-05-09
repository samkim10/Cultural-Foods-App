import React, { useState, useEffect } from "react";
import CultureHubItem from "../CultureHubItem";
import "./styles.css";

// Import images from static file
/* edit: moved to public now.
import KoreanFood from "./static/CH-koreanFood.png";
import ChineseFood from "./static/CH-chineseFood.jpg";
import AmericanFood from "./static/CH-americanFood.jpg";
import JamaicanFood from "./static/CH-jamaicanFood.jpg";
import AfghanFood from "./static/CH-afghanFood.jpg";
import AfricanFood from "./static/CH-africanFood.png";
import AsianFood from "./static/CH-asianFood.png";*/
import axios from "axios";

// Image sources -- can put in database with object
/* American food image source: https://www.istockphoto.com/photo/huge-grass-fed-bison-hamburger-with-chips-beer-gm467416670-60331918?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Famerican-food&utm_term=american%20food%3A%3A%3A */
/* Chinese food image source: https://www.istockphoto.com/photo/chinese-food-blank-background-gm545286388-98216699 */
/* Jamaican food image source: https://www.istockphoto.com/photo/spicy-grilled-jerk-chicken-on-a-plate-gm1166171010-321146825?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fjamacan-food&utm_term=jamacan%20food%3A%3A%3A */
/* Afghan food image source: https://www.istockphoto.com/photo/set-of-several-asian-dishes-gm1174364668-326573670?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fafghan-food&utm_term=afghan%20food%3A%3A%3A */
/* African food image source: https://unsplash.com/photos/MNctbZ6pa5c */

const CultureHub = () => {
    // Culture hub objects for top categories
    const [topCategories, setTopCategories] = useState([]);

    // Culture hub objects for all categoreies
    const [allCategories, setAllCategories] = useState([]); //afghanFood, africanFood, americanFood, asianFood]);

    //How many cultures to show for top. ("top" is decided by the number of recipes for that culture).
    const topListingLimit = 4; 

    useEffect(() => {
        axios
            .get("/categories/")
            .then(async (response) => {
                const res = response.data;
                const cardAry = [];
                const topAry = [];
                for (let i = 0; i < res.length; i++) {
                    const myStr = JSON.stringify(res[i]);
                    const myObj = JSON.parse(myStr);
                    let count = 0;
                    await axios
                    .get("/recipes/")
                    .then((response2)=>{
                        const res2 = response2.data;
                        for (let i = 0; i < res2.length; i++) {
                            const myStr2 = JSON.stringify(res2[i]);
                            const myObj2 = JSON.parse(myStr2);
                            if(myObj2["category"] == myObj["content"]){
                                //console.log(myObj2["category"] + " is hit")
                                count += 1;
                            }
                        }
                    })
                    const card = {
                        _id:myObj["_id"],
                        image: myObj["url"],
                        alt: myObj["alt"],
                        content: myObj["content"],
                        pop: count
                    };
                    //console.log(card);
                    cardAry.push(card);
                    topAry.push(card);
                }

                topAry.sort(function(a, b) {
                    return parseFloat(b.pop) - parseFloat(a.pop);
                });

                setTopCategories(topAry.slice(0, topListingLimit));
                setAllCategories(cardAry);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="culture-hub-container">
            <p className="culture-hub-heading">Top Categories</p>

            {/* Create top category items */}
            <div className="culture-hub-item-container">
                {topCategories.map((topCategoryItem) => (
                    <CultureHubItem
                        _id = {topCategoryItem._id}
                        image={topCategoryItem.image}
                        alt={topCategoryItem.alt}
                        content={topCategoryItem.content}
                    />
                ))}
            </div>

            <p className="culture-hub-heading">All Categories</p>

            {/* Create all category items */}
            <div className="culture-hub-item-container">
                {allCategories.map((allCategoryItem) => (
                    <CultureHubItem
                        _id = {allCategoryItem._id}
                        image={allCategoryItem.image}
                        alt={allCategoryItem.alt}
                        content={allCategoryItem.content}
                    />
                ))}
            </div>
        </div>
    );
};

export default CultureHub;
