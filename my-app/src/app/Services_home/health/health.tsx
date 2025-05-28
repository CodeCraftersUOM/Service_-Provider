'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import styles from './health.module.css';
import { useRouter } from 'next/navigation';

interface HealthFormData {
  serviceTypesOffered: string;
  specializations: string;
  serviceCoverageArea: string;
  consultationFees: string;
  paymentMethods: string;
  currentOffers: string;
  hospitalName: string;
  contactPerson: string;
  phoneNumber: string;
  emailAddress: string;
  medicalLicense: string;
  yearsInService: number | '';
  emergencyServices: string;
  appointmentTime: string;
  insuranceAccepted: string;
  medicalEquipment: string;
}

const HealthService: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<HealthFormData>({
    serviceTypesOffered: '',
    specializations: '',
    serviceCoverageArea: '',
    consultationFees: '',
    paymentMethods: '',
    currentOffers: '',
    hospitalName: '',
    contactPerson: '',
    phoneNumber: '',
    emailAddress: '',
    medicalLicense: '',
    yearsInService: '',
    emergencyServices: '',
    appointmentTime: '',
    insuranceAccepted: '',
    medicalEquipment: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const paymentMethods = [
    'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 
    'Insurance', 'Online Payment', 'Mobile Payment', 'Installments'
  ];

  const serviceTypes = [
    'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Gynecology', 'Dermatology', 'Emergency Care',
    'Surgery', 'Dental Care', 'Eye Care', 'Mental Health'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'yearsInService') {
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.hospitalName && formData.contactPerson && formData.phoneNumber && formData.emailAddress);
      case 2:
        return !!(formData.serviceTypesOffered && formData.specializations && formData.serviceCoverageArea && formData.consultationFees);
      case 3:
        return !!(formData.paymentMethods);
      default:
        return false;
    }
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const res = await fetch('http://localhost:2000/api/addHealth', {
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

  const redirectDashboard = () => {
    router.push('/Dashboard');
  }

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setFormData({
      serviceTypesOffered: '',
      specializations: '',
      serviceCoverageArea: '',
      consultationFees: '',
      paymentMethods: '',
      currentOffers: '',
      hospitalName: '',
      contactPerson: '',
      phoneNumber: '',
      emailAddress: '',
      medicalLicense: '',
      yearsInService: '',
      emergencyServices: '',
      appointmentTime: '',
      insuranceAccepted: '',
      medicalEquipment: '',
    });
  };

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>Health Services | Success</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.successWrapper}>
            <div className={styles.successIcon}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <h1 className={styles.successTitle}>Health Service Successfully Registered!</h1>
            <p className={styles.successMessage}>
              Congratulations! Your health service <strong>{formData.hospitalName}</strong> has been successfully registered in our system.
            </p>
            <div className={styles.successDetails}>
              <p><strong>Hospital/Clinic:</strong> {formData.hospitalName}</p>
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
        <title>Health Services | Professional Healthcare Solutions</title>
        <meta name="description" content="Register your health services with our professional network" />
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
                    {step === 1 && 'Hospital Info'}
                    {step === 2 && 'Service Details'}
                    {step === 3 && 'Business Terms'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h1 className={styles.title}>Health Services Registration</h1>
          
          {message && (
            <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Step 1: Hospital Information */}
            {currentStep === 1 && (
              <div className={styles.step}>
                <h2 className={styles.stepTitle}>Step 1: Hospital Information</h2>
                
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="hospitalName" className={styles.label}>Hospital/Clinic Name *</label>
                    <input
                      type="text"
                      id="hospitalName"
                      name="hospitalName"
                      value={formData.hospitalName}
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
                    <label htmlFor="medicalLicense" className={styles.label}>Medical License Number</label>
                    <input
                      type="text"
                      id="medicalLicense"
                      name="medicalLicense"
                      value={formData.medicalLicense}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="yearsInService" className={styles.label}>Years in Service</label>
                    <input
                      type="number"
                      id="yearsInService"
                      name="yearsInService"
                      value={formData.yearsInService}
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
                  <label htmlFor="serviceTypesOffered" className={styles.label}>Medical Services Offered *</label>
                  <input
                    type="text"
                    id="serviceTypesOffered"
                    name="serviceTypesOffered"
                    value={formData.serviceTypesOffered}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="General Medicine, Cardiology, Surgery, etc."
                    required
                  />
                  <span className={styles.inputHelp}>Comma-separated list</span>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="specializations" className={styles.label}>Specializations *</label>
                    <input
                      type="text"
                      id="specializations"
                      name="specializations"
                      value={formData.specializations}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g., Heart Surgery, Pediatrics"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="appointmentTime" className={styles.label}>Appointment Availability</label>
                    <input
                      type="text"
                      id="appointmentTime"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g., 24/7, 9 AM - 6 PM"
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
                    <label htmlFor="consultationFees" className={styles.label}>Consultation Fees *</label>
                    <input
                      type="text"
                      id="consultationFees"
                      name="consultationFees"
                      value={formData.consultationFees}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Fee structure and rates"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="emergencyServices" className={styles.label}>Emergency Services</label>
                    <input
                      type="text"
                      id="emergencyServices"
                      name="emergencyServices"
                      value={formData.emergencyServices}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="24/7 Emergency, Ambulance, etc."
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="medicalEquipment" className={styles.label}>Medical Equipment & Facilities</label>
                  <textarea
                    id="medicalEquipment"
                    name="medicalEquipment"
                    value={formData.medicalEquipment}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={3}
                    placeholder="Available medical equipment, facilities, and technologies"
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
                    <label htmlFor="insuranceAccepted" className={styles.label}>Insurance Accepted</label>
                    <input
                      type="text"
                      id="insuranceAccepted"
                      name="insuranceAccepted"
                      value={formData.insuranceAccepted}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g., All major insurance providers"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="currentOffers" className={styles.label}>Current Offers & Packages</label>
                  <textarea
                    id="currentOffers"
                    name="currentOffers"
                    value={formData.currentOffers}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Special health packages, discounts, or promotional offers available"
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

export default HealthService;