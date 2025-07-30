'use client';

import React, { useState } from 'react';
import styles from './house.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
  businessName: string;
  ownerFullName: string;
  contactPhone: string;
  contactEmail: string;
  alternatePhone: string;
  websiteUrl: string;
  businessDescription: string;
  serviceTypes: string[];
  pricingMethod: string;
  serviceArea: string;
  addressOrLandmark: string;
  googleMapsLink: string;
  daysAvailable: string[];
  timeSlot: string;
  emergencyServiceAvailable: boolean;
  businessRegistrationNumber: string;
  licensesCertificates: string;
  termsAgreed: boolean;
}

const HousekeepingForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<FormData>({
    businessName: '', ownerFullName: '', contactPhone: '', contactEmail: '', alternatePhone: '',
    websiteUrl: '', businessDescription: '', serviceTypes: [], pricingMethod: '', serviceArea: '',
    addressOrLandmark: '', googleMapsLink: '', daysAvailable: [], timeSlot: '',
    emergencyServiceAvailable: false, businessRegistrationNumber: '', licensesCertificates: '', termsAgreed: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const serviceTypes = [
    'Housekeeping (Home/Office)', 'Deep Cleaning', 'Carpet Cleaning', 'Window Cleaning',
    'Laundry & Ironing', 'Dry Cleaning', 'Sofa/Chair Cleaning', 'Disinfection & Sanitization'
  ];
  const pricingMethods = ['Per Hour', 'Per Square Foot', 'Per Visit', 'Custom Quote'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // ✅ CONSOLIDATED VALIDATION with Sri Lankan requirements
  const validate = () => {
    const e: {[key: string]: string} = {};
    
    // Required fields
    if (!data.businessName.trim()) e.businessName = "Business name required";
    if (!data.ownerFullName.trim()) e.ownerFullName = "Owner name required";
    if (!data.contactEmail.trim()) e.contactEmail = "Email required";
    if (!data.serviceTypes.length) e.serviceTypes = "Select at least one service";
    if (!data.pricingMethod) e.pricingMethod = "Pricing method required";
    if (!data.serviceArea.trim()) e.serviceArea = "Service area required";
    if (!data.daysAvailable.length) e.daysAvailable = "Select available days";
    if (!data.timeSlot.trim()) e.timeSlot = "Time slot required";
    if (!data.termsAgreed) e.termsAgreed = "Must agree to terms";

    // ✅ Phone validation (10 digits, specific patterns)
    const validatePhone = (phone: string) => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length === 10 && /^(07[0-9]{8}|0[1-9][0-9]{8})$/.test(cleaned);
    };

    if (!data.contactPhone.trim()) {
      e.contactPhone = "Contact phone required";
    } else if (!validatePhone(data.contactPhone)) {
      e.contactPhone = "Invalid phone number (07XXXXXXXX for mobile, 0XXXXXXXXX for landline)";
    }

    // ✅ Alternate phone validation (optional but must be valid if provided)
    if (data.alternatePhone.trim() && !validatePhone(data.alternatePhone)) {
      e.alternatePhone = "Invalid alternate phone number";
    }

    // Email validation
    if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      e.contactEmail = "Invalid email format";
    }

    // ✅ Google Maps link validation (must be Google Maps URL)
    if (data.googleMapsLink.trim()) {
      try {
        const url = new URL(data.googleMapsLink);
        const validDomains = ['maps.google.com', 'maps.google.', 'goo.gl', 'maps.app.goo.gl'];
        if (!validDomains.some(domain => url.hostname.includes(domain) || url.href.includes('maps.google'))) {
          e.googleMapsLink = "Must be a valid Google Maps link (maps.google.com, goo.gl/maps, or maps.app.goo.gl)";
        }
      } catch {
        e.googleMapsLink = "Invalid Google Maps URL format";
      }
    }

    // ✅ Business registration validation (optional)
    if (data.businessRegistrationNumber.trim()) {
      const reg = data.businessRegistrationNumber.trim().toUpperCase();
      if (!/^(PV|HS|SP|PQ)[0-9]+$|^[0-9]+$/.test(reg)) {
        e.businessRegistrationNumber = "Invalid business registration format (PV12345, HS12345, SP12345, PQ12345, or numeric)";
      }
    }

    // Optional validations
    if (data.websiteUrl && data.websiteUrl.trim()) {
      try { new URL(data.websiteUrl); } catch { e.websiteUrl = "Invalid website URL"; }
    }

    // Length validations
    if (data.businessName && (data.businessName.length < 2 || data.businessName.length > 100)) {
      e.businessName = "Business name: 2-100 characters";
    }

    if (data.ownerFullName && (data.ownerFullName.length < 2 || data.ownerFullName.length > 50)) {
      e.ownerFullName = "Owner name: 2-50 characters";
    }

    if (data.businessDescription && data.businessDescription.length > 1000) {
      e.businessDescription = "Description max 1000 characters";
    }

    if (data.serviceArea && (data.serviceArea.length < 2 || data.serviceArea.length > 100)) {
      e.serviceArea = "Service area: 2-100 characters";
    }

    if (data.addressOrLandmark && data.addressOrLandmark.length > 200) {
      e.addressOrLandmark = "Address max 200 characters";
    }

    if (data.timeSlot && (data.timeSlot.length < 5 || data.timeSlot.length > 100)) {
      e.timeSlot = "Time slot: 5-100 characters";
    }

    if (data.serviceTypes.length > 8) {
      e.serviceTypes = "Maximum 8 services allowed";
    }

    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    setData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleArray = (field: 'serviceTypes' | 'daysAvailable', value: string) => {
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
      1: ['businessName', 'ownerFullName', 'contactPhone', 'contactEmail', 'alternatePhone', 'websiteUrl', 'businessDescription'],
      2: ['serviceTypes', 'pricingMethod', 'serviceArea', 'addressOrLandmark', 'googleMapsLink']
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
      const response = await fetch('http://localhost:2000/api/houeskeeping/addHousekeeping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        const result = await response.json();
        setMessage(`Error: ${result.message || 'Registration failed'}`);
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
      businessName: '', ownerFullName: '', contactPhone: '', contactEmail: '', alternatePhone: '',
      websiteUrl: '', businessDescription: '', serviceTypes: [], pricingMethod: '', serviceArea: '',
      addressOrLandmark: '', googleMapsLink: '', daysAvailable: [], timeSlot: '',
      emergencyServiceAvailable: false, businessRegistrationNumber: '', licensesCertificates: '', termsAgreed: false
    });
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Housekeeping Service Registered!</h1>
          <p className={styles.successMessage}>
            <strong>{data.businessName}</strong> has been registered successfully.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Business:</strong> {data.businessName}</p>
            <p><strong>Owner:</strong> {data.ownerFullName}</p>
            <p><strong>Services:</strong> {data.serviceTypes.length} selected</p>
            <p><strong>Area:</strong> {data.serviceArea}</p>
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
                <div className={styles.stepLabel}>{s === 1 ? 'Basic' : s === 2 ? 'Services' : 'Legal'}</div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Housekeeping Service Registration</h1>
        {message && <div className={`${styles.message} ${message.includes('Error') || message.includes('failed') ? styles.error : styles.warning}`}>{message}</div>}

        <div className={styles.form}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className={styles.step}>
              <h2>Basic Information</h2>
              
              <div className={styles.field}>
                <label>Business Name *</label>
                <input name="businessName" value={data.businessName} onChange={handleChange}
                       className={`${styles.input} ${errors.businessName ? styles.inputError : ''}`}
                       placeholder="Your business name" />
                {errors.businessName && <span className={styles.fieldError}>{errors.businessName}</span>}
              </div>

              <div className={styles.field}>
                <label>Owner Full Name *</label>
                <input name="ownerFullName" value={data.ownerFullName} onChange={handleChange}
                       className={`${styles.input} ${errors.ownerFullName ? styles.inputError : ''}`}
                       placeholder="Owner's full name" />
                {errors.ownerFullName && <span className={styles.fieldError}>{errors.ownerFullName}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Contact Phone * <small>(10 digits)</small></label>
                  <input name="contactPhone" value={data.contactPhone} onChange={handleChange}
                         className={`${styles.input} ${errors.contactPhone ? styles.inputError : ''}`}
                         placeholder="0771234567" />
                  {errors.contactPhone && <span className={styles.fieldError}>{errors.contactPhone}</span>}
                </div>
                <div className={styles.field}>
                  <label>Alternate Phone <small>(Optional, 10 digits)</small></label>
                  <input name="alternatePhone" value={data.alternatePhone} onChange={handleChange}
                         className={`${styles.input} ${errors.alternatePhone ? styles.inputError : ''}`}
                         placeholder="0112345678" />
                  {errors.alternatePhone && <span className={styles.fieldError}>{errors.alternatePhone}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label>Contact Email *</label>
                <input type="email" name="contactEmail" value={data.contactEmail} onChange={handleChange}
                       className={`${styles.input} ${errors.contactEmail ? styles.inputError : ''}`}
                       placeholder="business@email.com" />
                {errors.contactEmail && <span className={styles.fieldError}>{errors.contactEmail}</span>}
              </div>

              <div className={styles.field}>
                <label>Website URL <small>(Optional)</small></label>
                <input type="url" name="websiteUrl" value={data.websiteUrl} onChange={handleChange}
                       className={`${styles.input} ${errors.websiteUrl ? styles.inputError : ''}`}
                       placeholder="https://yourwebsite.com" />
                {errors.websiteUrl && <span className={styles.fieldError}>{errors.websiteUrl}</span>}
              </div>

              <div className={styles.field}>
                <label>Business Description <small>(Optional, max 1000 chars)</small></label>
                <textarea name="businessDescription" value={data.businessDescription} onChange={handleChange}
                          className={`${styles.textarea} ${errors.businessDescription ? styles.inputError : ''}`}
                          rows={3} placeholder="Describe your business and services" />
                {errors.businessDescription && <span className={styles.fieldError}>{errors.businessDescription}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {step === 2 && (
            <div className={styles.step}>
              <h2>Service Details</h2>
              
              <div className={styles.field}>
                <label>Service Types * (Select 1-8 services)</label>
                <div className={styles.checkboxGrid}>
                  {serviceTypes.map(service => (
                    <label key={service} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={data.serviceTypes.includes(service)}
                             onChange={() => toggleArray('serviceTypes', service)} />
                      {service}
                    </label>
                  ))}
                </div>
                {errors.serviceTypes && <span className={styles.fieldError}>{errors.serviceTypes}</span>}
              </div>

              <div className={styles.field}>
                <label>Pricing Method *</label>
                <select name="pricingMethod" value={data.pricingMethod} onChange={handleChange}
                        className={`${styles.select} ${errors.pricingMethod ? styles.inputError : ''}`}>
                  <option value="">Select pricing method</option>
                  {pricingMethods.map(method => <option key={method} value={method}>{method}</option>)}
                </select>
                {errors.pricingMethod && <span className={styles.fieldError}>{errors.pricingMethod}</span>}
              </div>

              <div className={styles.field}>
                <label>Service Area *</label>
                <input name="serviceArea" value={data.serviceArea} onChange={handleChange}
                       className={`${styles.input} ${errors.serviceArea ? styles.inputError : ''}`}
                       placeholder="e.g., Colombo, Gampaha, Kandy" />
                {errors.serviceArea && <span className={styles.fieldError}>{errors.serviceArea}</span>}
              </div>

              <div className={styles.field}>
                <label>Address or Landmark <small>(Optional)</small></label>
                <input name="addressOrLandmark" value={data.addressOrLandmark} onChange={handleChange}
                       className={`${styles.input} ${errors.addressOrLandmark ? styles.inputError : ''}`}
                       placeholder="Business address or nearby landmark" />
                {errors.addressOrLandmark && <span className={styles.fieldError}>{errors.addressOrLandmark}</span>}
              </div>

              <div className={styles.field}>
                <label>Google Maps Link <small>(Optional - Google Maps only)</small></label>
                <input type="url" name="googleMapsLink" value={data.googleMapsLink} onChange={handleChange}
                       className={`${styles.input} ${errors.googleMapsLink ? styles.inputError : ''}`}
                       placeholder="Google Maps URL to your location" />
                {errors.googleMapsLink && <span className={styles.fieldError}>{errors.googleMapsLink}</span>}
              </div>
            </div>
          )}

          {/* Step 3: Availability & Legal */}
          {step === 3 && (
            <div className={styles.step}>
              <h2>Availability & Legal</h2>
              
              <div className={styles.field}>
                <label>Days Available * (Select at least one)</label>
                <div className={styles.checkboxGrid}>
                  {days.map(day => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={data.daysAvailable.includes(day)}
                             onChange={() => toggleArray('daysAvailable', day)} />
                      {day.slice(0, 3)}
                    </label>
                  ))}
                </div>
                {errors.daysAvailable && <span className={styles.fieldError}>{errors.daysAvailable}</span>}
              </div>

              <div className={styles.field}>
                <label>Time Slot *</label>
                <input name="timeSlot" value={data.timeSlot} onChange={handleChange}
                       className={`${styles.input} ${errors.timeSlot ? styles.inputError : ''}`}
                       placeholder="e.g., 9:00 AM - 5:00 PM" />
                {errors.timeSlot && <span className={styles.fieldError}>{errors.timeSlot}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="emergencyServiceAvailable" checked={data.emergencyServiceAvailable} onChange={handleChange} />
                  Emergency Service Available
                </label>
              </div>

              <div className={styles.field}>
                <label>Business Registration Number <small>(Optional - PV12345, HS12345, etc.)</small></label>
                <input name="businessRegistrationNumber" value={data.businessRegistrationNumber} onChange={handleChange}
                       className={`${styles.input} ${errors.businessRegistrationNumber ? styles.inputError : ''}`}
                       placeholder="Business registration number" />
                {errors.businessRegistrationNumber && <span className={styles.fieldError}>{errors.businessRegistrationNumber}</span>}
              </div>

              <div className={styles.field}>
                <label>Licenses & Certificates URL <small>(Optional)</small></label>
                <input type="url" name="licensesCertificates" value={data.licensesCertificates} onChange={handleChange}
                       className={`${styles.input} ${errors.licensesCertificates ? styles.inputError : ''}`}
                       placeholder="Document URL" />
                {errors.licensesCertificates && <span className={styles.fieldError}>{errors.licensesCertificates}</span>}
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
                {loading ? 'Registering...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousekeepingForm;