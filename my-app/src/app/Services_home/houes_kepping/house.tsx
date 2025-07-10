'use client';

import React, { useState } from 'react';
import styles from './house.module.css';
import { useRouter } from 'next/navigation';

interface HousekeepingFormData {
  businessName: string;
  ownerFullName: string;
  contactPhone: string;
  contactEmail: string;
  alternatePhone: string;
  websiteUrl: string;
  businessDescription: string;
  serviceTypes: string[];
  pricingMethod: string;
  serviceArea: string;
  addressOrLandmark: string;
  googleMapsLink: string;
  daysAvailable: string[];
  timeSlot: string;
  emergencyServiceAvailable: boolean;
  businessRegistrationNumber: string;
  licensesCertificates: string;
  termsAgreed: boolean;
}

interface FieldErrors {
  [key: string]: string;
}

const HousekeepingRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<HousekeepingFormData>({
    businessName: '',
    ownerFullName: '',
    contactPhone: '',
    contactEmail: '',
    alternatePhone: '',
    websiteUrl: '',
    businessDescription: '',
    serviceTypes: [],
    pricingMethod: '',
    serviceArea: '',
    addressOrLandmark: '',
    googleMapsLink: '',
    daysAvailable: [],
    timeSlot: '',
    emergencyServiceAvailable: false,
    businessRegistrationNumber: '',
    licensesCertificates: '',
    termsAgreed: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const serviceTypeOptions = [
    'Housekeeping (Home/Office)',
    'Deep Cleaning',
    'Carpet Cleaning',
    'Window Cleaning',
    'Laundry & Ironing',
    'Dry Cleaning',
    'Sofa/Chair Cleaning',
    'Disinfection & Sanitization',
  ];

  const pricingMethodOptions = [
    'Per Hour',
    'Per Square Foot',
    'Per Visit',
    'Custom Quote',
  ];

  const dayOptions = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Validation functions
  const validateBusinessName = (name: string): string => {
    if (!name.trim()) return "Business name is required";
    if (name.length < 2) return "Business name must be at least 2 characters";
    if (name.length > 100) return "Business name must be less than 100 characters";
    if (!/^[a-zA-Z0-9\s.&'-]+$/.test(name)) return "Business name can only contain letters, numbers, spaces, and common symbols";
    return "";
  };

  const validateOwnerFullName = (name: string): string => {
    if (!name.trim()) return "Owner full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s.]+$/.test(name)) return "Name can only contain letters, spaces, and periods";
    return "";
  };

  const validateContactPhone = (phone: string): string => {
    if (!phone.trim()) return "Contact phone is required";
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (!phoneRegex.test(cleanPhone)) return "Please enter a valid phone number";
    if (cleanPhone.length < 10) return "Phone number must be at least 10 digits";
    return "";
  };

  const validateContactEmail = (email: string): string => {
    if (!email.trim()) return "Contact email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateAlternatePhone = (phone: string): string => {
    if (phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
      if (!phoneRegex.test(cleanPhone)) return "Please enter a valid alternate phone number";
      if (cleanPhone.length < 10) return "Alternate phone number must be at least 10 digits";
    }
    return "";
  };

  const validateWebsiteUrl = (url: string): string => {
    if (url.trim()) {
      try {
        new URL(url);
      } catch {
        return "Please enter a valid website URL";
      }
    }
    return "";
  };

  const validateBusinessDescription = (description: string): string => {
    if (description.trim() && description.length > 1000) {
      return "Business description must be less than 1000 characters";
    }
    return "";
  };

  const validateServiceTypes = (services: string[]): string => {
    if (services.length === 0) return "At least one service type is required";
    if (services.length > 8) return "Maximum 8 service types can be selected";
    return "";
  };

  const validatePricingMethod = (method: string): string => {
    if (!method) return "Pricing method is required";
    return "";
  };

  const validateServiceArea = (area: string): string => {
    if (!area.trim()) return "Service area is required";
    if (area.length < 2) return "Service area must be at least 2 characters";
    if (area.length > 100) return "Service area must be less than 100 characters";
    return "";
  };

  const validateAddressOrLandmark = (address: string): string => {
    if (address.trim() && address.length > 200) {
      return "Address must be less than 200 characters";
    }
    return "";
  };

  const validateGoogleMapsLink = (link: string): string => {
    if (link.trim()) {
      try {
        new URL(link);
        if (!link.includes('maps.google') && !link.includes('goo.gl/maps')) {
          return "Please enter a valid Google Maps link";
        }
      } catch {
        return "Please enter a valid URL";
      }
    }
    return "";
  };

  const validateDaysAvailable = (days: string[]): string => {
    if (days.length === 0) return "At least one available day is required";
    return "";
  };

  const validateTimeSlot = (timeSlot: string): string => {
    if (!timeSlot.trim()) return "Time slot is required";
    if (timeSlot.length < 5) return "Time slot must be at least 5 characters";
    if (timeSlot.length > 100) return "Time slot must be less than 100 characters";
    return "";
  };

  const validateBusinessRegistrationNumber = (regNumber: string): string => {
    if (regNumber.trim()) {
      if (regNumber.length < 5) return "Registration number must be at least 5 characters";
      if (regNumber.length > 50) return "Registration number must be less than 50 characters";
      if (!/^[a-zA-Z0-9\-\/]+$/.test(regNumber)) return "Registration number can only contain letters, numbers, hyphens, and slashes";
    }
    return "";
  };

  const validateLicensesCertificates = (licenses: string): string => {
    if (licenses.trim() && licenses.length > 500) {
      return "Licenses URL must be less than 500 characters";
    }
    return "";
  };

  const validateTermsAgreed = (agreed: boolean): string => {
    if (!agreed) return "You must agree to the terms and conditions";
    return "";
  };

  const validateStep = (step: number): FieldErrors => {
    const errors: FieldErrors = {};
    
    switch (step) {
      case 1:
        errors.businessName = validateBusinessName(formData.businessName);
        errors.ownerFullName = validateOwnerFullName(formData.ownerFullName);
        errors.contactPhone = validateContactPhone(formData.contactPhone);
        errors.contactEmail = validateContactEmail(formData.contactEmail);
        errors.alternatePhone = validateAlternatePhone(formData.alternatePhone);
        errors.websiteUrl = validateWebsiteUrl(formData.websiteUrl);
        errors.businessDescription = validateBusinessDescription(formData.businessDescription);
        break;
      case 2:
        errors.serviceTypes = validateServiceTypes(formData.serviceTypes);
        errors.pricingMethod = validatePricingMethod(formData.pricingMethod);
        errors.serviceArea = validateServiceArea(formData.serviceArea);
        errors.addressOrLandmark = validateAddressOrLandmark(formData.addressOrLandmark);
        errors.googleMapsLink = validateGoogleMapsLink(formData.googleMapsLink);
        break;
      case 3:
        errors.daysAvailable = validateDaysAvailable(formData.daysAvailable);
        errors.timeSlot = validateTimeSlot(formData.timeSlot);
        errors.businessRegistrationNumber = validateBusinessRegistrationNumber(formData.businessRegistrationNumber);
        errors.licensesCertificates = validateLicensesCertificates(formData.licensesCertificates);
        errors.termsAgreed = validateTermsAgreed(formData.termsAgreed);
        break;
    }
    
    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checkbox = e.target as HTMLInputElement;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxGroupChange = (name: string, value: string) => {
    // Clear field error when user makes selection
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    setFormData(prev => {
      const currentArray = prev[name as keyof HousekeepingFormData] as string[];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [name]: updatedArray,
      };
    });
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
      const response = await fetch('http://localhost:2000/api/addHousekeeping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'Failed to register housekeeping service'}`);
      }
    } catch (error) {
      setMessage('Error: Failed to connect to server');
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
      businessName: '',
      ownerFullName: '',
      contactPhone: '',
      contactEmail: '',
      alternatePhone: '',
      websiteUrl: '',
      businessDescription: '',
      serviceTypes: [],
      pricingMethod: '',
      serviceArea: '',
      addressOrLandmark: '',
      googleMapsLink: '',
      daysAvailable: [],
      timeSlot: '',
      emergencyServiceAvailable: false,
      businessRegistrationNumber: '',
      licensesCertificates: '',
      termsAgreed: false,
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
          <h1 className={styles.successTitle}>Housekeeping Service Successfully Registered!</h1>
          <p className={styles.successMessage}>
            Congratulations! <strong>{formData.businessName}</strong> has been successfully registered as a housekeeping service in our system.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Business:</strong> {formData.businessName}</p>
            <p><strong>Owner:</strong> {formData.ownerFullName}</p>
            <p><strong>Email:</strong> {formData.contactEmail}</p>
            <p><strong>Services:</strong> {formData.serviceTypes.length} services offered</p>
            <p><strong>Service Area:</strong> {formData.serviceArea}</p>
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>
            Register Another Service
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
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Service Details'}
                  {step === 3 && 'Availability & Legal'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Housekeeping Service Registration</h1>
        
        {message && (
          <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 1: Basic Information</h2>
              
              <div className={styles.field}>
                <label htmlFor="businessName" className={styles.label}>Business Name *</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.businessName ? styles.inputError : ''}`}
                  placeholder="Enter your business name"
                />
                {fieldErrors.businessName && <p className={styles.fieldError}>{fieldErrors.businessName}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="ownerFullName" className={styles.label}>Owner Full Name *</label>
                <input
                  type="text"
                  id="ownerFullName"
                  name="ownerFullName"
                  value={formData.ownerFullName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.ownerFullName ? styles.inputError : ''}`}
                  placeholder="Enter owner's full name"
                />
                {fieldErrors.ownerFullName && <p className={styles.fieldError}>{fieldErrors.ownerFullName}</p>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="contactPhone" className={styles.label}>Contact Phone *</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.contactPhone ? styles.inputError : ''}`}
                    placeholder="Enter contact phone"
                  />
                  {fieldErrors.contactPhone && <p className={styles.fieldError}>{fieldErrors.contactPhone}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="alternatePhone" className={styles.label}>Alternate Phone</label>
                  <input
                    type="tel"
                    id="alternatePhone"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.alternatePhone ? styles.inputError : ''}`}
                    placeholder="Enter alternate phone"
                  />
                  {fieldErrors.alternatePhone && <p className={styles.fieldError}>{fieldErrors.alternatePhone}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="contactEmail" className={styles.label}>Contact Email *</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.contactEmail ? styles.inputError : ''}`}
                  placeholder="Enter contact email"
                />
                {fieldErrors.contactEmail && <p className={styles.fieldError}>{fieldErrors.contactEmail}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="websiteUrl" className={styles.label}>Website URL</label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.websiteUrl ? styles.inputError : ''}`}
                  placeholder="Enter website URL"
                />
                {fieldErrors.websiteUrl && <p className={styles.fieldError}>{fieldErrors.websiteUrl}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="businessDescription" className={styles.label}>
                  Business Description {formData.businessDescription.length > 0 && `(${formData.businessDescription.length}/1000)`}
                </label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${fieldErrors.businessDescription ? styles.inputError : ''}`}
                  rows={4}
                  placeholder="Describe your business and services"
                />
                {fieldErrors.businessDescription && <p className={styles.fieldError}>{fieldErrors.businessDescription}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 2: Service Details</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>Service Types *</label>
                <div className={styles.checkboxGrid}>
                  {serviceTypeOptions.map((service) => (
                    <label key={service} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.serviceTypes.includes(service)}
                        onChange={() => handleCheckboxGroupChange('serviceTypes', service)}
                        className={styles.checkbox}
                      />
                      {service}
                    </label>
                  ))}
                </div>
                {fieldErrors.serviceTypes && <p className={styles.fieldError}>{fieldErrors.serviceTypes}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="pricingMethod" className={styles.label}>Pricing Method *</label>
                <select
                  id="pricingMethod"
                  name="pricingMethod"
                  value={formData.pricingMethod}
                  onChange={handleInputChange}
                  className={`${styles.select} ${fieldErrors.pricingMethod ? styles.inputError : ''}`}
                >
                  <option value="">Select pricing method</option>
                  {pricingMethodOptions.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
                {fieldErrors.pricingMethod && <p className={styles.fieldError}>{fieldErrors.pricingMethod}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="serviceArea" className={styles.label}>Service Area *</label>
                <input
                  type="text"
                  id="serviceArea"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.serviceArea ? styles.inputError : ''}`}
                  placeholder="Enter service area (e.g., Downtown, North Zone)"
                />
                {fieldErrors.serviceArea && <p className={styles.fieldError}>{fieldErrors.serviceArea}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="addressOrLandmark" className={styles.label}>Address or Landmark</label>
                <input
                  type="text"
                  id="addressOrLandmark"
                  name="addressOrLandmark"
                  value={formData.addressOrLandmark}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.addressOrLandmark ? styles.inputError : ''}`}
                  placeholder="Enter address or nearby landmark"
                />
                {fieldErrors.addressOrLandmark && <p className={styles.fieldError}>{fieldErrors.addressOrLandmark}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="googleMapsLink" className={styles.label}>Google Maps Link</label>
                <input
                  type="url"
                  id="googleMapsLink"
                  name="googleMapsLink"
                  value={formData.googleMapsLink}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.googleMapsLink ? styles.inputError : ''}`}
                  placeholder="Enter Google Maps link"
                />
                {fieldErrors.googleMapsLink && <p className={styles.fieldError}>{fieldErrors.googleMapsLink}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Availability & Legal */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 3: Availability & Legal</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>Days Available *</label>
                <div className={styles.checkboxGrid}>
                  {dayOptions.map((day) => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.daysAvailable.includes(day)}
                        onChange={() => handleCheckboxGroupChange('daysAvailable', day)}
                        className={styles.checkbox}
                      />
                      {day}
                    </label>
                  ))}
                </div>
                {fieldErrors.daysAvailable && <p className={styles.fieldError}>{fieldErrors.daysAvailable}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="timeSlot" className={styles.label}>Time Slot *</label>
                <input
                  type="text"
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.timeSlot ? styles.inputError : ''}`}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
                {fieldErrors.timeSlot && <p className={styles.fieldError}>{fieldErrors.timeSlot}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="emergencyServiceAvailable"
                    checked={formData.emergencyServiceAvailable}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Emergency Service Available
                </label>
              </div>

              <div className={styles.field}>
                <label htmlFor="businessRegistrationNumber" className={styles.label}>Business Registration Number</label>
                <input
                  type="text"
                  id="businessRegistrationNumber"
                  name="businessRegistrationNumber"
                  value={formData.businessRegistrationNumber}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.businessRegistrationNumber ? styles.inputError : ''}`}
                  placeholder="Enter business registration number"
                />
                {fieldErrors.businessRegistrationNumber && <p className={styles.fieldError}>{fieldErrors.businessRegistrationNumber}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="licensesCertificates" className={styles.label}>Licenses & Certificates URL</label>
                <input
                  type="url"
                  id="licensesCertificates"
                  name="licensesCertificates"
                  value={formData.licensesCertificates}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.licensesCertificates ? styles.inputError : ''}`}
                  placeholder="Enter licenses/certificates document URL"
                />
                {fieldErrors.licensesCertificates && <p className={styles.fieldError}>{fieldErrors.licensesCertificates}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  I agree to the terms and conditions *
                </label>
                {fieldErrors.termsAgreed && <p className={styles.fieldError}>{fieldErrors.termsAgreed}</p>}
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
                {loading ? 'Registering...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default HousekeepingRegistrationForm;