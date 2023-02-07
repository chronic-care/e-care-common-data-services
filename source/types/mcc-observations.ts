import { Observation } from "fhir/r4";

export type MccTime = {
  value?: string;
};

export type MccDateTime = {
  rawDate: string;
  date: string;
};

export type MccInstant = {
  value: string;
};

export type MccDate = {
  rawDate: string;
  date: string;
};

export type MccPeriod = {
  start?: MccDate;
  end?: MccDate;
};

export type MccCoding = {
  system?: string;
  version?: string;
  code: string;
  display?: string;
};

export type Repeat = {
  bounds?: Bounds;
  count?: number;
  countMax?: number;
  duration?: string;
  durationMax?: string;
  durationUnit?: string;
  frequency?: number;
  frequencyMax?: number;
  period?: string;
  periodMax?: string;
  periodUnit?: string;
  dayOfWeek?: Array<string>;
  timeOfDay?: Array<MccTime>;
  when?: Array<string>;
  offset?: number;
  readable?: string;
};

export type MccQuantity = {
  unit?: string;
  comparator?: string;
  value?: number;
  system?: string;
  code?: string;
  display?: string;
};

export type MccRange = {
  high?: MccQuantity;
  low?: MccQuantity;
};

export type MccDuration = {
  unit?: string;
  comparator?: string;
  value?: number;
  system?: string;
  code?: string;
  display?: string;
};

export type Bounds = {
  type?: string;
  range?: MccRange;
  period?: MccPeriod;
  duration?: MccDuration;
};

export type MccCodeableConcept = {
  coding?: Array<MccCoding>;
  text: string;
};

export type MccTiming = {
  event?: Array<MccDateTime>;
  code?: MccCodeableConcept;
  repeat?: Repeat;
  readable: string;
};

export type Effective = {
  type?: string;
  dateTime?: MccDateTime;
  period?: MccPeriod;
  timing?: MccTiming;
  instant?: MccInstant;
};

export type MccReference = {
  reference?: string;
  display?: string;
  type?: string;
};

export type MccId = {
  value: string;
};

export type MccRatio = {
  numerator?: MccQuantity;
  denominator?: MccQuantity;
};

export type MccSimpleQuantity = {
  unit?: string;
  value?: number;
  system?: string;
  code?: string;
  display?: string;
};

export type MccSampledData = {
  origin?: MccSimpleQuantity;
  period?: number;
  factor?: number;
  lowerlimit?: number;
  upperlimit?: number;
  dimensions?: number;
  data?: string;
};

export type MccIdentifer = {
  use?: string;
  type?: MccCodeableConcept;
  system?: string;
  value?: string;
  period?: MccPeriod;
  assigner?: MccReference;
};

export type GenericType = {
  valueType: string;
  stringValue?: string;
  integerValue?: number;
  booleanValue?: boolean;
  idValue?: MccId;
  codeableConceptValue?: MccCodeableConcept;
  quantityValue?: MccQuantity;
  rangeValue?: MccRange;
  ratioValue?: MccRatio;
  periodValue?: MccPeriod;
  dateValue?: MccDate;
  timeValue?: MccTime;
  dateTimeValue?: MccDateTime;
  sampledDataValue?: MccSampledData;
  durationValue?: MccDuration;
  timingValue?: MccTiming;
  instantValue?: MccInstant;
  identiferValue?: MccIdentifer;
  codingValue?: MccCoding;
  decimalValue?: number;
};

export type ReferenceRange = {
  low?: MccQuantity;
  high?: MccQuantity;
  type?: MccCodeableConcept;
  appliesTo?: Array<MccCodeableConcept>;
  age?: MccRange;
  text?: string;
};

export type ObservationComponent = {
  code: MccCodeableConcept;
  value: GenericType;
  interpretation?: Array<MccCodeableConcept>;
  dataAbsentReason?: MccCodeableConcept;
  referenceRanges?: Array<ReferenceRange>;
};

export type MccObservation = {
  code: MccCodeableConcept;
  status: string;
  basedOn?: Array<MccReference>;
  effective?: Effective;
  value?: GenericType;
  note?: string;
  referenceRanges?: Array<ReferenceRange>;
  components?: Array<ObservationComponent>;
  category?: Array<MccCodeableConcept>;
  dataAbsentReason?: MccCodeableConcept;
  fhirid?: string;
};

export type MccObservationList = {
  primaryCode: string,
  observations: Array<Observation>,
}

export type MccObservationCollection = {
  observations?: Array<MccObservationList>,
  result?: string,
}
