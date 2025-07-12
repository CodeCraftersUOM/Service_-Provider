'use client';

import React, { useState } from 'react';
import styles from './other.module.css';
import { useRouter } from 'next/navigation';

interface ServiceFormData {
  fullNameOrBusinessName: string;
  ownerName: string;
  cnicOrNationalId: string;
  businessRegistrationNumber: string;
  primaryPhoneNumber: string;
  alternatePhoneNumber: string;
  emailAddress: string;
  whatsappNumber: string;
  websiteUrl: string;
  typeOfService: string;
  listOfServicesOffered: string[];
  pricingMethod: string;
  yearsOfExperience: string;
  availableDays: string[];
  availableTimeSlots: string;
  is24x7Available: boolean;
  emergencyOrOnCallAvailable: boolean;
  termsAgreed: boolean;
}

interface FieldErrors {
  [key: string]: string;
}

const ServiceRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    fullNameOrBusinessName: '',
    ownerName: '',
    cnicOrNationalId: '',
    businessRegistrationNumber: '',
    primaryPhoneNumber: '',
    alternatePhoneNumber: '',
    emailAddress: '',
    whatsappNumber: '',
    websiteUrl: '',
    typeOfService: '',
    listOfServicesOffered: [],
    pricingMethod: '',
    yearsOfExperience: '',
    availableDays: [],
    availableTimeSlots: '',
    is24x7Available: false,
    emergencyOrOnCallAvailable: false,
    termsAgreed: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const serviceTypes = [
    'Cleaning Services', 'Plumbing', 'Electrical', 'Carpentry', 'Painting',
    'Home Maintenance', 'Gardening', 'Pest Control', 'Security Services',
    'Catering', 'Event Planning', 'Photography', 'Transportation', 'Other'
  ];

  const commonServices = [
    'House Cleaning', 'Office Cleaning', 'Pipe Repair', 'Drain Cleaning',
    'Electrical Installation', 'Wiring', 'Furniture Assembly', 'Cabinet Installation',
    'Interior Painting', 'Exterior Painting', 'AC Repair', 'Appliance Repair',
    'Lawn Mowing', 'Tree Trimming', 'Termite Control', 'Rodent Control',
    'Security Guard', 'CCTV Installation', 'Wedding Planning', 'Corporate Events',
    'Portrait Photography', 'Event Photography', 'Taxi Service', 'Delivery Service'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const pricingMethods = ['Per Hour', 'Per Visit', 'Custom Quote'];

  // Validation functions
  const validateFullNameOrBusinessName = (name: string): string => {
    if (!name.trim()) return "Full name or business name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 100) return "Name must be less than 100 characters";
    if (!/^[a-zA-Z0-9\s.&'-]+$/.test(name)) return "Name can only contain letters, numbers, spaces, and common symbols";
    return "";
  };

  const validateOwnerName = (name: string): string => {
    if (name.trim()) {
      if (name.length < 2) return "Owner name must be at least 2 characters";
      if (name.length > 50) return "Owner name must be less than 50 characters";
      if (!/^[a-zA-Z\s.]+$/.test(name)) return "Owner name can only contain letters, spaces, and periods";
    }
    return "";
  };

  const validateCnicOrNationalId = (id: string): string => {
    if (id.trim()) {
      if (id.length < 5) return "ID must be at least 5 characters";
      if (id.length > 20) return "ID must be less than 20 characters";
      if (!/^[a-zA-Z0-9\-]+$/.test(id)) return "ID can only contain letters, numbers, and hyphens";
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

  const validatePrimaryPhoneNumber = (phone: string): string => {
    if (!phone.trim()) return "Primary phone number is required";
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (!phoneRegex.test(cleanPhone)) return "Please enter a valid phone number";
    if (cleanPhone.length < 10) return "Phone number must be at least 10 digits";
    return "";
  };

  const validateAlternatePhoneNumber = (phone: string): string => {
    if (phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
      if (!phoneRegex.test(cleanPhone)) return "Please enter a valid alternate phone number";
      if (cleanPhone.length < 10) return "Alternate phone number must be at least 10 digits";
    }
    return "";
  };

  const validateEmailAddress = (email: string): string => {
    if (!email.trim()) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateWhatsappNumber = (phone: string): string => {
    if (phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
      if (!phoneRegex.test(cleanPhone)) return "Please enter a valid WhatsApp number";
      if (cleanPhone.length < 10) return "WhatsApp number must be at least 10 digits";
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

  const validateTypeOfService = (type: string): string => {
    if (!type) return "Type of service is required";
    return "";
  };

  const validateListOfServicesOffered = (services: string[]): string => {
    if (services.length === 0) return "At least one service must be selected";
    if (services.length > 15) return "Maximum 15 services can be selected";
    return "";
  };

  const validatePricingMethod = (method: string): string => {
    if (!method) return "Pricing method is required";
    return "";
  };

  const validateYearsOfExperience = (years: string): string => {
    if (years.trim()) {
      const numYears = parseInt(years);
      if (isNaN(numYears)) return "Please enter a valid number";
      if (numYears < 0) return "Years of experience cannot be negative";
      if (numYears > 100) return "Please enter a valid number of years";
    }
    return "";
  };

  const validateAvailableDays = (days: string[]): string => {
    if (days.length === 0) return "At least one available day is required";
    return "";
  };

  const validateAvailableTimeSlots = (timeSlots: string): string => {
    if (!timeSlots.trim()) return "Available time slots are required";
    if (timeSlots.length < 5) return "Time slots must be at least 5 characters";
    if (timeSlots.length > 100) return "Time slots must be less than 100 characters";
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
        errors.fullNameOrBusinessName = validateFullNameOrBusinessName(formData.fullNameOrBusinessName);
        errors.ownerName = validateOwnerName(formData.ownerName);
        errors.cnicOrNationalId = validateCnicOrNationalId(formData.cnicOrNationalId);
        errors.businessRegistrationNumber = validateBusinessRegistrationNumber(formData.businessRegistrationNumber);
        errors.primaryPhoneNumber = validatePrimaryPhoneNumber(formData.primaryPhoneNumber);
        errors.alternatePhoneNumber = validateAlternatePhoneNumber(formData.alternatePhoneNumber);
        errors.emailAddress = validateEmailAddress(formData.emailAddress);
        errors.whatsappNumber = validateWhatsappNumber(formData.whatsappNumber);
        errors.websiteUrl = validateWebsiteUrl(formData.websiteUrl);
        break;
      case 2:
        errors.typeOfService = validateTypeOfService(formData.typeOfService);
        errors.listOfServicesOffered = validateListOfServicesOffered(formData.listOfServicesOffered);
        errors.pricingMethod = validatePricingMethod(formData.pricingMethod);
        errors.yearsOfExperience = validateYearsOfExperience(formData.yearsOfExperience);
        break;
      case 3:
        errors.availableDays = validateAvailableDays(formData.availableDays);
        errors.availableTimeSlots = validateAvailableTimeSlots(formData.availableTimeSlots);
        errors.termsAgreed = validateTermsAgreed(formData.termsAgreed);
        break;
    }
    
    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (arrayName: keyof Pick<ServiceFormData, 'listOfServicesOffered' | 'availableDays'>, value: string) => {
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
      const response = await fetch('http://localhost:2000/api/addService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : 0,
          availability: {
            availableDays: formData.availableDays,
            availableTimeSlots: formData.availableTimeSlots,
            is24x7Available: formData.is24x7Available,
            emergencyOrOnCallAvailable: formData.emergencyOrOnCallAvailable,
          }
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'Failed to register service'}`);
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
      fullNameOrBusinessName: '',
      ownerName: '',
      cnicOrNationalId: '',
      businessRegistrationNumber: '',
      primaryPhoneNumber: '',
      alternatePhoneNumber: '',
      emailAddress: '',
      whatsappNumber: '',
      websiteUrl: '',
      typeOfService: '',
      listOfServicesOffered: [],
      pricingMethod: '',
      yearsOfExperience: '',
      availableDays: [],
      availableTimeSlots: '',
      is24x7Available: false,
      emergencyOrOnCallAvailable: false,
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
          <h1 className={styles.successTitle}>Service Successfully Registered!</h1>
          <p className={styles.successMessage}>
            Congratulations! <strong>{formData.fullNameOrBusinessName}</strong> has been successfully registered in our service directory.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Business:</strong> {formData.fullNameOrBusinessName}</p>
            <p><strong>Service Type:</strong> {formData.typeOfService}</p>
            <p><strong>Email:</strong> {formData.emailAddress}</p>
            <p><strong>Services:</strong> {formData.listOfServicesOffered.length} services offered</p>
            <p><strong>Experience:</strong> {formData.yearsOfExperience || 0} years</p>
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
                  {step === 1 && 'Business Info'}
                  {step === 2 && 'Service Details'}
                  {step === 3 && 'Availability'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Service Registration</h1>
        
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
                  <label htmlFor="fullNameOrBusinessName" className={styles.label}>Full Name or Business Name *</label>
                  <input
                    type="text"
                    id="fullNameOrBusinessName"
                    name="fullNameOrBusinessName"
                    value={formData.fullNameOrBusinessName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.fullNameOrBusinessName ? styles.inputError : ''}`}
                    placeholder="Enter business name or your full name"
                  />
                  {fieldErrors.fullNameOrBusinessName && <p className={styles.fieldError}>{fieldErrors.fullNameOrBusinessName}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="ownerName" className={styles.label}>Owner Name</label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.ownerName ? styles.inputError : ''}`}
                    placeholder="Enter owner name"
                  />
                  {fieldErrors.ownerName && <p className={styles.fieldError}>{fieldErrors.ownerName}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="cnicOrNationalId" className={styles.label}>CNIC/National ID</label>
                  <input
                    type="text"
                    id="cnicOrNationalId"
                    name="cnicOrNationalId"
                    value={formData.cnicOrNationalId}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.cnicOrNationalId ? styles.inputError : ''}`}
                    placeholder="Enter your CNIC or National ID"
                  />
                  {fieldErrors.cnicOrNationalId && <p className={styles.fieldError}>{fieldErrors.cnicOrNationalId}</p>}
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
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="primaryPhoneNumber" className={styles.label}>Primary Phone Number *</label>
                  <input
                    type="tel"
                    id="primaryPhoneNumber"
                    name="primaryPhoneNumber"
                    value={formData.primaryPhoneNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.primaryPhoneNumber ? styles.inputError : ''}`}
                    placeholder="Enter primary phone number"
                  />
                  {fieldErrors.primaryPhoneNumber && <p className={styles.fieldError}>{fieldErrors.primaryPhoneNumber}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="alternatePhoneNumber" className={styles.label}>Alternate Phone Number</label>
                  <input
                    type="tel"
                    id="alternatePhoneNumber"
                    name="alternatePhoneNumber"
                    value={formData.alternatePhoneNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.alternatePhoneNumber ? styles.inputError : ''}`}
                    placeholder="Enter alternate phone number"
                  />
                  {fieldErrors.alternatePhoneNumber && <p className={styles.fieldError}>{fieldErrors.alternatePhoneNumber}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="emailAddress" className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.emailAddress ? styles.inputError : ''}`}
                    placeholder="Enter email address"
                  />
                  {fieldErrors.emailAddress && <p className={styles.fieldError}>{fieldErrors.emailAddress}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="whatsappNumber" className={styles.label}>WhatsApp Number</label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.whatsappNumber ? styles.inputError : ''}`}
                    placeholder="Enter WhatsApp number"
                  />
                  {fieldErrors.whatsappNumber && <p className={styles.fieldError}>{fieldErrors.whatsappNumber}</p>}
                </div>
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
                  placeholder="Enter website URL (e.g., https://example.com)"
                />
                {fieldErrors.websiteUrl && <p className={styles.fieldError}>{fieldErrors.websiteUrl}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 2: Service Details</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="typeOfService" className={styles.label}>Type of Service *</label>
                  <select
                    id="typeOfService"
                    name="typeOfService"
                    value={formData.typeOfService}
                    onChange={handleInputChange}
                    className={`${styles.select} ${fieldErrors.typeOfService ? styles.inputError : ''}`}
                  >
                    <option value="">Select Service Type</option>
                    {serviceTypes.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                  {fieldErrors.typeOfService && <p className={styles.fieldError}>{fieldErrors.typeOfService}</p>}
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
                    <option value="">Select Pricing Method</option>
                    {pricingMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                  {fieldErrors.pricingMethod && <p className={styles.fieldError}>{fieldErrors.pricingMethod}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Services Offered *</label>
                <div className={styles.checkboxGrid}>
                  {commonServices.map(service => (
                    <label key={service} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.listOfServicesOffered.includes(service)}
                        onChange={() => handleArrayChange('listOfServicesOffered', service)}
                        className={styles.checkbox}
                      />
                      {service}
                    </label>
                  ))}
                </div>
                {fieldErrors.listOfServicesOffered && <p className={styles.fieldError}>{fieldErrors.listOfServicesOffered}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="yearsOfExperience" className={styles.label}>Years of Experience</label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.yearsOfExperience ? styles.inputError : ''}`}
                  min="0"
                  max="100"
                  placeholder="Enter years of experience"
                />
                {fieldErrors.yearsOfExperience && <p className={styles.fieldError}>{fieldErrors.yearsOfExperience}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 3: Availability & Terms</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>Available Days *</label>
                <div className={styles.checkboxGrid}>
                  {weekDays.map(day => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.availableDays.includes(day)}
                        onChange={() => handleArrayChange('availableDays', day)}
                        className={styles.checkbox}
                      />
                      {day}
                    </label>
                  ))}
                </div>
                {fieldErrors.availableDays && <p className={styles.fieldError}>{fieldErrors.availableDays}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="availableTimeSlots" className={styles.label}>Available Time Slots *</label>
                <input
                  type="text"
                  id="availableTimeSlots"
                  name="availableTimeSlots"
                  value={formData.availableTimeSlots}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.availableTimeSlots ? styles.inputError : ''}`}
                  placeholder="e.g., 9:00 AM - 6:00 PM"
                />
                {fieldErrors.availableTimeSlots && <p className={styles.fieldError}>{fieldErrors.availableTimeSlots}</p>}
              </div>

              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is24x7Available"
                    checked={formData.is24x7Available}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Available 24/7
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="emergencyOrOnCallAvailable"
                    checked={formData.emergencyOrOnCallAvailable}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Emergency/On-call Available
                </label>
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
                {loading ? 'Registering...' : 'Register Service'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRegistrationForm;