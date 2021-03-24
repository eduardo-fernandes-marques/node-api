export type ConsulKeysResponse = {
  Key: string;
  Flags: number;
  Value: string;
  LockIndex: number;
  CreateIndex: number;
  ModifyIndex: number;
};

export type Url = {
  pricing: string;
  product: string;
  guarantee: string;
  organization: string;
};

export type Consul = {
  url: Url;
  apis?: Props[];
  vault?: Props[];
  constants?: Props[];
};

export type Props = {
  name: string;
  path: string;
  value: string;
};
