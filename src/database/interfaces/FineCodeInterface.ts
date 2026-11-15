export default interface FineCodeInterface {
  fineCodeId?: string;
  fineNumber?: string;
  fineDescription: string;
  fineKm?: number;
  fineAlias?: string;
  fineOrder?: string | null;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}
