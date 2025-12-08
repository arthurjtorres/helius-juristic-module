export default interface AnalysisInterface {
  analysisId?: string;
  fkPenaltyInfoId: string;
  fkEmployeeId?: string;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}