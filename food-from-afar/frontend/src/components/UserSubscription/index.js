import React, { useState, useEffect } from "react";
import "./styles.css";
import UserProfileSidebar from "../UserProfileSidebar";
import CultureHubItem from "../CultureHubItem";
import axios from "axios";
import {ActiveUserContext} from "../../App.js"   

/* Component for the My Subscriptions section of the user profile */
const UserSubscription = () => {
    //const [user, setUser] = useState("");
    const {activeUser, changeActiveUser} = React.useContext(ActiveUserContext) 
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        console.log("use Effect>")
        axios
        .get(`/users/name/${activeUser}`)
        .then(async (response) => {
            const res = response.data;
            const myStr = JSON.stringify(res);
            const myObj = JSON.parse(myStr);
            const subs = myObj["subscribed"];
            const cats = [];
            for (let i = 0; i < subs.length; i++){
                await axios
                .get(`/categories/id/${subs[i]}`)
                .then((response) => {
                    const res = response.data;
                    const myStr = JSON.stringify(res);
                    const myObj = JSON.parse(myStr);
                    const category = {
                        _id: myObj["_id"],
                        content: myObj["content"],
                        alt: myObj["alt"],
                        image: myObj["url"]
                    }
                    cats.push(category)
                })
            }
            setCategories(cats);
            /*const resUser = {
                _id: myObj["_id"],
                name: myObj["name"],
                subscribed: myObj["subscribed"]
            };
            setUser(resUser);
            console.log("user name: " + user.name)
            console.log("user subscribed: " + user.subscribed)*/
        });
    }, []);

    return (
        <div>
            <div className="user-profile-grid">
                <UserProfileSidebar></UserProfileSidebar>
                <div className="user-profile-main-container">
                    <p className="heading3 mb-2">My Subscription</p>
                    <div className="culture-hub-item-container">
                        {categories.map((categoryItem) => (
                            <CultureHubItem
                                image={categoryItem.image}
                                alt={categoryItem.alt}
                                content={categoryItem.content}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSubscription;
