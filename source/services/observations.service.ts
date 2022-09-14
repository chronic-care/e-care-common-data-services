import { isEmpty } from '@utils/util';
import { HttpException } from '@exceptions/HttpException';
import { fhirclient } from 'fhirclient/lib/types';
import Client from 'fhirclient/lib/Client';
import { Resource, Observation } from 'fhir/r4';

const fhirOptions: fhirclient.FhirOptions = {
  pageLimit: 0,
};

const resourcesFrom = (response: fhirclient.JsonObject): Resource[] => {
  const entries = (response[0] as fhirclient.JsonObject)?.entry as [fhirclient.JsonObject];
  return entries
    ?.map((entry: fhirclient.JsonObject) => entry.resource as any)
    .filter((resource: Resource) => resource.resourceType !== 'OperationOutcome');
};

class ObservationsService {
  public async getObservations(client: Client, subjectId: string, code: string, mode: string): Promise<Observation[]> {
    if (isEmpty(subjectId) || isEmpty(code)) throw new HttpException(400, 'subjectId and code is empty');

    let resources: Resource[] = [];

    const queryPath = 'Observation?code=http://loinc.org|' + code + '&_sort:desc=date' + '&_mode=' + mode;

    // await can be used only at top-level within a function, cannot use queryPaths.forEach()
    resources = resources.concat(resourcesFrom((await client.request(queryPath, fhirOptions)) as fhirclient.JsonObject) as Observation[]);

    resources = resources.filter(v => v !== undefined);
    const vitals = resources.filter((item: any) => item?.resourceType === 'Observation') as Observation[];

    return vitals;
  }
}

export default ObservationsService;
