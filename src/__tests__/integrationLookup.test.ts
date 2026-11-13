import { AxiosError, AxiosHeaders } from 'axios';
import { format } from 'util';
import { axiosOperations, axiosRegistry } from '../services/integrations/axiosInstance';
import { operationsRoutes, registryRoutes } from '../services/integrations/endpoints';
import {
  getBusTimetablesByIds,
  getCompaniesByIds,
  getLocationsByIds,
  getVehiclesByIds,
} from '../services/integrations/integrationService';

jest.mock('../services/integrations/axiosInstance', () => ({
  axiosRegistry: { get: jest.fn(), post: jest.fn() },
  axiosOperations: { get: jest.fn(), post: jest.fn() },
}));

const registryPost = axiosRegistry.post as jest.Mock;
const operationsPost = axiosOperations.post as jest.Mock;

beforeEach(() => {
  registryPost.mockReset();
  operationsPost.mockReset();
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

const casos = [
  { nome: 'empresas', fn: getCompaniesByIds, post: registryPost, rota: registryRoutes.getCompaniesLookup, esperada: '/company/lookup' },
  { nome: 'veículos', fn: getVehiclesByIds, post: operationsPost, rota: operationsRoutes.getVehiclesLookup, esperada: '/vehicle/lookup' },
  { nome: 'locais', fn: getLocationsByIds, post: operationsPost, rota: operationsRoutes.getLocationsLookup, esperada: '/location/lookup' },
  { nome: 'itinerários', fn: getBusTimetablesByIds, post: operationsPost, rota: operationsRoutes.getBusTimetablesLookup, esperada: '/bus-timetable/lookup' },
];

describe('consultas em lote do juristic usam /lookup (T09)', () => {
  casos.forEach(({ nome, fn, post, rota, esperada }) => {
    it(`${nome}: chama ${esperada} com { ids } e devolve data`, async () => {
      post.mockResolvedValue({ data: { data: [{ id: 'x' }] } });
      expect(await fn(['a', 'b'])).toEqual([{ id: 'x' }]);
      expect(rota).toBe(esperada);
      expect(post).toHaveBeenCalledWith(esperada, { ids: ['a', 'b'] });
    });
    it(`${nome}: lista vazia não chama o provedor`, async () => {
      expect(await fn([])).toEqual([]);
      expect(post).not.toHaveBeenCalled();
    });
    it(`${nome}: erro do provedor devolve lista vazia`, async () => {
      post.mockRejectedValue(new Error('indisponível'));
      expect(await fn(['a'])).toEqual([]);
    });
    it(`${nome}: erro do provedor não registra o token de serviço (T07 item 5)`, async () => {
      const headers = new AxiosHeaders({ Authorization: 'Bearer token.de.servico' });
      const config: any = { method: 'post', url: esperada, headers, data: '{"ids":["a"]}' };
      post.mockRejectedValue(new AxiosError('Request failed with status code 503', 'ERR_BAD_RESPONSE', config, {},
        { status: 503, data: { detalhe: 'corpo' }, headers: {}, config, statusText: '' } as any));
      expect(await fn(['a'])).toEqual([]);
      const out = (console.error as jest.Mock).mock.calls.map(c => format(...c)).join(' | ');
      expect(out).toContain(esperada);
      expect(out).not.toContain('Bearer');
      expect(out).not.toContain('token.de.servico');
      expect(out).not.toContain('corpo');
    });
  });

  it('nenhuma rota de consulta usa /bulk (reservada à inserção)', () => {
    const todas = [...Object.values(registryRoutes), ...Object.values(operationsRoutes)]
      .filter((v): v is string => typeof v === 'string');
    expect(todas.filter(r => r.includes('/bulk'))).toEqual([]);
  });
});
