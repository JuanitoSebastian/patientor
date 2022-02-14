import React from 'react';
import { Segment, Header, Icon, List } from 'semantic-ui-react';
import { useStateValue } from '../state';
import { Entry, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthCareEntry } from '../types';

const EntryComponent = ({ entry }: { entry: Entry }): JSX.Element => {
  const [{ diagnoses },] = useStateValue();

  const getDiagnosisName = (diagnosisCode: string): JSX.Element => {
    return diagnoses[diagnosisCode]
      ? (<b>{diagnoses[diagnosisCode].name}</b>)
      : (<i>Name of diagnosis not available</i>);
  };

  const HealthCheckRatingIcon = ({ rating }: { rating: HealthCheckRating }): JSX.Element => {
    switch (rating) {
    case HealthCheckRating.Healthy:
      return (<Icon name='heart' color='green' />);
    case HealthCheckRating.LowRisk:
      return (<Icon name='heart' color='yellow' />);
    case HealthCheckRating.HighRisk:
      return (<Icon name='heart' color='orange' />);
    default: return (<Icon name='heart' color='orange' />);
    }
  };

  const HospitalEntryComponent = ({ entry }: { entry: HospitalEntry }) => (
    <Segment>
      <Header as='h3'>{entry.date} <Icon name='hospital' /></Header>
      <p>{entry.description}</p>
      <DiagnosesTags diagnosesCodes={entry.diagnosisCodes} />
    </Segment>
  );


  const OccupationalHealthCareEntryComponent = ({ entry }: { entry: OccupationalHealthCareEntry }) => (
    <Segment>
      <Header as='h3'>{entry.date} <Icon name='stethoscope' /></Header>
      <p>{entry.description}</p>
      <DiagnosesTags diagnosesCodes={entry.diagnosisCodes} />
    </Segment>
  );

  const HealthCheckEntryComponent = ({ entry }: { entry: HealthCheckEntry }) => (
    <Segment>
      <Header as='h3'>{entry.date} <Icon name='doctor' /></Header>
      <p>{entry.description}</p>
      <DiagnosesTags diagnosesCodes={entry.diagnosisCodes} />
      <HealthCheckRatingIcon rating={entry.healthCheckRating} />
    </Segment>
  );

  const DiagnosesTags = ({ diagnosesCodes }: { diagnosesCodes: string[] | undefined }) => {
    if (diagnosesCodes) {
      return (
        <List bulleted>
          {diagnosesCodes.map(diagnosisCode =>
            <List.Item key={diagnosisCode}>{diagnosisCode}: {getDiagnosisName(diagnosisCode)}</List.Item>
          )}
        </List>
      );
    }
    return null;
  };

  switch (entry.type) {
    case 'HealthCheck':
      return (<HealthCheckEntryComponent entry={entry} />);
    case 'Hospital':
      return (<HospitalEntryComponent entry={entry} />);
    case 'OccupationalHealthcare':
      return (<OccupationalHealthCareEntryComponent entry={entry} />);
    default:
      return assertNever(entry);
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export default EntryComponent;