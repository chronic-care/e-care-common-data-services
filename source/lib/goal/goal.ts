/* eslint-disable functional/immutable-data */
// import localForage from 'localforage'
import { GoalTarget, QuestionnaireResponse, QuestionnaireResponseItem, Resource } from 'fhir/r4';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';
import { fhirclient } from 'fhirclient/lib/types';

import { MccAssessment, MCCAssessmentResponseItem, MccGoal, MccGoalList, MccGoalSummary } from '../../types/mcc-types';
import log from '../../utils/loglevel';
import { displayDate } from '../service-request/service-request.util';

import {
  getSupplementalDataClient,
  notFoundResponse,
  resourcesFrom,
  resourcesFromObject,
  resourcesFromObjectArray,
  resourcesFromObjectArray2,
  saveFHIRAccessData,
  transformToMccGoalSummary,
} from './goal.util';

enum ACTIVE_STATUS {
  ACTIVE,
  INACTIVE,
  IGNORE
}

const LF_ID = '-MCP'
const fcCurrentStateKey = 'fhir-client-state' + LF_ID

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


export const getSupplementalData = async (launchURL: string, sdsClient: Client): Promise<MccGoalSummary[]> => {
  let goalMap = new Map();
  let allThirdPartyMappedGoals: MccGoalSummary[] = [];

  try {
    // First Linkage request
    const linkages = await sdsClient.request('Linkage');
    linkages
    for (const entry of linkages.entry) {
      for (const item of entry.resource.item) {
        if (!goalMap.has(JSON.stringify(item.resource.reference))) {
          goalMap.set(JSON.stringify(item.resource.reference), JSON.stringify(item.resource.reference));

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
                  fhirHeaderRequestOption.url = 'Goal?subject=' + item2.resource.reference;

                  // Fetch third-party goals
                  const response = await sdsClient.request(fhirHeaderRequestOption);

                  // Process third-party goals
                  const thirdPartyGoals: MccGoal[] = resourcesFromObjectArray(response) as MccGoal[];
                  const thirdPartyMappedGoals: MccGoalSummary[] = thirdPartyGoals.map(transformToMccGoalSummary);

                  thirdPartyMappedGoals.forEach(goal => {
                    goal.expressedBy = (goal.expressedBy ? goal.expressedBy : '') + ' (' + item2.resource.extension[0].valueUrl + ')';
                    allThirdPartyMappedGoals.push(goal);
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

  return allThirdPartyMappedGoals;
};


export const getAssessments = async (sdsURL: string, authURL: string, sdsScope: string): Promise<MccAssessment[]> => {

  let assessments: MccAssessment[] = []

  try {

    const theCurrentClient: Client = await FHIR.oauth2.ready();
    let sdsClient = await getSupplementalDataClient(theCurrentClient, sdsURL, authURL, sdsScope);

    if (sdsClient) {
      const sdsQuestionnaireResponse: fhirclient.JsonObject = await sdsClient.patient.request('QuestionnaireResponse');

      const sdsQuestionnaireResponseArray: Resource[] = resourcesFromObjectArray2(
        sdsQuestionnaireResponse
      ) as Resource[];

      assessments = sdsQuestionnaireResponseArray.map(transformToAssessment);

    }

  } catch (error) {
    console.error(`getAssessments Error: ${error.message}`);
  } finally {
    console.log("Operation complete.");
    return assessments;
  }
}



export const getSummaryGoals = async (sdsURL: string, authURL: string, sdsScope: string): Promise<MccGoalList> => {


  const allGoals: MccGoalSummary[] = [];
  const activePatientGoals: MccGoalSummary[] = [];
  const activeClinicalGoals: MccGoalSummary[] = [];
  const activeTargets: GoalTarget[] = [];
  const inactivePatientGoals: MccGoalSummary[] = [];
  const inactiveClinicalGoals: MccGoalSummary[] = [];
  const sdsPatientGoals: MccGoalSummary[] = [];
  const theCurrentClient: Client = await FHIR.oauth2.ready();
  let sdsClient = await getSupplementalDataClient(theCurrentClient, sdsURL, authURL, sdsScope)

  const queryPath = `Goal`;

  let sdsMappedGoals: MccGoalSummary[] = []
  if (sdsClient) {
    const sdsGoalRequest: fhirclient.JsonObject = await sdsClient.patient.request(
      queryPath
    );
    const sdsFilterGoals: MccGoal[] = resourcesFromObjectArray(
      sdsGoalRequest
    ) as MccGoal[];
    sdsMappedGoals.push(...sdsFilterGoals.map(transformToMccGoalSummary));
  }


  const goalRequest: fhirclient.JsonObject = await theCurrentClient.patient.request(
    queryPath
  );



  const filteredGoals: MccGoal[] = resourcesFromObjectArray(
    goalRequest
  ) as MccGoal[];



  const mappedGoals: MccGoalSummary[] = filteredGoals.map(transformToMccGoalSummary);


  sdsMappedGoals.forEach(goal => {
    mappedGoals.push(goal)
  })



  const thirdPartyStuff = await getSupplementalData(theCurrentClient.state.serverUrl, sdsClient);


  if (thirdPartyStuff) {
    thirdPartyStuff.forEach(goal => {
      mappedGoals.push(goal)
    })
  }

  mappedGoals.forEach(goal => {

    let activeStatus = ACTIVE_KEYS[goal.lifecycleStatus]

    if (isNaN(activeStatus) && !activeStatus) {
      activeStatus = ACTIVE_STATUS.IGNORE;
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

  return mccGoalList;
};


/*
* TODO: enhance this to verify current access token for SDS.
*/


export const getGoals = async (sdsURL: string, authURL: string, sdsScope: string): Promise<MccGoal[]> => {
  const client = await FHIR.oauth2.ready();

  console.error('start saveFHIRAccessData');

  await saveFHIRAccessData(fcCurrentStateKey, client.state, false).then(() => {
    console.log('fhirClientState saved/promise returned')
  }).catch((e) => console.log(e))

  console.error('end saveFHIRAccessData');

  const sdsClient: Client = await getSupplementalDataClient(client, sdsURL, authURL, sdsScope);
  console.error(
    `getGoals - ` + JSON.stringify(sdsClient)
  );

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
function transformToAssessment(transformToAssessment: QuestionnaireResponse): MccAssessment {

  const transformedData: MccAssessment = {
    title: transformToAssessment._questionnaire.extension[0].valueString,
    date: displayDate(transformToAssessment.authored),
    questions: []
  }

  transformToAssessment.item.forEach(item1 => {
    transformedData.questions.push(getAnswer(item1));
    if (item1.item) {
      transformedData.questions.push(...item1.item.map(getAnswer));
    }

  });

  return transformedData;

}



function getAnswer(getAnswer: QuestionnaireResponseItem): MCCAssessmentResponseItem {
  const response: MCCAssessmentResponseItem = {
    question: getAnswer.text,
    answer: getAnswer.answer ? getAnswer.answer[0].valueCoding ? getAnswer.answer[0].valueCoding.display : getAnswer.answer[0].valueBoolean ? JSON.stringify(getAnswer.answer[0].valueBoolean) : JSON.stringify(getAnswer.answer[0]) : ''
  }
  return response;
}

