// Global app controller 
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';


/**
 * - Global state of the app
 * - Search object
 * - current recipe object
 * - Shopping list objecet 
 * - Liked recipes
 */

const state = {};

/* 
** Search Controller
*/
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); 

    if(query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResultDiv);

        try {
            // 4) Search for recipes
            await state.search.getResult();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong with searching ...');
            clearLoader();
        };
    };
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    };
});

/* 
** Recipe Controller
*/
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if(id) {
        // Prepare UI for changes

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calculateTime();
            state.recipe.calculateServings();

            // Render recipe
            console.log(state.recipe); 
        } catch (error) {
            alert('Error in processing recipe!', error);   
        };
    };
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));