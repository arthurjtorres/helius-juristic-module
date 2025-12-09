import { DataTypes, Model } from "sequelize";
import db from ".";
import PenaltyInfoModel from "./PenaltyInfoModel";
import sequelize from "sequelize";

class AnalysisModel extends Model {
  declare analysisId: string;
  declare fkPenaltyInfoId: string;
  declare fkEmployeeId?: string;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
  declare active: boolean;
}

AnalysisModel.init({
  analysisId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  fkPenaltyInfoId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'penalty_info',
      key: 'penalty_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  fkEmployeeId: {
    type: DataTypes.UUID,
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
  tableName: 'analysis',
  schema: 'juristic',
  timestamps: false,
  underscored: true,
});

export default AnalysisModel;

AnalysisModel.belongsTo(PenaltyInfoModel, {
  foreignKey: 'fkPenaltyInfoId'
});

PenaltyInfoModel.hasMany(AnalysisModel, {
  foreignKey: 'fkPenaltyInfoId'
});