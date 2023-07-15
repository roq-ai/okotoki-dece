import axios from 'axios';
import queryString from 'query-string';
import { SuggestedUpdatesInterface, SuggestedUpdatesGetQueryInterface } from 'interfaces/suggested-updates';
import { GetQueryInterface } from '../../interfaces';

export const getSuggestedUpdates = async (query?: SuggestedUpdatesGetQueryInterface) => {
  const response = await axios.get(`/api/suggested-updates${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSuggestedUpdates = async (suggestedUpdates: SuggestedUpdatesInterface) => {
  const response = await axios.post('/api/suggested-updates', suggestedUpdates);
  return response.data;
};

export const updateSuggestedUpdatesById = async (id: string, suggestedUpdates: SuggestedUpdatesInterface) => {
  const response = await axios.put(`/api/suggested-updates/${id}`, suggestedUpdates);
  return response.data;
};

export const getSuggestedUpdatesById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/suggested-updates/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSuggestedUpdatesById = async (id: string) => {
  const response = await axios.delete(`/api/suggested-updates/${id}`);
  return response.data;
};
