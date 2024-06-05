const middleware = require('./middleware.js');

module.exports = app => {
    const recipe = require("../controllers/recipe.controller.js");
    var router = require("express").Router();
  
    // router.get("/ffq", middleware.authenticateWebToken, questions.findAllFFQ);
    router.get("/generateRecipeDefault", recipe.generateRecipeDefault);
    router.post("/generateCustomRecipe", recipe.generateCustomRecipe);

    app.use('/api/recipe', router);
};
  