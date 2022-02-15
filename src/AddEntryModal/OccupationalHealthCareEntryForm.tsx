import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { Field, Formik, Form } from 'formik';

import { DiagnosisSelection, TextField } from '../AddPatientModal/FormField';
import { useStateValue } from '../state';
import { Diagnosis, OccupationalHealthCareEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/ban-types
export type OccupationalHealthCareEntryValues = Omit<OccupationalHealthCareEntry, 'id' | 'date'>;

interface Props {
  onSubmit: (values: OccupationalHealthCareEntryValues) => void;
  onCancel: () => void;
}

export const OccupationalHealthCareEntryForm = ({ onSubmit, onCancel }: Props ) => {
  const [{ diagnoses }] = useStateValue();

  const diagnosesArray: Diagnosis[] = Object.values(diagnoses);

  return (
    <Formik
      initialValues={{
        type: 'OccupationalHealthcare',
        description: '',
        specialist: '',
        employerName: '',
        sickLeave: {
          startDate: '',
          endDate: ''
        }
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }

        if (!values.employerName) {
          errors.employerNane = requiredError;
        }
        
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Describe the situation"
              name="description"
              component={TextField}
            />
            <Field
              label="Name of Specialist"
              placeholder="Dr. House"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={diagnosesArray}
            />
            <Field
              label='Employer'
              placeHolder='Acme Corporation'
              name="employerName"
              component={TextField}
            />
            <Field
              label='Sick Leave Starts (YYYY-MM-DD):'
              placeHolder=''
              name="sickLeave.startDate"
              component={TextField}
            />
            <Field
              label='Sick Leave Ends (YYYY-MM-DD):'
              placeHolder=''
              name="sickLeave.endDate"
              component={TextField}
            />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add Entry
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}

    </Formik>
  );

};