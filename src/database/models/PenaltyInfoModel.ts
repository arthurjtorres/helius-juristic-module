import { DataTypes, Model } from "sequelize";
import db from ".";
import { PenaltyStatusEnum } from "./enums/PenaltyStatusEnum";
import sequelize from "sequelize";
import AgentModel from "./AgentModel";
import FineCodeModel from "./FineCodeModel";
import MotiveModel from "./MotiveModel";
import PenaltyDocModel from "./PenaltyDocModel";
import AppealModel from "./AppealModel";

class PenaltyInfoModel extends Model {
  declare penaltyInfoId: string;
  declare fkCompanyId: string;
  declare fkVehicleId: string;
  declare fkBusTimetableId: string;
  declare date: string;
  declare time: string;
  declare fkAgentId: string;
  declare fkFineCodeId: string;
  declare fkLocationId: string;
  declare agentAnnotation?: string;
  declare penaltyInfoStatus: PenaltyStatusEnum;
  declare fkMotiveId: string;
  declare internalAnnotation?: string;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
  declare activated: boolean;
}

PenaltyInfoModel.init({
  penaltyInfoId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  fkCompanyId: {
    type: DataTypes.UUID,
    allowNull: false,

  },
  fkVehicleId: {
    type: DataTypes.UUID,
    allowNull: false,

  },
  fkBusTimetableId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: sequelize.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  fkAgentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'agent',
      key: 'agent_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  fkFineCodeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'fine_code',
      key: 'fine_code_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  fkLocationId: {
    type: DataTypes.UUID,
    allowNull: false,

  },
  agentAnnotation: {
    type: sequelize.STRING,
    allowNull: true,
  },
  penaltyInfoStatus: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [[...Object.values(PenaltyStatusEnum)]],
    }
  },
  fkMotiveId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'motive',
      key: 'motive_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  internalAnnotation: {
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
  activated: {
    allowNull: false,
    type: sequelize.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize: db,
  tableName: 'penalty_info',
  schema: 'juristic',
  timestamps: false,
  underscored: true
});


PenaltyInfoModel.belongsTo(AgentModel, {
  foreignKey: 'fkAgentId',
  as: 'agent',
});

AgentModel.hasMany(PenaltyInfoModel, {
  foreignKey: 'fkAgentId',
  as: 'agentLink',
});

PenaltyInfoModel.belongsTo(FineCodeModel, {
  foreignKey: 'fkFineCodeId',
  as: 'fineCode'
});

FineCodeModel.hasMany(PenaltyInfoModel, {
  foreignKey: 'fkFineCodeId',
  as: 'fineCodeLink'
});

PenaltyInfoModel.belongsTo(MotiveModel, {
  foreignKey: 'fkMotiveId',
  as: 'motive',
});

MotiveModel.hasMany(PenaltyInfoModel, {
  foreignKey: 'fkMotiveId',
  as: 'motiveLink',
});

PenaltyInfoModel.hasMany(PenaltyDocModel, {
  foreignKey: "fkPenaltyInfoId",
  as: "penaltyDocs",
});

PenaltyInfoModel.hasMany(AppealModel, {
  foreignKey: "fkPenaltyInfoId",
  as: "appeals",
});


export default PenaltyInfoModel;