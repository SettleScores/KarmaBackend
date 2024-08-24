import {
    CreationOptional,
    DataTypes,
    EnumDataType,
    InferAttributes,
    InferCreationAttributes,
    Model,
  } from 'sequelize';

  import sequelize from '../postgreConnection';
  
  export enum TaskStatusType { /// TODO Use or RremoOve
    Huj = 'Хуй',
    Pizda = 'Пизда',
    Ggurda = 'Джигурда',
  }

  export class TaskStatus extends Model<
    InferAttributes<TaskStatus>,
    InferCreationAttributes<TaskStatus>
  > {
    public declare id: CreationOptional<number>;
    public declare userId: number;
    public declare taskId: number;
    public declare fileName: string;
    public declare status: 'Unknown' | 'Working' | 'Pending' | 'Done';
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
      status: {
        type: new DataTypes.ENUM('Unknown', 'Working', 'Pending', 'Done'),
        allowNull: false,
      },
    },
    {
      tableName: 'tasks_statuses',
      sequelize,
    },
  );