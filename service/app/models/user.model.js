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
        }
      }, 
      {
        timestamps: false
      }
    );
  
    return User;
  };
  