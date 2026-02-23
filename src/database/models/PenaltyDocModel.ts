import { DataTypes, Model } from "sequelize";
import db from "./database";
import sequelize from "sequelize";
import { DocTypeEnum } from "./enums/DocTypeEnum";

class PenaltyDocModel extends Model {
  declare penaltyDocId: string;
  declare penaltyDocType: DocTypeEnum;
  declare penaltyDocRegistration: string;
  declare penaltyDocNumber: string;
  declare fkCtdopId: string;
  declare fkPenaltyInfoId: string;

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
  // Identificação disponível para o usuário (Registro da notificação AS321 || parelelo a ID REF NOTIF)
  penaltyDocRegistration: {
    type: sequelize.STRING,
    allowNull: false,
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
  fkPenaltyInfoId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'penalty_info',
      key: 'penalty_info_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
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