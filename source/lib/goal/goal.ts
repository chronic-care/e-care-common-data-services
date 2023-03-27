/* eslint-disable functional/immutable-data */
import { GoalTarget, Resource } from 'fhir/r4';
import FHIR from 'fhirclient';
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
  const client = await FHIR.oauth2.ready();
  const allGoals: MccGoalSummary[] = [];
  const activePatientGoals: MccGoalSummary[] = [];
  const activeClinicalGoals: MccGoalSummary[] = [];
  const activeTargets: GoalTarget[] = [];
  const inactivePatientGoals: MccGoalSummary[] = [];
  const inactiveClinicalGoals: MccGoalSummary[] = [];

  const queryPath = `Goal`;
  const goalRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  // goal from problem list item
  const filteredGoals: MccGoal[] = resourcesFromObjectArray(
    goalRequest
  ) as MccGoal[];

  const mappedGoals: MccGoalSummary[] = filteredGoals.map(transformToMccGoalSummary);

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
    inactivePatientGoals
  };


  log.info(
    `getSummaryGoals - successful`
  );

  log.debug({ serviceName: 'getSummaryGoals', result: mccGoalList });

  return mccGoalList;
};

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
