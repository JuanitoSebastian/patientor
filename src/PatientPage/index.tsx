import React from 'react';
import axios from "axios";
import { Patient, Gender } from '../types';
import { useParams } from 'react-router-dom';
import { useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Container, Header, Loader, Icon, Label, Dimmer, List } from 'semantic-ui-react';
import { setPatientToDisplay } from '../state';
import EntryComponent from '../components/EntryComponents';

const PatientPage = () => {
  const [{ patientToDisplay }, dispatch] = useStateValue();
  const [{ diagnoses }, ] = useStateValue();

  const { id } = useParams<{ id: string }>();

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
    </div>
  );
};

export default PatientPage;