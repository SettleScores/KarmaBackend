import { Sequelize } from 'sequelize';
import EnvVars from '@src/constants/EnvVars';


const username = EnvVars.Postgresql.Username;
const password = EnvVars.Postgresql.Password;
const dbserver = EnvVars.Postgresql.Dbserver;
const database = EnvVars.Postgresql.Database;

const sequelize = new Sequelize(`postgres://${username}:${password}@${dbserver}/${database}`);

export default sequelize;
