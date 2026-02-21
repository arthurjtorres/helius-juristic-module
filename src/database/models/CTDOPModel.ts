import { DataTypes, Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import { DocTypeEnum } from "./enums/DocTypeEnum";
import PenaltyDocModel from "./PenaltyDocModel";

class CTDOPModel extends Model {
  declare ctdopId: string;
  declare ctdopNumber: string;
  declare receiveDate?: string;
  declare docType: DocTypeEnum;
  declare responseDate?: string;
  declare refMonth: string;
  declare period: string;
  declare refYear: number;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
  declare activated: boolean;
}

CTDOPModel.init({
  ctdopId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  ctdopNumber: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true
  },
  receiveDate: {
    type: sequelize.DATEONLY
  },
  docType: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [[...Object.values(DocTypeEnum)]],
    },
  },
  responseDate: {
    type: sequelize.DATEONLY
  },
  refMonth: {
    type: sequelize.STRING,
    allowNull: false
  },
  period: {
    type: sequelize.STRING,
    allowNull: false
  },
  refYear: {
    type: sequelize.SMALLINT,
    allowNull: false
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
  tableName: "ctdop",
  schema: "juristic",
  timestamps: false,
  underscored: true
});

CTDOPModel.hasMany(PenaltyDocModel, {
  foreignKey: 'fkCtdopId',
  sourceKey: 'ctdopId',
  as: 'PenaltyDoc'
});

export default CTDOPModel;
