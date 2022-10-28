import { get, isEmpty, isEqual } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useFormValidation = (formSchema, validationRules) => {
    const validationDefaultState = useMemo(() => {
        return Object.keys(validationRules).reduce(
            (acc, fieldName) => ({
                ...acc,
                [fieldName]: {
                    isInvalid: false,
                    isDirty: false,
                    isError: false,
                    errors: [],
                },
            }),
            {},
        )
    }, [validationRules]);

    const [validationState, setValidationState] = useState(validationDefaultState);

    const getValidationState = useCallback(() => {
        return Object.keys(validationRules).reduce((acc, fieldName) => {
            const validateResult = _validateField(fieldName)

            return {
                ...acc,
                ...validateResult,
            }
        }, {})
    }, [formSchema, validationRules, validationState])

    useEffect(() => {
        setValidationState(validationState => {
            const newState = getValidationState()

            return isEqual(validationState, newState) ? validationState : newState
        })
    }, [getValidationState, formSchema, validationState])

    const _validateField = (fieldName) => {
        const fieldValidators = validationRules[fieldName]

        if (!fieldValidators || isEmpty(fieldValidators))
            throw new Error('Field has no validators')

        let errors = {};

        for (const validatorName in fieldValidators) {
            const validationResult = fieldValidators[validatorName](
                formSchema[fieldName],
            )

            if (!validationResult.isValid) {
                errors = {
                    ...errors,
                    [validatorName]: { message: validationResult.message },
                }
            }
        }

        return {
            [fieldName]: {
                ...(validationState ? validationState[fieldName] : {}),
                errors,
                isInvalid:
                    !isEmpty(validationState && validationState[fieldName].errors) ||
                    false,
                isError:
                    (validationState &&
                        validationState[fieldName].isDirty &&
                        validationState &&
                        validationState[fieldName].isInvalid) ||
                    false,
                isDirty:
                    (validationState && validationState[fieldName].isDirty) || false,
            },
        }
    }

    const isFormValid = () => {
        for (const key in validationState) {
            touchField(key)
            if (validationState[key].isInvalid) return false
        }
        return true
    }

    const getFieldErrorMessage = useCallback(
        (fieldPath) => {
            const validationField = get(validationState, fieldPath)

            if (!validationField) throw new Error('Field not found')
            else if (!Object.entries(validationField.errors)[0]) return ''

            return (
                (validationField.isError &&
                    Object.entries(validationField.errors)[0][1].message) ||
                ''
            )
        },
        [validationState],
    )

    const touchField = (fieldPath) => {
        setValidationState(prevState => ({
            ...prevState,
            [fieldPath]: {
                ...validationState[fieldPath],
                isDirty: true,
            },
        }))
    }

    return {
        isFormValid,
        getFieldErrorMessage,
        touchField,
    }
}