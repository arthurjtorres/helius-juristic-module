import { DataTypes, Model } from "sequelize";
import db from "./database";
import sequelize from "sequelize";
import { CtdopTypeEnum } from "./enums/CtdopTypeEnum";

/** Carta do órgão regulador: notificações, autos de infração ou resposta de recurso. */
class CTDOPModel extends Model {
  declare ctdopId: string;
  /** Nulo até o número chegar por e-mail; a carta é identificada por decêndio, mês e ano. */
  declare ctdopNumber: string | null;
  declare receiveDate: string | null;
  declare docType: CtdopTypeEnum;
  /** Prazo de resposta (antes `response_date`). */
  declare responseDeadline: string | null;
  declare refMonth: number | null;
  declare period: number | null;
  declare refYear: number | null;

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
    allowNull: true,
    unique: true
  },
  receiveDate: {
    type: sequelize.DATEONLY
  },
  docType: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [[...Object.values(CtdopTypeEnum)]],
    },
  },
  responseDeadline: {
    type: sequelize.DATEONLY
  },
  refMonth: {
    type: sequelize.SMALLINT,
    allowNull: true
  },
  period: {
    type: sequelize.SMALLINT,
    allowNull: true
  },
  refYear: {
    type: sequelize.SMALLINT,
    allowNull: true
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

export default CTDOPModel;