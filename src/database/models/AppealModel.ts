import { DataTypes, Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import { DocTypeEnum } from "./enums/DocTypeEnum";

class AppealModel extends Model {
  declare appealId: string;
  declare appealType: DocTypeEnum;
  declare protocolNumber: string;
  declare protocolDate: string;
  declare response?: string;
  declare responseDate?: string;
  declare responseCtdop?: string;
  declare fkPenaltyDocId: string;

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
  appealType: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [[...Object.values(DocTypeEnum)]],
    },
  },
  protocolNumber: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true
  },
  protocolDate: {
    type: sequelize.DATEONLY,
    allowNull: false
  },
  response: {
    type: sequelize.STRING
  },
  responseDate: {
    type: sequelize.STRING
  },
  responseCtdop: {
    type: sequelize.STRING
  },
  fkPenaltyDocId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'penalty_doc',
      key: 'penalty_doc_id'
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
