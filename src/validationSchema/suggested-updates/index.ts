import * as yup from 'yup';

export const suggestedUpdatesValidationSchema = yup.object().shape({
  suggested_info: yup.string().required(),
  user_id: yup.string().nullable(),
  bitcoin_info_id: yup.string().nullable(),
});
