import React from 'react';
import { Modal, Segment, Tab } from 'semantic-ui-react';
import { AddHealthCheckEntryForm, HealthCheckEntryFormValues } from './AddHealthCheckEntryForm';
import { AddHospitalEntryForm, HospitalEntryFormValues } from './HospitalEntryForm';
import { OccupationalHealthCareEntryForm, OccupationalHealthCareEntryValues } from './OccupationalHealthCareEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  error?: string;
}

export type EntryFormValues = HealthCheckEntryFormValues | HospitalEntryFormValues | OccupationalHealthCareEntryValues;

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => {

  const HealthCheckEntryPane = () => (
    <Tab.Pane><AddHealthCheckEntryForm onSubmit={onSubmit} onCancel={onClose} /></Tab.Pane>
  );

  const OccupationalHealthCareEntryPane = () => (
    <Tab.Pane><OccupationalHealthCareEntryForm onSubmit={onSubmit} onCancel={onClose} /></Tab.Pane>
  );

  const HospitalEntryPane = () => (
    <Tab.Pane><AddHospitalEntryForm onSubmit={onSubmit} onCancel={onClose} /></Tab.Pane>
  );

  const panes = [
    { menuItem : 'Health Check', render: HealthCheckEntryPane },
    { menuItem : 'Hospital', render: HospitalEntryPane },
    { menuItem : 'Occupational', render: OccupationalHealthCareEntryPane }
  ];

  
  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Modal.Header>Add a new entry for patient</Modal.Header>
      <Modal.Content>
        {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
        <Tab panes={panes} />
      </Modal.Content>
    </Modal>
  );
};

export default AddEntryModal;
