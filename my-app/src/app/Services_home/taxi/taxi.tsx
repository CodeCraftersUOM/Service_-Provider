'use client';

import React, { useState } from 'react';
import styles from './taxi.module.css';
import { useRouter } from 'next/navigation';

interface TaxiDriverFormData {
  fullName: string;
  cnic: string;
  contactNumber: string;
  emailAddress: string;
  alternatePhone: string;
  profilePhotoUrl: string;
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  drivingLicenseUpload: string;
  yearsOfExperience: string;
  vehicleMakeModel: string;
  vehicleType: string;
  vehicleRegistrationNumber: string;
  seatingCapacity: string;
  hasAirConditioning: boolean;
  hasLuggageSpace: boolean;
  vehicleImages: string[];
  serviceCity: string;
  availableDays: string[];
  availableTimeSlot: string;
  is24x7Available: boolean;
  vehicleRegistrationDocument: string;
  insuranceDocument: string;
}

interface FieldErrors {
  [key: string]: string;
}

const TaxiDriverRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<TaxiDriverFormData>({
    fullName: '',
    cnic: '',
    contactNumber: '',
    emailAddress: '',
    alternatePhone: '',
    profilePhotoUrl: '',
    drivingLicenseNumber: '',
    licenseExpiryDate: '',
    drivingLicenseUpload: '',
    yearsOfExperience: '',
    vehicleMakeModel: '',
    vehicleType: '',
    vehicleRegistrationNumber: '',
    seatingCapacity: '',
    hasAirConditioning: false,
    hasLuggageSpace: false,
    vehicleImages: [],
    serviceCity: '',
    availableDays: [],
    availableTimeSlot: '',
    is24x7Available: false,
    vehicleRegistrationDocument: '',
    insuranceDocument: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const vehicleTypes = ['Sedan', 'Mini', 'SUV', 'Van', 'Rickshaw', 'Luxury'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Validation functions
  const validateFullName = (name: string): string => {
    if (!name.trim()) return "Full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s.]+$/.test(name)) return "Name can only contain letters, spaces, and periods";
    return "";
  };

  const validateCNIC = (cnic: string): string => {
    if (!cnic.trim()) return "CNIC is required";
    // Pakistani CNIC validation (format: 00000-0000000-0)
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    if (!cnicRegex.test(cnic)) return "Please enter a valid CNIC (00000-0000000-0)";
    return "";
  };

  const validateContactNumber = (phone: string): string => {
    if (!phone.trim()) return "Contact number is required";
    // Pakistani phone number validation
    const phoneRegex = /^(\+92|92|0)?[1-9][0-9]{9}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (!phoneRegex.test(cleanPhone)) return "Please enter a valid Pakistani phone number";
    return "";
  };

  const validateEmailAddress = (email: string): string => {
    if (!email.trim()) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateAlternatePhone = (phone: string): string => {
    if (phone.trim()) {
      const phoneRegex = /^(\+92|92|0)?[1-9][0-9]{9}$/;
      const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
      if (!phoneRegex.test(cleanPhone)) return "Please enter a valid alternate phone number";
    }
    return "";
  };

  const validateProfilePhotoUrl = (url: string): string => {
    if (url.trim()) {
      if (url.length > 500) return "Photo URL must be less than 500 characters";
    }
    return "";
  };

  const validateDrivingLicenseNumber = (license: string): string => {
    if (!license.trim()) return "Driving license number is required";
    if (license.length < 5) return "License number must be at least 5 characters";
    if (license.length > 50) return "License number must be less than 50 characters";
    if (!/^[a-zA-Z0-9\-]+$/.test(license)) return "License number can only contain letters, numbers, and hyphens";
    return "";
  };

  const validateLicenseExpiryDate = (date: string): string => {
    if (date) {
      const expiryDate = new Date(date);
      const today = new Date();
      if (expiryDate <= today) return "License must not be expired";
    }
    return "";
  };

  const validateYearsOfExperience = (years: string): string => {
    if (years.trim()) {
      const numYears = parseInt(years);
      if (isNaN(numYears)) return "Please enter a valid number";
      if (numYears < 0) return "Years of experience cannot be negative";
      if (numYears > 50) return "Please enter a valid number of years";
    }
    return "";
  };

  const validateVehicleMakeModel = (model: string): string => {
    if (!model.trim()) return "Vehicle make & model is required";
    if (model.length < 3) return "Vehicle make & model must be at least 3 characters";
    if (model.length > 100) return "Vehicle make & model must be less than 100 characters";
    return "";
  };

  const validateVehicleType = (type: string): string => {
    if (!type) return "Vehicle type is required";
    return "";
  };

  const validateVehicleRegistrationNumber = (regNumber: string): string => {
    if (!regNumber.trim()) return "Vehicle registration number is required";
    if (regNumber.length < 3) return "Registration number must be at least 3 characters";
    if (regNumber.length > 20) return "Registration number must be less than 20 characters";
    if (!/^[a-zA-Z0-9\-\s]+$/.test(regNumber)) return "Registration number can only contain letters, numbers, hyphens, and spaces";
    return "";
  };

  const validateSeatingCapacity = (capacity: string): string => {
    if (!capacity.trim()) return "Seating capacity is required";
    const numCapacity = parseInt(capacity);
    if (isNaN(numCapacity)) return "Please enter a valid number";
    if (numCapacity < 1) return "Seating capacity must be at least 1";
    if (numCapacity > 50) return "Please enter a valid seating capacity";
    return "";
  };

  const validateServiceCity = (city: string): string => {
    if (!city.trim()) return "Service city is required";
    if (city.length < 2) return "City must be at least 2 characters";
    if (city.length > 50) return "City must be less than 50 characters";
    if (!/^[a-zA-Z\s.]+$/.test(city)) return "City can only contain letters, spaces, and periods";
    return "";
  };

  const validateAvailableDays = (days: string[]): string => {
    if (days.length === 0) return "At least one available day is required";
    return "";
  };

  const validateAvailableTimeSlot = (timeSlot: string): string => {
    if (!timeSlot.trim()) return "Available time slot is required";
    if (timeSlot.length < 5) return "Time slot must be at least 5 characters";
    if (timeSlot.length > 100) return "Time slot must be less than 100 characters";
    return "";
  };

  const validateStep = (step: number): FieldErrors => {
    const errors: FieldErrors = {};
    
    switch (step) {
      case 1:
        errors.fullName = validateFullName(formData.fullName);
        errors.cnic = validateCNIC(formData.cnic);
        errors.contactNumber = validateContactNumber(formData.contactNumber);
        errors.emailAddress = validateEmailAddress(formData.emailAddress);
        errors.alternatePhone = validateAlternatePhone(formData.alternatePhone);
        errors.profilePhotoUrl = validateProfilePhotoUrl(formData.profilePhotoUrl);
        break;
      case 2:
        errors.drivingLicenseNumber = validateDrivingLicenseNumber(formData.drivingLicenseNumber);
        errors.licenseExpiryDate = validateLicenseExpiryDate(formData.licenseExpiryDate);
        errors.yearsOfExperience = validateYearsOfExperience(formData.yearsOfExperience);
        errors.vehicleMakeModel = validateVehicleMakeModel(formData.vehicleMakeModel);
        errors.vehicleType = validateVehicleType(formData.vehicleType);
        errors.vehicleRegistrationNumber = validateVehicleRegistrationNumber(formData.vehicleRegistrationNumber);
        errors.seatingCapacity = validateSeatingCapacity(formData.seatingCapacity);
        break;
      case 3:
        errors.serviceCity = validateServiceCity(formData.serviceCity);
        errors.availableDays = validateAvailableDays(formData.availableDays);
        errors.availableTimeSlot = validateAvailableTimeSlot(formData.availableTimeSlot);
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

  const handleDaysChange = (day: string) => {
    // Clear field error when user makes selection
    if (fieldErrors.availableDays) {
      setFieldErrors(prev => ({
        ...prev,
        availableDays: ""
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
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
      const response = await fetch('http://localhost:2000/api/addTaxiDriver', {
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
        setMessage(`Error: ${errorData.message || 'Failed to register taxi driver'}`);
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
      fullName: '',
      cnic: '',
      contactNumber: '',
      emailAddress: '',
      alternatePhone: '',
      profilePhotoUrl: '',
      drivingLicenseNumber: '',
      licenseExpiryDate: '',
      drivingLicenseUpload: '',
      yearsOfExperience: '',
      vehicleMakeModel: '',
      vehicleType: '',
      vehicleRegistrationNumber: '',
      seatingCapacity: '',
      hasAirConditioning: false,
      hasLuggageSpace: false,
      vehicleImages: [],
      serviceCity: '',
      availableDays: [],
      availableTimeSlot: '',
      is24x7Available: false,
      vehicleRegistrationDocument: '',
      insuranceDocument: ''
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
          <h1 className={styles.successTitle}>Taxi Driver Successfully Registered!</h1>
          <p className={styles.successMessage}>
            Congratulations! <strong>{formData.fullName}</strong> has been successfully registered as a taxi driver in our system.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Driver:</strong> {formData.fullName}</p>
            <p><strong>Vehicle:</strong> {formData.vehicleMakeModel}</p>
            <p><strong>Type:</strong> {formData.vehicleType}</p>
            <p><strong>Capacity:</strong> {formData.seatingCapacity} seats</p>
            <p><strong>Service City:</strong> {formData.serviceCity}</p>
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>
            Register Another Driver
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
                  {step === 2 && 'Vehicle & License'}
                  {step === 3 && 'Service Details'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Taxi Driver Registration</h1>
        <p className={styles.subtitle}>Join our platform and start earning today</p>
        
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
              
              <div className={styles.field}>
                <label htmlFor="fullName" className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.fullName ? styles.inputError : ''}`}
                  placeholder="Enter your full name"
                />
                {fieldErrors.fullName && <p className={styles.fieldError}>{fieldErrors.fullName}</p>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="cnic" className={styles.label}>CNIC *</label>
                  <input
                    type="text"
                    id="cnic"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.cnic ? styles.inputError : ''}`}
                    placeholder="00000-0000000-0"
                  />
                  {fieldErrors.cnic && <p className={styles.fieldError}>{fieldErrors.cnic}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="contactNumber" className={styles.label}>Contact Number *</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.contactNumber ? styles.inputError : ''}`}
                    placeholder="Enter contact number"
                  />
                  {fieldErrors.contactNumber && <p className={styles.fieldError}>{fieldErrors.contactNumber}</p>}
                </div>
              </div>

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
                <label htmlFor="alternatePhone" className={styles.label}>Alternate Phone</label>
                <input
                  type="tel"
                  id="alternatePhone"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.alternatePhone ? styles.inputError : ''}`}
                  placeholder="Enter alternate phone number"
                />
                {fieldErrors.alternatePhone && <p className={styles.fieldError}>{fieldErrors.alternatePhone}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="profilePhotoUrl" className={styles.label}>Profile Photo URL</label>
                <input
                  type="url"
                  id="profilePhotoUrl"
                  name="profilePhotoUrl"
                  value={formData.profilePhotoUrl}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.profilePhotoUrl ? styles.inputError : ''}`}
                  placeholder="Enter profile photo URL"
                />
                {fieldErrors.profilePhotoUrl && <p className={styles.fieldError}>{fieldErrors.profilePhotoUrl}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Vehicle & License Information */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 2: Vehicle & License Information</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="drivingLicenseNumber" className={styles.label}>Driving License Number *</label>
                  <input
                    type="text"
                    id="drivingLicenseNumber"
                    name="drivingLicenseNumber"
                    value={formData.drivingLicenseNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.drivingLicenseNumber ? styles.inputError : ''}`}
                    placeholder="Enter license number"
                  />
                  {fieldErrors.drivingLicenseNumber && <p className={styles.fieldError}>{fieldErrors.drivingLicenseNumber}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="licenseExpiryDate" className={styles.label}>License Expiry Date</label>
                  <input
                    type="date"
                    id="licenseExpiryDate"
                    name="licenseExpiryDate"
                    value={formData.licenseExpiryDate}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.licenseExpiryDate ? styles.inputError : ''}`}
                  />
                  {fieldErrors.licenseExpiryDate && <p className={styles.fieldError}>{fieldErrors.licenseExpiryDate}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="drivingLicenseUpload" className={styles.label}>Driving License Upload URL</label>
                  <input
                    type="url"
                    id="drivingLicenseUpload"
                    name="drivingLicenseUpload"
                    value={formData.drivingLicenseUpload}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter license document URL"
                  />
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
                    placeholder="Enter years of experience"
                  />
                  {fieldErrors.yearsOfExperience && <p className={styles.fieldError}>{fieldErrors.yearsOfExperience}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="vehicleMakeModel" className={styles.label}>Vehicle Make & Model *</label>
                  <input
                    type="text"
                    id="vehicleMakeModel"
                    name="vehicleMakeModel"
                    value={formData.vehicleMakeModel}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.vehicleMakeModel ? styles.inputError : ''}`}
                    placeholder="e.g., Toyota Corolla"
                  />
                  {fieldErrors.vehicleMakeModel && <p className={styles.fieldError}>{fieldErrors.vehicleMakeModel}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="vehicleType" className={styles.label}>Vehicle Type *</label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className={`${styles.select} ${fieldErrors.vehicleType ? styles.inputError : ''}`}
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {fieldErrors.vehicleType && <p className={styles.fieldError}>{fieldErrors.vehicleType}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="vehicleRegistrationNumber" className={styles.label}>Vehicle Registration Number *</label>
                  <input
                    type="text"
                    id="vehicleRegistrationNumber"
                    name="vehicleRegistrationNumber"
                    value={formData.vehicleRegistrationNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.vehicleRegistrationNumber ? styles.inputError : ''}`}
                    placeholder="Enter registration number"
                  />
                  {fieldErrors.vehicleRegistrationNumber && <p className={styles.fieldError}>{fieldErrors.vehicleRegistrationNumber}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="seatingCapacity" className={styles.label}>Seating Capacity *</label>
                  <input
                    type="number"
                    id="seatingCapacity"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.seatingCapacity ? styles.inputError : ''}`}
                    min="1"
                    placeholder="Enter seating capacity"
                  />
                  {fieldErrors.seatingCapacity && <p className={styles.fieldError}>{fieldErrors.seatingCapacity}</p>}
                </div>
              </div>

              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="hasAirConditioning"
                    checked={formData.hasAirConditioning}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Air Conditioning Available
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="hasLuggageSpace"
                    checked={formData.hasLuggageSpace}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Luggage Space Available
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Service Details */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 3: Service Details</h2>
              
              <div className={styles.field}>
                <label htmlFor="serviceCity" className={styles.label}>Service City *</label>
                <input
                  type="text"
                  id="serviceCity"
                  name="serviceCity"
                  value={formData.serviceCity}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.serviceCity ? styles.inputError : ''}`}
                  placeholder="Enter service city"
                />
                {fieldErrors.serviceCity && <p className={styles.fieldError}>{fieldErrors.serviceCity}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Available Days *</label>
                <div className={styles.checkboxGrid}>
                  {daysOfWeek.map((day) => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.availableDays.includes(day)}
                        onChange={() => handleDaysChange(day)}
                        className={styles.checkbox}
                      />
                      {day}
                    </label>
                  ))}
                </div>
                {fieldErrors.availableDays && <p className={styles.fieldError}>{fieldErrors.availableDays}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="availableTimeSlot" className={styles.label}>Available Time Slot *</label>
                <input
                  type="text"
                  id="availableTimeSlot"
                  name="availableTimeSlot"
                  value={formData.availableTimeSlot}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors.availableTimeSlot ? styles.inputError : ''}`}
                  placeholder="e.g., 9:00 AM - 6:00 PM"
                />
                {fieldErrors.availableTimeSlot && <p className={styles.fieldError}>{fieldErrors.availableTimeSlot}</p>}
              </div>

              <div className={styles.field}>
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
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="vehicleRegistrationDocument" className={styles.label}>Vehicle Registration Document URL</label>
                  <input
                    type="url"
                    id="vehicleRegistrationDocument"
                    name="vehicleRegistrationDocument"
                    value={formData.vehicleRegistrationDocument}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter registration document URL"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="insuranceDocument" className={styles.label}>Insurance Document URL</label>
                  <input
                    type="url"
                    id="insuranceDocument"
                    name="insuranceDocument"
                    value={formData.insuranceDocument}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter insurance document URL"
                  />
                </div>
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

export default TaxiDriverRegistration;