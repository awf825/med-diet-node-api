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
    },
        {
            timestamps: false
        }
    );

    QuestionCategory.associate = (models) => {
        QuestionCategory.belongsTo(models.question, {
            as: "question",
            foreignKey: "category_id"
        });

        // FieldType.hasMany(models.question_answer_options, { 
        //     as: "question_answer_options",
        //     foreignKey: "field_type_id"
        // });
    }

    return QuestionCategory;
};
