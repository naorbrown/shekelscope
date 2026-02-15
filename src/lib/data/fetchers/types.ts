export interface FetchResult<T> {
  data: T;
  lastUpdated: string;
  source: string;
  sourceUrl: string;
  isLive: boolean;
}
