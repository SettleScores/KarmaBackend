import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../postgreConnection';
// import { User } from './User';

export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  public declare id: CreationOptional<number>;
  public declare name: string;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'roles',
    sequelize,
  },
);
