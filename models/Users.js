module.exports = (sequelize, DataTypes) =>{

    const Users = sequelize.define("Users", {
       username:{
           type: DataTypes.STRING,
           allowNull: false,
           primaryKey: true,
       },
       password:{
        type: DataTypes.STRING,
        allowNull: false,
       },
    });

    Users.associate = (models) => {
        Users.hasMany(models.Likes, {
          onDelete: "cascade",
        });
        Users.hasMany(models.Posts, {
          onDelete: "cascade",
        });
      }; 


    return Users;
}