module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING
        },
        username: {
          type: Sequelize.STRING
        }
      }, 
      {
        timestamps: false
      }
    );
  
    return User;
  };
  