export default interface MotiveInterface {
  motiveId?: string;
  motiveName: string;
  motiveCode?: string;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}