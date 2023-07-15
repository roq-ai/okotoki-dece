import axios from 'axios';
import queryString from 'query-string';
import { BitcoinInfoInterface, BitcoinInfoGetQueryInterface } from 'interfaces/bitcoin-info';
import { GetQueryInterface } from '../../interfaces';

export const getBitcoinInfos = async (query?: BitcoinInfoGetQueryInterface) => {
  const response = await axios.get(`/api/bitcoin-infos${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBitcoinInfo = async (bitcoinInfo: BitcoinInfoInterface) => {
  const response = await axios.post('/api/bitcoin-infos', bitcoinInfo);
  return response.data;
};

export const updateBitcoinInfoById = async (id: string, bitcoinInfo: BitcoinInfoInterface) => {
  const response = await axios.put(`/api/bitcoin-infos/${id}`, bitcoinInfo);
  return response.data;
};

export const getBitcoinInfoById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/bitcoin-infos/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBitcoinInfoById = async (id: string) => {
  const response = await axios.delete(`/api/bitcoin-infos/${id}`);
  return response.data;
};
