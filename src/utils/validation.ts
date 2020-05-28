namespace App {
    
    export interface Validatable {
        value: string | number
        required: boolean
        minLength?: number
        maxLength?: number
        min?: number
        max?: number
    }
    
    export function validate(validatabale: Validatable) {
        let isValid = true
        if( validatabale.required ) {
            isValid = isValid && validatabale.value.toString().trim().length !== 0
        }
        if( validatabale.minLength != null && typeof validatabale.value === 'string') {
            isValid = isValid && validatabale.value.length > validatabale.minLength
        }
        if( validatabale.maxLength != null && typeof validatabale.value === 'string') {
            isValid = isValid && validatabale.value.length < validatabale.maxLength
        }
        if( validatabale.min != null && typeof validatabale.value === 'number') {
            isValid = isValid && validatabale.value >= validatabale.min
        }
        if( validatabale.max != null && typeof validatabale.value === 'number') {
            isValid = isValid && validatabale.value <= validatabale.max
        }
        return isValid
    }
}