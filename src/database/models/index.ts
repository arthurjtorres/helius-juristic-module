import db from "./database";
import { setupAssociations } from "./associations";

import AgentModel from "./AgentModel";
import PenaltyInfoModel from "./PenaltyInfoModel";
import AnalysisModel from "./AnalysisModel";
import AppealModel from "./AppealModel";
import CTDOPModel from "./CTDOPModel";
import FineCodeModel from "./FineCodeModel";
import MotiveModel from "./MotiveModel";
import PenaltyDocModel from "./PenaltyDocModel";

setupAssociations();

export default db;
export {
  AgentModel,
  PenaltyInfoModel,
  AnalysisModel,
  AppealModel,
  CTDOPModel,
  FineCodeModel,
  MotiveModel,
  PenaltyDocModel
};