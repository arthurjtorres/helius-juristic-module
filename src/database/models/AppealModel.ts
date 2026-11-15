import { DataTypes, Model } from "sequelize";
import db from "./database";
import sequelize from "sequelize";
import { AppealResponseEnum } from "./enums/AppealResponseEnum";

/**
 * Recurso de um documento de penalidade, dentro de um protocolo. Um recurso por documento.
 * A resposta exige a CTDOP de resposta, cuja data de chegada é a data da resposta.
 */
class AppealModel extends Model {
  declare appealId: string;
  declare fkProtocolId: string;
  declare fkPenaltyDocId: string;
  declare response: AppealResponseEnum | null;
  declare fkResponseCtdopId: string | null;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
  declare activated: boolean;
}

AppealModel.init({
  appealId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  fkProtocolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'protocol',
      key: 'protocol_id'
    }
  },
  fkPenaltyDocId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'penalty_doc',
      key: 'penalty_doc_id'
    }
  },
  response: {
    type: sequelize.STRING,
    allowNull: true,
    validate: {
      isIn: [[...Object.values(AppealResponseEnum)]],
    },
  },
  fkResponseCtdopId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'ctdop',
      key: 'ctdop_id'
    }
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
  tableName: "appeal",
  schema: "juristic",
  timestamps: false,
  underscored: true
});

export default AppealModel;
