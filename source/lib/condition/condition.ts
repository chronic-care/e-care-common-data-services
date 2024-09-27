/* eslint-disable functional/immutable-data */
import { Condition, Provenance } from 'fhir/r4';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';
import { fhirclient } from 'fhirclient/lib/types';

import { MccCondition, MccConditionList, MccConditionSummary } from '../../types/mcc-types';
import log from '../../utils/loglevel';
import { getSupplementalDataClient } from '../goal/goal.util';
import {
  notFoundResponse,
  resourcesFrom,
  resourcesFromObject,
  transformToConditionSummary,
} from './condition.util';

enum ACTIVE_STATUS {
  ACTIVE,
  INACTIVE,
  IGNORE
}

const ACTIVE_KEYS = {
  "active:confirmed": ACTIVE_STATUS.ACTIVE,
  "active:provisional": ACTIVE_STATUS.ACTIVE,
  "active:missing": ACTIVE_STATUS.ACTIVE,
  "active:undefined": ACTIVE_STATUS.ACTIVE,
  "active:differential": ACTIVE_STATUS.ACTIVE,
  "active:unconfirmed": ACTIVE_STATUS.ACTIVE,
  "active:refuted": ACTIVE_STATUS.INACTIVE,
  "active:entered-in-error": ACTIVE_STATUS.IGNORE,
  "recurrence:confirmed": ACTIVE_STATUS.ACTIVE,
  "recurrence:provisional": ACTIVE_STATUS.ACTIVE,
  "recurrence:missing": ACTIVE_STATUS.ACTIVE,
  "recurrence:undefined": ACTIVE_STATUS.ACTIVE,
  "recurrence:differential": ACTIVE_STATUS.ACTIVE,
  "recurrence:unconfirmed": ACTIVE_STATUS.ACTIVE,
  "recurrence:refuted": ACTIVE_STATUS.INACTIVE,
  "recurrence:entered-in-error": ACTIVE_STATUS.IGNORE,
  "relapse:confirmed": ACTIVE_STATUS.ACTIVE,
  "relapse:provisional": ACTIVE_STATUS.ACTIVE,
  "relapse:missing": ACTIVE_STATUS.ACTIVE,
  "relapse:undefined": ACTIVE_STATUS.ACTIVE,
  "relapse:differential": ACTIVE_STATUS.ACTIVE,
  "relapse:unconfirmed": ACTIVE_STATUS.ACTIVE,
  "relapse:refuted": ACTIVE_STATUS.INACTIVE,
  "relapse:entered-in-error": ACTIVE_STATUS.IGNORE,
  "inactive:confirmed": ACTIVE_STATUS.INACTIVE,
  "inactive:provisional": ACTIVE_STATUS.INACTIVE,
  "inactive:missing": ACTIVE_STATUS.INACTIVE,
  "inactive:undefined": ACTIVE_STATUS.INACTIVE,
  "inactive:differential": ACTIVE_STATUS.INACTIVE,
  "inactive:unconfirmed": ACTIVE_STATUS.INACTIVE,
  "inactive:refuted": ACTIVE_STATUS.INACTIVE,
  "inactive:entered-in-error": ACTIVE_STATUS.IGNORE,
  "remission:confirmed": ACTIVE_STATUS.INACTIVE,
  "remission:provisional": ACTIVE_STATUS.INACTIVE,
  "remission:missing": ACTIVE_STATUS.INACTIVE,
  "remission:undefined": ACTIVE_STATUS.INACTIVE,
  "remission:differential": ACTIVE_STATUS.INACTIVE,
  "remission:unconfirmed": ACTIVE_STATUS.INACTIVE,
  "remission:refuted": ACTIVE_STATUS.INACTIVE,
  "remission:entered-in-error": ACTIVE_STATUS.IGNORE,
  "resolved:confirmed": ACTIVE_STATUS.INACTIVE,
  "resolved:provisional": ACTIVE_STATUS.INACTIVE,
  "resolved:missing": ACTIVE_STATUS.INACTIVE,
  "resolved:undefined": ACTIVE_STATUS.INACTIVE,
  "resolved:differential": ACTIVE_STATUS.INACTIVE,
  "resolved:unconfirmed": ACTIVE_STATUS.INACTIVE,
  "resolved:refuted": ACTIVE_STATUS.INACTIVE,
  "resolved:entered-in-error": ACTIVE_STATUS.IGNORE,
}


