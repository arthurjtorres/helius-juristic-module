export default interface FineCodeInterface {
  fineCodeId?: string;
  fineDescription: string;
  fineKm: string;
  fineAlias: string;
  fineOrder: string;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
