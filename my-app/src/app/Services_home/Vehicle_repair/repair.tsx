'use client';

import React, { useState } from 'react';
import styles from './repair.module.css';
import { useRouter } from 'next/navigation';

interface VehicleRepairFormData {
  businessName: string;
  ownerFullName: string;
  businessPhoneNumber: string;
  businessEmailAddress: string;
  businessWebsite: string;
  businessDescription: string;
  locationAddress: string;
  googleMapsLink: string;
  servicesOffered: string[];
  workingHours: {
    daysOpen: string[];
    openingTime: string;
    closingTime: string;
  };
  businessRegistrationNumber: string;
  licenseDocumentUrl: string;
  termsAgreed: boolean;
}

interface FieldErrors {
  [key: string]: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const serviceOptions = [
  'Engine Repair', 'Brake Service', 'Transmission Repair', 'Oil Change', 
  'Tire Service', 'Battery Service', 'Air Conditioning', 'Electrical Repair',
  'Body Work', 'Paint Service', 'Windshield Repair', 'Suspension Repair',
  'Exhaust Service', 'Diagnostic Service', 'Towing Service', 'Emergency Repair'
];

const ModernVehicleRepairForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<VehicleRepairFormData>({
    businessName: '',
    ownerFullName: '',
    businessPhoneNumber: '',
    businessEmailAddress: '',
    businessWebsite: '',
    businessDescription: '',
    locationAddress: '',
    googleMapsLink: '',
    servicesOffered: [],
    workingHours: {
      daysOpen: [],
      openingTime: '',
      closingTime: ''
    },
    businessRegistrationNumber: '',
    licenseDocumentUrl: '',
    termsAgreed: false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  // Validation functions
  const validateBusinessName = (name: string): string => {
    if (!name.trim()) return "Business name is required";
    if (name.length < 2) return "Business name must be at least 2 characters";
    if (name.length > 100) return "Business name must be less than 100 characters";
    if (!/^[a-zA-Z0-9\s.&'-]+$/.test(name)) return "Business name can only contain letters, numbers, spaces, and common symbols";
    return "";
  };

  const validateOwnerFullName = (name: string): string => {
    if (!name.trim()) return "Owner's full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s.]+$/.test(name)) return "Name can only contain letters, spaces, and periods";
    return "";
  };

  const validateBusinessPhoneNumber = (phone: string): string => {
    if (!phone.trim()) return "Business phone number is required";
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (!phoneRegex.test(cleanPhone)) return "Please enter a valid phone number";
    if (cleanPhone.length < 10) return "Phone number must be at least 10 digits";
    return "";
  };

  const validateBusinessEmailAddress = (email: string): string => {
    if (!email.trim()) return "Business email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateBusinessWebsite = (website: string): string => {
    if (website.trim()) {
      try {
        new URL(website);
      } catch {
        return "Please enter a valid website URL";
      }
    }
    return "";
  };

  const validateBusinessDescription = (description: string): string => {
    if (!description.trim()) return "Business description is required";
    if (description.length < 10) return "Description must be at least 10 characters";
    if (description.length > 1000) return "Description must be less than 1000 characters";
    return "";
  };

  const validateLocationAddress = (address: string): string => {
    if (!address.trim()) return "Location address is required";
    if (address.length < 10) return "Address must be at least 10 characters";
    if (address.length > 200) return "Address must be less than 200 characters";
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

  const validateServicesOffered = (services: string[]): string => {
    if (services.length === 0) return "At least one service must be selected";
    if (services.length > 12) return "Maximum 12 services can be selected";
    return "";
  };

  const validateWorkingDays = (days: string[]): string => {
    if (days.length === 0) return "At least one working day is required";
    return "";
  };

  const validateOpeningTime = (time: string): string => {
    if (!time) return "Opening time is required";
    return "";
  };

  const validateClosingTime = (time: string, openingTime: string): string => {
    if (!time) return "Closing time is required";
    if (openingTime && time) {
      const opening = new Date(`1970-01-01T${openingTime}:00`);
      const closing = new Date(`1970-01-01T${time}:00`);
      if (closing <= opening) {
        return "Closing time must be after opening time";
      }
    }
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

  const validateLicenseDocumentUrl = (url: string): string => {
    if (url.trim()) {
      try {
        new URL(url);
      } catch {
        return "Please enter a valid URL";
      }
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
        errors.businessPhoneNumber = validateBusinessPhoneNumber(formData.businessPhoneNumber);
        errors.businessEmailAddress = validateBusinessEmailAddress(formData.businessEmailAddress);
        errors.businessWebsite = validateBusinessWebsite(formData.businessWebsite);
        errors.businessDescription = validateBusinessDescription(formData.businessDescription);
        break;
      case 2:
        errors.locationAddress = validateLocationAddress(formData.locationAddress);
        errors.googleMapsLink = validateGoogleMapsLink(formData.googleMapsLink);
        errors.servicesOffered = validateServicesOffered(formData.servicesOffered);
        break;
      case 3:
        errors.workingDays = validateWorkingDays(formData.workingHours.daysOpen);
        errors.openingTime = validateOpeningTime(formData.workingHours.openingTime);
        errors.closingTime = validateClosingTime(formData.workingHours.closingTime, formData.workingHours.openingTime);
        errors.businessRegistrationNumber = validateBusinessRegistrationNumber(formData.businessRegistrationNumber);
        errors.licenseDocumentUrl = validateLicenseDocumentUrl(formData.licenseDocumentUrl);
        errors.termsAgreed = validateTermsAgreed(formData.termsAgreed);
        break;
    }
    
    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checkbox = e.target as HTMLInputElement;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    if (name.startsWith('workingHours.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        workingHours: { ...prev.workingHours, [key]: value }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDaysChange = (day: string) => {
    // Clear field error when user makes selection
    if (fieldErrors.workingDays) {
      setFieldErrors(prev => ({
        ...prev,
        workingDays: ""
      }));
    }
    
    setFormData(prev => {
      const days = prev.workingHours.daysOpen.includes(day)
        ? prev.workingHours.daysOpen.filter(d => d !== day)
        : [...prev.workingHours.daysOpen, day];
      return {
        ...prev,
        workingHours: { ...prev.workingHours, daysOpen: days }
      };
    });
  };

  const toggleService = (service: string) => {
    // Clear field error when user makes selection
    if (fieldErrors.servicesOffered) {
      setFieldErrors(prev => ({
        ...prev,
        servicesOffered: ""
      }));
    }
    
    setFormData(prev => {
      const services = prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter(s => s !== service)
        : [...prev.servicesOffered, service];
      return { ...prev, servicesOffered: services };
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
      const response = await fetch('http://localhost:2000/api/addRepair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setMessage(`Error: ${data.message || data.error || 'Failed to register business'}`);
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
      businessPhoneNumber: '',
      businessEmailAddress: '',
      businessWebsite: '',
      businessDescription: '',
      locationAddress: '',
      googleMapsLink: '',
      servicesOffered: [],
      workingHours: {
        daysOpen: [],
        openingTime: '',
        closingTime: ''
      },
      businessRegistrationNumber: '',
      licenseDocumentUrl: '',
      termsAgreed: false
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
          <h1 className={styles.successTitle}>Vehicle Repair Business Successfully Registered!</h1>
          <p className={styles.successMessage}>
            Congratulations! <strong>{formData.businessName}</strong> has been successfully registered as a vehicle repair service in our system.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Business:</strong> {formData.businessName}</p>
            <p><strong>Owner:</strong> {formData.ownerFullName}</p>
            <p><strong>Email:</strong> {formData.businessEmailAddress}</p>
            <p><strong>Services:</strong> {formData.servicesOffered.length} services offered</p>
            <p><strong>Working Days:</strong> {formData.workingHours.daysOpen.join(', ')}</p>
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>
            Register Another Business
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
                  {step === 1 && 'Business Info'}
                  {step === 2 && 'Location & Services'}
                  {step === 3 && 'Schedule & Legal'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Vehicle Repair Business Registration</h1>
        
        {message && (
          <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step 1: Business Information */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 1: Business Information</h2>
              
              <div className={styles.row}>
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
                  <label htmlFor="ownerFullName" className={styles.label}>Owner's Full Name *</label>
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
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="businessPhoneNumber" className={styles.label}>Business Phone Number *</label>
                  <input
                    type="tel"
                    id="businessPhoneNumber"
                    name="businessPhoneNumber"
                    value={formData.businessPhoneNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.businessPhoneNumber ? styles.inputError : ''}`}
                    placeholder="Enter business phone number"
                  />
                  {fieldErrors.businessPhoneNumber && <p className={styles.fieldError}>{fieldErrors.businessPhoneNumber}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="businessEmailAddress" className={styles.label}>Business Email Address *</label>
                  <input
                    type="email"
                    id="businessEmailAddress"
                    name="businessEmailAddress"
                    value={formData.businessEmailAddress}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.businessEmailAddress ? styles.inputError : ''}`}
                    placeholder="Enter business email address"
                  />
                  {fieldErrors.businessEmailAddress && <p className={styles.fieldError}>{fieldErrors.businessEmailAddress}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="businessWebsite" className={styles.label}>Business Website</label>
                <input
                  type="url"
                  id="businessWebsite"
                  name="businessWebsite"
                  value={formData.businessWebsite}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.businessWebsite ? styles.inputError : ''}`}
                  placeholder="Enter website URL (optional)"
                />
                {fieldErrors.businessWebsite && <p className={styles.fieldError}>{fieldErrors.businessWebsite}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="businessDescription" className={styles.label}>
                  Business Description * {formData.businessDescription.length > 0 && `(${formData.businessDescription.length}/1000)`}
                </label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${fieldErrors.businessDescription ? styles.inputError : ''}`}
                  rows={4}
                  placeholder="Describe your repair business, specialties, and experience"
                />
                {fieldErrors.businessDescription && <p className={styles.fieldError}>{fieldErrors.businessDescription}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Location & Services */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 2: Location & Services</h2>
              
              <div className={styles.field}>
                <label htmlFor="locationAddress" className={styles.label}>Location Address *</label>
                <input
                  type="text"
                  id="locationAddress"
                  name="locationAddress"
                  value={formData.locationAddress}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.locationAddress ? styles.inputError : ''}`}
                  placeholder="Enter your business address"
                />
                {fieldErrors.locationAddress && <p className={styles.fieldError}>{fieldErrors.locationAddress}</p>}
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
                  placeholder="Enter Google Maps link (optional)"
                />
                {fieldErrors.googleMapsLink && <p className={styles.fieldError}>{fieldErrors.googleMapsLink}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Services Offered *</label>
                <div className={styles.checkboxGrid}>
                  {serviceOptions.map(service => (
                    <label key={service} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.servicesOffered.includes(service)}
                        onChange={() => toggleService(service)}
                        className={styles.checkbox}
                      />
                      {service}
                    </label>
                  ))}
                </div>
                {fieldErrors.servicesOffered && <p className={styles.fieldError}>{fieldErrors.servicesOffered}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Schedule & Legal */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 3: Schedule & Legal</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>Working Days *</label>
                <div className={styles.checkboxGrid}>
                  {daysOfWeek.map(day => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.workingHours.daysOpen.includes(day)}
                        onChange={() => handleDaysChange(day)}
                        className={styles.checkbox}
                      />
                      {day}
                    </label>
                  ))}
                </div>
                {fieldErrors.workingDays && <p className={styles.fieldError}>{fieldErrors.workingDays}</p>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="openingTime" className={styles.label}>Opening Time *</label>
                  <input
                    type="time"
                    id="openingTime"
                    name="workingHours.openingTime"
                    value={formData.workingHours.openingTime}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.openingTime ? styles.inputError : ''}`}
                  />
                  {fieldErrors.openingTime && <p className={styles.fieldError}>{fieldErrors.openingTime}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="closingTime" className={styles.label}>Closing Time *</label>
                  <input
                    type="time"
                    id="closingTime"
                    name="workingHours.closingTime"
                    value={formData.workingHours.closingTime}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.closingTime ? styles.inputError : ''}`}
                  />
                  {fieldErrors.closingTime && <p className={styles.fieldError}>{fieldErrors.closingTime}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="businessRegistrationNumber" className={styles.label}>Business Registration Number</label>
                  <input
                    type="text"
                    id="businessRegistrationNumber"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.businessRegistrationNumber ? styles.inputError : ''}`}
                    placeholder="Enter registration number (optional)"
                  />
                  {fieldErrors.businessRegistrationNumber && <p className={styles.fieldError}>{fieldErrors.businessRegistrationNumber}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="licenseDocumentUrl" className={styles.label}>License Document URL</label>
                  <input
                    type="url"
                    id="licenseDocumentUrl"
                    name="licenseDocumentUrl"
                    value={formData.licenseDocumentUrl}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.licenseDocumentUrl ? styles.inputError : ''}`}
                    placeholder="Enter license document URL (optional)"
                  />
                  {fieldErrors.licenseDocumentUrl && <p className={styles.fieldError}>{fieldErrors.licenseDocumentUrl}</p>}
                </div>
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
                  <span className={styles.checkboxText}>
                    I agree to the Terms & Conditions and Privacy Policy *
                  </span>
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
                {loading ? 'Registering...' : 'Register Business'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernVehicleRepairForm;