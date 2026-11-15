import { IDS, resetJuristicMocks } from './helpers/juristicMocks';
import AppealService from '../services/AppealService';
import CTDOPService from '../services/CTDOPService';
import FineCodeService from '../services/FineCodeService';
import { ctdopLabel, docRegistration } from '../services/PenaltyViewService';
import { DocTypeEnum } from '../database/models/enums/DocTypeEnum';
import { CtdopTypeEnum } from '../database/models/enums/CtdopTypeEnum';
import { PenaltyStatusEnum } from '../database/models/enums/PenaltyStatusEnum';
import { AppealResponseEnum } from '../database/models/enums/AppealResponseEnum';

jest.mock('../database/models', () => jest.requireActual('./helpers/juristicMocks').modelsFactory());
jest.mock('../database/models/CTDOPModel', () => ({ __esModule: true, default: jest.requireMock('../database/models').CTDOPModel }));
jest.mock('../database/models/FineCodeModel', () => ({ __esModule: true, default: jest.requireMock('../database/models').FineCodeModel }));
jest.mock('../database/models/database', () => ({ __esModule: true, default: { transaction: jest.fn() } }));
jest.mock('../services/integrations/integrationService', () => ({}));

const models = jest.requireMock('../database/models');
const db = jest.requireMock('../database/models/database').default;

let transaction: { commit: jest.Mock; rollback: jest.Mock };
beforeEach(() => { transaction = resetJuristicMocks(models, db); });

/** Último status gravado no documento e a transação usada. */
const lastDocStatus = () => {
  const [values, opts] = models.PenaltyDocModel.update.mock.calls.at(-1);
  return { status: values.penaltyDocStatus, where: opts.where, transaction: opts.transaction };
};

describe('AppealService: recurso e status do documento (T12)', () => {
  const service = new AppealService();
  const appeal = (extra: object = {}): any => ({ fkProtocolId: IDS.protocol, fkPenaltyDocId: IDS.doc, createdBy: IDS.user, ...extra });

  beforeEach(() => {
    models.AppealModel.findOne.mockResolvedValue(null);
    models.ProtocolModel.findOne.mockResolvedValue({ protocolType: DocTypeEnum.IRREGULARIDADE });
    models.PenaltyDocModel.findOne.mockResolvedValue({ penaltyDocType: DocTypeEnum.IRREGULARIDADE });
    models.AppealModel.create.mockResolvedValue({ appealId: IDS.appeal });
  });

  it('400 se o documento é de tipo diferente do protocolo', async () => {
    models.PenaltyDocModel.findOne.mockResolvedValue({ penaltyDocType: DocTypeEnum.AUTO });
    expect((await service.createAppeal(appeal())).status).toBe(400);
    expect(models.AppealModel.create).not.toHaveBeenCalled();
  });

  it('409 se o documento já tem recurso', async () => {
    models.AppealModel.findOne.mockResolvedValue({ appealId: IDS.appeal, activated: true });
    expect((await service.createAppeal(appeal())).status).toBe(409);
  });

  it('cria o recurso e põe o documento em RECORRIDO na mesma transação', async () => {
    expect((await service.createAppeal(appeal())).status).toBe(201);
    expect(models.AppealModel.create.mock.calls[0][1].transaction).toBe(transaction);
    expect(lastDocStatus()).toEqual({ status: PenaltyStatusEnum.RECORRIDO, where: { penaltyDocId: IDS.doc }, transaction });
    expect(transaction.commit).toHaveBeenCalled();
  });

  it('400 se a resposta vem sem a CTDOP de resposta', async () => {
    expect((await service.createAppeal(appeal({ response: AppealResponseEnum.DEFERIDO }))).status).toBe(400);
  });

  describe('resposta', () => {
    const update = (data: object): any => ({ ...data, updatedBy: IDS.user });
    beforeEach(() => {
      models.AppealModel.findOne.mockResolvedValue({ appealId: IDS.appeal, fkPenaltyDocId: IDS.doc, response: null, fkResponseCtdopId: null });
      models.CTDOPModel.findOne.mockResolvedValue({ docType: CtdopTypeEnum.RESPOSTA });
    });

    it('DEFERIDO com CTDOP de resposta põe o documento em DEFERIDO', async () => {
      const result = await service.updateAppeal(IDS.appeal, update({ response: AppealResponseEnum.DEFERIDO, fkResponseCtdopId: IDS.responseCtdop }));
      expect(result.status).toBe(200);
      expect(lastDocStatus().status).toBe(PenaltyStatusEnum.DEFERIDO);
    });

    it('400 se a CTDOP informada não é de resposta', async () => {
      models.CTDOPModel.findOne.mockResolvedValue({ docType: CtdopTypeEnum.IRREGULARIDADE });
      const result = await service.updateAppeal(IDS.appeal, update({ response: AppealResponseEnum.INDEFERIDO, fkResponseCtdopId: IDS.responseCtdop }));
      expect(result.status).toBe(400);
      expect(models.PenaltyDocModel.update).not.toHaveBeenCalled();
    });

    it('limpar a resposta volta o documento a RECORRIDO', async () => {
      models.AppealModel.findOne.mockResolvedValue({
        appealId: IDS.appeal, fkPenaltyDocId: IDS.doc, response: AppealResponseEnum.INDEFERIDO, fkResponseCtdopId: IDS.responseCtdop,
      });
      expect((await service.updateAppeal(IDS.appeal, update({ response: null }))).status).toBe(200);
      expect(lastDocStatus().status).toBe(PenaltyStatusEnum.RECORRIDO);
    });
  });

  it('desativar o recurso volta o documento a EM ANÁLISE', async () => {
    models.AppealModel.findOne.mockResolvedValue({ appealId: IDS.appeal, fkPenaltyDocId: IDS.doc });
    expect((await service.deleteAppeal(IDS.appeal, IDS.user)).status).toBe(200);
    expect(lastDocStatus().status).toBe(PenaltyStatusEnum.EM_ANALISE);
  });
});

