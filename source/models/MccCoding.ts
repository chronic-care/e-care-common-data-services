export class MccCoding implements MccType {
    fhirType: string = 'Coding'
    system: string = 'undefined'
    version: string = 'undefined'
    code: string = 'undefined'
    display: string = 'undefined'

    constructor(defsystem: string, code: string) {
        this.system = defsystem
        this.code = code
    }

    getKey(defSystem:string) {
        var key: string
        if(this.system != 'undefined')
        {
            key = this.system;
        } else {
            key = defSystem;
        }

        if(this.code != 'undefined')
        {
            key = key + '|' + this.code
        }
        return key   
    }     
}

