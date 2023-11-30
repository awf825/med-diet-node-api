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

    return QuestionCategory;
};
