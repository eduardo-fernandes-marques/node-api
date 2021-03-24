export type ProductCoopRequest = { id: string; coop: string };

export type Product = {
  id: string;
  term: Value;
  name: string;
  code: string;
  value: Value;
  coop?: string;
  coreId: number;
  status: string;
  target: string;
  version: number;
  basedOn: string;
  category: string;
  brands: string[];
  hierarchy: string;
  validity: Validity;
  gracePeriod: Value;
  releaseType: string;
  documents: Document[];
  guarantees: Guarantee;
  installment: Installment;
  financedIOFValue: boolean;
  creditOpeningRate: number;
  amortizationMethod: string;
  contractTemplateId: string;
  bacenModality: BaconModality;
};

export type PricingsRequest = {
  page: number;
  size: number;
  coop?: string;
  sort?: string[];
};

type Value = {
  min: number;
  max: number;
};

type Installment = {
  value: Value;
  quantity: Value;
};

type Validity = {
  end: string;
  beginning: string;
};

type BaconModality = {
  code: number;
  description: string;
};

type Document = {
  id: string;
  required: boolean;
};

type FundingPercentage = {
  range?: Range;
  brandNew: boolean;
  percentage: number;
};

type Range = {
  to: number;
  from: number;
};

type Vehicle = {
  maxAge: number;
  required: boolean;
  fundingPercentages: FundingPercentage[];
};

type Guarantor = {
  required: boolean;
};

type Guarantee = {
  vehicle: Vehicle;
  realEstate?: string;
  guarantor: Guarantor;
};
