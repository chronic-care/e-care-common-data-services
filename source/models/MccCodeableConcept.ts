import { MccCoding } from './MccCoding'

export class MccCodeableConcept implements MccType{
    fhirType: string = 'CodeableConcept'
    coding: MccCoding[] = []
    text: string = 'undefined'

    constructor(text: string) {
        this.text = text
    }

    getKey(defSystem: string)
    {
        let out: string = 'undefined'
        let findCode: MccCoding | undefined

        if(typeof defSystem != 'undefined' && defSystem) {
            this.coding.forEach( (cd) => {
                if(cd.system === defSystem)
                {
                    findCode = cd                    
                }                
            });
        }

        if(typeof findCode === undefined || findCode)
        {
            findCode = this.coding[0];
        }

        if(typeof findCode != undefined && findCode)
        {
            out = findCode.getKey(defSystem)
        }
    return out
    }
   
    getCode(system: string)
    {
        let findCode: MccCoding | undefined
        if(typeof system != 'undefined' && system) {
            this.coding.forEach((cd) => {
                if(cd.system === system)
                {
                    findCode = cd                    
                }  
            });
        }
        return findCode
    }
}