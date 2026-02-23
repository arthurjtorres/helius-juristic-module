import { Sequelize } from "sequelize";
import * as Config from '../config/DatabaseConfig';
import AgentModel from "./AgentModel";
import PenaltyInfoModel from "./PenaltyInfoModel";
import AnalysisModel from "./AnalysisModel";
import AppealModel from "./AppealModel";
import CTDOPModel from "./CTDOPModel";
import FineCodeModel from "./FineCodeModel";
import MotiveModel from "./MotiveModel";
import PenaltyDocModel from "./PenaltyDocModel";

const db = new Sequelize(Config);

const models = {
  AgentModel,
  AnalysisModel,
  AppealModel,
  CTDOPModel,
  FineCodeModel,
  MotiveModel,
  PenaltyDocModel,
  PenaltyInfoModel,  
};

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export {
  db as default,
  AgentModel,
  AnalysisModel,
  AppealModel,
  CTDOPModel,
  FineCodeModel,
  MotiveModel,
  PenaltyDocModel,
  PenaltyInfoModel,  
}