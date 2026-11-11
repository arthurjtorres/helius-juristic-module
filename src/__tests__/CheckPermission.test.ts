import { Request, Response as ExpressResponse } from 'express';
import { JwtPayload } from '../middlewares/Authentication';
import { checkPermission, evaluatePermission } from '../middlewares/CheckPermission';
import { hasFullAccess } from '../utils/AccessPolicy';
import { PermissionEnum } from '../database/models/enums/PermissionEnum';

const user = (p: Partial<JwtPayload>): JwtPayload => ({
  userId: 'u1', userName: 'u', usertag: 'u', email: 'u@example.invalid', userType: 'COLABORADOR',
  clearance: 'USUARIO', clearanceId: 'c', modules: ['JURIDICO'],
  roles: [], allowedMenus: [{ menu: 'PENALIDADES', permissions: ['READ', 'CREATE'] }], ...p,
});
const service = { tokenType: 'service', userId: 'service:x', roles: [], modules: [], allowedMenus: [] } as unknown as JwtPayload;

type Middleware = (q: Request, s: ExpressResponse, n: () => void) => unknown;

/** Executa o middleware e devolve o status (0 se não respondeu) e se chamou `next`. */
const run = (mw: Middleware, u: JwtPayload | undefined, method = 'GET', locals: Record<string, unknown> = {}) => {
  const out = { status: 0, next: false };
  const res = {
    locals: { user: u, ...locals },
    status(code: number) { out.status = code; return this; },
    json() { return this; },
  } as unknown as ExpressResponse;
  mw({ method, params: {} } as unknown as Request, res, () => { out.next = true; });
  return out;
};

describe('hasFullAccess', () => {
  it('SYSTEM_ADMIN e SUPER_ADMIN têm; ADMIN não', () => {
    expect(hasFullAccess(user({ clearance: 'SYSTEM_ADMIN' }))).toBe(true);
    expect(hasFullAccess(user({ clearance: 'SUPER_ADMIN' }))).toBe(true);
    expect(hasFullAccess(user({ clearance: 'ADMIN' }))).toBe(false);
  });
  it('role DESENVOLVEDOR tem; token de serviço e ausência de usuário não', () => {
    expect(hasFullAccess(user({ roles: [{ module: 'JURIDICO', role: 'DESENVOLVEDOR' }] }))).toBe(true);
    expect(hasFullAccess(service)).toBe(false);
    expect(hasFullAccess(undefined)).toBe(false);
  });
});

