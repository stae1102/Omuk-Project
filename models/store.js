import { DataTypes, Model } from "Sequelize";

class Store extends Model {
  static init(sequelize) {
    return super.init(
      {
        category: {
          type: DataTypes.STRING(7),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(40),
          allowNull: false,
        },
        url: {
          type: DataTypes.STRING(60),
          allowNull: true,
        },
        ages: {
          type: DataTypes.SMALLINT,
          allowNull: true,
        },
        likes: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        paranoid: true,
        schema: "Omuk",
        tableName: "stores",
        modelName: "Store",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
}

export default Store;
