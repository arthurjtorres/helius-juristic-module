import { DataTypes, Model } from "sequelize";
import db from "./database";
import sequelize from "sequelize";
import { DocTypeEnum } from "./enums/DocTypeEnum";
import { PenaltyStatusEnum } from "./enums/PenaltyStatusEnum";

/**
 * Notificação ou auto de infração de um fato (`penalty_info`), numa CTDOP.
 * Únicos no banco: um documento de cada tipo por fato; (consórcio, tipo, número).
 * A FK `(fk_penalty_info_id, fk_corporation_id)` garante o mesmo consórcio do fato.
 */
class PenaltyDocModel extends Model {
  declare penaltyDocId: string;
  declare penaltyDocType: DocTypeEnum;
  declare penaltyDocNumber: string;
  declare fkCtdopId: string;
  declare fkPenaltyInfoId: string;
  declare fkCorporationId: string;
  declare penaltyDocStatus: PenaltyStatusEnum;
  declare penaltyDocAnnotation: string | null;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
  declare activated: boolean;
}

PenaltyDocModel.init({
  penaltyDocId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  //Usa o enum DocType para definir se é auto ou notificação
  penaltyDocType: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [[...Object.values(DocTypeEnum)]],
    },
  },
  // Número da notificação crua 321
  penaltyDocNumber: {
    type: sequelize.STRING,
    allowNull: false,
  },
  fkCtdopId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'ctdop',
      key: 'ctdop_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  // FK composta (fk_penalty_info_id, fk_corporation_id) no banco; aqui só a coluna
  fkPenaltyInfoId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  fkCorporationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  penaltyDocStatus: {
    type: sequelize.STRING,
    allowNull: false,
    defaultValue: PenaltyStatusEnum.EM_ANALISE,
    validate: {
      isIn: [[...Object.values(PenaltyStatusEnum)]],
    },
  },
  penaltyDocAnnotation: {
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
  tableName: 'penalty_doc',
  schema: 'juristic',
  timestamps: false,
  underscored: true
});

export default PenaltyDocModel;