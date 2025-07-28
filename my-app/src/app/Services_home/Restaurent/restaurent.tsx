'use client';

import React, { useState } from 'react';
import styles from './restaurent.module.css';
import { useRouter } from 'next/navigation';

interface RestaurantFormData {
  restaurantName: string;
  ownerFullName: string;
  phoneNumber: string;
  emailAddress: string;
  alternateContactNumber: string;
  businessType: string;
  locationAddress: string;
  googleMapsLink: string;
  cuisineTypes: string[];
  workingHours: {
    daysOpen: string[];
    openingTime: string;
    closingTime: string;
    is24x7Available: boolean;
    closedOnHolidays: boolean;
  };
  foodSafetyLicenseUrl: string;
  businessRegistrationNumber: string;
  yearsInOperation: number | '';
  numberOfBranches: number | '';
  amenities: {
    outdoorSeating: boolean;
    liveMusic: boolean;
    parkingAvailable: boolean;
    wifi: boolean;
    familyAreaKidsFriendly: boolean;
    wheelchairAccessible: boolean;
  };
}

interface FieldErrors {
  [key: string]: string;
}

const RestaurantRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<RestaurantFormData>({
    restaurantName: '',
    ownerFullName: '',
    phoneNumber: '',
    emailAddress: '',
    alternateContactNumber: '',
    businessType: '',
    locationAddress: '',
    googleMapsLink: '',
    cuisineTypes: [],
    workingHours: {
      daysOpen: [],
      openingTime: '',
      closingTime: '',
      is24x7Available: false,
      closedOnHolidays: false,
    },
    foodSafetyLicenseUrl: '',
    businessRegistrationNumber: '',
    yearsInOperation: '',
    numberOfBranches: '',
    amenities: {
      outdoorSeating: false,
      liveMusic: false,
      parkingAvailable: false,
      wifi: false,
      familyAreaKidsFriendly: false,
      wheelchairAccessible: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const businessTypes = ['Dine-in', 'Takeaway', 'Delivery Only', 'Cloud Kitchen', 'Cafe/Bakery'];
  const cuisineOptions = ['Sri Lankan', 'Indian', 'Chinese', 'Italian', 'Continental', 'Fast Food', 'Street Food', 'BBQ/Grill', 'Seafood', 'Vegan/Vegetarian', 'Desserts/Bakery', 'Others'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Consolidated validation function
  const validate = (data: RestaurantFormData): FieldErrors => {
    const errors: FieldErrors = {};
    
    // Required fields validation
    if (!data.restaurantName.trim()) errors.restaurantName = "Restaurant name is required";
    if (!data.ownerFullName.trim()) errors.ownerFullName = "Owner name is required";
    if (!data.emailAddress.trim()) errors.emailAddress = "Email is required";
    if (!data.businessType) errors.businessType = "Business type is required";
    if (data.cuisineTypes.length === 0) errors.cuisineTypes = "At least one cuisine type required";
    if (data.workingHours.daysOpen.length === 0) errors.workingDays = "At least one working day required";
    if (!data.workingHours.openingTime) errors.openingTime = "Opening time is required";
    if (!data.workingHours.closingTime) errors.closingTime = "Closing time is required";

    // Sri Lankan phone validation
    const validateSriLankanPhone = (phone: string) => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length === 10 && /^0[1-9][0-9]{8}$/.test(cleaned);
    };

    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!validateSriLankanPhone(data.phoneNumber)) {
      errors.phoneNumber = "Enter valid 10-digit Sri Lankan phone (07XXXXXXXX or 0XXXXXXXXX)";
    }

    // Alternate contact (optional but must be valid if provided)
    if (data.alternateContactNumber && !validateSriLankanPhone(data.alternateContactNumber)) {
      errors.alternateContactNumber = "Enter valid 10-digit Sri Lankan phone if provided";
    }

    // Email validation
    if (data.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress)) {
      errors.emailAddress = "Enter valid email address";
    }

    // Business registration (optional but must be valid if provided)
    if (data.businessRegistrationNumber) {
      const cleanReg = data.businessRegistrationNumber.trim().toUpperCase();
      if (!/^(PV|HS|SP|PQ)[0-9]+$|^[0-9]+$/.test(cleanReg)) {
        errors.businessRegistrationNumber = "Enter valid Sri Lankan business registration (PV12345, HS12345, etc.)";
      }
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('amenities.')) {
        const key = name.split('.')[1] as keyof typeof formData.amenities;
        setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, [key]: checkbox.checked } }));
      } else if (name.startsWith('workingHours.')) {
        const key = name.split('.')[1] as keyof typeof formData.workingHours;
        setFormData(prev => ({ ...prev, workingHours: { ...prev.workingHours, [key]: checkbox.checked } }));
      }
    } else if (name === 'yearsInOperation' || name === 'numberOfBranches') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value) }));
    } else if (name.startsWith('workingHours.')) {
      const key = name.split('.')[1] as keyof typeof formData.workingHours;
      setFormData(prev => ({ ...prev, workingHours: { ...prev.workingHours, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (arrayName: 'cuisineTypes' | 'daysOpen', value: string) => {
    const fieldName = arrayName === 'daysOpen' ? 'workingDays' : arrayName;
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: "" }));
    }

    if (arrayName === 'daysOpen') {
      setFormData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          daysOpen: prev.workingHours.daysOpen.includes(value)
            ? prev.workingHours.daysOpen.filter(d => d !== value)
            : [...prev.workingHours.daysOpen, value]
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        cuisineTypes: prev.cuisineTypes.includes(value)
          ? prev.cuisineTypes.filter(c => c !== value)
          : [...prev.cuisineTypes, value]
      }));
    }
  };

  const nextStep = () => {
    const errors = validate(formData);
    const stepFields = {
      1: ['restaurantName', 'ownerFullName', 'phoneNumber', 'emailAddress', 'alternateContactNumber', 'businessType'],
      2: ['cuisineTypes', 'workingDays', 'openingTime', 'closingTime'],
      3: ['businessRegistrationNumber']
    };
    
    const stepErrors = Object.keys(errors).filter(key => stepFields[currentStep as keyof typeof stepFields].includes(key));
    
    if (stepErrors.length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setMessage('');
    } else {
      const filteredErrors: FieldErrors = {};
      stepErrors.forEach(key => filteredErrors[key] = errors[key]);
      setFieldErrors(filteredErrors);
      setMessage('Please fix the errors below.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setMessage('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(formData);
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMessage('Please fix all errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:2000/api/addResturent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message || 'Failed to register restaurant'}`);
      }
    } catch (error) {
      setMessage('Error: Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setFieldErrors({});
    setMessage('');
    setFormData({
      restaurantName: '', ownerFullName: '', phoneNumber: '', emailAddress: '', alternateContactNumber: '',
      businessType: '', locationAddress: '', googleMapsLink: '', cuisineTypes: [],
      workingHours: { daysOpen: [], openingTime: '', closingTime: '', is24x7Available: false, closedOnHolidays: false },
      foodSafetyLicenseUrl: '', businessRegistrationNumber: '', yearsInOperation: '', numberOfBranches: '',
      amenities: { outdoorSeating: false, liveMusic: false, parkingAvailable: false, wifi: false, familyAreaKidsFriendly: false, wheelchairAccessible: false }
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
          <>
          <h1 className={styles.successTitle}>Restaurant Successfully Registered!</h1>
          <p className={styles.successMessage}>
            Congratulations! <strong>{formData.restaurantName}</strong> has been registered successfully.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Owner:</strong> {formData.ownerFullName}</p>
            <p><strong>Type:</strong> {formData.businessType}</p>
            <p><strong>Email:</strong> {formData.emailAddress}</p>
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>Register Another</button>
          <button onClick={() => router.push('/Dashboard')} className={styles.newRegistrationButton}>Dashboard</button>
        </div>
      </div>
    );
  }

  const renderField = (name: string, label: string, type = 'text', required = false, options?: string[]) => (
    <div className={styles.field}>
      <label className={styles.label}>
        {label} {required && '*'} 
        {name.includes('phone') && <span style={{fontSize: '0.8em', color: '#666'}}> (10 digits)</span>}
        {name === 'businessRegistrationNumber' && <span style={{fontSize: '0.8em', color: '#666'}}> (PV12345, HS12345, etc.)</span>}
      </label>
      {type === 'select' ? (
        <select name={name} value={formData[name as keyof RestaurantFormData] as string} onChange={handleInputChange} 
                className={`${styles.select} ${fieldErrors[name] ? styles.inputError : ''}`}>
          <option value="">Select {label}</option>
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} value={formData[name as keyof RestaurantFormData] as string} onChange={handleInputChange}
                  className={`${styles.textarea} ${fieldErrors[name] ? styles.inputError : ''}`} rows={3} />
      ) : (
        <input type={type} name={name} value={formData[name as keyof RestaurantFormData] as string} onChange={handleInputChange}
               className={`${styles.input} ${fieldErrors[name] ? styles.inputError : ''}`} />
      )}
      {fieldErrors[name] && <p className={styles.fieldError}>{fieldErrors[name]}</p>}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(currentStep / 3) * 100}%` }}></div>
          </div>
          <div className={styles.stepIndicators}>
            {[1, 2, 3].map(step => (
              <div key={step} className={`${styles.stepIndicator} ${currentStep >= step ? styles.active : ''}`}>
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepLabel}>
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Business Details' : 'Additional Info'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Restaurant Registration</h1>
        
        {message && <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>{message}</div>}

        <form className={styles.form}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 1: Basic Information</h2>
              <div className={styles.row}>
                {renderField('restaurantName', 'Restaurant Name', 'text', true)}
                {renderField('ownerFullName', 'Owner Full Name', 'text', true)}
              </div>
              <div className={styles.row}>
                {renderField('phoneNumber', 'Phone Number', 'tel', true)}
                {renderField('emailAddress', 'Email Address', 'email', true)}
              </div>
              <div className={styles.row}>
                {renderField('alternateContactNumber', 'Alternate Contact', 'tel')}
                {renderField('businessType', 'Business Type', 'select', true, businessTypes)}
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 2: Business Details</h2>
              {renderField('locationAddress', 'Location Address (Optional)', 'textarea')}
              {renderField('googleMapsLink', 'Google Maps Link (Optional)', 'url')}
              
              <div className={styles.field}>
                <label className={styles.label}>Cuisine Types * (Select at least one)</label>
                <div className={styles.checkboxGrid}>
                  {cuisineOptions.map(cuisine => (
                    <label key={cuisine} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={formData.cuisineTypes.includes(cuisine)} 
                             onChange={() => handleArrayChange('cuisineTypes', cuisine)} className={styles.checkbox} />
                      {cuisine}
                    </label>
                  ))}
                </div>
                {fieldErrors.cuisineTypes && <p className={styles.fieldError}>{fieldErrors.cuisineTypes}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Working Days * (Select at least one)</label>
                <div className={styles.checkboxGrid}>
                  {daysOfWeek.map(day => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={formData.workingHours.daysOpen.includes(day)}
                             onChange={() => handleArrayChange('daysOpen', day)} className={styles.checkbox} />
                      {day}
                    </label>
                  ))}
                </div>
                {fieldErrors.workingDays && <p className={styles.fieldError}>{fieldErrors.workingDays}</p>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Opening Time *</label>
                  <input type="time" name="workingHours.openingTime" value={formData.workingHours.openingTime} 
                         onChange={handleInputChange} className={`${styles.input} ${fieldErrors.openingTime ? styles.inputError : ''}`} />
                  {fieldErrors.openingTime && <p className={styles.fieldError}>{fieldErrors.openingTime}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Closing Time *</label>
                  <input type="time" name="workingHours.closingTime" value={formData.workingHours.closingTime}
                         onChange={handleInputChange} className={`${styles.input} ${fieldErrors.closingTime ? styles.inputError : ''}`} />
                  {fieldErrors.closingTime && <p className={styles.fieldError}>{fieldErrors.closingTime}</p>}
                </div>
              </div>

              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="workingHours.is24x7Available" checked={formData.workingHours.is24x7Available}
                         onChange={handleInputChange} className={styles.checkbox} />
                  24x7 Available
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="workingHours.closedOnHolidays" checked={formData.workingHours.closedOnHolidays}
                         onChange={handleInputChange} className={styles.checkbox} />
                  Closed on Holidays
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 3: Additional Information</h2>
              <div className={styles.row}>
                {renderField('businessRegistrationNumber', 'Business Registration Number (Optional)')}
                {renderField('foodSafetyLicenseUrl', 'Food Safety License URL (Optional)', 'url')}
              </div>
              <div className={styles.row}>
                {renderField('yearsInOperation', 'Years in Operation (Optional)', 'number')}
                {renderField('numberOfBranches', 'Number of Branches (Optional)', 'number')}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Amenities (Optional)</label>
                <div className={styles.checkboxGrid}>
                  {Object.entries(formData.amenities).map(([key, value]) => (
                    <label key={key} className={styles.checkboxLabel}>
                      <input type="checkbox" name={`amenities.${key}`} checked={value} onChange={handleInputChange} className={styles.checkbox} />
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={styles.buttonContainer}>
            {currentStep > 1 && <button type="button" onClick={prevStep} className={styles.prevButton}>Previous</button>}
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className={styles.nextButton}>Next</button>
            ) : (
              <button type="button" className={styles.submitButton} disabled={loading} onClick={handleSubmit}>
                {loading ? 'Registering...' : 'Register Restaurant'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantRegistrationForm;