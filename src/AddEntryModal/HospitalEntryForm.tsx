import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { DiagnosisSelection, TextField } from "../AddPatientModal/FormField";
import { useStateValue } from "../state";
import { Diagnosis, HospitalEntry } from "../types";

// eslint-disable-next-line @typescript-eslint/ban-types
export type HospitalEntryFormValues = Omit<HospitalEntry, 'id' | 'date'>;

interface Props {
  onSubmit: (values: HospitalEntryFormValues) => void;
  onCancel: () => void;
}

export const AddHospitalEntryForm = ({ onSubmit, onCancel }: Props ) => {
  const [{ diagnoses }] = useStateValue();

  const diagnosesArray: Diagnosis[] = Object.values(diagnoses);

  return (
    <Formik
      initialValues={{
        type: 'Hospital',
        description: '',
        specialist: '',
        discharge: {
          date: '',
          criteria: ''
        }
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }

        if (!values.discharge.criteria || !values.discharge.date) {
          errors.discharge = requiredError;
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
              label='Discharged until (YYYY-MM-DD)'
              placeHolder='2022-12-31'
              name="discharge.date"
              component={TextField}
            />
            <Field
              label='Discharge criteria'
              placeHolder=''
              name="discharge.criteria"
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