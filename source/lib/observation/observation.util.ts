/* eslint-disable functional/immutable-data */
import { Annotation, CodeableConcept, Observation, Resource, TimingRepeat } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';

import { legacy_MccCodeableConcept, legacy_MccCoding, legacy_MccDateTime, legacy_MccObservation, legacy_MccObservationCollection, legacy_MccObservationComponent, legacy_MccTime, ReferenceRange, Repeat } from '../../types/mcc-types';
import { displayDate } from '../service-request/service-request.util';

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

export const getValue = (obs: Observation): any => {
  if (obs.valueQuantity) {
    return {
      valueQuantity: obs.valueQuantity,
    };
  } else if (obs.valueBoolean) {
    return {
      valueBoolean: obs.valueBoolean,
    };
  } else if (obs.valueInteger) {
    return {
      valueInteger: obs.valueInteger,
    };
  } else if (obs.valueString) {
    return {
      valueString: obs.valueString,
    };
  } else if (obs.valueRange) {
    return {
      valueRange: obs.valueRange,
    };
  } else if (obs.valueCodeableConcept) {
    return {
      valueCodeableConcept: obs.valueCodeableConcept,
    };
  } else {
    return {
      value: 'Unknown type',
    };
  }
};

export const convertToObservationCollection = (observations: Observation[]): legacy_MccObservationCollection => {
  const observationMap = {}
  const observationCollection = {
    observations: []
  };

  observations.forEach((obs) => {
    const key = obs.code.id;
    const fndList = {
      primaryCode: "",
      observations: []
    }
    if (!observationMap[key]) {
      fndList.primaryCode = obs.code.coding[0].code;
      fndList.observations.push(obs);
    }

    observationCollection.observations.push(fndList);
  });

  return observationCollection
}

export const convertToMccCodeableConcept = (code: CodeableConcept): legacy_MccCodeableConcept => {
  const coding: legacy_MccCoding[] = code.coding as legacy_MccCoding[]
  return {
    coding,
    text: code.text
  }
}

export const convertEventArrayToMccEvent = (events: string[]): legacy_MccDateTime[] => {
  return events.map(ev => ({
    date: ev,
    rawDate: ev
  }))
}

export const convertTimeToMccTIme = (times: string[]): legacy_MccTime[] => {
  return times.map(t => ({
    value: t
  }))
}

export const convertRepeatToMccRepeat = (repeat: TimingRepeat): Repeat => {
  return {
    bounds: {
      duration: repeat.boundsDuration,
      period: {
        end: {
          date: repeat.boundsPeriod.end,
          rawDate: repeat.boundsPeriod.end
        },
        start: {
          date: repeat.boundsPeriod.start,
          rawDate: repeat.boundsPeriod.start
        }
      },
      range: repeat.boundsRange,
    },
    count: repeat.count,
    countMax: repeat.countMax,
    duration: repeat.duration,
    durationMax: repeat.durationMax,
    durationUnit: repeat.durationUnit,
    frequency: repeat.frequency,
    frequencyMax: repeat.frequencyMax,
    period: repeat.period,
    periodMax: repeat.periodMax,
    periodUnit: repeat.periodUnit,
    dayOfWeek: repeat.dayOfWeek,
    timeOfDay: convertTimeToMccTIme(repeat.timeOfDay),
    when: repeat.when,
    offset: repeat.offset,
    readable: repeat.id,
  }
}

export const convertNoteToString = (notes: Annotation[]): string => {
  return notes?.join(' ')
}

export const convertToMccObservation = (observation: Observation): legacy_MccObservation => {
  return {
    code: convertToMccCodeableConcept(observation.code),
    status: observation.status,
    basedOn: observation.basedOn,
    effective: {
      dateTime: {
        rawDate: observation.effectiveDateTime,
        date: displayDate(observation.effectiveDateTime)
      },
      instant: {
        value: observation.effectiveInstant
      },
      period: {
        start: {
          date: displayDate(observation.effectivePeriod.start),
          rawDate: observation.effectivePeriod.start
        },
        end: {
          date: displayDate(observation.effectivePeriod.end),
          rawDate: observation.effectivePeriod.end
        }
      },
      timing: {
        readable: observation.effectiveTiming.id,
        code: convertToMccCodeableConcept(observation.effectiveTiming.code),
        event: convertEventArrayToMccEvent(observation.effectiveTiming.event),
        repeat: convertRepeatToMccRepeat(observation.effectiveTiming.repeat),
      },
    },
    value: getValue(observation),
    note: convertNoteToString(observation.note),
    referenceRanges: observation.referenceRange as ReferenceRange[],
    category: observation.category.map(c => convertToMccCodeableConcept(c)),
    components: observation.component as legacy_MccObservationComponent[],
    dataAbsentReason: convertToMccCodeableConcept(observation.dataAbsentReason),
    fhirid: observation.id
  }
}
