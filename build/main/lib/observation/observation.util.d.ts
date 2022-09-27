import { Observation, Resource } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';
export declare const fhirOptions: fhirclient.FhirOptions;
export declare const notFoundResponse: (code?: string) => {
    code: string;
    status: string;
    value: {
        stringValue: string;
        valueType: string;
    };
};
export declare const resourcesFrom: (response: fhirclient.JsonArray) => Resource[];
export declare const getValue: (obs: Observation) => any;