describe('CTDOPService: decêndio obrigatório só fora da resposta (T12)', () => {
  const service = new CTDOPService();
  beforeEach(() => models.CTDOPModel.create.mockResolvedValue({ ctdopId: IDS.ctdop }));

  it('400 para carta de notificação sem decêndio, mês e ano', async () => {
    expect((await service.createCTDOP({ docType: CtdopTypeEnum.IRREGULARIDADE, createdBy: IDS.user } as any)).status).toBe(400);
  });

  it('carta de notificação sem número (identificada pelo decêndio)', async () => {
    const data: any = { docType: CtdopTypeEnum.IRREGULARIDADE, period: 1, refMonth: 5, refYear: 2025, createdBy: IDS.user };
    expect((await service.createCTDOP(data)).status).toBe(201);
  });

  it('carta de resposta sem decêndio', async () => {
    models.CTDOPModel.findOne.mockResolvedValue(null);
    const data: any = { docType: CtdopTypeEnum.RESPOSTA, ctdopNumber: '0148/2024', createdBy: IDS.user };
    expect((await service.createCTDOP(data)).status).toBe(201);
  });
});

describe('FineCodeService: número pela sequência (T12)', () => {
  const service = new FineCodeService();
  const code = (extra: object = {}): any => ({ fineDescription: 'Descrição do código', fineKm: '50', createdBy: IDS.user, ...extra });

  it('sem fineNumber: não envia número (o banco gera) e converte o km', async () => {
    expect((await service.createFineCode(code())).status).toBe(201);
    const created = models.FineCodeModel.create.mock.calls[0][0];
    expect(created.fineNumber).toBeUndefined();
    expect(created.fineKm).toBe(50);
  });

  it('409 para número repetido', async () => {
    models.FineCodeModel.findOne.mockResolvedValue({ fineCodeId: IDS.ctdop, activated: true });
    expect((await service.createFineCode(code({ fineNumber: '12' }))).status).toBe(409);
  });
});

describe('visão composta: identificação do documento e da carta (T12)', () => {
  it('docRegistration = sigla do consórcio + número', () => {
    expect(docRegistration('AS', '28780')).toBe('AS28780');
    expect(docRegistration(undefined, '28780')).toBe('28780');
  });

  it('carta sem número usa o rótulo por decêndio', () => {
    expect(ctdopLabel({ ctdopNumber: null, period: 1, refMonth: 5, refYear: 2025 })).toBe('#01-05/2025');
    expect(ctdopLabel({ ctdopNumber: '0285/2026', period: 1, refMonth: 5, refYear: 2026 })).toBe('0285/2026');
  });
});
