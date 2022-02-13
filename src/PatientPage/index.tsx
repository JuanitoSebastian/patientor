import React from 'react';
import axios from "axios";
import { Patient, Gender } from '../types';
import { useParams } from 'react-router-dom';
import { useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Container, Header, Loader, Icon, Label, Dimmer } from 'semantic-ui-react';
import { setPatientToDisplay } from '../state';


const PatientPage = () => {
  const [{ patientToDisplay }, dispatch] = useStateValue();

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
    if (patientToDisplay.gender === Gender.Male) { return MaleIcon(); }
    if (patientToDisplay.gender === Gender.Female ) { return FemaleIcon(); }
    return OtherIcon();
  };

  if (!patientToDisplay) {
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
      </Container>
    </div>
  );
};

const MaleIcon = (): JSX.Element => (
  <Icon name='mars' />
);

const FemaleIcon = (): JSX.Element => (
  <Icon name='venus' />
);

const OtherIcon = () => (
  <Icon name='genderless' />
);


export default PatientPage;