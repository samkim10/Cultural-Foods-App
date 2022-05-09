/* Methods that are used in modifying the CulturePage component state */

/*
* Update ordering of currently displayed recipes in the CulturePage
* based on the user's view category selection.
* Takes in as parameters:
*   (1) <selectedBtn> - the Button selected by the user to change view category
*   (2) <setSelectedCategory> - the set function used to update the name of the
*                               current view category
*   (3) <displyedRecipes> - the list of recipes currently displayed and to be reordered
*   (4) <setDisplayedRecipes> - the set function used to update the list of displayed recipes
*/  
export const updateViewCategory = (selectedBtn, setSelectedCategory, 
    displayedRecipes, setDisplayedRecipes) => {
    // Update selected category
    setSelectedCategory(selectedBtn.name);

    // Sort recipes currently being displayed chosen category
    let newDisplayedRecipes = [];
    const sorted = [];
    // View All -- order alphabetically 
    if (selectedBtn.name === "View All") {
        for (const recipe of displayedRecipes)
            sorted.push([recipe.name, recipe])
        sorted.sort();
    }
    // View Popular -- order by highest number of reviews
    else if (selectedBtn.name === "Highly Reviewed") {
        for (const recipe of displayedRecipes)
            sorted.push([recipe.numReviews, recipe])
        // a is first <=> a has more reviews <=> b[0] - a[0] is negative
        sorted.sort((a, b) => b[0] - a[0])
    }
    // Highly rated -- order by highest rating
    else if (selectedBtn.name === "Highly Rated") {
        for (const recipe of displayedRecipes)
            sorted.push([recipe.rating, recipe])
        // a is first <=> a has higher rating <=> b[0] - a[0] is negative
        sorted.sort((a, b) => b[0] - a[0])
    }
    // Recently Added -- order by time added
    else {
        for (const recipe of displayedRecipes) {
            sorted.push([recipe.posted.getTime(), recipe])
        }
        // a is first <=> a posted more recently <=> more elapsed time for a
        sorted.sort((a, b) => b[0] - a[0])
    }

    // Rebuilt new recipe array
    newDisplayedRecipes = [];
    for (const recipe of sorted)
        newDisplayedRecipes.push(recipe[1])
    setDisplayedRecipes(newDisplayedRecipes);
}


/* Update list of user selections. Used to update both the set of 
* recipe difficulties and recipe cooking times to be shown as selected by the user.
* Takes in as parameters:
*   (1) <add> -- the "checked" value the checkbox (i.e. whether selection is in set)
*   (2) <selectionSet> -- the set of currently selected values, and 
*   (3) <selection> -- the selection to be changed 
*   (4) <setFunc> -- the set function used to update selectSet
*/
export const updateSelection = (add, selectionSet, selection, setFunc) => {
    const selectionSetCopy = new Set(selectionSet);
    if (add)
        selectionSetCopy.add(selection);
    else
        selectionSetCopy.delete(selection);
    setFunc(selectionSetCopy);
}


/*
* Filter recipes shown based on current selections.
* Takes in as parameters:
*   (1) <allRecipes> - the list of all possible recipes to be shown
    (2) <search> - the string representing the user's current search 
*   (3) <selectedDifficulties> - the set of user selected difficulties
*   (4) <selectedCookingTimes> - the set of user selected cooking times
*   (5) <cookingTimes> - an array of two-element arrays (i.e. tuples) representing 
*                        (description, interval) info of valid cooking time groups
*   (6) <setDisplayedRecipes> - the set function used to update the list of displayed recipes
*/ 
export const filterRecipes = (allRecipes, search, selectedDifficulties,
    selectedCookingTimes, cookingTimes, setDisplayedRecipes) => {
    const newDisplayedRecipes = [];
    const loweredSearch = search.toLowerCase();

    for (let recipe of allRecipes) {
        // Skip current recipe if search input exists and is not in this recipe's name 
        if (loweredSearch !== "" && !recipe.name.toLowerCase().includes(search))
            continue;

        // Check if this recipe's difficulty is selected
        const validDifficulty = selectedDifficulties.has(recipe.difficulty) ||
            recipe.difficulty.toLowerCase() === "unspecified";

        // Check if cooking time falls in a current selection
        let validCookingTime = false;
        const selectedIvals = getTimeIntervals(selectedCookingTimes, cookingTimes);
        for (let ival of selectedIvals) {
            if ((ival[0] === 121 && recipe.time >= 121) ||
                (ival[0] <= recipe.time && recipe.time <= ival[1])) {
                validCookingTime = true;
                break;
            }
        }

        // Add current recipe to display if it satisfies both criteria
        if (validDifficulty && validCookingTime)
            newDisplayedRecipes.push(recipe);
    }

    setDisplayedRecipes(newDisplayedRecipes);
}


/* Return an array of two-element arrays (e.g. tuples) where 
* each entry represents the [min, max] value of a cooking time
* interval that the user has selected to see.
* Takes in as parameters:
*   (1) <selectedSet> - the set of strings representing times the user has selected
*   (2) <stringIntervals> - an array of two-element arrays (tuples) where 
*                           the first element is the string, and 
*                           the second element is the endpoints of the interval (inclusive)
*/
export const getTimeIntervals = (selectedSet, stringIntervals) => {
    const selectedIntervals = [];
    for (let strAndIval of stringIntervals) {
        const currStr = strAndIval[0];
        const currIval = strAndIval[1];
        if (selectedSet.has(currStr))
            selectedIntervals.push(currIval);
    }
    return selectedIntervals;
}