import { UserInterface } from 'interfaces/user';
import { BitcoinInfoInterface } from 'interfaces/bitcoin-info';
import { GetQueryInterface } from 'interfaces';

export interface SuggestedUpdatesInterface {
  id?: string;
  suggested_info: string;
  user_id?: string;
  bitcoin_info_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  bitcoin_info?: BitcoinInfoInterface;
  _count?: {};
}

export interface SuggestedUpdatesGetQueryInterface extends GetQueryInterface {
  id?: string;
  suggested_info?: string;
  user_id?: string;
  bitcoin_info_id?: string;
}
