import { CarePlan, Condition } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { MccCarePlan, MccCondition } from '../../types/mcc-types';
import log from '../../utils/loglevel';

import {
  fhirOptions,
  getConceptDisplayString,
  notFoundResponse,
  resourcesFrom,
  resourcesFromObject,
} from './careplan.util';

export const getCareplans = async (sort?: string, max?: string): Promise<MccCarePlan[]> => {
  const sortType = sort === 'descending' ? '-date' : 'date';

  const client = await FHIR.oauth2.ready();

  const queryPath = `CarePlan?&_sort=${sortType}&_count=${max ?? 100}`;
  const careplanRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  const filteredCareplans: MccCarePlan[] = resourcesFrom(
    careplanRequest
  ) as MccCarePlan[];

  log.info(
    `getCareplans - successful with status ${filteredCareplans[0]?.status}`
  );
  log.debug({ serviceName: 'getCareplans', result: filteredCareplans });
  return filteredCareplans;
};

export const getCareplan = async (id: string): Promise<MccCarePlan> => {
  if (!id) {
    log.error('getCareplan - id not found');
    return notFoundResponse as unknown as MccCarePlan;
  }

  const client = await FHIR.oauth2.ready();

  const queryPath = `CarePlan?_id=${id}`;
  const careplanRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const filteredCareplan: MccCarePlan = resourcesFromObject(
    careplanRequest
  ) as MccCarePlan;

  log.info(
    `getCareplan - successful with id ${id} - with status ${filteredCareplan?.status}`
  );
  log.debug({ serviceName: 'getCareplan', result: filteredCareplan });
  return filteredCareplan;
};

export const getCareplansByStatusAndCategory = async (
  status: string,
  category: string[],
): Promise<MccCarePlan[]> => {
  if (!status || !category) {
    log.error('getCareplansByStatusAndCategory - status or category not found');
    return [notFoundResponse] as unknown as CarePlan[];
  }
  const client = await FHIR.oauth2.ready();

  const combinedCategory = category?.join(',');

  const queryPath = `CarePlan?status=${status}&category=${combinedCategory}`;
  const careplanRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  const filteredCareplans: MccCarePlan[] = resourcesFrom(
    careplanRequest
  ) as MccCarePlan[];

  log.info(
    `getCareplansByStatusAndCategory - successful with pre-response ${filteredCareplans[0]?.toString()} - with status ${filteredCareplans[0]?.status}`
  );
  log.debug({ serviceName: 'getCareplansByStatusAndCategory', result: filteredCareplans });
  return filteredCareplans;
};

export const getConditionFromUrl = async (urlPath: string): Promise<MccCondition> => {
  if (!urlPath) {
    log.error('getCondition - urlPath not found');
    return {} as unknown as MccCondition;
  }

  const client = await FHIR.oauth2.ready();

  const urlPaths = urlPath.split('/');

  const queryPath = `${urlPaths[0]}?_id=${urlPaths[1]}`;
  const conditionRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const filteredCondition: MccCondition = resourcesFromObject(
    conditionRequest
  ) as MccCondition;

  log.info(`getCondition - successful with urlPath ${urlPath}`);
  log.debug({ serviceName: 'getCondition', result: filteredCondition });
  return filteredCondition;
};

export const getBestCareplan = async (
  subject: string,
  matchScheme?: string
): Promise<MccCarePlan[]> => {
  if (!subject) {
    log.error('getBestCareplan - subject not found');
    return [] as MccCarePlan[];
  }

  const matchSchemeParam = matchScheme ?? 'profiles';

  const client = await FHIR.oauth2.ready();

  log.info(`getBestCareplan - start with subject - ${subject}`);
  const queryPath = `CarePlan?subject=${subject}&category=38717003`;
  const careplanRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath,
    fhirOptions
  );

  const careplanResource: MccCarePlan[] = resourcesFrom(
    careplanRequest
  ) as MccCarePlan[];

  const filteredCareplans: MccCarePlan[] = careplanResource.filter(
    (v) =>
      v !== undefined && v.resourceType === 'CarePlan' && v.status === 'active'
    // filter for address condition not needed by mcc-provider
  );

  // fallback
  if (!filteredCareplans.length) {
    log.error('getBestCareplan - empty careplan');
    return [{ id: 'NOID' }] as MccCarePlan[];
  }

  // sorting
  switch (matchSchemeParam) {
    case 'created':
      // eslint-disable-next-line functional/immutable-data
      filteredCareplans.sort((a, b): number => {
        if (!a.created) return -1;
        if (!b.created) return 1;

        return a.created.localeCompare(b.created);
      });
      break;
    case 'lastModified':
      // eslint-disable-next-line functional/immutable-data
      filteredCareplans.sort((a, b): number => {
        if (!a.meta?.lastUpdated) return -1;
        if (!b.meta?.lastUpdated) return 1;

        return a.meta?.lastUpdated.localeCompare(b.meta?.lastUpdated);
      });
      break;
    case 'profiles':
      // eslint-disable-next-line functional/immutable-data
      filteredCareplans.sort((a, b): number => {
        return a.addresses?.length - b.addresses?.length;
      });
      break;
    case 'order':
    default:
      break;
  }

  log.debug({
    serviceName: 'getBestCareplan (before filter condition)',
    result: filteredCareplans,
  });

  // filter out addresses by condition reference
  const responseCarePlans: MccCarePlan[] = await Promise.all(
    filteredCareplans.map(async (careplan: MccCarePlan) => {
      const addresses = await Promise.all(
        careplan.addresses.map(async (address) => {
          const condition: Condition = await getConditionFromUrl(address.reference);
          return {
            ...address,
            reference: getConceptDisplayString(condition.code),
          };
        })
      );

      const newCareplan = { ...careplan, addresses };
      return newCareplan;
    })
  );

  log.info(
    `getBestCareplan - successful with subject ${subject} - with status ${responseCarePlans[0].status}`
  );
  log.debug({ serviceName: 'getBestCareplan', result: responseCarePlans });
  return responseCarePlans;
};

// TODO: supported careplan with valueset integration on profilemap
export const getSupportedCarePlans = async (sort?: string, max?: string): Promise<MccCarePlan[]> => {
  const sortType = sort === 'descending' ? '-date' : 'date';

  const client = await FHIR.oauth2.ready();

  const queryPath = `CarePlan?&_sort=${sortType}&_count=${max ?? 100}`;
  const careplanRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  const filteredCareplans: MccCarePlan[] = resourcesFrom(
    careplanRequest
  ) as MccCarePlan[];

  const activeCareplans = filteredCareplans.filter((carePlan => carePlan.status === 'active'))

  log.info(
    `getSupportedCarePlans - successful with status ${activeCareplans[0]?.status}`
  );
  log.debug({ serviceName: 'getSupportedCarePlans', result: activeCareplans });
  return activeCareplans;
};
