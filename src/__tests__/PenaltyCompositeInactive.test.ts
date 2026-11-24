const mockFindAll = jest.fn();
jest.mock('../database/models', () => ({
  __esModule: true,
  PenaltyDocModel: { findAll: (...a: unknown[]) => mockFindAll(...a) },
  PenaltyInfoModel: {}, AppealModel: {}, CTDOPModel: {}, AgentModel: {}, FineCodeModel: {}, MotiveModel: {}, ProtocolModel: {},
}));
jest.mock('../services/integrations/integrationService', () => ({
  getCompaniesByIds: jest.fn(async () => []), getVehiclesByIds: jest.fn(async () => []),
  getBusTimetablesByIds: jest.fn(async () => []), getLocationsByIds: jest.fn(async () => []),
}));

import { PenaltyViewService } from '../services/PenaltyViewService';

const service = new PenaltyViewService();
const doc = (activated: boolean, infoActivated: boolean) => ({
  get: () => ({ penaltyDocId: 'd1', penaltyDocNumber: '1', activated, PenaltyInfo: { penaltyInfoId: 'p1', activated: infoActivated } }),
});

beforeEach(() => mockFindAll.mockReset());

describe('visão composta de penalidades com inativos (T17)', () => {
  it('sem a flag filtra documento, penalidade e auxiliares ativos', async () => {
    mockFindAll.mockResolvedValue([]);
    await service.getCompositeTableData();
    const opts = mockFindAll.mock.calls[0][0];
    expect(opts.where).toEqual({ activated: true });
    expect(opts.include[0].where).toEqual({ activated: true });
  });

  it('com a flag tira o filtro (recurso continua só ativo) e devolve o status de cada linha', async () => {
    mockFindAll.mockResolvedValue([doc(false, false)]);
    const result = await service.getCompositeTableData({ includeInactive: true });
    const opts = mockFindAll.mock.calls[0][0];
    expect(opts.where).toEqual({});
    expect(opts.include[0].where).toEqual({});
    expect(opts.include.find((i: { as: string }) => i.as === 'Appeal').where).toEqual({ activated: true });
    expect('data' in result && result.data?.[0]).toMatchObject({ docId: 'd1', activated: false, penaltyInfoId: 'p1', penaltyActivated: false });
  });
});
