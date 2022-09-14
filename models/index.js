import Sequelize from "sequelize";
import User from "./user.js";
import Store from "./store.js";

import _config from "../config/config.js";
const env = process.env.NODE_ENV || "development";
const config = _config[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User;
db.Store = Store;

User.init(sequelize);
Store.init(sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
