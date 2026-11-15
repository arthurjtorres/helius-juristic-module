import joi from "joi";
import { DocTypeEnum } from "../../database/models/enums/DocTypeEnum";
import { CtdopTypeEnum } from "../../database/models/enums/CtdopTypeEnum";
import { PenaltyStatusEnum } from "../../database/models/enums/PenaltyStatusEnum";
import { AppealResponseEnum } from "../../database/models/enums/AppealResponseEnum";

const audit = {
  createdAt: joi.date().required(),
  createdBy: joi.string().required(),
};

const optionalUuid = () => joi.string().uuid().optional().allow(null);
const optionalText = () => joi.string().optional().allow(null, '');

const AgentValidation = joi.object({
  agentCode: joi.string().required(),
  ...audit,
});

/** `fineNumber` é opcional: sem ele, o banco gera o próximo da sequência (como na planilha). */
const FineCodeValidation = joi.object({
  fineDescription: joi.string().required(),
  fineNumber: joi.string().optional(),
  fineKm: joi.number().integer().min(0).required(),
  fineAlias: joi.string().allow(null, '').empty('').optional(),
  fineOrder: optionalText(),
  ...audit,
});

const MotiveValidation = joi.object({
  motiveName: joi.string().required(),
  motiveCode: joi.string().optional(),
  ...audit,
});

/** Decêndio, mês e ano são obrigatórios exceto na carta de resposta; o service confere a combinação. */
const ctdopFields = {
  ctdopNumber: optionalText(),
  receiveDate: joi.date().optional().allow(null),
  docType: joi.string().valid(...Object.values(CtdopTypeEnum)).required(),
  responseDeadline: joi.date().optional().allow(null),
  refMonth: joi.number().integer().min(1).max(12).optional().allow(null),
  period: joi.number().integer().min(1).max(3).optional().allow(null),
  refYear: joi.number().integer().min(2000).max(2100).optional().allow(null),
};
const CTDOPValidation = joi.object({ ...ctdopFields, ...audit });

const ProtocolValidation = joi.object({
  protocolNumber: joi.string().required(),
  protocolDate: joi.date().required(),
  protocolType: joi.string().valid(...Object.values(DocTypeEnum)).required(),
  ...audit,
});

const appealResponseFields = {
  response: joi.string().valid(...Object.values(AppealResponseEnum)).optional().allow(null),
  fkResponseCtdopId: optionalUuid(),
};
const AppealValidation = joi.object({
  fkProtocolId: joi.string().uuid().required(),
  fkPenaltyDocId: joi.string().uuid().required(),
  ...appealResponseFields,
  ...audit,
});

/** Campos do fato. O consórcio não vem do cliente: é obtido da empresa no `registry`. */
const penaltyInfoFields = {
  fkCompanyId: joi.string().uuid().required(),
  fkVehicleId: optionalUuid(),
  fkBusTimetableId: optionalUuid(),
  date: joi.date().required(),
  time: joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/).required(),
  fkAgentId: optionalUuid(),
  fkFineCodeId: optionalUuid(),
  fkLocationId: optionalUuid(),
  agentAnnotation: optionalText(),
  fkMotiveId: optionalUuid(),
  internalAnnotation: optionalText(),
};

const penaltyDocFields = {
  penaltyDocType: joi.string().valid(...Object.values(DocTypeEnum)).required(),
  penaltyDocNumber: joi.string().required(),
  fkCtdopId: joi.string().uuid().required(),
  penaltyDocStatus: joi.string().valid(...Object.values(PenaltyStatusEnum)).optional(),
  penaltyDocAnnotation: optionalText(),
};

const PenaltyInfoValidation = joi.object({ ...penaltyInfoFields, ...audit });

/** Criação da penalidade: o fato com o seu primeiro documento (normalmente a notificação). */
const PenaltyCreateValidation = joi.object({
  ...penaltyInfoFields,
  doc: joi.object(penaltyDocFields).required(),
  ...audit,
});

/** Documento avulso num fato existente (ex.: o auto que chega depois da notificação). */
const PenaltyDocValidation = joi.object({
  ...penaltyDocFields,
  fkPenaltyInfoId: joi.string().uuid().required(),
  ...audit,
});

const AnalysisValidation = joi.object({
  fkPenaltyInfoId: joi.string().uuid().required(),
  fkEmployeeId: joi.string().uuid().optional().allow(null),
  ...audit,
});

export = {
  AgentValidation,
  FineCodeValidation,
  MotiveValidation,
  CTDOPValidation,
  ProtocolValidation,
  AppealValidation,
  PenaltyInfoValidation,
  PenaltyCreateValidation,
  PenaltyDocValidation,
  AnalysisValidation,
  fields: { ctdopFields, appealResponseFields, penaltyDocFields },
};
