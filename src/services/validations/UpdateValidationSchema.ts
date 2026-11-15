import joi from "joi";
import Validation from "./CreateValidationSchema";

const updateAudit = {
  updatedAt: joi.date().required(),
  updatedBy: joi.string().required(),
};

/** Mesmo schema da criação com todos os campos opcionais, sem os de criação e com os de atualização. */
const toUpdate = (schema: joi.ObjectSchema, omit: string[] = []) => {
  const keys = Object.keys(schema.describe().keys).filter(k => !['createdAt', 'createdBy', ...omit].includes(k));
  return schema
    .fork(keys, (s) => s.optional())
    .fork(['createdAt', 'createdBy', ...omit], (s) => s.forbidden())
    .keys(updateAudit);
};

const UpdateAgentValidation = toUpdate(Validation.AgentValidation);
const UpdateAnalysisValidation = toUpdate(Validation.AnalysisValidation);
const UpdateCTDOPValidation = toUpdate(Validation.CTDOPValidation);
const UpdateFineCodeValidation = toUpdate(Validation.FineCodeValidation);
const UpdateMotiveValidation = toUpdate(Validation.MotiveValidation);
const UpdateProtocolValidation = toUpdate(Validation.ProtocolValidation);
const UpdatePenaltyInfoValidation = toUpdate(Validation.PenaltyInfoValidation);

/** Tipo e fato do documento não mudam: para isso, desative e cadastre outro. */
const UpdatePenaltyDocValidation = toUpdate(Validation.PenaltyDocValidation, ['penaltyDocType', 'fkPenaltyInfoId']);

/** O documento do recurso não muda; protocolo e resposta sim. */
const UpdateAppealValidation = toUpdate(Validation.AppealValidation, ['fkPenaltyDocId']);

export = {
  UpdateAgentValidation,
  UpdateAnalysisValidation,
  UpdateAppealValidation,
  UpdateCTDOPValidation,
  UpdateFineCodeValidation,
  UpdateMotiveValidation,
  UpdateProtocolValidation,
  UpdatePenaltyDocValidation,
  UpdatePenaltyInfoValidation,
}
