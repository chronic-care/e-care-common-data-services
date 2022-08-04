import { fhirclient } from 'fhirclient/lib/types';
import { Resource, Observation, ServiceRequest } from '../fhir-types/fhir-r4';
import Client from 'fhirclient/lib/Client';


const resourcesFrom = (response: fhirclient.JsonObject): Resource[] => {
    const entries = (response[0] as fhirclient.JsonObject)?.entry as [fhirclient.JsonObject];
    return entries?.map((entry: fhirclient.JsonObject) => entry.resource as any)
                  .filter((resource: Resource) => resource.resourceType !== 'OperationOutcome');
};

const fhirOptions: fhirclient.FhirOptions = {
    pageLimit: 0,
};

// getting all Vitals
export async function getVitalSigns(client: Client): Promise<Observation[]> {

    if (client.state.serverUrl === 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4') {
      return []
    }

    var vitals: Observation[] = []
    const vitalsCodes = ['85354-9', '59408-5', '8310-5', '29463-7', '8302-2']
    const queryPaths = vitalsCodes.map(code => {
    return 'Observation?code=http://loinc.org|' + code + '&_sort:desc=date&_count=1'
  })

  vitals = vitals.concat( resourcesFrom(await client.patient.request(queryPaths[0], fhirOptions) as fhirclient.JsonObject) as Observation[] )
  vitals = vitals.concat( resourcesFrom(await client.patient.request(queryPaths[1], fhirOptions) as fhirclient.JsonObject) as Observation[] )
  vitals = vitals.concat( resourcesFrom(await client.patient.request(queryPaths[2], fhirOptions) as fhirclient.JsonObject) as Observation[] )
  vitals = vitals.concat( resourcesFrom(await client.patient.request(queryPaths[3], fhirOptions) as fhirclient.JsonObject) as Observation[] )
  vitals = vitals.concat( resourcesFrom(await client.patient.request(queryPaths[4], fhirOptions) as fhirclient.JsonObject) as Observation[] )
  vitals = vitals.filter(v => v !== undefined)
  return vitals
};

export default { getVitalSigns };
