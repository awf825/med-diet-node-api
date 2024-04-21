'use strict'
module.exports = (sequelize, Sequelize) => {
    const Answer = sequelize.define("question_answers", {
        answer_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        question_id: {
            type: Sequelize.INTEGER,
        },
        question_answer_submission_id: {
            type: Sequelize.INTEGER,
        },
        answer_score: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            timestamps: false,
            initialAutoIncrement: 1
        }
    );

    Answer.associate = function (models) {
        Answer.hasOne(models.question, {
            as: "question",
            sourceKey: "question_id",
            foreignKey: "question_id"
        });

        Answer.hasOne(models.question_category, {
            as: "question_category",
            through: "question"
        })
    }
    
    return Answer;
};