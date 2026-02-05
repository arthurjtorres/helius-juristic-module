import joi from "joi";
import Validation from "./CreateValidationSchema";

const UpdateAgentValidation = Validation.AgentValidation.fork(
  Object.keys(Validation.AgentValidation.describe().keys),
  (schema) => schema.optional()
).keys({
  updatedAt: joi.date().required(),
  updatedBy: joi.string().required(),
});

const UpdateAnalysisValidation = Validation.AnalysisValidation.fork(
  Object.keys(Validation.AnalysisValidation.describe().keys),
  (schema) => schema.optional()
).keys({
  updatedAt: joi.date().required(),
  updatedBy: joi.string().required(),
});

const UpdateAppealValidation = Validation.AppealValidation.fork(
  Object.keys(Validation.AppealValidation.describe().keys),
  (schema) => schema.optional()
).keys({
  updatedAt: joi.date().required(),
  updatedBy: joi.string().required(),
});

const UpdateCTDOPValidation = Validation.CTDOPValidation.fork(
  Object.keys(Validation.CTDOPValidation.describe().keys),
  (schema) => schema.optional()
).keys({
  updatedAt: joi.date().required(),
  updatedBy: joi.string().required(),
});

const UpdateFineCodeValidation = Validation.FineCodeValidation.fork(
  Object.keys(Validation.FineCodeValidation.describe().keys),
  (schema) => schema.optional()
).keys({
  updatedAt: joi.date().required(),
  updatedBy: joi.string().required(),
});

const UpdateMotiveValidation = Validation.MotiveValidation.fork(
  Object.keys(Validation.MotiveValidation.describe().keys),
  (schema) => schema.optional()
).keys({
  updatedAt: joi.date().required(),
  updatedBy: joi.string().required(),
});

const UpdatePenaltyDocValidation = Validation.PenaltyDocValidation.fork(
  Object.keys(Validation.PenaltyDocValidation.describe().keys),
  (schema) => schema.optional()
).keys({
  updatedAt: joi.date().required(),
  updatedBy: joi.string().required(),
});

const UpdatePenaltyInfoValidation = Validation.PenaltyInfoValidation.fork(
  Object.keys(Validation.PenaltyInfoValidation.describe().keys),
  (schema) => schema.optional()
).keys({
  updatedAt: joi.date().required(),
  updatedBy: joi.string().required(),
});

export = {
  UpdateAgentValidation,
  UpdateAnalysisValidation,
  UpdateAppealValidation,
  UpdateCTDOPValidation,
  UpdateFineCodeValidation,
  UpdateMotiveValidation,
  UpdatePenaltyDocValidation,
  UpdatePenaltyInfoValidation,
}