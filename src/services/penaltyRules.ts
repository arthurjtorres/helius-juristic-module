import { Op, Transaction, WhereAttributeHash } from "sequelize";
import { AgentModel, CTDOPModel, FineCodeModel, MotiveModel, PenaltyDocModel } from "../database/models";
import { DocTypeEnum } from "../database/models/enums/DocTypeEnum";
import Response from "../utils/Response";
import { uniqueConflict } from "../utils/conflict";

/** Regras compartilhadas pelo cadastro de penalidade (fato) e de documento. */

/**
 * Confere se a CTDOP existe, está ativa e é do mesmo tipo do documento.
 * @returns Resposta de erro, ou `null` se estiver tudo certo.
 */
export const checkCtdopForDoc = async (fkCtdopId: string, docType: DocTypeEnum, transaction?: Transaction) => {
  const ctdop = await CTDOPModel.findOne({ where: { ctdopId: fkCtdopId, activated: true }, transaction });
  if (!ctdop) return Response.badRequest("CTDOP não encontrada ou inativa.");
  if (ctdop.docType !== (docType as string)) {
    return Response.badRequest(`O documento (${docType}) precisa estar numa CTDOP do mesmo tipo (a CTDOP é ${ctdop.docType}).`);
  }
  return null;
};

/**
 * Número de documento já usado no mesmo consórcio e tipo (unicidade do banco).
 * @returns 409, ou `null` se o número estiver livre.
 */
export const checkDocNumber = async (
  fkCorporationId: string, docType: DocTypeEnum, number: string, excludeId?: string,
) => {
  const where: WhereAttributeHash = { fkCorporationId, penaltyDocType: docType, penaltyDocNumber: number };
  if (excludeId) where.penaltyDocId = { [Op.ne]: excludeId };
  const existing = await PenaltyDocModel.findOne({ where });
  if (!existing) return null;
  return uniqueConflict(`${docType} nº ${number} neste consórcio`, existing, existing.penaltyDocId, 'penalty-doc');
};

/**
 * Agente, código de infração e motivo informados precisam existir e estar ativos.
 * @returns 400, ou `null` se estiver tudo certo.
 */
export const checkPenaltyParents = async (data: { fkAgentId?: string | null; fkFineCodeId?: string | null; fkMotiveId?: string | null }) => {
  const checks: [string | null | undefined, () => Promise<number>, string][] = [
    [data.fkAgentId, () => AgentModel.count({ where: { agentId: data.fkAgentId, activated: true } }), "agente"],
    [data.fkFineCodeId, () => FineCodeModel.count({ where: { fineCodeId: data.fkFineCodeId, activated: true } }), "código de infração"],
    [data.fkMotiveId, () => MotiveModel.count({ where: { motiveId: data.fkMotiveId, activated: true } }), "motivo"],
  ];
  for (const [id, count, label] of checks) {
    if (id && !(await count())) return Response.badRequest(`O ${label} informado não existe ou está inativo.`);
  }
  return null;
};
