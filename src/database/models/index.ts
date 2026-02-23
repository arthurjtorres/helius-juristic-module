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

const models: any = {
  AgentModel,
  AnalysisModel,
  AppealModel,
  CTDOPModel,
  FineCodeModel,
  MotiveModel,
  PenaltyDocModel,
  PenaltyInfoModel,  
};

Object.keys(models).forEach((modelName) => {
  // Verifica se o modelo foi importado corretamente e se tem o método associate
  if (models[modelName] && typeof models[modelName].associate === 'function') {
    models[modelName].associate(models);
  } else if (!models[modelName]) {
     // Isso aqui vai te ajudar no debug se algum modelo ainda estiver vindo undefined
     console.error(`Cuidado: O modelo ${modelName} está undefined no index.ts!`);
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