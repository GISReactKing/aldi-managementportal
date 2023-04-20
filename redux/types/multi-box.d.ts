export interface IKitFlagRow {
  Client_Code: string;
  Same_Kit_Carrier_Default: string;
}

export interface IKitFlagData {
  totalRows: number;
  rows: Row[];
}

export interface ISkuListRow {
  Item_Code: string;
  Item_Description: string;
  Same_Kit_Carrier: string;
  Component_Count: number;
}

export interface ISkuListData {
  totalRows: number;
  rows: ISkuListRow[];
}

export interface ISameCarrierKitFlagRow {
  Success: string;
}

export interface ISameCarrierKitFlagResponse {
  data: {
    totalRows: number;
    rows: ISameCarrierKitFlagRow[];
  };
}

export interface IClient {
  client: string;
}

export interface IRequest extends IClient {
  sameCarrier?: boolean;
  skuListToAdd?: string[];
  skuListToRemove?: string[];
}

export interface IExceptionSkuListRow {
  Kit_Item_Code: string;
  Item_Description_Kit: string;
  Component_Sequence_No: number;
  Component_Item_Code: string;
  Item_Description_Comp: string;
}

export interface IExceptionSkuListData {
  totalRows: number;
  rows: IExceptionSkuListRow[];
}

export interface IUpdateExceptionListResponseRow {
  Item_Code: string;
  Success: string;
}

export interface IUpdateExceptionListResponseData {
  data: {
    totalRows: number;
    rows: IUpdateExceptionListResponseRow[];
  };
}

export interface IFetchConfigurationResponse {
  clientDefault: IKitFlagRow;
  items: ISkuListData;
}
