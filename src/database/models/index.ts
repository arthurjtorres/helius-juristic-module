import { Sequelize } from "sequelize";
import * as Config from '../config/DatabaseConfig';

export default new Sequelize(Config);

import AgentModel from "./AgentModel";
import PenaltyInfoModel from "./PenaltyInfoModel";
import AnalysisModel from "./AnalysisModel";
import AppealModel from "./AppealModel";
import CTDOPModel from "./CTDOPModel";
import FineCodeModel from "./FineCodeModel";
import MotiveModel from "./MotiveModel";
import PenaltyDocModel from "./PenaltyDocModel";

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
  AgentModel,
  AnalysisModel,
  AppealModel,
  CTDOPModel,
  FineCodeModel,
  MotiveModel,
  PenaltyDocModel,
  PenaltyInfoModel,  
}