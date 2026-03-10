'use client';

import React, { useState } from 'react';
import styles from './guide.module.css';
import { useRouter } from 'next/navigation';

interface GuideFormData {
  name: string;
  gender: string;
  dob: string;
  nic: string;
  contact: string;
  email: string;
  coveredLocations: string[];
  availability: string[];
  languages: string[];
  experiences: string;
  description: string;
}

interface FieldErrors {
  [key: string]: string;
}

const GuideRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<GuideFormData>({
    name: '',
    gender: '',
    dob: '',
    nic: '',
    contact: '',
    email: '',
    coveredLocations: [],
    availability: [],
    languages: [],
    experiences: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const locations = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  const availabilityOptions = ['Weekdays', 'Weekends'];

  const languageOptions = [
    'English', 'Sinhala', 'Tamil', 'Japanese', 'German', 'French'
  ];

  // Updated validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) return "Full name is required";
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  // ✅ UPDATED: Sri Lankan NIC validation
  const validateNIC = (nic: string): string => {
    if (!nic.trim()) return "National ID is required";
    
    const cleanedNIC = nic.trim().toUpperCase();
    
    // Old NIC format: 9 digits + V/X (e.g., 123456789V)
    const oldNICPattern = /^[0-9]{9}[VX]$/;
    
    // New NIC format: 12 digits (e.g., 123456789012)
    const newNICPattern = /^[0-9]{12}$/;
    
    if (!oldNICPattern.test(cleanedNIC) && !newNICPattern.test(cleanedNIC)) {
      return "Please enter a valid Sri Lankan NIC (9 digits + V/X or 12 digits)";
    }
    
    return "";
  };

  // ✅ UPDATED: Sri Lankan contact number validation
  const validateContact = (contact: string): string => {
    if (!contact.trim()) return "Contact number is required";
    
    // Remove any spaces, dashes, or other non-digit characters
    const cleanedContact = contact.replace(/\D/g, '');
    
    // Check if it's exactly 10 digits
    if (cleanedContact.length !== 10) {
      return "Contact number must be exactly 10 digits";
    }
    
    // Sri Lankan mobile number patterns
    // Pattern 1: 07XXXXXXXX (mobile numbers)
    // Pattern 2: 01XXXXXXXX (landline numbers)
    const mobilePattern = /^07[0-9]{8}$/;
    const landlinePattern = /^01[0-9]{8}$/;
    
    if (!mobilePattern.test(cleanedContact) && !landlinePattern.test(cleanedContact)) {
      return "Please enter a valid Sri Lankan phone number (07XXXXXXXX for mobile or 01XXXXXXXX for landline)";
    }
    
    return "";
  };

  // ✅ UPDATED: Any age allowed - no age restrictions
  const validateDateOfBirth = (dob: string): string => {
    if (!dob) return "Date of birth is required";
    const today = new Date();
    const birthDate = new Date(dob);
    
    if (birthDate > today) return "Date of birth cannot be in the future";
    // Removed age restrictions - any age is now allowed
    return "";
  };

  const validateGender = (gender: string): string => {
    if (!gender) return "Gender is required";
    return "";
  };

  // ✅ UPDATED: At least one language required, no max limit
  const validateLanguages = (languages: string[]): string => {
    if (languages.length === 0) return "At least one language is required";
    return "";
  };

  // ✅ UPDATED: At least one availability required, no other rules
  const validateAvailability = (availability: string[]): string => {
    if (availability.length === 0) return "At least one availability option is required";
    return "";
  };

  // ✅ UPDATED: At least one location required, no max limit
  const validateCoveredLocations = (locations: string[]): string => {
    if (locations.length === 0) return "At least one location must be selected";
    return "";
  };

  // ✅ UPDATED: Professional experience is completely optional
  const validateExperiences = (experiences: string): string => {
    // No validation needed - completely optional and any content allowed
    return "";
  };

  // ✅ UPDATED: About You section MUST have content
  const validateDescription = (description: string): string => {
    if (!description.trim()) return "You must write something about yourself in the About You section";
    return "";
  };

  const validateStep = (step: number): FieldErrors => {
    const errors: FieldErrors = {};
    
    switch (step) {
      case 1:
        errors.name = validateName(formData.name);
        errors.gender = validateGender(formData.gender);
        errors.dob = validateDateOfBirth(formData.dob);
        errors.nic = validateNIC(formData.nic);
        errors.contact = validateContact(formData.contact);
        errors.email = validateEmail(formData.email);
        break;
      case 2:
        errors.languages = validateLanguages(formData.languages);
        errors.availability = validateAvailability(formData.availability);
        errors.coveredLocations = validateCoveredLocations(formData.coveredLocations);
        break;
      case 3:
        errors.experiences = validateExperiences(formData.experiences);
        errors.description = validateDescription(formData.description);
        break;
    }
    
    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (arrayName: keyof Pick<GuideFormData, 'coveredLocations' | 'availability' | 'languages'>, value: string) => {
    // Clear field error when user makes selection
    if (fieldErrors[arrayName]) {
      setFieldErrors(prev => ({
        ...prev,
        [arrayName]: ""
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(value)
        ? prev[arrayName].filter(item => item !== value)
        : [...prev[arrayName], value]
    }));
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    setFieldErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setMessage('');
    } else {
      setMessage('Please fix the errors below before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setMessage('');
    setFieldErrors({});
  };

  // ✅ UPDATED: Enhanced error handling for backend responses
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps
    const step1Errors = validateStep(1);
    const step2Errors = validateStep(2);
    const step3Errors = validateStep(3);
    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors };
    
    setFieldErrors(allErrors);
    
    if (Object.keys(allErrors).length > 0) {
      setMessage('Please fix all errors before submitting.');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:2000/api/guides/addGuide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        // Handle backend validation errors
        if (responseData.errors && Array.isArray(responseData.errors)) {
          const backendErrors: FieldErrors = {};
          responseData.errors.forEach((error: any) => {
            if (error.field) {
              backendErrors[error.field] = error.message;
            }
          });
          setFieldErrors(backendErrors);
          setMessage('Please fix the validation errors below.');
        } else {
          setMessage(`Error: ${responseData.message || 'Failed to register guide'}`);
        }
      }
    } catch (error) {
      setMessage('Error: Failed to connect to server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const redirectDashboard = () => {
    router.push('/Dashboard');
  }

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setFieldErrors({});
    setMessage('');
    setFormData({
      name: '',
      gender: '',
      dob: '',
      nic: '',
      contact: '',
      email: '',
      coveredLocations: [],
      availability: [],
      languages: [],
      experiences: '',
      description: '',
    });
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <h1 className={styles.successTitle}>Guide Successfully Registered!</h1>
          <p className={styles.successMessage}>
            Congratulations! <strong>{formData.name}</strong> has been successfully registered as a tour guide in our system.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Languages:</strong> {formData.languages.join(', ')}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Locations:</strong> {formData.coveredLocations.length} areas covered</p>
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>
            Register Another Guide
          </button>
      
          <button onClick={redirectDashboard} className={styles.newRegistrationButton}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <div className={styles.stepIndicators}>
            {[1, 2, 3].map(step => (
              <div 
                key={step}
                className={`${styles.stepIndicator} ${currentStep >= step ? styles.active : ''}`}
              >
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepLabel}>
                  {step === 1 && 'Personal Info'}
                  {step === 2 && 'Skills & Coverage'}
                  {step === 3 && 'Experience'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Guide Registration</h1>
        
        {message && (
          <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 1: Personal Information</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.name ? styles.inputError : ''}`}
                    placeholder="Enter your full name"
                  />
                  {fieldErrors.name && <p className={styles.fieldError}>{fieldErrors.name}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="gender" className={styles.label}>Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`${styles.select} ${fieldErrors.gender ? styles.inputError : ''}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.gender && <p className={styles.fieldError}>{fieldErrors.gender}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="dob" className={styles.label}>Date of Birth * <span className={styles.helpText}>(Any age allowed)</span></label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.dob ? styles.inputError : ''}`}
                  />
                  {fieldErrors.dob && <p className={styles.fieldError}>{fieldErrors.dob}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="nic" className={styles.label}>National ID Number * <span className={styles.helpText}>(9 digits + V/X or 12 digits)</span></label>
                  <input
                    type="text"
                    id="nic"
                    name="nic"
                    value={formData.nic}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.nic ? styles.inputError : ''}`}
                    placeholder="Enter your NIC number"
                  />
                  {fieldErrors.nic && <p className={styles.fieldError}>{fieldErrors.nic}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="contact" className={styles.label}>Contact Number * <span className={styles.helpText}>(10 digits: 07XXXXXXXX or 01XXXXXXXX)</span></label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.contact ? styles.inputError : ''}`}
                    placeholder="Enter your contact number"
                  />
                  {fieldErrors.contact && <p className={styles.fieldError}>{fieldErrors.contact}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                    placeholder="Enter your email address"
                  />
                  {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Skills & Coverage */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 2: Skills & Coverage</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>Languages * <span className={styles.helpText}>(Select at least one)</span></label>
                <div className={styles.checkboxGrid}>
                  {languageOptions.map(language => (
                    <label key={language} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(language)}
                        onChange={() => handleArrayChange('languages', language)}
                        className={styles.checkbox}
                      />
                      {language}
                    </label>
                  ))}
                </div>
                {fieldErrors.languages && <p className={styles.fieldError}>{fieldErrors.languages}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Availability * <span className={styles.helpText}>(Select at least one)</span></label>
                <div className={styles.checkboxRow}>
                  {availabilityOptions.map(option => (
                    <label key={option} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(option)}
                        onChange={() => handleArrayChange('availability', option)}
                        className={styles.checkbox}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {fieldErrors.availability && <p className={styles.fieldError}>{fieldErrors.availability}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Covered Locations * <span className={styles.helpText}>(Select at least one)</span></label>
                <div className={styles.checkboxGrid}>
                  {locations.map(location => (
                    <label key={location} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.coveredLocations.includes(location)}
                        onChange={() => handleArrayChange('coveredLocations', location)}
                        className={styles.checkbox}
                      />
                      {location}
                    </label>
                  ))}
                </div>
                {fieldErrors.coveredLocations && <p className={styles.fieldError}>{fieldErrors.coveredLocations}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 3: Experience & About You</h2>
              
              <div className={styles.field}>
                <label htmlFor="experiences" className={styles.label}>
                  Professional Experience <span className={styles.helpText}>(Optional - write anything or leave blank)</span>
                </label>
                <textarea
                  id="experiences"
                  name="experiences"
                  value={formData.experiences}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${fieldErrors.experiences ? styles.inputError : ''}`}
                  rows={5}
                  placeholder="Describe your professional experience, certifications, and qualifications as a tour guide (optional)"
                />
                {fieldErrors.experiences && <p className={styles.fieldError}>{fieldErrors.experiences}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="description" className={styles.label}>
                  About You * <span className={styles.helpText}>(Required - tell us something about yourself)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${fieldErrors.description ? styles.inputError : ''}`}
                  rows={5}
                  placeholder="Tell us about yourself, your guiding style, and what travelers can expect when touring with you (required)"
                />
                {fieldErrors.description && <p className={styles.fieldError}>{fieldErrors.description}</p>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={styles.buttonContainer}>
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className={styles.prevButton}>
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className={styles.nextButton}>
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Guide'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuideRegistrationForm;