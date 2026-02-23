import { DataTypes, Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import PenaltyInfoModel from "./PenaltyInfoModel";

class MotiveModel extends Model {
  declare motiveId: string;
  declare motiveName: string;
  declare motiveCode: string;

  declare createdAt: Date;
  declare createdBy: string;
  declare updatedAt: Date;
  declare updatedBy: string;
  declare activated: boolean;

  static associate(models: any) {
    this.hasMany(models.PenaltyInfoModel, {
      foreignKey: 'fkMotiveId',
      sourceKey: 'motiveId',
      as: 'PenaltyInfo'
    });
  }
}

MotiveModel.init({
  motiveId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  motiveName: {
    type: sequelize.STRING,
    allowNull: false,
  },
  motiveCode: {
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
  tableName: 'motive',
  schema: 'juristic',
  timestamps: false,
  underscored: true
});

export default MotiveModel;