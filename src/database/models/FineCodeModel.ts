import { DataTypes, Model } from "sequelize";
import db from "./database";
import sequelize from "sequelize";

class FineCodeModel extends Model {
  declare fineCodeId: string;
  declare fineNumber: string;
  declare fineDescription: string;
  declare fineKm: string;
  declare fineAlias: string;
  declare fineOrder: string;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
  declare activated: boolean;
}

FineCodeModel.init({
  fineCodeId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  fineNumber: {
    type: sequelize.STRING,
    allowNull: false,
    defaultValue: sequelize.literal("nextval('juristic.fine_number_seq')::text"),
  },
  fineDescription: {
    type: sequelize.TEXT,
    allowNull: false,
  },
  fineKm: {
    type: sequelize.STRING,
    allowNull: false,
  },
  fineAlias: {
    type: sequelize.STRING,
    allowNull: true,
  },
  fineOrder: {
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
  tableName: 'fine_code',
  schema: 'juristic',
  timestamps: false,
  underscored: true
});

export default FineCodeModel;