module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        user_id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        email: {
          type: Sequelize.STRING
        },
        first_name: {
          type: Sequelize.STRING
        },
        last_name: {
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
        },
        google_user_id: {
          type: Sequelize.INTEGER
        },
        google_profile_picture_url: {
          type: Sequelize.STRING
        },
        do_not_use: {
          type: Sequelize.INTEGER
        },
        ffq_complete: {
          type: Sequelize.INTEGER
        },
        gender: {
          type: Sequelize.STRING
        },
        dob: {
          type: Sequelize.DATE
        },
        origin: {
          type: Sequelize.STRING
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
  