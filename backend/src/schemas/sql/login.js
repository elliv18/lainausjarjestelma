module.export = (sequelize, DataTypes) => {
  const login = sequelize.define('Login', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  /* login.associate = (models) => {
    login.belongsTo(models.Users, {
      foreingKey: 'userId',
      onDelete: 'CASCADE'
    });
  }; */

  return login;
};
