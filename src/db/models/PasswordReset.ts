import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../postgreConnection';

export class PasswordReset extends Model<
  InferAttributes<PasswordReset>,
  InferCreationAttributes<PasswordReset>
> {
  declare id: CreationOptional<number>;

  declare userId: number;

  declare codeHash: string;

  declare expiresAt: Date;

  declare usedAt: CreationOptional<Date | null>;

  declare createdAt: CreationOptional<Date>;
}

PasswordReset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },

    codeHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'code_hash',
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },

    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'used_at',
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
  },
  {
    tableName: 'password_resets',
    sequelize,
    updatedAt: false, /// force not to add updatedAt field
  },
);