import { DataTypes, Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";

class AgentModel extends Model {
  declare agentId: string;
  declare agentCode: string;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
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
    allowNull: false,
    type: sequelize.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedBy: {
    allowNull: false,
    type: DataTypes.UUID,
  },
}, {
  sequelize: db,
  tableName: 'agent',
  schema: 'juristic',
  timestamps: false,
  underscored: true
});

export default AgentModel;