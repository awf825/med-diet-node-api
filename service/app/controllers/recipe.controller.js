const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.generateRecipeDefault = async (req, res) => {
    try {
        const completion = await openai.completions.create({
            // messages: [{ role: "system", content: "You are a helpful assistant." }],
            prompt: "Generate a recipe suitable for a 29 year old male who is overweight with a goal of weight loss that you would eat for dinner. \
            It may contain made shrimp, garlic, avocado, red onions, garbanzo beans and broccoli, but it does not and should not need all of these \
            ingredients at once. \
            It should be in the Mediterranean style, the dish could contain olive oil if needed to provide additional complex \
            flavor. \
            The recipe should be simple to moderately complex, with a limit of 12 ingredients.",
            model: "gpt-3.5-turbo-instruct",
            temperature: 0,
            max_tokens: 400
        });
        
        console.log(completion);

        res.send({
            choices: completion.choices[0]
        })
    } catch (err) {
        res.json({ message: err.message, success: false })
    }
};

exports.generateCustomRecipe = async (req, res) => {
    const {
        age, // given
        gender, // given
        goal, 
        mealType,
        proteins,
        fruits,
        vegetables,
        numberOfIngredients,
        cookingMethod, // baked, fried, grilled, air fried, cold
        // dietary,  // vegan, veggie, gluten-free, dairy-free
    } = req.body
    try {
        const completion = await openai.completions.create({
            // messages: [{ role: "system", content: "You are a helpful assistant." }],
            prompt: `
            Generate a ${mealType} recipe for a dish suitable for a ${age} year old ${gender} who is trying to ${goal}.
            It may contain any of the following items, but absolutely no more than two: ${proteins.join(', ')}.
            It may contain any of the following items, but absolutely no more than three: ${vegetables.join(', ')}.
            It may contain any of the following items, but absolutely no more than four, if and ONLY IF this is NOT a dinner recipe: ${fruits.join(', ')}.
            It should be in the Mediterranean style, the dish should contain olive oil for frying, baking or dressing. If the dish is sweet, olive oil
            can still be applied to provide complex, unique flavor.
            The recipe should be simple to moderately complex, with a limit of ${numberOfIngredients > -1 ? numberOfIngredients : 12} ingredients.
            Do NOT send a description along with the recipe. All that is necessary is a title, a list of ingredients and the instructions.
            The final product should be ${cookingMethod}.
            `,
            model: "gpt-3.5-turbo-instruct",
            temperature: 0,
            max_tokens: 400
        });
        
        console.log(completion);

        res.send({
            choices: completion.choices[0]
        })
    } catch (err) {
        res.json({ message: err.message, success: false })
    }
};