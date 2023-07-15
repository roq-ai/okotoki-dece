import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getBitcoinInfoById, updateBitcoinInfoById } from 'apiSdk/bitcoin-infos';
import { Error } from 'components/error';
import { bitcoinInfoValidationSchema } from 'validationSchema/bitcoin-infos';
import { BitcoinInfoInterface } from 'interfaces/bitcoin-info';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function BitcoinInfoEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BitcoinInfoInterface>(
    () => (id ? `/bitcoin-infos/${id}` : null),
    () => getBitcoinInfoById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BitcoinInfoInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBitcoinInfoById(id, values);
      mutate(updated);
      resetForm();
      router.push('/bitcoin-infos');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BitcoinInfoInterface>({
    initialValues: data,
    validationSchema: bitcoinInfoValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Bitcoin Info
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="orderbooks_trades" mb="4" isInvalid={!!formik.errors?.orderbooks_trades}>
              <FormLabel>Orderbooks Trades</FormLabel>
              <Input
                type="text"
                name="orderbooks_trades"
                value={formik.values?.orderbooks_trades}
                onChange={formik.handleChange}
              />
              {formik.errors.orderbooks_trades && (
                <FormErrorMessage>{formik.errors?.orderbooks_trades}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="liquidations_info" mb="4" isInvalid={!!formik.errors?.liquidations_info}>
              <FormLabel>Liquidations Info</FormLabel>
              <Input
                type="text"
                name="liquidations_info"
                value={formik.values?.liquidations_info}
                onChange={formik.handleChange}
              />
              {formik.errors.liquidations_info && (
                <FormErrorMessage>{formik.errors?.liquidations_info}</FormErrorMessage>
              )}
            </FormControl>
            <AsyncSelect<OrganizationInterface>
              formik={formik}
              name={'organization_id'}
              label={'Select Organization'}
              placeholder={'Select Organization'}
              fetcher={getOrganizations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'bitcoin_info',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BitcoinInfoEditPage);
