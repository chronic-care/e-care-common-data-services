import { CarePlan, Condition, Goal, Medication, Observation, Patient, PatientContact, Procedure, Questionnaire, QuestionnaireResponse, ServiceRequest } from "fhir/r4";

export type legacy_MccTime = {
  value?: string;
};

export type legacy_MccDateTime = {
  rawDate: string;
  date: string;
};

export type legacy_MccInstant = {
  value: string;
};

export type legacy_MccDate = {
  rawDate: string;
  date: string;
};

export type legacy_MccPeriod = {
  start?: legacy_MccDate;
  end?: legacy_MccDate;
};

export type legacy_MccCoding = {
  system?: string;
  version?: string;
  code: string;
  display?: string;
};

export type Repeat = {
  bounds?: Bounds;
  count?: number;
  countMax?: number;
  duration?: number;
  durationMax?: number;
  durationUnit?: string;
  frequency?: number;
  frequencyMax?: number;
  period?: number;
  periodMax?: number;
  periodUnit?: string;
  dayOfWeek?: Array<string>;
  timeOfDay?: Array<legacy_MccTime>;
  when?: Array<string>;
  offset?: number;
  readable?: string;
};

export type legacy_MccQuantity = {
  unit?: string;
  comparator?: string;
  value?: number;
  system?: string;
  code?: string;
  display?: string;
};

export type legacy_MccRange = {
  high?: legacy_MccQuantity;
  low?: legacy_MccQuantity;
};

export type legacy_MccDuration = {
  unit?: string;
  comparator?: string;
  value?: number;
  system?: string;
  code?: string;
  display?: string;
};

export type Bounds = {
  type?: string;
  range?: legacy_MccRange;
  period?: legacy_MccPeriod;
  duration?: legacy_MccDuration;
};

export type legacy_MccCodeableConcept = {
  coding?: Array<legacy_MccCoding>;
  text: string;
};

export type legacy_MccTiming = {
  event?: Array<legacy_MccDateTime>;
  code?: legacy_MccCodeableConcept;
  repeat?: Repeat;
  readable: string;
};

export type Effective = {
  type?: string;
  dateTime?: legacy_MccDateTime;
  period?: legacy_MccPeriod;
  timing?: legacy_MccTiming;
  instant?: legacy_MccInstant;
};

export type legacy_MccReference = {
  reference?: string;
  display?: string;
  type?: string;
};

export type legacy_MccId = {
  value: string;
};

export type legacy_MccRatio = {
  numerator?: legacy_MccQuantity;
  denominator?: legacy_MccQuantity;
};

export type legacy_MccSimpleQuantity = {
  unit?: string;
  value?: number;
  system?: string;
  code?: string;
  display?: string;
};

export type legacy_MccSampledData = {
  origin?: legacy_MccSimpleQuantity;
  period?: number;
  factor?: number;
  lowerlimit?: number;
  upperlimit?: number;
  dimensions?: number;
  data?: string;
};

export type legacy_MccIdentifer = {
  use?: string;
  type?: legacy_MccCodeableConcept;
  system?: string;
  value?: string;
  period?: legacy_MccPeriod;
  assigner?: legacy_MccReference;
};

export type GenericType = {
  valueType: string;
  stringValue?: string;
  integerValue?: number;
  booleanValue?: boolean;
  idValue?: legacy_MccId;
  codeableConceptValue?: legacy_MccCodeableConcept;
  quantityValue?: legacy_MccQuantity;
  rangeValue?: legacy_MccRange;
  ratioValue?: legacy_MccRatio;
  periodValue?: legacy_MccPeriod;
  dateValue?: legacy_MccDate;
  timeValue?: legacy_MccTime;
  dateTimeValue?: legacy_MccDateTime;
  sampledDataValue?: legacy_MccSampledData;
  durationValue?: legacy_MccDuration;
  timingValue?: legacy_MccTiming;
  instantValue?: legacy_MccInstant;
  identiferValue?: legacy_MccIdentifer;
  codingValue?: legacy_MccCoding;
  decimalValue?: number;
};

export type ReferenceRange = {
  low?: legacy_MccQuantity;
  high?: legacy_MccQuantity;
  type?: legacy_MccCodeableConcept;
  appliesTo?: Array<legacy_MccCodeableConcept>;
  age?: legacy_MccRange;
  text?: string;
};

export type legacy_MccObservationComponent = {
  code: legacy_MccCodeableConcept;
  value: GenericType;
  interpretation?: Array<legacy_MccCodeableConcept>;
  dataAbsentReason?: legacy_MccCodeableConcept;
  referenceRanges?: Array<ReferenceRange>;
};

export type legacy_MccObservation = {
  code: legacy_MccCodeableConcept;
  status: string;
  basedOn?: Array<legacy_MccReference>;
  effective?: Effective;
  value?: GenericType;
  note?: string;
  referenceRanges?: Array<ReferenceRange>;
  components?: Array<legacy_MccObservationComponent>;
  category?: Array<legacy_MccCodeableConcept>;
  dataAbsentReason?: legacy_MccCodeableConcept;
  fhirid?: string;
};

export type legacy_MccObservationList = {
  primaryCode: string,
  observations: Array<legacy_MccObservation>,
}

export type legacy_MccObservationCollection = {
  observations?: Array<legacy_MccObservationList>,
  result?: string,
}

export type legacy_Contact = {
  type: string;
  role: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  organizationName: string;
  relFhirId: string;
  teamId: string;
  teamName;
}

export type MccObservation = Observation
export type MccCarePlan = CarePlan
export type MccCondition = Condition
export type MccPatientContact = PatientContact
export type MccGoal = Goal
export type MccCounselingSummary = Procedure | ServiceRequest
export type MccEducationSummary = Procedure | ServiceRequest
export type MccReferralSummary = ServiceRequest
export type MccMedication = Medication
export type MccPatient = Patient
export type MccQuestionnaire = Questionnaire
export type MccQuestionnaireResponse = QuestionnaireResponse
