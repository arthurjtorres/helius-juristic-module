import { DataTypes, Model } from "sequelize";
import db from "./database";
import sequelize from "sequelize";
import { DocTypeEnum } from "./enums/DocTypeEnum";

/** Protocolo de recurso junto ao órgão. Reúne um ou mais recursos, sempre do mesmo tipo de documento. */
class ProtocolModel extends Model {
  declare protocolId: string;
  declare protocolNumber: string;
  declare protocolDate: string;
  declare protocolType: DocTypeEnum;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
  declare activated: boolean;
}

ProtocolModel.init({
  protocolId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
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
  protocolType: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [[...Object.values(DocTypeEnum)]],
    },
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
  tableName: "protocol",
  schema: "juristic",
  timestamps: false,
  underscored: true
});

export default ProtocolModel;
