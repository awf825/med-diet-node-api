module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("question", {
        question_id: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        question_text: {
            type: Sequelize.STRING
        },
        field_type: {
            type: Sequelize.STRING,
        },
        field_code: {
            type: Sequelize.STRING
        },
        category_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'question_category',
                key: 'category_id'
            }
        }
    },
        {
            timestamps: false
        }
    );

    // Question.associate = (models) => {
    //     Question.hasOne(models.question_category)
    // }

    // Question.addScope('withFieldTypesAndCategories', {
    //     include: [
    //         { model: models.question_field_type },
    //         { model: models.question_category }
    //     ]
    // });

    
    return Question;
};