export const getSupplementalConditions = async (launchURL: string, sdsClient: Client): Promise<Condition[]> => {
  let allThirdPartyMappedConditions: Condition[] = [];

  if (sdsClient) {
    try {
      const linkages = await sdsClient.request('Linkage?item=Patient/' + sdsClient.patient.id);
      console.log("patientId +linkages " + JSON.stringify(linkages));
      const urlSet = new Set();

      urlSet.add(launchURL)
      // Loop through second set of linkages
      for (const entry2 of linkages.entry) {
        for (const item2 of entry2.resource.item) {
          if (item2.type === 'alternate' && !urlSet.has(item2.resource.extension[0].valueUrl)) {
            urlSet.add(item2.resource.extension[0].valueUrl);
            // Prepare FHIR request headers
            const fhirHeaderRequestOption = {} as fhirclient.RequestOptions;
            const fhirHeaders = {
              'X-Partition-Name': item2.resource.extension[0].valueUrl
            };
            fhirHeaderRequestOption.headers = fhirHeaders;
            fhirHeaderRequestOption.url = 'Condition?subject=' + item2.resource.reference;

            // Fetch third-party goals
            const response = await sdsClient.request(fhirHeaderRequestOption);

            // Process third-party goals
            const thirdPartyGoals: Condition[] = resourcesFrom(response) as Condition[];
            thirdPartyGoals.forEach(condition => {

              condition.code.text = condition.code.text + "(" + item2.resource.extension[0].valueUrl + ")"
              allThirdPartyMappedConditions.push(condition);
            });
          }
        }
      }
    } catch (error) {
      console.error("patientId An error occurred: " + error.message);
    }
  }
  return allThirdPartyMappedConditions;
};


