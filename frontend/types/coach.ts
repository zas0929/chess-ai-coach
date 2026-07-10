export type CoachSeverity =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

export interface CoachResponse {
  title: string;
  explanation: string;
  tip: string;
  severity: CoachSeverity;
}

export interface CoachExplainRequest {
  fenBefore: string;
  fenAfter: string;
  move: string;
  moveNumber: number;
  side: 'white' | 'black';
  player: 'white' | 'black';
  engine: 'white' | 'black';
  bestMove?: string;
  classification?: string;
  evaluationBefore: number | null;
  evaluationAfter: number;
  evaluationChange: number;
  opening?: string;
  history: string[];
}

export interface CoachExplainResponse {
  title: string;
  explanation: string;
  tip: string;
  theme: string;
  usage?: AIUsageInfo;
  quota?: QuotaInfo;
}

export interface CoachChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CoachChatRequest {
  context: CoachExplainRequest;
  messages: CoachChatMessage[];
}

export interface CoachChatResponse {
  answer: string;
  usage?: AIUsageInfo;
  quota?: QuotaInfo;
}

export interface AIUsageInfo {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export interface QuotaInfo {
  used: number;
  limit: number;
  remaining: number;
  enforced: boolean;
}
