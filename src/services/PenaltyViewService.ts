import PenaltyCompositeView from "../database/DTO/PenaltyCompositeView";
import AppealModel from "../database/models/AppealModel";
import CTDOPModel from "../database/models/CTDOPModel";
import PenaltyDocModel from "../database/models/PenaltyDocModel";
import PenaltyInfoModel from "../database/models/PenaltyInfoModel";
import Response, { StandardResponse } from "../utils/Response";

import {
  getCompaniesByIds,
  getVehiclesByIds,
  getBusTimetablesByIds,
  getLocationsByIds
} from "./integrations/integrationService.ts";

export class PenaltyViewService {

  async getCompositeTableData(): Promise<StandardResponse<PenaltyCompositeView[]>> {

    const rawDocs = await PenaltyDocModel.findAll({
      include: [
        { model: PenaltyInfoModel, as: 'PenaltyInfo' },
        { model: CTDOPModel, as: 'CTDOP' },
        { model: AppealModel, as: 'Appeal', required: false } // LEFT JOIN
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
        docRegistration: doc.penaltyDocRegistration,
        docType: doc.penaltyDocType,

        // Dados do PenaltyInfo (Evento) + Dados Externos Resolvidos
        fkCompanyId: info?.fkCompanyId,
        company: extCompany ? extCompany.name : 'Desconhecida', // Ajuste a propriedade 'name' conforme o seu Registry

        fkVehicleId: info?.fkVehicleId,
        vehicleNumber: extVehicle ? extVehicle.vehicleNumber : 'Desconhecido', // Ajuste para a sua propriedade

        fkBusTimetableId: info?.fkBusTimetableId,
        busTimetableCode: extTimetable ? extTimetable.code : 'Desconhecido', // Ajuste para a sua propriedade

        penaltyDate: penaltyDate,

        fkAgentId: info?.fkAgentId,
        agentCode: info?.fkAgentId, // Se o Agente estiver no mesmo schema, altere para info?.Agent?.agentCode

        fineCodeId: info?.fkFineCodeId,
        fineCodeNumber: info?.fkFineCodeId, // Idem para FineCode

        fkLocationId: info?.fkLocationId,
        location: extLocation ? extLocation.name : 'Desconhecido',

        agentAnnotation: info?.agentAnnotation,
        
        fkMotiveId: info?.fkMotiveId,
        motive: info?.fkMotiveId, // Ajuste se fizer o include da tabela Motive
        
        internalAnnotation: info?.internalAnnotation,
        penaltyStatus: info?.penaltyInfoStatus,

        // Dados do CTDOP (Documento)
        ctdopNumber: ctdop?.ctdopNumber,
        ctdopPeriod: ctdop?.period,

        // Dados do Appeal (Recurso)
        appealProtocol: appeal?.protocolNumber,
        appealStatus: appeal?.response
      };
    });

    return Response.ok("Dados da tabela de multas recuperados com sucesso!", compositeData);
  }
}

export default PenaltyViewService;