export type VaultResponse<T> = {
  data: T;
  auth?: any;
  warnings?: any;
  wrap_info?: any;
  lease_id: string;
  request_id: string;
  renewable: boolean;
  lease_duration: number;
};

export type VaultValues = {
  apiKey?: string;
};

export type VaultUrl = {
  host: string;
  ssl?: boolean;
  port?: number;
};
