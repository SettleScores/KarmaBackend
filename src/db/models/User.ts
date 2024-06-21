import {
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  HasManyGetAssociationsMixin
} from 'sequelize';

import sequelize from '../postgreConnection';
import { Role } from './Role';

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  public declare id: CreationOptional<number>;
  public declare fullName: string | null;
  public declare email: string;
  public declare gender: string;
  public declare username: string;
  public declare password?: string;
  public declare createdAt: CreationOptional<Date>;
  public declare updatedAt: CreationOptional<Date>;
  public declare setRoles: BelongsToManySetAssociationsMixin<Role, number>;
  public declare getRoles: HasManyGetAssociationsMixin<Role>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    gender: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'users',
    sequelize,
  },
);
