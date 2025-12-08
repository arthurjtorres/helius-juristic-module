import { DataTypes, Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";

class FineCodeModel extends Model {
  declare fineCodeId: string;
  declare fineDescription: string;
  declare fineKm: string;
  declare fineAlias: string;
  declare fineOrder: string;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
}

FineCodeModel.init({
  fineCodeId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
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
    allowNull: false,
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
    allowNull: false,
    type: sequelize.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedBy: {
    allowNull: false,
    type: DataTypes.UUID,
  },
},
{
  sequelize: db,
  tableName: 'fine_code',
  schema: 'juristic',
  timestamps: false,
  underscored: true
});

export default FineCodeModel;