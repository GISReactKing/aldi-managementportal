export interface ProductFixedRouting {
  ClientCode: string;
  Sku: string;
  ClientDespatchServiceID: number;
  ClientDespatchMethodID: number;
  RegionList?: number[];
  EffectiveDateStart?: string;
  EffectiveDateEnd?: string;
}

export interface ProductFixedRoutingObject {
  ForRegions: boolean;
  ProductFixedRouting: ProductFixedRouting[];
}
