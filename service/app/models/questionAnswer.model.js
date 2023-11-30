'use strict'
module.exports = (sequelize, Sequelize) => {
    const Answer = sequelize.define("question_answers", {
        // answer_id: {
        //     field: 'answer_id',
        //     type: Sequelize.INTEGER,
        //     primaryKey: true,
        //     autoIncrement: true,
        //     allowNull: false
        // },
        question_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'question',
                key: 'question_id'
            }
        },
        question_answer_submission_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'question_answer_submission',
                key: 'submission_id'
            }
        },
        answer_score: {
            type: Sequelize.INTEGER
        }
    },
        {
            timestamps: false,
            initialAutoIncrement: 1
        }
    );

    Answer.removeAttribute('id');

    // Answer.associate = function (models) {}
    
    return Answer;
};