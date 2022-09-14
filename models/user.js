import { DataTypes, Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(40),
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        provider: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        schema: "Omuk",
        tableName: "users",
        modelName: "User",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
}

export default User;
