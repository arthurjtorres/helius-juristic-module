import joi from "joi";
import { DocTypeEnum } from "../../database/models/enums/DocTypeEnum";
import { PenaltyStatusEnum } from "../../database/models/enums/PenaltyStatusEnum";

const AgentValidation = joi.object({
  agentCode: joi.string().required(),

  createdAt: joi.date().required(),
  createdBy: joi.string().required(),
});

const FineCodeValidation = joi.object({
  fineDescription: joi.string().required(),
  fineNumber: joi.string().optional(),
  fineKm: joi.string().required(),
  fineAlias: joi.string().allow(null, '').empty('').optional(),
  fineOrder: joi.string().required(),

  createdAt: joi.date().required(),
  createdBy: joi.string().required(),
});

const MotiveValidation = joi.object({
  motiveName: joi.string().required(),
  motiveCode: joi.string().optional(),

  createdAt: joi.date().required(),
  createdBy: joi.string().required(),
});

const CTDOPValidation = joi.object({
  ctdopNumber: joi.string().required(),
  receiveDate: joi.date().optional().allow(null),
  docType: joi.string().valid(...Object.values(DocTypeEnum)).required(),
  responseDate: joi.date().optional().allow(null),
  refMonth: joi.string().required(),
  period: joi.string().required(),
  refYear: joi.number().integer().required(),

  createdAt: joi.date().required(),
  createdBy: joi.string().required(),
});

const AppealValidation = joi.object({
  appealType: joi.string().valid(...Object.values(DocTypeEnum)).required(),
  protocolNumber: joi.string().required(),
  protocolDate: joi.date().required(),
  response: joi.string().optional().allow(null, ''),
  responseDate: joi.string().optional().allow(null, ''),
  responseCtdop: joi.string().optional().allow(null, ''),

  createdAt: joi.date().required(),
  createdBy: joi.string().required(),
});

const PenaltyInfoValidation = joi.object({
   fkCompanyId: joi.string().uuid().required(),
  fkVehicleId: joi.string().uuid().required(),
  fkBusTimetableId: joi.string().uuid().required(),
  date: joi.date().required(),
  time: joi.string().required(),
  fkAgentId: joi.string().uuid().required(),
  fkFineCodeId: joi.string().uuid().required(),
  fkLocationId: joi.string().uuid().required(),
  agentAnnotation: joi.string().optional().allow(null, ""),
  penaltyInfoStatus: joi.string().valid(...Object.values(PenaltyStatusEnum)).required(),
  fkMotiveId: joi.string().uuid().required(),
  internalAnnotation: joi.string().optional().allow(null, ""),

  createdAt: joi.date().required(),
  createdBy: joi.string().required(),
});

const PenaltyDocValidation = joi.object({
  penaltyDocType: joi.string().valid(...Object.values(DocTypeEnum)).required(),
  penaltyDocRegistration: joi.string().required(),
  penaltyDocNumber: joi.string().required(),
  fkCtdopId: joi.string().uuid().required(),
  fkPenaltyInfoId: joi.string().uuid().required(),

  createdAt: joi.date().required(),
  createdBy: joi.string().required(),
});

const AnalysisValidation = joi.object({
  fkPenaltyInfoId: joi.string().uuid().required(),
  fkEmployeeId: joi.string().uuid().optional().allow(null),

  createdAt: joi.date().required(),
  createdBy: joi.string().required(),
});

export = {
  AgentValidation,
  FineCodeValidation,
  MotiveValidation,
  CTDOPValidation,
  AppealValidation,
  PenaltyInfoValidation,
  PenaltyDocValidation,
  AnalysisValidation,
};