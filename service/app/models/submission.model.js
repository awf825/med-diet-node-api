module.exports = (sequelize, Sequelize) => {
    const Submission = sequelize.define("question_answer_submission", {
        submission_id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
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
    
    return Submission;
};
