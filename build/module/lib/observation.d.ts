import { Observation } from 'fhir/r4';
import type { ObservationMode } from '../types';
export declare const getObservation: (code: string) => Promise<Observation>;
export declare const getValue: (obs: Observation) => any;
export declare const getObservations: (code: string, mode: ObservationMode, sort?: string, max?: string) => Promise<Observation[]>;
export declare const getObservationsByValueSet: (valueSet: string, sort?: string, max?: string) => Promise<Observation[]>;
export declare const getObservationsByCategory: (category: string, sort?: string, max?: string) => Promise<Observation[]>;
