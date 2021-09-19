import axios from "axios";


export default class Recipe {
    constructor(id) {
        this.id = id;
    };

    async getRecipe() {
        try {
            const resutl = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = resutl.data.recipe.title;
            this.author = resutl.data.recipe.publisher;
            this.image = resutl.data.recipe.image_url;
            this.url = resutl.data.recipe.source_url;
            this.ingredients = resutl.data.recipe.ingredients;
        } catch (error) {
            alert(`Something went wrong :(`);
        }
    };

    calculateTime() {
        // Assuming that we need 10 min for each 3 ingredients
        const numOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numOfIngredients / 3);
        this.time = periods * 10;
    };

    calculateServings() {
        this.servings = 5;
    }
}