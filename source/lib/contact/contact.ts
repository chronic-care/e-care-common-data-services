import { CareTeam, CareTeamParticipant, Practitioner, Resource } from 'fhir/r4';

import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { MccPatientContact } from '../../types/mcc-types';
import log from '../../utils/loglevel';

import { fhirOptions, resourcesFrom, transformToMccContact } from './contact.util';




export const getContacts = async (carePlanId?: string): Promise<MccPatientContact[]> => {
  const client = await FHIR.oauth2.ready();

  let careTeamMembers = new Map<string, Practitioner>()
  const _careTeamPath = "CareTeam?_include=CareTeam:participant";
  let careTeams: CareTeam[] | undefined
  let careTeamData: Resource[] = resourcesFrom(await client.patient.request(_careTeamPath, fhirOptions) as fhirclient.JsonObject)

  careTeams = careTeamData?.filter((item: any) => item.resourceType === 'CareTeam') as CareTeam[]
  const careTeamPractitioners =
    careTeamData?.filter((item: any) => item.resourceType === 'Practitioner') as Practitioner[]
  careTeamPractitioners?.forEach((pract: Practitioner) => {
    if (pract.id !== undefined && careTeamMembers.get(pract.id!) === undefined) {
      careTeamMembers.set(pract.id!, pract)
    }
  })


  let participants: CareTeamParticipant[] = [];

  if (careTeams) {
    let partArrays = careTeams.map(team => team.participant);
    participants = flatten(partArrays) as CareTeamParticipant[];
  }

  let array = Array.from(careTeamMembers, ([name, value]) => ({ name, value }));



  const mappedPatientContacts = array.map(contact => transformToMccContact(participants, contact.value))

  log.debug({ serviceName: 'getContacts', result: { contacts: mappedPatientContacts, carePlanId } });
  return mappedPatientContacts;
};

function flatten(arr?: any) {
  return arr?.reduce(function (flat: any, toFlatten: any) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}
