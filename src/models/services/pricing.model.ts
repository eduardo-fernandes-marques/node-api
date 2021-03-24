export type Pricing = {
  id: string;
  status: string;
  isCas?: boolean;
  startDate: string;
  loggerUser?: string;
  productCode: string;
  createdDate?: string;
  organization?: string;
  riskBands: RiskBand[];
  suggestedSpread: number;
  fixedMinimumCost: number;
  postRateDiscount?: number;
  lastModifiedDate?: string;
  reciprocities: Reciprocity[];
};

export type InsertUpdate = Omit<
  Pricing,
  "isCas" & "createdDate" & "lastModifiedDate"
>;

export type AverageMinimumCost = Omit<RiskBand, "fixedMinimumCost" & "spread">;

export type PricingPaginationRequest = {
  coop?: string;
  page: number;
  size: number;
  sort?: string[];
  productCode: string;
};

export type PricingPaginationResponse = {
  sort: Sort;
  size: number;
  last: boolean;
  number: number;
  first: boolean;
  empty: boolean;
  content: Pricing[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
};

type Pageable = {
  sort: Sort;
  offset: number;
  paged: boolean;
  pageSize: number;
  unpaged: boolean;
  pageNumber: number;
};

type Sort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

type RiskBand = {
  name: string;
  prop: string;
  spread: number;
  averageRiskCost: number;
  fixedMinimumCost: number;
  averageFundingCost: number;
  averageMinimumCost: number;
  averageOperationalCost: number;
};

type Reciprocity = {
  code: string;
  name: string;
  bands: Band[];
  weight: number;
};

type Band = {
  end: number;
  code: string;
  init: number;
  value: number;
};
