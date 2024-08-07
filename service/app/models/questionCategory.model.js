const Question = require("./question.model.js")

module.exports = (sequelize, Sequelize) => {
    const QuestionCategory = sequelize.define("question_category", {
        question_category_id: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        category_name: {
            type: Sequelize.STRING
        },
        category_display_name: {
            type: Sequelize.STRING
        },
        display_hex_code: {
            type: Sequelize.STRING
        }
    },
        {
            timestamps: false
        }
    );

    QuestionCategory.associate = (models) => {
        QuestionCategory.hasMany(models.question, {
            as: "questions",
            foreignKey: "category_id"
        });
    }

    // query for scores grouped by category:
    // select count(qa.answer_score), qc.category_display_name from question_categories qc 
    // JOIN questions q ON q.category_id = qc.question_category_id 
    // JOIN question_answers qa ON qa.question_id = q.question_id 
    // where qc.question_category_id != 9 
    // group by qc.question_category_id;

    return QuestionCategory;
};
