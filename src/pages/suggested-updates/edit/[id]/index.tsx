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
import { getSuggestedUpdatesById, updateSuggestedUpdatesById } from 'apiSdk/suggested-updates';
import { Error } from 'components/error';
import { suggestedUpdatesValidationSchema } from 'validationSchema/suggested-updates';
import { SuggestedUpdatesInterface } from 'interfaces/suggested-updates';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { BitcoinInfoInterface } from 'interfaces/bitcoin-info';
import { getUsers } from 'apiSdk/users';
import { getBitcoinInfos } from 'apiSdk/bitcoin-infos';

function SuggestedUpdatesEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SuggestedUpdatesInterface>(
    () => (id ? `/suggested-updates/${id}` : null),
    () => getSuggestedUpdatesById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SuggestedUpdatesInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSuggestedUpdatesById(id, values);
      mutate(updated);
      resetForm();
      router.push('/suggested-updates');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SuggestedUpdatesInterface>({
    initialValues: data,
    validationSchema: suggestedUpdatesValidationSchema,
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
            Edit Suggested Updates
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
            <FormControl id="suggested_info" mb="4" isInvalid={!!formik.errors?.suggested_info}>
              <FormLabel>Suggested Info</FormLabel>
              <Input
                type="text"
                name="suggested_info"
                value={formik.values?.suggested_info}
                onChange={formik.handleChange}
              />
              {formik.errors.suggested_info && <FormErrorMessage>{formik.errors?.suggested_info}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<BitcoinInfoInterface>
              formik={formik}
              name={'bitcoin_info_id'}
              label={'Select Bitcoin Info'}
              placeholder={'Select Bitcoin Info'}
              fetcher={getBitcoinInfos}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.orderbooks_trades}
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
    entity: 'suggested_updates',
    operation: AccessOperationEnum.UPDATE,
  }),
)(SuggestedUpdatesEditPage);
