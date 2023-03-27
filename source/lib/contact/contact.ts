import { CareTeamParticipant, Patient, Reference } from 'fhir/r4';
import FHIR from 'fhirclient';

import { MccCarePlan, MccPatientContact, PatientContactRole } from '../../types/mcc-types';
import log from '../../utils/loglevel';
import { getCareplan } from '../careplan';

import { transformToMccContact } from './contact.util';

export const getContacts = async (carePlanId?: string): Promise<MccPatientContact[]> => {
  const client = await FHIR.oauth2.ready();

  const currentPatient: Patient = await client.patient.read();

  const patientContacts: PatientContactRole[] = [{ ...currentPatient, role: 'Patient' } as PatientContactRole];
  log.debug({ serviceName: 'getContacts', result: { patientContacts: patientContacts, carePlanId } });

  const contactCarePlan: MccCarePlan = await getCareplan(carePlanId);

  if (contactCarePlan && Array.isArray(contactCarePlan.careTeam) && contactCarePlan.careTeam.length > 0) {
    log.debug({ serviceName: 'getContacts', result: { referenceContact: contactCarePlan.careTeam[0].reference, carePlanId } });
    try {
      const contactCareTeamRequest = await client.request(
        contactCarePlan.careTeam[0].reference
      );
      log.debug({ serviceName: 'getContacts', result: { contactCareTeamRequest: contactCareTeamRequest, carePlanId } });

      const contactCareTeamDetail: PatientContactRole[] = await Promise.all((contactCareTeamRequest.participant as CareTeamParticipant[]).map(async (careTeam) => {
        const careTeamDetail = await client.request((careTeam.member as Reference).reference);
        return { ...careTeamDetail, role: careTeam.role[0].text };
      }))

      log.debug({ serviceName: 'getContacts', result: { contactCareTeamDetail: contactCareTeamDetail, carePlanId } });

      // eslint-disable-next-line functional/immutable-data
      patientContacts.push(...contactCareTeamDetail);

    } catch (error) {
      log.error({ serviceName: 'getContacts', result: { error: error, carePlanId } });
    }
  }

  const currentDate = new Date().toLocaleString();

  const activePatientContacts = patientContacts.filter(contact => {
    // is in period
    if (contact.period && contact.period.start) {
      if (currentDate.localeCompare(contact.period.start) < 0) {
        return false;
      }
    }
    if (contact.period && contact.period.end) {
      if (currentDate.localeCompare(contact.period.end) > 0) {
        return false;
      }
    }
    return true;
  })

  const mappedPatientContacts = activePatientContacts.map(contact => transformToMccContact(contact));

  log.debug({ serviceName: 'getContacts', result: { contacts: mappedPatientContacts, carePlanId } });
  return mappedPatientContacts;
};
