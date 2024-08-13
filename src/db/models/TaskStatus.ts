import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
  } from 'sequelize';

  import sequelize from '../postgreConnection';
  
  export class TaskStatus extends Model<
    InferAttributes<TaskStatus>,
    InferCreationAttributes<TaskStatus>
  > {
    public declare id: CreationOptional<number>;
    public declare userId: number;
    public declare taskId: number;
    public declare fileName: string;
    public declare status: string;
  }
  
  TaskStatus.init(
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
      taskId: {
        type: new DataTypes.INTEGER,
        allowNull: false,
      },
      fileName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      status: { /// TODO Later use predicated values, analogical to Roles
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      tableName: 'tasks_statuses',
      sequelize,
    },
  );