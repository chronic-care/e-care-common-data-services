import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';
import { Resource, Patient, Observation } from '../fhir-types/fhir-r4';
import { FHIRData, hasScope } from './models/fhirResources';
import Client from 'fhirclient/lib/Client';


const resourcesFrom = (response: fhirclient.JsonObject): Resource[] => {
    const entries = (response[0] as fhirclient.JsonObject)?.entry as [fhirclient.JsonObject];
    return entries?.map((entry: fhirclient.JsonObject) => entry.resource as any)
                  .filter((resource: Resource) => resource.resourceType !== 'OperationOutcome');
  };

  const fhirOptions: fhirclient.FhirOptions = {
    pageLimit: 0,
  };
  
  export async function getVitalSigns(client: Client): Promise<Observation[]> {
    //let patientId: string = req.params.id;
    let patientId: string= client.req.patientId;
    let code: string = client.req.code;
    var vitals: Observation[] = []
    
    client.state.serverUrl = 'https://gw.interop.community/SyntheaTest8/data'; 
    const query = new URLSearchParams(); 
    query.set("patient", patientId);
    query.set("code", 'http://loinc.org|'+code);

    return client.request("Observation?" + query, {
      pageLimit: 0,
      flat: true
    }).then(vitals => {
      const getVitalSigns = client.byCode(vitals, "code");        
    }).catch(error => {
      return error;
  });  
  }
    //return res.status(200).json({ test: 'success' });

export const getFHIRData = async (): Promise<FHIRData> => {
  const client = await FHIR.oauth2.ready();
  const clientScope = client?.state.tokenResponse?.scope
  const patient: Patient = await client.patient.read() as Patient;
  console.time('FHIR queries')
  console.log('Vitals request: ' + new Date().toLocaleTimeString())
  const vitalSigns = (hasScope(clientScope, 'Observation.read')? await getVitalSigns(client): undefined)
  console.log('All FHIR requests finished: ' + new Date().toLocaleTimeString())
  console.timeEnd('FHIR queries')
  return {
    clientScope,
    patient,
    vitalSigns,
  }
}
