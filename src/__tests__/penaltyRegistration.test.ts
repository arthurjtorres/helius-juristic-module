import { IDS, resetJuristicMocks } from './helpers/juristicMocks';
import PenaltyInfoService from '../services/PenaltyInfoService';
import PenaltyDocService from '../services/PenaltyDocService';
import { DocTypeEnum } from '../database/models/enums/DocTypeEnum';
import { PenaltyStatusEnum } from '../database/models/enums/PenaltyStatusEnum';

jest.mock('../database/models', () => jest.requireActual('./helpers/juristicMocks').modelsFactory());
jest.mock('../database/models/database', () => ({ __esModule: true, default: { transaction: jest.fn() } }));
jest.mock('../services/integrations/integrationService', () => ({
  getCompanyCorporationId: jest.fn(),
  getCompanyById: jest.fn(), getVehicleById: jest.fn(), getBusTimetableById: jest.fn(), getLocationById: jest.fn(),
}));

const models = jest.requireMock('../database/models');
const db = jest.requireMock('../database/models/database').default;
const integration = jest.requireMock('../services/integrations/integrationService');

const payload = (): any => ({
  fkCompanyId: IDS.company,
  date: '2025-05-02',
  time: '10:00',
  fkAgentId: IDS.agent,
  doc: { penaltyDocType: DocTypeEnum.IRREGULARIDADE, penaltyDocNumber: '16368', fkCtdopId: IDS.ctdop },
  createdBy: IDS.user,
});

let transaction: { commit: jest.Mock; rollback: jest.Mock };

beforeEach(() => {
  transaction = resetJuristicMocks(models, db);
  integration.getCompanyCorporationId.mockReset().mockResolvedValue(IDS.corporation);
  models.AgentModel.count.mockResolvedValue(1);
  models.CTDOPModel.findOne.mockResolvedValue({ docType: DocTypeEnum.IRREGULARIDADE });
  models.PenaltyDocModel.findOne.mockResolvedValue(null);
});

describe('PenaltyInfoService.createPenalty (T12)', () => {
  const service = new PenaltyInfoService();

  it('400 sem o documento', async () => {
    const { doc, ...semDoc } = payload();
    expect((await service.createPenalty(semDoc)).status).toBe(400);
  });

  it('400 se o cliente informa o consórcio (vem do registry)', async () => {
    expect((await service.createPenalty({ ...payload(), fkCorporationId: IDS.corporation })).status).toBe(400);
  });

  it('400 e nada gravado se a empresa não existe ou está inativa', async () => {
    integration.getCompanyCorporationId.mockResolvedValue(null);
    expect((await service.createPenalty(payload())).status).toBe(400);
    expect(db.transaction).not.toHaveBeenCalled();
  });

  it('400 se a CTDOP é de outro tipo', async () => {
    models.CTDOPModel.findOne.mockResolvedValue({ docType: DocTypeEnum.AUTO });
    expect((await service.createPenalty(payload())).status).toBe(400);
  });

  it('409 se o número já existe no consórcio e tipo', async () => {
    models.PenaltyDocModel.findOne.mockResolvedValue({ penaltyDocId: IDS.doc, activated: true });
    const result = await service.createPenalty(payload());
    expect(result.status).toBe(409);
    expect(models.PenaltyDocModel.findOne).toHaveBeenCalledWith({ where: {
      fkCorporationId: IDS.corporation, penaltyDocType: DocTypeEnum.IRREGULARIDADE, penaltyDocNumber: '16368',
    } });
  });

  it('201 grava fato e documento na mesma transação, com consórcio do registry e autoria do token', async () => {
    const result = await service.createPenalty(payload());
    expect(result.status).toBe(201);

    const [info, infoOpts] = models.PenaltyInfoModel.create.mock.calls[0];
    const [doc, docOpts] = models.PenaltyDocModel.create.mock.calls[0];
    expect(infoOpts.transaction).toBe(transaction);
    expect(docOpts.transaction).toBe(transaction);
    expect(info).toMatchObject({ fkCompanyId: IDS.company, fkCorporationId: IDS.corporation, createdBy: IDS.user });
    expect(info.doc).toBeUndefined();
    expect(doc).toMatchObject({
      fkPenaltyInfoId: info.penaltyInfoId, fkCorporationId: IDS.corporation, createdBy: IDS.user,
      penaltyDocStatus: PenaltyStatusEnum.EM_ANALISE, penaltyDocNumber: '16368',
    });
    expect(transaction.commit).toHaveBeenCalled();
  });

  it('desfaz o fato se o documento falha', async () => {
    models.PenaltyDocModel.create.mockRejectedValue(new Error('falha'));
    await expect(service.createPenalty(payload())).rejects.toThrow('falha');
    expect(transaction.rollback).toHaveBeenCalled();
    expect(transaction.commit).not.toHaveBeenCalled();
  });
});

describe('PenaltyDocService.createPenaltyDoc (T12)', () => {
  const service = new PenaltyDocService();
  const auto = (): any => ({
    penaltyDocType: DocTypeEnum.AUTO, penaltyDocNumber: '29131', fkCtdopId: IDS.ctdop,
    fkPenaltyInfoId: IDS.info, createdBy: IDS.user,
  });

  beforeEach(() => {
    models.PenaltyInfoModel.findOne.mockResolvedValue({ penaltyInfoId: IDS.info, fkCorporationId: IDS.corporation });
    models.CTDOPModel.findOne.mockResolvedValue({ docType: DocTypeEnum.AUTO });
    models.PenaltyDocModel.create.mockResolvedValue({ penaltyDocId: IDS.doc });
  });

  it('auto num fato existente: consórcio copiado do fato, status EM ANÁLISE', async () => {
    expect((await service.createPenaltyDoc(auto())).status).toBe(201);
    expect(models.PenaltyDocModel.create.mock.calls[0][0]).toMatchObject({
      fkCorporationId: IDS.corporation, penaltyDocStatus: PenaltyStatusEnum.EM_ANALISE,
    });
  });

  it('409 se o fato já tem documento desse tipo (inativo: indica a reativação)', async () => {
    models.PenaltyDocModel.findOne.mockResolvedValueOnce({ penaltyDocId: IDS.doc, activated: false });
    const result = await service.createPenaltyDoc(auto());
    expect(result.status).toBe(409);
    expect(result.message).toContain(`/penalty-doc/${IDS.doc}/reactivate`);
  });

  it('400 se a penalidade não existe ou está inativa', async () => {
    models.PenaltyInfoModel.findOne.mockResolvedValue(null);
    expect((await service.createPenaltyDoc(auto())).status).toBe(400);
  });
});
