import { CarePlan, CodeableConcept, Condition, Goal, GoalTarget, MedicationRequest, Observation, Patient, PatientContact, Procedure, Questionnaire, QuestionnaireResponse, ServiceRequest } from "fhir/r4";

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
export type MccPatientContact = {
  type: string,
  role: string,
  name: string,
  hasImage: boolean,
  phone: string,
  email: string,
  address: string,
  relFhirId: string
}
export type MccGoal = Goal
export type MccCounselingSummary = Procedure | ServiceRequest
export type MccEducationSummary = Procedure | ServiceRequest
export type MccReferralSummary = ServiceRequest
export type MccMedication = MedicationRequest
export type MccPatient = Patient
export type MccQuestionnaire = Questionnaire
export type MccQuestionnaireResponse = QuestionnaireResponse
export type MccGoalList = {
  allGoals?: Array<MccGoalSummary>;
  activeClinicalGoals?: Array<MccGoalSummary>;
  inactiveClinicalGoals?: Array<MccGoalSummary>;
  activePatientGoals?: Array<MccGoalSummary>;
  inactivePatientGoals?: Array<MccGoalSummary>;
  activeTargets?: Array<GoalTarget>;
  sdsPatientGoals?: Array<MccGoalSummary>;
}


export type MccCoding = {
  system?: string;
  version?: string;
  code: string;
  display?: string;
}

export type MccCodeableConcept = {
  coding?: Array<MccCoding>;
  text: string;
}

export type MccReference = {
  reference?: string;
  display?: string;
  type?: string;
}

export type Acceptance = {
  individual?: MccReference;
  code?: string;
  priority?: MccCodeableConcept;
}

export type MccGoalRelationship = {
  target: MccReference;
  type: MccCodeableConcept;
}

export type MccGoalSummary = {
  priority: string;
  expressedByType?: string;
  description: string;
  achievementText?: string;
  lifecycleStatus: string;
  startDateText?: string;
  targetDateText?: string;
  addresses?: Array<MccReference>;
  expressedBy?: string;
  acceptance?: Acceptance;
  targets?: Array<GoalTarget>;
  fhirid?: string;
  server?: string;
  relatedGoals?: Array<MccGoalRelationship>;
  notes?: Array<string>;
  mostrecentresult?: string;
}

export type MccMedicationSummary = {
  type: string;
  fhirId: string;
  status: string;
  medication: string;
  dosages: string;
  requestedBy: string;
  reasons: string;
  effectiveDate: string;
  refillsPermitted: string;
  notes: string;
}

export type MccMedicationSummaryList = {
  activeMedications: Array<MccMedicationSummary>;
  inactiveMedications: Array<MccMedicationSummary>;
}

export type MccPatientSummary = {
  race: string;
  id: string;
  fhirid: string;
  gender: string;
  age: string;
  dateOfBirth: string;
  ethnicity: string;
  name: string;
}

export type MccConditionSummary = {
  code: CodeableConcept;
  categories: string;
  provenance: String;
  history: {
    code: CodeableConcept;
    onset: string;
    abatement: null;
    clinicalStatus: string;
    verificationStatus: string;
    categories: string;
    recorded: number;
    note: string;
    fhirid: string;
    recordedAsText: string;
  }[];
  profileId: string;
  firstRecordedAsText: string;
  firstOnsetAsText: string;
  clinicalStatus: string;
  verificationStatus: string;
  asserter: string;
}

export type MccConditionList = {
  activeConditions: Array<MccConditionSummary>;
  inactiveConditions: Array<MccConditionSummary>;
  activeConcerns: Array<MccConditionSummary>;
  inactiveConcerns: Array<MccConditionSummary>;
}

export type MccSocialConcern = {
  name: string;
  data: string;
  description: string | null;
  date: string;
  hovered: boolean;
}



export type MccServiceRequestSummary = {
  topic: MccCodeableConcept;
  type: string;
  displayDate?: string;
  date?: string;
  outcome?: MccCodeableConcept;
  status: string;
  performer?: string;
  reasons?: string;
  fhirid?: string;
}


export type PatientContactRole = PatientContact & { role: string }


export type MCCAssessmentResponseItem = {
  question?: string;
  answer?: string;

}


export type MccAssessment = {
  title?: string;
  date?: string,
  questions?: Array<MCCAssessmentResponseItem>,
  subsections?: Array<MccAssessment>
}

