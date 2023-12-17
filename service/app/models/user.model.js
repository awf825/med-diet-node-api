module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        user_id: {
          type: Sequelize.BIGINT,
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING
        },
        username: {
          type: Sequelize.STRING
        },
        password: {
          type: Sequelize.STRING
        },
        auth_method_id: {
          type: Sequelize.INTEGER
        },
        apple_user_id: {
          type: Sequelize.INTEGER
        }
      }, 
      {
        timestamps: false
      }
    );

    User.associate = function (models) {
      User.hasMany(models.question_answer_submission, {
        as: "question_answer_submissions",
        foreignKey: "user_id"
      })
    }
  
    return User;
  };
  