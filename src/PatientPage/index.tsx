import React from 'react';
import axios from 'axios';
import { Patient, Gender } from '../types';
import { useParams } from 'react-router-dom';
import { updatePatient, useStateValue } from '../state';
import { apiBaseUrl } from '../constants';
import { Container, Header, Loader, Icon, Label, Dimmer, List, Button } from 'semantic-ui-react';
import { setPatientToDisplay } from '../state';
import EntryComponent from '../components/EntryComponents';
import AddHealthCheckEntryModal from '../AddEntryModal';
import { EntryFormValues } from '../AddEntryModal';

const PatientPage = () => {
  const [{ patientToDisplay }, dispatch] = useStateValue();
  const [{ diagnoses }, ] = useStateValue();
  const [displayModal, setDisplayModal] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const { id } = useParams<{ id: string }>();

  const openModal = (): void => { setDisplayModal(true); };
  const closeModal = (): void => {
    setDisplayModal(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const date = `${mm}-${dd}-${yyyy}`;
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        { ...values, date: date}
      );
      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        setError('Could not create new entry. Check that you have formatted the fields correctly.');
      }
    }
  };

  React.useEffect(() => {
    if ((patientToDisplay && patientToDisplay.id !== id) || !patientToDisplay) {
      dispatch(setPatientToDisplay(undefined));
      const fetchPatientToDisplay = async () => {
        try {
          const { data: patientToDisplay } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch(setPatientToDisplay(patientToDisplay));
        } catch (e) {
          console.error(e);
        }
      };
      void fetchPatientToDisplay();
    }
  }, []);


  const GenderIconToDisplay = (): JSX.Element => {
    if (!patientToDisplay) { return (<></>); }
    if (patientToDisplay.gender === Gender.Male) { return (<Icon name='mars' />); }
    if (patientToDisplay.gender === Gender.Female ) { return (<Icon name='venus' />); }
    return (<Icon name='genderless' />);
  };

  if (!patientToDisplay || !diagnoses) {
    return (
      <div>
        <Container textAlign='center'>
        <Dimmer active>
          <Loader>Loading</Loader>
        </Dimmer>
        </Container>       
      </div>
      
    );
  }

  return (
    <div>
      <Container textAlign='left'>
        <Header as='h2'>{patientToDisplay.name} <GenderIconToDisplay /></Header>
        <Label>{patientToDisplay.ssn}</Label>
        <Label>{patientToDisplay.occupation}</Label>
        <List>
          {patientToDisplay.entries.map(entry => 
            <List.Item key={entry.id}>
              <EntryComponent entry={entry} />
            </List.Item>
          )}
        </List>
      </Container>
      <AddHealthCheckEntryModal 
        modalOpen={displayModal} 
        onClose={() => closeModal() } 
        onSubmit={submitNewEntry}
        error={error}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
      
    </div>
  );
};

export default PatientPage;