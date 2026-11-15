import { DataTypes, Model } from "sequelize";
import db from "./database";
import sequelize from "sequelize";

/**
 * O fato da penalidade (veículo, data, hora, agente, local). Notificação e auto do mesmo fato
 * ficam em `penalty_doc`. Empresa, consórcio, veículo, linha e local são referências a outros
 * módulos, sem FK no banco.
 */
class PenaltyInfoModel extends Model {
  declare penaltyInfoId: string;
  declare fkCompanyId: string;
  /** Consórcio da empresa (`registry.corporation`), gravado a partir do `registry`. */
  declare fkCorporationId: string;
  declare fkVehicleId: string | null;
  declare fkBusTimetableId: string | null;
  declare date: string;
  declare time: string;
  declare fkAgentId: string | null;
  declare fkFineCodeId: string | null;
  declare fkLocationId: string | null;
  declare agentAnnotation: string | null;
  declare fkMotiveId: string | null;
  declare internalAnnotation: string | null;

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
  fkCorporationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  fkVehicleId: {
    type: DataTypes.UUID,
    allowNull: true,

  },
  fkBusTimetableId: {
    type: DataTypes.UUID,
    allowNull: true,
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
    allowNull: true,
    references: {
      model: 'agent',
      key: 'agent_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  fkFineCodeId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'fine_code',
      key: 'fine_code_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  fkLocationId: {
    type: DataTypes.UUID,
    allowNull: true,

  },
  agentAnnotation: {
    type: sequelize.STRING,
    allowNull: true,
  },
  fkMotiveId: {
    type: DataTypes.UUID,
    allowNull: true,
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
  tableName: 'penalty_info',
  schema: 'juristic',
  timestamps: false,
  underscored: true
});

export default PenaltyInfoModel;