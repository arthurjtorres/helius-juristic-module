export default interface AgentInterface {
  agentId?: string;
  agentCode: string;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}