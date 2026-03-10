'use client';

import React, { useState } from 'react';
import styles from './taxi.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
  fullName: string;
  drivingLicenseCardNumber: string;
  contactNumber: string;
  emailAddress: string;
  alternatePhone: string;
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  yearsOfExperience: string;
  vehicleMakeModel: string;
  vehicleType: string;
  vehicleRegistrationNumber: string;
  seatingCapacity: string;
  hasAirConditioning: boolean;
  hasLuggageSpace: boolean;
  serviceCity: string;
  availableDays: string[];
  availableTimeSlot: string;
  is24x7Available: boolean;
}

const TaxiDriverForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<FormData>({
    fullName: '', drivingLicenseCardNumber: '', contactNumber: '', emailAddress: '', alternatePhone: '',
    drivingLicenseNumber: '', licenseExpiryDate: '', yearsOfExperience: '', vehicleMakeModel: '',
    vehicleType: '', vehicleRegistrationNumber: '', seatingCapacity: '', hasAirConditioning: false,
    hasLuggageSpace: false, serviceCity: '', availableDays: [], availableTimeSlot: '', is24x7Available: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const vehicleTypes = ['Sedan', 'Mini', 'SUV', 'Van', 'Rickshaw', 'Luxury'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // ✅ ULTRA-SHORT VALIDATION
  const validate = () => {
    const e: {[key: string]: string} = {};
    
    // Required fields
    if (!data.fullName.trim()) e.fullName = "Name required";
    if (!data.emailAddress.trim()) e.emailAddress = "Email required";
    if (!data.drivingLicenseNumber.trim()) e.drivingLicenseNumber = "License number required";
    if (!data.vehicleMakeModel.trim()) e.vehicleMakeModel = "Vehicle model required";
    if (!data.vehicleType) e.vehicleType = "Vehicle type required";
    if (!data.vehicleRegistrationNumber.trim()) e.vehicleRegistrationNumber = "Registration required";
    if (!data.seatingCapacity.trim()) e.seatingCapacity = "Capacity required";
    if (!data.serviceCity.trim()) e.serviceCity = "City required";
    if (!data.availableDays.length) e.availableDays = "Select days";
    if (!data.availableTimeSlot.trim()) e.availableTimeSlot = "Time slot required";

    // ✅ License Card Number (Sri Lankan)
    if (!data.drivingLicenseCardNumber.trim()) {
      e.drivingLicenseCardNumber = "License card required";
    } else if (!/^(B[0-9]{7,8}|DL[0-9]{6,8}|[A-Z]{1,2}[0-9]{6,8})$/i.test(data.drivingLicenseCardNumber)) {
      e.drivingLicenseCardNumber = "Invalid format (B1234567, DL123456)";
    }

    // ✅ Phone Numbers (Sri Lankan 10-digit)
    const phoneValid = (phone: string) => {
      const p = phone.replace(/\D/g, '');
      return p.length === 10 && /^(07[0-9]{8}|0[1-9][0-9]{8})$/.test(p);
    };

    if (!data.contactNumber.trim()) {
      e.contactNumber = "Phone required";
    } else if (!phoneValid(data.contactNumber)) {
      e.contactNumber = "Invalid Sri Lankan phone (10 digits)";
    }

    if (data.alternatePhone && !phoneValid(data.alternatePhone)) {
      e.alternatePhone = "Invalid alternate phone";
    }

    // ✅ DLN (Sri Lankan)
    if (data.drivingLicenseNumber && !/^([A-Z]{1,3}[0-9]{6,8}|[0-9]{8,10})$/i.test(data.drivingLicenseNumber)) {
      e.drivingLicenseNumber = "Invalid Sri Lankan DLN";
    }

    // Quick validations
    if (data.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress)) e.emailAddress = "Invalid email";
    if (data.licenseExpiryDate && new Date(data.licenseExpiryDate) <= new Date()) e.licenseExpiryDate = "License expired";
    if (data.yearsOfExperience && (isNaN(+data.yearsOfExperience) || +data.yearsOfExperience < 0)) e.yearsOfExperience = "Invalid experience";
    if (data.seatingCapacity && (isNaN(+data.seatingCapacity) || +data.seatingCapacity < 1)) e.seatingCapacity = "Invalid capacity";

    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    setData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleDay = (day: string) => {
    if (errors.availableDays) setErrors(prev => ({ ...prev, availableDays: "" }));
    setData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day) 
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const next = () => {
    const errs = validate();
    const stepFields = {
      1: ['fullName', 'drivingLicenseCardNumber', 'contactNumber', 'emailAddress', 'alternatePhone'],
      2: ['drivingLicenseNumber', 'licenseExpiryDate', 'yearsOfExperience', 'vehicleMakeModel', 'vehicleType', 'vehicleRegistrationNumber', 'seatingCapacity']
    };
    
    const currentErrs = Object.keys(errs).filter(k => stepFields[step as keyof typeof stepFields]?.includes(k));
    
    if (currentErrs.length === 0) {
      setStep(s => Math.min(s + 1, 3));
      setMessage('');
    } else {
      const filtered: {[key: string]: string} = {};
      currentErrs.forEach(k => filtered[k] = errs[k]);
      setErrors(filtered);
      setMessage('Fix errors');
    }
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setMessage('Fix all errors');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:2000/api/taxi/addTaxiDriver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setSuccess(true);
      else setMessage('Registration failed');
    } catch {
      setMessage('Server error');
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
      fullName: '', drivingLicenseCardNumber: '', contactNumber: '', emailAddress: '', alternatePhone: '',
      drivingLicenseNumber: '', licenseExpiryDate: '', yearsOfExperience: '', vehicleMakeModel: '',
      vehicleType: '', vehicleRegistrationNumber: '', seatingCapacity: '', hasAirConditioning: false,
      hasLuggageSpace: false, serviceCity: '', availableDays: [], availableTimeSlot: '', is24x7Available: false
    });
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Taxi Driver Registered!</h1>
          <p><strong>{data.fullName}</strong> registered successfully.</p>
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
                <span className={styles.stepNumber}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Taxi Driver Registration</h1>
        {message && <div className={`${styles.message} ${message.includes('error') || message.includes('failed') ? styles.error : styles.warning}`}>{message}</div>}

        <div className={styles.form}>
          {/* Step 1 */}
          {step === 1 && (
            <div className={styles.step}>
              <h2>Personal Information</h2>
              
              <div className={styles.field}>
                <label>Full Name *</label>
                <input name="fullName" value={data.fullName} onChange={handleChange} 
                       className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`} 
                       placeholder="Your full name" />
                {errors.fullName && <span className={styles.fieldError}>{errors.fullName}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>License Card Number * <small>(B1234567, DL123456)</small></label>
                  <input name="drivingLicenseCardNumber" value={data.drivingLicenseCardNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.drivingLicenseCardNumber ? styles.inputError : ''}`}
                         placeholder="B1234567" />
                  {errors.drivingLicenseCardNumber && <span className={styles.fieldError}>{errors.drivingLicenseCardNumber}</span>}
                </div>
                <div className={styles.field}>
                  <label>Contact Number * <small>(10 digits)</small></label>
                  <input name="contactNumber" value={data.contactNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.contactNumber ? styles.inputError : ''}`}
                         placeholder="0771234567" />
                  {errors.contactNumber && <span className={styles.fieldError}>{errors.contactNumber}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label>Email *</label>
                <input type="email" name="emailAddress" value={data.emailAddress} onChange={handleChange}
                       className={`${styles.input} ${errors.emailAddress ? styles.inputError : ''}`}
                       placeholder="your@email.com" />
                {errors.emailAddress && <span className={styles.fieldError}>{errors.emailAddress}</span>}
              </div>

              <div className={styles.field}>
                <label>Alternate Phone <small>(Optional, 10 digits)</small></label>
                <input name="alternatePhone" value={data.alternatePhone} onChange={handleChange}
                       className={`${styles.input} ${errors.alternatePhone ? styles.inputError : ''}`}
                       placeholder="0112345678" />
                {errors.alternatePhone && <span className={styles.fieldError}>{errors.alternatePhone}</span>}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className={styles.step}>
              <h2>Vehicle & License</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Driving License Number * <small>(Sri Lankan DLN)</small></label>
                  <input name="drivingLicenseNumber" value={data.drivingLicenseNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.drivingLicenseNumber ? styles.inputError : ''}`}
                         placeholder="DL12345678" />
                  {errors.drivingLicenseNumber && <span className={styles.fieldError}>{errors.drivingLicenseNumber}</span>}
                </div>
                <div className={styles.field}>
                  <label>License Expiry</label>
                  <input type="date" name="licenseExpiryDate" value={data.licenseExpiryDate} onChange={handleChange}
                         className={`${styles.input} ${errors.licenseExpiryDate ? styles.inputError : ''}`} />
                  {errors.licenseExpiryDate && <span className={styles.fieldError}>{errors.licenseExpiryDate}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Vehicle Make & Model *</label>
                  <input name="vehicleMakeModel" value={data.vehicleMakeModel} onChange={handleChange}
                         className={`${styles.input} ${errors.vehicleMakeModel ? styles.inputError : ''}`}
                         placeholder="Toyota Corolla" />
                  {errors.vehicleMakeModel && <span className={styles.fieldError}>{errors.vehicleMakeModel}</span>}
                </div>
                <div className={styles.field}>
                  <label>Vehicle Type *</label>
                  <select name="vehicleType" value={data.vehicleType} onChange={handleChange}
                          className={`${styles.select} ${errors.vehicleType ? styles.inputError : ''}`}>
                    <option value="">Select Type</option>
                    {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.vehicleType && <span className={styles.fieldError}>{errors.vehicleType}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Registration Number *</label>
                  <input name="vehicleRegistrationNumber" value={data.vehicleRegistrationNumber} onChange={handleChange}
                         className={`${styles.input} ${errors.vehicleRegistrationNumber ? styles.inputError : ''}`}
                         placeholder="ABC-1234" />
                  {errors.vehicleRegistrationNumber && <span className={styles.fieldError}>{errors.vehicleRegistrationNumber}</span>}
                </div>
                <div className={styles.field}>
                  <label>Seating Capacity *</label>
                  <input type="number" name="seatingCapacity" value={data.seatingCapacity} onChange={handleChange}
                         className={`${styles.input} ${errors.seatingCapacity ? styles.inputError : ''}`}
                         placeholder="4" />
                  {errors.seatingCapacity && <span className={styles.fieldError}>{errors.seatingCapacity}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="hasAirConditioning" checked={data.hasAirConditioning} onChange={handleChange} />
                  Air Conditioning
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="hasLuggageSpace" checked={data.hasLuggageSpace} onChange={handleChange} />
                  Luggage Space
                </label>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className={styles.step}>
              <h2>Service Details</h2>
              
              <div className={styles.field}>
                <label>Service City *</label>
                <input name="serviceCity" value={data.serviceCity} onChange={handleChange}
                       className={`${styles.input} ${errors.serviceCity ? styles.inputError : ''}`}
                       placeholder="Colombo" />
                {errors.serviceCity && <span className={styles.fieldError}>{errors.serviceCity}</span>}
              </div>

              <div className={styles.field}>
                <label>Available Days *</label>
                <div className={styles.checkboxGrid}>
                  {days.map(day => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={data.availableDays.includes(day)} 
                             onChange={() => toggleDay(day)} />
                      {day.slice(0, 3)}
                    </label>
                  ))}
                </div>
                {errors.availableDays && <span className={styles.fieldError}>{errors.availableDays}</span>}
              </div>

              <div className={styles.field}>
                <label>Available Time Slot *</label>
                <input name="availableTimeSlot" value={data.availableTimeSlot} onChange={handleChange}
                       className={`${styles.input} ${errors.availableTimeSlot ? styles.inputError : ''}`}
                       placeholder="9:00 AM - 6:00 PM" />
                {errors.availableTimeSlot && <span className={styles.fieldError}>{errors.availableTimeSlot}</span>}
              </div>

              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="is24x7Available" checked={data.is24x7Available} onChange={handleChange} />
                Available 24/7
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.buttonContainer}>
            {step > 1 && <button onClick={() => setStep(step - 1)} className={styles.prevButton}>Previous</button>}
            {step < 3 ? (
              <button onClick={next} className={styles.nextButton}>Next</button>
            ) : (
              <button onClick={submit} disabled={loading} className={styles.submitButton}>
                {loading ? 'Submitting...' : 'Register Driver'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxiDriverForm;