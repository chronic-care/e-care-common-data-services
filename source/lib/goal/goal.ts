/* eslint-disable functional/immutable-data */
import localForage from 'localforage'
import { GoalTarget, Resource } from 'fhir/r4';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';
import { fhirclient } from 'fhirclient/lib/types';

import { MccGoal, MccGoalList, MccGoalSummary } from '../../types/mcc-types';
import log from '../../utils/loglevel';

import {
  notFoundResponse,
  resourcesFrom,
  resourcesFromObject,
  resourcesFromObjectArray,
  transformToMccGoalSummary,
} from './goal.util';

enum ACTIVE_STATUS {
  ACTIVE,
  INACTIVE,
  IGNORE
}

const LF_ID = '-MCP'
const fcCurrentStateKey = 'fhir-client-state' + LF_ID
// const fcAllStatesKey = 'fhir-client-states-array' + LF_ID

// const selectedEndpointsKey = 'selected-endpoints' + LF_ID

const ACTIVE_KEYS = {
  proposed: ACTIVE_STATUS.ACTIVE,
  planned: ACTIVE_STATUS.ACTIVE,
  accepted: ACTIVE_STATUS.ACTIVE,
  'on-hold': ACTIVE_STATUS.ACTIVE,
  unknown: ACTIVE_STATUS.ACTIVE,
  completed: ACTIVE_STATUS.INACTIVE,
  cancelled: ACTIVE_STATUS.INACTIVE,
  rejected: ACTIVE_STATUS.ACTIVE,
  active: ACTIVE_STATUS.ACTIVE,
  'entered-in-error': ACTIVE_STATUS.IGNORE,
}

export const getSummaryGoals = async (): Promise<MccGoalList> => {
  const client: Client = await FHIR.oauth2.ready();

  await saveFHIRAccessData(fcCurrentStateKey, client.state).then(() => {
    console.log('fhirClientState saved/promise returned')
  }).catch((e) => console.log(e))

  const allGoals: MccGoalSummary[] = [];
  const activePatientGoals: MccGoalSummary[] = [];
  const activeClinicalGoals: MccGoalSummary[] = [];
  const activeTargets: GoalTarget[] = [];
  const inactivePatientGoals: MccGoalSummary[] = [];
  const inactiveClinicalGoals: MccGoalSummary[] = [];
  const sdsPatientGoals: MccGoalSummary[] = [];


  const queryPath = `Goal`;
  const goalRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const sdsClient: Client = await getSupplementalDataClient();

  console.error('sdsGoalRequest ***************************');
  console.error('sdsGoalRequest client ' + JSON.stringify(client));
  console.error('sdsGoalRequest sdsClient ' + JSON.stringify(sdsClient));
  console.error('sdsGoalRequest ***************************');

  const sdsGoalRequest2: fhirclient.JsonObject = await sdsClient.patient.request(
    queryPath
  );

  const sdsGoalRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );


  console.error('sdsGoalRequest ***************************');
  console.error('sdsGoalRequest client ' + JSON.stringify(client));
  console.error('sdsGoalRequest sdsClient ' + JSON.stringify(sdsClient));
  console.error('let sdsGoalRequest2 ' + JSON.stringify(sdsGoalRequest2));
  console.error('sdsGoalRequest ***************************');



  // goal from problem list item
  const filteredGoals: MccGoal[] = resourcesFromObjectArray(
    goalRequest
  ) as MccGoal[];

  const sdsFilterGoals: MccGoal[] = resourcesFromObjectArray(
    sdsGoalRequest
  ) as MccGoal[];

  const mappedGoals: MccGoalSummary[] = filteredGoals.map(transformToMccGoalSummary);

  const sdsMappedGoals: MccGoalSummary[] = sdsFilterGoals.map(transformToMccGoalSummary);

  sdsMappedGoals.forEach(goal => {
    sdsPatientGoals.push(goal)
  })

  mappedGoals.forEach(goal => {
    let activeStatus = ACTIVE_KEYS[goal.lifecycleStatus]

    if (isNaN(activeStatus) && !activeStatus) {
      activeStatus = ACTIVE_STATUS.IGNORE;
      log.info(`getSummaryGoals - Lifecycle status of {} is not known, ignoreing this goal - ${activeStatus}`)
      allGoals.push(goal)
    }

    switch (activeStatus) {
      case ACTIVE_STATUS.ACTIVE:
        allGoals.push(goal)
        if (goal.expressedByType === 'Patient') {
          activePatientGoals.push(goal)
        } else {
          activeClinicalGoals.push(goal)
        }
        activeTargets.push(...(goal.targets ? goal.targets : []))
        break;
      case ACTIVE_STATUS.INACTIVE:
        allGoals.push(goal)
        if (goal.expressedByType === 'Patient') {
          inactivePatientGoals.push(goal)
        } else {
          inactiveClinicalGoals.push(goal)
        }
        break;
      case ACTIVE_STATUS.IGNORE:
      default:
        break;
    }
  })

  const mccGoalList: MccGoalList = {
    allGoals,
    activeClinicalGoals,
    activePatientGoals,
    activeTargets,
    inactiveClinicalGoals,
    inactivePatientGoals,
    sdsPatientGoals
  };


  log.info(
    `getSummaryGoals - successful`
  );

  log.debug({ serviceName: 'getSummaryGoals', result: mccGoalList });

  return mccGoalList;
};


