interface CarrierParcelLimitData {
  id: number;
  clientMethodID: number;
  carrier: string;
  active: boolean;
  despatchMethod: string;
  despatchService: string;
  name: string;
  length: number;
  volume: number;
  parcels: number;
  parcelKG: number;
  consignmentKG?: any;
  secondaryParameter: string;
  entireParcel: EntireParcel;
}

interface EntireParcel {
  Id: number;
  Code: string;
  Description: string;
  CarrierCode: string;
  CarrierDescription: string;
  LimitsInfo: LimitsInfo;
  despatchService: string;
  name: string;
}

interface LimitsInfo {
  ServiceID: number;
  PermanentSecondaryDateFrom?: any;
  SecondaryDateFrom?: any;
  SecondaryDateTo?: any;
  LimitList: LimitList[];
}

interface LimitList {
  ID: number;
  IsOverridable: boolean;
  MinValue: number;
  MaxValue?: number;
  SecondaryMinValue?: any;
  SecondaryMaxValue?: any;
  Type: string;
}

export type { CarrierParcelLimitData };
