import { Sequelize } from 'sequelize';
import EnvVars from '@src/constants/EnvVars';

//TODO move to process.env variables
const username = EnvVars.Postgresql.Username;
const password = EnvVars.Postgresql.Password;
const dbserver = EnvVars.Postgresql.Dbserver;
const database = EnvVars.Postgresql.Database;

console.log("qqq postgreConnection username: " + username);
console.log("qqq postgreConnection password: " + password);
console.log("qqq postgreConnection dbserver: " + dbserver);
console.log("qqq postgreConnection database: " + database);

const sequelize = new Sequelize(`postgres://${username}:${password}@${dbserver}/${database}`);

export default sequelize;
