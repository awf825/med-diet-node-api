module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("question", {
        question_id: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        question_text: {
            type: Sequelize.STRING
        },
        field_type_id: {
            type: Sequelize.INTEGER,
        },
        field_code: {
            type: Sequelize.STRING,
        },
        form_id: {
            type: Sequelize.INTEGER,
        }
    },
        {
            timestamps: false
        }
    );

    Question.associate = (models) => {
        Question.hasOne(models.question_field_type, {
            as: "question_field_type",
            sourceKey: "field_type_id",
            foreignKey: "field_type_id"
        })

        Question.addScope('withFieldTypeAndAnswerOptions', {
            include: [
                { 
                    model: models.question_field_type,
                    as: "question_field_type",
                    required: true,
                    include: [
                        {
                            model: models.question_answer_options,
                            as: "question_answer_options"
                        }
                    ]
                },
            ]
        });
    }


    
    return Question;
};