describe('evaluatePermission', () => {
  it('sem usuário → 401', () => {
    expect(evaluatePermission(undefined, 'GET', 'PENALIDADES')?.status).toBe(401);
  });
  it('token de serviço: GET e HEAD passam, escrita → 403', () => {
    expect(evaluatePermission(service, 'GET', 'PENALIDADES', PermissionEnum.READ)).toBeNull();
    expect(evaluatePermission(service, 'HEAD', 'PENALIDADES', PermissionEnum.READ)).toBeNull();
    expect(evaluatePermission(service, 'POST', 'ANALISES', PermissionEnum.CREATE)?.status).toBe(403);
    expect(evaluatePermission(service, 'PUT', 'PENALIDADES', PermissionEnum.UPDATE)?.status).toBe(403);
    expect(evaluatePermission(service, 'DELETE', 'PENALIDADES', PermissionEnum.DELETE)?.status).toBe(403);
  });
  it('ANALISES com allowServiceToken=false: serviço negado até em GET', () => {
    expect(evaluatePermission(service, 'GET', 'ANALISES', PermissionEnum.READ, { allowServiceToken: false })?.status).toBe(403);
  });
  it('allowServiceToken=false não afeta usuário com o menu', () => {
    const u = user({ allowedMenus: [{ menu: 'ANALISES', permissions: ['READ'] }] });
    expect(evaluatePermission(u, 'GET', 'ANALISES', PermissionEnum.READ, { allowServiceToken: false })).toBeNull();
  });
  it('SYSTEM_ADMIN, SUPER_ADMIN e DESENVOLVEDOR passam em tudo', () => {
    expect(evaluatePermission(user({ clearance: 'SYSTEM_ADMIN', modules: [] }), 'DELETE', 'X', PermissionEnum.DELETE)).toBeNull();
    expect(evaluatePermission(user({ clearance: 'SUPER_ADMIN', modules: [] }), 'DELETE', 'X', PermissionEnum.DELETE)).toBeNull();
    expect(evaluatePermission(user({ modules: [], roles: [{ module: 'JURIDICO', role: 'DESENVOLVEDOR' }] }), 'DELETE', 'X', PermissionEnum.DELETE)).toBeNull();
  });
  it('ADMIN não tem bypass: depende de módulo, menu e ação', () => {
    expect(evaluatePermission(user({ clearance: 'ADMIN', allowedMenus: [] }), 'GET', 'PENALIDADES', PermissionEnum.READ)?.status).toBe(403);
  });
  it('sem o módulo JURIDICO → 403', () => {
    expect(evaluatePermission(user({ modules: ['CADASTRO'] }), 'GET', 'PENALIDADES', PermissionEnum.READ)?.status).toBe(403);
  });
  it('sem o menu → 403', () => {
    expect(evaluatePermission(user({}), 'GET', 'RECURSOS', PermissionEnum.READ)?.status).toBe(403);
  });
  it('menu sem a ação → 403 (antes não bloqueava)', () => {
    expect(evaluatePermission(user({}), 'DELETE', 'PENALIDADES', PermissionEnum.DELETE)?.status).toBe(403);
  });
  it('com módulo, menu e ação → permitido', () => {
    expect(evaluatePermission(user({}), 'POST', 'PENALIDADES', PermissionEnum.CREATE)).toBeNull();
  });
  it('payload sem roles, modules e allowedMenus não quebra (TypeError)', () => {
    const quebrado = { userId: 'u', clearance: 'USUARIO' } as unknown as JwtPayload;
    expect(() => evaluatePermission(quebrado, 'GET', 'PENALIDADES', PermissionEnum.READ)).not.toThrow();
    expect(evaluatePermission(quebrado, 'GET', 'PENALIDADES', PermissionEnum.READ)?.status).toBe(403);
  });
});

describe('consulta em lote por POST (allowServiceToken)', () => {
  it('serviço só passa em POST quando a rota está marcada', () => {
    expect(evaluatePermission(service, 'POST', 'PENALIDADES', PermissionEnum.CREATE)?.status).toBe(403);
    expect(evaluatePermission(service, 'POST', 'PENALIDADES', PermissionEnum.CREATE, { serviceMayPost: true })).toBeNull();
  });
  it('a marca não libera PUT/DELETE de rota não marcada; middleware lê res.locals', () => {
    const mw = checkPermission('PENALIDADES', PermissionEnum.CREATE);
    expect(run(mw, service, 'POST').status).toBe(403);
    expect(run(mw, service, 'POST', { allowServiceToken: true }).next).toBe(true);
    expect(run(checkPermission('PENALIDADES', PermissionEnum.DELETE), service, 'DELETE').status).toBe(403);
  });
  it('usuário precisa de CREATE no menu, mesmo na rota de lote (todo POST é CREATE)', () => {
    const mw = checkPermission('PENALIDADES', PermissionEnum.CREATE);
    expect(run(mw, user({ allowedMenus: [{ menu: 'PENALIDADES', permissions: ['READ'] }] }), 'POST', { allowServiceToken: true }).status).toBe(403);
    expect(run(mw, user({ allowedMenus: [{ menu: 'PENALIDADES', permissions: ['READ', 'CREATE'] }] }), 'POST', { allowServiceToken: true }).next).toBe(true);
  });
});

describe('middleware checkPermission', () => {
  it('responde 403 e não chama next', () => {
    const r = run(checkPermission('PENALIDADES', PermissionEnum.DELETE), user({}), 'DELETE');
    expect(r.status).toBe(403);
    expect(r.next).toBe(false);
  });
  it('chama next quando permitido', () => {
    const r = run(checkPermission('PENALIDADES', PermissionEnum.READ), user({}));
    expect(r.next).toBe(true);
    expect(r.status).toBe(0);
  });
  it('repassa a opção allowServiceToken=false', () => {
    const r = run(checkPermission('ANALISES', PermissionEnum.READ, { allowServiceToken: false }), service);
    expect(r.status).toBe(403);
    expect(r.next).toBe(false);
  });
});
