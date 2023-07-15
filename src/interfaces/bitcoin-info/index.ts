import { SuggestedUpdatesInterface } from 'interfaces/suggested-updates';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface BitcoinInfoInterface {
  id?: string;
  orderbooks_trades: string;
  liquidations_info: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  suggested_updates?: SuggestedUpdatesInterface[];
  organization?: OrganizationInterface;
  _count?: {
    suggested_updates?: number;
  };
}

export interface BitcoinInfoGetQueryInterface extends GetQueryInterface {
  id?: string;
  orderbooks_trades?: string;
  liquidations_info?: string;
  organization_id?: string;
}
