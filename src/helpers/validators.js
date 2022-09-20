import { isBoolean, isDate, isEmpty, isNumber } from 'lodash-es';

export const required = value => ({
    isValid:
        !isEmpty(value) ||
        isNumber(value) ||
        isDate(value) ||
        isBoolean(value) ||
        value instanceof File,
    message: 'This field is required',
})

export const minLength = (length) => value => ({
    isValid: String(value).length >= length,
    message: `Minimal length is ${length}`,
})

export const maxLength = (length) => value => ({
    isValid: String(value).length <= length,
    message: `Maximum length is ${length}`,
})
