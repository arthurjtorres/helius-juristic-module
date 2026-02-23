import { DataTypes, Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import PenaltyInfoModel from "./PenaltyInfoModel";

class AgentModel extends Model {
  declare agentId: string;
  declare agentCode: string;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
  declare activated: boolean;

  static associate(models: any) {
  this.hasMany(models.PenaltyInfoModel, {
    foreignKey: 'fkAgentId',
  sourceKey: 'agentId',
  as: 'PenaltyInfo'
  });
}
}

AgentModel.init({
  agentId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  agentCode: {
    type: sequelize.STRING,
    allowNull: false,
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
    allowNull: true,
    type: sequelize.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedBy: {
    allowNull: true,
    type: DataTypes.UUID,
  },
  activated: {
    allowNull: false,
    type: sequelize.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize: db,
  tableName: 'agent',
  schema: 'juristic',
  timestamps: false,
  underscored: true
});

export default AgentModel;