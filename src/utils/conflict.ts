import { UniqueConstraintError } from "sequelize";
import Response from "./Response";

/**
 * 409 para valor único já ocupado. Registro inativo continua ocupando o valor:
 * a mensagem informa o id e a rota de reativação (ADR-010).
 *
 * @param label Descrição do valor (ex.: "Número de protocolo").
 * @param existing Registro que já usa o valor.
 * @param id Identificador desse registro.
 * @param route Recurso da API (ex.: "protocol").
 */
export const uniqueConflict = (label: string, existing: { activated: boolean }, id: string, route: string) =>
  Response.conflict(
    existing.activated
      ? `${label} já cadastrado(a).`
      : `${label} já existe em um registro inativo (id: ${id}). Reative-o em PATCH /${route}/${id}/reactivate.`
  );

/** `true` se o erro é violação de unicidade do banco (corrida entre a verificação e a gravação). */
export const isUniqueViolation = (error: unknown): boolean => error instanceof UniqueConstraintError;
