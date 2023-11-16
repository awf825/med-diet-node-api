const Question = require("./question.model.js")

module.exports = (sequelize, Sequelize) => {
    const QuestionCategory = sequelize.define("question_category", {
        category_id: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        category_name: {
            type: Sequelize.STRING
        },
    },
        {
            timestamps: false
        }
    );

    // QuestionCategory.associate = (models) => {
    //     QuestionCategory.belongsTo(models.question, {
    //         as: 'question_category', foreignKey: 'owner_id'
    //     })
    // }

    return QuestionCategory;
};
