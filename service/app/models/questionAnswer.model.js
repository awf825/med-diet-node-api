module.exports = (sequelize, Sequelize) => {
    const Answer = sequelize.define("question_answers", {
        answer_id: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        question_id: {
            type: Sequelize.INTEGER
        },
        question_answer_submission_id: {
            type: Sequelize.INTEGER,
        },
        answer_score: {
            type: Sequelize.INTEGER
        }
    },
        {
            timestamps: false
        }
    );
    
    return Answer;
};