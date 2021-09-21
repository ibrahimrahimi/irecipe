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
            alert(`Something went wrong!`);
        };
    };

    calculateTime() {
        // Assuming that we need 10 min for each 3 ingredients
        const numOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numOfIngredients / 3);
        this.time = periods * 10;
    };

    calculateServings() {
        this.servings = 5;
    };

    parseIngredients() {
        const unitsLong = ['tablespoon', 'tablespoons', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })

            // 2) Remove parenteses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIngredient = ingredient.split(' ');
            const unitIndex = arrIngredient.findIndex(el2 => unitsShort.includes(el2));

            let ingredientObj;
            if(unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2]
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIngredient.slice(0, unitIndex);

                let count;
                if(arrIngredient.length === 1) {
                    count = eval(arrIngredient[0].replace('-', '+'));
                } else {
                    count = eval(arrIngredient.slice(0, unitIndex).join('+'));
                }

                ingredientObj = {
                    count,
                    unit: arrIngredient[unitIndex],
                    ingredient: arrIngredient.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIngredient[0], 10)) {
                // There is no unit, but 1st element is a number
                ingredientObj = {
                    count: parseInt(arrIngredient[0], 10),
                    unit: '',
                    ingredient: arrIngredient.slice(1).join('')
                }
            } else if (unitIndex === -1) {
                // There is no unit and no number in 1st index.
                ingredientObj = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            };

            return ingredientObj;
        });
        this.ingredients = newIngredients;
    };
};