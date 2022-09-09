import { MccCodeableConcept } from './MccCodeableConcept'
import { MccReference } from './MccReference'

export class MccObservation {
    FHIRId: string = 'undefined'
    code: MccCodeableConcept | undefined
    status: string = 'undefined'
    basedOn: MccReference[] = []


}