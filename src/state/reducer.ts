import { State } from './state';
import { Patient, Diagnosis } from '../types';

export type Action =
  | {
      type: 'SET_PATIENT_LIST';
      payload: Patient[];
    }
  | {
      type: 'ADD_PATIENT';
      payload: Patient;
    }
  | {
      type: 'SET_PATIENT_TO_DISPLAY';
      payload: Patient | undefined;
    }
  | {
    type: 'SET_DIAGNOSES_LIST';
    payload: Diagnosis[]
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PATIENT_LIST':
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case 'SET_DIAGNOSES_LIST':
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        }
      };
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case 'SET_PATIENT_TO_DISPLAY':
      return {
        ...state,
        patientToDisplay: action.payload
      };
    default:
      return state;
  }
};

export const setPatientList = (patientsToSet: Patient[]): Action => {
  return {
    type: 'SET_PATIENT_LIST',
    payload: patientsToSet
  };
};

export const addPatient = (patientToAdd: Patient): Action => {
  return {
    type: 'ADD_PATIENT',
    payload: patientToAdd
  };
};

export const setPatientToDisplay = (patientToDisplay: Patient | undefined): Action => {
  return {
    type: 'SET_PATIENT_TO_DISPLAY',
    payload: patientToDisplay
  };
};

export const setDiagnosesList = (diagnosesToSet: Diagnosis[]): Action => {
  return {
    type: 'SET_DIAGNOSES_LIST',
    payload: diagnosesToSet
  };
};