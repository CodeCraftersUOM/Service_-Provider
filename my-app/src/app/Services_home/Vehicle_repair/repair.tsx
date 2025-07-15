'use client';

import React, { useState } from 'react';
import styles from './repair.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
  businessName: string;
  ownerFullName: string;
  businessPhoneNumber: string;
  businessEmailAddress: string;
  businessWebsite: string;
  businessDescription: string;
  locationAddress: string;
  googleMapsLink: string;
  servicesOffered: string[];
  workingHours: { daysOpen: string[]; openingTime: string; closingTime: string; };
  businessRegistrationNumber: string;
  licenseDocumentUrl: string;
  termsAgreed: boolean;
}

const VehicleRepairForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<FormData>({
    businessName: '', ownerFullName: '', businessPhoneNumber: '', businessEmailAddress: '',
    businessWebsite: '', businessDescription: '', locationAddress: '', googleMapsLink: '',
    servicesOffered: [], workingHours: { daysOpen: [], openingTime: '', closingTime: '' },
    businessRegistrationNumber: '', licenseDocumentUrl: '', termsAgreed: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const services = [
    'Engine Repair', 'Brake Service', 'Transmission Repair', 'Oil Change', 'Tire Service',
    'Battery Service', 'Air Conditioning', 'Electrical Repair', 'Body Work', 'Paint Service',
    'Windshield Repair', 'Suspension Repair', 'Exhaust Service', 'Diagnostic Service', 'Towing Service'
  ];

  // ✅ CONSOLIDATED VALIDATION with Sri Lankan requirements
  const validate = (): {[key: string]: string} => {
    const e: {[key: string]: string} = {};
    
    // Required fields
    if (!data.businessName.trim()) e.businessName = "Business name required";
    if (!data.ownerFullName.trim()) e.ownerFullName = "Owner name required";
    if (!data.businessEmailAddress.trim()) e.businessEmailAddress = "Email required";
    if (!data.businessDescription.trim()) e.businessDescription = "Description required";
    if (!data.locationAddress.trim()) e.locationAddress = "Address required";
    if (!data.servicesOffered.length) e.servicesOffered = "Select at least one service";
    if (!data.workingHours.daysOpen.length) e.workingDays = "Select at least one day";
    if (!data.workingHours.openingTime) e.openingTime = "Opening time required";
    if (!data.workingHours.closingTime) e.closingTime = "Closing time required";
    if (!data.termsAgreed) e.termsAgreed = "Must agree to terms";

    // ✅ Sri Lankan phone validation (10 digits, specific patterns)
    if (!data.businessPhoneNumber.trim()) {
      e.businessPhoneNumber = "Phone number required";
    } else {
      const phone = data.businessPhoneNumber.replace(/\D/g, '');
      if (phone.length !== 10) {
        e.businessPhoneNumber = "Must be exactly 10 digits";
      } else if (!/^(07[0-9]{8}|0[1-9][0-9]{8})$/.test(phone)) {
        e.businessPhoneNumber = "Invalid Sri Lankan phone (07XXXXXXXX for mobile, 0XXXXXXXXX for landline)";
      }
    }

    // Email validation
    if (data.businessEmailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmailAddress)) {
      e.businessEmailAddress = "Invalid email format";
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

    // Optional validations
    if (data.businessWebsite && data.businessWebsite.trim()) {
      try { new URL(data.businessWebsite); } catch { e.businessWebsite = "Invalid website URL"; }
    }

    if (data.businessDescription && (data.businessDescription.length < 10 || data.businessDescription.length > 1000)) {
      e.businessDescription = "Description: 10-1000 characters";
    }

    if (data.locationAddress && (data.locationAddress.length < 10 || data.locationAddress.length > 200)) {
      e.locationAddress = "Address: 10-200 characters";
    }

    // Time validation
    if (data.workingHours.openingTime && data.workingHours.closingTime) {
      const open = new Date(`1970-01-01T${data.workingHours.openingTime}`);
      const close = new Date(`1970-01-01T${data.workingHours.closingTime}`);
      if (close <= open) e.closingTime = "Closing time must be after opening time";
    }

    // ✅ Sri Lankan business registration (optional)
    if (data.businessRegistrationNumber.trim()) {
      const reg = data.businessRegistrationNumber.trim().toUpperCase();
      if (!/^(PV|HS|SP|PQ)[0-9]+$|^[0-9]+$/.test(reg)) {
        e.businessRegistrationNumber = "Invalid Sri Lankan business registration (use PV12345, HS12345, SP12345, PQ12345, or numeric format)";
      }
    }

    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    
    if (name.startsWith('workingHours.')) {
      const key = name.split('.')[1];
      setData(prev => ({ ...prev, workingHours: { ...prev.workingHours, [key]: value } }));
    } else {
      setData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const toggleArray = (field: 'servicesOffered' | 'daysOpen', value: string) => {
    const errorField = field === 'daysOpen' ? 'workingDays' : field;
    if (errors[errorField]) setErrors(prev => ({ ...prev, [errorField]: "" }));

    if (field === 'daysOpen') {
      setData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          daysOpen: prev.workingHours.daysOpen.includes(value)
            ? prev.workingHours.daysOpen.filter(d => d !== value)
            : [...prev.workingHours.daysOpen, value]
        }
      }));
    } else {
      setData(prev => ({
        ...prev,
        servicesOffered: prev.servicesOffered.includes(value)
          ? prev.servicesOffered.filter(s => s !== value)
          : [...prev.servicesOffered, value]
      }));
    }
  };

  const next = () => {
    const stepErrors = validate();
    const stepFields = {
      1: ['businessName', 'ownerFullName', 'businessPhoneNumber', 'businessEmailAddress', 'businessWebsite', 'businessDescription'],
      2: ['locationAddress', 'googleMapsLink', 'servicesOffered']
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
      setMessage('Fix errors below.');
    }
  };

  const submit = async () => {
    const allErrors = validate();
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setMessage('Fix all errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:2000/api/addRepair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSuccess(true);
      } else {
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
      businessName: '', ownerFullName: '', businessPhoneNumber: '', businessEmailAddress: '',
      businessWebsite: '', businessDescription: '', locationAddress: '', googleMapsLink: '',
      servicesOffered: [], workingHours: { daysOpen: [], openingTime: '', closingTime: '' },
      businessRegistrationNumber: '', licenseDocumentUrl: '', termsAgreed: false
    });
  };

  const Field = ({ name, label, type = 'text', required = false, placeholder = '', rows = 0 }: any) => (
    <div className={styles.field}>
      <label className={styles.label}>
        {label} {required && '*'}
        {name.includes('Phone') && <span style={{fontSize: '0.8em', color: '#666'}}> (0*********)</span>}
        {name === 'googleMapsLink' && <span style={{fontSize: '0.8em', color: '#666'}}> (Google Maps only)</span>}
        {name === 'businessRegistrationNumber' && <span style={{fontSize: '0.8em', color: '#666'}}> (PV12345, etc.)</span>}
      </label>
      {rows > 0 ? (
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
          <h1 className={styles.successTitle}>Vehicle Repair Business Registered!</h1>
          <p className={styles.successMessage}>
            <strong>{data.businessName}</strong> has been registered successfully.
          </p>
          <div className={styles.successDetails}>
            <p><strong>Owner:</strong> {data.ownerFullName}</p>
            <p><strong>Phone:</strong> {data.businessPhoneNumber}</p>
            <p><strong>Services:</strong> {data.servicesOffered.length} selected</p>
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
                <div className={styles.stepLabel}>
                  {s === 1 ? 'Business' : s === 2 ? 'Location' : 'Schedule'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Vehicle Repair Registration</h1>
        {message && <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.warning}`}>{message}</div>}

        <div className={styles.form}>
          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Business Information</h2>
              <div className={styles.row}>
                <Field name="businessName" label="Business Name" required placeholder="Your repair shop name" />
                <Field name="ownerFullName" label="Owner Name" required placeholder="Full name of owner" />
              </div>
              <div className={styles.row}>
                <Field name="businessPhoneNumber" label="Phone Number" type="tel" required placeholder="Sri Lankan phone (0********* )" />
                <Field name="businessEmailAddress" label="Email" type="email" required placeholder="Business email address" />
              </div>
              <Field name="businessWebsite" label="Website (Optional)" type="url" placeholder="https://yourwebsite.com" />
              <Field name="businessDescription" label="Description" required rows={4} placeholder="Describe your services, experience, and specialties (10-1000 chars)" />
            </div>
          )}

          {/* Step 2: Location & Services */}
          {step === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Location & Services</h2>
              <Field name="locationAddress" label="Address" required placeholder="Full business address (10-200 chars)" />
              <Field name="googleMapsLink" label="Google Maps Link (Optional)" type="url" placeholder="Google Maps URL to your location" />
              
              <div className={styles.field}>
                <label className={styles.label}>Services Offered * (Select services you provide)</label>
                <div className={styles.checkboxGrid}>
                  {services.map(service => (
                    <label key={service} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={data.servicesOffered.includes(service)}
                             onChange={() => toggleArray('servicesOffered', service)} className={styles.checkbox} />
                      {service}
                    </label>
                  ))}
                </div>
                {errors.servicesOffered && <p className={styles.fieldError}>{errors.servicesOffered}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Schedule & Legal */}
          {step === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Schedule & Legal</h2>
              
              <div className={styles.field}>
                <label className={styles.label}>Working Days * (Select operating days)</label>
                <div className={styles.checkboxGrid}>
                  {days.map(day => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={data.workingHours.daysOpen.includes(day)}
                             onChange={() => toggleArray('daysOpen', day)} className={styles.checkbox} />
                      {day}
                    </label>
                  ))}
                </div>
                {errors.workingDays && <p className={styles.fieldError}>{errors.workingDays}</p>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Opening Time *</label>
                  <input type="time" name="workingHours.openingTime" value={data.workingHours.openingTime}
                         onChange={handleChange} className={`${styles.input} ${errors.openingTime ? styles.inputError : ''}`} />
                  {errors.openingTime && <p className={styles.fieldError}>{errors.openingTime}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Closing Time *</label>
                  <input type="time" name="workingHours.closingTime" value={data.workingHours.closingTime}
                         onChange={handleChange} className={`${styles.input} ${errors.closingTime ? styles.inputError : ''}`} />
                  {errors.closingTime && <p className={styles.fieldError}>{errors.closingTime}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <Field name="businessRegistrationNumber" label="Business Registration (Optional)" placeholder="Sri Lankan registration number" />
                <Field name="licenseDocumentUrl" label="License Document URL (Optional)" type="url" placeholder="License document link" />
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="termsAgreed" checked={data.termsAgreed} onChange={handleChange} className={styles.checkbox} />
                  <span>I agree to the Terms & Conditions and Privacy Policy *</span>
                </label>
                {errors.termsAgreed && <p className={styles.fieldError}>{errors.termsAgreed}</p>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.buttonContainer}>
            {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className={styles.prevButton}>Previous</button>}
            {step < 3 ? (
              <button type="button" onClick={next} className={styles.nextButton}>Next</button>
            ) : (
              <button type="button" onClick={submit} disabled={loading} className={styles.submitButton}>
                {loading ? 'Registering...' : 'Register Business'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleRepairForm;