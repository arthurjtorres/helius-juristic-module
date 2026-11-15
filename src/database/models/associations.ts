import AgentModel from "./AgentModel";
import PenaltyInfoModel from "./PenaltyInfoModel";
import AnalysisModel from "./AnalysisModel";
import AppealModel from "./AppealModel";
import CTDOPModel from "./CTDOPModel";
import FineCodeModel from "./FineCodeModel";
import MotiveModel from "./MotiveModel";
import PenaltyDocModel from "./PenaltyDocModel";
import ProtocolModel from "./ProtocolModel";


export const setupAssociations = () => {
  
  // AgentModel
AgentModel.hasMany(PenaltyInfoModel, {
  foreignKey: 'fkAgentId',
  sourceKey: 'agentId',
  as: 'PenaltyInfo'
});

// AnalysisModel
AnalysisModel.belongsTo(PenaltyInfoModel, {
  foreignKey: 'fkPenaltyInfoId',
  targetKey: 'penaltyInfoId',
  as: 'PenaltyInfo'
});

// AppealModel
AppealModel.belongsTo(PenaltyDocModel, {
  foreignKey: 'fkPenaltyDocId',
  targetKey: 'penaltyDocId',
  as: 'PenaltyDoc'
});

AppealModel.belongsTo(ProtocolModel, {
  foreignKey: 'fkProtocolId',
  targetKey: 'protocolId',
  as: 'Protocol'
});

AppealModel.belongsTo(CTDOPModel, {
  foreignKey: 'fkResponseCtdopId',
  targetKey: 'ctdopId',
  as: 'ResponseCTDOP'
});

// ProtocolModel
ProtocolModel.hasMany(AppealModel, {
  foreignKey: 'fkProtocolId',
  sourceKey: 'protocolId',
  as: 'Appeals'
});

// CTDOPModel
CTDOPModel.hasMany(PenaltyDocModel, {
  foreignKey: 'fkCtdopId',
  sourceKey: 'ctdopId',
  as: 'PenaltyDoc'
});

CTDOPModel.hasMany(AppealModel, {
  foreignKey: 'fkResponseCtdopId',
  sourceKey: 'ctdopId',
  as: 'ResponseAppeals'
});

// FineCodeModel
FineCodeModel.hasMany(PenaltyInfoModel, {
  foreignKey: 'fkFineCodeId',
  sourceKey: 'fineCodeId',
  as: 'PenaltyInfo'
});

// MotiveModel
MotiveModel.hasMany(PenaltyInfoModel, {
  foreignKey: 'fkMotiveId',
  sourceKey: 'motiveId',
  as: 'PenaltyInfo'
});

// PenaltyDocModel
PenaltyDocModel.hasOne(AppealModel, {
  foreignKey: 'fkPenaltyDocId',
  sourceKey: 'penaltyDocId',
  as: 'Appeal'
});

PenaltyDocModel.belongsTo(PenaltyInfoModel, {
  foreignKey: 'fkPenaltyInfoId',
  targetKey: 'penaltyInfoId',
  as: 'PenaltyInfo'
});

PenaltyDocModel.belongsTo(CTDOPModel, {
  foreignKey: 'fkCtdopId',
  targetKey: 'ctdopId',
  as: 'CTDOP'
});


// PenaltyInfoModel: um fato tem notificação e, depois, o auto (no máximo um de cada tipo)
PenaltyInfoModel.hasMany(PenaltyDocModel, {
  foreignKey: 'fkPenaltyInfoId',
  sourceKey: 'penaltyInfoId',
  as: 'PenaltyDocs'
});

PenaltyInfoModel.belongsTo(AgentModel, {
  foreignKey: 'fkAgentId',
  targetKey: 'agentId',
  as: 'Agent',
});

PenaltyInfoModel.belongsTo(FineCodeModel, {
  foreignKey: 'fkFineCodeId',
  targetKey: 'fineCodeId',
  as: 'FineCode'
});

PenaltyInfoModel.belongsTo(MotiveModel, {
  foreignKey: 'fkMotiveId',
  targetKey: 'motiveId',
  as: 'Motive',
});

PenaltyInfoModel.hasMany(AnalysisModel, {
  foreignKey: 'fkPenaltyInfoId',
  sourceKey: 'penaltyInfoId',
  as: 'Analysis'
});

console.log("✅ Associações configuradas com sucesso.");
};