/*
* TODO: enhance this to verify current access token for SDS.
*/
export const supplementalDataIsAvailable = (): Boolean => {
  const authURL = process.env.REACT_APP_SHARED_DATA_AUTH_ENDPOINT
  const sdsURL = process.env.REACT_APP_SHARED_DATA_ENDPOINT
  const sdsScope = process.env.REACT_APP_SHARED_DATA_SCOPE

  return authURL !== undefined && authURL?.length > 0
    && sdsURL !== undefined && sdsURL?.length > 0
    && sdsScope !== undefined && sdsScope?.length > 0
}

const saveFHIRAccessData = async (key: string, data: any): Promise<any> => {
  if (data.expiresAt && data.serverUrl && data.clientId) {
    console.log(`Object: localForage.setItem(key: ${key}, data: <see next line>`, data)
    return await localForage.setItem(key, data as fhirclient.ClientState)
  } else {
    console.log('Ignore previous logs, NOT updating data in local storage:')
    console.log('Data is missing data.expiresAt || data.serverUrl || data.clientId')
  }
}

export const getSupplementalDataClient = async (): Promise<Client | undefined> => {

  let sdsClient2: Client | undefined
  // const sdsURL = 'https://gw.interop.community/SyntheaTest8/data'
  const sdsURL = 'https://gw.interop.community/eCareSharedData/data'
  const authURL = 'https://gw.interop.community/SyntheaTest8/data'
  // const sdsScope = 'launch openid fhirUser patient/*.read'
  const sdsScope = 'patient/*.read openid launch'

  if (authURL && sdsURL && sdsScope) {
    const authFhirAccessDataObject: fhirclient.ClientState | undefined =
      await extractFhirAccessDataObjectIfGivenEndpointMatchesAnyPriorEndpoint(authURL)


    if (authFhirAccessDataObject) {

      var sdsFhirAccessDataObject = authFhirAccessDataObject
      sdsFhirAccessDataObject.serverUrl = sdsURL
      sdsFhirAccessDataObject.scope = sdsScope
      if (sdsFhirAccessDataObject.tokenResponse) {
        sdsFhirAccessDataObject.tokenResponse.scope = sdsScope
      }
      sdsClient2 = FHIR.client(sdsFhirAccessDataObject)
    }
    else {
      console.log("SupplementalDataClient() authFhirAccessDataObject is null, cannot connect to client")
    }
  }

  return sdsClient2
}


export const extractFhirAccessDataObjectIfGivenEndpointMatchesAnyPriorEndpoint =
  async (givenEndpoint: string): Promise<fhirclient.ClientState | undefined> => {
    console.log(givenEndpoint)
    const arrayOfFhirAccessDataObjects: fhirclient.ClientState = await getFHIRAccessData(fcCurrentStateKey) as fhirclient.ClientState
    console.log('arrayOfFhirAccessDataObjects:', JSON.stringify(arrayOfFhirAccessDataObjects))
    return arrayOfFhirAccessDataObjects;
  }


const isFHIRAccessData = async (key: string): Promise<boolean> => {
  try {
    const data: any = await localForage.getItem(key)
    // If the key does not exist, getItem() in the localForage API will return null specifically to indicate it
    if (data !== null) {
      return true
    }
    return false
  } catch (e) {
    console.log(`Failure calling localForage.getItem(key) from persistenceService.isFHIRAccessData: ${e}`)
    return false
  }
}


const getFHIRAccessData = async (key: string): Promise<any> => {
  try {
    const isData: boolean = await isFHIRAccessData(key)
    if (isData) {
      return await localForage.getItem(key)
    }
  } catch (e) {
    console.error(`Failure calling isFHIRAccessData(key) from persistenceService.getFHIRAccessData: ${e}`)
  }
}

export const getGoals = async (): Promise<MccGoal[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `Goal`;
  const goalRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  // goal from problem list item
  const filteredGoals: MccGoal[] = resourcesFrom(
    goalRequest
  ) as MccGoal[];

  log.info(
    `getGoals - successful`
  );

  log.debug({ serviceName: 'getGoals', result: filteredGoals });

  return filteredGoals;
};

export const getGoal = async (id: string): Promise<MccGoal> => {
  if (!id) {
    log.error('getGoal - id not found');
    return notFoundResponse as unknown as MccGoal;
  }

  const client = await FHIR.oauth2.ready();

  const queryPath = `Goal?_id=${id}`;
  const goalRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const filteredGoal: MccGoal = resourcesFromObject(
    goalRequest
  ) as MccGoal;

  log.info(
    `getGoal - successful with id ${id}`
  );
  log.debug({ serviceName: 'getGoal', result: filteredGoal });
  return filteredGoal;
};

export const createGoal = async (goal: MccGoal): Promise<Resource> => {
  if (!goal) {
    log.error('Goal not found');
    return {
      resourceType: 'Error',
      id: 'Missing parameter'
    };
  }
  const client = await FHIR.oauth2.ready();
  try {
    const createResult = await client.create({ resourceType: 'Goal', body: goal })

    return createResult as Resource;
  } catch (error) {
    log.error(error)
    return {
      resourceType: 'Error',
      id: 'Error while creating goal'
    }
  }

}
