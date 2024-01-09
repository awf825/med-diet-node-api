const Question = require("./question.model.js")

module.exports = (sequelize, Sequelize) => {
    const FieldType = sequelize.define("question_field_type", {
        field_type_id: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        field_name: {
            type: Sequelize.STRING
        },
    },
        {
            timestamps: false
        }
    );

    FieldType.associate = (models) => {
        FieldType.belongsTo(models.question, {
            as: "question",
            foreignKey: "field_type_id"
        });

        FieldType.hasMany(models.question_answer_options, { 
            as: "question_answer_options",
            foreignKey: "field_type_id"
        });
    }

    return FieldType;
};
