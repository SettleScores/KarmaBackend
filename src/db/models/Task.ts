import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
  } from 'sequelize';
  
  import sequelize from '../postgreConnection';
  
  export class Task extends Model<
    InferAttributes<Task>,
    InferCreationAttributes<Task>
  > {
    public declare id: CreationOptional<number>;
    public declare description: string;
  }
  
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      tableName: 'tasks',
      sequelize,
    },
  );