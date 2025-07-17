'use client';

import React, { useState } from 'react';
import styles from './Communication.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
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

const CommunicationService: React.FC = () => {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<FormData>({
    serviceTypesOffered: '', serviceCoverageArea: '', paymentMethods: '', currentPromotions: '',
    companyName: '', contactPerson: '', phoneNumber: '', emailAddress: '',
    businessRegistration: '', yearsInBusiness: '', specialFeatures: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online Payment', 'Mobile Payment'];

  // ✅ CONSOLIDATED VALIDATION with Sri Lankan requirements
  const validate = () => {
    const e: {[key: string]: string} = {};
    
    // Required fields
    if (!data.companyName.trim()) e.companyName = "Company name required";
    if (!data.contactPerson.trim()) e.contactPerson = "Contact person required";
    if (!data.emailAddress.trim()) e.emailAddress = "Email required";
    if (!data.businessRegistration.trim()) e.businessRegistration = "Business registration required";
    if (!data.serviceTypesOffered.trim()) e.serviceTypesOffered = "Service types required";
    if (!data.serviceCoverageArea.trim()) e.serviceCoverageArea = "Coverage area required";
    if (!data.specialFeatures.trim()) e.specialFeatures = "Special features required";
    if (!data.paymentMethods) e.paymentMethods = "Payment method required";
    if (!data.currentPromotions.trim()) e.currentPromotions = "Current promotions required";

    // ✅ Sri Lankan phone validation (10 digits, specific patterns)
    if (!data.phoneNumber.trim()) {
      e.phoneNumber = "Phone number required";
    } else {
      const phone = data.phoneNumber.replace(/\D/g, '');
      if (phone.length !== 10) {
        e.phoneNumber = "Must be exactly 10 digits";
      } else if (!/^(07[0-9]{8}|0[1-9][0-9]{8})$/.test(phone)) {
        e.phoneNumber = "Invalid Sri Lankan phone (07XXXXXXXX for mobile, 0XXXXXXXXX for landline)";
      }
    }

    // Email validation
    if (data.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress)) {
      e.emailAddress = "Invalid email format";
    }

    // ✅ Sri Lankan business registration validation
    if (data.businessRegistration.trim()) {
      const reg = data.businessRegistration.trim().toUpperCase();
      if (!/^(PV|HS|SP|PQ)[0-9]+$|^[0-9]+$/.test(reg)) {
        e.businessRegistration = "Invalid Sri Lankan business registration (PV12345, HS12345, SP12345, PQ12345, or numeric)";
      }
    }

    // Company name validation
    if (data.companyName && (data.companyName.length < 2 || data.companyName.length > 100)) {
      e.companyName = "Company name: 2-100 characters";
    }

    // Contact person validation
    if (data.contactPerson && (data.contactPerson.length < 2 || data.contactPerson.length > 50)) {
      e.contactPerson = "Contact person: 2-50 characters";
    }

    // Years in business validation
    if (data.yearsInBusiness !== '' && (isNaN(+data.yearsInBusiness) || +data.yearsInBusiness < 0 || +data.yearsInBusiness > 100)) {
      e.yearsInBusiness = "Invalid years in business (0-100)";
    }

    // Service types validation
    if (data.serviceTypesOffered && data.serviceTypesOffered.length < 5) {
      e.serviceTypesOffered = "Service types must be at least 5 characters";
    }

    // Coverage area validation
    if (data.serviceCoverageArea && data.serviceCoverageArea.length < 3) {
      e.serviceCoverageArea = "Coverage area must be at least 3 characters";
    }

    // Special features validation
    if (data.specialFeatures && (data.specialFeatures.length < 10 || data.specialFeatures.length > 500)) {
      e.specialFeatures = "Special features: 10-500 characters";
    }

    // Promotions validation
    if (data.currentPromotions && (data.currentPromotions.length < 10 || data.currentPromotions.length > 500)) {
      e.currentPromotions = "Promotions: 10-500 characters";
    }

    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    
    if (name === 'yearsInBusiness') {
      setData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value) }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
    setMessage('');
  };

  const next = () => {
    const stepErrors = validate();
    const stepFields = {
      1: ['companyName', 'contactPerson', 'phoneNumber', 'emailAddress', 'businessRegistration', 'yearsInBusiness'],
      2: ['serviceTypesOffered', 'serviceCoverageArea', 'specialFeatures']
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
    const payload = {
      ...data,
      serviceTypesOffered: data.serviceTypesOffered.split(',').map(item => item.trim()),
      serviceCoverageArea: data.serviceCoverageArea.split(',').map(item => item.trim()),
      paymentMethods: [data.paymentMethods],
    };

    try {
      const res = await fetch('http://localhost:2000/api/addCommuni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const result = await res.json();
        setMessage(`Error: ${result?.message || 'Registration failed'}`);
      }
    } catch {
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
      serviceTypesOffered: '', serviceCoverageArea: '', paymentMethods: '', currentPromotions: '',
      companyName: '', contactPerson: '', phoneNumber: '', emailAddress: '',
      businessRegistration: '', yearsInBusiness: '', specialFeatures: ''
    });
  };

  const Field = ({ name, label, type = 'text', required = false, placeholder = '', options = [], rows = 0 }: any) => (
    <div className={styles.field}>
      <label className={styles.label}>
        {label} {required && '*'}
        {name === 'phoneNumber' && <span style={{fontSize: '0.8em', color: '#666'}}> (10 digits)</span>}
        {name === 'businessRegistration' && <span style={{fontSize: '0.8em', color: '#666'}}> (PV12345, HS12345, etc.)</span>}
      </label>
      {type === 'select' ? (
        <select name={name} value={data[name as keyof FormData] as string} onChange={handleChange}
                className={`${styles.select} ${errors[name] ? styles.inputError : ''}`}>
          <option value="">Select {label}</option>
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : rows > 0 ? (
        <textarea name={name} value={data[name as keyof FormData] as string} onChange={handleChange}
                  className={`${styles.textarea} ${errors[name] ? styles.inputError : ''}`}
                  rows={rows} placeholder={placeholder} />
      ) : (
        <input type={type} name={name} value={data[name as keyof FormData] as string} onChange={handleChange}
               className={`${styles.input} ${errors[name] ? styles.inputError : ''}`} placeholder={placeholder} />
      )}
      {errors[name] && <p className={styles.fieldError}>{errors[name]}</p>}
    </div>
  );

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Communication Service Registered!</h1>
          <p className={styles.successMessage}>
            <strong>{data.companyName}</strong> has been registered successfully.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Company:</strong> {data.companyName}</p>
            <p><strong>Contact:</strong> {data.contactPerson}</p>
            <p><strong>Phone:</strong> {data.phoneNumber}</p>
            <p><strong>Services:</strong> {data.serviceTypesOffered}</p>
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
                <div className={styles.stepLabel}>{s === 1 ? 'Company' : s === 2 ? 'Services' : 'Terms'}</div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Communication Services Registration</h1>
        {message && <div className={`${styles.message} ${message.includes('Error') || message.includes('failed') ? styles.error : styles.warning}`}>{message}</div>}

        <div className={styles.form}>
          {/* Step 1: Company Information */}
          {step === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Company Information</h2>
              
              <div className={styles.row}>
                <Field name="companyName" label="Company Name" required placeholder="Your company name" />
                <Field name="contactPerson" label="Contact Person" required placeholder="Primary contact person" />
              </div>
              
              <div className={styles.row}>
                <Field name="phoneNumber" label="Phone Number" type="tel" required 
                       placeholder="Sri Lankan phone (10 digits)" />
                <Field name="emailAddress" label="Email Address" type="email" required 
                       placeholder="company@email.com" />
              </div>
              
              <div className={styles.row}>
                <Field name="businessRegistration" label="Business Registration" required 
                       placeholder="Sri Lankan business registration" />
                <Field name="yearsInBusiness" label="Years in Business (Optional)" type="number" 
                       placeholder="Years operating" />
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {step === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Service Details</h2>
              
              <Field name="serviceTypesOffered" label="Service Types Offered" required 
                     placeholder="Internet, Mobile, TV services, etc. (comma-separated)" />
              
              <Field name="serviceCoverageArea" label="Service Coverage Area" required 
                     placeholder="Cities, regions covered (comma-separated)" />
              
              <Field name="specialFeatures" label="Special Features" required rows={3}
                     placeholder="Unique features, benefits, or services offered (10-500 characters)" />
            </div>
          )}

          {/* Step 3: Business Terms */}
          {step === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Business Terms</h2>
              
              <Field name="paymentMethods" label="Payment Method" type="select" required options={paymentMethods} />
              
              <Field name="currentPromotions" label="Current Promotions" required rows={4}
                     placeholder="Special offers, discounts, or bundles available (10-500 characters)" />
            </div>
          )}

          {/* Navigation */}
          <div className={styles.buttonContainer}>
            {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className={styles.prevButton}>Previous</button>}
            {step < 3 ? (
              <button type="button" onClick={next} className={styles.nextButton}>Next</button>
            ) : (
              <button type="button" onClick={submit} disabled={loading} className={styles.submitButton}>
                {loading ? 'Registering...' : 'Register Service'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationService;