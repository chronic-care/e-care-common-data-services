/* eslint-disable functional/immutable-data */
import { Condition } from 'fhir/r4';
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
  let conditionMap = new Map();
  let allThirdPartyMappedConditions: Condition[] = [];

  if (sdsClient) {
    try {
      // First Linkage request
      const linkages = await sdsClient.request('Linkage');
      // Loop through first set of linkages
      for (const entry of linkages.entry) {
        for (const item of entry.resource.item) {
          if (!conditionMap.has(JSON.stringify(item.resource.reference))) {
            conditionMap.set(JSON.stringify(item.resource.reference), JSON.stringify(item.resource.reference));

            if (item.type === 'source') {
              const urlSet = new Set();

              urlSet.add(launchURL)

              // Second Linkage request for each source item
              const linkages2 = await sdsClient.request('Linkage?item=' + item.resource.reference);

              // Loop through second set of linkages
              for (const entry2 of linkages2.entry) {
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
                    // const thirdPartyMappedGoals: MccGoalSummary[] = thirdPartyGoals.map(transformToMccGoalSummary);

                    thirdPartyGoals.forEach(condition => {

                      condition.code.text = condition.code.text + "(" + item2.resource.extension[0].valueUrl + ")"
                      allThirdPartyMappedConditions.push(condition);
                    });



                  }
                }
              }
            }
          }
        }
      }

    } catch (error) {
      // Code to handle the error
      console.error("An error occurred: " + error.message);
    }
  }
  return allThirdPartyMappedConditions;
};


export const getSummaryConditions = async (sdsURL: string, authURL: string, sdsScope: string): Promise<MccConditionList> => {
  const client = await FHIR.oauth2.ready();
  let sdsClient = await getSupplementalDataClient(client, sdsURL, authURL, sdsScope)

  const activeConcerns: MccConditionSummary[] = []
  const activeConditions: MccConditionSummary[] = []
  const inactiveConcerns: MccConditionSummary[] = []
  const inactiveConditions: MccConditionSummary[] = []

  const queryPath1 = `Condition?category=http%3A%2F%2Fterminology.hl7.org%2FCodeSystem%2Fcondition-category%7Cproblem-list-item`;
  const queryPath2 = `Condition?category=http%3A%2F%2Fhl7.org%2Ffhir%2Fus%2Fcore%2FCodeSystem%2Fcondition-category%7Chealth-concern`;
  const conditionRequest1: fhirclient.JsonObject = await client.patient.request(
    queryPath1
  );

  const conditionRequest2: fhirclient.JsonObject = await client.patient.request(
    queryPath2
  );

  let sdsfilteredConditions2: MccCondition[] = [];
  if (sdsClient) {
    const sdsconditionRequest2: fhirclient.JsonObject = await sdsClient.patient.request(
      queryPath2
    );
    sdsfilteredConditions2 = resourcesFrom(
      sdsconditionRequest2
    ) as MccCondition[];
  }



  // condition from problem list item
  const filteredConditions1: MccCondition[] = resourcesFrom(
    conditionRequest1
  ) as MccCondition[];

  // condition from health concern
  const filteredConditions2: MccCondition[] = resourcesFrom(
    conditionRequest2
  ) as MccCondition[];

  const thirdPartyStuff = await getSupplementalConditions(client.state.serverUrl, sdsClient);

  log.info(
    `getSummaryConditions - successful`
  );
  const filteredConditions = [...filteredConditions1, ...filteredConditions2, ...sdsfilteredConditions2, ...thirdPartyStuff]


  log.debug({ serviceName: 'getSummaryConditions', result: { filteredConditions } });


  const mappedFilterConditions = await Promise.all(filteredConditions.map(transformToConditionSummary))

  mappedFilterConditions.forEach(cond => {
    const clinicalStatus = cond.clinicalStatus
    const verificationStatus = cond.verificationStatus
    const status = `${clinicalStatus}:${verificationStatus}`
    const activeStatus = ACTIVE_KEYS[status];
    const categories = cond.categories;
    const isProblemOrEncounter = categories.includes("problem-list-item") || categories.includes("encounter-diagnosis");;
    const isHealthConcern = categories.includes("health-concern");


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
          log.info("Ignoring condition " + " status: " + activeStatus);
          break;
        default:
          log.info("Undefined State, Ignoring condition " + " status: " + activeStatus);
          break;
      }
    }
  })


  const mccConditionList: MccConditionList = {
    activeConcerns,
    activeConditions,
    inactiveConcerns,
    inactiveConditions
  }



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