export const getSummaryConditions = async (sdsURL: string, authURL: string, sdsScope: string): Promise<MccConditionList> => {
  const client = await FHIR.oauth2.ready();
  let sdsClient = await getSupplementalDataClient(client, sdsURL, authURL, sdsScope);

  const activeConcerns: MccConditionSummary[] = [];
  const activeConditions: MccConditionSummary[] = [];
  const inactiveConcerns: MccConditionSummary[] = [];
  const inactiveConditions: MccConditionSummary[] = [];

  const queryPath1 = `Condition?category=http%3A%2F%2Fterminology.hl7.org%2FCodeSystem%2Fcondition-category%7Cproblem-list-item%&_revinclude=Provenance:target`;
  const queryPath2 = `Condition?category=http%3A%2F%2Fhl7.org%2Ffhir%2Fus%2Fcore%2FCodeSystem%2Fcondition-category%7Chealth-concern%&_revinclude=Provenance:target`;

  const conditionRequest1: fhirclient.JsonObject = await client.patient.request(queryPath1);
  const conditionRequest2: fhirclient.JsonObject = await client.patient.request(queryPath2);

  let sdsfilteredConditions2: MccCondition[] = [];
  if (sdsClient) {
    const sdsconditionRequest2: fhirclient.JsonObject = await sdsClient.patient.request(queryPath2);
    sdsfilteredConditions2 = resourcesFrom(sdsconditionRequest2) as MccCondition[];
  }

  const resources1 = resourcesFrom(conditionRequest1);
  const resources2 = resourcesFrom(conditionRequest2);

  const conditions1: MccCondition[] = resources1.filter(r => r.resourceType === 'Condition') as MccCondition[];
  const conditions2: MccCondition[] = resources2.filter(r => r.resourceType === 'Condition') as MccCondition[];

  const provenance1: Provenance[] = resources1.filter(r => r.resourceType === 'Provenance') as Provenance[];
  const provenance2: Provenance[] = resources2.filter(r => r.resourceType === 'Provenance') as Provenance[];

  const provenanceMap: Map<string, Provenance[]> = new Map();

  // Function to map Provenance to their corresponding Condition
  const recordProvenance = (provenances: Provenance[]) => {
    provenances.forEach((prov: Provenance) => {
      prov.target.forEach((ref: any) => {
        const resourceId = ref.reference;
        if (resourceId) {
          let provList: Provenance[] = provenanceMap.get(resourceId) || [];
          provList = provList.concat([prov]);
          provenanceMap.set(resourceId, provList);
        }
      });
    });
  };

  // Record Provenance for both condition requests
  recordProvenance(provenance1);
  recordProvenance(provenance2);

  const filteredConditions = [...conditions1, ...conditions2, ...sdsfilteredConditions2];

  const mappedFilterConditions = await Promise.all(
    filteredConditions.map(async (condition) => {
      const transformedCondition = await transformToConditionSummary(condition);

      // Attach the Provenance data from the map to the transformed condition
      const provenance = provenanceMap.get(`Condition/${condition.id}`) || [];
      transformedCondition.provenance = provenance;  // Attach Provenance to the condition

      return transformedCondition;
    })
  );

  mappedFilterConditions.forEach((cond) => {
    const clinicalStatus = cond.clinicalStatus;
    const verificationStatus = cond.verificationStatus;
    const status = `${clinicalStatus}:${verificationStatus}`;
    const activeStatus = ACTIVE_KEYS[status];
    const categories = cond.categories;
    const isProblemOrEncounter = categories.includes('problem-list-item') || categories.includes('encounter-diagnosis');
    const isHealthConcern = categories.includes('health-concern');

    if (!isNaN(activeStatus)) {
      switch (activeStatus) {
        case ACTIVE_STATUS.ACTIVE:
          if (isHealthConcern) {
            activeConcerns.push(cond);
          }
          if (isProblemOrEncounter) {
            activeConditions.push(cond);
          }
          break;
        case ACTIVE_STATUS.INACTIVE:
          if (isProblemOrEncounter) {
            inactiveConditions.push(cond);
          }
          if (isHealthConcern) {
            inactiveConcerns.push(cond);
          }
          break;
        case ACTIVE_STATUS.IGNORE:
          log.info('Ignoring condition ' + ' status: ' + activeStatus);
          break;
        default:
          log.info('Undefined State, Ignoring condition ' + ' status: ' + activeStatus);
          break;
      }
    }
  });

  const mccConditionList: MccConditionList = {
    activeConcerns,
    activeConditions,
    inactiveConcerns,
    inactiveConditions
  };

  return mccConditionList;
};



export const getConditions = async (): Promise<MccCondition[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `Condition`;
  const conditionRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  log.debug({ condRequest: conditionRequest })

  const filteredConditions: MccCondition[] = resourcesFrom(
    conditionRequest
  ) as MccCondition[];

  log.info(
    `getConditions - successful`
  );
  log.debug({ serviceName: 'getConditions', result: filteredConditions });
  return filteredConditions;
};

export const getCondition = async (id: string): Promise<MccCondition> => {
  if (!id) {
    log.error('getCondition - id not found');
    return notFoundResponse as unknown as MccCondition;
  }

  const client = await FHIR.oauth2.ready();

  const queryPath = `Condition?_id=${id}`;
  const conditionRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const filteredCondition: MccCondition = resourcesFromObject(
    conditionRequest
  ) as MccCondition;

  log.info(
    `getCondition - successful with id ${id}`
  );
  log.debug({ serviceName: 'getCondition', result: filteredCondition });
  return filteredCondition;
};

export const getConditionUrl = async (url: string): Promise<MccCondition> => {
  if (!url) {
    log.error('getCondition - id not found');
    return notFoundResponse as unknown as MccCondition;
  }

  const client = await FHIR.oauth2.ready();

  const conditionRequest: fhirclient.JsonObject = await client.patient.request(
    url
  );

  log.debug({ serviceName: 'getConditionUrl', conditionRequest });

  const filteredCondition: MccCondition = resourcesFromObject(
    conditionRequest
  ) as MccCondition;

  log.info(
    `getCondition - successful with url ${url}`
  );
  log.debug({ serviceName: 'getCondition', result: filteredCondition });
  return filteredCondition;
};
