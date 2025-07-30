'use client';

import React, { useState } from 'react';
import styles from './repair.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
  ownerName: string;
  garageName: string;
  typeOfService: string;
  registrationOrLicenseNumber: string;
  yearsInOperation: string;
  emailAddress: string;
  serviceCoverageArea: string;
  weekdayWeekendSchedule: string;
  isAvailable24_7: boolean;
  vehicleTypesSupported: string[];
  languagesAvailable: {
    sinhala: boolean;
    tamil: boolean;
    english: boolean;
  };
}

interface ApiResponse {
  message?: string;
  errors?: Array<{ field: string; message: string; }>;
}

const VehicleRepairServiceForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    ownerName: '',
    garageName: '',
    typeOfService: '',
    registrationOrLicenseNumber: '',
    yearsInOperation: '',
    emailAddress: '',
    serviceCoverageArea: '',
    weekdayWeekendSchedule: '',
    isAvailable24_7: false,
    vehicleTypesSupported: [],
    languagesAvailable: { sinhala: false, tamil: false, english: false },
  });

  const serviceTypes = [
    'Garage',
    'Mobile Mechanic', 
    '24/7 Roadside Assistance',
    'Specialized Service Center'
  ];

  const vehicleTypes = ['Cars', 'Vans', 'Buses', 'Motorbikes', 'Trucks'];

  const coverageAreas = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kurunegala', 'Puttalam', 
    'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Ratnapura', 'Kegalle', 'Nationwide'
  ];

  const validate = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
      if (!formData.garageName.trim()) newErrors.garageName = "Garage name is required";
      if (!formData.emailAddress.trim()) newErrors.emailAddress = "Email is required";
      if (!formData.registrationOrLicenseNumber.trim()) newErrors.registrationOrLicenseNumber = "License number is required";
      if (!formData.yearsInOperation.trim()) newErrors.yearsInOperation = "Years in operation is required";
      else if (parseInt(formData.yearsInOperation) < 0) newErrors.yearsInOperation = "Years cannot be negative";
    }
    
    if (step === 2) {
      if (!formData.typeOfService) newErrors.typeOfService = "Service type is required";
      if (!formData.serviceCoverageArea) newErrors.serviceCoverageArea = "Coverage area is required";
      if (!formData.weekdayWeekendSchedule.trim()) newErrors.weekdayWeekendSchedule = "Schedule is required";
      if (formData.vehicleTypesSupported.length === 0) newErrors.vehicleTypesSupported = "At least one vehicle type is required";
    }
    
    if (step === 3) {
      const { sinhala, tamil, english } = formData.languagesAvailable;
      if (!sinhala && !tamil && !english) newErrors.languagesAvailable = "At least one language is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'languagesAvailable') {
        setFormData(prev => ({
          ...prev,
          languagesAvailable: { ...prev.languagesAvailable, [child]: checked }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleVehicleTypeChange = (vehicleType: string) => {
    if (errors.vehicleTypesSupported) setErrors(prev => ({ ...prev, vehicleTypesSupported: '' }));
    
    setFormData(prev => ({
      ...prev,
      vehicleTypesSupported: prev.vehicleTypesSupported.includes(vehicleType)
        ? prev.vehicleTypesSupported.filter(type => type !== vehicleType)
        : [...prev.vehicleTypesSupported, vehicleType]
    }));
  };

  const nextStep = () => {
    if (validate(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setMessage('');
    } else {
      setMessage('Please fix the errors below.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setMessage('');
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate(1) || !validate(2) || !validate(3)) {
      setMessage('Please fix all errors before submitting.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const cleanedData = {
        ...formData,
        yearsInOperation: parseInt(formData.yearsInOperation)
      };

      const response = await fetch('http://localhost:2000/api/addVehicleRepairService', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        if (data.errors) {
          const backendErrors: Record<string, string> = {};
          data.errors.forEach(err => {
            backendErrors[err.field] = err.message;
          });
          setErrors(backendErrors);
          setMessage('Please fix the validation errors below.');
        } else {
          setMessage(`Error: ${data.message || 'Failed to register service'}`);
        }
      }
    } catch {
      setMessage('Error: Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setErrors({});
    setMessage('');
    setFormData({
      ownerName: '', garageName: '', typeOfService: '', registrationOrLicenseNumber: '',
      yearsInOperation: '', emailAddress: '', serviceCoverageArea: '', weekdayWeekendSchedule: '',
      isAvailable24_7: false, vehicleTypesSupported: [],
      languagesAvailable: { sinhala: false, tamil: false, english: false },
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
          <h1 className={styles.successTitle}>Vehicle Repair Service Successfully Registered!</h1>
          <p className={styles.successMessage}>
            <strong>{formData.garageName}</strong> has been registered successfully.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Garage:</strong> {formData.garageName}</p>
            <p><strong>Owner:</strong> {formData.ownerName}</p>
            <p><strong>Service Type:</strong> {formData.typeOfService}</p>
            <p><strong>Coverage:</strong> {formData.serviceCoverageArea}</p>
            <p><strong>Experience:</strong> {formData.yearsInOperation} years</p>
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>Register Another</button>
          <button onClick={() => router.push('/Dashboard')} className={styles.newRegistrationButton}>Dashboard</button>
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
            <div className={styles.progressFill} style={{ width: `${(currentStep / 3) * 100}%` }}></div>
          </div>
          <div className={styles.stepIndicators}>
            {[1, 2, 3].map(step => (
              <div key={step} className={`${styles.stepIndicator} ${currentStep >= step ? styles.active : ''}`}>
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepLabel}>
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Service Details'}
                  {step === 3 && 'Languages & Availability'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Vehicle Repair Service Registration</h1>
        
        {message && (
          <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Basic Information</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Owner Name *</label>
                  <input
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.ownerName ? styles.inputError : ''}`}
                    placeholder="Enter owner name"
                  />
                  {errors.ownerName && <p className={styles.fieldError}>{errors.ownerName}</p>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Garage Name *</label>
                  <input
                    name="garageName"
                    value={formData.garageName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.garageName ? styles.inputError : ''}`}
                    placeholder="Enter garage name"
                  />
                  {errors.garageName && <p className={styles.fieldError}>{errors.garageName}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.emailAddress ? styles.inputError : ''}`}
                    placeholder="Enter email"
                  />
                  {errors.emailAddress && <p className={styles.fieldError}>{errors.emailAddress}</p>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>License Number *</label>
                  <input
                    name="registrationOrLicenseNumber"
                    value={formData.registrationOrLicenseNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.registrationOrLicenseNumber ? styles.inputError : ''}`}
                    placeholder="Registration/License number"
                  />
                  {errors.registrationOrLicenseNumber && <p className={styles.fieldError}>{errors.registrationOrLicenseNumber}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Years in Operation *</label>
                <input
                  type="number"
                  name="yearsInOperation"
                  value={formData.yearsInOperation}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.yearsInOperation ? styles.inputError : ''}`}
                  placeholder="Enter years in operation"
                  min="0"
                />
                {errors.yearsInOperation && <p className={styles.fieldError}>{errors.yearsInOperation}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Service Details</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Type of Service *</label>
                  <select
                    name="typeOfService"
                    value={formData.typeOfService}
                    onChange={handleInputChange}
                    className={`${styles.select} ${errors.typeOfService ? styles.inputError : ''}`}
                  >
                    <option value="">Select Service Type</option>
                    {serviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  {errors.typeOfService && <p className={styles.fieldError}>{errors.typeOfService}</p>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Coverage Area *</label>
                  <select
                    name="serviceCoverageArea"
                    value={formData.serviceCoverageArea}
                    onChange={handleInputChange}
                    className={`${styles.select} ${errors.serviceCoverageArea ? styles.inputError : ''}`}
                  >
                    <option value="">Select Area</option>
                    {coverageAreas.map(area => <option key={area} value={area}>{area}</option>)}
                  </select>
                  {errors.serviceCoverageArea && <p className={styles.fieldError}>{errors.serviceCoverageArea}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Schedule *</label>
                <input
                  name="weekdayWeekendSchedule"
                  value={formData.weekdayWeekendSchedule}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.weekdayWeekendSchedule ? styles.inputError : ''}`}
                  placeholder="e.g., Mon-Fri: 8AM-6PM, Sat: 8AM-4PM"
                />
                {errors.weekdayWeekendSchedule && <p className={styles.fieldError}>{errors.weekdayWeekendSchedule}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Vehicle Types Supported *</label>
                <div className={styles.checkboxGrid}>
                  {vehicleTypes.map(type => (
                    <label key={type} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.vehicleTypesSupported.includes(type)}
                        onChange={() => handleVehicleTypeChange(type)}
                        className={styles.checkbox}
                      />
                      {type}
                    </label>
                  ))}
                </div>
                {errors.vehicleTypesSupported && <p className={styles.fieldError}>{errors.vehicleTypesSupported}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Languages & Availability */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Languages & Availability</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>Languages Available *</label>
                <div className={styles.checkboxRow}>
                  {['sinhala', 'tamil', 'english'].map(lang => (
                    <label key={lang} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name={`languagesAvailable.${lang}`}
                        checked={formData.languagesAvailable[lang as keyof typeof formData.languagesAvailable]}
                        onChange={handleInputChange}
                        className={styles.checkbox}
                      />
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </label>
                  ))}
                </div>
                {errors.languagesAvailable && <p className={styles.fieldError}>{errors.languagesAvailable}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isAvailable24_7"
                    checked={formData.isAvailable24_7}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Available 24/7
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.buttonContainer}>
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className={styles.prevButton}>Previous</button>
            )}
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className={styles.nextButton}>Next</button>
            ) : (
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Registering...' : 'Register Service'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleRepairServiceForm;