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
