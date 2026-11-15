/**
 * Status de cada documento de penalidade (notificação ou auto), como na planilha do Jurídico.
 * O usuário escolhe ao editar; RECORRIDO, DEFERIDO e INDEFERIDO também são gravados pelo sistema
 * nos eventos do recurso (cadastro, resposta, desativação).
 */
export enum PenaltyStatusEnum {
  EM_ANALISE = 'EM ANÁLISE',
  ELABORANDO = 'ELABORANDO',
  RECORRIDO = 'RECORRIDO',
  DEFERIDO = 'DEFERIDO',
  INDEFERIDO = 'INDEFERIDO',
  SEM_RECURSO = 'SEM RECURSO',
}
