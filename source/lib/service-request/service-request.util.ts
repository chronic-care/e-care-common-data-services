import { TimingRepeat } from 'fhir/r4';
import { Period } from 'fhir/r4';
import { CodeableConcept, Resource, ServiceRequest, Timing } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';
import { MccServiceRequestSummary } from '../../types/mcc-types';


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
    return entries.map((entry: fhirclient.JsonObject) => entry?.resource as any)
      .filter((resource: any) => resource.resourceType !== 'OperationOutcome')
  }
  return new Array<ServiceRequest>();
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

export const transformToServiceRequest = function (serviceRequest: ServiceRequest, referenceDisplay: Map<string, string>): MccServiceRequestSummary {
  console.error('transformToServiceRequest ' + JSON.stringify(referenceDisplay));
  return {
    topic: { text: displayConcept(serviceRequest.code) },
    type: serviceRequest.category ? serviceRequest.category[0].text : 'missing',
    status: serviceRequest.status,
    displayDate: serviceRequest.occurrenceTiming ? displayTiming(serviceRequest.occurrenceTiming) : (serviceRequest.occurrencePeriod ? displayPeriod(serviceRequest.occurrencePeriod) : (serviceRequest.occurrenceDateTime ? displayDate(serviceRequest.occurrenceDateTime) : serviceRequest.intent.charAt(0).toUpperCase() + serviceRequest.intent.slice(1))),
    reasons: serviceRequest.reasonCode ? getConceptDisplayString(serviceRequest.reasonCode[0]) : (serviceRequest.reasonReference ? referenceDisplay.get(serviceRequest.reasonReference[0].reference) : 'Unknown'),
  };
}



function displayTiming(timing: Timing | undefined): string | undefined {
  const boundsPeriod = (timing?.repeat as TimingRepeat)?.boundsPeriod
  const startDate = displayDate(boundsPeriod?.start)
  const endDate = displayDate(boundsPeriod?.end)
  return (startDate ?? '') + ((endDate !== undefined) ? ` until ${endDate}` : '')
}


export function displayDate(dateString?: string): string | undefined {
  if (dateString === undefined || dateString === null) {
    return undefined
  }
  else {
    // If time is not included, then parse only Year Month Day parts
    // In JavaScript, January is 0. Subtract 1 from month Int.
    const parts = dateString!.split('-');
    const jsDate: Date = (dateString?.includes('T'))
      ? new Date(dateString!)
      : new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))

    return jsDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    })
  }
}

export function displayPeriod(period: Period | undefined): string | undefined {
  const startDate = displayDate(period?.start)
  const endDate = displayDate(period?.end)
  return (startDate ?? '') + ((endDate !== undefined) ? ` until ${endDate}` : '')
}

export function displayConcept(codeable: CodeableConcept | undefined): string | undefined {
  if (codeable?.text !== undefined) {
    return codeable?.text
  }
  else {
    // use the first codeing.display that has a value
    return codeable?.coding?.filter((c) => c.display !== undefined)?.[0]?.display
  }
}
