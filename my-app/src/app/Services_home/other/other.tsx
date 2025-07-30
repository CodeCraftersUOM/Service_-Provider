'use client';

import React, { useState } from 'react';
import styles from './other.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
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

const ServiceForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<FormData>({
    fullNameOrBusinessName: '', ownerName: '', cnicOrNationalId: '', businessRegistrationNumber: '',
    primaryPhoneNumber: '', alternatePhoneNumber: '', emailAddress: '', whatsappNumber: '',
    websiteUrl: '', typeOfService: '', listOfServicesOffered: [], pricingMethod: '',
    yearsOfExperience: '', availableDays: [], availableTimeSlots: '',
    is24x7Available: false, emergencyOrOnCallAvailable: false, termsAgreed: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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

  // ✅ CONSOLIDATED VALIDATION with same patterns
  const validate = () => {
    const e: {[key: string]: string} = {};
    
    // Required fields
    if (!data.fullNameOrBusinessName.trim()) e.fullNameOrBusinessName = "Name/Business name required";
    if (!data.emailAddress.trim()) e.emailAddress = "Email required";
    if (!data.typeOfService) e.typeOfService = "Service type required";
    if (!data.listOfServicesOffered.length) e.listOfServicesOffered = "Select at least one service";
    if (!data.pricingMethod) e.pricingMethod = "Pricing method required";
    if (!data.availableDays.length) e.availableDays = "Select available days";
    if (!data.availableTimeSlots.trim()) e.availableTimeSlots = "Time slots required";
    if (!data.termsAgreed) e.termsAgreed = "Must agree to terms";

    // ✅ Phone validation (10 digits, specific patterns)
    const validatePhone = (phone: string) => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length === 10 && /^(07[0-9]{8}|0[1-9][0-9]{8})$/.test(cleaned);
    };

    if (!data.primaryPhoneNumber.trim()) {
      e.primaryPhoneNumber = "Primary phone required";
    } else if (!validatePhone(data.primaryPhoneNumber)) {
      e.primaryPhoneNumber = "Invalid phone number (07XXXXXXXX for mobile, 0XXXXXXXXX for landline)";
    }

    // Optional phone validations
    if (data.alternatePhoneNumber.trim() && !validatePhone(data.alternatePhoneNumber)) {
      e.alternatePhoneNumber = "Invalid alternate phone number";
    }

    if (data.whatsappNumber.trim() && !validatePhone(data.whatsappNumber)) {
      e.whatsappNumber = "Invalid WhatsApp number";
    }

    // Email validation
    if (data.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress)) {
      e.emailAddress = "Invalid email format";
    }

    // ✅ Business registration validation (optional)
    if (data.businessRegistrationNumber.trim()) {
      const reg = data.businessRegistrationNumber.trim().toUpperCase();
      if (!/^(PV|HS|SP|PQ)[0-9]+$|^[0-9]+$/.test(reg)) {
        e.businessRegistrationNumber = "Invalid business registration format (PV12345, HS12345, SP12345, PQ12345, or numeric)";
      }
    }

    // Other validations
    if (data.fullNameOrBusinessName && (data.fullNameOrBusinessName.length < 2 || data.fullNameOrBusinessName.length > 100)) {
      e.fullNameOrBusinessName = "Name: 2-100 characters";
    }

    if (data.ownerName && (data.ownerName.length < 2 || data.ownerName.length > 50)) {
      e.ownerName = "Owner name: 2-50 characters";
    }

    if (data.cnicOrNationalId && (data.cnicOrNationalId.length < 5 || data.cnicOrNationalId.length > 20)) {
      e.cnicOrNationalId = "ID: 5-20 characters";
    }

    if (data.websiteUrl && data.websiteUrl.trim()) {
      try { new URL(data.websiteUrl); } catch { e.websiteUrl = "Invalid website URL"; }
    }

    if (data.yearsOfExperience && (isNaN(+data.yearsOfExperience) || +data.yearsOfExperience < 0 || +data.yearsOfExperience > 100)) {
      e.yearsOfExperience = "Invalid years (0-100)";
    }

    if (data.availableTimeSlots && (data.availableTimeSlots.length < 5 || data.availableTimeSlots.length > 100)) {
      e.availableTimeSlots = "Time slots: 5-100 characters";
    }

    if (data.listOfServicesOffered.length > 15) {
      e.listOfServicesOffered = "Maximum 15 services";
    }

    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    setData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleArray = (field: 'listOfServicesOffered' | 'availableDays', value: string) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const next = () => {
    const stepErrors = validate();
    const stepFields = {
      1: ['fullNameOrBusinessName', 'ownerName', 'cnicOrNationalId', 'businessRegistrationNumber', 'primaryPhoneNumber', 'alternatePhoneNumber', 'emailAddress', 'whatsappNumber', 'websiteUrl'],
      2: ['typeOfService', 'listOfServicesOffered', 'pricingMethod', 'yearsOfExperience']
    };
    
    const currentErrors = Object.keys(stepErrors).filter(key => 
      stepFields[step as keyof typeof stepFields]?.includes(key)
    );
    
    if (currentErrors.length === 0) {
      setStep(prev => Math.min(prev + 1, 3));
      setMessage('');
    } else {
      const filtered: {[key: string]: string} = {};
      currentErrors.forEach(key => filtered[key] = stepErrors[key]);
      setErrors(filtered);
      setMessage('Fix errors below');
    }
  };

  const submit = async () => {
    const allErrors = validate();
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setMessage('Fix all errors before submitting');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ...data,
        yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : 0,
        availability: {
          availableDays: data.availableDays,
          availableTimeSlots: data.availableTimeSlots,
          is24x7Available: data.is24x7Available,
          emergencyOrOnCallAvailable: data.emergencyOrOnCallAvailable,
        }
      };
      
      console.log('Sending data:', requestData); // Debug log
      
      const response = await fetch('http://localhost:2000/api/other-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        const result = await response.json();
        console.log('Error response:', result); // Debug log
        if (result.errors && Array.isArray(result.errors)) {
          // Handle validation errors
          const errorMessages = result.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
          setMessage(`Validation errors: ${errorMessages}`);
        } else {
          setMessage(`Error: ${result.message || result.error || 'Registration failed'}`);
        }
      }
    } catch (error) {
      console.error('Network error:', error); // Debug log
      setMessage('Error: Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setStep(1);
    setErrors({});
    setMessage('');
    setData({
      fullNameOrBusinessName: '', ownerName: '', cnicOrNationalId: '', businessRegistrationNumber: '',
      primaryPhoneNumber: '', alternatePhoneNumber: '', emailAddress: '', whatsappNumber: '',
      websiteUrl: '', typeOfService: '', listOfServicesOffered: [], pricingMethod: '',
      yearsOfExperience: '', availableDays: [], availableTimeSlots: '',
      is24x7Available: false, emergencyOrOnCallAvailable: false, termsAgreed: false
    });
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Service Successfully Registered!</h1>
          <p className={styles.successMessage}>
            <strong>{data.fullNameOrBusinessName}</strong> has been registered successfully.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Business:</strong> {data.fullNameOrBusinessName}</p>
            <p><strong>Service Type:</strong> {data.typeOfService}</p>
            <p><strong>Services:</strong> {data.listOfServicesOffered.length} offered</p>
            <p><strong>Experience:</strong> {data.yearsOfExperience || 0} years</p>
          </div>
          <button onClick={reset} className={styles.newRegistrationButton}>Register Another</button>
          <button onClick={() => router.push('/Dashboard')} className={styles.newRegistrationButton}>Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* Progress */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
          <div className={styles.stepIndicators}>
            {[1, 2, 3].map(s => (
              <div key={s} className={`${styles.stepIndicator} ${step >= s ? styles.active : ''}`}>
                <div className={styles.stepNumber}>{s}</div>
                <div className={styles.stepLabel}>{s === 1 ? 'Business' : s === 2 ? 'Services' : 'Availability'}</div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Service Registration</h1>
        {message && <div className={`${styles.message} ${message.includes('Error') || message.includes('failed') ? styles.error : styles.warning}`}>{message}</div>}

        <div className={styles.form}>
          {/* Step 1: Business Information */}
          {step === 1 && (
            <div className={styles.step}>
              <h2>Business Information</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Full Name or Business Name *</label>
                  <input name="fullNameOrBusinessName" value={data.fullNameOrBusinessName} onChange={handleChange}
                         className={`${styles.input} ${errors.fullNameOrBusinessName ? styles.inputError : ''}`}
                         placeholder="Business name or your full name" />
                  {errors.fullNameOrBusinessName && <span className={styles.fieldError}>{errors.fullNameOrBusinessName}</span>}
                </div>
                <div className={styles.field}>
                  <label>Owner Name <small>(Optional)</small></label>
                  <input name="ownerName" value={data.ownerName} onChange={handleChange}
                         className={`${styles.input} ${errors.ownerName ? styles.inputError : ''}`}
                         placeholder="Owner name" />
                  {errors.ownerName && <span className={styles.fieldError}>{errors.ownerName}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>CNIC/National ID <small>(Optional)</small></label>
                  <input name="cnicOrNationalId" value={data.cnicOrNationalId} onChange={handleChange}
                         className={`${styles.input} ${errors.cnicOrNationalId ? styles.inputError : ''}`}
                         placeholder="CNIC or National ID" />
                  {errors.cnicOrNationalId && <span className={styles.fieldError}>{errors.cnicOrNationalId}</span>}
                </div>
                <div className={styles.field}>
                  <label>Business Registration <small>(Optional - PV12345, HS12345, etc.)</small></label>
                  <input name="businessRegistrationNumber" value={data.businessRegistrationNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.businessRegistrationNumber ? styles.inputError : ''}`}
                         placeholder="Business registration number" />
                  {errors.businessRegistrationNumber && <span className={styles.fieldError}>{errors.businessRegistrationNumber}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Primary Phone * <small>(10 digits)</small></label>
                  <input name="primaryPhoneNumber" value={data.primaryPhoneNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.primaryPhoneNumber ? styles.inputError : ''}`}
                         placeholder="0771234567" />
                  {errors.primaryPhoneNumber && <span className={styles.fieldError}>{errors.primaryPhoneNumber}</span>}
                </div>
                <div className={styles.field}>
                  <label>Alternate Phone <small>(Optional, 10 digits)</small></label>
                  <input name="alternatePhoneNumber" value={data.alternatePhoneNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.alternatePhoneNumber ? styles.inputError : ''}`}
                         placeholder="0112345678" />
                  {errors.alternatePhoneNumber && <span className={styles.fieldError}>{errors.alternatePhoneNumber}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Email Address *</label>
                  <input type="email" name="emailAddress" value={data.emailAddress} onChange={handleChange}
                         className={`${styles.input} ${errors.emailAddress ? styles.inputError : ''}`}
                         placeholder="email@example.com" />
                  {errors.emailAddress && <span className={styles.fieldError}>{errors.emailAddress}</span>}
                </div>
                <div className={styles.field}>
                  <label>WhatsApp Number <small>(Optional, 10 digits)</small></label>
                  <input name="whatsappNumber" value={data.whatsappNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.whatsappNumber ? styles.inputError : ''}`}
                         placeholder="0771234567" />
                  {errors.whatsappNumber && <span className={styles.fieldError}>{errors.whatsappNumber}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label>Website URL <small>(Optional)</small></label>
                <input type="url" name="websiteUrl" value={data.websiteUrl} onChange={handleChange}
                       className={`${styles.input} ${errors.websiteUrl ? styles.inputError : ''}`}
                       placeholder="https://example.com" />
                {errors.websiteUrl && <span className={styles.fieldError}>{errors.websiteUrl}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {step === 2 && (
            <div className={styles.step}>
              <h2>Service Details</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Type of Service *</label>
                  <select name="typeOfService" value={data.typeOfService} onChange={handleChange}
                          className={`${styles.select} ${errors.typeOfService ? styles.inputError : ''}`}>
                    <option value="">Select Service Type</option>
                    {serviceTypes.map(service => <option key={service} value={service}>{service}</option>)}
                  </select>
                  {errors.typeOfService && <span className={styles.fieldError}>{errors.typeOfService}</span>}
                </div>
                <div className={styles.field}>
                  <label>Pricing Method *</label>
                  <select name="pricingMethod" value={data.pricingMethod} onChange={handleChange}
                          className={`${styles.select} ${errors.pricingMethod ? styles.inputError : ''}`}>
                    <option value="">Select Pricing Method</option>
                    {pricingMethods.map(method => <option key={method} value={method}>{method}</option>)}
                  </select>
                  {errors.pricingMethod && <span className={styles.fieldError}>{errors.pricingMethod}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label>Services Offered * (Select 1-15 services)</label>
                <div className={styles.checkboxGrid}>
                  {commonServices.map(service => (
                    <label key={service} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={data.listOfServicesOffered.includes(service)}
                             onChange={() => toggleArray('listOfServicesOffered', service)} />
                      {service}
                    </label>
                  ))}
                </div>
                {errors.listOfServicesOffered && <span className={styles.fieldError}>{errors.listOfServicesOffered}</span>}
              </div>

              <div className={styles.field}>
                <label>Years of Experience <small>(Optional)</small></label>
                <input type="number" name="yearsOfExperience" value={data.yearsOfExperience} onChange={handleChange}
                       className={`${styles.input} ${errors.yearsOfExperience ? styles.inputError : ''}`}
                       min="0" max="100" placeholder="Years of experience" />
                {errors.yearsOfExperience && <span className={styles.fieldError}>{errors.yearsOfExperience}</span>}
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <div className={styles.step}>
              <h2>Availability & Terms</h2>
              
              <div className={styles.field}>
                <label>Available Days * (Select at least one)</label>
                <div className={styles.checkboxGrid}>
                  {weekDays.map(day => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={data.availableDays.includes(day)}
                             onChange={() => toggleArray('availableDays', day)} />
                      {day.slice(0, 3)}
                    </label>
                  ))}
                </div>
                {errors.availableDays && <span className={styles.fieldError}>{errors.availableDays}</span>}
              </div>

              <div className={styles.field}>
                <label>Available Time Slots *</label>
                <input name="availableTimeSlots" value={data.availableTimeSlots} onChange={handleChange}
                       className={`${styles.input} ${errors.availableTimeSlots ? styles.inputError : ''}`}
                       placeholder="e.g., 9:00 AM - 6:00 PM" />
                {errors.availableTimeSlots && <span className={styles.fieldError}>{errors.availableTimeSlots}</span>}
              </div>

              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="is24x7Available" checked={data.is24x7Available} onChange={handleChange} />
                  Available 24/7
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="emergencyOrOnCallAvailable" checked={data.emergencyOrOnCallAvailable} onChange={handleChange} />
                  Emergency/On-call Available
                </label>
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="termsAgreed" checked={data.termsAgreed} onChange={handleChange} />
                  I agree to the terms and conditions *
                </label>
                {errors.termsAgreed && <span className={styles.fieldError}>{errors.termsAgreed}</span>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.buttonContainer}>
            {step > 1 && <button onClick={() => setStep(step - 1)} className={styles.prevButton}>Previous</button>}
            {step < 3 ? (
              <button onClick={next} className={styles.nextButton}>Next</button>
            ) : (
              <button onClick={submit} disabled={loading} className={styles.submitButton}>
                {loading ? 'Registering...' : 'Register Service'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;