import PenaltyCompositeView from "../database/DTO/PenaltyCompositeView";
import { PenaltyInfoModel, PenaltyDocModel, AppealModel, CTDOPModel, AgentModel, FineCodeModel, MotiveModel, ProtocolModel } from "../database/models";
import Response, { StandardResponse } from "../utils/Response";

import {
  getCompaniesByIds,
  getVehiclesByIds,
  getBusTimetablesByIds,
  getLocationsByIds
} from "./integrations/integrationService";

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Número da carta ou, enquanto ele não chega, o rótulo por decêndio usado na planilha (ex.: `#01-05/2025`). */
export const ctdopLabel = (ctdop?: { ctdopNumber?: string | null; period?: number | null; refMonth?: number | null; refYear?: number | null }) => {
  if (!ctdop) return undefined;
  if (ctdop.ctdopNumber) return ctdop.ctdopNumber;
  if (ctdop.period == null || ctdop.refMonth == null || ctdop.refYear == null) return undefined;
  return `#${pad2(ctdop.period)}-${pad2(ctdop.refMonth)}/${ctdop.refYear}`;
};

/** Identificação do documento como na planilha: sigla do consórcio + número (ex.: `AS28780`). */
export const docRegistration = (corporationAcronym: string | undefined, docNumber: string) =>
  corporationAcronym ? `${corporationAcronym}${docNumber}` : docNumber;

export class PenaltyViewService {

  async getCompositeTableData(): Promise<StandardResponse<PenaltyCompositeView[]>> {

    const rawDocs = await PenaltyDocModel.findAll({
      where: { activated: true },
      include: [
        { model: PenaltyInfoModel, as: 'PenaltyInfo', where: { activated: true }, required: true, include: [
          { model: AgentModel, as: 'Agent', where: { activated: true }, required: false },
          { model: FineCodeModel, as: 'FineCode', where: { activated: true }, required: false },
          { model: MotiveModel, as: 'Motive', where: { activated: true }, required: false }
        ]},
        { model: CTDOPModel, as: 'CTDOP', where: { activated: true }, required: false },
        { model: AppealModel, as: 'Appeal', where: { activated: true }, required: false, include: [ // LEFT JOIN
          { model: ProtocolModel, as: 'Protocol', required: false }
        ]}
      ],
      // Adicione limitações (limit/offset) aqui futuramente para paginação
    });

    const docs = rawDocs.map(doc => doc.get({ plain: true }));

    if (!docs.length) return Response.notFound("Nenhum registro de penalidade encontrado!");

    const companyIds = [...new Set(docs.map(d => d.PenaltyInfo?.fkCompanyId).filter(Boolean))];
    const vehicleIds = [...new Set(docs.map(d => d.PenaltyInfo?.fkVehicleId).filter(Boolean))];
    const timetableIds = [...new Set(docs.map(d => d.PenaltyInfo?.fkBusTimetableId).filter(Boolean))];
    const locationIds = [...new Set(docs.map(d => d.PenaltyInfo?.fkLocationId).filter(Boolean))];

    const [companies, vehicles, timetables, locations] = await Promise.all([
      getCompaniesByIds(companyIds),
      getVehiclesByIds(vehicleIds),
      getBusTimetablesByIds(timetableIds),
      getLocationsByIds(locationIds)
    ]);

    const compositeData: PenaltyCompositeView[] = docs.map(doc => {
      const info = doc.PenaltyInfo;
      const ctdop = doc.CTDOP;
      const appeal = doc.Appeal;

      // Encontrar os dados externos correspondentes aos IDs deste registo
      const extCompany = companies.find((c: any) => c.companyId === info?.fkCompanyId);
      const extVehicle = vehicles.find((v: any) => v.vehicleId === info?.fkVehicleId);
      const extTimetable = timetables.find((t: any) => t.busTimetableId === info?.fkBusTimetableId);
      const extLocation = locations.find((l: any) => l.locationId === info?.fkLocationId);

      // Concatenar Data e Hora de forma segura
      const penaltyDate = info && info.date && info.time 
        ? `${info.date} ${info.time}` 
        : undefined;

      return {
        // Dados do PenaltyDoc (Conector)
        docId: doc.penaltyDocId,
        docRegistration: docRegistration(extCompany?.Corporation?.corporationAcronym, doc.penaltyDocNumber),
        docType: doc.penaltyDocType,
        docNumber: doc.penaltyDocNumber,
        docStatus: doc.penaltyDocStatus,

        // Dados do PenaltyInfo (Evento) + Dados Externos Resolvidos
        fkCompanyId: info?.fkCompanyId,
        company: extCompany ? extCompany.companyName : 'Desconhecida',

        fkVehicleId: info?.fkVehicleId,
        vehicleNumber: extVehicle ? extVehicle.vehicleNumber : 'Desconhecido', // Ajuste para a sua propriedade

        fkBusTimetableId: info?.fkBusTimetableId,
        busTimetableCode: extTimetable ? extTimetable.timetableCode : 'Desconhecido',

        penaltyDate: penaltyDate,

        fkAgentId: info?.fkAgentId,
        agentCode: info?.Agent?.agentCode,

        fineCodeId: info?.fkFineCodeId,
        fineCodeNumber: info?.FineCode?.fineNumber,

        fkLocationId: info?.fkLocationId,
        location: extLocation ? extLocation.locationName : 'Desconhecido',

        agentAnnotation: info?.agentAnnotation,
        
        fkMotiveId: info?.fkMotiveId,
        motive: info?.Motive?.motiveName,
        
        internalAnnotation: info?.internalAnnotation,
        penaltyStatus: doc.penaltyDocStatus,

        // Dados do CTDOP (Documento)
        ctdopNumber: ctdop?.ctdopNumber,
        ctdopPeriod: ctdop?.period != null ? String(ctdop.period) : undefined,
        ctdopLabel: ctdopLabel(ctdop),

        // Dados do Appeal (Recurso)
        appealProtocol: appeal?.Protocol?.protocolNumber,
        appealStatus: appeal?.response
      };
    });

    return Response.ok("Dados da tabela de multas recuperados com sucesso!", compositeData);
  }
}

export default PenaltyViewService;