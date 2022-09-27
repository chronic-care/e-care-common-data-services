import { Resource } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';
export declare const activeQuestionnaireStatus: string[];
export declare const fhirOptions: fhirclient.FhirOptions;
export declare const notFoundResponse: (code?: string) => {
    code: string;
    status: string;
    type: string;
};
export declare const resourcesFrom: (response: fhirclient.JsonArray) => Resource[];
