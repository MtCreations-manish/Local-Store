import bcrypt from "bcryptjs";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class User extends Model {
  async comparePassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    resetToken: DataTypes.STRING,
    resetTokenExpiresAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    indexes: [{ unique: true, fields: ["email"] }],
    hooks: {
      beforeCreate: async (user) => {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
      },
      beforeUpdate: async (user) => {
        if (user.changed("passwordHash")) user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
      }
    }
  }
);
