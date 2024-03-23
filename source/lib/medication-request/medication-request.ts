/* eslint-disable functional/immutable-data */
import { CodeableConcept } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { MccMedication, MccMedicationSummary, MccMedicationSummaryList } from '../../types/mcc-types';
import log from '../../utils/loglevel';
import { getConditionFromUrl } from '../careplan';
import { convertNoteToString } from '../observation/observation.util';

import {
  getConceptDisplayString,
  notFoundResponse,
  resourcesFrom,
  resourcesFromObject,
  resourcesFromObjectArray,
} from './medication-request.util';

enum ACTIVE_STATUS {
  ACTIVE,
  INACTIVE,
  IGNORE
}

const ACTIVE_KEYS = {
  active: ACTIVE_STATUS.ACTIVE,
  'on-hold': ACTIVE_STATUS.INACTIVE,
  cancelled: ACTIVE_STATUS.INACTIVE,
  'completed': ACTIVE_STATUS.INACTIVE,
  'entered-in-error': ACTIVE_STATUS.IGNORE,
  stopped: ACTIVE_STATUS.INACTIVE,
  unknown: ACTIVE_STATUS.INACTIVE,
}

export const getSummaryMedicationRequests = async (careplanId?: string): Promise<MccMedicationSummaryList> => {
  const client = await FHIR.oauth2.ready();

  const activeMedications: MccMedicationSummary[] = [];
  const inactiveMedications: MccMedicationSummary[] = [];

  const queryPath = `MedicationRequest`;
  const goalRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  log.debug({ serviceName: 'getSummaryMedicationRequests', result: { goalRequest, careplanId } });

  // goal from problem list item
  const filteredMedicationRequests: MccMedication[] = resourcesFromObjectArray(
    goalRequest
  ) as MccMedication[];

  const mappedMedicationRequest: MccMedicationSummary[] = await Promise.all(filteredMedicationRequests.map(async (mc) => {
    const condition = mc.reasonReference ? await getConditionFromUrl(mc.reasonReference[0].reference) : { code: [] as CodeableConcept }
    return {
      type: mc.resourceType,
      fhirId: mc.id,
      status: mc.status,
      medication: mc.medicationCodeableConcept ? mc.medicationCodeableConcept.text : '',
      dosages: mc.dosageInstruction ? mc.dosageInstruction[0].text : '',
      requestedBy: mc.requester ? mc.requester.display : '',
      reasons: condition ? getConceptDisplayString(condition.code) : '',
      effectiveDate: mc.authoredOn ? new Date(mc.authoredOn).toLocaleDateString() : '',
      refillsPermitted: 'Unknown',
      notes: mc.note ? convertNoteToString(mc.note) : '',
    }
  }))

  mappedMedicationRequest.forEach(mr => {
    const status = mr.status
    const statusKey = ACTIVE_KEYS[status]

    switch (statusKey) {
      case ACTIVE_STATUS.ACTIVE:
        activeMedications.push(mr)
        break
      case ACTIVE_STATUS.INACTIVE:
        inactiveMedications.push(mr)
        break
      case ACTIVE_STATUS.IGNORE:
      default:
        log.debug({ serviceName: 'getSummaryMedicationRequests', result: { status } });
        break;
    }
  })

  const mccMedicationSummaryRequest: MccMedicationSummaryList = {
    activeMedications,
    inactiveMedications,
  };


  log.info(
    `getSummaryMedicationRequests - successful`
  );

  log.debug({ serviceName: 'getSummaryMedicationRequests', result: { mccMedicationSummaryRequest, careplanId } });

  return mccMedicationSummaryRequest;
};

export const getMedicationRequests = async (): Promise<MccMedication[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `MedicationRequest`;
  const goalRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  // goal from problem list item
  const filteredMedicationRequests: MccMedication[] = resourcesFrom(
    goalRequest
  ) as MccMedication[];

  log.info(
    `getMedicationRequests - successful`
  );

  log.debug({ serviceName: 'getMedicationRequests', result: filteredMedicationRequests });

  return filteredMedicationRequests;
};

export const getMedicationRequest = async (id: string): Promise<MccMedication> => {
  if (!id) {
    log.error('getMedicationRequest - id not found');
    return notFoundResponse as unknown as MccMedication;
  }

  const client = await FHIR.oauth2.ready();

  const queryPath = `MedicationRequest?_id=${id}`;
  const goalRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const filteredMedicationRequest: MccMedication = resourcesFromObject(
    goalRequest
  ) as MccMedication;

  log.info(
    `getMedicationRequest - successful with id ${id}`
  );
  log.debug({ serviceName: 'getMedicationRequest', result: filteredMedicationRequest });
  return filteredMedicationRequest;
};
