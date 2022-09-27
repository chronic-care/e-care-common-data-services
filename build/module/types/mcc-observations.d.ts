export declare type MccTime = {
    value?: string;
};
export declare type MccDateTime = {
    rawDate: string;
    date: string;
};
export declare type MccInstant = {
    value: string;
};
export declare type MccDate = {
    rawDate: string;
    date: string;
};
export declare type MccPeriod = {
    start?: MccDate;
    end?: MccDate;
};
export declare type MccCoding = {
    system?: string;
    version?: string;
    code: string;
    display?: string;
};
export declare type Repeat = {
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
export declare type MccQuantity = {
    unit?: string;
    comparator?: string;
    value?: number;
    system?: string;
    code?: string;
    display?: string;
};
export declare type MccRange = {
    high?: MccQuantity;
    low?: MccQuantity;
};
export declare type MccDuration = {
    unit?: string;
    comparator?: string;
    value?: number;
    system?: string;
    code?: string;
    display?: string;
};
export declare type Bounds = {
    type?: string;
    range?: MccRange;
    period?: MccPeriod;
    duration?: MccDuration;
};
export declare type MccCodeableConcept = {
    coding?: Array<MccCoding>;
    text: string;
};
export declare type MccTiming = {
    event?: Array<MccDateTime>;
    code?: MccCodeableConcept;
    repeat?: Repeat;
    readable: string;
};
export declare type Effective = {
    type?: string;
    dateTime?: MccDateTime;
    period?: MccPeriod;
    timing?: MccTiming;
    instant?: MccInstant;
};
export declare type MccReference = {
    reference?: string;
    display?: string;
    type?: string;
};
export declare type MccId = {
    value: string;
};
export declare type MccRatio = {
    numerator?: MccQuantity;
    denominator?: MccQuantity;
};
export declare type MccSimpleQuantity = {
    unit?: string;
    value?: number;
    system?: string;
    code?: string;
    display?: string;
};
export declare type MccSampledData = {
    origin?: MccSimpleQuantity;
    period?: number;
    factor?: number;
    lowerlimit?: number;
    upperlimit?: number;
    dimensions?: number;
    data?: string;
};
export declare type MccIdentifer = {
    use?: string;
    type?: MccCodeableConcept;
    system?: string;
    value?: string;
    period?: MccPeriod;
    assigner?: MccReference;
};
export declare type GenericType = {
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
export declare type ReferenceRange = {
    low?: MccQuantity;
    high?: MccQuantity;
    type?: MccCodeableConcept;
    appliesTo?: Array<MccCodeableConcept>;
    age?: MccRange;
    text?: string;
};
export declare type ObservationComponent = {
    code: MccCodeableConcept;
    value: GenericType;
    interpretation?: Array<MccCodeableConcept>;
    dataAbsentReason?: MccCodeableConcept;
    referenceRanges?: Array<ReferenceRange>;
};
export declare type MccObservation = {
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
