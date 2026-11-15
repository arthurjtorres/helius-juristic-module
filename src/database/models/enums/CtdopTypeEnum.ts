import { DocTypeEnum } from "./DocTypeEnum";

/** Tipo da carta (CTDOP): as duas de penalidade (mesmos valores do `DocTypeEnum`) e a de resposta de recurso. */
export enum CtdopTypeEnum {
  IRREGULARIDADE = DocTypeEnum.IRREGULARIDADE,
  AUTO = DocTypeEnum.AUTO,
  RESPOSTA = 'RESPOSTA DE RECURSO',
}
