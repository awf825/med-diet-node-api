'use strict'
module.exports = (sequelize, Sequelize) => {
    const Submission = sequelize.define("question_answer_submission", {
        submission_id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        score: {
            type: Sequelize.INTEGER
        },
        completed_at: {
            type: Sequelize.DATE,
        },
        created: {
            type: Sequelize.DATE
        }
    },
        {
            timestamps: false
        }
    );

    Submission.associate = function (models) {
        Submission.hasMany(models.question_answers, {
            as: "question_answers",
            foreignKey: "question_answer_submission_id"
        })
        
        Submission.addScope('withAnswers', {
            include: [
                { 
                    model: models.question_answers,
                    as: 'question_answers'
                }
            ]
        });
    }


    return Submission;
};
