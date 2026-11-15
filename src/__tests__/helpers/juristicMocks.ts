/** Mocks compartilhados dos models e da transação do `juristic` (usar com os `jest.mock` dos testes). */
export const modelMock = () => ({
  findOne: jest.fn(), findAll: jest.fn(), count: jest.fn(), create: jest.fn(), update: jest.fn(),
});

export const modelsFactory = () => ({
  AgentModel: modelMock(), FineCodeModel: modelMock(), MotiveModel: modelMock(), CTDOPModel: modelMock(),
  PenaltyDocModel: modelMock(), PenaltyInfoModel: modelMock(), AppealModel: modelMock(),
  ProtocolModel: modelMock(), AnalysisModel: modelMock(),
});

/** Zera os mocks dos models e devolve uma transação nova, já configurada em `db.transaction()`. */
export const resetJuristicMocks = (models: Record<string, Record<string, jest.Mock>>, db: { transaction: jest.Mock }) => {
  Object.values(models).forEach(m => Object.values(m).forEach(fn => fn.mockReset()));
  const transaction = { commit: jest.fn(), rollback: jest.fn() };
  db.transaction.mockReset().mockResolvedValue(transaction);
  return transaction;
};

export const IDS = {
  user: '00000000-0000-4000-8000-000000000001',
  company: '11111111-1111-4111-8111-111111111111',
  corporation: '22222222-2222-4222-8222-222222222222',
  ctdop: '33333333-3333-4333-8333-333333333333',
  agent: '44444444-4444-4444-8444-444444444444',
  info: '55555555-5555-4555-8555-555555555555',
  doc: '66666666-6666-4666-8666-666666666666',
  protocol: '77777777-7777-4777-8777-777777777777',
  appeal: '88888888-8888-4888-8888-888888888888',
  responseCtdop: '99999999-9999-4999-8999-999999999999',
};
