'use client';

import React, { useState } from 'react';
import styles from './Communication.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
  fullName: string;
  serviceCoverageArea: string;
  licenseOrRegistrationDetails: string;
  customerServicePhoneNumbers: string[];
  emailAddress: string;
  socialMediaLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
    other: string;
  };
  physicalOfficeLocations: Array<{
    address: string;
    city: string;
    coordinates: { lat: string; lng: string; };
  }>;
  workingHours: string;
  customerSupportLanguages: {
    sinhala: boolean;
    tamil: boolean;
    english: boolean;
  };
  isAvailable24_7: boolean;
}

interface ApiResponse {
  message?: string;
  errors?: Array<{ field: string; message: string; }>;
}

const CommunicationServiceForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    serviceCoverageArea: '',
    licenseOrRegistrationDetails: '',
    customerServicePhoneNumbers: [''],
    emailAddress: '',
    socialMediaLinks: { facebook: '', instagram: '', twitter: '', whatsapp: '', other: '' },
    physicalOfficeLocations: [{ address: '', city: '', coordinates: { lat: '', lng: '' } }],
    workingHours: '',
    customerSupportLanguages: { sinhala: false, tamil: false, english: false },
    isAvailable24_7: false,
  });

  const coverageAreas = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Ratnapura', 'Kegalle', 'Nationwide'];

  const cities = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Ratnapura', 'Kegalle'];

  const validate = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Service name is required";
      if (!formData.emailAddress.trim()) newErrors.emailAddress = "Email is required";
      if (!formData.serviceCoverageArea) newErrors.serviceCoverageArea = "Coverage area is required";
      if (!formData.licenseOrRegistrationDetails.trim()) newErrors.licenseOrRegistrationDetails = "License details are required";
    }
    
    if (step === 2) {
      const validPhones = formData.customerServicePhoneNumbers.filter(p => p.trim());
      if (validPhones.length === 0) newErrors.customerServicePhoneNumbers = "At least one phone number is required";
      if (!formData.workingHours.trim()) newErrors.workingHours = "Working hours are required";
      const validLocations = formData.physicalOfficeLocations.filter(l => l.address.trim() && l.city.trim());
      if (validLocations.length === 0) newErrors.physicalOfficeLocations = "At least one office location is required";
    }
    
    if (step === 3) {
      const { sinhala, tamil, english } = formData.customerSupportLanguages;
      if (!sinhala && !tamil && !english) newErrors.customerSupportLanguages = "At least one language is required";
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
      if (parent === 'socialMediaLinks') {
        setFormData(prev => ({
          ...prev,
          socialMediaLinks: { ...prev.socialMediaLinks, [child]: value }
        }));
      } else if (parent === 'customerSupportLanguages') {
        setFormData(prev => ({
          ...prev,
          customerSupportLanguages: { ...prev.customerSupportLanguages, [child]: checked }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const updateArray = (field: 'customerServicePhoneNumbers' | 'physicalOfficeLocations', index: number, value: string | { address?: string; city?: string; lat?: string; lng?: string }) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index 
          ? (
              typeof value === 'string'
                ? value
                : (typeof item === 'object' && item !== null
                    ? { ...item, ...value }
                    : value)
            )
          : item
      )
    }));
  };

  const addToArray = (field: 'customerServicePhoneNumbers' | 'physicalOfficeLocations') => {
    const newItem = field === 'customerServicePhoneNumbers' 
      ? '' 
      : { address: '', city: '', coordinates: { lat: '', lng: '' } };
    
    setFormData(prev => ({ ...prev, [field]: [...prev[field], newItem] }));
  };

  const removeFromArray = (field: 'customerServicePhoneNumbers' | 'physicalOfficeLocations', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    }
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
        customerServicePhoneNumbers: formData.customerServicePhoneNumbers.filter(p => p.trim()),
        physicalOfficeLocations: formData.physicalOfficeLocations
          .filter(l => l.address.trim() && l.city.trim())
          .map(l => ({
            ...l,
            coordinates: {
              lat: l.coordinates.lat ? parseFloat(l.coordinates.lat) : null,
              lng: l.coordinates.lng ? parseFloat(l.coordinates.lng) : null,
            }
          }))
      };

      const response = await fetch('http://localhost:2000/api/communication/addCommunicationService', {
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
      fullName: '', serviceCoverageArea: '', licenseOrRegistrationDetails: '',
      customerServicePhoneNumbers: [''], emailAddress: '',
      socialMediaLinks: { facebook: '', instagram: '', twitter: '', whatsapp: '', other: '' },
      physicalOfficeLocations: [{ address: '', city: '', coordinates: { lat: '', lng: '' } }],
      workingHours: '', customerSupportLanguages: { sinhala: false, tamil: false, english: false },
      isAvailable24_7: false,
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
            <strong>{formData.fullName}</strong> has been registered successfully.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Service:</strong> {formData.fullName}</p>
            <p><strong>Coverage:</strong> {formData.serviceCoverageArea}</p>
            <p><strong>Email:</strong> {formData.emailAddress}</p>
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
                  {step === 2 && 'Contact & Location'}
                  {step === 3 && 'Services'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Communication Service Registration</h1>
        
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
                  <label className={styles.label}>Service Name *</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                    placeholder="Enter service name"
                  />
                  {errors.fullName && <p className={styles.fieldError}>{errors.fullName}</p>}
                </div>

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
              </div>

              <div className={styles.row}>
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

                <div className={styles.field}>
                  <label className={styles.label}>License Details *</label>
                  <input
                    name="licenseOrRegistrationDetails"
                    value={formData.licenseOrRegistrationDetails}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.licenseOrRegistrationDetails ? styles.inputError : ''}`}
                    placeholder="License number"
                  />
                  {errors.licenseOrRegistrationDetails && <p className={styles.fieldError}>{errors.licenseOrRegistrationDetails}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact & Location */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Contact & Location</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>Phone Numbers *</label>
                {formData.customerServicePhoneNumbers.map((phone, index) => (
                  <div key={index} className={styles.phoneInputGroup}>
                    <input
                      value={phone}
                      onChange={(e) => updateArray('customerServicePhoneNumbers', index, e.target.value)}
                      className={`${styles.input} ${errors.customerServicePhoneNumbers ? styles.inputError : ''}`}
                      placeholder="07XXXXXXXX"
                    />
                    {formData.customerServicePhoneNumbers.length > 1 && (
                      <button type="button" onClick={() => removeFromArray('customerServicePhoneNumbers', index)} className={styles.removeButton}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addToArray('customerServicePhoneNumbers')} className={styles.addButton}>
                  Add Phone
                </button>
                {errors.customerServicePhoneNumbers && <p className={styles.fieldError}>{errors.customerServicePhoneNumbers}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Working Hours *</label>
                <input
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.workingHours ? styles.inputError : ''}`}
                  placeholder="Mon-Fri: 9AM-6PM"
                />
                {errors.workingHours && <p className={styles.fieldError}>{errors.workingHours}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Office Locations *</label>
                {formData.physicalOfficeLocations.map((location, index) => (
                  <div key={index} className={styles.locationGroup}>
                    <div className={styles.row}>
                      <input
                        value={location.address}
                        onChange={(e) => updateArray('physicalOfficeLocations', index, { address: e.target.value })}
                        className={`${styles.input} ${errors.physicalOfficeLocations ? styles.inputError : ''}`}
                        placeholder="Address"
                      />
                      <select
                        value={location.city}
                        onChange={(e) => updateArray('physicalOfficeLocations', index, { city: e.target.value })}
                        className={`${styles.select} ${errors.physicalOfficeLocations ? styles.inputError : ''}`}
                      >
                        <option value="">Select City</option>
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                    {formData.physicalOfficeLocations.length > 1 && (
                      <button type="button" onClick={() => removeFromArray('physicalOfficeLocations', index)} className={styles.removeButton}>
                        Remove Location
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addToArray('physicalOfficeLocations')} className={styles.addButton}>
                  Add Location
                </button>
                {errors.physicalOfficeLocations && <p className={styles.fieldError}>{errors.physicalOfficeLocations}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Services */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Services & Support</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>Support Languages *</label>
                <div className={styles.checkboxRow}>
                  {['sinhala', 'tamil', 'english'].map(lang => (
                    <label key={lang} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name={`customerSupportLanguages.${lang}`}
                        checked={formData.customerSupportLanguages[lang as keyof typeof formData.customerSupportLanguages]}
                        onChange={handleInputChange}
                        className={styles.checkbox}
                      />
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </label>
                  ))}
                </div>
                {errors.customerSupportLanguages && <p className={styles.fieldError}>{errors.customerSupportLanguages}</p>}
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

              <div className={styles.field}>
                <label className={styles.label}>Social Media (Optional)</label>
                {['facebook', 'instagram', 'twitter', 'whatsapp'].map(platform => (
                  <input
                    key={platform}
                    name={`socialMediaLinks.${platform}`}
                    value={formData.socialMediaLinks[platform as keyof typeof formData.socialMediaLinks]}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                  />
                ))}
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

export default CommunicationServiceForm;