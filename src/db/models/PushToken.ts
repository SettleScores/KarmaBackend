import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../postgreConnection';

export class PushToken extends Model<
  InferAttributes<PushToken>,
  InferCreationAttributes<PushToken>
> {
  public declare id: CreationOptional<number>;
  public declare userId: number;
  public declare token: string;
}

PushToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: new DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
  },
  {
    tableName: 'push_tokens',
    sequelize,
  },
);