'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import styles from './Communication.module.css';
import { useRouter } from 'next/navigation';


interface CommunicationFormData {
  serviceTypesOffered: string;
  serviceSpeed: string;
  serviceCoverageArea: string;
  pricingDetails: string;
  paymentMethods: string;
  currentPromotions: string;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  emailAddress: string;
  businessRegistration: string;
  yearsInBusiness: number | '';
  customerSupport: string;
  installationTime: string;
  contractTerms: string;
  specialFeatures: string;
}//secure the data type

const CommunicationService: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<CommunicationFormData>({
    serviceTypesOffered: '',
    serviceSpeed: '',
    serviceCoverageArea: '',
    pricingDetails: '',
    paymentMethods: '',
    currentPromotions: '',
    companyName: '',
    contactPerson: '',
    phoneNumber: '',
    emailAddress: '',
    businessRegistration: '',
    yearsInBusiness: '',
    customerSupport: '',
    installationTime: '',
    contractTerms: '',
    specialFeatures: '',
  });//stores the form data

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();//programmatically navigate 

  const paymentMethods = [
    'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 
    'Online Payment', 'Mobile Payment', 'Cryptocurrency'
  ];//options for dropdown/select inputs

  const serviceTypes = [
    'Internet Service', 'Mobile Phone', 'Landline Phone', 'Cable TV',
    'Satellite TV', 'VoIP Services', 'Data Centers', 'Cloud Services'
  ];//options for dropdown/select inputs

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
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
  };//update the values

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.companyName && formData.contactPerson && formData.phoneNumber && formData.emailAddress);
      case 2:
        return !!(formData.serviceTypesOffered && formData.serviceSpeed && formData.serviceCoverageArea && formData.pricingDetails);
      case 3:
        return !!(formData.paymentMethods);
      default:
        return false;
    }
  };// validates that the required fields are not empty for each step

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setMessage('');
    } else {
      setMessage('Please fill in all required fields before proceeding.');
    }
  };//moves to the next step if the current step is valid

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setMessage('');
  };//moves to the previous step

  const handleSubmit = async (e: React.FormEvent) => {//handle form submission
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = {
      ...formData,
      serviceTypesOffered: formData.serviceTypesOffered.split(',').map(item => item.trim()),
      serviceCoverageArea: formData.serviceCoverageArea.split(',').map(item => item.trim()),
      paymentMethods: [formData.paymentMethods],
    };

    try {
      const res = await fetch('http://localhost:2000/api/addCommuni', {//send the form data to backend server
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
  };

  const redirectDashboard=()=>{
    router.push('/Dashboard');
  }//redirects to the dashboard page
  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setFormData({
      serviceTypesOffered: '',
      serviceSpeed: '',
      serviceCoverageArea: '',
      pricingDetails: '',
      paymentMethods: '',
      currentPromotions: '',
      companyName: '',
      contactPerson: '',
      phoneNumber: '',
      emailAddress: '',
      businessRegistration: '',
      yearsInBusiness: '',
      customerSupport: '',
      installationTime: '',
      contractTerms: '',
      specialFeatures: '',
    });//reset the form data
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
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="contactPerson" className={styles.label}>Contact Person *</label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    />
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
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="emailAddress" className={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      id="emailAddress"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="businessRegistration" className={styles.label}>Business Registration</label>
                    <input
                      type="text"
                      id="businessRegistration"
                      name="businessRegistration"
                      value={formData.businessRegistration}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
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
                    className={styles.input}
                    placeholder="Internet, Mobile, TV services, etc."
                    required
                  />
                  <span className={styles.inputHelp}>Comma-separated list</span>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="serviceSpeed" className={styles.label}>Service Speed *</label>
                    <input
                      type="text"
                      id="serviceSpeed"
                      name="serviceSpeed"
                      value={formData.serviceSpeed}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g., 100 Mbps, HD Quality"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="installationTime" className={styles.label}>Installation Time</label>
                    <input
                      type="text"
                      id="installationTime"
                      name="installationTime"
                      value={formData.installationTime}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g., 2-3 business days"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="serviceCoverageArea" className={styles.label}>Service Coverage Area *</label>
                  <input
                    type="text"
                    id="serviceCoverageArea"
                    name="serviceCoverageArea"
                    value={formData.serviceCoverageArea}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Cities, regions or areas covered"
                    required
                  />
                  <span className={styles.inputHelp}>Comma-separated list</span>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="pricingDetails" className={styles.label}>Pricing Details *</label>
                    <input
                      type="text"
                      id="pricingDetails"
                      name="pricingDetails"
                      value={formData.pricingDetails}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Monthly rates, package costs"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="customerSupport" className={styles.label}>Customer Support</label>
                    <input
                      type="text"
                      id="customerSupport"
                      name="customerSupport"
                      value={formData.customerSupport}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="24/7, Business hours, etc."
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="specialFeatures" className={styles.label}>Special Features</label>
                  <textarea
                    id="specialFeatures"
                    name="specialFeatures"
                    value={formData.specialFeatures}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={3}
                    placeholder="Unique features, benefits, or services"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Business Terms */}
            {currentStep === 3 && (
              <div className={styles.step}>
                <h2 className={styles.stepTitle}>Step 3: Business Terms</h2>
                
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="paymentMethods" className={styles.label}>Payment Method *</label>
                    <select
                      id="paymentMethods"
                      name="paymentMethods"
                      value={formData.paymentMethods}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="contractTerms" className={styles.label}>Contract Terms</label>
                    <input
                      type="text"
                      id="contractTerms"
                      name="contractTerms"
                      value={formData.contractTerms}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g., 12 months, No contract, etc."
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="currentPromotions" className={styles.label}>Current Promotions</label>
                  <textarea
                    id="currentPromotions"
                    name="currentPromotions"
                    value={formData.currentPromotions}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Special offers, discounts, or bundles available"
                  />
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