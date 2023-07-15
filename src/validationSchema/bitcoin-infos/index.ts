import * as yup from 'yup';

export const bitcoinInfoValidationSchema = yup.object().shape({
  orderbooks_trades: yup.string().required(),
  liquidations_info: yup.string().required(),
  organization_id: yup.string().nullable(),
});
