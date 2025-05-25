'use client';

import React, { useState } from 'react';
import styles from './other.module.css';

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
  yearsOfExperience: number;
  availableDays: string[];
  availableTimeSlots: string;
  is24x7Available: boolean;
  emergencyOrOnCallAvailable: boolean;
  termsAgreed: boolean;
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
    yearsOfExperience: 0,
    availableDays: [],
    availableTimeSlots: '',
    is24x7Available: false,
    emergencyOrOnCallAvailable: false,
    termsAgreed: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'yearsOfExperience') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (arrayName: keyof Pick<ServiceFormData, 'listOfServicesOffered' | 'availableDays'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(value)
        ? prev[arrayName].filter(item => item !== value)
        : [...prev[arrayName], value]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullNameOrBusinessName && formData.primaryPhoneNumber && formData.emailAddress);
      case 2:
        return !!(formData.typeOfService && formData.listOfServicesOffered.length > 0 && formData.pricingMethod);
      case 3:
        return !!(formData.availableDays.length > 0 && formData.availableTimeSlots && formData.termsAgreed);
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

    try {
      const response = await fetch('http://localhost:2000/api/addService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
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

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
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
      yearsOfExperience: 0,
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
          </div>
          <button onClick={resetForm} className={styles.newRegistrationButton}>
            Register Another Service
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
                  <label htmlFor="fullNameOrBusinessName" className={styles.serviceLabel}>Full Name or Business Name *</label>
                  <input
                    type="text"
                    id="fullNameOrBusinessName"
                    name="fullNameOrBusinessName"
                    value={formData.fullNameOrBusinessName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter business name or your full name"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="ownerName" className={styles.serviceLabel}>Owner Name</label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter owner name"
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="cnicOrNationalId" className={styles.serviceLabel}>CNIC/National ID</label>
                  <input
                    type="text"
                    id="cnicOrNationalId"
                    name="cnicOrNationalId"
                    value={formData.cnicOrNationalId}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter your CNIC or National ID"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="businessRegistrationNumber" className={styles.serviceLabel}>Business Registration Number</label>
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
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="primaryPhoneNumber" className={styles.serviceLabel}>Primary Phone Number *</label>
                  <input
                    type="tel"
                    id="primaryPhoneNumber"
                    name="primaryPhoneNumber"
                    value={formData.primaryPhoneNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter primary phone number"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="alternatePhoneNumber" className={styles.serviceLabel}>Alternate Phone Number</label>
                  <input
                    type="tel"
                    id="alternatePhoneNumber"
                    name="alternatePhoneNumber"
                    value={formData.alternatePhoneNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter alternate phone number"
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="emailAddress" className={styles.serviceLabel}>Email Address *</label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="whatsappNumber" className={styles.serviceLabel}>WhatsApp Number</label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter WhatsApp number"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="websiteUrl" className={styles.serviceLabel}>Website URL</label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter website URL (e.g., https://example.com)"
                />
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 2: Service Details</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="typeOfService" className={styles.serviceLabel}>Type of Service *</label>
                  <select
                    id="typeOfService"
                    name="typeOfService"
                    value={formData.typeOfService}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Service Type</option>
                    {serviceTypes.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="pricingMethod" className={styles.serviceLabel}>Pricing Method *</label>
                  <select
                    id="pricingMethod"
                    name="pricingMethod"
                    value={formData.pricingMethod}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Pricing Method</option>
                    {pricingMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.serviceLabel}>Services Offered *</label>
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
              </div>

              <div className={styles.field}>
                <label htmlFor="yearsOfExperience" className={styles.serviceLabel}>Years of Experience</label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className={styles.input}
                  min="0"
                  max="50"
                  placeholder="Enter years of experience"
                />
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Step 3: Availability & Terms</h2>
              
              <div className={styles.field}>
                <label className={styles.serviceLabel}>Available Days *</label>
                <div className={styles.checkboxRow}>
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
              </div>

              <div className={styles.field}>
                <label htmlFor="availableTimeSlots" className={styles.serviceLabel}>Available Time Slots *</label>
                <input
                  type="text"
                  id="availableTimeSlots"
                  name="availableTimeSlots"
                  value={formData.availableTimeSlots}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., 9:00 AM - 6:00 PM"
                  required
                />
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
                    required
                  />
                  I agree to the terms and conditions *
                </label>
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