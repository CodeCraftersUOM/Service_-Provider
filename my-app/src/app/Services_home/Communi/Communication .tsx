'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import styles from './Communication.module.css';
import { useRouter } from 'next/navigation';

interface CommunicationFormData {
  serviceTypesOffered: string;
  serviceCoverageArea: string;
  paymentMethods: string;
  currentPromotions: string;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  emailAddress: string;
  businessRegistration: string;
  yearsInBusiness: number | '';
  specialFeatures: string;
}

interface FieldErrors {
  [key: string]: string;
}

const CommunicationService: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<CommunicationFormData>({
    serviceTypesOffered: '',
    serviceCoverageArea: '',
    paymentMethods: '',
    currentPromotions: '',
    companyName: '',
    contactPerson: '',
    phoneNumber: '',
    emailAddress: '',
    businessRegistration: '',
    yearsInBusiness: '',
    specialFeatures: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const paymentMethods = [
    'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 
    'Online Payment', 'Mobile Payment'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    if (name === 'yearsInBusiness') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setMessage('');
  };

  // ✅ UPDATED: Validation with your mandatory rules
  const validateStep = (step: number): boolean => {
    const errors: FieldErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.companyName.trim()) errors.companyName = "Company name is required";
        if (!formData.contactPerson.trim()) errors.contactPerson = "Contact person is required";
        if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
        if (!formData.emailAddress.trim()) errors.emailAddress = "Email address is required";
        if (!formData.businessRegistration.trim()) errors.businessRegistration = "Business Registration number is mandatory";
        break;
      case 2:
        if (!formData.serviceTypesOffered.trim()) errors.serviceTypesOffered = "Service Types Offered is mandatory";
        if (!formData.serviceCoverageArea.trim()) errors.serviceCoverageArea = "Service Coverage Area is mandatory";
        if (!formData.specialFeatures.trim()) errors.specialFeatures = "Special features are mandatory";
        break;
      case 3:
        if (!formData.paymentMethods) errors.paymentMethods = "Payment method is mandatory";
        if (!formData.currentPromotions.trim()) errors.currentPromotions = "Current promotions are mandatory";
        break;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setMessage('');
    } else {
      setMessage('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setMessage('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ UPDATED: Validate all steps before submit
    const allValid = validateStep(1) && validateStep(2) && validateStep(3);
    if (!allValid) {
      setMessage('Please fix all errors before submitting.');
      return;
    }
    
    setLoading(true);
    setMessage('');

    const payload = {
      ...formData,
      serviceTypesOffered: formData.serviceTypesOffered.split(',').map(item => item.trim()),
      serviceCoverageArea: formData.serviceCoverageArea.split(',').map(item => item.trim()),
      paymentMethods: [formData.paymentMethods],
    };

    try {
      const res = await fetch('http://localhost:2000/api/addCommuni', {
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
      }
    } catch (err) {
      setMessage('Error: Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const redirectDashboard=()=>{
    router.push('/Dashboard');
  }
  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setFieldErrors({});
    setMessage('');
    setFormData({
      serviceTypesOffered: '',
      serviceCoverageArea: '',
      paymentMethods: '',
      currentPromotions: '',
      companyName: '',
      contactPerson: '',
      phoneNumber: '',
      emailAddress: '',
      businessRegistration: '',
      yearsInBusiness: '',
      specialFeatures: '',
    });
  };

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>Communication Services | Success</title>
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
              Congratulations! Your communication service <strong>{formData.companyName}</strong> has been successfully registered in our system.
            </p>
            <div className={styles.successDetails}>
              <p><strong>Company:</strong> {formData.companyName}</p>
              <p><strong>Contact Person:</strong> {formData.contactPerson}</p>
              <p><strong>Service Types:</strong> {formData.serviceTypesOffered}</p>
              <p><strong>Email:</strong> {formData.emailAddress}</p>
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

  return (
    <>
      <Head>
        <title>Communication Services | Professional Connectivity Solutions</title>
        <meta name="description" content="Register your communication services with our professional network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
                    {step === 1 && 'Company Info'}
                    {step === 2 && 'Service Details'}
                    {step === 3 && 'Business Terms'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h1 className={styles.title}>Communication Services Registration</h1>
          
          {message && (
            <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div className={styles.step}>
                <h2 className={styles.stepTitle}>Step 1: Company Information</h2>
                
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="companyName" className={styles.label}>Company Name *</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`${styles.input} ${fieldErrors.companyName ? styles.inputError : ''}`}
                    />
                    {fieldErrors.companyName && <p className={styles.fieldError}>{fieldErrors.companyName}</p>}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="contactPerson" className={styles.label}>Contact Person *</label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className={`${styles.input} ${fieldErrors.contactPerson ? styles.inputError : ''}`}
                    />
                    {fieldErrors.contactPerson && <p className={styles.fieldError}>{fieldErrors.contactPerson}</p>}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="phoneNumber" className={styles.label}>Phone Number *</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`${styles.input} ${fieldErrors.phoneNumber ? styles.inputError : ''}`}
                    />
                    {fieldErrors.phoneNumber && <p className={styles.fieldError}>{fieldErrors.phoneNumber}</p>}
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
                    />
                    {fieldErrors.emailAddress && <p className={styles.fieldError}>{fieldErrors.emailAddress}</p>}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="businessRegistration" className={styles.label}>Business Registration number *</label>
                    <input
                      type="text"
                      id="businessRegistration"
                      name="businessRegistration"
                      value={formData.businessRegistration}
                      onChange={handleInputChange}
                      className={`${styles.input} ${fieldErrors.businessRegistration ? styles.inputError : ''}`}
                    />
                    {fieldErrors.businessRegistration && <p className={styles.fieldError}>{fieldErrors.businessRegistration}</p>}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="yearsInBusiness" className={styles.label}>Years in Business</label>
                    <input
                      type="number"
                      id="yearsInBusiness"
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Service Details */}
            {currentStep === 2 && (
              <div className={styles.step}>
                <h2 className={styles.stepTitle}>Step 2: Service Details</h2>
                
                <div className={styles.field}>
                  <label htmlFor="serviceTypesOffered" className={styles.label}>Service Types Offered *</label>
                  <input
                    type="text"
                    id="serviceTypesOffered"
                    name="serviceTypesOffered"
                    value={formData.serviceTypesOffered}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.serviceTypesOffered ? styles.inputError : ''}`}
                    placeholder="Internet, Mobile, TV services, etc."
                  />
                  <span className={styles.inputHelp}>Comma-separated list</span>
                  {fieldErrors.serviceTypesOffered && <p className={styles.fieldError}>{fieldErrors.serviceTypesOffered}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="serviceCoverageArea" className={styles.label}>Service Coverage Area *</label>
                  <input
                    type="text"
                    id="serviceCoverageArea"
                    name="serviceCoverageArea"
                    value={formData.serviceCoverageArea}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.serviceCoverageArea ? styles.inputError : ''}`}
                    placeholder="Cities, regions or areas covered"
                  />
                  <span className={styles.inputHelp}>Comma-separated list</span>
                  {fieldErrors.serviceCoverageArea && <p className={styles.fieldError}>{fieldErrors.serviceCoverageArea}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="specialFeatures" className={styles.label}>Special Features *</label>
                  <textarea
                    id="specialFeatures"
                    name="specialFeatures"
                    value={formData.specialFeatures}
                    onChange={handleInputChange}
                    className={`${styles.textarea} ${fieldErrors.specialFeatures ? styles.inputError : ''}`}
                    rows={3}
                    placeholder="Unique features, benefits, or services"
                  />
                  {fieldErrors.specialFeatures && <p className={styles.fieldError}>{fieldErrors.specialFeatures}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Business Terms */}
            {currentStep === 3 && (
              <div className={styles.step}>
                <h2 className={styles.stepTitle}>Step 3: Business Terms</h2>
                
                <div className={styles.field}>
                  <label htmlFor="paymentMethods" className={styles.label}>Payment Method *</label>
                  <select
                    id="paymentMethods"
                    name="paymentMethods"
                    value={formData.paymentMethods}
                    onChange={handleInputChange}
                    className={`${styles.select} ${fieldErrors.paymentMethods ? styles.inputError : ''}`}
                  >
                    <option value="">Select payment method</option>
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                  {fieldErrors.paymentMethods && <p className={styles.fieldError}>{fieldErrors.paymentMethods}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="currentPromotions" className={styles.label}>Current Promotions *</label>
                  <textarea
                    id="currentPromotions"
                    name="currentPromotions"
                    value={formData.currentPromotions}
                    onChange={handleInputChange}
                    className={`${styles.textarea} ${fieldErrors.currentPromotions ? styles.inputError : ''}`}
                    rows={4}
                    placeholder="Special offers, discounts, or bundles available"
                  />
                  {fieldErrors.currentPromotions && <p className={styles.fieldError}>{fieldErrors.currentPromotions}</p>}
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
    </>
  );
};

export default CommunicationService;