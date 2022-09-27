import { QuestionnaireResponse } from 'fhir/r4';
export declare const getQuestionnaireItem: (code: string) => Promise<QuestionnaireResponse>;
export declare const getQuestionnaireItems: (code: string, count?: string, sort?: string) => Promise<QuestionnaireResponse[]>;
