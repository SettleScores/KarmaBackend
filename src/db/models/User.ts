import {
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin
} from 'sequelize';

import sequelize from '../postgreConnection';
import { Role } from './Role';
import { TaskStatus } from './TaskStatus';

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
  public declare rankId: number;
  public declare createdAt: CreationOptional<Date>;
  public declare updatedAt: CreationOptional<Date>;
  public declare setRoles: BelongsToManySetAssociationsMixin<Role, number>;
  public declare getRoles: HasManyGetAssociationsMixin<Role>;

  // Task associations
  public declare getTasks: HasManyGetAssociationsMixin<TaskStatus>;
  public declare createTask: HasManyCreateAssociationMixin<TaskStatus>;
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
    rankId: {
      type: DataTypes.INTEGER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'users',
    sequelize,
  },
);
