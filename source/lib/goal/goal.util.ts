import { CodeableConcept, Resource } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';

import { MccGoal, MccGoalSummary } from '../../types/mcc-types';

export const fhirOptions: fhirclient.FhirOptions = {
  pageLimit: 0,
};

export const notFoundResponse = (code?: string) => ({
  code,
  status: 'notfound',
  value: {
    stringValue: 'No Data Available',
    valueType: 'string',
  },
});

export const resourcesFromObject = (
  response: fhirclient.JsonObject
): Resource => {
  const entry: fhirclient.JsonObject = response?.entry[0];

  const resource: any = entry?.resource;

  if (resource.resourceType === 'OperationOutcome') {
    return {} as any;
  }

  return resource;
};

export const resourcesFromObjectArray = (response: fhirclient.JsonObject): Resource[] => {
  if (response?.entry) {
    const entries: fhirclient.JsonArray = response?.entry as fhirclient.JsonArray;
    return entries.map((entry: fhirclient.JsonObject) => entry?.resource as any).filter((resource: any) => resource.resourceType !== 'OperationOutcome')
  }
  return new Array<MccGoal>();
};

export const resourcesFrom = (response: fhirclient.JsonArray): Resource[] => {
  const firstEntries = response[0] as fhirclient.JsonObject;
  const entries: fhirclient.JsonObject[] = firstEntries?.entry
    ? (firstEntries.entry as [fhirclient.JsonObject])
    : [];
  return entries
    .map((entry: fhirclient.JsonObject) => entry?.resource as any)
    .filter(
      (resource: Resource) => resource.resourceType !== 'OperationOutcome'
    );
};

export const getConceptDisplayString = (code: CodeableConcept): string => {
  if (code.text) return code.text;

  if (code.coding) {
    return code.coding.reduce((_, curr) => curr.display, '');
  }

  return '';
};

export const transformToMccGoalSummary = (goal: MccGoal): MccGoalSummary => {
  const priority = goal.priority?.coding[0]?.display || '';
  const expressedByType = goal.expressedBy?.reference?.split('/')[0] || '';
  const description = goal.description?.text || '';
  const achievementStatus = goal.achievementStatus;
  const achievementText = achievementStatus.text || '';
  const lifecycleStatus = goal.lifecycleStatus || '';
  const startDateText = goal.startDate ? new Date(goal.startDate).toLocaleDateString() : '';
  const targetDateText = goal.target?.[0]?.dueDate ? new Date(goal.target[0].dueDate).toLocaleDateString() : undefined;
  // const addresses = goal.addresses?.[0]?.display || '';
  const expressedBy = goal.expressedBy?.display || '';
  const targets = goal.target?.map((target: any) => ({
    measure: target.measure || { coding: [], text: '' },
    value: {
      valueType: 'Quantity',
      quantityValue: target.detailQuantity || { unit: '', value: 0, system: '', code: '' },
    },
    dueType: target.dueDate ? 'date' : undefined,
  })) || [];
  // const useStartConcept = !!goal.startCodeableConcept
  const fhirid = goal.id || '';

  return {
    priority,
    expressedByType,
    description,
    // achievementStatus,
    achievementText,
    lifecycleStatus,
    startDateText,
    targetDateText,
    // addresses,
    expressedBy,
    targets,
    // useStartConcept,
    fhirid,
  };
}
