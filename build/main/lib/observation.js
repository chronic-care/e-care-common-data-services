"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObservationsByCategory = exports.getObservationsByValueSet = exports.getObservations = exports.getValue = exports.getObservation = void 0;
const fhirclient_1 = __importDefault(require("fhirclient"));
const mode_1 = require("../constants/mode");
const json_1 = require("../query/json");
const fhirOptions = {
    pageLimit: 0,
};
const notFoundResponse = (code) => ({
    code,
    status: 'notfound',
    value: {
        stringValue: 'No Data Available',
        valueType: 'string',
    },
});
const resourcesFrom = (response) => {
    const firstEntries = response[0];
    const entries = (firstEntries === null || firstEntries === void 0 ? void 0 : firstEntries.entry) ? firstEntries.entry
        : [];
    return entries
        .map((entry) => entry === null || entry === void 0 ? void 0 : entry.resource)
        .filter((resource) => resource.resourceType !== 'OperationOutcome');
};
exports.getObservation = async (code) => {
    const client = await fhirclient_1.default.oauth2.ready();
    const queryPath = `Observation?${mode_1.EccMode.code}=http://loinc.org|${code}&_sort=-date&_count=1`;
    const observationRequest = await client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (filteredObservations.length) {
        return filteredObservations[0];
    }
    else {
        return notFoundResponse(code);
    }
};
exports.getValue = (obs) => {
    if (obs.valueQuantity) {
        return {
            valueQuantity: obs.valueQuantity,
        };
    }
    else if (obs.valueBoolean) {
        return {
            valueBoolean: obs.valueBoolean,
        };
    }
    else if (obs.valueInteger) {
        return {
            valueInteger: obs.valueInteger,
        };
    }
    else if (obs.valueString) {
        return {
            valueString: obs.valueString,
        };
    }
    else if (obs.valueRange) {
        return {
            valueRange: obs.valueRange,
        };
    }
    else if (obs.valueCodeableConcept) {
        return {
            valueCodeableConcept: obs.valueCodeableConcept,
        };
    }
    else {
        return {
            value: 'Unknown type',
        };
    }
};
exports.getObservations = async (code, mode, sort, max) => {
    var _a;
    const client = await fhirclient_1.default.oauth2.ready();
    const sortType = sort === 'descending' ? '-date' : 'date';
    const queryPath = `Observation?${(_a = mode_1.EccMode[mode]) !== null && _a !== void 0 ? _a : mode_1.EccMode.code}=http://loinc.org|${code}&_sort=${sortType}&_count=${max !== null && max !== void 0 ? max : 100}`;
    const observationRequest = await client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (filteredObservations.length) {
        return filteredObservations;
    }
    else {
        return [];
    }
};
exports.getObservationsByValueSet = async (valueSet, sort, max) => {
    const client = await fhirclient_1.default.oauth2.ready();
    const codes = await json_1.getAllCodes(valueSet);
    const combinedCodes = codes.join(',');
    const sortType = sort === 'descending' ? '-date' : 'date';
    const queryPath = `Observation?${mode_1.EccMode.code}=${combinedCodes}&_sort=${sortType}&_count=${max}`;
    const observationRequest = await client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (filteredObservations.length) {
        return filteredObservations;
    }
    else {
        return [];
    }
};
exports.getObservationsByCategory = async (category, sort, max) => {
    const client = await fhirclient_1.default.oauth2.ready();
    const sortType = sort === 'descending' ? '-date' : 'date';
    const queryPath = `Observation?category=${category}&_sort=${sortType}&_count=${max !== null && max !== void 0 ? max : 100}`;
    const observationRequest = await client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (filteredObservations.length) {
        return filteredObservations;
    }
    else {
        return [];
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvbGliL29ic2VydmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDREQUE4QjtBQUc5Qiw0Q0FBNEM7QUFDNUMsd0NBQTRDO0FBRzVDLE1BQU0sV0FBVyxHQUEyQjtJQUMxQyxTQUFTLEVBQUUsQ0FBQztDQUNiLENBQUM7QUFFRixNQUFNLGdCQUFnQixHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLElBQUk7SUFDSixNQUFNLEVBQUUsVUFBVTtJQUNsQixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsbUJBQW1CO1FBQ2hDLFNBQVMsRUFBRSxRQUFRO0tBQ3BCO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxhQUFhLEdBQUcsQ0FBQyxRQUE4QixFQUFjLEVBQUU7SUFDbkUsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBMEIsQ0FBQztJQUMxRCxNQUFNLE9BQU8sR0FBNEIsQ0FBQSxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsS0FBSyxFQUMxRCxDQUFDLENBQUUsWUFBWSxDQUFDLEtBQWlDO1FBQ2pELENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDUCxPQUFPLE9BQU87U0FDWCxHQUFHLENBQUMsQ0FBQyxLQUE0QixFQUFFLEVBQUUsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsUUFBZSxDQUFDO1NBQzdELE1BQU0sQ0FDTCxDQUFDLFFBQWtCLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEtBQUssa0JBQWtCLENBQ3JFLENBQUM7QUFDTixDQUFDLENBQUM7QUFFVyxRQUFBLGNBQWMsR0FBRyxLQUFLLEVBQUUsSUFBWSxFQUF3QixFQUFFO0lBQ3pFLE1BQU0sTUFBTSxHQUFHLE1BQU0sb0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekMs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