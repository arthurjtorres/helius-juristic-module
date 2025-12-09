import { DataTypes, Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";

class MotiveModel extends Model {
  declare motiveId: string;
  declare motiveName: string;
  declare motiveCode: string;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
  declare active: boolean;
}

MotiveModel.init({
  motiveId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  motiveName: {
    type: sequelize.STRING,
    allowNull: false,
  },
  motiveCode: {
    type: sequelize.STRING,
    allowNull: true,
  },

  createdAt: {
    allowNull: false,
    type: sequelize.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  createdBy: {
    allowNull: false,
    type: DataTypes.UUID,

  },
  updatedAt: {
    allowNull: false,
    type: sequelize.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedBy: {
    allowNull: false,
    type: DataTypes.UUID,
  },
  active: {
    allownull: false,
    type: sequelize.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize: db,
  tableName: 'motive',
  schema: 'juristic',
  timestamps: false,
  underscored: true
});

export default MotiveModel;