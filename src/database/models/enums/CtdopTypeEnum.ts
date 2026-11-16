/**
 * Tipo da carta (CTDOP): as duas de penalidade (mesmos valores do `DocTypeEnum`) e a de resposta de recurso.
 * Valores literais de propósito: membro calculado a partir de outro enum (`= DocTypeEnum.AUTO`) ganha
 * mapeamento reverso quando o arquivo é compilado sozinho (ts-node --transpile-only, isolatedModules),
 * e `Object.values` passaria a incluir os nomes `IRREGULARIDADE` e `AUTO`.
 */
export enum CtdopTypeEnum {
  IRREGULARIDADE = 'NOTIFICAÇÃO DE IRREGULARIDADE',
  AUTO = 'AUTO DE INFRAÇÃO',
  RESPOSTA = 'RESPOSTA DE RECURSO',
}
