import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
  } from 'sequelize';
  
  import sequelize from '../postgreConnection';
  // import { User } from './User';
  
  export class Rank extends Model<
    InferAttributes<Rank>,
    InferCreationAttributes<Rank>
  > {
    public declare id: CreationOptional<number>;
    public declare name: string;
    public declare points: number;
  }
  
  Rank.init(
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
      points: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'ranks',
      sequelize,
    },
  );