import React, { useState, useEffect } from "react";
import "./styles.css";
import Input from "../Input";
import { WithContext as ReactTags } from "react-tag-input";
import axios from "axios";
import {ActiveUserContext} from "../../App.js"   
import { Alert, AlertTitle, Snackbar } from "@mui/material";


const KeyCodes = {
    comma: 188,
    enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

/* Component for the user submission page */
const UserSubmission = () => {
    const {activeUser, changeActiveUser} = React.useContext(ActiveUserContext) 

    /* Submission fields */
    // tags: a list of object {id: , text: }
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [tools, setTools] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [tags, setTags] = useState([]);
    const [time, setTime] = useState();
    const [nutrition, setNutrition] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [instructions, setInstructions] = useState([]);
    const [circumstances, setCircumstances] = useState("");
    const [reasoning, setReasoning] = useState("");
    const [DBTAGS, setDBTAGS] = useState([]);

    const [user, setUser] = useState("")

    /* Controls what user output is shown */
    const [notLoggedIn, setNotLoggedIn] = useState(false);
    const [missingRequiredOpen, setMissingRequiredOpen] = useState(false);
    const [invalidDifficultyOpen, setInvalidDifficultyOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    /* Component initialization */
    useEffect(() => {
        axios
        .get(`/users/username/${activeUser}`)
        .then((response) => {
            const res = response.data;
            const myStr = JSON.stringify(res);
            const myObj = JSON.parse(myStr);
            const resUser = {
                _id: myObj["_id"],
                name: myObj["name"],
            };
            
            setUser(resUser);
            console.log("user: " + user.name)
        })
        .then(() => {
            axios
            .get(`/tags/`)
            .then((response)=>{
                const res = response.data;
                const TAGary = [];
                for(let i = 0; i < res.length; i ++){
                    const myStr = JSON.stringify(res[i]);
                    const myObj = JSON.parse(myStr);
                    const resTag = {
                        id: myObj["content"],
                        text: myObj["content"],
                    };
                    TAGary.push(resTag)
                }
                console.log(TAGary)
                setDBTAGS(TAGary);
            })
        })
    }, []);

    const objectToArray = (input) => {
        let ary = []
        const keys = Object.keys(tags)
        for (let i = 0; i < input.length; i ++){
            const item = input[keys[i]]
            const keys2 = Object.keys(item)
            for (let j = 1; j < keys2.length; j ++){
                ary.push(item[keys2[j]])
            }
        }
        return ary
    }

    /* Process user's request to upload recipe */
    const initiateUpload = () =>
    {
        /* Only input recipe if logged in */
        if (!activeUser) {
            setNotLoggedIn(true);
            return;
        }

        /* Validate inputted data */
        // Missing required information
        if (name === "" || time === "" || instructions.length === 0) {
            setMissingRequiredOpen(true);
            return;
        }
        // Invalid difficulty field
        else if (difficulty !== "" && difficulty !== "Easy" && 
                 difficulty !== "Medium" && difficulty !== "Hard") {
            setInvalidDifficultyOpen(true);
            return;
        }

        const tagAry = objectToArray(tags);
        const recipe = {
            name: name,
            category: category,
            creator: user._id,
            rating: 1,
            numReviews: 0,
            tags: tagAry,
            time: time,
            nutrition: nutrition,
            difficulty: difficulty,
            tools: tools,
            ingredients: ingredients,
            instructions: instructions,
            circumstances: circumstances,
            reasoning: reasoning
        }

        axios
        .post(`/recipes/add`, recipe)
        .then((response)=>{
            console.log(response);
        })

        setSuccessOpen(true);
    }

    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag) => {
        setTags([...tags, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        setTags(newTags);
    };

    const handleTagClick = (index) => {
        console.log("The tag at index " + index + " was clicked");
    };

    const onClearAll = () => {
        setTags([]);
    };

    const onTagUpdate = (i, newTag) => {
        const updatedTags = tags.slice();
        updatedTags.splice(i, 1, newTag);
        setTags(updatedTags);
    };

    const handleArrayInput = (input) => {
        const seperated = input.split(",");
        return seperated;
    }

    const handleObjectInput = (input) => {
        const seperated = input.split(",");
        let final = {};
        for (let i = 0; i < seperated.length; i++){
            const keyVal = seperated[i].split(":");
            final[keyVal[0]] = keyVal[1]
        }
        return final;
    }

    /* Debugging functionality that can be added to return statement 
            <button onClick={ () => console.log({activeUser})}>
                Debug: Log active user
            </button>
            <button onClick={ () => changeActiveUser("waffle")}>
                Debug: set active user to waffle
            </button>
    */

    return (
        <div className="user-submission-container">
            <p className="heading2">Upload Your Recipe!</p>
            <p>Required*</p>

            <Input name="Dish name*" handleChange={e => setName(e.target.value)}/>

            <Input name="Category (e.g. Asian)" handleChange={e => setCategory(e.target.value)}/>

            <Input name="Preperation Time* (minutes)" handleChange={e => setTime(Number(e.target.value))}/>
            <Input name="Recipe Difficulty (Easy, Medium or Hard)" handleChange={e => setDifficulty(e.target.value)}/>

            <p className="heading4 mb-1">Tags (comma-separated)</p>
            <ReactTags
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                delimiters={delimiters}
                handleTagClick={handleTagClick}
                onClearAll={onClearAll}
                onTagUpdate={onTagUpdate}
                suggestions={DBTAGS}
                placeholder="Add a new tag"
                minQueryLength={2}
                maxLength={5}
                autofocus={false}
                allowDeleteFromEmptyInput={true}
                autocomplete={true}
                readOnly={false}
                allowUnique={true}
                allowDragDrop={true}
                inline={true}
                allowAdditionFromPaste={true}
                editable={true}
                clearAll={true}
                tags={tags}
            />

            <Input name="Required Tools (example: hammer, robot, boat)" handleChange={e => setTools(handleArrayInput(e.target.value))}/>

            <Input name="Ingredients (example: carrot:3, potato:5, banana:10)" handleChange={e => setIngredients(handleObjectInput(e.target.value))}/>

            <Input name="Nutrition (example: calories:300, sodium:500g)" handleChange={e => setNutrition(handleObjectInput(e.target.value))}/>

            <Input name="Instructions* (example: bake for 10 min, serve in paper plate)" handleChange={e => setInstructions(handleArrayInput(e.target.value))}/>

            <p className="heading3">Share some cultural significance!</p>

            <Input name="Circumstances of Creation" handleChange={e => setCircumstances(e.target.value)}/>

            <Input name="Reasoning Behind Ingredients" handleChange={e => setReasoning(e.target.value)}/>

            <button className="primary-btn" onClick={initiateUpload}>Upload</button>

            {/* Alerts for user output */}
            {/* Missing required information */}
            <Snackbar
                open={notLoggedIn}
                autoHideDuration={7000}
                onClose={() => { setNotLoggedIn(false) }}
            >
                <Alert variant="filled" severity="error">
                    <AlertTitle> Not Logged In </AlertTitle>
                    You cannot submit a recipe without being logged in.
                </Alert>
            </Snackbar>

            {/* Missing required information */}
            <Snackbar
                open={missingRequiredOpen}
                autoHideDuration={7000}
                onClose={() => { setMissingRequiredOpen(false) }}
            >
                <Alert variant="filled" severity="error">
                    <AlertTitle> Missing Required Information </AlertTitle>
                    You must have a recipe name, time, and at least one instruction.
                </Alert>
            </Snackbar>

            {/* Invalid difficulty */}
            <Snackbar
                open={invalidDifficultyOpen}
                autoHideDuration={7000}
                onClose={() => { setInvalidDifficultyOpen(false) }}
            >
                <Alert variant="filled" severity="error">
                    <AlertTitle> Invalid Difficulty </AlertTitle>
                    The difficulty must be "Easy", "Medium", "Hard", or left blank.
                </Alert>
            </Snackbar>

            {/* Successful upload */}
            <Snackbar
                open={successOpen}
                autoHideDuration={7000}
                onClose={() => { setSuccessOpen(false) }}
            >
                <Alert variant="filled" severity="success">
                    <AlertTitle> Success! </AlertTitle>
                    Your recipe has been uploaded. Thank you for sharing!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default UserSubmission;