'use strict'
module.exports = (sequelize, Sequelize) => {
    const QuestionAnswerOption = sequelize.define("question_answer_options", {
        option_id: {
            field: 'option_id',
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        field_type_id: {
            type: Sequelize.INTEGER,
        },
        option_text: {
            type: Sequelize.STRING
        },
        ordering: {
            type: Sequelize.INTEGER
        }
    },
        {
            timestamps: false
        }
    );

    QuestionAnswerOption.removeAttribute('id');

    QuestionAnswerOption.associate = function (models) {
        QuestionAnswerOption.belongsTo(models.question_field_type, { 
            as: "question_field_type",
            foreignKey: "field_type_id"
        })
    }
    
    return QuestionAnswerOption;
};