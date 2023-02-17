import { Patient, PatientContact } from 'fhir/r4';
import FHIR from 'fhirclient';

import log from '../../utils/loglevel';

export const getContacts = async (): Promise<PatientContact[]> => {
  const client = await FHIR.oauth2.ready();

  const currentPatient: Patient = await client.patient.read();

  const patientContacts: PatientContact[] = currentPatient.contact;

  const currentDate = new Date().toLocaleString();

  const activePatientContacts = patientContacts.filter(contact => {
    // is in period
    if (contact.period.start) {
      if (currentDate.localeCompare(contact.period.start) < 0) {
        return false;
      }
    }
    if (contact.period.end) {
      if (currentDate.localeCompare(contact.period.end) > 0) {
        return false;
      }
    }
    return true;
  })

  // TODO:
  /*
  check for general practicioner, map it to contact

  search for careplan id
  get care team and map it to contact

  map activepatientcontact to contact

  return contact
  */

  log.debug({ serviceName: 'getContacts', result: activePatientContacts });
  return activePatientContacts;
};
