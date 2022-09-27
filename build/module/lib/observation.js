var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FHIR from 'fhirclient';
import { EccMode } from '../constants/mode';
import { getAllCodes } from '../query/json';
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
export const getObservation = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield FHIR.oauth2.ready();
    const queryPath = `Observation?${EccMode.code}=http://loinc.org|${code}&_sort=-date&_count=1`;
    const observationRequest = yield client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (filteredObservations.length) {
        return filteredObservations[0];
    }
    else {
        return notFoundResponse(code);
    }
});
export const getValue = (obs) => {
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
export const getObservations = (code, mode, sort, max) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const client = yield FHIR.oauth2.ready();
    const sortType = sort === 'descending' ? '-date' : 'date';
    const queryPath = `Observation?${(_a = EccMode[mode]) !== null && _a !== void 0 ? _a : EccMode.code}=http://loinc.org|${code}&_sort=${sortType}&_count=${max !== null && max !== void 0 ? max : 100}`;
    const observationRequest = yield client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (filteredObservations.length) {
        return filteredObservations;
    }
    else {
        return [];
    }
});
export const getObservationsByValueSet = (valueSet, sort, max) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield FHIR.oauth2.ready();
    const codes = yield getAllCodes(valueSet);
    const combinedCodes = codes.join(',');
    const sortType = sort === 'descending' ? '-date' : 'date';
    const queryPath = `Observation?${EccMode.code}=${combinedCodes}&_sort=${sortType}&_count=${max}`;
    const observationRequest = yield client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (filteredObservations.length) {
        return filteredObservations;
    }
    else {
        return [];
    }
});
export const getObservationsByCategory = (category, sort, max) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield FHIR.oauth2.ready();
    const sortType = sort === 'descending' ? '-date' : 'date';
    const queryPath = `Observation?category=${category}&_sort=${sortType}&_count=${max !== null && max !== void 0 ? max : 100}`;
    const observationRequest = yield client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (filteredObservations.length) {
        return filteredObservations;
    }
    else {
        return [];
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvbGliL29ic2VydmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLE9BQU8sSUFBSSxNQUFNLFlBQVksQ0FBQztBQUc5QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUc1QyxNQUFNLFdBQVcsR0FBMkI7SUFDMUMsU0FBUyxFQUFFLENBQUM7Q0FDYixDQUFDO0FBRUYsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNsQyxJQUFJO0lBQ0osTUFBTSxFQUFFLFVBQVU7SUFDbEIsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFLG1CQUFtQjtRQUNoQyxTQUFTLEVBQUUsUUFBUTtLQUNwQjtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sYUFBYSxHQUFHLENBQUMsUUFBOEIsRUFBYyxFQUFFO0lBQ25FLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQTBCLENBQUM7SUFDMUQsTUFBTSxPQUFPLEdBQTRCLENBQUEsWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLEtBQUssRUFDMUQsQ0FBQyxDQUFFLFlBQVksQ0FBQyxLQUFpQztRQUNqRCxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ1AsT0FBTyxPQUFPO1NBQ1gsR0FBRyxDQUFDLENBQUMsS0FBNEIsRUFBRSxFQUFFLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFFBQWUsQ0FBQztTQUM3RCxNQUFNLENBQ0wsQ0FBQyxRQUFrQixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxLQUFLLGtCQUFrQixDQUNyRSxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLENBQU8s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