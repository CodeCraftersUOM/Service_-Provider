"use client"

import { useState, useCallback } from "react"
import { z } from "zod"
import { validateStep } from "./validation-schemas"

export interface ValidationErrors {
  [key: string]: string[]
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // Add this debug function
  const debugErrors = useCallback(() => {
    console.log("Current errors:", errors)
    console.log("Touched fields:", Array.from(touchedFields))
    console.log("Has errors:", Object.keys(errors).length > 0)
    return errors
  }, [errors, touchedFields])

  const validateField = useCallback((name: string, value: any, schema: z.ZodSchema) => {
    try {
      schema.parse({ [name]: value })
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.issues.map((issue) => issue.message) // Changed from error.errors to error.issues
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors,
        }))
      }
      return false
    }
  }, [])

  const validateStepData = useCallback((step: number, category: string, formData: any) => {
    const result = validateStep(step, category, formData)

    if (!result.success && result.error) {
      const newErrors: ValidationErrors = {}
      result.error.issues.forEach((issue) => {
        // Changed from error.errors to error.issues
        const path = issue.path.join(".")
        if (!newErrors[path]) {
          newErrors[path] = []
        }
        newErrors[path].push(issue.message)
      })
      setErrors(newErrors)
      return false
    }

    setErrors({})
    return true
  }, [])

  const markFieldAsTouched = useCallback((fieldName: string) => {
    setTouchedFields((prev) => new Set([...prev, fieldName]))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
    setTouchedFields(new Set())
  }, [])

  const getFieldError = useCallback(
    (fieldName: string) => {
      return touchedFields.has(fieldName) ? errors[fieldName] : undefined
    },
    [errors, touchedFields],
  )

  return {
    errors,
    touchedFields,
    validateField,
    validateStepData,
    markFieldAsTouched,
    clearErrors,
    getFieldError,
    hasErrors: Object.keys(errors).length > 0,
    debugErrors, // Add this to the return
  }
}
