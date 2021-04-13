export interface APIError {
  message?: string;
  httpResponseCode?: string;
}
export enum MultipleApiCallsCancelOption {
  CANCEL_PRIOR_CALLS,
  CANCEL_LATEST_CALLS,
}
