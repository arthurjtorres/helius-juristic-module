import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { CtdopTypeEnum } from '../database/models/enums/CtdopTypeEnum';
import { DocTypeEnum } from '../database/models/enums/DocTypeEnum';

const VALORES = ['NOTIFICAÇÃO DE IRREGULARIDADE', 'AUTO DE INFRAÇÃO', 'RESPOSTA DE RECURSO'];

/** Compila só o arquivo do enum, como fazem ts-node --transpile-only e isolatedModules, e devolve o enum. */
const enumCompiladoSozinho = () => {
  const arquivo = path.join(__dirname, '../database/models/enums/CtdopTypeEnum.ts');
  const { outputText } = ts.transpileModule(fs.readFileSync(arquivo, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const mod = { exports: {} as Record<string, any> };
  new Function('module', 'exports', 'require', outputText)(mod, mod.exports, require);
  return mod.exports.CtdopTypeEnum;
};

describe('CtdopTypeEnum (achado da verificação da T12)', () => {
  it('Object.values traz só os 3 tipos de carta, também compilado arquivo a arquivo', () => {
    expect(Object.values(CtdopTypeEnum)).toEqual(VALORES);
    expect(Object.values(enumCompiladoSozinho())).toEqual(VALORES);
  });

  it('notificação e auto têm os mesmos valores do DocTypeEnum', () => {
    expect(CtdopTypeEnum.IRREGULARIDADE).toBe(DocTypeEnum.IRREGULARIDADE);
    expect(CtdopTypeEnum.AUTO).toBe(DocTypeEnum.AUTO);
  });
});
