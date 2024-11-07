module.exports = (db, DataTypes) => {
    return db.define('Message', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER },
      data: { type: DataTypes.JSON },
      timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
};