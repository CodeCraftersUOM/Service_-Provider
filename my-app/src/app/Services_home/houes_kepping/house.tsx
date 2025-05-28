'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import styles from './house.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
  // Basic Information
  businessName: string;
  ownerFullName: string;
  contactPhone: string;
  contactEmail: string;
  alternatePhone: string;
  websiteUrl: string;
  businessDescription: string;
  
  // Service Details
  serviceTypes: string[];
  pricingMethod: string;
  serviceArea: string;
  addressOrLandmark: string;
  googleMapsLink: string;
  
  // Availability & Legal
  daysAvailable: string[];
  timeSlot: string;
  emergencyServiceAvailable: boolean;
  businessRegistrationNumber: string;
  licensesCertificates: File[];
  termsAgreed: boolean;
}

const HousekeepingRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
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
    licensesCertificates: [],
    termsAgreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    setMessage('');
  };

  const handleCheckboxGroupChange = (name: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name as keyof FormData] as string[];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [name]: updatedArray,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData(prev => ({
        ...prev,
        licensesCertificates: Array.from(files),
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.ownerFullName.trim()) newErrors.ownerFullName = 'Owner full name is required';
      if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
      if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
      if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }
    }

    if (step === 2) {
      if (formData.serviceTypes.length === 0) newErrors.serviceTypes = 'Please select at least one service type';
      if (!formData.pricingMethod) newErrors.pricingMethod = 'Please select a pricing method';
      if (!formData.serviceArea.trim()) newErrors.serviceArea = 'Service area is required';
    }

    if (step === 3) {
      if (formData.daysAvailable.length === 0) newErrors.daysAvailable = 'Please select at least one day';
      if (!formData.timeSlot.trim()) newErrors.timeSlot = 'Time slot is required';
      if (!formData.termsAgreed) newErrors.termsAgreed = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setMessage('');
    } else {
      setMessage('Please fill in all required fields before proceeding.');
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (validateStep(3)) {
      // Prepare payload for API submission
      const payload = {
        ...formData,
        // Convert file array to file names or handle file uploads separately
        licensesCertificates: formData.licensesCertificates.map(file => file.name),
      };

      try {
        const res = await fetch('http://localhost:2000/api/addHelth', {//send the form data to backend server
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setIsSuccess(true);
        } else {
          const data = await res.json();
          setMessage(`Error: ${data?.message || 'Failed to submit form'}`);
        }//checks if the response is ok, if not, it sets an error message
      } catch (err) {
        setMessage('Error: Failed to connect to server');
      } finally {
        setLoading(false);
      }//reset the loading state
    }
  };

  const redirectDashboard = () => {
    router.push('/Dashboard');
  }//redirects to the dashboard page

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
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
      licensesCertificates: [],
      termsAgreed: false,
    });//reset the form data
    setErrors({});
    setMessage('');
  };

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>Housekeeping Services | Success</title>
        </Head>
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
              Congratulations! Your housekeeping service <strong>{formData.businessName}</strong> has been successfully registered in our system.
            </p>
            <div className={styles.successDetails}>
              <p><strong>Business:</strong> {formData.businessName}</p>
              <p><strong>Owner:</strong> {formData.ownerFullName}</p>
              <p><strong>Service Types:</strong> {formData.serviceTypes.join(', ')}</p>
              <p><strong>Email:</strong> {formData.contactEmail}</p>
            </div>
            <button onClick={resetForm} className={styles.newRegistrationButton}>
              Register Another Service
            </button>
            <button onClick={redirectDashboard} className={styles.newRegistrationButton}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Basic Information</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="businessName" className={styles.label}>
          Business Name *
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          className={`${styles.input} ${errors.businessName ? styles.inputError : ''}`}
          placeholder="Enter your business name"
        />
        {errors.businessName && <span className={styles.errorText}>{errors.businessName}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="ownerFullName" className={styles.label}>
          Owner Full Name *
        </label>
        <input
          type="text"
          id="ownerFullName"
          name="ownerFullName"
          value={formData.ownerFullName}
          onChange={handleInputChange}
          className={`${styles.input} ${errors.ownerFullName ? styles.inputError : ''}`}
          placeholder="Enter owner's full name"
        />
        {errors.ownerFullName && <span className={styles.errorText}>{errors.ownerFullName}</span>}
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="contactPhone" className={styles.label}>
            Contact Phone *
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.contactPhone ? styles.inputError : ''}`}
            placeholder="Enter contact phone"
          />
          {errors.contactPhone && <span className={styles.errorText}>{errors.contactPhone}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="alternatePhone" className={styles.label}>
            Alternate Phone
          </label>
          <input
            type="tel"
            id="alternatePhone"
            name="alternatePhone"
            value={formData.alternatePhone}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter alternate phone"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="contactEmail" className={styles.label}>
          Contact Email *
        </label>
        <input
          type="email"
          id="contactEmail"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleInputChange}
          className={`${styles.input} ${errors.contactEmail ? styles.inputError : ''}`}
          placeholder="Enter contact email"
        />
        {errors.contactEmail && <span className={styles.errorText}>{errors.contactEmail}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="websiteUrl" className={styles.label}>
          Website URL
        </label>
        <input
          type="url"
          id="websiteUrl"
          name="websiteUrl"
          value={formData.websiteUrl}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Enter website URL"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="businessDescription" className={styles.label}>
          Business Description
        </label>
        <textarea
          id="businessDescription"
          name="businessDescription"
          value={formData.businessDescription}
          onChange={handleInputChange}
          className={styles.textarea}
          rows={4}
          placeholder="Describe your business and services"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Service Details</h2>
      
      <div className={styles.formGroup}>
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
              <span className={styles.checkboxText}>{service}</span>
            </label>
          ))}
        </div>
        {errors.serviceTypes && <span className={styles.errorText}>{errors.serviceTypes}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="pricingMethod" className={styles.label}>
          Pricing Method *
        </label>
        <select
          id="pricingMethod"
          name="pricingMethod"
          value={formData.pricingMethod}
          onChange={handleInputChange}
          className={`${styles.select} ${errors.pricingMethod ? styles.inputError : ''}`}
        >
          <option value="">Select pricing method</option>
          {pricingMethodOptions.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        {errors.pricingMethod && <span className={styles.errorText}>{errors.pricingMethod}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="serviceArea" className={styles.label}>
          Service Area *
        </label>
        <input
          type="text"
          id="serviceArea"
          name="serviceArea"
          value={formData.serviceArea}
          onChange={handleInputChange}
          className={`${styles.input} ${errors.serviceArea ? styles.inputError : ''}`}
          placeholder="Enter service area (e.g., Downtown, North Zone)"
        />
        {errors.serviceArea && <span className={styles.errorText}>{errors.serviceArea}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="addressOrLandmark" className={styles.label}>
          Address or Landmark
        </label>
        <input
          type="text"
          id="addressOrLandmark"
          name="addressOrLandmark"
          value={formData.addressOrLandmark}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Enter address or nearby landmark"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="googleMapsLink" className={styles.label}>
          Google Maps Link
        </label>
        <input
          type="url"
          id="googleMapsLink"
          name="googleMapsLink"
          value={formData.googleMapsLink}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Enter Google Maps link"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Availability & Legal</h2>
      
      <div className={styles.formGroup}>
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
              <span className={styles.checkboxText}>{day}</span>
            </label>
          ))}
        </div>
        {errors.daysAvailable && <span className={styles.errorText}>{errors.daysAvailable}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="timeSlot" className={styles.label}>
          Time Slot *
        </label>
        <input
          type="text"
          id="timeSlot"
          name="timeSlot"
          value={formData.timeSlot}
          onChange={handleInputChange}
          className={`${styles.input} ${errors.timeSlot ? styles.inputError : ''}`}
          placeholder="e.g., 9:00 AM - 5:00 PM"
        />
        {errors.timeSlot && <span className={styles.errorText}>{errors.timeSlot}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="emergencyServiceAvailable"
            checked={formData.emergencyServiceAvailable}
            onChange={handleInputChange}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>Emergency Service Available</span>
        </label>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="businessRegistrationNumber" className={styles.label}>
          Business Registration Number
        </label>
        <input
          type="text"
          id="businessRegistrationNumber"
          name="businessRegistrationNumber"
          value={formData.businessRegistrationNumber}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Enter business registration number"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="licensesCertificates" className={styles.label}>
          Licenses & Certificates
        </label>
        <input
          type="file"
          id="licensesCertificates"
          name="licensesCertificates"
          onChange={handleFileChange}
          className={styles.fileInput}
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <small className={styles.helperText}>
          Upload licenses, certificates, or other relevant documents (PDF, JPG, PNG)
        </small>
      </div>

      <div className={styles.formGroup}>
        <label className={`${styles.checkboxLabel} ${errors.termsAgreed ? styles.labelError : ''}`}>
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleInputChange}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>
            I agree to the terms and conditions *
          </span>
        </label>
        {errors.termsAgreed && <span className={styles.errorText}>{errors.termsAgreed}</span>}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Housekeeping Services | Professional Registration</title>
        <meta name="description" content="Register your housekeeping services with our professional network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Housekeeping Service Registration</h1>
            <div className={styles.progressBar}>
              <div className={styles.progressTrack}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
              <div className={styles.stepIndicators}>
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`${styles.stepIndicator} ${
                      currentStep >= step ? styles.stepActive : ''
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {message && (
            <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className={styles.buttonGroup}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className={styles.buttonSecondary}
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.buttonPrimary}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className={styles.buttonPrimary}
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Submit Registration'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default HousekeepingRegistrationForm;